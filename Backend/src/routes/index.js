const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const athleteRoutes = require('./athleteRoutes');
const notificationRoutes = require('./notificationRoutes');

const recoveryRoutes = require('./recoveryRoutes');
const wellnessRoutes = require('./wellnessRoutes');

/**
 * API v1 route registry.
 */

// Health Check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Athlete Recovery API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

/*
|--------------------------------------------------------------------------
| Core Modules
|--------------------------------------------------------------------------
*/

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/athletes', athleteRoutes);
router.use('/notifications', notificationRoutes);

/*
|--------------------------------------------------------------------------
| Recovery Module
|--------------------------------------------------------------------------
|
| Endpoints:
| /api/recovery/plans
| /api/recovery/exercises
| /api/recovery/progress
|
*/

router.use('/recovery', recoveryRoutes);

/*
|--------------------------------------------------------------------------
| Wellness Module
|--------------------------------------------------------------------------
|
| Endpoints:
| /api/wellness
|
*/

router.use('/wellness', wellnessRoutes);

/*
|--------------------------------------------------------------------------
| Future Modules
|--------------------------------------------------------------------------
*/

router.use('/ai-insights', (req, res) => {
  res.status(501).json({
    success: false,
    message: 'AI Insights module not yet implemented',
  });
});

router.use('/reports', (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Reports module not yet implemented',
  });
});

module.exports = router;