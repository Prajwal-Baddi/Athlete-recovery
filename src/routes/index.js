const express = require('express');
const router  = express.Router();

const authRoutes         = require('./authRoutes');
const userRoutes         = require('./userRoutes');
const athleteRoutes      = require('./athleteRoutes');
const notificationRoutes = require('./notificationRoutes');

/**
 * API v1 route registry.
 * All modules are mounted here so other developers can
 * see the complete API surface in one place.
 */

// Health check — no auth required
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Athlete Recovery API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

router.use('/auth',          authRoutes);
router.use('/users',         userRoutes);
router.use('/athletes',      athleteRoutes);
router.use('/notifications', notificationRoutes);

// ─── Integration stubs for future modules ────────────────────────────────────
// These routes will be implemented by other developers.
// Stubs here ensure consistent URL structure.

router.use('/recovery-plans', (req, res) => {
  res.status(501).json({ success: false, message: 'Recovery Plans module not yet implemented' });
});

router.use('/wellness-logs', (req, res) => {
  res.status(501).json({ success: false, message: 'Wellness Logs module not yet implemented' });
});

router.use('/ai-insights', (req, res) => {
  res.status(501).json({ success: false, message: 'AI Insights module not yet implemented' });
});

router.use('/reports', (req, res) => {
  res.status(501).json({ success: false, message: 'Reports module not yet implemented' });
});

module.exports = router;
