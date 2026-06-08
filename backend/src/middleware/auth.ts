import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend Express Request interface untuk menampung data user hasil decode JWT
export interface AuthRequest extends Request {
  user?: {
    userId: string;
    username: string;
  };
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'Access denied, token missing' });
    return;
  }

  try {
    const secret = process.env.JWT_SECRET || 'kunci_rahasia_bebas_kamu_di_sini_123';
    const verified = jwt.verify(token, secret) as { userId: string; username: string };
    
    req.user = verified;
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid or expired token' });
  }
};
