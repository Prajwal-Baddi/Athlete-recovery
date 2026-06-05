# Athlete Recovery Backend

Production-grade MERN backend for the AI-powered Athlete Recovery SaaS platform.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Fill in MONGO_URI, JWT secrets, Cloudinary credentials

# 3. Start development server
npm run dev

# 4. Health check
curl http://localhost:5000/api/v1/health
```

## Project Structure

```
src/
├── config/
│   ├── database.js         # MongoDB connection
│   └── cloudinary.js       # Cloudinary + Multer setup
├── controllers/
│   ├── authController.js
│   ├── userController.js
│   ├── athleteController.js
│   └── notificationController.js
├── middleware/
│   ├── auth.js             # JWT protect + authorize
│   ├── rbac.js             # Role-based access control
│   ├── validators.js       # express-validator chains
│   └── errorHandler.js     # Global error handler
├── models/
│   ├── User.js
│   ├── AthleteProfile.js
│   └── Notification.js
├── routes/
│   ├── index.js            # API v1 registry
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── athleteRoutes.js
│   └── notificationRoutes.js
├── services/
│   ├── authService.js      # Auth business logic
│   ├── userService.js      # User management logic
│   ├── athleteService.js   # Athlete profile logic
│   └── notificationService.js
├── socket/
│   └── socketManager.js    # Socket.IO setup + helpers
├── utils/
│   ├── AppError.js         # Operational error class
│   ├── apiResponse.js      # Standardized response helpers
│   ├── helpers.js          # asyncHandler, pagination
│   ├── jwt.js              # Token generation/verification
│   └── logger.js           # Winston logger
├── app.js                  # Express app
└── server.js               # HTTP server + startup
```

## API Documentation

See [API_DOCS.md](./API_DOCS.md) for full endpoint reference.

## Postman Collection

Import `postman/AthleteRecovery.postman_collection.json` into Postman.
Collection variables `accessToken` and `refreshToken` auto-populate on login.

## Tech Stack

- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Database:** MongoDB + Mongoose
- **Auth:** JWT (access + refresh tokens)
- **Real-time:** Socket.IO
- **File uploads:** Multer + Cloudinary
- **Validation:** express-validator
- **Security:** helmet, cors, express-rate-limit, express-mongo-sanitize
- **Logging:** Winston + Morgan

## Integration Notes for Other Developers

- Reference athletes by `AthleteProfile._id` as `athleteId` (not `User._id`)
- Import `notificationService.createNotification()` to push notifications
- Import `{ emitToUser, emitToAthlete, EVENTS }` from `socket/socketManager` for real-time events
- Import `{ protect, authorize }` from `middleware/auth` to secure your routes
- All services are pure functions — easy to unit test
