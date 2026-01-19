export interface Project {
  id: number;
  title: string;
  description: string;
  period?: string;
  techStack: string[];
  thumbnailUrl?: string;
  githubUrl?: string;
  demoUrl?: string;
  isDemoActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}