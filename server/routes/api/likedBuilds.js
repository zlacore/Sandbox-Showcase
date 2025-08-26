import express from "express"
import { likeBuild, getLikedBuilds, unlikeBuild } from "../../controllers/likedBuildController"
import { deleteBuild } from "../../controllers/buildController";

const router = express.Router()

router.post('/', likeBuild);
router.get('/:username', getLikedBuilds)
router.delete('/:buildId', unlikeBuild)

export {router as likedBuildRouter}