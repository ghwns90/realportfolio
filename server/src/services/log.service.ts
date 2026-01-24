import { prisma } from "lib/prisma";

export const recordActivity = async (action: string, target: string, details: string) => {

  try {

    await prisma.activityLog.create({
      data: { action, target, details }
    });
    
  } catch (error) {
    console.error('활동 로그 시스템 에러', error);
  }
};