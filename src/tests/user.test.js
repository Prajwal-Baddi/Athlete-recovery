/**
 * User Integration Tests
 * Tests: GET/PATCH /users/me, list users (RBAC), get by ID
 */

const assert = require('assert');
const { get, patch, assertResponse, test, describe } = require('./testUtils');

const runUserTests = async (ctx) => {
  describe('👤 Users — Own Profile');

  await test('athlete can GET /users/me', async () => {
    const res = await get('/api/v1/users/me', ctx.athleteToken);
    assertResponse(res, 200, true, 'athlete get me');
    assert.strictEqual(res.body.data.user.role, 'athlete');
    assert.ok(!res.body.data.user.password, 'password must not be returned');
    assert.ok(!res.body.data.user.refreshToken, 'refreshToken must not be returned');
  });

  await test('physio can GET /users/me', async () => {
    const res = await get('/api/v1/users/me', ctx.physioToken);
    assertResponse(res, 200, true, 'physio get me');
    assert.strictEqual(res.body.data.user.role, 'physiotherapist');
  });

  await test('coach can GET /users/me', async () => {
    const res = await get('/api/v1/users/me', ctx.coachToken);
    assertResponse(res, 200, true, 'coach get me');
    assert.strictEqual(res.body.data.user.role, 'coach');
  });

  await test('unauthenticated request is rejected', async () => {
    const res = await get('/api/v1/users/me');
    assertResponse(res, 401, false, 'no token');
  });

  await test('athlete can PATCH /users/me (update name)', async () => {
    const res = await patch('/api/v1/users/me', { name: 'Updated Athlete Name' }, ctx.athleteToken);
    assertResponse(res, 200, true, 'update name');
    assert.strictEqual(res.body.data.user.name, 'Updated Athlete Name');
  });

  await test('PATCH /users/me ignores unknown fields (no mass assignment)', async () => {
    const res = await patch(
      '/api/v1/users/me',
      { name: 'Safe Name', role: 'coach', isActive: false },
      ctx.athleteToken
    );
    assertResponse(res, 200, true, 'mass assignment guard');
    // role and isActive must not be changed
    assert.strictEqual(res.body.data.user.role, 'athlete');
    assert.strictEqual(res.body.data.user.isActive, true);
  });

  describe('👤 Users — Role-Based List Access');

  await test('coach can GET /users (list all)', async () => {
    const res = await get('/api/v1/users', ctx.coachToken);
    assertResponse(res, 200, true, 'coach list users');
    assert.ok(Array.isArray(res.body.data), 'data should be array');
    assert.ok(res.body.pagination, 'pagination meta missing');
  });

  await test('physio can GET /users (list all)', async () => {
    const res = await get('/api/v1/users', ctx.physioToken);
    assertResponse(res, 200, true, 'physio list users');
  });

  await test('athlete CANNOT GET /users (forbidden)', async () => {
    const res = await get('/api/v1/users', ctx.athleteToken);
    assertResponse(res, 403, false, 'athlete forbidden');
  });

  await test('can filter users by role', async () => {
    const res = await get('/api/v1/users?role=athlete', ctx.coachToken);
    assertResponse(res, 200, true, 'filter by role');
    const allAthletes = res.body.data.every((u) => u.role === 'athlete');
    assert.ok(allAthletes, 'All returned users should be athletes');
  });

  await test('pagination returns correct meta', async () => {
    const res = await get('/api/v1/users?page=1&limit=2', ctx.coachToken);
    assertResponse(res, 200, true, 'pagination');
    assert.ok(res.body.pagination.limit <= 2);
    assert.ok(typeof res.body.pagination.total === 'number');
    assert.ok(typeof res.body.pagination.totalPages === 'number');
  });

  await test('invalid limit is rejected (over 100)', async () => {
    const res = await get('/api/v1/users?limit=999', ctx.coachToken);
    assertResponse(res, 422, false, 'invalid limit');
  });

  describe('👤 Users — Get by ID');

  await test('coach can GET /users/:id', async () => {
    const res = await get(`/api/v1/users/${ctx.athleteId}`, ctx.coachToken);
    assertResponse(res, 200, true, 'get by id');
    assert.strictEqual(res.body.data.user._id, ctx.athleteId);
  });

  await test('GET /users/:id with invalid mongo ID returns 422', async () => {
    const res = await get('/api/v1/users/not-a-valid-id', ctx.coachToken);
    assertResponse(res, 422, false, 'invalid mongo id');
  });

  await test('GET /users/:id for non-existent ID returns 404', async () => {
    const res = await get('/api/v1/users/507f1f77bcf86cd799439011', ctx.coachToken);
    assertResponse(res, 404, false, 'not found');
  });

  await test('athlete CANNOT GET /users/:id (forbidden)', async () => {
    const res = await get(`/api/v1/users/${ctx.coachId}`, ctx.athleteToken);
    assertResponse(res, 403, false, 'athlete forbidden from user lookup');
  });

  return ctx;
};

module.exports = runUserTests;
