import { Router } from 'express';
import { buildRouter } from './builds.js';
import { userRouter } from './users.js';

const router = Router();

router.use('/build', buildRouter)
router.use('/user', userRouter);

export default router;
