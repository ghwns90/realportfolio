import { prisma } from '../lib/prisma';

// 프로필 가져오기
export const getPublicProfile = async () => {
  return await prisma.profile.findUnique({
    where: {id : 1}
  });
};