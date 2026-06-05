const User = require('../models/User');
const AthleteProfile = require('../models/AthleteProfile');
const { deleteFromCloudinary } = require('../config/cloudinary');
const AppError = require('../utils/AppError');
const { getPaginationParams, buildPaginationMeta, buildSortOptions } = require('../utils/helpers');

/**
 * UserService — user management business logic.
 */

/**
 * Get own profile (safe).
 */
const getMe = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw AppError.notFound('User not found');
  return user;
};

/**
 * Update own profile fields (non-sensitive).
 */
const updateMe = async (userId, updates) => {
  const allowedFields = ['name'];
  const sanitized = {};
  allowedFields.forEach((f) => {
    if (updates[f] !== undefined) sanitized[f] = updates[f];
  });

  const user = await User.findByIdAndUpdate(userId, sanitized, {
    new: true,
    runValidators: true,
  });
  if (!user) throw AppError.notFound('User not found');
  return user;
};

/**
 * Update avatar — replaces old Cloudinary image.
 */
const updateAvatar = async (userId, file) => {
  if (!file) throw AppError.badRequest('No file uploaded');

  const user = await User.findById(userId);
  if (!user) throw AppError.notFound('User not found');

  // Delete old avatar from Cloudinary
  if (user.avatar?.publicId) {
    await deleteFromCloudinary(user.avatar.publicId);
  }

  user.avatar = {
    url:      file.path,       // Cloudinary URL
    publicId: file.filename,   // Cloudinary public_id
  };
  await user.save({ validateBeforeSave: false });
  return user;
};

/**
 * Get a paginated list of users (admin / coach / physio use).
 * Supports filtering by role.
 */
const getUsers = async (queryParams) => {
  const { page, limit, skip } = getPaginationParams(queryParams);
  const sort = buildSortOptions(queryParams.sort);

  const filter = {};
  if (queryParams.role) filter.role = queryParams.role;
  if (queryParams.isActive !== undefined) filter.isActive = queryParams.isActive === 'true';

  const [users, total] = await Promise.all([
    User.find(filter).sort(sort).skip(skip).limit(limit),
    User.countDocuments(filter),
  ]);

  return { users, pagination: buildPaginationMeta(total, page, limit) };
};

/**
 * Get a single user by ID.
 */
const getUserById = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw AppError.notFound('User not found');
  return user;
};

/**
 * Deactivate a user account.
 */
const deactivateUser = async (userId) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { isActive: false, refreshToken: undefined },
    { new: true }
  );
  if (!user) throw AppError.notFound('User not found');
  return user;
};

module.exports = { getMe, updateMe, updateAvatar, getUsers, getUserById, deactivateUser };
