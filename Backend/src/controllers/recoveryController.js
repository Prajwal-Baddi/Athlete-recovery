const recoveryService = require('../services/recoveryService');
const { sendSuccess, sendCreated, sendPaginated } = require('../utils/apiResponse');
const { asyncHandler } = require('../utils/helpers');

/**
 * Recovery Controller — thin wrappers around recoveryService.
 */

// ═══════════════════════════════════════════════════════════════════════════
// Recovery Cases
// ═══════════════════════════════════════════════════════════════════════════

/**
 * @route   GET /api/v1/recovery/cases
 * @desc    Get all recovery cases with filters
 * @access  Physiotherapist, Coach
 */
const getRecoveryCases = asyncHandler(async (req, res) => {
  const { cases, pagination } = await recoveryService.getRecoveryCases(
    req.query
  );
  sendPaginated(res, 'Recovery cases retrieved', cases, pagination);
});

/**
 * @route   GET /api/v1/recovery/cases/:id
 * @desc    Get a specific recovery case
 * @access  Physiotherapist, Coach, Athlete
 */
const getRecoveryCaseById = asyncHandler(async (req, res) => {
  const recoveryCase = await recoveryService.getRecoveryCaseById(
    req.params.id
  );
  sendSuccess(res, 'Recovery case retrieved', { recoveryCase });
});

/**
 * @route   GET /api/v1/recovery/athlete/:athleteId
 * @desc    Get recovery cases for an athlete
 * @access  Physiotherapist, Athlete
 */
const getAthleteRecoveryCases = asyncHandler(async (req, res) => {
  const cases = await recoveryService.getAthleteRecoveryCases(
    req.params.athleteId
  );
  sendSuccess(res, 'Athlete recovery cases retrieved', { cases });
});

/**
 * @route   POST /api/v1/recovery/cases
 * @desc    Create a new recovery case
 * @access  Physiotherapist
 */
const createRecoveryCase = asyncHandler(async (req, res) => {
  const recoveryCase = await recoveryService.createRecoveryCase(req.body);
  sendCreated(res, 'Recovery case created', { recoveryCase });
});

/**
 * @route   PATCH /api/v1/recovery/cases/:id
 * @desc    Update a recovery case
 * @access  Physiotherapist
 */
const updateRecoveryCase = asyncHandler(async (req, res) => {
  const recoveryCase = await recoveryService.updateRecoveryCase(
    req.params.id,
    req.body
  );
  sendSuccess(res, 'Recovery case updated', { recoveryCase });
});

/**
 * @route   PATCH /api/v1/recovery/cases/:id/phase
 * @desc    Update recovery phase
 * @access  Physiotherapist
 */
const updateRecoveryPhase = asyncHandler(async (req, res) => {
  const { phase, notes } = req.body;
  const recoveryCase = await recoveryService.updateRecoveryPhase(
    req.params.id,
    phase,
    notes
  );
  sendSuccess(res, 'Recovery phase updated', { recoveryCase });
});

/**
 * @route   GET /api/v1/recovery/rtp-candidates
 * @desc    Get RTP candidates
 * @access  Physiotherapist
 */
const getRTPCandidates = asyncHandler(async (req, res) => {
  const candidates = await recoveryService.getRTPCandidates(req.query);
  sendSuccess(res, 'RTP candidates retrieved', { candidates });
});

/**
 * @route   POST /api/v1/recovery/cases/:id/approve-rtp
 * @desc    Approve return to play
 * @access  Physiotherapist
 */
const approveRTP = asyncHandler(async (req, res) => {
  const { notes } = req.body;
  const recoveryCase = await recoveryService.approveRTP(req.params.id, notes);
  sendSuccess(res, 'RTP approved', { recoveryCase });
});

// ═══════════════════════════════════════════════════════════════════════════
// Recovery Progress
// ═══════════════════════════════════════════════════════════════════════════

/**
 * @route   GET /api/v1/recovery/progress/:caseId
 * @desc    Get progress entries for a case
 * @access  Physiotherapist, Athlete
 */
const getProgressEntries = asyncHandler(async (req, res) => {
  const entries = await recoveryService.getProgressEntries(
    req.params.caseId,
    req.query
  );
  sendSuccess(res, 'Progress entries retrieved', { entries });
});

/**
 * @route   POST /api/v1/recovery/:caseId/progress
 * @desc    Create a progress entry
 * @access  Athlete, Physiotherapist
 */
const createProgressEntry = asyncHandler(async (req, res) => {
  const entry = await recoveryService.createProgressEntry(
    req.params.caseId,
    req.body
  );
  sendCreated(res, 'Progress entry created', { entry });
});

/**
 * @route   GET /api/v1/recovery/:caseId/pain-trend
 * @desc    Get pain trend data
 * @access  Physiotherapist
 */
const getPainTrend = asyncHandler(async (req, res) => {
  const { days = 7 } = req.query;
  const trend = await recoveryService.getPainTrend(req.params.caseId, days);
  sendSuccess(res, 'Pain trend retrieved', { trend });
});

/**
 * @route   GET /api/v1/recovery/:caseId/progress-summary
 * @desc    Get overall progress summary
 * @access  Physiotherapist, Athlete
 */
const getRecoveryProgress = asyncHandler(async (req, res) => {
  const progress = await recoveryService.getRecoveryProgress(req.params.caseId);
  sendSuccess(res, 'Recovery progress retrieved', { progress });
});

// ═══════════════════════════════════════════════════════════════════════════
// Exercises
// ═══════════════════════════════════════════════════════════════════════════

/**
 * @route   GET /api/v1/recovery/:caseId/exercises
 * @desc    Get exercises for a recovery case
 * @access  Physiotherapist, Athlete
 */
const getExercisesForCase = asyncHandler(async (req, res) => {
  const exercises = await recoveryService.getExercisesForCase(req.params.caseId);
  sendSuccess(res, 'Exercises retrieved', { exercises });
});

/**
 * @route   POST /api/v1/recovery/:caseId/exercises
 * @desc    Create an exercise
 * @access  Physiotherapist
 */
const createExercise = asyncHandler(async (req, res) => {
  const exercise = await recoveryService.createExercise({
    athleteId: req.params.caseId,
    ...req.body,
  });
  sendCreated(res, 'Exercise created', { exercise });
});

/**
 * @route   PATCH /api/v1/recovery/exercises/:exerciseId
 * @desc    Update an exercise
 * @access  Physiotherapist
 */
const updateExercise = asyncHandler(async (req, res) => {
  const exercise = await recoveryService.updateExercise(
    req.params.exerciseId,
    req.body
  );
  sendSuccess(res, 'Exercise updated', { exercise });
});

/**
 * @route   POST /api/v1/recovery/exercises/:exerciseId/complete
 * @desc    Mark exercise as completed
 * @access  Athlete
 */
const completeExercise = asyncHandler(async (req, res) => {
  const exercise = await recoveryService.completeExercise(
    req.params.exerciseId,
    req.body
  );
  sendSuccess(res, 'Exercise completed', { exercise });
});

/**
 * @route   DELETE /api/v1/recovery/exercises/:exerciseId
 * @desc    Delete an exercise
 * @access  Physiotherapist
 */
const deleteExercise = asyncHandler(async (req, res) => {
  const result = await recoveryService.deleteExercise(req.params.exerciseId);
  sendSuccess(res, 'Exercise deleted', result);
});

// ═══════════════════════════════════════════════════════════════════════════
// Analytics & Alerts
// ═══════════════════════════════════════════════════════════════════════════

/**
 * @route   GET /api/v1/recovery/alerts
 * @desc    Get alerts for physiotherapist
 * @access  Physiotherapist
 */
const getAlerts = asyncHandler(async (req, res) => {
  const alerts = await recoveryService.getAlerts(req.user._id);
  sendSuccess(res, 'Alerts retrieved', { alerts });
});

/**
 * @route   GET /api/v1/recovery/stats
 * @desc    Get dashboard statistics
 * @access  Physiotherapist
 */
const getDashboardStats = asyncHandler(async (req, res) => {
  const stats = await recoveryService.getDashboardStats(req.user._id);
  sendSuccess(res, 'Dashboard stats retrieved', { stats });
});

module.exports = {
  // Recovery Cases
  getRecoveryCases,
  getRecoveryCaseById,
  getAthleteRecoveryCases,
  createRecoveryCase,
  updateRecoveryCase,
  updateRecoveryPhase,
  getRTPCandidates,
  approveRTP,

  // Progress
  getProgressEntries,
  createProgressEntry,
  getPainTrend,
  getRecoveryProgress,

  // Exercises
  getExercisesForCase,
  createExercise,
  updateExercise,
  completeExercise,
  deleteExercise,

  // Analytics
  getAlerts,
  getDashboardStats,
};
