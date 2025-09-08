import express from 'express'
// import { Build } from '../../models/index.js'
import dotenv from 'dotenv'
import { authenticateToken } from '../../middleware/auth.js'

import { uploadBuild, getAllBuilds, getBuildsByUser, deleteBuild, getOneBuild } from '../../controllers/buildController.js'
dotenv.config()


const router = express.Router()
// Upload build (requires auth)
router.post('/', authenticateToken, uploadBuild)

router.delete('/:publicId', deleteBuild)
// Query all builds (no auth needed)
router.get('/', getAllBuilds)
// Query builds by user (no auth needed)
router.get('/:user', getBuildsByUser)

router.get('/:buildId', getOneBuild)

export { router as buildRouter }