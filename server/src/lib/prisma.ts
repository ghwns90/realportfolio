import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();
// PostgreSQL 연결 풀 생성
const pool = new Pool({ connectionString: process.env.DATABASE_URL});

// Prisma 전용 어댑터로 감싸기
const adapter = new PrismaPg(pool);

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// pool생성(DB정보) -> pool을 PrismaPg로 감쌈 adapter -> adapter를 PrismaClient한테 주고 생성

// PrismaClient 에 어댑터 주입
export const prisma = 
  globalForPrisma.prisma || 
  new PrismaClient({
    adapter,
    log: ['query'],
  });

if(process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;  