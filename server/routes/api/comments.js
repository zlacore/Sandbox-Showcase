import express from 'express'

import { commentOnBuild, getCommentsForBuild, deleteComment } from '../../controllers/commentController'

const router = express.Router()

router.post('/', commentOnBuild)
router.get('/:buildId', getCommentsForBuild)
router.delete('/', deleteComment)

export { router as commentRouter }