
// 타입스크립트 - 우리가 사용할 데이터의 모양을 미리 약속,
// 공통 타입을 관리
// 프로젝트 데이터의 타입 정의 (Prisma Schema와 똑같이)

export interface Project {
  id: number,
  title: string,
  description: string,
  imageUrl: string,
  category: string,
  featuredType: 'main' | 'second' | 'none',
};

export interface Profile {
  name: string,
  role: string,
  email: string,
  location: string,
};

