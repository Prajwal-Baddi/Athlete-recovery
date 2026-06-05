const athleteService = require('../services/athleteService');
const { sendSuccess, sendCreated, sendPaginated } = require('../utils/apiResponse');
const { asyncHandler } = require('../utils/helpers');

/**
 * Athlete Controller — thin wrappers around athleteService.
 */

const getMyProfile = asyncHandler(async (req, res) => {
  const profile = await athleteService.getProfileByUserId(req.user._id);
  sendSuccess(res, 'Athlete profile retrieved', { profile });
});

const updateMyProfile = asyncHandler(async (req, res) => {
  const profile = await athleteService.updateProfile(req.user._id, req.body);
  sendSuccess(res, 'Athlete profile updated', { profile });
});

const getAthleteById = asyncHandler(async (req, res) => {
  const profile = await athleteService.getProfileById(req.params.athleteId);
  sendSuccess(res, 'Athlete profile retrieved', { profile });
});

const listAthletes = asyncHandler(async (req, res) => {
  const { athletes, pagination } = await athleteService.listAthletes(req.query);
  sendPaginated(res, 'Athletes retrieved', athletes, pagination);
});

const addInjury = asyncHandler(async (req, res) => {
  const profile = await athleteService.addInjury(req.user._id, req.body);
  sendCreated(res, 'Injury added', { profile });
});

const updateInjury = asyncHandler(async (req, res) => {
  const profile = await athleteService.updateInjury(
    req.user._id,
    req.params.injuryId,
    req.body
  );
  sendSuccess(res, 'Injury updated', { profile });
});

const resolveInjury = asyncHandler(async (req, res) => {
  const profile = await athleteService.resolveInjury(req.user._id, req.params.injuryId);
  sendSuccess(res, 'Injury resolved', { profile });
});

// Called by AI module — physio and system only
const updateReadinessScore = asyncHandler(async (req, res) => {
  const { score } = req.body;
  const profile = await athleteService.updateReadinessScore(
    req.params.athleteId,
    score
  );
  sendSuccess(res, 'Readiness score updated', { profile });
});

const assignPhysio = asyncHandler(async (req, res) => {
  const profile = await athleteService.assignPhysio(
    req.params.athleteId,
    req.body.physioId
  );
  sendSuccess(res, 'Physiotherapist assigned', { profile });
});

const assignCoach = asyncHandler(async (req, res) => {
  const profile = await athleteService.assignCoach(
    req.params.athleteId,
    req.body.coachId
  );
  sendSuccess(res, 'Coach assigned', { profile });
});

module.exports = {
  getMyProfile,
  updateMyProfile,
  getAthleteById,
  listAthletes,
  addInjury,
  updateInjury,
  resolveInjury,
  updateReadinessScore,
  assignPhysio,
  assignCoach,
};
