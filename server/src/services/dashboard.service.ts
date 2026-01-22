import { prisma } from '../lib/prisma';

export const getDashBoardStats = async () => {

  // 병렬 쿼리로 전체 개수 가져오기
  const [projectCount, resumeCount, totalVisitors, unreadMessages] = await Promise.all([
    prisma.project.count(),
    prisma.resume.count(),
    prisma.visitorLog.count(),
    prisma.contactMessage.count({ where: {isRead : false}}),
  ]);

  // 기술스택 분포 계산
  const projects = await prisma.project.findMany({ select: {techStack: true} });
  const techMap: Record<string, number> = {};

  projects.forEach(p => {
    
    const techs = Array.isArray(p.techStack) ? p.techStack : JSON.parse(p.techStack as string);

    techs.forEach((tech: string) => {
      techMap[tech] = (techMap[tech] || 0) + 1;
    });
  });

  const topTechs = Object.entries(techMap)
                        .map(([name, count]) => ({ name, count }))
                        .sort((a, b) => b.count - a.count)
                        .slice(0, 5);

  // 최근 7일간 방문자 수 추이 ( 날짜별 그룹화 로직 )
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const visitorLogs = await prisma.visitorLog.findMany({
    where: {createdAt: { gte: sevenDaysAgo }}, // gte Greater Than Or Equal 크거나 같다
    select: {createdAt: true}
  });

  // 날짜별 카운트 가공
  const visitorStats = visitorLogs.reduce((acc: any, log: any) => {
    const date = log.createdAt.toISOString().split('T')[0];
    acc[date] = (acc[date] || 0) + 1;

    return acc;
  }, {});

  // 최근 활동 로그 5건
  const recentActivities = await prisma.activityLog.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' }
  });

  return {
    counts: { projectCount, resumeCount, totalVisitors, unreadMessages },
    topTechs,
    visitorStats,
    recentActivities,
  };
};
