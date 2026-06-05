const express = require('express');
const router = express.Router();

const athleteController = require('../controllers/athleteController');
const { protect, authorize } = require('../middleware/auth');
const {
  athleteProfileValidators,
  addInjuryValidators,
  mongoIdParam,
  paginationValidators,
  validate,
} = require('../middleware/validators');
const { canAccessAthlete } = require('../middleware/rbac');
const { body } = require('express-validator');

router.use(protect);

// ─── Self-service routes (athlete only) ──────────────────────────────────────

/**
 * @route   GET /api/v1/athletes/me
 * @desc    Get own athlete profile
 * @access  Athlete
 */
router.get('/me', authorize('athlete'), athleteController.getMyProfile);

/**
 * @route   PATCH /api/v1/athletes/me
 * @desc    Update own athlete profile
 * @access  Athlete
 */
router.patch(
  '/me',
  authorize('athlete'),
  athleteProfileValidators,
  validate,
  athleteController.updateMyProfile
);

/**
 * @route   POST /api/v1/athletes/me/injuries
 * @desc    Log a new injury
 * @access  Athlete
 */
router.post(
  '/me/injuries',
  authorize('athlete'),
  addInjuryValidators,
  validate,
  athleteController.addInjury
);

/**
 * @route   PATCH /api/v1/athletes/me/injuries/:injuryId
 * @desc    Update an injury record
 * @access  Athlete
 */
router.patch(
  '/me/injuries/:injuryId',
  authorize('athlete'),
  mongoIdParam('injuryId'),
  validate,
  athleteController.updateInjury
);

/**
 * @route   PATCH /api/v1/athletes/me/injuries/:injuryId/resolve
 * @desc    Mark an injury as resolved
 * @access  Athlete
 */
router.patch(
  '/me/injuries/:injuryId/resolve',
  authorize('athlete'),
  mongoIdParam('injuryId'),
  validate,
  athleteController.resolveInjury
);

// ─── Staff routes (physio + coach) ────────────────────────────────────────────

/**
 * @route   GET /api/v1/athletes
 * @desc    List athletes (filterable)
 * @access  Physiotherapist, Coach
 */
router.get(
  '/',
  authorize('physiotherapist', 'coach'),
  paginationValidators,
  validate,
  athleteController.listAthletes
);

/**
 * @route   GET /api/v1/athletes/:athleteId
 * @desc    Get athlete profile by AthleteProfile._id
 * @access  Physiotherapist, Coach (must be assigned)
 */
router.get(
  '/:athleteId',
  authorize('physiotherapist', 'coach'),
  mongoIdParam('athleteId'),
  validate,
  canAccessAthlete,
  athleteController.getAthleteById
);

/**
 * @route   PATCH /api/v1/athletes/:athleteId/readiness
 * @desc    Update athlete readiness score (AI module calls this)
 * @access  Physiotherapist
 */
router.patch(
  '/:athleteId/readiness',
  authorize('physiotherapist'),
  mongoIdParam('athleteId'),
  [body('score').isFloat({ min: 0, max: 100 }).withMessage('Score must be 0–100')],
  validate,
  athleteController.updateReadinessScore
);

/**
 * @route   PATCH /api/v1/athletes/:athleteId/assign-physio
 * @desc    Assign a physiotherapist to an athlete
 * @access  Coach
 */
router.patch(
  '/:athleteId/assign-physio',
  authorize('coach'),
  mongoIdParam('athleteId'),
  [body('physioId').isMongoId().withMessage('physioId must be a valid ID')],
  validate,
  athleteController.assignPhysio
);

/**
 * @route   PATCH /api/v1/athletes/:athleteId/assign-coach
 * @desc    Assign a coach to an athlete
 * @access  Coach
 */
router.patch(
  '/:athleteId/assign-coach',
  authorize('coach'),
  mongoIdParam('athleteId'),
  [body('coachId').isMongoId().withMessage('coachId must be a valid ID')],
  validate,
  athleteController.assignCoach
);

module.exports = router;
