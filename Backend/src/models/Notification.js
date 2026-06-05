const mongoose = require('mongoose');

const NOTIFICATION_TYPES = [
  'readiness_alert',   // AI readiness score changed significantly
  'injury_update',     // Recovery plan updated by physio
  'recovery_update',   // Recovery milestone reached
  'ai_insight',        // AI generated new insight
  'report_ready',      // Report generated and ready
  'system',            // Platform / admin notifications
  'coach_alert',       // Coach flagged something
  'physio_message',    // Message from physiotherapist
];

const notificationSchema = new mongoose.Schema(
  {
    // Who receives this notification
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Recipient ID is required'],
      index: true,
    },

    // Who triggered the notification (null = system)
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },

    title: {
      type: String,
      required: [true, 'Notification title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },

    message: {
      type: String,
      required: [true, 'Notification message is required'],
      trim: true,
      maxlength: [1000, 'Message cannot exceed 1000 characters'],
    },

    type: {
      type: String,
      enum: NOTIFICATION_TYPES,
      required: [true, 'Notification type is required'],
    },

    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },

    readAt: {
      type: Date,
      default: null,
    },

    // Optional deep-link payload for the frontend
    // e.g. { resourceType: 'athlete', resourceId: '...' }
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    // Priority: allows UI to highlight critical notifications
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
    },

    // TTL — notification expires and can be archived after this date
    expiresAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// ─── Indexes ─────────────────────────────────────────────────────────────────
notificationSchema.index({ recipientId: 1, isRead: 1 });
notificationSchema.index({ recipientId: 1, createdAt: -1 });
notificationSchema.index({ type: 1 });
// TTL index — MongoDB auto-deletes expired notifications
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0, sparse: true });

// ─── Statics ──────────────────────────────────────────────────────────────────
notificationSchema.statics.TYPES = NOTIFICATION_TYPES;

notificationSchema.statics.markAllReadForUser = function (userId) {
  return this.updateMany(
    { recipientId: userId, isRead: false },
    { $set: { isRead: true, readAt: new Date() } }
  );
};

notificationSchema.statics.getUnreadCount = function (userId) {
  return this.countDocuments({ recipientId: userId, isRead: false });
};

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;
