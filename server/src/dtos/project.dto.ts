import { z } from 'zod';

export const projectSchema = z.object({
  body: z.object({
    title: z.string().min(1, "제목은 필수입니다."),
    description: z.string().min(1, "설명은 필수입니다."),
    period: z.string().optional(),
    techStack: z.union([z.array(z.string()), z.string()]).transform((val)=>typeof val === 'string' ? JSON.parse(val) : val),
    githubUrl: z.url().optional().or(z.literal('')),
    demoUrl: z.url().optional().or(z.literal('')),
    isDemoActive: z.union([z.boolean(), z.string()]).transform((val) => val === 'true' || val === true).default(true),
  })
});

export type projectDto = z.infer<typeof projectSchema>['body'];