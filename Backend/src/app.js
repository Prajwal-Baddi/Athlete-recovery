const express = require('express');
const helmet  = require('helmet');
const cors    = require('cors');
const morgan  = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit     = require('express-rate-limit');

const routes = require('./routes');
const { globalErrorHandler, notFoundHandler } = require('./middleware/errorHandler');
const logger = require('./utils/logger');

const app = express();

// ─── Security headers ─────────────────────────────────────────────────────────
app.use(helmet());

// ─── CORS ─────────────────────────────────────────────────────────────────────
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000').split(',');
app.use(cors({
  origin: (origin, cb) => {
    // Allow requests with no origin (mobile apps, Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      return cb(null, true);
    }
    cb(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ─── Rate limiting ────────────────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000,
  max:      parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100,
  standardHeaders: true,
  legacyHeaders:   false,
  message: { success: false, message: 'Too many requests. Please try again later.' },
  skip: (req) => req.path === '/api/v1/health', // Skip health checks
});
app.use('/api/', limiter);

// Stricter limit on auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many auth attempts. Please try again in 15 minutes.' },
});
app.use('/api/v1/auth/login', authLimiter);
app.use('/api/v1/auth/register', authLimiter);

// ─── Body parsers ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ─── NoSQL injection prevention ───────────────────────────────────────────────
app.use(mongoSanitize());

// ─── Logging ──────────────────────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined', {
    stream: { write: (msg) => logger.http(msg.trim()) },
    skip: (req) => req.path === '/api/v1/health',
  }));
}

// Routes
app.use('/api/v1', routes);

// Error handling
app.use(notFoundHandler);
app.use(globalErrorHandler);

module.exports = app;