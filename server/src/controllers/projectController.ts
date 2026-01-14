import { Request, Response } from 'express';
import * as projectService from '../services/projectService';

export const getProjects = async (req: Request, res: Response) => {
  try {
    const projects = await projectService.getAllProjects();
    res.json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({message: '프로젝트 가져오는 중 서버 에러', error});
  }
};