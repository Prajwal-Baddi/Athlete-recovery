/**
 * Services barrel export.
 *
 * Other modules can import from here cleanly:
 *   const { athleteService, notificationService } = require('./services');
 *
 * Or destructure specific methods:
 *   const { getProfileById } = require('./services/athleteService');
 */

module.exports = {
  authService:         require('./authService'),
  userService:         require('./userService'),
  athleteService:      require('./athleteService'),
  notificationService: require('./notificationService'),
};
