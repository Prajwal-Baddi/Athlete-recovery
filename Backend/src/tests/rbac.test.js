/**
 * RBAC Integration Tests
 * Exhaustively verifies every role boundary:
 * - Athletes can't access staff routes
 * - Physios can't access coach-only routes
 * - Coaches can't access physio-only routes
 * - Unauthenticated requests always blocked
 */

const assert = require('assert');
const { get, post, patch, assertResponse, test, describe } = require('./testUtils');

const runRbacTests = async (ctx) => {
  describe('🔒 RBAC — Unauthenticated Blocks');

  const protectedRoutes = [
    ['GET',   '/api/v1/auth/me'],
    ['GET',   '/api/v1/users/me'],
    ['GET',   '/api/v1/athletes/me'],
    ['GET',   '/api/v1/athletes'],
    ['GET',   '/api/v1/notifications'],
  ];

  for (const [method, path] of protectedRoutes) {
    await test(`${method} ${path} blocks unauthenticated`, async () => {
      const fn = method === 'GET' ? get : post;
      const res = await fn(path);
      assertResponse(res, 401, false, `unauth block ${path}`);
    });
  }

  describe('🔒 RBAC — Athlete Cannot Access Staff Routes');

  await test('athlete CANNOT list users', async () => {
    const res = await get('/api/v1/users', ctx.athleteToken);
    assertResponse(res, 403, false, 'athlete → list users');
  });

  await test('athlete CANNOT list athletes (staff route)', async () => {
    const res = await get('/api/v1/athletes', ctx.athleteToken);
    assertResponse(res, 403, false, 'athlete → list athletes');
  });

  await test('athlete CANNOT get athlete by ID (staff route)', async () => {
    const res = await get(`/api/v1/athletes/${ctx.athleteProfileId}`, ctx.athleteToken);
    assertResponse(res, 403, false, 'athlete → get athlete by id');
  });

  await test('athlete CANNOT update readiness score', async () => {
    const res = await patch(
      `/api/v1/athletes/${ctx.athleteProfileId}/readiness`,
      { score: 90 },
      ctx.athleteToken
    );
    assertResponse(res, 403, false, 'athlete → update readiness');
  });

  await test('athlete CANNOT assign physio to athlete', async () => {
    const res = await patch(
      `/api/v1/athletes/${ctx.athleteProfileId}/assign-physio`,
      { physioId: ctx.physioId },
      ctx.athleteToken
    );
    assertResponse(res, 403, false, 'athlete → assign physio');
  });

  await test('athlete CANNOT assign coach to athlete', async () => {
    const res = await patch(
      `/api/v1/athletes/${ctx.athleteProfileId}/assign-coach`,
      { coachId: ctx.coachId },
      ctx.athleteToken
    );
    assertResponse(res, 403, false, 'athlete → assign coach');
  });

  await test('athlete CANNOT deactivate another user', async () => {
    const res = await patch(
      `/api/v1/users/${ctx.physioId}/deactivate`,
      null,
      ctx.athleteToken
    );
    assertResponse(res, 403, false, 'athlete → deactivate user');
  });

  describe('🔒 RBAC — Physio Cannot Access Coach-Only Routes');

  await test('physio CANNOT assign physio to athlete (coach-only)', async () => {
    const res = await patch(
      `/api/v1/athletes/${ctx.athleteProfileId}/assign-physio`,
      { physioId: ctx.physioId },
      ctx.physioToken
    );
    assertResponse(res, 403, false, 'physio → assign-physio (coach-only)');
  });

  await test('physio CANNOT assign coach to athlete (coach-only)', async () => {
    const res = await patch(
      `/api/v1/athletes/${ctx.athleteProfileId}/assign-coach`,
      { coachId: ctx.coachId },
      ctx.physioToken
    );
    assertResponse(res, 403, false, 'physio → assign-coach (coach-only)');
  });

  await test('physio CANNOT deactivate a user (coach-only)', async () => {
    const res = await patch(
      `/api/v1/users/${ctx.athleteId}/deactivate`,
      null,
      ctx.physioToken
    );
    assertResponse(res, 403, false, 'physio → deactivate user');
  });

  await test('physio CANNOT access /athletes/me (athlete-only)', async () => {
    const res = await get('/api/v1/athletes/me', ctx.physioToken);
    assertResponse(res, 403, false, 'physio → /athletes/me');
  });

  describe('🔒 RBAC — Coach Cannot Access Physio-Only Routes');

  await test('coach CANNOT update readiness score (physio-only)', async () => {
    const res = await patch(
      `/api/v1/athletes/${ctx.athleteProfileId}/readiness`,
      { score: 88 },
      ctx.coachToken
    );
    assertResponse(res, 403, false, 'coach → update readiness');
  });

  await test('coach CANNOT access /athletes/me (athlete-only)', async () => {
    const res = await get('/api/v1/athletes/me', ctx.coachToken);
    assertResponse(res, 403, false, 'coach → /athletes/me');
  });

  describe('🔒 RBAC — Token Tampering');

  await test('tampered token payload is rejected', async () => {
    // Decode token, manually modify payload, re-encode (invalid signature)
    const [header, , sig] = ctx.athleteToken.split('.');
    const fakePayload = Buffer.from(JSON.stringify({ id: ctx.coachId, role: 'coach' }))
      .toString('base64url');
    const tamperedToken = `${header}.${fakePayload}.${sig}`;
    const res = await get('/api/v1/auth/me', tamperedToken);
    assertResponse(res, 401, false, 'tampered token');
  });

  await test('empty bearer token is rejected', async () => {
    const res = await get('/api/v1/auth/me', '');
    assertResponse(res, 401, false, 'empty token');
  });

  await test('malformed bearer token is rejected', async () => {
    const res = await get('/api/v1/auth/me', 'not.a.jwt');
    assertResponse(res, 401, false, 'malformed token');
  });

  return ctx;
};

module.exports = runRbacTests;
