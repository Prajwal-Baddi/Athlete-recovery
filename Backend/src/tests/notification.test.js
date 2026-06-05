/**
 * Notification Integration Tests
 * Tests: list, mark read, mark all read, delete, unread count
 */

const assert = require('assert');
const { get, patch, del, assertResponse, test, describe } = require('./testUtils');

// Directly create a notification via service to seed test data
// (we call the internal service via a small HTTP helper endpoint
//  OR we rely on prior tests having triggered notifications)

const runNotificationTests = async (ctx) => {
  describe('🔔 Notifications — List');

  await test('athlete can GET own notifications', async () => {
    const res = await get('/api/v1/notifications', ctx.athleteToken);
    assertResponse(res, 200, true, 'get notifications');
    assert.ok(Array.isArray(res.body.data), 'data should be array');
    assert.ok(res.body.pagination,            'pagination missing');
    assert.ok(typeof res.body.unreadCount === 'number', 'unreadCount missing');
    ctx.notifications = res.body.data;
  });

  await test('physio can GET own notifications', async () => {
    const res = await get('/api/v1/notifications', ctx.physioToken);
    assertResponse(res, 200, true, 'physio get notifications');
  });

  await test('coach can GET own notifications', async () => {
    const res = await get('/api/v1/notifications', ctx.coachToken);
    assertResponse(res, 200, true, 'coach get notifications');
  });

  await test('unauthenticated request is rejected', async () => {
    const res = await get('/api/v1/notifications');
    assertResponse(res, 401, false, 'no token');
  });

  await test('can filter notifications by isRead=false', async () => {
    const res = await get('/api/v1/notifications?isRead=false', ctx.athleteToken);
    assertResponse(res, 200, true, 'filter unread');
    const allUnread = res.body.data.every((n) => n.isRead === false);
    assert.ok(allUnread, 'All returned notifications should be unread');
  });

  await test('pagination works on notifications', async () => {
    const res = await get('/api/v1/notifications?page=1&limit=5', ctx.athleteToken);
    assertResponse(res, 200, true, 'paginate notifications');
    assert.ok(res.body.pagination.limit <= 5);
  });

  describe('🔔 Notifications — Mark As Read');

  await test('mark all notifications as read', async () => {
    const res = await patch('/api/v1/notifications/read-all', null, ctx.athleteToken);
    assertResponse(res, 200, true, 'mark all read');
  });

  await test('unread count is 0 after mark all read', async () => {
    const res = await get('/api/v1/notifications', ctx.athleteToken);
    assertResponse(res, 200, true, 'check unread count');
    assert.strictEqual(res.body.unreadCount, 0, 'unread count should be 0 after markAllRead');
  });

  describe('🔔 Notifications — Individual Operations');

  await test('mark single notification as read (if any exist)', async () => {
    // Fetch notifications first
    const listRes = await get('/api/v1/notifications', ctx.physioToken);
    if (listRes.body.data.length === 0) {
      // No notifications to test — skip gracefully
      console.log('       (skipped — no notifications for physio)');
      return;
    }
    const notifId = listRes.body.data[0]._id;
    const res = await patch(`/api/v1/notifications/${notifId}/read`, null, ctx.physioToken);
    assertResponse(res, 200, true, 'mark single read');
    assert.strictEqual(res.body.data.notification.isRead, true);
    assert.ok(res.body.data.notification.readAt, 'readAt should be set');
  });

  await test('cannot mark another user\'s notification as read', async () => {
    // Get a physio notification ID, try to mark it as read with athlete token
    const listRes = await get('/api/v1/notifications', ctx.physioToken);
    if (listRes.body.data.length === 0) {
      console.log('       (skipped — no notifications for physio)');
      return;
    }
    const notifId = listRes.body.data[0]._id;
    const res = await patch(`/api/v1/notifications/${notifId}/read`, null, ctx.athleteToken);
    // Should 404 (not found for that user) not 200
    assert.ok(
      res.status === 404 || res.body.success === false,
      'Should not be able to mark another user\'s notification'
    );
  });

  await test('mark notification with invalid ID returns 422', async () => {
    const res = await patch('/api/v1/notifications/not-valid-id/read', null, ctx.athleteToken);
    assertResponse(res, 422, false, 'invalid notif id');
  });

  await test('mark non-existent notification returns 404', async () => {
    const res = await patch(
      '/api/v1/notifications/507f1f77bcf86cd799439011/read',
      null,
      ctx.athleteToken
    );
    assertResponse(res, 404, false, 'not found');
  });

  describe('🔔 Notifications — Delete');

  await test('delete notification with invalid ID returns 422', async () => {
    const res = await del('/api/v1/notifications/notanid', ctx.athleteToken);
    assertResponse(res, 422, false, 'invalid id on delete');
  });

  await test('delete non-existent notification returns 404', async () => {
    const res = await del('/api/v1/notifications/507f1f77bcf86cd799439011', ctx.athleteToken);
    assertResponse(res, 404, false, 'not found on delete');
  });

  await test('athlete can delete own notification', async () => {
    // Re-fetch to get a valid ID
    const listRes = await get('/api/v1/notifications', ctx.athleteToken);
    if (listRes.body.data.length === 0) {
      console.log('       (skipped — no notifications for athlete to delete)');
      return;
    }
    const notifId = listRes.body.data[0]._id;
    const res = await del(`/api/v1/notifications/${notifId}`, ctx.athleteToken);
    assertResponse(res, 200, true, 'delete notification');
  });

  return ctx;
};

module.exports = runNotificationTests;
