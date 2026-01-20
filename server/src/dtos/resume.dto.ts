import { z } from 'zod';

export const resumeDataSchema = z.object({
  type: z.enum(['education', 'experience']),
  title: z.string().min(1),
  period: z.string().min(1),
  description: z.string().min(1),
  order: z.number().optional().default(0),
});

export const resumeSchema = z.object({
  body: resumeDataSchema
});

export type ResumeDto = z.infer<typeof resumeDataSchema>;