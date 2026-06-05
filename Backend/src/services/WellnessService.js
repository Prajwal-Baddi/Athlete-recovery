const WellnessLog = require('../models/WellnessLog');

const getMyWellnessLogs = async (athleteId) => {
  return WellnessLog.find({
    athleteId,
  })
    .sort({ createdAt: -1 })
    .limit(30);
};

const createWellnessLog = async (
  athleteId,
  payload
) => {
  return WellnessLog.create({
    athleteId,
    ...payload,
  });
};

const getLatestWellness = async (
  athleteId
) => {
  return WellnessLog.findOne({
    athleteId,
  }).sort({
    createdAt: -1,
  });
};

module.exports = {
  getMyWellnessLogs,
  createWellnessLog,
  getLatestWellness,
};