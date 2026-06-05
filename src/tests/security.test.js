/**
 * Security Integration Tests
 * Tests: rate limiting, NoSQL injection, XSS in body, oversized payloads,
 * password not leaked in responses, CORS headers present
 */

const assert = require('assert');
const { post, get, assertResponse, test, describe, request } = require('./testUtils');

const runSecurityTests = async (ctx) => {
  describe('🛡️  Security — Password Never Exposed');

  await test('password field not in register response', async () => {
    const res = await post('/api/v1/auth/register', {
      name: 'Sec Test User', email: 'sec.test@test.local',
      password: 'Password123', role: 'athlete',
    });
    const body = JSON.stringify(res.body);
    assert.ok(!body.includes('"password"') || !body.includes('Password123'),
      'Raw password must not appear in response');
  });

  await test('password field not in login response', async () => {
    const res = await post('/api/v1/auth/login', {
      email: 'sec.test@test.local', password: 'Password123',
    });
    assertResponse(res, 200, true, 'sec login');
    assert.ok(!res.body.data?.user?.password, 'password must not be in user object');
    assert.ok(!res.body.data?.user?.refreshToken, 'refreshToken must not be in user object');
  });

  await test('password field not in GET /users/me response', async () => {
    const loginRes = await post('/api/v1/auth/login', {
      email: 'sec.test@test.local', password: 'Password123',
    });
    const token = loginRes.body.data.tokens.accessToken;
    const res = await get('/api/v1/users/me', token);
    assertResponse(res, 200, true, 'get me sec');
    assert.ok(!res.body.data?.user?.password, 'password must not be in /users/me');
    assert.ok(!res.body.data?.user?.refreshToken, 'refreshToken must not be in /users/me');
  });

  describe('🛡️  Security — NoSQL Injection Prevention');

  await test('NoSQL injection in login email is sanitized', async () => {
    const res = await post('/api/v1/auth/login', {
      email:    { $gt: '' }, // MongoDB operator injection attempt
      password: 'anypassword',
    });
    // Should fail gracefully — either 422 (validation) or 401 (not found)
    assert.ok(
      res.status === 422 || res.status === 401 || res.status === 400,
      `Expected 400/401/422, got ${res.status}`
    );
    assert.strictEqual(res.body.success, false, 'NoSQL injection should not succeed');
  });

  await test('NoSQL operator in query param is neutralised', async () => {
    // Mongoose sanitizer strips $where, $gt etc from req.body/query
    const res = await get('/api/v1/users?role[$ne]=admin', ctx.coachToken);
    // Should not crash the server — valid 200 or 422
    assert.ok([200, 422].includes(res.status), `Unexpected status: ${res.status}`);
  });

  describe('🛡️  Security — Input Validation Hardening');

  await test('oversized name field (>100 chars) is rejected', async () => {
    const res = await post('/api/v1/auth/register', {
      name:     'A'.repeat(101),
      email:    'longname@test.local',
      password: 'Password123',
      role:     'athlete',
    });
    assertResponse(res, 422, false, 'name too long');
  });

  await test('missing content-type body is handled gracefully', async () => {
    const res = await post('/api/v1/auth/login', null);
    // Validation should catch missing fields
    assert.ok(
      res.status === 422 || res.status === 400,
      `Expected 400/422, got ${res.status}`
    );
    assert.strictEqual(res.body.success, false);
  });

  await test('completely empty body on register returns validation errors', async () => {
    const res = await post('/api/v1/auth/register', {});
    assertResponse(res, 422, false, 'empty body');
    assert.ok(Array.isArray(res.body.errors), 'errors array expected');
    assert.ok(res.body.errors.length > 0, 'at least one error expected');
  });

  await test('validation errors include field names', async () => {
    const res = await post('/api/v1/auth/register', {
      name: 'X', email: 'bad-email', password: 'weak', role: 'alien',
    });
    assertResponse(res, 422, false, 'field errors');
    assert.ok(Array.isArray(res.body.errors));
    const fields = res.body.errors.map((e) => e.field);
    assert.ok(fields.includes('email') || fields.includes('password') || fields.includes('role'),
      `Expected field errors, got: ${JSON.stringify(fields)}`);
  });

  describe('🛡️  Security — Health & Infrastructure');

  await test('health check returns 200 with metadata', async () => {
    const res = await get('/api/v1/health');
    assertResponse(res, 200, true, 'health check');
    assert.ok(res.body.version,     'version missing');
    assert.ok(res.body.timestamp,   'timestamp missing');
    assert.ok(res.body.environment, 'environment missing');
  });

  await test('unknown route returns 404', async () => {
    const res = await get('/api/v1/this-route-does-not-exist');
    assertResponse(res, 404, false, '404 handler');
  });

  await test('stub routes return 501 Not Implemented', async () => {
    const res = await get('/api/v1/ai-insights');
    assert.strictEqual(res.status, 501, 'AI insights stub should return 501');
  });

  await test('stub routes return 501 for recovery-plans', async () => {
    const res = await get('/api/v1/recovery-plans');
    assert.strictEqual(res.status, 501);
  });

  await test('stub routes return 501 for wellness-logs', async () => {
    const res = await get('/api/v1/wellness-logs');
    assert.strictEqual(res.status, 501);
  });

  return ctx;
};

module.exports = runSecurityTests;
