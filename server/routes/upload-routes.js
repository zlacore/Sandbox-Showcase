import express from 'express'
import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary'
// import { uploadBuild } from '../controllers/buildController'
const router = express.Router()

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 50 * 1024 * 1024
    }
})

router.post('/upload', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No image file provided' })
        }

        console.log('Uploading image to Cloudinary')

        const result = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                { resource_type: 'auto' },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result)
                }
            ).end(req.file.buffer)
        })

        console.log('Image uploaded successfully', result.secure_url)

        const data = res.json({
            message: 'Image uploaded successfully',
            imageUrl: result.secure_url,
            publicId: result.public_id
        })

        console.log(data)


    } catch (err) {
        console.error('Image upload error:', err);
        res.status(500).json({ message: 'Failed to upload image' });
    }

})

export default router