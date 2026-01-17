import { Request, Response } from 'express';
import * as publicService from '../services/public.service';

export const getProfile = async (req: Request, res: Response) => {
  try {
    const profile = await publicService.getPublicProfile();
    if(!profile) return res.status(404).json({ message: "프로필을 찾을 수 없습니다" });

    res.json(profile);

  } catch (error) {
    res.status(500).json({ message: "서버 오류 발생" });
  }
};