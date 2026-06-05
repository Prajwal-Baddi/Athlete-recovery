const mongoose = require('mongoose');

const RecoveryProgressSchema = new mongoose.Schema(
  {
    athleteId: {
      type: String,
      required: true,
      index: true,
    },

    injuryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Injury',
    },

    date: {
      type: Date,
      default: Date.now,
    },

    painScore: {
      type: Number,
      min: 0,
      max: 10,
    },

    mobilityScore: {
      type: Number,
      min: 0,
      max: 100,
    },

    sorenessLevel: {
      type: Number,
      min: 0,
      max: 10,
    },

    exercisesCompleted: {
      type: Number,
      default: 0,
    },

    exercisesTotal: {
      type: Number,
      default: 0,
    },

    adherenceRate: {
      type: Number,
      min: 0,
      max: 100,
    },

    hydrationLiters: Number,

    sleepHours: Number,

    mood: {
      type: String,
      enum: [
        'poor',
        'fair',
        'good',
        'excellent',
      ],
    },

    notes: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  'RecoveryProgress',
  RecoveryProgressSchema
);