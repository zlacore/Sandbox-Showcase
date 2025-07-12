// import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken'

export const authenticateToken = (
  req,
  res,
  next
) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    const secretKey = process.env.JWT_SECRET_KEY || 'your-secret-key';

    jwt.verify(token, secretKey, (err, user) => {
      if (err) {
        return res.sendStatus(403); // Forbidden
      }

      req.user = user;
      return next();
    });
  } else {
    res.sendStatus(407); // Unauthorized
  }
};
