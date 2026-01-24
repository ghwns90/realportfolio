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
  
  console.log('✅ Profile 데이터 준비 완료');
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  });
