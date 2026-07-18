import app from './app.js';
import { env } from './config/env.js';
import { logger } from './common/logger/logger.js';

const server = app.listen(env.PORT, () => {
  logger.info(
    `Server running on http://${env.HOST}:${env.PORT}`,
  );
});

const shutdown = (signal: string) => {
  logger.info(`${signal} received`);

  server.close(() => {
    logger.info('HTTP server closed');  

    process.exit(0);
  });
};

process.on('SIGINT', () => shutdown('SIGINT'));

process.on('SIGTERM', () => shutdown('SIGTERM'));