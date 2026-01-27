import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

// 스키마를 받아서 검사해주는 고차 함수(Currying)
export const validate = (schema: z.ZodType) => 
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // 요청 데이터(body, query, params)가 스키마와 맞는지 검사
      const validatedData = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      }) as any;

      req.body = validatedData.body;

      return next(); 

    } catch (error) {

      // console.log("Validation Error:", error);
  
      if (error instanceof z.ZodError) {
        const errors = error.issues.map((issue) => ({
          field: issue.path[1] || issue.path[0], 
          message: issue.message,
        }));
        return res.status(400).json({ message: '입력값이 올바르지 않습니다.', errors });
      }
      return res.status(400).json(error);
    }
  };