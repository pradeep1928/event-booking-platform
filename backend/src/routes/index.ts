import { Router } from 'express';
import healthRoute from './health.route.js';
import authRoutes from '../modules/auth/auth.routes.js';

const router = Router();

router.use(healthRoute);
router.use('/auth', authRoutes);

export default router;