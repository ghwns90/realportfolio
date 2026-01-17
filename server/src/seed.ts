require('dotenv').config();
const { prisma } = require('./lib/prisma');
const bcrypt = require('bcryptjs');

async function main() {
  console.log('🌱 [Prisma 7] 관리자 계정 생성 시작...');
  
  try {
    const password = await bcrypt.hash('1234', 10);
    
    const admin = await prisma.admin.upsert({
      where: { username: 'admin' },
      update: {},
      create: {
        username: 'admin',
        password,
      },
    });
    
    console.log('✅ 드디어 성공! 관리자 계정이 준비되었습니다.');
    console.log(`   - ID: ${admin.username} / PW: 1234`);
  } catch (error) {
    console.error('❌ 실행 중 에러:', error);
  }

  await prisma.profile.upsert({
    where: {id: 1},
    update: {
      name: '김선배',
      role: 'Application Developer',
      description: '안녕하세요! 풀스택 개발자를 꿈꾸는 김선배입니다.',
      techStack: {
        frontend: ['React', 'TypeScript'],
        backend: ['Node.js', 'Prisma'],
        devops: ['Docker', 'Git'],
      }
    },
    create: {
      name: '김선배',
      role: 'Application Developer',
      email: 'sunbae@example.com',
      phone: '010-1234-5678',
      location: 'Seoul, Korea',
      description: '안녕하세요! 풀스택 개발자를 꿈꾸는 김선배입니다.',
      techStack: {
        frontend: ['React', 'TypeScript', 'Next.js'],
        backend: ['Node.js', 'NestJS', 'PostgreSQL'],
        devops: ['Docker', 'AWS']
      },
      socials: {
        github: 'https://github.com',
        instagram: 'https://instagram.com'
      }
    },

  });
  
  console.log('✅ Profile 데이터 준비 완료');
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  });
