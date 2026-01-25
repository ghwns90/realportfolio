import { Request, Response } from 'express';
import * as profileService from '../services/profile.service'; 
import { UpdateProfileDto, ChangePasswordDto } from '../dtos/profile.dto';
import fs from 'fs';
import path from 'path';
import { supabase } from '../lib/supabase';

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
    
    const file = req.file;
    
    if (!file) {
      return res.status(400).json({ message: '이미지 파일이 없습니다.' });
    }

    const fileExt = file.originalname.split('.').pop();
    const fileName = `avatar_${Date.now()}.${fileExt}`;
    const filePath = `profiles/${fileName}`;

    // supabase 업로드
    const {error: uploadError} = await supabase.storage
      .from('portfolio')
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
    });

    if(uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('portfolio')
      .getPublicUrl(filePath);

    const avatarUrl = data.publicUrl;        
    
    const newAvatarUrl = await profileService.updateUserProfileImage(1, avatarUrl);

    res.status(201).json({url: newAvatarUrl});
    
  }catch(err){
    console.error(err);
    res.status(500).json({ message: '이미지 저장 중 에러 발생 '});
  } 
};

// 화면용 프로필 조회
export const getPublicProfile = async (req: Request, res: Response) => {
  try {
    const profile = await profileService.getPublicProfile();
    if(!profile) return res.status(404).json({ message: "프로필을 찾을 수 없습니다" });

    res.json(profile);

  } catch (error) {
    res.status(500).json({ message: "서버 오류 발생" });
  }
};