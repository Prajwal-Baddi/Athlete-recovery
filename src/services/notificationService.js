const Notification = require('../models/Notification');
const AppError = require('../utils/AppError');
const { getPaginationParams, buildPaginationMeta } = require('../utils/helpers');

/**
 * NotificationService — manages notification creation and delivery.
 * Integrates with Socket.IO for real-time push.
 *
 * NOTE: getIO() is called lazily to avoid circular import issues
 * between socketManager and this service.
 */

/**
 * Create and optionally push a notification via Socket.IO.
 *
 * @param {Object} data - Notification fields
 * @param {Object} [options]
 * @param {boolean} [options.push=true] - Whether to push via socket
 * @returns {Notification}
 */
const createNotification = async (data, { push = true } = {}) => {
  const notification = await Notification.create(data);

  if (push) {
    try {
      const { getIO } = require('../socket/socketManager');
      const io = getIO();
      io.to(`user:${data.recipientId}`).emit('notification:new', notification);
    } catch {
      // Socket not available — notification is still persisted
    }
  }

  return notification;
};

/**
 * Bulk-create notifications for multiple recipients.
 */
const broadcastNotification = async (recipientIds, baseData, options = {}) => {
  const notifications = recipientIds.map((id) => ({ ...baseData, recipientId: id }));
  const created = await Notification.insertMany(notifications);

  if (options.push !== false) {
    try {
      const { getIO } = require('../socket/socketManager');
      const io = getIO();
      created.forEach((n) => {
        io.to(`user:${n.recipientId}`).emit('notification:new', n);
      });
    } catch {
      // Socket not available
    }
  }

  return created;
};

/**
 * Get paginated notifications for a user.
 */
const getUserNotifications = async (userId, queryParams) => {
  const { page, limit, skip } = getPaginationParams(queryParams);

  const filter = { recipientId: userId };
  if (queryParams.isRead !== undefined) filter.isRead = queryParams.isRead === 'true';
  if (queryParams.type)                 filter.type   = queryParams.type;

  const [notifications, total, unreadCount] = await Promise.all([
    Notification.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('senderId', 'name avatar'),
    Notification.countDocuments(filter),
    Notification.getUnreadCount(userId),
  ]);

  return {
    notifications,
    unreadCount,
    pagination: buildPaginationMeta(total, page, limit),
  };
};

/**
 * Mark a single notification as read.
 */
const markAsRead = async (notificationId, userId) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, recipientId: userId },
    { $set: { isRead: true, readAt: new Date() } },
    { new: true }
  );

  if (!notification) throw AppError.notFound('Notification not found');
  return notification;
};

/**
 * Mark all notifications for a user as read.
 */
const markAllAsRead = async (userId) => {
  const result = await Notification.markAllReadForUser(userId);

  // Emit badge reset to client
  try {
    const { getIO } = require('../socket/socketManager');
    const io = getIO();
    io.to(`user:${userId}`).emit('notification:allRead');
  } catch {
    // Socket not available
  }

  return result;
};

/**
 * Delete a notification (by owner).
 */
const deleteNotification = async (notificationId, userId) => {
  const notification = await Notification.findOneAndDelete({
    _id: notificationId,
    recipientId: userId,
  });
  if (!notification) throw AppError.notFound('Notification not found');
  return notification;
};

module.exports = {
  createNotification,
  broadcastNotification,
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
};
