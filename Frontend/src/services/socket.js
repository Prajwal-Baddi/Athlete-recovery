/**
 * socket.js
 * Socket.IO client — connect, disconnect, and event subscriptions.
 *
 * Usage:
 *   import { connectSocket, disconnectSocket, socketOn, socketOff } from './services/socket';
 *
 *   // On login:
 *   connectSocket(accessToken);
 *
 *   // On logout:
 *   disconnectSocket();
 *
 *   // In a component / context:
 *   socketOn('notification:new', handler);
 *   return () => socketOff('notification:new', handler);
 */

import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000'; // same host as API

let socket = null;

export const connectSocket = (token) => {
  if (socket?.connected) return socket;

  socket = io(SOCKET_URL, {
    auth: { token },
    transports: ['websocket'],
    reconnectionAttempts: 5,
    reconnectionDelay: 2000,
  });

  socket.on('connect', () => {
    console.log('[Socket] Connected:', socket.id);
  });

  socket.on('disconnect', (reason) => {
    console.log('[Socket] Disconnected:', reason);
  });

  socket.on('connect_error', (err) => {
    console.warn('[Socket] Connection error:', err.message);
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => socket;

/** Register an event listener */
export const socketOn = (event, handler) => {
  if (!socket) {
    console.warn('[Socket] socketOn called before connecting — queued listeners may be missed.');
    return;
  }
  socket.on(event, handler);
};

/** Remove an event listener */
export const socketOff = (event, handler) => {
  if (!socket) return;
  socket.off(event, handler);
};

/** Emit an event */
export const socketEmit = (event, payload) => {
  if (!socket?.connected) {
    console.warn('[Socket] Attempted emit while disconnected.');
    return;
  }
  socket.emit(event, payload);
};

// ─── Known server-emitted events ──────────────────────────────────────────
export const SOCKET_EVENTS = {
  NOTIFICATION_NEW:    'notification:new',
  NOTIFICATION_UPDATE: 'notification:update',
  READINESS_UPDATE:    'readiness:update',
  INJURY_UPDATE:       'injury:update',
};
