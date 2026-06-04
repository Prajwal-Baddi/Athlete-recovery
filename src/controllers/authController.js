const authService = require('../services/authService');
const { sendSuccess, sendCreated, sendError } = require('../utils/apiResponse');
const { asyncHandler } = require('../utils/helpers');

/**
 * Auth Controller — thin layer. All logic in authService.
 */

const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  const { user, tokens } = await authService.register({ name, email, password, role });

  sendCreated(res, 'Account created successfully', { user, tokens });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { user, tokens } = await authService.login({ email, password });

  sendSuccess(res, 'Logged in successfully', { user, tokens });
});

const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken: token } = req.body;
  const tokens = await authService.refreshTokens(token);

  sendSuccess(res, 'Tokens refreshed', { tokens });
});

const logout = asyncHandler(async (req, res) => {
  await authService.logout(req.user._id);
  sendSuccess(res, 'Logged out successfully');
});

const changePassword = asyncHandler(async (req, res) => {
  await authService.changePassword(req.user._id, req.body);
  sendSuccess(res, 'Password changed successfully. Please log in again.');
});

const getMe = asyncHandler(async (req, res) => {
  sendSuccess(res, 'Profile retrieved', { user: req.user });
});

module.exports = { register, login, refreshToken, logout, changePassword, getMe };
