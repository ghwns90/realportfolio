import { ResumeDto } from 'dtos/resume.dto';
import { prisma } from '../lib/prisma';

// 전체 resume 가져오기
export const getAllResumes = async () => {
  
  return await prisma.resume.findMany({ 
    orderBy: [
      {type: 'asc'},
      {order: 'asc'},
    ], 
  });

};

// resume 생성
export const createResume = async (data: ResumeDto) => {

  // 가장 높은 order 값 찾기
  const lastItem = await prisma.resume.findFirst({
    orderBy: {order: 'desc'},
    select: {order: true}
  });

  const nextOrder = lastItem ? lastItem.order + 1 : 1;

  return await prisma.resume.create({
    data: {
      ...data,
      order: nextOrder,
    },
  });
};

// resume 삭제
export const deleteResume = async (id: number) => {
  return await prisma.resume.delete({
    where: { id },
  })
};

// 순서 변경
export async function updateOrder(id: number, order: number) {
  
  return await prisma.resume.update({
    where: { id: Number(id) },
    data: { order: Number(order) }
  });
};

