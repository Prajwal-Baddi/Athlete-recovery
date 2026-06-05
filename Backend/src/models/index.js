/**
 * Models barrel export.
 * Import all Mongoose models from one place.
 *
 * Usage: const { User, AthleteProfile, Notification } = require('../models');
 */

const RecoveryPlan = require('./RecoveryPlan');
const RehabExercise = require('./RehabExercise');
const RecoveryProgress = require('./RecoveryProgress');
const recoveryRoutes = require('./recoveryRoutes');

module.exports = {
  User:           require('./User'),
  AthleteProfile: require('./AthleteProfile'),
  Notification:   require('./Notification'),
};

module.exports = {
  RecoveryPlan,
  RehabExercise,
  RecoveryProgress,
};

router.use(
  '/recovery',
  recoveryRoutes
);