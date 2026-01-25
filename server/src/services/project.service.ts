import { projectDto } from 'dtos/project.dto';
import { prisma } from '../lib/prisma';
import fs from 'fs';
import path from 'path';
import { recordActivity } from './log.service';

// 전체 프로젝트 가져오기
export const getAllProjects = async () => {
  
  return await prisma.project.findMany({ orderBy: {order: 'asc'} });

};

// 프로젝트 생성
export const createProject = async (data: projectDto, thumbnailUrl?: string) => {

  const lastProject = await prisma.project.findFirst({
    orderBy: { order: 'desc' },
  });

  const nextOrder = lastProject ? lastProject.order + 1 : 1;

  const project = await prisma.project.create({
    data: {...data, thumbnailUrl, order: nextOrder}
  });

  //로그 기록
  await recordActivity('CREATE', 'PROJECT', `${project.title} 프로젝트를 등록했습니다.`);

  return project;
};

// 프로젝트 삭제
export const deleteProject = async (id: number) => {
  const project = await prisma.project.findUnique({ where: { id }});

  if(project?.thumbnailUrl){
    const filePath = path.join(__dirname, '../../', project.thumbnailUrl);

    if(fs.existsSync(filePath)) fs.unlinkSync(filePath);

  }

  await prisma.project.delete({ where: { id }});
  // 로그 기록
  await recordActivity('DELETE', 'PROJECT', `${project?.title} 프로젝트를 삭제했습니다`);
};
// 상태 수정
export const updateProjectStatus = async (id: number, isDemoActive: boolean) => {
  
  await prisma.project.update({
    where: { id },
    data: { isDemoActive }
  });
  // 로그 기록
  await recordActivity(
    'UPDATE',
    'PROJECT_STATUS',
    `${id}번 프로젝트를 ${isDemoActive? '활성화' : '비활성화'}로 전환했습니다.`,
  );
};

// 화면용 프로젝트 가져오기
export const getPublicProjects = async () => {
  return await prisma.project.findMany({
    orderBy: {
      order: 'asc',
    }
  });
}

