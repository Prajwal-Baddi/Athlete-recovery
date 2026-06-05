const AthleteProfile = require('../models/AthleteProfile');
const wellnessService = require('../services/wellnessService');

const getMyWellness = async (
  req,
  res
) => {
  const profile =
    await AthleteProfile.findOne({
      userId: req.user._id,
    });

  const logs =
    await wellnessService.getMyWellnessLogs(
      profile._id
    );

  res.status(200).json({
    success: true,
    data: logs,
  });
};

const createWellness = async (
  req,
  res
) => {
  const profile =
    await AthleteProfile.findOne({
      userId: req.user._id,
    });

  const log =
    await wellnessService.createWellnessLog(
      profile._id,
      req.body
    );

  res.status(201).json({
    success: true,
    data: log,
  });
};

module.exports = {
  getMyWellness,
  createWellness,
};