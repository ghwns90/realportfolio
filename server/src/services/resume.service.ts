import { ResumeDto } from 'dtos/resume.dto';
import { prisma } from '../lib/prisma';
import { recordActivity } from './log.service';

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

  const newResume = await prisma.resume.create({
    data: {
      ...data,
      order: nextOrder,
    },
  });
  // 로그 기록
  await recordActivity('CREATE', 'RESUME', `${newResume.title} 항목을 새롭게 등록했습니다.`);
  
  return newResume;
};

// resume 삭제
export const deleteResume = async (id: number) => {

  const item = await prisma.resume.findUnique({ where: { id } });

  await prisma.resume.delete({
    where : { id },
  });
  // 로그 기록
  await recordActivity('DELETE', 'RESUME', `${item?.title} 항목을 삭제했습니다.`);
  
};

// 순서 변경
export async function updateOrder(id: number, order: number) {
  
  const resume = await prisma.resume.update({
    where: { id: Number(id) },
    data: { order: Number(order) }
  });

  // 로그 기록
  await recordActivity(
    'UPDATE', 
    'RESUME_ORDER', 
    `${resume.title}의 정렬 순서를 ${resume.order}번으로 변경했습니다.`
  );
};

// 화면용 리스트 조회
export const getPublicResumes = async () => {
  
  return await prisma.resume.findMany({
    orderBy: [
      {type: 'asc'},
      {order: 'asc'},
    ],
  });
}

