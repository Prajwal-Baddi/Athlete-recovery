const User = require('../models/User');
const { verifyAccessToken } = require('../utils/jwt');
const AppError = require('../utils/AppError');
const { asyncHandler } = require('../utils/helpers');

/**
 * protect — verifies the JWT access token from the
 * Authorization: Bearer <token> header.
 * Attaches `req.user` on success.
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    throw AppError.unauthorized('No token provided. Please log in.');
  }

  // Throws if invalid/expired
  const decoded = verifyAccessToken(token);

  // Confirm user still exists and is active
  const user = await User.findById(decoded.id).select('-password -refreshToken');
  if (!user) {
    throw AppError.unauthorized('The user associated with this token no longer exists.');
  }
  if (!user.isActive) {
    throw AppError.unauthorized('Your account has been deactivated. Please contact support.');
  }

  req.user = user;
  next();
});

/**
 * authorize — restricts a route to specific roles.
 *
 * Usage: authorize('coach', 'physiotherapist')
 */
const authorize = (...roles) => (req, res, next) => {
  if (!req.user) {
    return next(AppError.unauthorized('Not authenticated'));
  }
  if (!roles.includes(req.user.role)) {
    return next(
      AppError.forbidden(
        `Access denied. Required role: ${roles.join(' or ')}. Your role: ${req.user.role}`
      )
    );
  }
  next();
};

/**
 * optionalAuth — attaches req.user if a valid token is
 * present, but does NOT fail if there's no token.
 * Useful for public endpoints that behave differently for auth'd users.
 */
const optionalAuth = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }
  try {
    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);
    const user = await User.findById(decoded.id).select('-password -refreshToken');
    if (user && user.isActive) {
      req.user = user;
    }
  } catch {
    // Silently ignore invalid tokens for optional auth
  }
  next();
});

module.exports = { protect, authorize, optionalAuth };
