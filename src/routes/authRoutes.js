const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const {
  registerValidators,
  loginValidators,
  changePasswordValidators,
  validate,
} = require('../middleware/validators');

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', registerValidators, validate, authController.register);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login user and get tokens
 * @access  Public
 */
router.post('/login', loginValidators, validate, authController.login);

/**
 * @route   POST /api/v1/auth/refresh
 * @desc    Get new access token using refresh token
 * @access  Public
 */
router.post('/refresh', authController.refreshToken);

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Logout (invalidates refresh token)
 * @access  Private
 */
router.post('/logout', protect, authController.logout);

/**
 * @route   GET /api/v1/auth/me
 * @desc    Get current user from token
 * @access  Private
 */
router.get('/me', protect, authController.getMe);

/**
 * @route   PATCH /api/v1/auth/change-password
 * @desc    Change current user's password
 * @access  Private
 */
router.patch(
  '/change-password',
  protect,
  changePasswordValidators,
  validate,
  authController.changePassword
);

module.exports = router;
