import { Request, Response } from 'express';
import * as projectService from '../services/project.service';
import { projectDto } from '../dtos/project.dto'

// 프로젝트 목록 가져오기
export const listProjects = async (req: Request, res: Response) => {
  try {
    const projects = await projectService.getAllProjects();
    res.json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({message: '프로젝트 가져오는 중 서버 에러', error});
  }
};

// 프로젝트 추가
export const addProject = async (req: Request, res: Response) => {
  try {
    
    const projectData: projectDto = req.body;

    const project = await projectService.createProject(projectData, req.file);

    res.status(201).json(project);

  } catch (error) {
    console.error(error);
    res.status(500).json({message: '프로젝트 생성 중 오류 발생'});
  }
};

// 프로젝트 삭제
export const removeProject = async (req: Request, res: Response) => {
  try {

    const { id } = req.params;
    
    await projectService.deleteProject(Number(id));

    res.status(200).json({ message: '프로젝트가 삭제되었습니다 '});
  } catch (error) {

    console.error(error);
    res.status(500).json({ message: '프로젝트 삭제 실패' });
    
  };
};

// 데모 활성화 상태 토글
export const toggleStatus = async (req:Request, res: Response) => {
  try {
    const { id } = req.params;
    const { isDemoActive } = req.body;
    const updated = await projectService.updateProjectStatus(Number(id), isDemoActive);
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({message: '상태 변경 실패'});
  }
};

