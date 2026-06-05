/**
 * AppError — operational error with HTTP status code.
 * Thrown intentionally by services/controllers when
 * a known failure condition is encountered.
 *
 * The global error handler distinguishes AppError
 * (isOperational = true) from unexpected crashes.
 */
class AppError extends Error {
  /**
   * @param {string} message  - Human-readable error message
   * @param {number} statusCode - HTTP status code
   * @param {Array}  errors   - Optional validation error details
   */
  constructor(message, statusCode = 500, errors = null) {
    super(message);
    this.statusCode = statusCode;
    this.errors     = errors;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Convenience factories for common HTTP errors
AppError.badRequest       = (msg, errors) => new AppError(msg || 'Bad request', 400, errors);
AppError.unauthorized     = (msg) => new AppError(msg || 'Unauthorized', 401);
AppError.forbidden        = (msg) => new AppError(msg || 'Forbidden', 403);
AppError.notFound         = (msg) => new AppError(msg || 'Resource not found', 404);
AppError.conflict         = (msg) => new AppError(msg || 'Conflict', 409);
AppError.unprocessable    = (msg) => new AppError(msg || 'Unprocessable entity', 422);
AppError.tooManyRequests  = (msg) => new AppError(msg || 'Too many requests', 429);
AppError.internal         = (msg) => new AppError(msg || 'Internal server error', 500);

module.exports = AppError;
