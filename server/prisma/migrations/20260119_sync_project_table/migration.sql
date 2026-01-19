-- 1. 기존 잔재 삭제
DROP TABLE IF EXISTS "projects";
DROP TABLE IF EXISTS "project";

-- 2. 스키마와 100% 일치하는 테이블 생성
CREATE TABLE "projects" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "description" TEXT NOT NULL,
    "period" VARCHAR(100), -- 50에서 100으로 수정 완료
    "techStack" JSONB NOT NULL,
    "thumbnail_url" TEXT,
    "github_url" TEXT,
    "demo_url" TEXT,
    "is_demo_active" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);