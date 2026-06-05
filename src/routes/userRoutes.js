const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');
const { uploadAvatar } = require('../config/cloudinary');
const { mongoIdParam, paginationValidators, validate } = require('../middleware/validators');

// All routes require authentication
router.use(protect);

/**
 * @route   GET /api/v1/users/me
 * @desc    Get own user profile
 * @access  Private (all roles)
 */
router.get('/me', userController.getMe);

/**
 * @route   PATCH /api/v1/users/me
 * @desc    Update own profile (name only)
 * @access  Private (all roles)
 */
router.patch('/me', userController.updateMe);

/**
 * @route   PATCH /api/v1/users/me/avatar
 * @desc    Upload/replace profile avatar
 * @access  Private (all roles)
 */
router.patch('/me/avatar', uploadAvatar.single('avatar'), userController.updateAvatar);

/**
 * @route   GET /api/v1/users
 * @desc    List all users (with role filter)
 * @access  Private (coach, physiotherapist)
 */
router.get(
  '/',
  authorize('coach', 'physiotherapist'),
  paginationValidators,
  validate,
  userController.getUsers
);

/**
 * @route   GET /api/v1/users/:id
 * @desc    Get user by ID
 * @access  Private (coach, physiotherapist)
 */
router.get(
  '/:id',
  authorize('coach', 'physiotherapist'),
  mongoIdParam('id'),
  validate,
  userController.getUserById
);

/**
 * @route   PATCH /api/v1/users/:id/deactivate
 * @desc    Deactivate a user account
 * @access  Private (coach only — in production this would be admin)
 */
router.patch(
  '/:id/deactivate',
  authorize('coach'),
  mongoIdParam('id'),
  validate,
  userController.deactivateUser
);

module.exports = router;
