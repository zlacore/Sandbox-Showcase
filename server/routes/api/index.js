import { Router } from 'express';
import { buildRouter } from './builds.js';
import { authenticateToken } from '../../middleware/auth.js';
import { userRouter } from './users.js';

const router = Router();

router.use('/build', authenticateToken, buildRouter)
router.use('/user', userRouter);

export default router;
