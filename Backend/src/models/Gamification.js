const mongoose = require('mongoose');

// ─── Achievement / Badge ──────────────────────────────────────────────────────
const AchievementSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: String,
  icon: String, // emoji or icon name
  xpReward: { type: Number, default: 0 },
  category: { type: String, enum: ['recovery', 'hydration', 'sleep', 'rehab', 'streak', 'milestone'] },
  condition: {
    type: { type: String }, // 'streak', 'count', 'score'
    metric: String,
    threshold: Number
  }
});

// ─── Gamification Profile ─────────────────────────────────────────────────────
const EarnedBadgeSchema = new mongoose.Schema({
  achievementId: { type: mongoose.Schema.Types.ObjectId, ref: 'Achievement' },
  key: String,
  earnedAt: { type: Date, default: Date.now }
});

const GamificationProfileSchema = new mongoose.Schema({
  athleteId: { type: String, required: true, unique: true },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  recoveryStreak: { type: Number, default: 0 },
  hydrationStreak: { type: Number, default: 0 },
  sleepStreak: { type: Number, default: 0 },
  rehabStreak: { type: Number, default: 0 },
  lastRecoveryLog: Date,
  lastHydrationLog: Date,
  lastSleepLog: Date,
  lastRehabLog: Date,
  earnedBadges: [EarnedBadgeSchema],
  totalExercisesCompleted: { type: Number, default: 0 },
  perfectRehabWeeks: { type: Number, default: 0 },
  updatedAt: { type: Date, default: Date.now }
});

GamificationProfileSchema.methods.addXP = async function(amount) {
  this.xp += amount;
  // Level up every 500 XP
  this.level = Math.floor(this.xp / 500) + 1;
  this.updatedAt = Date.now();
  await this.save();
};

module.exports = {
  Achievement: mongoose.model('Achievement', AchievementSchema),
  GamificationProfile: mongoose.model('GamificationProfile', GamificationProfileSchema)
};
