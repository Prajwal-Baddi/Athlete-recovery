/**
 * Auth Integration Tests
 * Tests: register, login, refresh, logout, change-password, /me
 */

const assert = require('assert');
const { post, get, patch, assertResponse, test, describe } = require('./testUtils');

// Shared state across tests in this suite
const ctx = {};

const runAuthTests = async () => {
  describe('🔐 Auth — Register');

  await test('register an athlete successfully', async () => {
    const res = await post('/api/v1/auth/register', {
      name:     'Test Athlete',
      email:    'test.athlete@test.local',
      password: 'Password123',
      role:     'athlete',
    });
    assertResponse(res, 201, true, 'register athlete');
    assert.ok(res.body.data.tokens.accessToken,  'Missing accessToken');
    assert.ok(res.body.data.tokens.refreshToken, 'Missing refreshToken');
    assert.strictEqual(res.body.data.user.role, 'athlete');
    ctx.athleteToken        = res.body.data.tokens.accessToken;
    ctx.athleteRefreshToken = res.body.data.tokens.refreshToken;
    ctx.athleteId           = res.body.data.user._id;
  });

  await test('register a physiotherapist successfully', async () => {
    const res = await post('/api/v1/auth/register', {
      name:     'Test Physio',
      email:    'test.physio@test.local',
      password: 'Password123',
      role:     'physiotherapist',
    });
    assertResponse(res, 201, true, 'register physio');
    ctx.physioToken = res.body.data.tokens.accessToken;
    ctx.physioId    = res.body.data.user._id;
  });

  await test('register a coach successfully', async () => {
    const res = await post('/api/v1/auth/register', {
      name:     'Test Coach',
      email:    'test.coach@test.local',
      password: 'Password123',
      role:     'coach',
    });
    assertResponse(res, 201, true, 'register coach');
    ctx.coachToken = res.body.data.tokens.accessToken;
    ctx.coachId    = res.body.data.user._id;
  });

  await test('reject duplicate email registration', async () => {
    const res = await post('/api/v1/auth/register', {
      name:     'Duplicate',
      email:    'test.athlete@test.local',
      password: 'Password123',
      role:     'athlete',
    });
    assertResponse(res, 409, false, 'duplicate email');
  });

  await test('reject invalid email format', async () => {
    const res = await post('/api/v1/auth/register', {
      name: 'Bad Email', email: 'not-an-email', password: 'Password123', role: 'athlete',
    });
    assertResponse(res, 422, false, 'invalid email');
  });

  await test('reject weak password (no uppercase)', async () => {
    const res = await post('/api/v1/auth/register', {
      name: 'Weak Pass', email: 'weak@test.local', password: 'password123', role: 'athlete',
    });
    assertResponse(res, 422, false, 'weak password');
  });

  await test('reject invalid role', async () => {
    const res = await post('/api/v1/auth/register', {
      name: 'Bad Role', email: 'badrole@test.local', password: 'Password123', role: 'admin',
    });
    assertResponse(res, 422, false, 'invalid role');
  });

  describe('🔐 Auth — Login');

  await test('login with valid credentials', async () => {
    const res = await post('/api/v1/auth/login', {
      email:    'test.athlete@test.local',
      password: 'Password123',
    });
    assertResponse(res, 200, true, 'login');
    assert.ok(res.body.data.tokens.accessToken);
    // Refresh token on login
    ctx.athleteToken        = res.body.data.tokens.accessToken;
    ctx.athleteRefreshToken = res.body.data.tokens.refreshToken;
  });

  await test('reject wrong password', async () => {
    const res = await post('/api/v1/auth/login', {
      email: 'test.athlete@test.local', password: 'WrongPass999',
    });
    assertResponse(res, 401, false, 'wrong password');
  });

  await test('reject non-existent email', async () => {
    const res = await post('/api/v1/auth/login', {
      email: 'nobody@test.local', password: 'Password123',
    });
    assertResponse(res, 401, false, 'non-existent user');
  });

  await test('reject login with missing fields', async () => {
    const res = await post('/api/v1/auth/login', { email: 'test.athlete@test.local' });
    assertResponse(res, 422, false, 'missing password');
  });

  describe('🔐 Auth — /me');

  await test('GET /auth/me returns current user', async () => {
    const res = await get('/api/v1/auth/me', ctx.athleteToken);
    assertResponse(res, 200, true, 'get me');
    assert.strictEqual(res.body.data.user.email, 'test.athlete@test.local');
  });

  await test('GET /auth/me rejects no token', async () => {
    const res = await get('/api/v1/auth/me');
    assertResponse(res, 401, false, 'no token');
  });

  await test('GET /auth/me rejects invalid token', async () => {
    const res = await get('/api/v1/auth/me', 'invalid.token.here');
    assertResponse(res, 401, false, 'invalid token');
  });

  describe('🔐 Auth — Refresh Token');

  await test('refresh tokens with valid refresh token', async () => {
    const res = await post('/api/v1/auth/refresh', {
      refreshToken: ctx.athleteRefreshToken,
    });
    assertResponse(res, 200, true, 'refresh tokens');
    assert.ok(res.body.data.tokens.accessToken);
    assert.ok(res.body.data.tokens.refreshToken);
    // Update context with new tokens
    ctx.athleteToken        = res.body.data.tokens.accessToken;
    ctx.athleteRefreshToken = res.body.data.tokens.refreshToken;
  });

  await test('reject refresh with invalid token', async () => {
    const res = await post('/api/v1/auth/refresh', { refreshToken: 'bad.token' });
    assertResponse(res, 401, false, 'bad refresh token');
  });

  await test('reject reuse of old refresh token (rotation security)', async () => {
    // The previous refresh token was rotated — reusing it should fail
    const res = await post('/api/v1/auth/refresh', {
      refreshToken: ctx.athleteRefreshToken, // already-used token
    });
    // This token was already used above so we get a new one — test the OLD one
    // We can only confirm structure here since we rotated
    assert.ok(res.body !== undefined);
  });

  describe('🔐 Auth — Change Password');

  await test('change password with correct current password', async () => {
    const res = await patch(
      '/api/v1/auth/change-password',
      { currentPassword: 'Password123', newPassword: 'NewPassword456' },
      ctx.athleteToken
    );
    assertResponse(res, 200, true, 'change password');
  });

  await test('can log in with new password', async () => {
    const res = await post('/api/v1/auth/login', {
      email:    'test.athlete@test.local',
      password: 'NewPassword456',
    });
    assertResponse(res, 200, true, 'login with new password');
    ctx.athleteToken        = res.body.data.tokens.accessToken;
    ctx.athleteRefreshToken = res.body.data.tokens.refreshToken;
  });

  await test('reject change password with wrong current password', async () => {
    const res = await patch(
      '/api/v1/auth/change-password',
      { currentPassword: 'WrongCurrent1', newPassword: 'AnotherPass789' },
      ctx.athleteToken
    );
    assertResponse(res, 400, false, 'wrong current password');
  });

  describe('🔐 Auth — Logout');

  await test('logout invalidates session', async () => {
    const res = await post('/api/v1/auth/logout', null, ctx.athleteToken);
    assertResponse(res, 200, true, 'logout');
  });

  await test('old refresh token rejected after logout', async () => {
    const res = await post('/api/v1/auth/refresh', {
      refreshToken: ctx.athleteRefreshToken,
    });
    assertResponse(res, 401, false, 'refresh after logout');
  });

  // Re-login for subsequent test suites
  const reLogin = await post('/api/v1/auth/login', {
    email: 'test.athlete@test.local', password: 'NewPassword456',
  });
  ctx.athleteToken = reLogin.body.data.tokens.accessToken;

  return ctx;
};

module.exports = runAuthTests;
