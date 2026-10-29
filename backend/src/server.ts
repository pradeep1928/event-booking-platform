import app from "./app.js";
import { env } from "./config/env.js";
import { logger } from "./common/logger/logger.js";

import { BookingReservationExpiryJob } from "./jobs/booking-reservation-expiry.job.js";
import { prisma } from "./common/prisma/prisma.js";

const bookingReservationExpiryJob = new BookingReservationExpiryJob();

const server = app.listen(env.PORT, () => {
  logger.info(`Server running on http://${env.HOST}:${env.PORT}`);

  bookingReservationExpiryJob.start();
});

let isShuttingDown = false;

const shutdown = (signal: string) => {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;

  logger.info({ signal }, "Shutdown signal received");

  bookingReservationExpiryJob.stop();

  server.close(async (error) => {
    if (error) {
      logger.error({ error }, "Failed to close HTTP server");

      process.exit(1);
    }

    try {
      await prisma.$disconnect();

      logger.info("Database connection closed");
    } catch (error) {
      logger.error({ error }, "Failed to disconnect Prisma");
    }

    logger.info("HTTP server closed");

    process.exit(0);
  });
};

process.on("SIGINT", () => shutdown("SIGINT"));

process.on("SIGTERM", () => shutdown("SIGTERM"));
