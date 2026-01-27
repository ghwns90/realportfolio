import { resumeDataSchema } from 'dtos/resume.dto';
import * as resumeService from '../services/resume.service';
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

// 리스트 조회
export const listResumes = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const resumes = await resumeService.getAllResumes();

    res.status(200).json(resumes);

  } catch (error) {
    next(error);
  };
};
// 항목 추가
export const addResume = async (req: Request, res: Response, next: NextFunction) => {

  try {
    const data = resumeDataSchema.parse(req.body);

    const newResume = await resumeService.createResume(data);

    res.status(201).json(newResume);

  } catch (error) {
    next(error);
  }
};

// 항목 삭제
export const removeResume = async (req: Request, res: Response, next: NextFunction) => {

  try {
    const { id } = req.params;

    await resumeService.deleteResume(Number(id));

    res.status(200).json({ message: '삭제되었습니다.' });

  } catch (error) {
    next(error);
  }
};

// 순서 변경 (order 업데이트)
export const updateOrder = async (req: Request, res: Response, next: NextFunction) => {

  try {
    const { id } = req.params;
    const { order } = req.body;

    await resumeService.updateOrder(Number(id), order);

    res.json({ message: '순서 변경 완료' });
  } catch (error) {
    next(error);
  }

};

// 유저 화면용 리스트 조회
export const getPublicResumes = async (req: Request, res: Response, next: NextFunction) => {

  try {

    const resumes = await resumeService.getPublicResumes();

    res.status(200).json(resumes);

  } catch (error) {
    next(error);
  }
};