import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.status(401).json({ message: "No token present" });

    jwt.verify(token, process.env.SECRET as string, (err, user) => {
      if (err) return res.status(403).json({ message: "Invalid token" });

      req.user = user;
      next();
    });
  } catch (err) {
    res.status(500).json({ message: "Internal server Error" })
  }

};

export { authenticateToken }

