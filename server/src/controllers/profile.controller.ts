import { Request, Response } from 'express';
import * as profileService from '../services/profile.service'; 
import { UpdateProfileDto, ChangePasswordDto } from '../dtos/profile.dto';
import fs from 'fs';
import path from 'path';

// 프로필 조회
export const getProfile = async (req: Request, res: Response) => {

  try{
    const profile = await profileService.getUserProfile(1);

    if (!profile) {
      return res.status(200).json({ name: '', techStack: { frontend: [], backend: [], devops: [] } });
    }

    res.status(200).json(profile);

  }catch(err){
    console.error(err);
    res.status(500).json({ message: '서버 에러: 프로필을 가져올 수 없습니다' });
  }
};
// 프로필 수정
export const updateProfile = async (req: Request, res: Response) => {
  
  try {
    const profileDto = req.body as UpdateProfileDto;

    const updatedProfile = await profileService.updateUserProfile(profileDto);
    
    res.status(200).json({ 
      message: '프로필이 저장되었습니다.', 
      profile: updatedProfile 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '저장 실패' });
  }
};

// 비밀번호 변경
export const updatePassword = async (req: Request, res: Response) => {

  try {
    
    const userId = req.user!.id; 
    const { current, new: newPassword }: ChangePasswordDto = req.body;

    await profileService.changeAdminPassword(userId, current, newPassword);

    res.status(200).json({ message: '비밀번호 변경 완료' });
  } catch (error: any) {
    
    if (error.message === 'PASSWORD_MISMATCH') {
      return res.status(400).json({ message: '현재 비밀번호가 틀렸습니다.' });
    }
    res.status(500).json({ message: '서버 에러' });
  }
};
// 프로필 사진 업데이트
export const updateAvatar = async (req: Request, res: Response) => {
  try {
    if(!req.file) return res.status(400).json({ message: '파일이 업로드되지 않았습니다.' });

    const newAvatarUrl = await profileService.updateUserProfileImage(1, req.file);

    res.status(200).json({ url: newAvatarUrl });

  }catch(err){
    console.error(err);
    res.status(500).json({ message: '이미지 저장 중 에러 발생 '});
  } 
}