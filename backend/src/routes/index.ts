import { Router } from 'express';
import healthRoute from './health.route.js';

const router = Router();

router.use(healthRoute);

export default router;