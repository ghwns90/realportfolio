import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError";

// Express에서 인자가 4개(err, req, res, next)인 함수는 "에러 핸들러"로 인식
export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {

  //기본값 설정
  const statusCode = err.statusCode || 500;
  const message = err.message || '서버 내부 오류가 발생했습니다';

  console.error(`[Error] ${statusCode} - ${message}`);

  if (statusCode === 500) console.error(err);
  // 500일 때는 상세 로그 찍기

  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
  });
};