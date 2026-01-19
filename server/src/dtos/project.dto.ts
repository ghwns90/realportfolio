import { z } from 'zod';

// 순수하게 "데이터"만 검증하는 스키마를 따로 정의
export const projectDataSchema = z.object({
  title: z.string().min(1, "제목은 필수입니다."),
  description: z.string().min(1, "설명은 필수입니다."),
  category: z.enum(["Web Development", "Applications"]),
  techStack: z.union([z.array(z.string()), z.string()]).transform((val) => 
    typeof val === 'string' ? JSON.parse(val) : val
  ),
  githubUrl: z.string().optional().or(z.literal('')),
  demoUrl: z.string().optional().or(z.literal('')),
  isDemoActive: z.union([z.boolean(), z.string()]).transform((val) => 
    val === 'true' || val === true
  ).default(true),
});

// 2. 미들웨어에서 쓸 "요청 전체" 스키마
export const projectSchema = z.object({
  body: projectDataSchema
});

export type projectDto = z.infer<typeof projectDataSchema>;