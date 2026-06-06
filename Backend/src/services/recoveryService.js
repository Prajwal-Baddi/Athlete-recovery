const RecoveryCase = require('../models/RecoveryCase');
const RecoveryProgress = require('../models/RecoveryProgress');
const RehabExercise = require('../models/RehabExercise');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const {
  getPaginationParams,
  buildPaginationMeta,
  buildSortOptions,
} = require('../utils/helpers');

// ═══════════════════════════════════════════════════════════════════════════
// RECOVERY CASES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get all recovery cases with filters and pagination
 */
const getRecoveryCases = async (query = {}) => {
  const {
    page = 1,
    limit = 10,
    search,
    phase,
    status,
    sortBy = 'createdAt',
    order = 'desc',
    assignedPhysio,
  } = query;

  const { skip, pageSize } = getPaginationParams(page, limit);

  // Build filter object
  const filter = {};

  if (phase) {
    filter.recoveryPhase = phase;
  }

  if (status) {
    filter.recoveryStatus = status;
  }

  if (assignedPhysio) {
    filter.assignedPhysio = assignedPhysio;
  }

  if (search) {
    filter.$or = [
      { injury: { $regex: search, $options: 'i' } },
      { injuryDetails: { $regex: search, $options: 'i' } },
    ];
  }

  // Build sort options
  const sortOptions = buildSortOptions(sortBy, order);

  const [cases, total] = await Promise.all([
    RecoveryCase.find(filter)
      .populate('athleteId', 'name email avatar')
      .populate('assignedPhysio', 'name email')
      .populate('assignedCoach', 'name email')
      .sort(sortOptions)
      .skip(skip)
      .limit(pageSize),
    RecoveryCase.countDocuments(filter),
  ]);

  const pagination = buildPaginationMeta(total, page, pageSize);

  return { cases, pagination };
};

/**
 * Get a single recovery case
 */
const getRecoveryCaseById = async (caseId) => {
  const recoveryCase = await RecoveryCase.findById(caseId)
    .populate('athleteId', 'name email avatar sport team position')
    .populate('assignedPhysio', 'name email')
    .populate('assignedCoach', 'name email');

  if (!recoveryCase) {
    throw AppError.notFound('Recovery case not found');
  }

  return recoveryCase;
};

/**
 * Get recovery cases for a specific athlete
 */
const getAthleteRecoveryCases = async (athleteId) => {
  const cases = await RecoveryCase.find({ athleteId })
    .populate('assignedPhysio', 'name email')
    .populate('assignedCoach', 'name email')
    .sort({ createdAt: -1 });

  return cases;
};

/**
 * Create a new recovery case
 */
const createRecoveryCase = async (data) => {
  // Validate athlete exists
  const athlete = await User.findById(data.athleteId);
  if (!athlete) {
    throw AppError.notFound('Athlete not found');
  }

  const recoveryCase = await RecoveryCase.create(data);

  await recoveryCase.populate('athleteId', 'name email');
  await recoveryCase.populate('assignedPhysio', 'name email');

  return recoveryCase;
};

/**
 * Update recovery case
 */
const updateRecoveryCase = async (caseId, updates) => {
  const allowedFields = [
    'injury',
    'injuryDate',
    'injuryDetails',
    'recoveryPhase',
    'recoveryStatus',
    'painScore',
    'readinessScore',
    'mobilityScore',
    'assignedPhysio',
    'assignedCoach',
    'expectedReturnDate',
    'notes',
    'rtpApproved',
    'rtpApprovedDate',
    'rtpNotes',
  ];

  const sanitized = {};
  allowedFields.forEach((field) => {
    if (field in updates) {
      sanitized[field] = updates[field];
    }
  });

  // Update pain tracking
  if (sanitized.painScore !== undefined) {
    const currentCase = await RecoveryCase.findById(caseId);
    if (currentCase) {
      sanitized.previousPainScore = currentCase.painScore;
    }
  }

  const recoveryCase = await RecoveryCase.findByIdAndUpdate(
    caseId,
    sanitized,
    { new: true, runValidators: true }
  )
    .populate('athleteId', 'name email')
    .populate('assignedPhysio', 'name email')
    .populate('assignedCoach', 'name email');

  if (!recoveryCase) {
    throw AppError.notFound('Recovery case not found');
  }

  return recoveryCase;
};

/**
 * Update recovery phase and track history
 */
const updateRecoveryPhase = async (caseId, newPhase, notes) => {
  const recoveryCase = await RecoveryCase.findById(caseId);

  if (!recoveryCase) {
    throw AppError.notFound('Recovery case not found');
  }

  // Add to phase history
  const phaseEntry = {
    phase: recoveryCase.recoveryPhase,
    endDate: new Date(),
    notes,
  };

  recoveryCase.phaseHistory.push(phaseEntry);
  recoveryCase.recoveryPhase = newPhase;

  await recoveryCase.save();

  return recoveryCase;
};

/**
 * Get RTP (Return To Play) candidates
 */
const getRTPCandidates = async (query = {}) => {
  const { limit = 20 } = query;

  const candidates = await RecoveryCase.find({
    recoveryPhase: 'Return To Play',
    recoveryStatus: 'In Progress',
    rtpApproved: false,
  })
    .populate('athleteId', 'name email avatar sport')
    .populate('assignedPhysio', 'name email')
    .limit(limit)
    .sort({ createdAt: -1 });

  // Evaluate RTP eligibility
  const evaluatedCandidates = candidates.map((candidate) => {
    const isEligible =
      candidate.painScore <= 2 &&
      candidate.compliancePercentage >= 85 &&
      candidate.readinessScore >= 80;

    return {
      ...candidate.toObject(),
      rtpStatus: isEligible ? 'Ready' : 'Review Required',
      eligibilityScore: {
        pain: candidate.painScore <= 2,
        compliance: candidate.compliancePercentage >= 85,
        readiness: candidate.readinessScore >= 80,
      },
    };
  });

  return evaluatedCandidates;
};

/**
 * Approve RTP
 */
const approveRTP = async (caseId, notes) => {
  const recoveryCase = await RecoveryCase.findByIdAndUpdate(
    caseId,
    {
      rtpApproved: true,
      rtpApprovedDate: new Date(),
      rtpNotes: notes,
      actualReturnDate: new Date(),
      recoveryStatus: 'Completed',
    },
    { new: true }
  )
    .populate('athleteId', 'name email')
    .populate('assignedPhysio', 'name email');

  if (!recoveryCase) {
    throw AppError.notFound('Recovery case not found');
  }

  return recoveryCase;
};

// ═══════════════════════════════════════════════════════════════════════════
// RECOVERY PROGRESS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get progress entries for a recovery case
 */
const getProgressEntries = async (caseId, query = {}) => {
  const { limit = 30 } = query;

  const entries = await RecoveryProgress.find({
    athleteId: caseId,
  })
    .limit(limit)
    .sort({ date: -1 });

  return entries;
};

/**
 * Create a progress entry
 */
const createProgressEntry = async (athleteId, data) => {
  const entry = await RecoveryProgress.create({
    athleteId,
    ...data,
  });

  return entry;
};

/**
 * Get pain trend data
 */
const getPainTrend = async (caseId, days = 7) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const entries = await RecoveryProgress.find({
    athleteId: caseId,
    date: { $gte: startDate },
  }).sort({ date: 1 });

  return entries.map((entry) => ({
    date: entry.date,
    painScore: entry.painScore,
  }));
};

/**
 * Get overall progress for a recovery case
 */
const getRecoveryProgress = async (caseId) => {
  const recoveryCase = await RecoveryCase.findById(caseId);

  if (!recoveryCase) {
    throw AppError.notFound('Recovery case not found');
  }

  const recentEntries = await RecoveryProgress.find({
    athleteId: caseId,
  })
    .sort({ date: -1 })
    .limit(10);

  const painTrend = recentEntries.map((e) => ({
    date: e.date,
    pain: e.painScore,
  }));

  return {
    caseInfo: recoveryCase,
    currentPain: recoveryCase.painScore,
    previousPain: recoveryCase.previousPainScore,
    painImprovement:
      recoveryCase.previousPainScore &&
      recoveryCase.painScore <= recoveryCase.previousPainScore
        ? Math.round(
            ((recoveryCase.previousPainScore - recoveryCase.painScore) /
              recoveryCase.previousPainScore) *
              100
          )
        : 0,
    painTrend,
    compliance: recoveryCase.compliancePercentage,
    readiness: recoveryCase.readinessScore,
  };
};

// ═══════════════════════════════════════════════════════════════════════════
// EXERCISES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get exercises for a recovery case
 */
const getExercisesForCase = async (caseId) => {
  const exercises = await RehabExercise.find({
    athleteId: caseId,
  }).sort({ createdAt: -1 });

  return exercises;
};

/**
 * Create exercise for athlete
 */
const createExercise = async (data) => {
  const exercise = await RehabExercise.create(data);

  // Update recovery case exercise count
  await RecoveryCase.findByIdAndUpdate(data.athleteId, {
    $inc: { assignedExercises: 1 },
  });

  return exercise;
};

/**
 * Update exercise
 */
const updateExercise = async (exerciseId, updates) => {
  const allowedFields = [
    'name',
    'type',
    'sets',
    'reps',
    'duration',
    'restPeriod',
    'instructions',
    'videoUrl',
    'scheduledDate',
    'notes',
  ];

  const sanitized = {};
  allowedFields.forEach((field) => {
    if (field in updates) {
      sanitized[field] = updates[field];
    }
  });

  const exercise = await RehabExercise.findByIdAndUpdate(
    exerciseId,
    sanitized,
    { new: true }
  );

  if (!exercise) {
    throw AppError.notFound('Exercise not found');
  }

  return exercise;
};

/**
 * Mark exercise as completed
 */
const completeExercise = async (exerciseId, data = {}) => {
  const exercise = await RehabExercise.findByIdAndUpdate(
    exerciseId,
    {
      completed: true,
      completedAt: new Date(),
      painDuringExercise: data.painDuringExercise,
      notes: data.notes,
    },
    { new: true }
  );

  if (!exercise) {
    throw AppError.notFound('Exercise not found');
  }

  // Update recovery case completed count
  const recoveryCase = await RecoveryCase.findById(
    exercise.athleteId
  );

  if (recoveryCase) {
    const totalAssigned = recoveryCase.assignedExercises;
    const completed = await RehabExercise.countDocuments({
      athleteId: exercise.athleteId,
      completed: true,
    });

    const compliance = totalAssigned
      ? Math.round((completed / totalAssigned) * 100)
      : 0;

    await RecoveryCase.findByIdAndUpdate(
      exercise.athleteId,
      {
        completedExercises: completed,
        compliancePercentage: compliance,
      }
    );
  }

  return exercise;
};

/**
 * Delete exercise
 */
const deleteExercise = async (exerciseId) => {
  const exercise = await RehabExercise.findById(exerciseId);

  if (!exercise) {
    throw AppError.notFound('Exercise not found');
  }

  await RehabExercise.findByIdAndDelete(exerciseId);

  // Update recovery case count
  await RecoveryCase.findByIdAndUpdate(exercise.athleteId, {
    $inc: { assignedExercises: -1 },
  });

  return { message: 'Exercise deleted' };
};

// ═══════════════════════════════════════════════════════════════════════════
// ANALYTICS & ALERTS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get alerts for physio
 */
const getAlerts = async (physiotherapistId) => {
  const alerts = [];

  // Get cases assigned to this physio
  const cases = await RecoveryCase.find({
    assignedPhysio: physiotherapistId,
  }).populate('athleteId', 'name email');

  for (const recoveryCase of cases) {
    // Pain increased
    if (
      recoveryCase.painScore > recoveryCase.previousPainScore
    ) {
      alerts.push({
        id: `pain_${recoveryCase._id}`,
        type: 'Pain Increased',
        priority: 'Critical',
        caseId: recoveryCase._id,
        athleteName: recoveryCase.athleteId?.name,
        message: `Pain increased from ${recoveryCase.previousPainScore} to ${recoveryCase.painScore}`,
        timestamp: new Date(),
      });
    }

    // Low compliance
    if (recoveryCase.compliancePercentage < 50) {
      alerts.push({
        id: `compliance_${recoveryCase._id}`,
        type: 'Missed Exercises',
        priority: 'Warning',
        caseId: recoveryCase._id,
        athleteName: recoveryCase.athleteId?.name,
        message: `Low compliance: ${recoveryCase.compliancePercentage}%`,
        timestamp: new Date(),
      });
    }

    // No updates
    const lastUpdate = Math.floor(
      (new Date() - recoveryCase.updatedAt) / (1000 * 60 * 60 * 24)
    );
    if (lastUpdate > 3) {
      alerts.push({
        id: `update_${recoveryCase._id}`,
        type: 'No Recovery Updates',
        priority: 'Info',
        caseId: recoveryCase._id,
        athleteName: recoveryCase.athleteId?.name,
        message: `No updates for ${lastUpdate} days`,
        timestamp: new Date(),
      });
    }

    // Recovery delayed
    if (
      recoveryCase.expectedReturnDate &&
      new Date() > recoveryCase.expectedReturnDate &&
      !recoveryCase.rtpApproved
    ) {
      alerts.push({
        id: `delayed_${recoveryCase._id}`,
        type: 'Recovery Delayed',
        priority: 'Warning',
        caseId: recoveryCase._id,
        athleteName: recoveryCase.athleteId?.name,
        message: 'Expected return date passed',
        timestamp: new Date(),
      });
    }
  }

  // Sort by priority
  const priorityOrder = { Critical: 0, Warning: 1, Info: 2 };
  alerts.sort(
    (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
  );

  return alerts;
};

/**
 * Get dashboard summary stats
 */
const getDashboardStats = async (physiotherapistId) => {
  const cases = await RecoveryCase.find({
    assignedPhysio: physiotherapistId,
  });

  const totalCases = cases.length;
  const activePlans = cases.filter(
    (c) => c.recoveryStatus === 'In Progress'
  ).length;
  const rtpCandidates = cases.filter(
    (c) =>
      c.recoveryPhase === 'Return To Play' &&
      !c.rtpApproved
  ).length;
  const overdueCases = cases.filter(
    (c) =>
      c.expectedReturnDate &&
      new Date() > c.expectedReturnDate &&
      !c.rtpApproved
  ).length;

  return {
    totalCases,
    activePlans,
    rtpCandidates,
    overdueCases,
  };
};

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
