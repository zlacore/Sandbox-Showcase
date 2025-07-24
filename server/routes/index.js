import { Router } from 'express';
import authRoutes from './auth-routes.js';
import apiRoutes from './api/index.js'
import uploadRoutes from './upload-routes.js'
import { authenticateToken } from '../middleware/auth.js';
const router = Router();
router.use('/api/auth', authRoutes);
router.use('/api', uploadRoutes)

router.use('/api', authenticateToken, apiRoutes);
export default router
