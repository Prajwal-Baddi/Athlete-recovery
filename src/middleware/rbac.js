const AthleteProfile = require('../models/AthleteProfile');
const AppError = require('../utils/AppError');
const { asyncHandler } = require('../utils/helpers');

/**
 * RBAC permission map — defines what each role can do.
 * Extend this object as new modules are added.
 * Other modules can import PERMISSIONS to check capabilities.
 */
const PERMISSIONS = {
  athlete: [
    'view:own_profile',
    'update:own_profile',
    'submit:wellness_log',
    'view:own_recovery',
    'view:ai_insights',
    'view:own_notifications',
  ],
  physiotherapist: [
    'view:athlete_profiles',
    'update:athlete_injuries',
    'manage:recovery_plans',
    'update:rehab_progress',
    'create:recommendations',
    'view:own_notifications',
  ],
  coach: [
    'view:athlete_profiles',
    'view:athlete_readiness',
    'view:team_dashboard',
    'view:training_analytics',
    'view:injury_risk',
    'view:own_notifications',
  ],
};

/**
 * hasPermission — checks if a user's role has the specified permission.
 * Useful for fine-grained programmatic checks inside controllers.
 *
 * @param {string} role
 * @param {string} permission
 * @returns {boolean}
 */
const hasPermission = (role, permission) => {
  return (PERMISSIONS[role] || []).includes(permission);
};

/**
 * requirePermission — Express middleware factory.
 * Blocks the request if the user's role lacks the permission.
 *
 * Usage: requirePermission('manage:recovery_plans')
 */
const requirePermission = (permission) =>
  asyncHandler(async (req, res, next) => {
    if (!req.user) throw AppError.unauthorized('Not authenticated');
    if (!hasPermission(req.user.role, permission)) {
      throw AppError.forbidden(
        `Your role (${req.user.role}) does not have permission: ${permission}`
      );
    }
    next();
  });

/**
 * canAccessAthlete — checks that the requesting user is allowed to
 * access a specific athlete's data.
 *
 * Rules:
 * - Athlete can only access their OWN profile.
 * - Physio can access any athlete assigned to them.
 * - Coach can access any athlete assigned to them.
 *
 * Attaches `req.athleteProfile` for downstream use.
 *
 * Usage: router.get('/:athleteId/...', protect, canAccessAthlete, ...)
 */
const canAccessAthlete = asyncHandler(async (req, res, next) => {
  const { athleteId } = req.params;
  if (!athleteId) throw AppError.badRequest('athleteId param is required');

  const profile = await AthleteProfile.findById(athleteId).populate('userId', 'name email role');
  if (!profile) throw AppError.notFound('Athlete profile not found');

  const { role, _id: userId } = req.user;

  if (role === 'athlete') {
    // Athletes can only see their own data
    if (profile.userId._id.toString() !== userId.toString()) {
      throw AppError.forbidden('You can only access your own data');
    }
  } else if (role === 'physiotherapist') {
    // Physio must be assigned to this athlete
    if (
      profile.assignedPhysio &&
      profile.assignedPhysio.toString() !== userId.toString()
    ) {
      throw AppError.forbidden('This athlete is not assigned to you');
    }
  } else if (role === 'coach') {
    // Coach must be assigned to this athlete
    if (
      profile.assignedCoach &&
      profile.assignedCoach.toString() !== userId.toString()
    ) {
      throw AppError.forbidden('This athlete is not in your team');
    }
  }

  req.athleteProfile = profile;
  next();
});

module.exports = { PERMISSIONS, hasPermission, requirePermission, canAccessAthlete };
