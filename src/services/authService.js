const bcrypt = require('bcryptjs');
const User = require('../models/User');
const AthleteProfile = require('../models/AthleteProfile');
const { generateTokenPair, verifyRefreshToken, buildTokenPayload } = require('../utils/jwt');
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

/**
 * AuthService — handles all authentication business logic.
 * Controllers remain thin; all logic lives here.
 */

/**
 * Register a new user.
 * Creates User + AthleteProfile (if role = athlete) atomically.
 *
 * @returns {{ user, tokens }}
 */
const register = async ({ name, email, password, role }) => {
  const existing = await User.findOne({ email });
  if (existing) {
    throw AppError.conflict('An account with this email already exists');
  }

  const user = await User.create({ name, email, password, role });

  // Auto-create athlete profile skeleton so downstream modules have a target
  if (role === 'athlete') {
    await AthleteProfile.create({ userId: user._id });
  }

  const payload = buildTokenPayload(user);
  const tokens  = generateTokenPair(payload);

  // Persist hashed refresh token
  user.refreshToken = await bcrypt.hash(tokens.refreshToken, 10);
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  logger.info(`New user registered: ${user.email} (${role})`);

  return { user: user.toSafeObject(), tokens };
};

/**
 * Login an existing user.
 *
 * @returns {{ user, tokens }}
 */
const login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password +refreshToken');
  if (!user) {
    // Use generic message to prevent email enumeration
    throw AppError.unauthorized('Invalid email or password');
  }
  if (!user.isActive) {
    throw AppError.unauthorized('Your account has been deactivated. Please contact support.');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw AppError.unauthorized('Invalid email or password');
  }

  const payload = buildTokenPayload(user);
  const tokens  = generateTokenPair(payload);

  user.refreshToken = await bcrypt.hash(tokens.refreshToken, 10);
  user.lastLogin    = new Date();
  await user.save({ validateBeforeSave: false });

  logger.info(`User logged in: ${user.email}`);

  return { user: user.toSafeObject(), tokens };
};

/**
 * Refresh access token using a valid refresh token.
 *
 * @returns {{ accessToken, refreshToken }}
 */
const refreshTokens = async (incomingRefreshToken) => {
  if (!incomingRefreshToken) {
    throw AppError.unauthorized('Refresh token is required');
  }

  const decoded = verifyRefreshToken(incomingRefreshToken);

  const user = await User.findById(decoded.id).select('+refreshToken');
  if (!user || !user.refreshToken) {
    throw AppError.unauthorized('Invalid session. Please log in again.');
  }

  const isValid = await bcrypt.compare(incomingRefreshToken, user.refreshToken);
  if (!isValid) {
    // Possible token reuse attack — invalidate all sessions
    user.refreshToken = undefined;
    await user.save({ validateBeforeSave: false });
    throw AppError.unauthorized('Refresh token reuse detected. Please log in again.');
  }

  const payload = buildTokenPayload(user);
  const tokens  = generateTokenPair(payload);

  user.refreshToken = await bcrypt.hash(tokens.refreshToken, 10);
  await user.save({ validateBeforeSave: false });

  return tokens;
};

/**
 * Logout — invalidates the stored refresh token.
 */
const logout = async (userId) => {
  await User.findByIdAndUpdate(userId, { $unset: { refreshToken: 1 } });
  logger.info(`User logged out: ${userId}`);
};

/**
 * Change password.
 */
const changePassword = async (userId, { currentPassword, newPassword }) => {
  const user = await User.findById(userId).select('+password');
  if (!user) throw AppError.notFound('User not found');

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) throw AppError.badRequest('Current password is incorrect');

  user.password = newPassword;
  // Invalidate all existing sessions
  user.refreshToken = undefined;
  await user.save();

  logger.info(`Password changed for user: ${userId}`);
};

module.exports = { register, login, refreshTokens, logout, changePassword };
