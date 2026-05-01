const asyncHandler = require('../utils/asyncHandler');
const { getMarketSnapshot, getStockBySymbol } = require('../services/priceEngine');

const listStocks = asyncHandler(async (_req, res) => {
  res.json(getMarketSnapshot());
});

const getStockDetail = asyncHandler(async (req, res) => {
  const stock = getStockBySymbol(req.params.symbol);
  if (!stock) {
    const err = new Error('Stock not found');
    err.statusCode = 404;
    throw err;
  }
  res.json(stock);
});

module.exports = { listStocks, getStockDetail };
