import { z } from 'zod';

// 프로필 수정용 DTO
export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(2, "이름은 두글자 이상이어야 합니다."),
    role: z.string().optional(),
    email: z.union([z.literal(""), z.email()]).optional(),       
    phone: z.string().optional(),
    location: z.string().optional(),
    description: z.string().optional(),
    avatarUrl: z.string().optional(),
    techStack: z.object({
      frontend: z.array(z.string()).optional(),
      backend: z.array(z.string()).optional(),
      devops: z.array(z.string()).optional(),
    }).optional(),
    socials: z.record(z.string(), z.string()).optional(),
  }),
});

// 비밀번호 변경용 DTO
export const changePasswordSchema = z.object({
  body: z.object({
    current: z.string().min(1, "현재 비밀번호를 입력해주세요."),
    new: z.string().min(4, "새 비밀번호는 4자 이상이어야 합니다."),
    confirm: z.string(),
  }).refine((data) => data.new === data.confirm, {
    message: "새 비밀번호가 일치하지 않습니다.",
    path: ["confirm"],
  }),
});

// Zod 스키마로 TypeScript 타입 자동 추출!
// 이제 컨트롤러에서 req.body 타입을 이걸로 쓰면됨
export type UpdateProfileDto = z.infer<typeof updateProfileSchema>['body'];
export type ChangePasswordDto = z.infer<typeof changePasswordSchema>['body'];
