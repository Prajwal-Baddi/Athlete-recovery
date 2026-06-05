const AthleteProfile = require('../models/AthleteProfile');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const {
  getPaginationParams,
  buildPaginationMeta,
  buildSortOptions,
} = require('../utils/helpers');

/**
 * AthleteService
 */

/* -------------------------------------------------------------------------- */
/*                                GET PROFILE                                 */
/* -------------------------------------------------------------------------- */

const getProfileByUserId = async (userId) => {
  let profile = await AthleteProfile.findOne({ userId })
    .populate('userId', 'name email avatar role')
    .populate('assignedPhysio', 'name email')
    .populate('assignedCoach', 'name email');

  if (!profile) {
    profile = await AthleteProfile.create({ userId });

    await profile.populate(
      'userId',
      'name email avatar role'
    );
  }

  return profile;
};

const getProfileById = async (profileId) => {
  const profile = await AthleteProfile.findById(profileId)
    .populate('userId', 'name email avatar role')
    .populate('assignedPhysio', 'name email')
    .populate('assignedCoach', 'name email');

  if (!profile) {
    throw AppError.notFound(
      'Athlete profile not found'
    );
  }

  return profile;
};

/* -------------------------------------------------------------------------- */
/*                              UPDATE PROFILE                                */
/* -------------------------------------------------------------------------- */

const updateProfile = async (
  userId,
  updates
) => {
  const allowedFields = [
    'sport',
    'team',
    'position',
    'age',
    'height',
    'weight',
    'recoveryStatus',
    'emergencyContact',
    'notes',
    'tags',
  ];

  const sanitized = {};

  allowedFields.forEach((field) => {
    if (
      updates[field] !== undefined
    ) {
      sanitized[field] =
        updates[field];
    }
  });

  const profile =
    await AthleteProfile.findOneAndUpdate(
      { userId },
      {
        $set: sanitized,
      },
      {
        new: true,
        runValidators: true,
        upsert: true,
      }
    ).populate(
      'userId',
      'name email avatar role'
    );

  return profile;
};

/* -------------------------------------------------------------------------- */
/*                                  INJURIES                                  */
/* -------------------------------------------------------------------------- */

const addInjury = async (
  userId,
  injuryData
) => {
  const profile =
    await AthleteProfile.findOne({
      userId,
    });

  if (!profile) {
    throw AppError.notFound(
      'Athlete profile not found'
    );
  }

  profile.injuries.push(
    injuryData
  );

  if (
    injuryData.severity ===
    'severe'
  ) {
    profile.recoveryStatus =
      'injured';
  } else if (
    profile.recoveryStatus ===
    'active'
  ) {
    profile.recoveryStatus =
      'recovering';
  }

  await profile.save();

  return profile;
};

const updateInjury = async (
  userId,
  injuryId,
  updates
) => {
  const profile =
    await AthleteProfile.findOne({
      userId,
    });

  if (!profile) {
    throw AppError.notFound(
      'Athlete profile not found'
    );
  }

  const injury =
    profile.injuries.id(
      injuryId
    );

  if (!injury) {
    throw AppError.notFound(
      'Injury record not found'
    );
  }

  Object.assign(
    injury,
    updates
  );

  await profile.save();

  return profile;
};

const resolveInjury = async (
  userId,
  injuryId
) => {
  const profile =
    await AthleteProfile.findOne({
      userId,
    });

  if (!profile) {
    throw AppError.notFound(
      'Athlete profile not found'
    );
  }

  const injury =
    profile.injuries.id(
      injuryId
    );

  if (!injury) {
    throw AppError.notFound(
      'Injury record not found'
    );
  }

  injury.isActive = false;
  injury.dateResolved =
    new Date();

  const stillActive =
    profile.injuries.some(
      (i) =>
        i.isActive &&
        i._id.toString() !==
          injuryId
    );

  if (!stillActive) {
    profile.recoveryStatus =
      'cleared';
  }

  await profile.save();

  return profile;
};

/* -------------------------------------------------------------------------- */
/*                              READINESS SCORE                               */
/* -------------------------------------------------------------------------- */

const updateReadinessScore =
  async (
    athleteProfileId,
    score
  ) => {
    if (
      score < 0 ||
      score > 100
    ) {
      throw AppError.badRequest(
        'Readiness score must be between 0 and 100'
      );
    }

    const profile =
      await AthleteProfile.findByIdAndUpdate(
        athleteProfileId,
        {
          $set: {
            'readinessScore.value':
              score,
            'readinessScore.lastUpdated':
              new Date(),
          },
        },
        {
          new: true,
        }
      );

    if (!profile) {
      throw AppError.notFound(
        'Athlete profile not found'
      );
    }

    return profile;
  };

/* -------------------------------------------------------------------------- */
/*                               ASSIGN PHYSIO                                */
/* -------------------------------------------------------------------------- */

const assignPhysio =
  async (
    athleteProfileId,
    physioUserId
  ) => {
    const physio =
      await User.findById(
        physioUserId
      );

    if (
      !physio ||
      physio.role !==
        'physiotherapist'
    ) {
      throw AppError.badRequest(
        'Invalid physiotherapist'
      );
    }

    const profile =
      await AthleteProfile.findByIdAndUpdate(
        athleteProfileId,
        {
          $set: {
            assignedPhysio:
              physioUserId,
          },
        },
        {
          new: true,
        }
      ).populate(
        'assignedPhysio',
        'name email'
      );

    return profile;
  };

/* -------------------------------------------------------------------------- */
/*                                ASSIGN COACH                                */
/* -------------------------------------------------------------------------- */

const assignCoach = async (
  athleteProfileId,
  coachUserId
) => {
  const coach =
    await User.findById(
      coachUserId
    );

  if (
    !coach ||
    coach.role !== 'coach'
  ) {
    throw AppError.badRequest(
      'Invalid coach'
    );
  }

  const profile =
    await AthleteProfile.findByIdAndUpdate(
      athleteProfileId,
      {
        $set: {
          assignedCoach:
            coachUserId,
        },
      },
      {
        new: true,
      }
    ).populate(
      'assignedCoach',
      'name email'
    );

  return profile;
};

/* -------------------------------------------------------------------------- */
/*                               LIST ATHLETES                                */
/* -------------------------------------------------------------------------- */

const listAthletes = async (queryParams) => {
  const { page, limit, skip } =
    getPaginationParams(queryParams);

  const sort =
    buildSortOptions(queryParams.sort);

  const filter = {};

  if (queryParams.recoveryStatus) {
    filter.recoveryStatus =
      queryParams.recoveryStatus;
  }

  if (queryParams.sport) {
    filter.sport =
      new RegExp(queryParams.sport, 'i');
  }

  if (queryParams.assignedPhysio) {
    filter.assignedPhysio =
      queryParams.assignedPhysio;
  }

  if (queryParams.assignedCoach) {
    filter.assignedCoach =
      queryParams.assignedCoach;
  }

  const [profiles, total] =
    await Promise.all([
      AthleteProfile.find(filter)
        .populate({
          path: 'userId',
          select: 'name email role',
        })
        .populate({
          path: 'assignedCoach',
          select: 'name email',
        })
        .populate({
          path: 'assignedPhysio',
          select: 'name email',
        })
        .sort(sort)
        .skip(skip)
        .limit(limit),

      AthleteProfile.countDocuments(filter),
    ]);

  const athletes =
    profiles.map((profile) => {
      const activeInjuryCount =
        profile.injuries?.filter(
          (injury) => injury.isActive
        ).length || 0;

      return {
        ...profile.toObject(),

        athleteName:
          profile.userId?.name ||
          'Unknown Athlete',

        activeInjuryCount,
      };
    });

  return {
    athletes,
    pagination: buildPaginationMeta(
      total,
      page,
      limit
    ),
  };
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