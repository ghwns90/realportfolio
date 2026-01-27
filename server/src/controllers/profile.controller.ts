import { Request, Response, NextFunction } from 'express';
import * as profileService from '../services/profile.service';
import { UpdateProfileDto, ChangePasswordDto } from '../dtos/profile.dto';
import { AppError } from '../utils/AppError';
import { supabase } from '../lib/supabase';

// 프로필 조회
export const getProfile = async (req: Request, res: Response, next: NextFunction) => {

  try {
    const profile = await profileService.getUserProfile(1);

    if (!profile) {
      return res.status(200).json({ name: '', techStack: { frontend: [], backend: [], devops: [] } });
    }

    res.status(200).json(profile);

  } catch (error) {
    next(error);
  }
};
// 프로필 수정
export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {

  try {
    const profileDto = req.body as UpdateProfileDto;

    const updatedProfile = await profileService.updateUserProfile(profileDto);

    res.status(200).json({
      message: '프로필이 저장되었습니다.',
      profile: updatedProfile
    });
  } catch (error) {
    next(error);
  }
};

// 비밀번호 변경
export const updatePassword = async (req: Request, res: Response, next: NextFunction) => {

  try {

    const userId = req.user!.id;
    const { current, new: newPassword }: ChangePasswordDto = req.body;

    await profileService.changeAdminPassword(userId, current, newPassword);

    res.status(200).json({ message: '비밀번호 변경 완료' });

  } catch (error: any) {

    if (error.message === 'PASSWORD_MISMATCH') {
      return next(new AppError('현재 비밀번호가 틀렸습니다.', 400));
    }
    next(error);
  }
};
// 프로필 사진 업데이트
export const updateAvatar = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const file = req.file;

    if (!file) {
      return next(new AppError('이미지 파일이 없습니다.', 404));
    }

    const fileExt = file.originalname.split('.').pop();
    const fileName = `avatar_${Date.now()}.${fileExt}`;
    const filePath = `profiles/${fileName}`;

    // supabase 업로드
    const { error: uploadError } = await supabase.storage
      .from('portfolio')
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('portfolio')
      .getPublicUrl(filePath);

    const avatarUrl = data.publicUrl;

    const newAvatarUrl = await profileService.updateUserProfileImage(1, avatarUrl);

    res.status(201).json({ url: newAvatarUrl });

  } catch (error) {
    next(error);
  }
};

// 화면용 프로필 조회
export const getPublicProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const profile = await profileService.getPublicProfile();
    if (!profile) return next(new AppError("프로필을 찾을 수 없습니다.", 404));

    res.json(profile);

  } catch (error) {
    next(error);
  }
};