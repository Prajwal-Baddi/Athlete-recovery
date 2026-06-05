const mongoose = require('mongoose');

const RehabExerciseSchema = new mongoose.Schema(
  {
    athleteId: {
      type: String,
      required: true,
      index: true,
    },

    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RecoveryPlan',
    },

    injuryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Injury',
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: [
        'stretch',
        'strengthening',
        'cardio',
        'mobility',
        'balance',
      ],
      required: true,
    },

    sets: {
      type: Number,
      default: 0,
    },

    reps: {
      type: Number,
      default: 0,
    },

    duration: {
      type: Number,
      default: 0,
    },

    restPeriod: {
      type: Number,
      default: 0,
    },

    instructions: String,

    videoUrl: String,

    scheduledDate: Date,

    completed: {
      type: Boolean,
      default: false,
    },

    completedAt: Date,

    painDuringExercise: {
      type: Number,
      min: 0,
      max: 10,
    },

    notes: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  'RehabExercise',
  RehabExerciseSchema
);