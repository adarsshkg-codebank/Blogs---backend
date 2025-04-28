import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) {
      res.status(401).json({ message: "No token present" });
      return
    }

    jwt.verify(token, process.env.SECRET as string, (err, user) => {
      if (err) {
        res.status(403).json({ message: "Invalid token" });
        return
      }

      req.user = user;
      next();
    });
  } catch (err) {
    res.status(500).json({ message: "Internal server Error" })
    return
  }

};

export { authenticateToken }

