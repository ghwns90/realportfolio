import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key';

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {

  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if(!token){
    return res.status(401).json({message: '인증 토큰이 없습니다. 로그인 해 주세요'});
  }

  try {

    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; username: string };
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({message: '유효하지 않은 토큰입니다.'});
  }
};