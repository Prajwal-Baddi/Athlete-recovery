require('dotenv').config();

const mongoose = require('mongoose');

const connectDB = require('../src/config/database');
const AthleteProfile = require('../src/models/AthleteProfile');
const User = require('../src/models/User');

async function seed() {
  try {
    await connectDB();

    console.log('Connected to MongoDB');

    const athletes = await AthleteProfile.find();

    console.log(`Found ${athletes.length} athletes`);

    if (!athletes.length) {
      console.log('No athlete profiles found');
      process.exit(0);
    }

    const coach = await User.findOne({
      role: 'coach',
    });

    const physio = await User.findOne({
      role: 'physiotherapist',
    });

    if (!coach) {
      throw new Error('Coach user not found');
    }

    if (!physio) {
      throw new Error('Physiotherapist user not found');
    }

    const readinessScores = [92, 88, 76, 63, 51, 35];

    const positions = [
      'Forward',
      'Midfielder',
      'Defender',
      'Goalkeeper',
      'Winger',
      'Striker',
    ];

    for (let i = 0; i < athletes.length; i++) {
      const athlete = athletes[i];

      const readiness =
        readinessScores[i] ||
        Math.floor(Math.random() * 50) + 50;

      let recoveryStatus = 'active';

      if (readiness < 60) {
        recoveryStatus = 'injured';
      } else if (readiness < 80) {
        recoveryStatus = 'recovering';
      }

      const injuries = [];

      // Athlete #5
      if (i === 4) {
        injuries.push({
          bodyPart: 'Hamstring',
          description: 'Grade 1 Hamstring Strain',
          severity: 'moderate',
          dateOccurred: new Date(),
          isActive: true,
          notes: 'Rehabilitation in progress',
        });
      }

      // Athlete #6
      if (i === 5) {
        injuries.push({
          bodyPart: 'Knee',
          description: 'MCL Sprain',
          severity: 'severe',
          dateOccurred: new Date(),
          isActive: true,
          notes: 'Return-to-play program started',
        });
      }

      await AthleteProfile.findByIdAndUpdate(
        athlete._id,
        {
          sport: 'Football',
          team: 'Apex FC',
          position: positions[i] || 'Athlete',

          age: 20 + i,
          height: 170 + i * 2,
          weight: 68 + i * 2,

          recoveryStatus,

          assignedCoach: coach._id,
          assignedPhysio: physio._id,

          readinessScore: {
            value: readiness,
            lastUpdated: new Date(),
          },

          injuries,

          tags: ['dashboard', 'demo'],
        }
      );

      console.log(
        `✓ Athlete ${i + 1} updated (readiness ${readiness})`
      );
    }

    console.log('\nSeed completed successfully');

    await mongoose.connection.close();

    process.exit(0);
  } catch (err) {
    console.error(err);

    await mongoose.connection.close();

    process.exit(1);
  }
}

seed();