import dotenv from 'dotenv';
dotenv.config(); // Load environment variables first

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
// import multer from 'multer'
import cors from 'cors'
import { sequelize } from './models/index.js';
import routes from './routes/index.js';
// import authRoutes from './routes/auth-routes.js'
import { v2 as cloudinary } from 'cloudinary'
// import { userRouter } from './routes/api/users.js';

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

const app = express();
// const upload = multer({dest: 'uploads/'})

// Enable CORS for all routes
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL || true  // Allow all origins in production or specific URL
    : ['http://localhost:5173', 'http://localhost:5174'], // Allow requests from Vite dev server
  credentials: true
}));

// Middleware for static files (serving the client-side build)
app.use(express.static('dist')); // Serve built files from dist directory

// Middleware for JSON and URL-encoded requests
app.use(express.json({ limit: '50mb'}));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Use main routes (which includes auth routes at /api/auth)
app.use(routes);

// Catch-all handler: send back React's index.html file for any non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

const PORT = process.env.PORT || 5000;

// Database connection and server start
sequelize.authenticate()
  .then(() => {
    console.log('Database connected!');
    return sequelize.sync({force: true}); // Sync all models
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
