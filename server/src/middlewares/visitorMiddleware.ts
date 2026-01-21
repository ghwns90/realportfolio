import { Request, Response, NextFunction } from 'express';
import { prisma } from 'lib/prisma';

export const visitorLogger = async (req: Request, res: Response, next: NextFunction) => {

  const {method, path} = req;

  const excludePaths = ['/auth', '/admin', '/favicon.ico'];
  const isExcluded = excludePaths.some(p => path.includes(p));
  // 관리자 API나 정적파일 요청은 제외하고
  // 실제 사용자용 API(/api/resumes, /api/projects 등) 요청만 기록
  if(method === 'GET' && !isExcluded) {
    
    (async () => {
      try {
        const ip = (req.headers['x-forwarded-for'] as string || req.ip || 'unknown');

        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        // 해당 IP가 오늘 접속한 기록이 있는지 확인
        const existingLog = await prisma.visitorLog.findFirst({
          where: {
            ip,
            createdAt: {gte : startOfToday},
          }
        });

        if(!existingLog) {
          await prisma.visitorLog.create({
            data: {ip, path}
          });
        }
      } catch (error) {
        console.error('방문자 로그 기록 실패', error);
      }
    })();
  }

  next();
};