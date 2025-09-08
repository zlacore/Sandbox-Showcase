import { Router } from 'express';
import { buildRouter } from './builds.js';
import { userRouter } from './users.js';
import { commentRouter } from './comments.js';
import { likedBuildRouter } from './likedBuilds.js';

const router = Router();

// Simplified routing to debug path-to-regexp error
router.use('/build', buildRouter);
router.use('/user', userRouter);
router.use('/comment', commentRouter)
router.use('/likedbuild', likedBuildRouter)

export default router;
