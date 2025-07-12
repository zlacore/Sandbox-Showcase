import express from 'express'
// import { pool } from "../db";

// import type { Request, Response } from 'express';
import { User } from '../../models/index.js';
// import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { authenticateToken } from '../../middleware/auth.js';


dotenv.config();
const router = express.Router()

// GET /user - Get all users
router.get('/', async (_req, res) => {
  try {
    console.log(' res object is ', res);
    const users = await User.findAll({
      attributes: { exclude: ['password'] }
    });
    res.json(users);
  } catch (error) {
    console.log('error is ', error);
    res.status(500).json({ message: error.message });
  }
});

// GET /user/:id - Get a user by id
router.get('/:username', authenticateToken, async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({
        where: { username },
        attributes: { exclude: ['password'] }
    });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /user - Create a new user
router.post('/', async (req, res) => {
  try {
    console.log('res object in POST /user route:', res);
    const newUser = req.body;
    newUser.password = await bcrypt.hash(req.body.password, 13);
    const userData = await User.create(newUser);
    res.status(200).json(userData);
  } catch (error) {
    console.log('Error in POST /user route:', error);
    res.status(400).json({ message: error.message });
  }
});

// PUT /user/:id - Update a user by id
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { username, password } = req.body;
  try {
    const user = await User.findByPk(id);
    if (user) {
      user.username = username;
      user.password = password;
      await user.save();
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /user/:id - Delete a user by id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (user) {
      await user.destroy();
      res.json({ message: 'User deleted' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export { router as userRouter };
