const AppError = require('../utils/AppError');
const logger   = require('../utils/logger');

// ─── Cast/Mongo specific error converters ────────────────────────────────────

const handleCastError = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateKeyError = (err) => {
  const field = Object.keys(err.keyValue)[0];
  const value = err.keyValue[field];
  const message = `${field.charAt(0).toUpperCase() + field.slice(1)} '${value}' is already in use.`;
  return new AppError(message, 409);
};

const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map((e) => ({
    field:   e.path,
    message: e.message,
  }));
  return new AppError('Validation failed', 422, errors);
};

const handleJWTError = () => AppError.unauthorized('Invalid token. Please log in again.');
const handleJWTExpiredError = () => AppError.unauthorized('Your session has expired. Please log in again.');

// ─── Response senders ────────────────────────────────────────────────────────

const sendDevError = (err, res) => {
  res.status(err.statusCode || 500).json({
    success:   false,
    message:   err.message,
    errors:    err.errors || undefined,
    stack:     err.stack,
  });
};

const sendProdError = (err, res) => {
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors:  err.errors || undefined,
    });
  }
  // Non-operational: don't leak error details
  logger.error('UNEXPECTED ERROR:', err);
  res.status(500).json({
    success: false,
    message: 'Something went wrong. Please try again later.',
  });
};

// ─── Global error middleware ─────────────────────────────────────────────────

const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;

  if (process.env.NODE_ENV === 'development') {
    logger.error(`${req.method} ${req.originalUrl} — ${err.message}`);
    return sendDevError(err, res);
  }

  let error = { ...err, message: err.message, stack: err.stack };

  if (err.name === 'CastError')            error = handleCastError(error);
  if (err.code === 11000)                  error = handleDuplicateKeyError(error);
  if (err.name === 'ValidationError')      error = handleValidationError(error);
  if (err.name === 'JsonWebTokenError')    error = handleJWTError();
  if (err.name === 'TokenExpiredError')    error = handleJWTExpiredError();

  sendProdError(error, res);
};

// 404 handler — must be mounted after all routes
const notFoundHandler = (req, res, next) => {
  next(AppError.notFound(`Route ${req.method} ${req.originalUrl} not found`));
};

module.exports = { globalErrorHandler, notFoundHandler };
