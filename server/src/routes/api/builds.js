import express from 'express'
import  { Build }from '../../models/index.js'
import dotenv from 'dotenv'
dotenv.config()

const router = express.Router()

router.get('/', async (_req, res) => {
    try {
        console.log('Querying builds!')
        const builds = await Build.findAll()
        res.json(builds)
    } catch (err) {
        console.error(err, "Could not query builds!")
    }
})

export { router as buildRouter }