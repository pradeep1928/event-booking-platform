import { Router } from 'express';

const router = Router();

router.get('/health', (_, res) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date().toISOString(),
  });
});

export default router;