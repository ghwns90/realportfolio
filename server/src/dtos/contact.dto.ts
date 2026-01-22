import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().min(1, "이름은 최소 2글자 이상이어야 합니다."),
  email: z.email(),
  message: z.string().min(1),
});

// 답장용 스키마
export const replySchema = z.object({
  replyContent: z.string().min(1, "답장 내용을 입력해주세요."),
});

export type ContactDto = z.infer<typeof contactSchema>;