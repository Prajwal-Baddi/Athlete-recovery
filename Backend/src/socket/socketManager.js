const { Server } = require('socket.io');
const { verifyAccessToken } = require('../utils/jwt');
const User = require('../models/User');
const logger = require('../utils/logger');

let io;

/**
 * Initialize Socket.IO on the HTTP server.
 * Called once during app bootstrap.
 *
 * @param {http.Server} httpServer
 * @returns {Server} Socket.IO server instance
 */
const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: (process.env.ALLOWED_ORIGINS || 'http://localhost:3000').split(','),
      methods: ['GET', 'POST'],
      credentials: true,
    },
    pingTimeout:  20000,
    pingInterval: 25000,
  });

  // ─── Auth middleware ─────────────────────────────────────────────────────
  io.use(async (socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.replace('Bearer ', '');

      if (!token) {
        return next(new Error('Authentication required'));
      }

      const decoded = verifyAccessToken(token);
      const user    = await User.findById(decoded.id).select('name role isActive');

      if (!user || !user.isActive) {
        return next(new Error('User not found or inactive'));
      }

      socket.user = user;
      next();
    } catch (err) {
      next(new Error('Invalid token'));
    }
  });

  // ─── Connection handler ──────────────────────────────────────────────────
  io.on('connection', (socket) => {
    const { _id, name, role } = socket.user;

    logger.info(`Socket connected: ${name} (${role}) — ${socket.id}`);

    // Each user joins their private room for targeted notifications
    socket.join(`user:${_id}`);
    // Role-based rooms for broadcasts (e.g. alert all coaches)
    socket.join(`role:${role}`);

    // ── Event: subscribe to athlete channel (physio/coach) ────────────────
    socket.on('athlete:subscribe', (athleteId) => {
      if (['physiotherapist', 'coach'].includes(role)) {
        socket.join(`athlete:${athleteId}`);
        logger.debug(`${name} subscribed to athlete:${athleteId}`);
      }
    });

    socket.on('athlete:unsubscribe', (athleteId) => {
      socket.leave(`athlete:${athleteId}`);
    });

    // ── Event: ping/pong for connection health ────────────────────────────
    socket.on('ping', () => socket.emit('pong', { timestamp: Date.now() }));

    // ── Disconnect ────────────────────────────────────────────────────────
    socket.on('disconnect', (reason) => {
      logger.info(`Socket disconnected: ${name} — ${reason}`);
    });

    socket.on('error', (err) => {
      logger.error(`Socket error for ${name}: ${err.message}`);
    });
  });

  logger.info('Socket.IO initialized');
  return io;
};

/**
 * Get the active Socket.IO instance.
 * Throws if initSocket() has not been called yet.
 */
const getIO = () => {
  if (!io) throw new Error('Socket.IO not initialized. Call initSocket() first.');
  return io;
};

/**
 * Emit helpers for use by services and other modules.
 * These are safe to call from anywhere after init.
 */
const emitToUser    = (userId, event, data) => getIO().to(`user:${userId}`).emit(event, data);
const emitToRole    = (role, event, data)   => getIO().to(`role:${role}`).emit(event, data);
const emitToAthlete = (athleteId, event, data) => getIO().to(`athlete:${athleteId}`).emit(event, data);

/**
 * Standard event names — import these in other modules
 * to keep event naming consistent across the codebase.
 */
const EVENTS = {
  // Notifications
  NOTIFICATION_NEW:     'notification:new',
  NOTIFICATION_ALL_READ:'notification:allRead',

  // Readiness (AI module emits these)
  READINESS_UPDATED:    'readiness:updated',
  READINESS_ALERT:      'readiness:alert',

  // Recovery
  RECOVERY_UPDATE:      'recovery:update',
  RECOVERY_MILESTONE:   'recovery:milestone',

  // AI insights
  AI_INSIGHT_NEW:       'ai:insight',
  AI_ALERT:             'ai:alert',

  // Reports
  REPORT_READY:         'report:ready',
};

module.exports = { initSocket, getIO, emitToUser, emitToRole, emitToAthlete, EVENTS };
