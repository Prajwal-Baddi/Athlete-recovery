require('dotenv').config();

const mongoose = require('mongoose');

const AthleteProfile = require('../src/models/AthleteProfile');
const WellnessLog = require('../src/models/WellnessLog');

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log('Connected');

    const athlete = await AthleteProfile.findOne();

    if (!athlete) {
      console.log(
        'No AthleteProfile found. Create an athlete account first.'
      );

      process.exit(0);
    }

    console.log(
      'Using athlete:',
      athlete._id.toString()
    );

    await WellnessLog.deleteMany({
      athleteId: athlete._id,
    });

    const today = new Date();

    const logs = [
      {
        athleteId: athlete._id,
        wearableProvider: 'whoop',
        sleepHours: 8.2,
        hrv: 76,
        restingHeartRate: 51,
        caloriesBurned: 2650,
        recoveryScore: 91,
        date: new Date(today.getTime() - 6 * 86400000),
      },
      {
        athleteId: athlete._id,
        wearableProvider: 'garmin',
        sleepHours: 7.8,
        hrv: 74,
        restingHeartRate: 52,
        caloriesBurned: 2510,
        recoveryScore: 89,
        date: new Date(today.getTime() - 5 * 86400000),
      },
      {
        athleteId: athlete._id,
        wearableProvider: 'fitbit',
        sleepHours: 7.6,
        hrv: 71,
        restingHeartRate: 54,
        caloriesBurned: 2480,
        recoveryScore: 86,
        date: new Date(today.getTime() - 4 * 86400000),
      },
      {
        athleteId: athlete._id,
        wearableProvider: 'apple-health',
        sleepHours: 8.4,
        hrv: 79,
        restingHeartRate: 50,
        caloriesBurned: 2700,
        recoveryScore: 94,
        date: new Date(today.getTime() - 3 * 86400000),
      },
      {
        athleteId: athlete._id,
        wearableProvider: 'polar',
        sleepHours: 7.9,
        hrv: 75,
        restingHeartRate: 53,
        caloriesBurned: 2590,
        recoveryScore: 90,
        date: new Date(today.getTime() - 2 * 86400000),
      },
      {
        athleteId: athlete._id,
        wearableProvider: 'whoop',
        sleepHours: 8.6,
        hrv: 82,
        restingHeartRate: 49,
        caloriesBurned: 2750,
        recoveryScore: 96,
        date: new Date(today.getTime() - 1 * 86400000),
      },
      {
        athleteId: athlete._id,
        wearableProvider: 'whoop',
        sleepHours: 8.3,
        hrv: 80,
        restingHeartRate: 50,
        caloriesBurned: 2680,
        recoveryScore: 93,
        date: today,
      },
    ];

    await WellnessLog.insertMany(logs);

    console.log(
      `Inserted ${logs.length} wellness logs`
    );

    process.exit(0);
  } catch (err) {
    console.error(err);

    process.exit(1);
  }
}

seed();