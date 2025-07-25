import { Router } from 'express';
import { buildRouter } from './builds.js';
import { authenticateToken } from '../../middleware/auth.js';
import { userRouter } from './users.js';

const router = Router();

// Simplified routing to debug path-to-regexp error
router.use('/build', buildRouter);
router.use('/user', userRouter);

export default router;
