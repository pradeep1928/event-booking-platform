import { Router } from 'express';
import healthRoute from './health.route.js';
import authRoutes from '../modules/auth/auth.routes.js';
import userRoutes from '../modules/users/user.routes.js'

const router = Router();

// Health
router.use(healthRoute);

// Authentication
router.use('/auth', authRoutes);

// Users
router.use('/users', userRoutes)

// Events
// router.use('/events', eventRoutes);

// Bookings
// router.use('/bookings', bookingRoutes);

export default router;