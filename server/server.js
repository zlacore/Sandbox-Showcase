import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from the parent directory (root of project)
dotenv.config({ path: path.join(__dirname, '../.env') });

import express from 'express';
import cors from 'cors'
import { sequelize } from './models/index.js';
import routes from './routes/index.js';
// import authRoutes from './routes/auth-routes.js'
import { v2 as cloudinary } from 'cloudinary'
// import { userRouter } from './routes/api/users.js';

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
    : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'], // Allow requests from Vite dev server
  credentials: true
}));

// Middleware for static files (serving the client-side build)
app.use(express.static(path.join(__dirname, '../dist'))); // Serve built files from dist directory

// Middleware for JSON and URL-encoded requests
app.use(express.json({ limit: '50mb'}));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  console.log('Headers:', req.headers.authorization ? 'Auth header present' : 'No auth header');
  console.log('Body:', req.body ? 'Body present' : 'No body');
  next();
});

// Use main routes (which includes auth routes at /api/auth)
app.use(routes);

// Catch-all handler: send back React's index.html file for any non-API routes
app.use((req, res, next) => {
  // Only serve the React app for non-API routes
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  } else {
    res.status(404).json({ error: 'API endpoint not found' });
  }
});

const PORT = process.env.PORT || 5001;

// Database connection and server start
sequelize.authenticate()
  .then(() => {
    console.log('Database connected!');
    // One-time reset to fix database structure completely
    return sequelize.sync(
      // Quick reset to sync database
      // { force: true}
    ); 
  })
  .then(() => {
    const server = app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });

    // Handle server errors
    server.on('error', (err) => {
      console.error('Server error:', err);
    });
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Global error handler (optional)
app.use((err, _req, res, next) => {
  console.error('An error occurred:', err);

  // Only send response if headers haven't been sent yet
  if (!res.headersSent) {
    res.status(500).json({ error: 'Something went wrong!' });
  } else {
    // If headers were already sent, just pass to default Express error handler
    next(err);
  }
});
