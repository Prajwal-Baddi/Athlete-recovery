const notificationService = require('../services/notificationService');
const { sendSuccess, sendPaginated } = require('../utils/apiResponse');
const { asyncHandler } = require('../utils/helpers');

const getMyNotifications = asyncHandler(async (req, res) => {
  const result = await notificationService.getUserNotifications(req.user._id, req.query);
  res.status(200).json({
    success: true,
    message: 'Notifications retrieved',
    data: result.notifications,
    unreadCount: result.unreadCount,
    pagination: result.pagination,
  });
});

const markAsRead = asyncHandler(async (req, res) => {
  const notification = await notificationService.markAsRead(
    req.params.id,
    req.user._id
  );
  sendSuccess(res, 'Notification marked as read', { notification });
});

const markAllAsRead = asyncHandler(async (req, res) => {
  await notificationService.markAllAsRead(req.user._id);
  sendSuccess(res, 'All notifications marked as read');
});

const deleteNotification = asyncHandler(async (req, res) => {
  await notificationService.deleteNotification(req.params.id, req.user._id);
  sendSuccess(res, 'Notification deleted');
});

module.exports = { getMyNotifications, markAsRead, markAllAsRead, deleteNotification };
