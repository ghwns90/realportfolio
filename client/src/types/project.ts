export interface Project {
  id: number;
  title: string;
  description: string;
  category: string;
  techStack: string[];
  thumbnailUrl?: string;
  githubUrl?: string;
  demoUrl?: string;
  isDemoActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}