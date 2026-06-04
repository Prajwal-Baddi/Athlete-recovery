/**
 * Athlete Integration Tests
 * Tests: profile CRUD, injury management, assignment, RBAC enforcement
 */

const assert = require('assert');
const { get, post, patch, assertResponse, test, describe } = require('./testUtils');

const runAthleteTests = async (ctx) => {
  describe('🏃 Athletes — Own Profile (Athlete role)');

  await test('athlete can GET /athletes/me', async () => {
    const res = await get('/api/v1/athletes/me', ctx.athleteToken);
    assertResponse(res, 200, true, 'get own profile');
    assert.ok(res.body.data.profile, 'profile missing from response');
    assert.ok(res.body.data.profile.userId, 'userId missing');
    ctx.athleteProfileId = res.body.data.profile._id;
  });

  await test('athlete can update own profile', async () => {
    const res = await patch('/api/v1/athletes/me', {
      sport:          'Football',
      team:           'Test FC',
      position:       'Striker',
      age:            23,
      height:         180,
      weight:         76,
      recoveryStatus: 'active',
      emergencyContact: {
        name:         'Jane Test',
        relationship: 'Partner',
        phone:        '+447700900000',
        email:        'jane@test.local',
      },
    }, ctx.athleteToken);
    assertResponse(res, 200, true, 'update profile');
    assert.strictEqual(res.body.data.profile.sport, 'Football');
    assert.strictEqual(res.body.data.profile.age, 23);
    assert.strictEqual(res.body.data.profile.recoveryStatus, 'active');
  });

  await test('reject invalid recoveryStatus', async () => {
    const res = await patch('/api/v1/athletes/me', {
      recoveryStatus: 'invalid_status',
    }, ctx.athleteToken);
    assertResponse(res, 422, false, 'invalid status');
  });

  await test('reject negative age', async () => {
    const res = await patch('/api/v1/athletes/me', { age: -5 }, ctx.athleteToken);
    assertResponse(res, 422, false, 'negative age');
  });

  await test('physio CANNOT access /athletes/me', async () => {
    const res = await get('/api/v1/athletes/me', ctx.physioToken);
    assertResponse(res, 403, false, 'physio blocked from /athletes/me');
  });

  await test('coach CANNOT access /athletes/me', async () => {
    const res = await get('/api/v1/athletes/me', ctx.coachToken);
    assertResponse(res, 403, false, 'coach blocked from /athletes/me');
  });

  describe('🏃 Athletes — Injury Management');

  let injuryId;

  await test('athlete can add a minor injury', async () => {
    const res = await post('/api/v1/athletes/me/injuries', {
      bodyPart:    'Right Ankle',
      description: 'Sprained during warm-up',
      severity:    'minor',
      dateOccurred: '2024-10-01',
    }, ctx.athleteToken);
    assertResponse(res, 201, true, 'add injury');
    const injuries = res.body.data.profile.injuries;
    assert.ok(injuries.length > 0, 'Injury was not added');
    injuryId = injuries[injuries.length - 1]._id;
    ctx.injuryId = injuryId;
  });

  await test('athlete can add a severe injury (status auto-set to injured)', async () => {
    const res = await post('/api/v1/athletes/me/injuries', {
      bodyPart:    'Left Shoulder',
      description: 'Rotator cuff tear',
      severity:    'severe',
    }, ctx.athleteToken);
    assertResponse(res, 201, true, 'add severe injury');
    assert.strictEqual(res.body.data.profile.recoveryStatus, 'injured',
      'recoveryStatus should auto-set to injured for severe injury');
  });

  await test('reject injury with missing bodyPart', async () => {
    const res = await post('/api/v1/athletes/me/injuries', {
      severity: 'minor',
    }, ctx.athleteToken);
    assertResponse(res, 422, false, 'missing bodyPart');
  });

  await test('reject injury with invalid severity', async () => {
    const res = await post('/api/v1/athletes/me/injuries', {
      bodyPart: 'Knee', severity: 'catastrophic',
    }, ctx.athleteToken);
    assertResponse(res, 422, false, 'invalid severity');
  });

  await test('athlete can update an injury', async () => {
    const res = await patch(
      `/api/v1/athletes/me/injuries/${ctx.injuryId}`,
      { description: 'Updated: Grade II sprain confirmed by MRI', severity: 'moderate' },
      ctx.athleteToken
    );
    assertResponse(res, 200, true, 'update injury');
    const updated = res.body.data.profile.injuries.find(
      (i) => i._id === ctx.injuryId
    );
    assert.ok(updated, 'Injury not found in updated profile');
    assert.strictEqual(updated.severity, 'moderate');
  });

  await test('athlete can resolve an injury', async () => {
    const res = await patch(
      `/api/v1/athletes/me/injuries/${ctx.injuryId}/resolve`,
      null,
      ctx.athleteToken
    );
    assertResponse(res, 200, true, 'resolve injury');
    const resolved = res.body.data.profile.injuries.find(
      (i) => i._id === ctx.injuryId
    );
    assert.strictEqual(resolved.isActive, false, 'injury should be inactive');
    assert.ok(resolved.dateResolved, 'dateResolved should be set');
  });

  await test('resolve injury with invalid ID returns 422', async () => {
    const res = await patch(
      '/api/v1/athletes/me/injuries/notanid/resolve',
      null,
      ctx.athleteToken
    );
    assertResponse(res, 422, false, 'invalid injury id');
  });

  describe('🏃 Athletes — Staff Access (Physio/Coach)');

  await test('physio can list all athletes', async () => {
    const res = await get('/api/v1/athletes', ctx.physioToken);
    assertResponse(res, 200, true, 'physio list athletes');
    assert.ok(Array.isArray(res.body.data), 'data should be array');
    assert.ok(res.body.pagination, 'pagination missing');
  });

  await test('coach can list all athletes', async () => {
    const res = await get('/api/v1/athletes', ctx.coachToken);
    assertResponse(res, 200, true, 'coach list athletes');
  });

  await test('athlete CANNOT list athletes (forbidden)', async () => {
    const res = await get('/api/v1/athletes', ctx.athleteToken);
    assertResponse(res, 403, false, 'athlete forbidden from list');
  });

  await test('can filter athletes by recoveryStatus', async () => {
    const res = await get('/api/v1/athletes?recoveryStatus=active', ctx.coachToken);
    assertResponse(res, 200, true, 'filter by status');
  });

  await test('physio can get athlete by profileId', async () => {
    const res = await get(`/api/v1/athletes/${ctx.athleteProfileId}`, ctx.physioToken);
    assertResponse(res, 200, true, 'get athlete by id');
    assert.strictEqual(res.body.data.profile._id, ctx.athleteProfileId);
  });

  await test('get non-existent athlete returns 404', async () => {
    const res = await get('/api/v1/athletes/507f1f77bcf86cd799439011', ctx.coachToken);
    assertResponse(res, 404, false, 'not found');
  });

  describe('🏃 Athletes — Readiness Score');

  await test('physio can update readiness score', async () => {
    const res = await patch(
      `/api/v1/athletes/${ctx.athleteProfileId}/readiness`,
      { score: 75.5 },
      ctx.physioToken
    );
    assertResponse(res, 200, true, 'update readiness');
    assert.strictEqual(res.body.data.profile.readinessScore.value, 75.5);
    assert.ok(res.body.data.profile.readinessScore.lastUpdated, 'lastUpdated missing');
  });

  await test('reject readiness score above 100', async () => {
    const res = await patch(
      `/api/v1/athletes/${ctx.athleteProfileId}/readiness`,
      { score: 101 },
      ctx.physioToken
    );
    assertResponse(res, 422, false, 'score above 100');
  });

  await test('reject readiness score below 0', async () => {
    const res = await patch(
      `/api/v1/athletes/${ctx.athleteProfileId}/readiness`,
      { score: -1 },
      ctx.physioToken
    );
    assertResponse(res, 422, false, 'score below 0');
  });

  await test('athlete CANNOT update readiness score', async () => {
    const res = await patch(
      `/api/v1/athletes/${ctx.athleteProfileId}/readiness`,
      { score: 99 },
      ctx.athleteToken
    );
    assertResponse(res, 403, false, 'athlete forbidden from readiness update');
  });

  describe('🏃 Athletes — Assignment');

  await test('coach can assign physio to athlete', async () => {
    const res = await patch(
      `/api/v1/athletes/${ctx.athleteProfileId}/assign-physio`,
      { physioId: ctx.physioId },
      ctx.coachToken
    );
    assertResponse(res, 200, true, 'assign physio');
    assert.ok(res.body.data.profile.assignedPhysio, 'assignedPhysio missing');
  });

  await test('coach can assign coach to athlete', async () => {
    const res = await patch(
      `/api/v1/athletes/${ctx.athleteProfileId}/assign-coach`,
      { coachId: ctx.coachId },
      ctx.coachToken
    );
    assertResponse(res, 200, true, 'assign coach');
    assert.ok(res.body.data.profile.assignedCoach, 'assignedCoach missing');
  });

  await test('reject assigning non-physio as physio', async () => {
    const res = await patch(
      `/api/v1/athletes/${ctx.athleteProfileId}/assign-physio`,
      { physioId: ctx.coachId }, // coachId passed as physio
      ctx.coachToken
    );
    assertResponse(res, 400, false, 'invalid physio id');
  });

  await test('athlete CANNOT assign physio', async () => {
    const res = await patch(
      `/api/v1/athletes/${ctx.athleteProfileId}/assign-physio`,
      { physioId: ctx.physioId },
      ctx.athleteToken
    );
    assertResponse(res, 403, false, 'athlete forbidden from assigning');
  });

  return ctx;
};

module.exports = runAthleteTests;
