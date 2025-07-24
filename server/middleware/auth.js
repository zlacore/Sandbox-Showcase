// import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken'

export const authenticateToken = (
  req,
  res,
  next
) => {
  console.log('Auth middleware hit for:', req.method, req.path);
  const authHeader = req.headers.authorization;
  console.log('Auth header:', authHeader);

  if (authHeader) {
    const token = authHeader.split(' ')[1];
    console.log('Extracted token:', token ? 'Token present' : 'No token');

    const secretKey = process.env.JWT_SECRET || 'your-secret-key';

    jwt.verify(token, secretKey, (err, user) => {
      if (err) {
        console.log('Token verification failed:', err.message);
        return res.sendStatus(403); // Forbidden
      }

      console.log('Token verified successfully for user:', user);
      req.user = user;
      return next();
    });
  } else {
    console.log('No authorization header provided');
    res.sendStatus(401); // Unauthorized
  }
};
