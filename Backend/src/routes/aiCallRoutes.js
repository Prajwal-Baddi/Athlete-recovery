const express = require('express');

const router = express.Router();

const aiCallController =
  require('../controllers/aiCallController');

router.post(
  '/start',
  aiCallController.startCall
);

router.post(
  '/welcome',
  aiCallController.welcome
);

router.post(
  '/process',
  aiCallController.processSpeech
);

module.exports = router;