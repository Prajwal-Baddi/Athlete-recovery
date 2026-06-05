/**
 * Socket.IO Client Usage Examples
 * ─────────────────────────────────────────────────────────────────
 * These are EXAMPLES for frontend developers and other module authors.
 * Copy the relevant snippet into your React/Vue/Node client.
 *
 * Install on client: npm install socket.io-client
 */

// ═══════════════════════════════════════════════════════════════
// 1. CONNECT (all roles)
// ═══════════════════════════════════════════════════════════════
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000', {
  auth: {
    token: localStorage.getItem('accessToken'), // your stored JWT
  },
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 2000,
});

socket.on('connect', () => {
  console.log('Connected to Athlete Recovery real-time server');
});

socket.on('connect_error', (err) => {
  console.error('Socket connection error:', err.message);
  // err.message === 'Authentication required' → redirect to login
});

socket.on('disconnect', (reason) => {
  if (reason === 'io server disconnect') {
    // Server forced disconnect (e.g. token invalidated)
    socket.connect(); // manually reconnect
  }
});


// ═══════════════════════════════════════════════════════════════
// 2. NOTIFICATIONS (all roles)
// ═══════════════════════════════════════════════════════════════

// Listen for new notifications (badge update, toast)
socket.on('notification:new', (notification) => {
  console.log('New notification:', notification);
  // notification shape:
  // {
  //   _id, recipientId, senderId, title, message,
  //   type, isRead, priority, metadata, createdAt
  // }

  // Update badge count in UI
  setUnreadCount((prev) => prev + 1);

  // Show toast
  showToast({ title: notification.title, body: notification.message });
});

// Listen for all-read event (badge reset)
socket.on('notification:allRead', () => {
  setUnreadCount(0);
});


// ═══════════════════════════════════════════════════════════════
// 3. ATHLETE REAL-TIME FEED (physio / coach)
// ═══════════════════════════════════════════════════════════════

// Subscribe to a specific athlete's live updates
const subscribeToAthlete = (athleteId) => {
  socket.emit('athlete:subscribe', athleteId);
};

const unsubscribeFromAthlete = (athleteId) => {
  socket.emit('athlete:unsubscribe', athleteId);
};

// Readiness score updated (from AI module or physio)
socket.on('readiness:updated', ({ athleteId, score, lastUpdated }) => {
  console.log(`Athlete ${athleteId} readiness → ${score}`);
  updateAthleteCard(athleteId, { readinessScore: score });
});

// Critical readiness alert (score dropped significantly)
socket.on('readiness:alert', ({ athleteId, score, message }) => {
  showCriticalAlert({ athleteId, score, message });
});


// ═══════════════════════════════════════════════════════════════
// 4. RECOVERY UPDATES (athlete dashboard)
// ═══════════════════════════════════════════════════════════════

socket.on('recovery:update', ({ status, message }) => {
  // Recovery plan was updated by physio
  setRecoveryStatus(status);
  showInfoBanner(message);
});

socket.on('recovery:milestone', ({ milestone, message }) => {
  // Athlete hit a recovery milestone
  showCelebration({ milestone, message });
});


// ═══════════════════════════════════════════════════════════════
// 5. AI MODULE EVENTS (all dashboards)
// ═══════════════════════════════════════════════════════════════

socket.on('ai:insight', ({ insight, athleteId }) => {
  // New AI-generated insight is available
  addInsightCard({ insight, athleteId });
});

socket.on('ai:alert', ({ alert, athleteId, severity }) => {
  // Critical AI alert — injury risk detected
  if (severity === 'critical') {
    showModal({ title: 'Injury Risk Alert', body: alert });
  }
});


// ═══════════════════════════════════════════════════════════════
// 6. REPORTS (physio / coach dashboard)
// ═══════════════════════════════════════════════════════════════

socket.on('report:ready', ({ reportId, athleteId, reportType }) => {
  // Report is generated and ready for download
  addReportToList({ reportId, athleteId, reportType });
  showToast({ title: 'Report Ready', body: `${reportType} report is ready to download` });
});


// ═══════════════════════════════════════════════════════════════
// 7. HOW AI/OTHER MODULES EMIT EVENTS (server-side)
// ═══════════════════════════════════════════════════════════════
//
// From your AI module or any backend service:
//
//   const { emitToUser, emitToAthlete, emitToRole, EVENTS } =
//     require('../socket/socketManager');
//
//   // Notify a specific user
//   emitToUser(userId, EVENTS.AI_INSIGHT_NEW, { insight: '...', athleteId });
//
//   // Notify everyone watching a specific athlete
//   emitToAthlete(athleteId, EVENTS.READINESS_UPDATED, { score: 82, athleteId });
//
//   // Broadcast to all coaches
//   emitToRole('coach', EVENTS.AI_ALERT, { alert: 'High injury risk in team' });
//
// ═══════════════════════════════════════════════════════════════


// ═══════════════════════════════════════════════════════════════
// 8. TOKEN REFRESH ON RECONNECT (important!)
// ═══════════════════════════════════════════════════════════════

// When you refresh the JWT access token, update the socket auth too.
// Otherwise the socket will use an expired token on reconnect.

const refreshAndReconnect = async () => {
  const newToken = await refreshAccessToken(); // your auth util
  socket.auth.token = newToken;
  socket.disconnect().connect(); // reconnect with new token
};

// EVENTS reference (import from socketManager on server)
const EVENTS = {
  NOTIFICATION_NEW:      'notification:new',
  NOTIFICATION_ALL_READ: 'notification:allRead',
  READINESS_UPDATED:     'readiness:updated',
  READINESS_ALERT:       'readiness:alert',
  RECOVERY_UPDATE:       'recovery:update',
  RECOVERY_MILESTONE:    'recovery:milestone',
  AI_INSIGHT_NEW:        'ai:insight',
  AI_ALERT:              'ai:alert',
  REPORT_READY:          'report:ready',
};
