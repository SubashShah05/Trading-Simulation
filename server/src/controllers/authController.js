const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Wallet = require('../models/Wallet');
const asyncHandler = require('../utils/asyncHandler');
const { generateToken } = require('../utils/jwt');

const signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    const err = new Error('name, email and password are required');
    err.statusCode = 400;
    throw err;
  }

  const exists = await User.findOne({ email });
  if (exists) {
    const err = new Error('Email already in use');
    err.statusCode = 409;
    throw err;
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed, favorites: [] });
  await Wallet.create({ user: user._id });

  res.status(201).json({
    token: generateToken(user._id),
    user: { id: user._id, name: user.name, email: user.email },
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    const err = new Error('email and password are required');
    err.statusCode = 400;
    throw err;
  }

  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    const err = new Error('Invalid credentials');
    err.statusCode = 401;
    throw err;
  }

  res.json({
    token: generateToken(user._id),
    user: { id: user._id, name: user.name, email: user.email },
  });
});

const me = asyncHandler(async (req, res) => {
  res.json({ id: req.user._id, name: req.user.name, email: req.user.email, favorites: req.user.favorites });
});

module.exports = { signup, login, me };
