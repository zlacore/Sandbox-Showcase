// import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.js'; 

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const registerUser = async (req, res) => {
    const {
        username,
        email,
        password,
    } = req.body;

    try {
        // Validate request body
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Required fields are missing.' });
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {

            return res.status(400).json({ message: 'User already exists.' });
        }

        // Hash the password
        

        // Create new user

        console.log('Registering user:', { username, email, password });
        
        const newUser = await User.create({
            username,
            email,
            password,
        });

        console.log('New user created:', newUser.dataValues.username);
        console.log(newUser)

        // Generate JWT
        const token = jwt.sign({ id: newUser.id }, JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ message: 'User created successfully.', token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
    return;
}


export const loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        if (!username || !password) {

            console.log('Required fields are missing:');
            return res.status(400).json({ message: 'Required fields are missing.' });
        }

        const user = await User.findOne({ where: { username } });
        
        console.log(req.username)
        console.log(req.password)
        if (!user) {
            console.log('User not found:');
            
            return res.status(404).json({ message: 'User not found.' });
        }       

        if (!user.password || !password) {
            console.log('Password missing for user or request')
            return res.status(404).json({message: 'Password missing'})
        }
        
        const isPasswordValid = await bcrypt.compare(password, user.password);        

        if (!isPasswordValid) {
            console.log('Wrong password');
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });

        console.log('User logged in:', user.username);

        return res.json({token, user: { id: user.id, username: user.username }});
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
    
    return;
}
