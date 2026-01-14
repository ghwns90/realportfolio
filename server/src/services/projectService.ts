import { prisma } from '../lib/prisma';

export const getAllProjects = async () => {
  // prisma 로 갖고오기
  return await prisma.project.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });
};