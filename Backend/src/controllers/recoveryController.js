const express = require('express');
const router = express.Router();
const { RecoveryPlan, RehabExercise, RecoveryProgress } = require('../models/RecoveryModels');

// ─── Recovery Plans ───────────────────────────────────────────────────────────
router.get('/plans', async (req, res) => {
  try {
    const { athleteId } = req.query;
    const plans = await RecoveryPlan.find({ athleteId })
      .populate('exercises')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: plans });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/plans', async (req, res) => {
  try {
    const plan = new RecoveryPlan(req.body);
    await plan.save();
    res.status(201).json({ success: true, data: plan });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

router.patch('/plans/:id', async (req, res) => {
  try {
    const plan = await RecoveryPlan.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: plan });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

router.patch('/plans/:id/milestone/:milestoneId', async (req, res) => {
  try {
    const plan = await RecoveryPlan.findById(req.params.id);
    const milestone = plan.milestones.id(req.params.milestoneId);
    if (milestone) {
      milestone.completed = true;
      milestone.completedDate = new Date();
    }
    await plan.save();
    res.json({ success: true, data: plan });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// ─── Rehab Exercises ──────────────────────────────────────────────────────────
router.get('/exercises', async (req, res) => {
  try {
    const { athleteId, planId, scheduledDate } = req.query;
    const filter = {};
    if (athleteId) filter.athleteId = athleteId;
    if (planId) filter.planId = planId;
    if (scheduledDate) {
      const start = new Date(scheduledDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(scheduledDate);
      end.setHours(23, 59, 59, 999);
      filter.scheduledDate = { $gte: start, $lte: end };
    }
    const exercises = await RehabExercise.find(filter).sort({ scheduledDate: 1 });
    res.json({ success: true, data: exercises });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/exercises', async (req, res) => {
  try {
    const exercise = new RehabExercise(req.body);
    await exercise.save();
    res.status(201).json({ success: true, data: exercise });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

router.patch('/exercises/:id/complete', async (req, res) => {
  try {
    const exercise = await RehabExercise.findByIdAndUpdate(
      req.params.id,
      { completed: true, completedAt: new Date(), ...req.body },
      { new: true }
    );
    res.json({ success: true, data: exercise });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// ─── Recovery Progress Logging ────────────────────────────────────────────────
router.get('/progress', async (req, res) => {
  try {
    const { athleteId, injuryId, days = 30 } = req.query;
    const filter = {};
    if (athleteId) filter.athleteId = athleteId;
    if (injuryId) filter.injuryId = injuryId;
    const since = new Date();
    since.setDate(since.getDate() - parseInt(days));
    filter.date = { $gte: since };
    const progress = await RecoveryProgress.find(filter).sort({ date: 1 });
    res.json({ success: true, data: progress });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/progress', async (req, res) => {
  try {
    const entry = new RecoveryProgress(req.body);
    await entry.save();
    res.status(201).json({ success: true, data: entry });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// RTP Status - aggregated readiness
router.get('/rtp-status/:athleteId', async (req, res) => {
  try {
    const recent = await RecoveryProgress.find({ athleteId: req.params.athleteId })
      .sort({ date: -1 }).limit(7);
    if (!recent.length) return res.json({ success: true, data: { rtpScore: 0, status: 'insufficient-data' } });
    const avgPain = recent.reduce((s, r) => s + (r.painScore || 0), 0) / recent.length;
    const avgMobility = recent.reduce((s, r) => s + (r.mobilityScore || 0), 0) / recent.length;
    const avgAdherence = recent.reduce((s, r) => s + (r.adherenceRate || 0), 0) / recent.length;
    const rtpScore = Math.round(((10 - avgPain) / 10 * 40) + (avgMobility / 100 * 40) + (avgAdherence / 100 * 20));
    const status = rtpScore >= 80 ? 'ready' : rtpScore >= 60 ? 'near-ready' : rtpScore >= 40 ? 'progressing' : 'not-ready';
    res.json({ success: true, data: { rtpScore, status, avgPain, avgMobility, avgAdherence } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
