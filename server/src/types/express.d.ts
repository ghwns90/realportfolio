import { Request } from 'express';

// Express의 Request 인터페이스에 user 속성을 공식적으로 합침(Merge)
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        username: string;
      };
    }
  }
}