import express from "express"
import { likeBuild, getLikedBuilds, unlikeBuild } from "../../controllers/likedBuildController.js"
// import { deleteBuild } from "../../controllers/buildController";

const router = express.Router()

router.post('/', likeBuild);
router.delete('/', unlikeBuild)
router.get('/:username', getLikedBuilds)

export {router as likedBuildRouter}