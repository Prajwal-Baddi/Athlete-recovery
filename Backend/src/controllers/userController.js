const userService = require('../services/userService');
const { sendSuccess, sendPaginated } = require('../utils/apiResponse');
const { asyncHandler } = require('../utils/helpers');

const getMe = asyncHandler(async (req, res) => {
  const user = await userService.getMe(req.user._id);
  sendSuccess(res, 'Profile retrieved', { user });
});

const updateMe = asyncHandler(async (req, res) => {
  const user = await userService.updateMe(req.user._id, req.body);
  sendSuccess(res, 'Profile updated', { user });
});

const updateAvatar = asyncHandler(async (req, res) => {
  const user = await userService.updateAvatar(req.user._id, req.file);
  sendSuccess(res, 'Avatar updated', { user });
});

const getUsers = asyncHandler(async (req, res) => {
  const { users, pagination } = await userService.getUsers(req.query);
  sendPaginated(res, 'Users retrieved', users, pagination);
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  sendSuccess(res, 'User retrieved', { user });
});

const deactivateUser = asyncHandler(async (req, res) => {
  await userService.deactivateUser(req.params.id);
  sendSuccess(res, 'User deactivated');
});

module.exports = { getMe, updateMe, updateAvatar, getUsers, getUserById, deactivateUser };
