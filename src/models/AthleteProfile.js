const mongoose = require('mongoose');

const RECOVERY_STATUSES = ['active', 'recovering', 'injured', 'resting', 'cleared'];
const INJURY_SEVERITIES = ['minor', 'moderate', 'severe'];

const injurySchema = new mongoose.Schema(
  {
    bodyPart: {
      type: String,
      required: [true, 'Body part is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    severity: {
      type: String,
      enum: INJURY_SEVERITIES,
      default: 'minor',
    },
    dateOccurred: { type: Date },
    dateResolved: { type: Date },
    isActive: {
      type: Boolean,
      default: true,
    },
    notes: { type: String, maxlength: [1000, 'Notes cannot exceed 1000 characters'] },
  },
  { _id: true, timestamps: true }
);

const emergencyContactSchema = new mongoose.Schema(
  {
    name:         { type: String, trim: true },
    relationship: { type: String, trim: true },
    phone:        { type: String, trim: true },
    email:        { type: String, lowercase: true, trim: true },
  },
  { _id: false }
);

const athleteProfileSchema = new mongoose.Schema(
  {
    // Primary FK — links to User document
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      unique: true,
      index: true,
    },

    // Sport & team
    sport:    { type: String, trim: true, maxlength: [100, 'Sport name too long'] },
    team:     { type: String, trim: true, maxlength: [100, 'Team name too long'] },
    position: { type: String, trim: true, maxlength: [100, 'Position name too long'] },

    // Physical attributes
    age:    { type: Number, min: [10, 'Age must be ≥ 10'], max: [100, 'Age must be ≤ 100'] },
    height: { type: Number, min: 0, comment: 'cm' },
    weight: { type: Number, min: 0, comment: 'kg' },

    // Injury history
    injuries: {
      type: [injurySchema],
      default: [],
    },

    // Current recovery status
    recoveryStatus: {
      type: String,
      enum: RECOVERY_STATUSES,
      default: 'active',
    },

    // Emergency contact
    emergencyContact: {
      type: emergencyContactSchema,
      default: () => ({}),
    },

    // AI readiness score (0–100) — managed by AI module, stored here for queries
    readinessScore: {
      value:       { type: Number, min: 0, max: 100, default: null },
      lastUpdated: { type: Date, default: null },
    },

    // Assigned staff (cross-module references)
    assignedPhysio: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    assignedCoach: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },

    // Metadata tags for AI/analytics modules
    tags: { type: [String], default: [] },

    notes: {
      type: String,
      maxlength: [2000, 'Notes cannot exceed 2000 characters'],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ─── Virtuals ────────────────────────────────────────────────────────────────
athleteProfileSchema.virtual('activeInjuries').get(function () {
  return this.injuries.filter((i) => i.isActive);
});

athleteProfileSchema.virtual('hasActiveInjury').get(function () {
  return this.injuries.some((i) => i.isActive);
});

// ─── Indexes ─────────────────────────────────────────────────────────────────
athleteProfileSchema.index({ sport: 1 });
athleteProfileSchema.index({ recoveryStatus: 1 });
athleteProfileSchema.index({ assignedPhysio: 1 });
athleteProfileSchema.index({ assignedCoach: 1 });
athleteProfileSchema.index({ 'readinessScore.value': 1 });

// ─── Static constants (exported for other modules) ───────────────────────────
athleteProfileSchema.statics.RECOVERY_STATUSES = RECOVERY_STATUSES;
athleteProfileSchema.statics.INJURY_SEVERITIES = INJURY_SEVERITIES;

const AthleteProfile = mongoose.model('AthleteProfile', athleteProfileSchema);
module.exports = AthleteProfile;
