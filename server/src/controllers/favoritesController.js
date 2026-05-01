const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

const getFavorites = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('favorites');
  res.json(user?.favorites || []);
});

const addFavorite = asyncHandler(async (req, res) => {
  const { symbol } = req.body;
  if (!symbol) {
    const err = new Error('symbol is required');
    err.statusCode = 400;
    throw err;
  }

  const normalized = symbol.toUpperCase();
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $addToSet: { favorites: normalized } },
    { new: true }
  ).select('favorites');

  res.status(201).json(user.favorites);
});

const removeFavorite = asyncHandler(async (req, res) => {
  const symbol = req.params.id.toUpperCase();
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $pull: { favorites: symbol } },
    { new: true }
  ).select('favorites');

  res.json(user.favorites);
});

module.exports = { getFavorites, addFavorite, removeFavorite };
