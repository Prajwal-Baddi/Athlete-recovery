const mongoose = require('mongoose');

const WellnessLogSchema = new mongoose.Schema(
  {
    athleteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AthleteProfile',
      required: true,
      index: true,
    },

    wearableProvider: {
      type: String,
      enum: [
        'apple-health',
        'fitbit',
        'garmin',
        'whoop',
        'polar',
        'manual',
      ],
      default: 'manual',
    },

    sleepHours: {
      type: Number,
      required: true,
    },

    hrv: Number,

    restingHeartRate: Number,

    caloriesBurned: Number,

    recoveryScore: {
      type: Number,
      min: 0,
      max: 100,
    },

    notes: String,

    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  'WellnessLog',
  WellnessLogSchema
);