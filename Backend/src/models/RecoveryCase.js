const mongoose = require('mongoose');

const RECOVERY_PHASES = [
  'Acute Care',
  'Mobility',
  'Strength',
  'Functional Training',
  'Return To Play',
];

const RECOVERY_STATUS = [
  'Not Started',
  'In Progress',
  'On Hold',
  'Completed',
];

const RecoveryCaseSchema = new mongoose.Schema(
  {
    // Reference to athlete
    athleteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Athlete ID is required'],
      index: true,
    },

    // Injury details
    injury: {
      type: String,
      required: [true, 'Injury description is required'],
      trim: true,
    },

    injuryDate: {
      type: Date,
      required: [true, 'Injury date is required'],
    },

    injuryDetails: {
      type: String,
      trim: true,
    },

    // Recovery tracking
    recoveryPhase: {
      type: String,
      enum: {
        values: RECOVERY_PHASES,
        message: `Recovery phase must be one of: ${RECOVERY_PHASES.join(', ')}`,
      },
      default: 'Acute Care',
    },

    recoveryStatus: {
      type: String,
      enum: {
        values: RECOVERY_STATUS,
        message: `Recovery status must be one of: ${RECOVERY_STATUS.join(', ')}`,
      },
      default: 'Not Started',
    },

    // Pain tracking
    painScore: {
      type: Number,
      min: [0, 'Pain score must be at least 0'],
      max: [10, 'Pain score cannot exceed 10'],
      default: 0,
    },

    previousPainScore: {
      type: Number,
      min: 0,
      max: 10,
    },

    // Readiness and mobility
    readinessScore: {
      type: Number,
      min: [0, 'Readiness score must be at least 0'],
      max: [100, 'Readiness score cannot exceed 100'],
      default: 0,
    },

    mobilityScore: {
      type: Number,
      min: 0,
      max: 100,
    },

    // Exercise compliance
    assignedExercises: {
      type: Number,
      default: 0,
    },

    completedExercises: {
      type: Number,
      default: 0,
    },

    compliancePercentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    // Staff assignments
    assignedPhysio: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    assignedCoach: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    // Dates
    startDate: {
      type: Date,
      default: Date.now,
    },

    expectedReturnDate: Date,

    actualReturnDate: Date,

    // Timeline and history
    phaseHistory: [
      {
        phase: String,
        startDate: {
          type: Date,
          default: Date.now,
        },
        endDate: Date,
        notes: String,
      },
    ],

    // General notes
    notes: {
      type: String,
      trim: true,
    },

    // RTP status
    rtpApproved: {
      type: Boolean,
      default: false,
    },

    rtpApprovedDate: Date,

    rtpNotes: String,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for days in recovery
RecoveryCaseSchema.virtual('daysInRecovery').get(function () {
  return Math.floor(
    (new Date() - this.startDate) / (1000 * 60 * 60 * 24)
  );
});

// Index for common queries
RecoveryCaseSchema.index({ athleteId: 1, recoveryPhase: 1 });
RecoveryCaseSchema.index({ assignedPhysio: 1 });
RecoveryCaseSchema.index({ recoveryStatus: 1 });
RecoveryCaseSchema.index({ createdAt: -1 });

module.exports = mongoose.model(
  'RecoveryCase',
  RecoveryCaseSchema
);
