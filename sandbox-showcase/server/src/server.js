import express from 'express';
import multer from 'multer'
import { sequelize } from './models/index.js';
import routes from './routes/index.js'; // Assuming .ts extension
import userRoutes from './routes/auth-routes.js'; // Assuming .ts extension
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary'
import { userRouter } from './routes/api/users.js';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})
dotenv.config(); // Load environment variables

const app = express();
const upload = multer({dest: 'uploads/'})

// app.post('/api/upload', upload.single('image'), async (req, res) => {
// try {
//   if (!req.file) return res.status(400).send('No file uploaded.')

//   const result = await cloudinary.uploader.upload(req.file.path, {
//     folder: 'builds'
//   })
//   res.json({url: result.secure_url})
//   console.log('Image uploaded successfully!')
// } catch (error) {
//   console.error('Upload failed', error);
//   res.status(500).send('Upload failed')
// }
// })
// Middleware for static files (serving the client-side build)
app.use(express.static('../client/dist'));

// Middleware for JSON and URL-encoded requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define the API routes for user authentication
app.use('/api/auth', userRoutes);


// Catch-all route for frontend (if you’re using a client-side framework like React)
app.use(routes);

const PORT = process.env.PORT || 5000;


// Database connection and server start
sequelize.authenticate()
  .then(() => {
    console.log('Database connected!');
    return sequelize.sync({ force: true }); // Sync all models
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

// Global error handler (optional)
app.use((err, _req, res, next) => {

  console.error('An error occurred:', err);

  console.log('res is not a proper response object', res);

  if(res && typeof res.status === 'function') {

    res.status(500).json({ error: 'Something went wrong!' });
  } else {
    next(err);
  }
});
