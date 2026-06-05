/**
 * Integration Test Runner
 *
 * Spins up the full Express+Socket.IO server against a
 * dedicated test MongoDB database, runs all suites in order,
 * then tears everything down.
 *
 * Usage:
 *   node src/tests/runner.js
 *
 * Prerequisites:
 *   - MongoDB running locally (or TEST_MONGO_URI set)
 *   - .env.test file OR environment variables set
 */

'use strict';

// ─── Test environment setup ──────────────────────────────────────────────────
process.env.NODE_ENV         = 'test';
process.env.TEST_PORT        = process.env.TEST_PORT || '5001';
process.env.PORT             = process.env.TEST_PORT;
process.env.MONGO_URI        = process.env.TEST_MONGO_URI || 'mongodb://localhost:27017/athlete_recovery_test';
process.env.JWT_ACCESS_SECRET  = 'test_access_secret_for_integration_tests_only';
process.env.JWT_REFRESH_SECRET = 'test_refresh_secret_for_integration_tests_only';
process.env.JWT_ACCESS_EXPIRES_IN  = '15m';
process.env.JWT_REFRESH_EXPIRES_IN = '7d';
process.env.BCRYPT_SALT_ROUNDS     = '4'; // Fast hashing for tests
process.env.ALLOWED_ORIGINS        = 'http://localhost:3000';
process.env.CLOUDINARY_CLOUD_NAME  = 'test';
process.env.CLOUDINARY_API_KEY     = 'test';
process.env.CLOUDINARY_API_SECRET  = 'test';
process.env.RATE_LIMIT_MAX_REQUESTS = '1000'; // Don't rate-limit tests

const http     = require('http');
const mongoose = require('mongoose');
const app      = require('../app');
const { initSocket } = require('../socket/socketManager');
const { printSummary } = require('./testUtils');

// Test suites
const runAuthTests         = require('./auth.test');
const runUserTests         = require('./user.test');
const runAthleteTests      = require('./athlete.test');
const runNotificationTests = require('./notification.test');
const runRbacTests         = require('./rbac.test');
const runSecurityTests     = require('./security.test');

// ─── Server lifecycle ─────────────────────────────────────────────────────────

let server;

const startTestServer = () =>
  new Promise((resolve, reject) => {
    mongoose
      .connect(process.env.MONGO_URI)
      .then(() => {
        console.log('✅ Test DB connected');
        const httpServer = http.createServer(app);
        initSocket(httpServer);
        server = httpServer.listen(process.env.TEST_PORT, () => {
          console.log(`✅ Test server on port ${process.env.TEST_PORT}\n`);
          resolve();
        });
      })
      .catch(reject);
  });

const stopTestServer = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await new Promise((resolve) => server.close(resolve));
};

// ─── Run ─────────────────────────────────────────────────────────────────────

const run = async () => {
  console.log('═'.repeat(50));
  console.log('  ATHLETE RECOVERY — INTEGRATION TEST SUITE');
  console.log('═'.repeat(50));

  try {
    await startTestServer();

    // Suites share context — each suite receives and returns ctx
    // so tokens and IDs flow through the chain.
    let ctx = {};
    ctx = await runAuthTests(ctx);
    ctx = await runUserTests(ctx);
    ctx = await runAthleteTests(ctx);
    ctx = await runNotificationTests(ctx);
    ctx = await runRbacTests(ctx);
    ctx = await runSecurityTests(ctx);

    const allPassed = printSummary();

    await stopTestServer();
    process.exit(allPassed ? 0 : 1);

  } catch (err) {
    console.error('\n💥 Test runner crashed:', err);
    if (server) server.close();
    await mongoose.connection.close().catch(() => {});
    process.exit(1);
  }
};

run();
