import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

interface AuthRequest extends Request {
    userId?: string;
    jwtTokenVersion?: string;
}

function verifyToken(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ error: 'Access denied' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string , jwtTokenVersion: string};
      req.userId = decoded.userId;
      req.jwtTokenVersion = decoded.jwtTokenVersion;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

export { verifyToken };