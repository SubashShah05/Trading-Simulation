const notFound = (_req, _res, next) => {
  const err = new Error('Route not found');
  err.statusCode = 404;
  next(err);
};

const errorHandler = (err, _req, res, _next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || 'Server error',
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
};

module.exports = { notFound, errorHandler };
