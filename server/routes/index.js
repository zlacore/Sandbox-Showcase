import { Router } from 'express';
import authRoutes from './auth-routes.js';
import apiRoutes from './api/index.js'
import uploadRoutes from './upload-routes.js'

const router = Router();

// Auth routes (no authentication required)
router.use('/api/auth', authRoutes);

// Upload routes (separate from protected routes)
router.use('/api', uploadRoutes);

// Protected API routes
router.use('/api', apiRoutes);

export default router;
