const mongoose = require('mongoose');
const Holding = require('../models/Holding');
const Wallet = require('../models/Wallet');
const Transaction = require('../models/Transaction');
const asyncHandler = require('../utils/asyncHandler');
const { getStockBySymbol } = require('../services/priceEngine');

const getPortfolio = asyncHandler(async (req, res) => {
  const [wallet, holdings] = await Promise.all([
    Wallet.findOne({ user: req.user._id }),
    Holding.find({ user: req.user._id }).sort({ symbol: 1 }),
  ]);

  const enriched = holdings.map((holding) => {
    const stock = getStockBySymbol(holding.symbol);
    const currentPrice = stock?.price || holding.averageBuyPrice;
    const currentValue = currentPrice * holding.quantity;
    const cost = holding.averageBuyPrice * holding.quantity;
    return {
      ...holding.toObject(),
      currentPrice,
      currentValue,
      pnl: currentValue - cost,
      pnlPercent: cost === 0 ? 0 : ((currentValue - cost) / cost) * 100,
    };
  });

  const investedAmount = enriched.reduce((acc, h) => acc + h.currentValue, 0);
  const totalBalance = (wallet?.balance || 0) + investedAmount;

  res.json({
    wallet,
    holdings: enriched,
    summary: {
      totalBalance,
      investedAmount,
      cash: wallet?.balance || 0,
      profitLoss: enriched.reduce((acc, h) => acc + h.pnl, 0),
    },
  });
});

const placeOrder = asyncHandler(async (req, res) => {
  const { symbol, side, quantity, requestId } = req.body;
  if (!symbol || !side || !quantity || !requestId) {
    const err = new Error('symbol, side, quantity, requestId are required');
    err.statusCode = 400;
    throw err;
  }

  const normalizedSymbol = symbol.toUpperCase();
  const normalizedSide = side.toUpperCase();
  const qty = Number(quantity);
  if (!['BUY', 'SELL'].includes(normalizedSide) || qty <= 0) {
    const err = new Error('Invalid order payload');
    err.statusCode = 400;
    throw err;
  }

  const stock = getStockBySymbol(normalizedSymbol);
  if (!stock) {
    const err = new Error('Stock not found');
    err.statusCode = 404;
    throw err;
  }

  const lockedPrice = Number(stock.price.toFixed(2));
  const total = Number((lockedPrice * qty).toFixed(2));

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const existing = await Transaction.findOne({ user: req.user._id, requestId }).session(session);
    if (existing) {
      await session.abortTransaction();
      session.endSession();
      return res.status(200).json({ message: 'Duplicate request ignored', transaction: existing });
    }

    const wallet = await Wallet.findOne({ user: req.user._id }).session(session);
    if (!wallet) throw new Error('Wallet not found');

    let holding = await Holding.findOne({ user: req.user._id, symbol: normalizedSymbol }).session(session);

    if (normalizedSide === 'BUY') {
      if (wallet.balance < total) {
        const err = new Error('Insufficient balance');
        err.statusCode = 400;
        throw err;
      }

      wallet.balance = Number((wallet.balance - total).toFixed(2));

      if (!holding) {
        holding = await Holding.create(
          [{ user: req.user._id, symbol: normalizedSymbol, quantity: qty, averageBuyPrice: lockedPrice }],
          { session }
        );
        holding = holding[0];
      } else {
        const oldCost = holding.quantity * holding.averageBuyPrice;
        const newCost = qty * lockedPrice;
        const nextQty = holding.quantity + qty;
        holding.averageBuyPrice = Number(((oldCost + newCost) / nextQty).toFixed(2));
        holding.quantity = nextQty;
        await holding.save({ session });
      }
    } else {
      if (!holding || holding.quantity < qty) {
        const err = new Error('Cannot sell more than owned quantity');
        err.statusCode = 400;
        throw err;
      }

      holding.quantity -= qty;
      wallet.balance = Number((wallet.balance + total).toFixed(2));

      if (holding.quantity === 0) {
        await Holding.deleteOne({ _id: holding._id }).session(session);
      } else {
        await holding.save({ session });
      }
    }

    await wallet.save({ session });

    const [transaction] = await Transaction.create(
      [{ user: req.user._id, symbol: normalizedSymbol, type: normalizedSide, quantity: qty, price: lockedPrice, total, requestId }],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    req.app.get('io').to(req.user._id.toString()).emit('order:created', transaction);
    res.status(201).json({ transaction, lockedPrice });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
});

const getTransactions = asyncHandler(async (req, res) => {
  const list = await Transaction.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(100);
  res.json(list);
});

const leaderboard = asyncHandler(async (_req, res) => {
  const top = await Wallet.find().sort({ balance: -1 }).limit(10).populate('user', 'name');
  res.json(
    top.map((row) => ({
      user: row.user?.name || 'Anonymous',
      cash: row.balance,
    }))
  );
});

module.exports = { getPortfolio, placeOrder, getTransactions, leaderboard };
