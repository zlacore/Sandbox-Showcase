import express from 'express'
// import { Build } from '../../models/index.js'
import dotenv from 'dotenv'

import { uploadBuild, getAllBuilds, getBuildsByUser } from '../../controllers/buildController.js'
dotenv.config()


const router = express.Router()
// Upload build
router.post('/', uploadBuild)

// Query all builds
router.get('/', getAllBuilds)
// Query builds by user
router.get('/:user', getBuildsByUser)

export { router as buildRouter }