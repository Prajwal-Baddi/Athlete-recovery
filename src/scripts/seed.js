/**
 * Seeder — populates MongoDB with realistic dev/test data.
 *
 * Usage:
 *   node src/scripts/seed.js          # seed the database
 *   node src/scripts/seed.js --clear  # wipe all seeded collections
 *
 * NEVER run against production.
 */

require('dotenv').config();
const mongoose      = require('mongoose');
const bcrypt        = require('bcryptjs');
const connectDB     = require('../config/database');
const { User, AthleteProfile, Notification } = require('../models');

// ─── Seed data ────────────────────────────────────────────────────────────────

const SALT_ROUNDS = 10;
const DEFAULT_PASSWORD = 'Password123'; // bcrypt hashed below

const users = [
  // Coaches
  { name: 'Coach Marcus Webb',    email: 'coach1@dev.local',   role: 'coach'           },
  { name: 'Coach Priya Sharma',   email: 'coach2@dev.local',   role: 'coach'           },

  // Physiotherapists
  { name: 'Dr. Elena Rodriguez',  email: 'physio1@dev.local',  role: 'physiotherapist' },
  { name: 'Dr. James Okafor',     email: 'physio2@dev.local',  role: 'physiotherapist' },

  // Athletes
  { name: 'Luca Martinelli',      email: 'athlete1@dev.local', role: 'athlete'         },
  { name: 'Amara Nwosu',          email: 'athlete2@dev.local', role: 'athlete'         },
  { name: 'Tom Bergkamp',         email: 'athlete3@dev.local', role: 'athlete'         },
  { name: 'Sofia Andreou',        email: 'athlete4@dev.local', role: 'athlete'         },
  { name: 'Kenji Watanabe',       email: 'athlete5@dev.local', role: 'athlete'         },
];

const athleteProfiles = (userMap) => [
  {
    userId:         userMap['athlete1@dev.local'],
    sport:          'Football',
    team:           'City FC',
    position:       'Midfielder',
    age:            24,
    height:         178,
    weight:         74,
    recoveryStatus: 'recovering',
    assignedPhysio: userMap['physio1@dev.local'],
    assignedCoach:  userMap['coach1@dev.local'],
    readinessScore: { value: 68, lastUpdated: new Date() },
    injuries: [
      {
        bodyPart:     'Left Knee',
        description:  'Grade II MCL sprain sustained during training match',
        severity:     'moderate',
        isActive:     true,
        dateOccurred: new Date('2024-09-15'),
      },
    ],
    emergencyContact: {
      name: 'Giulia Martinelli', relationship: 'Sister',
      phone: '+39 02 1234567', email: 'giulia@example.com',
    },
  },
  {
    userId:         userMap['athlete2@dev.local'],
    sport:          'Basketball',
    team:           'Metro Wolves',
    position:       'Point Guard',
    age:            22,
    height:         183,
    weight:         79,
    recoveryStatus: 'active',
    assignedPhysio: userMap['physio1@dev.local'],
    assignedCoach:  userMap['coach1@dev.local'],
    readinessScore: { value: 91, lastUpdated: new Date() },
    injuries: [],
  },
  {
    userId:         userMap['athlete3@dev.local'],
    sport:          'Rugby',
    team:           'Northern Lions',
    position:       'Flanker',
    age:            27,
    height:         188,
    weight:         102,
    recoveryStatus: 'injured',
    assignedPhysio: userMap['physio2@dev.local'],
    assignedCoach:  userMap['coach2@dev.local'],
    readinessScore: { value: 32, lastUpdated: new Date() },
    injuries: [
      {
        bodyPart:     'Right Shoulder',
        description:  'Rotator cuff tear — surgery completed',
        severity:     'severe',
        isActive:     true,
        dateOccurred: new Date('2024-08-02'),
      },
      {
        bodyPart:     'Left Ankle',
        description:  'Grade I sprain — fully resolved',
        severity:     'minor',
        isActive:     false,
        dateOccurred: new Date('2024-05-10'),
        dateResolved: new Date('2024-05-24'),
      },
    ],
    emergencyContact: {
      name: 'Rachel Bergkamp', relationship: 'Partner',
      phone: '+44 7700 900123', email: 'rachel@example.com',
    },
  },
  {
    userId:         userMap['athlete4@dev.local'],
    sport:          'Swimming',
    team:           'Aqua Elite',
    position:       'Freestyle',
    age:            20,
    height:         170,
    weight:         62,
    recoveryStatus: 'cleared',
    assignedPhysio: userMap['physio2@dev.local'],
    assignedCoach:  userMap['coach2@dev.local'],
    readinessScore: { value: 95, lastUpdated: new Date() },
    injuries: [],
  },
  {
    userId:         userMap['athlete5@dev.local'],
    sport:          'Tennis',
    team:           'National Squad',
    position:       null,
    age:            26,
    height:         181,
    weight:         77,
    recoveryStatus: 'resting',
    assignedPhysio: userMap['physio1@dev.local'],
    assignedCoach:  userMap['coach1@dev.local'],
    readinessScore: { value: 77, lastUpdated: new Date() },
    injuries: [
      {
        bodyPart:     'Right Elbow',
        description:  'Tennis elbow (lateral epicondylitis)',
        severity:     'moderate',
        isActive:     true,
        dateOccurred: new Date('2024-10-01'),
      },
    ],
  },
];

const makeNotifications = (userMap, profileMap) => [
  {
    recipientId: userMap['athlete1@dev.local'],
    title:       'Recovery Update',
    message:     'Your MCL recovery is progressing well. New exercises added to your plan.',
    type:        'recovery_update',
    priority:    'medium',
    senderId:    userMap['physio1@dev.local'],
    isRead:      false,
  },
  {
    recipientId: userMap['athlete1@dev.local'],
    title:       'Readiness Score Alert',
    message:     'Your readiness score dropped to 68. Please check your recovery plan.',
    type:        'readiness_alert',
    priority:    'high',
    senderId:    null,
    isRead:      false,
  },
  {
    recipientId: userMap['athlete3@dev.local'],
    title:       'Physio Message',
    message:     'Post-surgery exercises are updated. Please review before your next session.',
    type:        'physio_message',
    priority:    'high',
    senderId:    userMap['physio2@dev.local'],
    isRead:      false,
  },
  {
    recipientId: userMap['coach1@dev.local'],
    title:       'Injury Risk Alert',
    message:     'Luca Martinelli\'s readiness score has dropped below 70. Review recommended.',
    type:        'coach_alert',
    priority:    'high',
    senderId:    null,
    isRead:      false,
  },
  {
    recipientId: userMap['physio1@dev.local'],
    title:       'New Athlete Assigned',
    message:     'Kenji Watanabe has been assigned to you for recovery monitoring.',
    type:        'system',
    priority:    'medium',
    senderId:    null,
    isRead:      true,
    readAt:      new Date(),
  },
];

// ─── Main ─────────────────────────────────────────────────────────────────────

const clearData = async () => {
  await User.deleteMany({});
  await AthleteProfile.deleteMany({});
  await Notification.deleteMany({});
  console.log('🗑️  All seeded data cleared');
};

const seedData = async () => {
  const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, SALT_ROUNDS);

  // Create users
  const createdUsers = await User.insertMany(
    users.map((u) => ({ ...u, password: hashedPassword }))
  );

  // Build email → _id lookup
  const userMap = {};
  createdUsers.forEach((u) => { userMap[u.email] = u._id; });

  // Create athlete profiles
  const profiles = athleteProfiles(userMap);
  const createdProfiles = await AthleteProfile.insertMany(profiles);

  // Build userId → profileId lookup
  const profileMap = {};
  createdProfiles.forEach((p) => { profileMap[p.userId.toString()] = p._id; });

  // Create notifications
  await Notification.insertMany(makeNotifications(userMap, profileMap));

  console.log('\n✅ Database seeded successfully!\n');
  console.log('─'.repeat(50));
  console.log('Default password for all accounts:', DEFAULT_PASSWORD);
  console.log('─'.repeat(50));
  console.log('\nAccounts created:');
  createdUsers.forEach((u) =>
    console.log(`  ${u.role.padEnd(18)} ${u.email}`)
  );
  console.log('');
};

const run = async () => {
  try {
    await connectDB();

    const shouldClear = process.argv.includes('--clear');

    if (shouldClear) {
      await clearData();
    } else {
      // Clear first to avoid duplicates on re-runs
      await clearData();
      await seedData();
    }

    process.exit(0);
  } catch (err) {
    console.error('Seeder error:', err.message);
    process.exit(1);
  }
};

run();
