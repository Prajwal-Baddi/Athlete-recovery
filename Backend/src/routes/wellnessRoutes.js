const express = require('express');

const {
  getMyWellness,
  createWellness,
} = require('../controllers/wellnessController');

const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/me', getMyWellness);
router.post('/me', createWellness);

module.exports = router;