import express from 'express';
// import { registerUser } from '../Controller/userController.js';
import { registerUser, loginUser } from '../controllers/userController.js';

const router = express.Router();

// Registration Route
router.post('/register', registerUser);

// Login Route
router.post('/login', loginUser);

export default router;
