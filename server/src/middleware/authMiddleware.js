const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

const protect = asyncHandler(async (req, _res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    const err = new Error('Not authorized');
    err.statusCode = 401;
    throw err;
  }

  const token = auth.split(' ')[1];
  const payload = require('jsonwebtoken').verify(token, process.env.JWT_SECRET);
  const user = await User.findById(payload.userId).select('-password');

  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 401;
    throw err;
  }

  req.user = user;
  next();
});

module.exports = { protect };
