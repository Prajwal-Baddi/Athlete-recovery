/**
 * Models barrel export.
 * Import all Mongoose models from one place.
 *
 * Usage: const { User, AthleteProfile, Notification } = require('../models');
 */

module.exports = {
  User:           require('./User'),
  AthleteProfile: require('./AthleteProfile'),
  Notification:   require('./Notification'),
};
