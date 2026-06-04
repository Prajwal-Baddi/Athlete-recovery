# Integration Guide for Module Developers

This guide is for developers building the **AI**, **Recovery Plans**, **Wellness Logs**, **Wearables**, **Body Map**, and **Reports** modules. It explains exactly how to plug into this backend.

---

## 1. The Golden Rule: Use `athleteId`

Every cross-module reference to an athlete **must** use `AthleteProfile._id`, stored as `athleteId`.

```js
// ✅ Correct — AthleteProfile._id
const plan = { athleteId: '64f3a...', exercises: [...] };

// ❌ Wrong — User._id
const plan = { userId: '64f3a...', exercises: [...] };
```

The mapping from `User._id → AthleteProfile._id` is:

```js
const AthleteProfile = require('./models/AthleteProfile');
const profile = await AthleteProfile.findOne({ userId });
const athleteId = profile._id;
```

---

## 2. Importing Services

All services are pure async functions. Import what you need:

```js
// All services from one place
const { athleteService, notificationService } = require('../services');

// Or individually
const athleteService      = require('../services/athleteService');
const notificationService = require('../services/notificationService');
```

---

## 3. Reading Athlete Data

```js
const athleteService = require('../services/athleteService');

// By AthleteProfile._id (preferred)
const profile = await athleteService.getProfileById(athleteId);

// By User._id (e.g. from JWT token)
const profile = await athleteService.getProfileByUserId(req.user._id);

// profile shape:
// {
//   _id, userId { _id, name, email, avatar },
//   sport, team, position, age, height, weight,
//   injuries [{ bodyPart, severity, isActive, ... }],
//   recoveryStatus, readinessScore { value, lastUpdated },
//   assignedPhysio { _id, name }, assignedCoach { _id, name },
//   activeInjuries (virtual), hasActiveInjury (virtual)
// }
```

---

## 4. Writing Readiness Scores (AI Module)

When your AI engine produces a readiness score, persist it via:

```js
const athleteService = require('../services/athleteService');

// score: number 0–100
await athleteService.updateReadinessScore(athleteId, score);
```

Then push it live:

```js
const { emitToAthlete, emitToUser, EVENTS } = require('../socket/socketManager');

// Push to everyone watching this athlete (coaches, physios)
emitToAthlete(athleteId, EVENTS.READINESS_UPDATED, {
  athleteId,
  score,
  lastUpdated: new Date(),
});

// Push critical alert to coaches
if (score < 50) {
  emitToRole('coach', EVENTS.READINESS_ALERT, {
    athleteId,
    score,
    message: `${athleteName}'s readiness dropped to ${score}`,
  });
}
```

---

## 5. Sending Notifications

```js
const notificationService = require('../services/notificationService');

// Single notification (automatically pushed via Socket.IO)
await notificationService.createNotification({
  recipientId: userId,          // User._id
  senderId:    null,            // null = system, or another User._id
  title:       'Recovery milestone reached',
  message:     'You have completed Phase 1 of your ACL recovery plan.',
  type:        'recovery_update', // see Notification.TYPES
  priority:    'medium',          // low | medium | high | critical
  metadata: {                   // optional deep-link payload
    resourceType: 'recovery_plan',
    resourceId:   planId,
  },
  expiresAt: null,              // or a Date for auto-deletion
});

// Broadcast to multiple users at once
await notificationService.broadcastNotification(
  [userId1, userId2, userId3],
  {
    senderId: null,
    title:    'System maintenance',
    message:  'Scheduled maintenance in 30 minutes.',
    type:     'system',
    priority: 'high',
  }
);
```

**Available notification types:**

| Type              | When to use                                   |
|-------------------|-----------------------------------------------|
| `readiness_alert` | AI readiness score dropped significantly      |
| `injury_update`   | Recovery plan changed by physio               |
| `recovery_update` | Athlete hit a recovery milestone              |
| `ai_insight`      | AI generated a new insight for the athlete    |
| `report_ready`    | A report was generated and is ready           |
| `system`          | Platform / admin announcements                |
| `coach_alert`     | Coach flagged something on an athlete         |
| `physio_message`  | Physio sent a message to athlete              |

---

## 6. Protecting Your Routes

```js
const { protect, authorize } = require('../middleware/auth');
const { requirePermission }  = require('../middleware/rbac');
const { asyncHandler }       = require('../utils/helpers');

// Only logged-in physiotherapists
router.post(
  '/recovery-plans',
  protect,
  authorize('physiotherapist'),
  asyncHandler(async (req, res) => {
    // req.user is the authenticated physiotherapist
    const { athleteId, exercises } = req.body;
    // ...
  })
);

// Or use permission-based check
router.post(
  '/recovery-plans',
  protect,
  requirePermission('manage:recovery_plans'),
  asyncHandler(myController.createPlan)
);
```

---

## 7. Standard Response Format

Always use the shared response helpers — never write `res.json()` directly:

```js
const { sendSuccess, sendCreated, sendError, sendPaginated } = require('../utils/apiResponse');
const AppError = require('../utils/AppError');

// Success
sendSuccess(res, 'Plan created', { plan });
sendCreated(res, 'Plan created', { plan });

// Paginated list
sendPaginated(res, 'Plans retrieved', plans, pagination);

// Throw operational errors (caught by global error handler)
throw AppError.notFound('Recovery plan not found');
throw AppError.forbidden('Not assigned to this athlete');
throw AppError.badRequest('Invalid exercise data', validationErrors);
```

---

## 8. Pagination Utilities

```js
const {
  getPaginationParams,
  buildPaginationMeta,
  buildSortOptions,
  asyncHandler,
} = require('../utils/helpers');

router.get('/recovery-plans', protect, asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPaginationParams(req.query);
  const sort = buildSortOptions(req.query.sort, '-createdAt');

  const [plans, total] = await Promise.all([
    RecoveryPlan.find({ athleteId }).sort(sort).skip(skip).limit(limit),
    RecoveryPlan.countDocuments({ athleteId }),
  ]);

  sendPaginated(res, 'Plans retrieved', plans, buildPaginationMeta(total, page, limit));
}));
```

---

## 9. Socket.IO Emit Reference

```js
const { emitToUser, emitToAthlete, emitToRole, EVENTS } =
  require('../socket/socketManager');

emitToUser(userId, EVENTS.AI_INSIGHT_NEW,  payload); // single user
emitToAthlete(athleteId, EVENTS.READINESS_UPDATED, payload); // all watchers of athlete
emitToRole('coach', EVENTS.AI_ALERT, payload); // all coaches
```

Full `EVENTS` map is in `src/socket/socketManager.js`.

---

## 10. Mounting Your Routes

Add your routes to `src/routes/index.js`:

```js
// Replace the stub with your real router:
const recoveryPlanRoutes = require('./recoveryPlanRoutes');
router.use('/recovery-plans', recoveryPlanRoutes);
```

Remove or replace the 501 stub when your module is ready.

---

## 11. Environment Variables

Add module-specific env vars to `.env.example` and document them. Never hardcode values.

```
# Recovery Plans Module
RECOVERY_AI_ENDPOINT=https://ai.internal/v1/plans
```

---

## Quick Checklist Before Merging

- [ ] Routes use `protect` + `authorize` / `requirePermission`
- [ ] Controllers are thin — logic in services
- [ ] All responses use `sendSuccess` / `sendCreated` / `sendPaginated`
- [ ] Errors thrown via `AppError.*` factories
- [ ] Athlete referenced by `AthleteProfile._id` as `athleteId`
- [ ] Notifications sent via `notificationService.createNotification`
- [ ] Real-time events emitted via `socketManager` helpers
- [ ] New routes mounted in `src/routes/index.js`
- [ ] New env vars documented in `.env.example`
