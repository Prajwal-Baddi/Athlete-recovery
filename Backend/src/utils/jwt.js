const jwt = require('jsonwebtoken');
const AppError = require('./AppError');

/**
 * Generate a short-lived access token (default 15m).
 */
const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  });
};

/**
 * Generate a long-lived refresh token (default 7d).
 */
const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  });
};

/**
 * Generate both tokens at once. Returns { accessToken, refreshToken }.
 */
const generateTokenPair = (payload) => ({
  accessToken:  generateAccessToken(payload),
  refreshToken: generateRefreshToken(payload),
});

/**
 * Verify an access token. Throws AppError on failure.
 */
const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw AppError.unauthorized('Access token expired');
    }
    throw AppError.unauthorized('Invalid access token');
  }
};

/**
 * Verify a refresh token. Throws AppError on failure.
 */
const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw AppError.unauthorized('Refresh token expired. Please log in again.');
    }
    throw AppError.unauthorized('Invalid refresh token');
  }
};

/**
 * Build the minimal JWT payload from a User document.
 * Keep payload small — no sensitive data.
 */
const buildTokenPayload = (user) => ({
  id:   user._id.toString(),
  role: user.role,
});

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  generateTokenPair,
  verifyAccessToken,
  verifyRefreshToken,
  buildTokenPayload,
};
