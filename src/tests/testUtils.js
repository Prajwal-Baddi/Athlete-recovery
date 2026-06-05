/**
 * Test utilities — shared helpers for the integration test suite.
 * Uses Node's built-in http module so no extra dependencies are needed.
 */

const http = require('http');

const BASE_URL = `http://localhost:${process.env.TEST_PORT || 5001}`;

// ─── HTTP helper ─────────────────────────────────────────────────────────────

/**
 * Make an HTTP request to the test server.
 *
 * @param {string} method  - HTTP method
 * @param {string} path    - API path (e.g. '/api/v1/auth/login')
 * @param {Object} [body]  - JSON body
 * @param {string} [token] - Bearer token
 * @returns {Promise<{ status, body }>}
 */
const request = (method, path, body = null, token = null) => {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;

    const options = {
      hostname: 'localhost',
      port:     process.env.TEST_PORT || 5001,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(payload && { 'Content-Length': Buffer.byteLength(payload) }),
        ...(token   && { Authorization: `Bearer ${token}` }),
      },
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
};

// Shorthand methods
const get    = (path, token)       => request('GET',    path, null, token);
const post   = (path, body, token) => request('POST',   path, body, token);
const patch  = (path, body, token) => request('PATCH',  path, body, token);
const del    = (path, token)       => request('DELETE', path, null, token);

// ─── Assertion helper ─────────────────────────────────────────────────────────

const assert = require('assert');

/**
 * assertResponse — verifies status + success flag + optional field check.
 */
const assertResponse = (res, expectedStatus, expectedSuccess = true, label = '') => {
  try {
    assert.strictEqual(
      res.status, expectedStatus,
      `${label}: Expected HTTP ${expectedStatus}, got ${res.status}. Body: ${JSON.stringify(res.body)}`
    );
    assert.strictEqual(
      res.body.success, expectedSuccess,
      `${label}: Expected success=${expectedSuccess}, got ${res.body.success}`
    );
  } catch (err) {
    throw err;
  }
};

// ─── Test runner ─────────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;
const failures = [];

const test = async (name, fn) => {
  try {
    await fn();
    console.log(`  ✅  ${name}`);
    passed++;
  } catch (err) {
    console.log(`  ❌  ${name}`);
    console.log(`       ${err.message}`);
    failed++;
    failures.push({ name, error: err.message });
  }
};

const describe = (suiteName) => {
  console.log(`\n📦 ${suiteName}`);
};

const printSummary = () => {
  const total = passed + failed;
  console.log('\n' + '─'.repeat(50));
  console.log(`Tests: ${total} total, ${passed} passed, ${failed} failed`);
  if (failures.length) {
    console.log('\nFailed tests:');
    failures.forEach((f) => console.log(`  • ${f.name}`));
  }
  console.log('─'.repeat(50) + '\n');
  return failed === 0;
};

module.exports = { request, get, post, patch, del, assertResponse, test, describe, printSummary, BASE_URL };
