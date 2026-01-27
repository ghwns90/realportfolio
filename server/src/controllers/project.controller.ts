import { Request, Response, NextFunction } from 'express';
import * as projectService from '../services/project.service';
import { projectDataSchema, projectDto } from '../dtos/project.dto'
import { supabase } from 'lib/supabase';
import { AppError } from '../utils/AppError';

// 프로젝트 목록 가져오기
export const listProjects = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const projects = await projectService.getAllProjects();

    res.json(projects);
  } catch (error) {
    next(error);
  }
};

// 프로젝트 추가
export const addProject = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const file = req.file;
    let thumbnailUrl = '';

    if (file) {
      // 파일 이름 만들기
      const fileExt = file.originalname.split('.').pop();
      const fileName = `${Date.now()}_${Math.round(Math.random() * 1E9)}.${fileExt}`;

      // 저장 경로 정하기 supabase 버킷 안에서의 경로 projects/파일이름
      const filePath = `projects/${fileName}`;

      // Supabase로 전송
      const { error: uploadError } = await supabase.storage
        .from('portfolio')
        .upload(filePath, file.buffer, {
          contentType: file.mimetype,
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('portfolio')
        .getPublicUrl(filePath);

      thumbnailUrl = publicUrlData.publicUrl;

    }

    // FormData로 온 데이터 전처리
    let bodyData = { ...req.body };

    // techStack이 문자열로 왔다면 배열로 변환
    if (typeof bodyData.techStack === 'string') {
      try {
        // JSON 문자열인 경우 ('["React", "Node"]')
        bodyData.techStack = JSON.parse(bodyData.techStack);
      } catch {
        // 그냥 콤마로 구분된 문자열인 경우 ('React,Node')
        bodyData.techStack = bodyData.techStack.split(',').map((s: string) => s.trim());
      }
    }

    // DB 저장
    const validatedData = projectDataSchema.parse(bodyData);

    const project = await projectService.createProject(validatedData, thumbnailUrl);

    res.status(201).json(project);

  } catch (error) {
    next(error);
  }
};

// 프로젝트 삭제
export const removeProject = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const { id } = req.params;

    await projectService.deleteProject(Number(id));

    res.status(200).json({ message: '프로젝트가 삭제되었습니다 ' });
  } catch (error) {

    next(error);

  };
};

// 데모 활성화 상태 토글
export const toggleStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { isDemoActive } = req.body;
    const updated = await projectService.updateProjectStatus(Number(id), isDemoActive);
    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

// 화면용 프로젝트 조회
export const getPublicProjects = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const projects = await projectService.getPublicProjects();
    res.status(200).json(projects);
  } catch (error) {
    next(error);
  }
};