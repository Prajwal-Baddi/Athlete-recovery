const AthleteProfile = require('../models/AthleteProfile');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const { getPaginationParams, buildPaginationMeta, buildSortOptions } = require('../utils/helpers');

/**
 * AthleteService — all athlete profile business logic.
 */

/**
 * Get the AthleteProfile for a given userId.
 * Creates one if it doesn't exist (idempotent).
 */
const getProfileByUserId = async (userId) => {
  let profile = await AthleteProfile.findOne({ userId })
    .populate('userId', 'name email avatar')
    .populate('assignedPhysio', 'name email')
    .populate('assignedCoach', 'name email');

  if (!profile) {
    profile = await AthleteProfile.create({ userId });
    await profile.populate('userId', 'name email avatar');
  }
  return profile;
};

/**
 * Get a profile by AthleteProfile._id (used in cross-module refs).
 */
const getProfileById = async (profileId) => {
  const profile = await AthleteProfile.findById(profileId)
    .populate('userId', 'name email avatar')
    .populate('assignedPhysio', 'name email')
    .populate('assignedCoach', 'name email');

  if (!profile) throw AppError.notFound('Athlete profile not found');
  return profile;
};

/**
 * Update athlete profile fields.
 */
const updateProfile = async (userId, updates) => {
  const allowedFields = [
    'sport', 'team', 'position', 'age', 'height', 'weight',
    'recoveryStatus', 'emergencyContact', 'notes', 'tags',
  ];

  const sanitized = {};
  allowedFields.forEach((f) => {
    if (updates[f] !== undefined) sanitized[f] = updates[f];
  });

  const profile = await AthleteProfile.findOneAndUpdate(
    { userId },
    { $set: sanitized },
    { new: true, runValidators: true, upsert: true }
  ).populate('userId', 'name email avatar');

  return profile;
};

/**
 * Add an injury record to an athlete's profile.
 */
const addInjury = async (userId, injuryData) => {
  const profile = await AthleteProfile.findOne({ userId });
  if (!profile) throw AppError.notFound('Athlete profile not found');

  profile.injuries.push(injuryData);

  // Auto-update recovery status if injury is severe
  if (injuryData.severity === 'severe') {
    profile.recoveryStatus = 'injured';
  } else if (profile.recoveryStatus === 'active') {
    profile.recoveryStatus = 'recovering';
  }

  await profile.save();
  return profile;
};

/**
 * Update an existing injury by its subdoc _id.
 */
const updateInjury = async (userId, injuryId, updates) => {
  const profile = await AthleteProfile.findOne({ userId });
  if (!profile) throw AppError.notFound('Athlete profile not found');

  const injury = profile.injuries.id(injuryId);
  if (!injury) throw AppError.notFound('Injury record not found');

  Object.assign(injury, updates);
  await profile.save();
  return profile;
};

/**
 * Resolve (close) an active injury.
 */
const resolveInjury = async (userId, injuryId) => {
  const profile = await AthleteProfile.findOne({ userId });
  if (!profile) throw AppError.notFound('Athlete profile not found');

  const injury = profile.injuries.id(injuryId);
  if (!injury) throw AppError.notFound('Injury record not found');

  injury.isActive = false;
  injury.dateResolved = new Date();

  // If no more active injuries, clear status
  const stillActive = profile.injuries.some((i) => i.isActive && i._id.toString() !== injuryId);
  if (!stillActive) profile.recoveryStatus = 'cleared';

  await profile.save();
  return profile;
};

/**
 * Update readiness score (called by AI module).
 * AI module passes { value: number } to this service.
 */
const updateReadinessScore = async (athleteProfileId, score) => {
  if (score < 0 || score > 100) throw AppError.badRequest('Readiness score must be 0–100');

  const profile = await AthleteProfile.findByIdAndUpdate(
    athleteProfileId,
    {
      $set: {
        'readinessScore.value':       score,
        'readinessScore.lastUpdated': new Date(),
      },
    },
    { new: true }
  );

  if (!profile) throw AppError.notFound('Athlete profile not found');
  return profile;
};

/**
 * Assign a physiotherapist to an athlete.
 */
const assignPhysio = async (athleteProfileId, physioUserId) => {
  // Validate physio exists and has correct role
  const physio = await User.findById(physioUserId);
  if (!physio || physio.role !== 'physiotherapist') {
    throw AppError.badRequest('Invalid physiotherapist ID');
  }

  const profile = await AthleteProfile.findByIdAndUpdate(
    athleteProfileId,
    { $set: { assignedPhysio: physioUserId } },
    { new: true }
  ).populate('assignedPhysio', 'name email');

  if (!profile) throw AppError.notFound('Athlete profile not found');
  return profile;
};

/**
 * Assign a coach to an athlete.
 */
const assignCoach = async (athleteProfileId, coachUserId) => {
  const coach = await User.findById(coachUserId);
  if (!coach || coach.role !== 'coach') {
    throw AppError.badRequest('Invalid coach ID');
  }

  const profile = await AthleteProfile.findByIdAndUpdate(
    athleteProfileId,
    { $set: { assignedCoach: coachUserId } },
    { new: true }
  ).populate('assignedCoach', 'name email');

  if (!profile) throw AppError.notFound('Athlete profile not found');
  return profile;
};

/**
 * List all athletes — with filtering and pagination.
 */
const listAthletes = async (queryParams) => {
  const { page, limit, skip } = getPaginationParams(queryParams);
  const sort = buildSortOptions(queryParams.sort);

  const filter = {};
  if (queryParams.recoveryStatus) filter.recoveryStatus = queryParams.recoveryStatus;
  if (queryParams.sport)          filter.sport = new RegExp(queryParams.sport, 'i');
  if (queryParams.assignedPhysio) filter.assignedPhysio = queryParams.assignedPhysio;
  if (queryParams.assignedCoach)  filter.assignedCoach  = queryParams.assignedCoach;

  const [athletes, total] = await Promise.all([
    AthleteProfile.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('userId', 'name email avatar'),
    AthleteProfile.countDocuments(filter),
  ]);

  return { athletes, pagination: buildPaginationMeta(total, page, limit) };
};

module.exports = {
  getProfileByUserId,
  getProfileById,
  updateProfile,
  addInjury,
  updateInjury,
  resolveInjury,
  updateReadinessScore,
  assignPhysio,
  assignCoach,
  listAthletes,
};
