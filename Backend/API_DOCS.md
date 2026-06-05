# Athlete Recovery API — Documentation

**Version:** 1.0.0  
**Base URL:** `http://localhost:5000/api/v1`

---

## Overview

Production-grade REST API + WebSocket backend for an AI-powered Athlete Recovery SaaS platform. Built with Node.js, Express, MongoDB, JWT, and Socket.IO.

---

## Authentication

All protected endpoints require a `Bearer` token in the `Authorization` header.

```
Authorization: Bearer <accessToken>
```

Access tokens expire in **15 minutes**. Use the refresh endpoint to get a new pair.

### Token Flow

```
1. POST /auth/register  →  { accessToken, refreshToken }
2. Use accessToken for all API calls
3. When 401 received  →  POST /auth/refresh with refreshToken
4. Repeat
5. POST /auth/logout  →  invalidates refreshToken
```

---

## Response Format

All responses follow this structure:

### Success
```json
{
  "success": true,
  "message": "Human-readable message",
  "data": { ... }
}
```

### Paginated
```json
{
  "success": true,
  "message": "...",
  "data": [ ... ],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### Error
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    { "field": "email", "message": "Invalid email" }
  ]
}
```

---

## Roles & Permissions

| Permission                | Athlete | Physiotherapist | Coach |
|---------------------------|:-------:|:---------------:|:-----:|
| View own profile          | ✅      |                 |       |
| Submit wellness logs      | ✅      |                 |       |
| View AI insights          | ✅      |                 |       |
| Manage recovery plans     |         | ✅              |       |
| View athlete injuries     |         | ✅              | ✅    |
| Update rehab progress     |         | ✅              |       |
| Update readiness score    |         | ✅              |       |
| View team dashboard       |         |                 | ✅    |
| Assign physio/coach       |         |                 | ✅    |
| View all athletes         |         | ✅              | ✅    |

---

## Endpoints

---

### 🔐 Authentication

#### POST `/auth/register`
Register a new user account.

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123",
  "role": "athlete | physiotherapist | coach"
}
```

**Response `201`:**
```json
{
  "success": true,
  "message": "Account created successfully",
  "data": {
    "user": { "_id": "...", "name": "John Doe", "email": "...", "role": "athlete" },
    "tokens": {
      "accessToken": "eyJ...",
      "refreshToken": "eyJ..."
    }
  }
}
```

---

#### POST `/auth/login`
Authenticate and receive tokens.

**Body:**
```json
{ "email": "john@example.com", "password": "Password123" }
```

---

#### POST `/auth/refresh`
Exchange a refresh token for a new token pair.

**Body:**
```json
{ "refreshToken": "eyJ..." }
```

---

#### POST `/auth/logout` 🔒
Invalidates the current session's refresh token.

---

#### GET `/auth/me` 🔒
Returns the authenticated user.

---

#### PATCH `/auth/change-password` 🔒
Change the current user's password. Invalidates all sessions.

**Body:**
```json
{
  "currentPassword": "OldPassword123",
  "newPassword": "NewPassword456"
}
```

---

### 👤 Users

#### GET `/users/me` 🔒
Get own user profile.

#### PATCH `/users/me` 🔒
Update own profile.

**Body:** `{ "name": "New Name" }`

#### PATCH `/users/me/avatar` 🔒
Upload avatar image. Use `multipart/form-data` with key `avatar`.

#### GET `/users` 🔒 `coach | physiotherapist`
List all users.

**Query params:** `?role=athlete&page=1&limit=20&isActive=true`

#### GET `/users/:id` 🔒 `coach | physiotherapist`
Get a user by ID.

---

### 🏃 Athletes

#### GET `/athletes/me` 🔒 `athlete`
Get own athlete profile (created automatically on registration).

#### PATCH `/athletes/me` 🔒 `athlete`
Update own athlete profile.

**Body:**
```json
{
  "sport": "Football",
  "team": "City FC",
  "position": "Midfielder",
  "age": 24,
  "height": 178,
  "weight": 75,
  "recoveryStatus": "active | recovering | injured | resting | cleared",
  "emergencyContact": {
    "name": "Jane Doe",
    "relationship": "Spouse",
    "phone": "+1234567890",
    "email": "jane@example.com"
  }
}
```

#### POST `/athletes/me/injuries` 🔒 `athlete`
Log a new injury.

**Body:**
```json
{
  "bodyPart": "Left Knee",
  "description": "ACL strain",
  "severity": "minor | moderate | severe",
  "dateOccurred": "2024-10-15"
}
```

#### PATCH `/athletes/me/injuries/:injuryId` 🔒 `athlete`
Update an injury record.

#### PATCH `/athletes/me/injuries/:injuryId/resolve` 🔒 `athlete`
Mark an injury as resolved.

#### GET `/athletes` 🔒 `physiotherapist | coach`
List athletes.

**Query params:** `?recoveryStatus=recovering&sport=Football&assignedPhysio=<id>&page=1&limit=20`

#### GET `/athletes/:athleteId` 🔒 `physiotherapist | coach`
Get athlete by AthleteProfile ID. Enforces assignment-based access control.

#### PATCH `/athletes/:athleteId/readiness` 🔒 `physiotherapist`
Update readiness score (used by AI module integration).

**Body:** `{ "score": 82.5 }`

#### PATCH `/athletes/:athleteId/assign-physio` 🔒 `coach`
Assign a physiotherapist.

**Body:** `{ "physioId": "<user_id>" }`

#### PATCH `/athletes/:athleteId/assign-coach` 🔒 `coach`
Assign a coach.

**Body:** `{ "coachId": "<user_id>" }`

---

### 🔔 Notifications

#### GET `/notifications` 🔒
Get notifications for the current user.

**Query params:** `?isRead=false&type=readiness_alert&page=1&limit=20`

**Notification types:**
- `readiness_alert` — AI readiness score changed
- `injury_update` — Recovery plan updated by physio
- `recovery_update` — Recovery milestone
- `ai_insight` — AI generated insight
- `report_ready` — Report ready for download
- `system` — Platform notifications
- `coach_alert` — Coach flagged something
- `physio_message` — Message from physiotherapist

#### PATCH `/notifications/read-all` 🔒
Mark all notifications as read.

#### PATCH `/notifications/:id/read` 🔒
Mark one notification as read.

#### DELETE `/notifications/:id` 🔒
Delete a notification.

---

## Socket.IO

Connect with the access token:

```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000', {
  auth: { token: accessToken }
});
```

### Client Events (emit to server)

| Event              | Payload          | Description                          |
|--------------------|------------------|--------------------------------------|
| `athlete:subscribe`| `athleteId`      | Subscribe to an athlete's live feed  |
| `athlete:unsubscribe`| `athleteId`   | Unsubscribe                          |
| `ping`             | —                | Connection health check              |

### Server Events (listen on client)

| Event                  | Payload              | Description                      |
|------------------------|----------------------|----------------------------------|
| `notification:new`     | `Notification`       | New notification pushed          |
| `notification:allRead` | —                    | All notifications marked read    |
| `readiness:updated`    | `{ score, athleteId }`| Readiness score changed         |
| `readiness:alert`      | `{ message }`        | Critical readiness alert         |
| `recovery:update`      | `{ status }`         | Recovery status changed          |
| `recovery:milestone`   | `{ milestone }`      | Milestone reached                |
| `ai:insight`           | `{ insight }`        | New AI insight available         |
| `ai:alert`             | `{ alert }`          | Critical AI alert                |
| `report:ready`         | `{ reportId }`       | Report generated                 |

### Rooms

| Room               | Description                         |
|--------------------|-------------------------------------|
| `user:<userId>`    | Private room per user               |
| `role:<role>`      | Broadcast to all users of a role    |
| `athlete:<id>`     | Live feed for a specific athlete    |

---

## Integration Guide for Other Modules

### Using athleteId across modules

Every module should reference `AthleteProfile._id` as `athleteId` (not `User._id`).

```javascript
// ✅ Correct
const plan = { athleteId: athleteProfile._id, ... };

// ❌ Incorrect
const plan = { userId: user._id, ... };
```

### Importing services in your module

```javascript
// Athlete data
const athleteService = require('../services/athleteService');
const profile = await athleteService.getProfileById(athleteId);

// Send a notification
const notificationService = require('../services/notificationService');
await notificationService.createNotification({
  recipientId: userId,
  senderId:    null,        // null = system
  title:       'New insight',
  message:     'Your recovery score improved by 15%',
  type:        'ai_insight',
  priority:    'medium',
});

// Push via Socket.IO
const { emitToUser, emitToAthlete, EVENTS } = require('../socket/socketManager');
emitToUser(userId, EVENTS.AI_INSIGHT_NEW, { insight: '...' });
emitToAthlete(athleteId, EVENTS.READINESS_UPDATED, { score: 85 });
```

### RBAC in custom routes

```javascript
const { protect, authorize } = require('../middleware/auth');
const { requirePermission } = require('../middleware/rbac');

router.post(
  '/recovery-plans',
  protect,
  authorize('physiotherapist'),
  // or: requirePermission('manage:recovery_plans'),
  myController.createPlan
);
```

---

## Error Codes

| HTTP | Meaning                           |
|------|-----------------------------------|
| 400  | Bad request / validation error    |
| 401  | Unauthenticated (no/invalid token)|
| 403  | Forbidden (wrong role)            |
| 404  | Resource not found                |
| 409  | Conflict (e.g., duplicate email)  |
| 422  | Validation failed                 |
| 429  | Rate limit exceeded               |
| 500  | Internal server error             |

---

## Environment Variables

See `.env.example` for the full list. Required variables:

```
MONGO_URI
JWT_ACCESS_SECRET
JWT_REFRESH_SECRET
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
```
