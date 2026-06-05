const express = require('express');

const router = express.Router();

const { protect } = require('../middleware/auth');

const recoveryController = require('../controllers/recoveryController');

/*
|--------------------------------------------------------------------------
| Recovery Plans
|--------------------------------------------------------------------------
*/

router.get(
  '/plans',
  protect,
  recoveryController.getRecoveryPlans
);

router.get(
  '/plans/:id',
  protect,
  recoveryController.getRecoveryPlan
);

router.post(
  '/plans',
  protect,
  recoveryController.createRecoveryPlan
);

router.patch(
  '/plans/:id',
  protect,
  recoveryController.updateRecoveryPlan
);

router.delete(
  '/plans/:id',
  protect,
  recoveryController.deleteRecoveryPlan
);

/*
|--------------------------------------------------------------------------
| Rehab Exercises
|--------------------------------------------------------------------------
*/

router.get(
  '/exercises',
  protect,
  recoveryController.getExercises
);

router.get(
  '/exercises/:id',
  protect,
  recoveryController.getExercise
);

router.post(
  '/exercises',
  protect,
  recoveryController.createExercise
);

router.patch(
  '/exercises/:id',
  protect,
  recoveryController.updateExercise
);

router.patch(
  '/exercises/:id/complete',
  protect,
  recoveryController.completeExercise
);

router.delete(
  '/exercises/:id',
  protect,
  recoveryController.deleteExercise
);

/*
|--------------------------------------------------------------------------
| Recovery Progress
|--------------------------------------------------------------------------
*/

router.get(
  '/progress',
  protect,
  recoveryController.getProgressEntries
);

router.get(
  '/progress/:id',
  protect,
  recoveryController.getProgressEntry
);

router.post(
  '/progress',
  protect,
  recoveryController.createProgressEntry
);

router.patch(
  '/progress/:id',
  protect,
  recoveryController.updateProgressEntry
);

router.delete(
  '/progress/:id',
  protect,
  recoveryController.deleteProgressEntry
);

module.exports = router;