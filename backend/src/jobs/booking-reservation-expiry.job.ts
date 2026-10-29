import { BookingStatus } from "@prisma/client";

import { BookingRepository } from "../modules/bookings/booking.repository.js";
import { PaymentService } from "../modules/payments/payment.service.js";
import { logger } from "../common/logger/logger.js";

const JOB_INTERVAL_MS = 60 * 1000;

const BATCH_SIZE = 100;

export class BookingReservationExpiryJob {
  private isRunning = false;
  private intervalId: NodeJS.Timeout | null = null;
  constructor(
    private readonly bookingRepository = new BookingRepository(),
    private readonly paymentService = new PaymentService(),
  ) {}

  start() {
    if (this.intervalId) {
      return;
    }

    logger.info(
      {
        intervalMs: JOB_INTERVAL_MS,
      },
      "Booking reservation expiry job started",
    );

    // Run once immediately when the application starts.
    void this.run();

    this.intervalId = setInterval(() => {
      void this.run();
    }, JOB_INTERVAL_MS);

    // Don't keep Node alive only because of this timer.
    this.intervalId.unref();
  }

  stop() {
    if (!this.intervalId) {
      return;
    }

    clearInterval(this.intervalId);
    this.intervalId = null;
    logger.info("Booking reservation expiry job stopped");
  }

  private async run() {
    /*
     * Prevent overlapping execution inside
     * this Node.js process.
     */
    if (this.isRunning) {
      return;
    }

    this.isRunning = true;

    try {
      const reservations =
        await this.bookingRepository.findExpiredPendingReservations(BATCH_SIZE);

      if (reservations.length === 0) {
        return;
      }

      logger.info(
        {
          count: reservations.length,
        },
        "Processing expired booking reservations",
      );

      for (const reservation of reservations) {
        await this.expireReservation(reservation.id);
      }
    } catch (error) {
      logger.error(
        {
          error,
        },
        "Booking reservation expiry job failed",
      );
    } finally {
      this.isRunning = false;
    }
  }

  private async expireReservation(bookingId: string) {
    try {
      const booking =
        await this.bookingRepository.expirePendingReservation(bookingId);

      /*
       * expirePendingReservation() is idempotent.
       * However, payment attempts should only be
       * expired if the booking actually ended up
       * EXPIRED.
       */
      if (!booking || booking.status !== BookingStatus.EXPIRED) {
        return;
      }

      await this.paymentService.expirePendingPayments(bookingId);

      logger.info(
        {
          bookingId,
        },
        "Booking reservation expired and seats released",
      );
    } catch (error) {
      logger.error(
        {
          bookingId,
          error,
        },
        "Failed to expire booking reservation",
      );
    }
  }
}
