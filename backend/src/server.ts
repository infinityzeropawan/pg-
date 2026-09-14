import app from './app';
import { ENV } from './config/env';
import { prisma } from './db';

const server = app.listen(ENV.PORT, () => {
  console.log(`🚀 Smart PG Backend API running on http://localhost:${ENV.PORT}`);
  console.log(`📡 Environment: ${ENV.NODE_ENV}`);
});

/**
 * Graceful shutdown: close the HTTP server first, then disconnect Prisma so in-flight
 * Neon queries are not dropped on deploy/scale-down.
 */
async function shutdown(signal: string) {
  console.log(`\n${signal} received — shutting down gracefully...`);
  server.close(async () => {
    try {
      await prisma.$disconnect();
      console.log('✅ Database connection closed.');
    } catch (error) {
      console.error('⚠️ Error while disconnecting the database:', error);
    }
    process.exit(0);
  });

  // Force-exit if graceful close hangs.
  setTimeout(() => {
    console.error('⚠️ Forced exit after shutdown timeout.');
    process.exit(1);
  }, 10_000).unref();
}

process.on('SIGTERM', () => void shutdown('SIGTERM'));
process.on('SIGINT', () => void shutdown('SIGINT'));

process.on('unhandledRejection', reason => {
  console.error('⚠️ Unhandled promise rejection:', reason);
});

export default server;
