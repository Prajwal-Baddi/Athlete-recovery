require('dotenv').config();

const http = require('http');
const app  = require('./app');
const connectDB = require('./config/database');
const { initSocket } = require('./socket/socketManager');
const logger = require('./utils/logger');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Connect to MongoDB first
  await connectDB();

  // Create HTTP server (wraps Express — required for Socket.IO)
  const httpServer = http.createServer(app);

  // Initialise Socket.IO
  initSocket(httpServer);

  // Start listening
  httpServer.listen(PORT, () => {
    logger.info(`
╔════════════════════════════════════════════╗
║     Athlete Recovery API                   ║
║     Port    : ${PORT}                          ║
║     Env     : ${(process.env.NODE_ENV || 'development').padEnd(12)}              ║
║     API     : http://localhost:${PORT}/api/v1   ║
╚════════════════════════════════════════════╝
    `);
  });

  // ─── Graceful shutdown ───────────────────────────────────────────────────
  const shutdown = (signal) => {
    logger.warn(`${signal} received. Shutting down gracefully...`);
    httpServer.close(() => {
      logger.info('HTTP server closed');
      require('mongoose').connection.close(false, () => {
        logger.info('MongoDB connection closed');
        process.exit(0);
      });
    });
    // Force exit after 10s
    setTimeout(() => {
      logger.error('Could not close connections in time. Forcing exit.');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT',  () => shutdown('SIGINT'));

  // ─── Unhandled errors ────────────────────────────────────────────────────
  process.on('unhandledRejection', (reason) => {
    logger.error(`Unhandled Promise Rejection: ${reason}`);
    httpServer.close(() => process.exit(1));
  });

  process.on('uncaughtException', (err) => {
    logger.error(`Uncaught Exception: ${err.message}`);
    process.exit(1);
  });
};

startServer();
