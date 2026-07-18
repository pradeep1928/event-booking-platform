import { Router } from 'express';

const router = Router();

router.get('/health', (_, res) => {
  res.status(200).json({
    success: true,
    status: 'UP',
    service: 'event-booking-api',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

export default router;