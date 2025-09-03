import { LikedBuildFactory } from "../models/likedBuild.js";
import { BuildFactory } from "../models/build.js";
import { sequelize } from "../models/index.js";

const LikedBuild = LikedBuildFactory(sequelize)
const Build = BuildFactory(sequelize)
// TODO: Create functions to upload and query liked builds by user


export const likeBuild = async (req, res) => {
    const { user, buildId } = req.body
    try {
        const alreadyLiked = await LikedBuild.findOne({ where: { user, buildId } });
        if (alreadyLiked) {
            return res.status(400).json({ message: "Already liked!" });
        }
        const likedBuild = await LikedBuild.create({ user, buildId })
        const build = await Build.findByPk(buildId)
        if (build) {

            build.likes += 1;
            await build.save()
        }
        res.status(200).json({build, likedBuild} )
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to save liked build!' });
    }
}

export const unlikeBuild = async (req, res) => {
    const { user, buildId } = req.body
    try {
        const unlikedBuild = await LikedBuild.destroy({ where: { user, buildId } })
        const build = await Build.findByPk(buildId)
        if (build) {

            if (build.likes > 0) build.likes -= 1;
            await build.save()
        }
        res.status(200).json({ build, unlikedBuild })
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to unlike build!' });
    }
}
export const getLikedBuilds = async (req, res) => {
    const { username } = req.params
    try {
        const likedBuilds = await LikedBuild.findAll({ where: { user: username } })
        res.status(200).json(likedBuilds)
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Could not query builds!' });
    }
}