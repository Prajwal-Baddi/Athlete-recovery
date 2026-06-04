const express = require('express');
const router = express.Router();

const notificationController = require('../controllers/notificationController');
const { protect } = require('../middleware/auth');
const { mongoIdParam, paginationValidators, validate } = require('../middleware/validators');

router.use(protect);

/**
 * @route   GET /api/v1/notifications
 * @desc    Get my notifications (paginated, filterable by isRead/type)
 * @access  Private (all roles)
 */
router.get('/', paginationValidators, validate, notificationController.getMyNotifications);

/**
 * @route   PATCH /api/v1/notifications/read-all
 * @desc    Mark all notifications as read
 * @access  Private (all roles)
 */
router.patch('/read-all', notificationController.markAllAsRead);

/**
 * @route   PATCH /api/v1/notifications/:id/read
 * @desc    Mark a single notification as read
 * @access  Private (all roles)
 */
router.patch('/:id/read', mongoIdParam('id'), validate, notificationController.markAsRead);

/**
 * @route   DELETE /api/v1/notifications/:id
 * @desc    Delete a notification
 * @access  Private (all roles)
 */
router.delete('/:id', mongoIdParam('id'), validate, notificationController.deleteNotification);

module.exports = router;
