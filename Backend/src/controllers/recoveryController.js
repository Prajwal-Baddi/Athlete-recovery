const RecoveryPlan = require('../models/RecoveryPlan');
const RehabExercise = require('../models/RehabExercise');
const RecoveryProgress = require('../models/RecoveryProgress');

/*
|--------------------------------------------------------------------------
| Recovery Plans
|--------------------------------------------------------------------------
*/

exports.getRecoveryPlans = async (req, res) => {
  try {
    const { athleteId } = req.query;

    const plans = await RecoveryPlan.find({
      athleteId,
    })
      .populate('exercises')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: plans,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

exports.getRecoveryPlan = async (req, res) => {
  try {
    const plan = await RecoveryPlan.findById(
      req.params.id
    ).populate('exercises');

    res.json({
      success: true,
      data: plan,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

exports.createRecoveryPlan = async (
  req,
  res
) => {
  try {
    const plan = await RecoveryPlan.create(
      req.body
    );

    res.status(201).json({
      success: true,
      data: plan,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
};

exports.updateRecoveryPlan = async (
  req,
  res
) => {
  try {
    const plan =
      await RecoveryPlan.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

    res.json({
      success: true,
      data: plan,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
};

exports.deleteRecoveryPlan = async (
  req,
  res
) => {
  try {
    await RecoveryPlan.findByIdAndDelete(
      req.params.id
    );

    res.json({
      success: true,
      message: 'Plan deleted',
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| Exercises
|--------------------------------------------------------------------------
*/

exports.getExercises = async (
  req,
  res
) => {
  try {
    const exercises =
      await RehabExercise.find();

    res.json({
      success: true,
      data: exercises,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

exports.getExercise = async (
  req,
  res
) => {
  try {
    const exercise =
      await RehabExercise.findById(
        req.params.id
      );

    res.json({
      success: true,
      data: exercise,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

exports.createExercise = async (
  req,
  res
) => {
  try {
    const exercise =
      await RehabExercise.create(
        req.body
      );

    res.status(201).json({
      success: true,
      data: exercise,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
};

exports.updateExercise = async (
  req,
  res
) => {
  try {
    const exercise =
      await RehabExercise.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

    res.json({
      success: true,
      data: exercise,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
};

exports.completeExercise = async (
  req,
  res
) => {
  try {
    const exercise =
      await RehabExercise.findByIdAndUpdate(
        req.params.id,
        {
          completed: true,
          completedAt: new Date(),
        },
        { new: true }
      );

    res.json({
      success: true,
      data: exercise,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
};

exports.deleteExercise = async (
  req,
  res
) => {
  try {
    await RehabExercise.findByIdAndDelete(
      req.params.id
    );

    res.json({
      success: true,
      message: 'Exercise deleted',
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| Progress
|--------------------------------------------------------------------------
*/

exports.getProgressEntries = async (
  req,
  res
) => {
  try {
    const progress =
      await RecoveryProgress.find();

    res.json({
      success: true,
      data: progress,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

exports.getProgressEntry = async (
  req,
  res
) => {
  try {
    const progress =
      await RecoveryProgress.findById(
        req.params.id
      );

    res.json({
      success: true,
      data: progress,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

exports.createProgressEntry = async (
  req,
  res
) => {
  try {
    const progress =
      await RecoveryProgress.create(
        req.body
      );

    res.status(201).json({
      success: true,
      data: progress,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
};

exports.updateProgressEntry = async (
  req,
  res
) => {
  try {
    const progress =
      await RecoveryProgress.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

    res.json({
      success: true,
      data: progress,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
};

exports.deleteProgressEntry = async (
  req,
  res
) => {
  try {
    await RecoveryProgress.findByIdAndDelete(
      req.params.id
    );

    res.json({
      success: true,
      message: 'Progress deleted',
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
};