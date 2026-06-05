const express = require('express');
const router = express.Router();
const { GamificationProfile, Achievement } = require('../models/GamificationModels');

const STREAK_XP = 15;
const BADGE_XP_BONUS = 50;

// Helper: check and award badges
async function checkAndAwardBadges(profile) {
  const allAchievements = await Achievement.find();
  const earnedKeys = profile.earnedBadges.map(b => b.key);
  const newBadges = [];

  for (const achievement of allAchievements) {
    if (earnedKeys.includes(achievement.key)) continue;
    let earned = false;
    const { condition } = achievement;
    if (!condition) continue;

    switch (condition.type) {
      case 'streak':
        if (condition.metric === 'recovery' && profile.recoveryStreak >= condition.threshold) earned = true;
        if (condition.metric === 'hydration' && profile.hydrationStreak >= condition.threshold) earned = true;
        if (condition.metric === 'sleep' && profile.sleepStreak >= condition.threshold) earned = true;
        if (condition.metric === 'rehab' && profile.rehabStreak >= condition.threshold) earned = true;
        break;
      case 'count':
        if (condition.metric === 'exercises' && profile.totalExercisesCompleted >= condition.threshold) earned = true;
        if (condition.metric === 'perfectWeeks' && profile.perfectRehabWeeks >= condition.threshold) earned = true;
        break;
    }

    if (earned) {
      profile.earnedBadges.push({ achievementId: achievement._id, key: achievement.key });
      profile.xp += (achievement.xpReward || 0) + BADGE_XP_BONUS;
      newBadges.push(achievement);
    }
  }
  return newBadges;
}

// GET /api/gamification/:athleteId
router.get('/:athleteId', async (req, res) => {
  try {
    let profile = await GamificationProfile.findOne({ athleteId: req.params.athleteId })
      .populate('earnedBadges.achievementId');
    if (!profile) {
      profile = new GamificationProfile({ athleteId: req.params.athleteId });
      await profile.save();
    }
    res.json({ success: true, data: profile });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/gamification/:athleteId/log-streak
router.post('/:athleteId/log-streak', async (req, res) => {
  try {
    const { type } = req.body; // 'recovery' | 'hydration' | 'sleep' | 'rehab'
    let profile = await GamificationProfile.findOne({ athleteId: req.params.athleteId });
    if (!profile) profile = new GamificationProfile({ athleteId: req.params.athleteId });

    const now = new Date();
    const lastKey = `last${type.charAt(0).toUpperCase() + type.slice(1)}Log`;
    const streakKey = `${type}Streak`;
    const last = profile[lastKey];
    const dayDiff = last ? Math.floor((now - last) / (1000 * 60 * 60 * 24)) : null;

    if (dayDiff === null || dayDiff >= 1 && dayDiff <= 1) {
      profile[streakKey] = (profile[streakKey] || 0) + 1;
    } else if (dayDiff > 1) {
      profile[streakKey] = 1; // reset streak
    }

    profile[lastKey] = now;
    profile.xp += STREAK_XP;
    profile.level = Math.floor(profile.xp / 500) + 1;
    profile.updatedAt = now;

    const newBadges = await checkAndAwardBadges(profile);
    await profile.save();

    res.json({ success: true, data: profile, newBadges });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// POST /api/gamification/:athleteId/add-xp
router.post('/:athleteId/add-xp', async (req, res) => {
  try {
    const { amount, reason } = req.body;
    let profile = await GamificationProfile.findOne({ athleteId: req.params.athleteId });
    if (!profile) profile = new GamificationProfile({ athleteId: req.params.athleteId });
    profile.xp += amount;
    profile.level = Math.floor(profile.xp / 500) + 1;
    profile.updatedAt = new Date();
    await profile.save();
    res.json({ success: true, data: profile, reason });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// GET /api/gamification/achievements/all
router.get('/achievements/all', async (req, res) => {
  try {
    const achievements = await Achievement.find();
    res.json({ success: true, data: achievements });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
