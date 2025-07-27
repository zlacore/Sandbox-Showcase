import { BuildFactory } from "../models/build.js";
import { sequelize } from "../models/index.js";
import User from "../models/user.js";
const Build = BuildFactory(sequelize)

export const uploadBuild = async (req, res) => {
    const username = req.user.username  // Use user ID instead of username
    const {
        title,
        url,
        description
    } = req.body

    console.log('Saving build to database!')

    try {
        const newBuild = await Build.create({
            user: username,  // Save user ID instead of username
            title,
            url,
            description
        })

        console.log('Build saved to database!')
        console.log(newBuild)

        res.status(201).json({ message: 'Build uploaded successfully!' })
    } catch (err) {
        console.error(err);

    }
}

export const getBuildsByUser = async (req, res) => {
    const { user } = req.params;
    try {
        const builds = await Build.findAll({ where: { user } });
        res.status(200).json(builds);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Could not query builds!' });
    }
};

export const getAllBuilds = async (_req, res) => {
    try {
        const builds = await Build.findAll()
        res.status(200).json(builds);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Could not query builds!' });
    }
}