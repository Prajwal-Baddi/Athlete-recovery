const express = require('express');
const router = express.Router();

const recoveryController = require('../controllers/recoveryController');
const { protect, authorize } = require('../middleware/auth');

/**
 * All recovery routes require authentication
 */
router.use(protect);

// ═══════════════════════════════════════════════════════════════════════════
// Recovery Cases
// ═══════════════════════════════════════════════════════════════════════════

/**
 * @route   GET /api/v1/recovery/cases
 * @desc    Get all recovery cases (with filters, pagination)
 * @access  Physiotherapist, Coach
 */
router.get('/cases', authorize('physiotherapist', 'coach'), recoveryController.getRecoveryCases);

/**
 * @route   POST /api/v1/recovery/cases
 * @desc    Create a new recovery case
 * @access  Physiotherapist
 */
router.post('/cases', authorize('physiotherapist'), recoveryController.createRecoveryCase);

/**
 * @route   GET /api/v1/recovery/cases/:id
 * @desc    Get a specific recovery case
 * @access  Physiotherapist, Coach, Athlete
 */
router.get('/cases/:id', recoveryController.getRecoveryCaseById);

/**
 * @route   PATCH /api/v1/recovery/cases/:id
 * @desc    Update a recovery case
 * @access  Physiotherapist
 */
router.patch('/cases/:id', authorize('physiotherapist'), recoveryController.updateRecoveryCase);

/**
 * @route   PATCH /api/v1/recovery/cases/:id/phase
 * @desc    Update recovery phase
 * @access  Physiotherapist
 */
router.patch(
  '/cases/:id/phase',
  authorize('physiotherapist'),
  recoveryController.updateRecoveryPhase
);

/**
 * @route   POST /api/v1/recovery/cases/:id/approve-rtp
 * @desc    Approve return to play
 * @access  Physiotherapist
 */
router.post(
  '/cases/:id/approve-rtp',
  authorize('physiotherapist'),
  recoveryController.approveRTP
);

/**
 * @route   GET /api/v1/recovery/athlete/:athleteId
 * @desc    Get recovery cases for an athlete
 * @access  Physiotherapist, Athlete
 */
router.get('/athlete/:athleteId', recoveryController.getAthleteRecoveryCases);

// ═══════════════════════════════════════════════════════════════════════════
// RTP (Return To Play)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * @route   GET /api/v1/recovery/rtp-candidates
 * @desc    Get RTP candidates
 * @access  Physiotherapist
 */
router.get('/rtp-candidates', authorize('physiotherapist'), recoveryController.getRTPCandidates);

// ═══════════════════════════════════════════════════════════════════════════
// Recovery Progress
// ═══════════════════════════════════════════════════════════════════════════

/**
 * @route   GET /api/v1/recovery/:caseId/progress
 * @desc    Get progress entries for a case
 * @access  Physiotherapist, Athlete
 */
router.get('/:caseId/progress', recoveryController.getProgressEntries);

/**
 * @route   POST /api/v1/recovery/:caseId/progress
 * @desc    Create a progress entry
 * @access  Athlete, Physiotherapist
 */
router.post('/:caseId/progress', recoveryController.createProgressEntry);

/**
 * @route   GET /api/v1/recovery/:caseId/pain-trend
 * @desc    Get pain trend data
 * @access  Physiotherapist
 */
router.get('/:caseId/pain-trend', authorize('physiotherapist'), recoveryController.getPainTrend);

/**
 * @route   GET /api/v1/recovery/:caseId/progress-summary
 * @desc    Get overall progress summary
 * @access  Physiotherapist, Athlete
 */
router.get(
  '/:caseId/progress-summary',
  recoveryController.getRecoveryProgress
);

// ═══════════════════════════════════════════════════════════════════════════
// Exercises
// ═══════════════════════════════════════════════════════════════════════════

/**
 * @route   GET /api/v1/recovery/:caseId/exercises
 * @desc    Get exercises for a recovery case
 * @access  Physiotherapist, Athlete
 */
router.get('/:caseId/exercises', recoveryController.getExercisesForCase);

/**
 * @route   POST /api/v1/recovery/:caseId/exercises
 * @desc    Create an exercise
 * @access  Physiotherapist
 */
router.post('/:caseId/exercises', authorize('physiotherapist'), recoveryController.createExercise);

/**
 * @route   PATCH /api/v1/recovery/exercises/:exerciseId
 * @desc    Update an exercise
 * @access  Physiotherapist
 */
router.patch(
  '/exercises/:exerciseId',
  authorize('physiotherapist'),
  recoveryController.updateExercise
);

/**
 * @route   POST /api/v1/recovery/exercises/:exerciseId/complete
 * @desc    Mark exercise as completed
 * @access  Athlete
 */
router.post(
  '/exercises/:exerciseId/complete',
  authorize('athlete'),
  recoveryController.completeExercise
);

/**
 * @route   DELETE /api/v1/recovery/exercises/:exerciseId
 * @desc    Delete an exercise
 * @access  Physiotherapist
 */
router.delete(
  '/exercises/:exerciseId',
  authorize('physiotherapist'),
  recoveryController.deleteExercise
);

// ═══════════════════════════════════════════════════════════════════════════
// Analytics & Alerts
// ═══════════════════════════════════════════════════════════════════════════

/**
 * @route   GET /api/v1/recovery/alerts
 * @desc    Get alerts for physiotherapist
 * @access  Physiotherapist
 */
router.get('/alerts', authorize('physiotherapist'), recoveryController.getAlerts);

/**
 * @route   GET /api/v1/recovery/stats
 * @desc    Get dashboard statistics
 * @access  Physiotherapist
 */
router.get('/stats', authorize('physiotherapist'), recoveryController.getDashboardStats);

module.exports = router;
