import { Router } from 'express';
import { successResponse } from '../common/utils/api-response.js';

const router = Router();

router.get('/health', (_req, res) => {
  return successResponse(
    res,
    {
      status: 'UP',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
    },
    'Health check successful',
  );
});

export default router;