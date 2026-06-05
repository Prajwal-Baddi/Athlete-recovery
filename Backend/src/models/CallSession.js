const mongoose = require('mongoose');

const TranscriptSchema = new mongoose.Schema({
  speaker: {
    type: String,
    enum: ['athlete', 'ai'],
    required: true,
  },

  text: {
    type: String,
    required: true,
  },

  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const CallSessionSchema = new mongoose.Schema(
  {
    athleteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AthleteProfile',
      required: true,
    },

    callSid: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: [
        'initiated',
        'active',
        'completed',
        'failed',
      ],
      default: 'initiated',
    },

    transcript: {
      type: [TranscriptSchema],
      default: [],
    },

    summary: String,

    sentiment: {
      type: String,
      enum: [
        'positive',
        'neutral',
        'negative',
      ],
      default: 'neutral',
    },

    startedAt: {
      type: Date,
      default: Date.now,
    },

    endedAt: Date,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  'CallSession',
  CallSessionSchema
);