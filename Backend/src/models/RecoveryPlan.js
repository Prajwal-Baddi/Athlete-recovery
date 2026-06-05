const mongoose = require('mongoose');

const MilestoneSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  targetDate: {
    type: Date,
    required: true,
  },

  completed: {
    type: Boolean,
    default: false,
  },

  completedDate: Date,
});

const RecoveryPlanSchema = new mongoose.Schema(
  {
    athleteId: {
      type: String,
      required: true,
      index: true,
    },

    injuryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Injury',
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    physiotherapistId: {
      type: String,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: Date,

    goals: [
      {
        type: String,
        trim: true,
      },
    ],

    milestones: [MilestoneSchema],

    exercises: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RehabExercise',
      },
    ],

    status: {
      type: String,
      enum: ['active', 'paused', 'completed'],
      default: 'active',
    },

    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  'RecoveryPlan',
  RecoveryPlanSchema
);