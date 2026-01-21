import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';
import { UpdateProfileDto } from '../dtos/profile.dto';
import fs from 'fs';
import path from 'path';
import { recordActivity } from './log.service';

// 프로필 조회
export const getUserProfile = async (profileId: number) => {
  const profile = await prisma.profile.findUnique({
    where: { id: profileId },
  });

  if (!profile) return null;
  
  // 💡 데이터를 반환하기 전에 날짜 포맷팅
  return {
    ...profile,
    birthday: profile.birthday ? profile.birthday.toISOString().split('T')[0] : null,
  }

};

// 프로필 업데이트
export const updateUserProfile = async (data: UpdateProfileDto) => {
  
  // 일일이 나열하지 않고 스프레드 연산자(...)를 쓰거나 
  // 객체를 통째로 넘겨도 Prisma가 알아서 처리한다
  const profileData = {
    ...data,
    techStack: data.techStack ?? { frontend: [], backend: [], devops: [] },
    socials: data.socials ?? {},
  };

  const updatedProfile = await prisma.profile.upsert({
    where: { id: 1 }, // 포트폴리오용 고정 ID
    update: profileData,
    create: {
      id: 1,
      ...profileData, // 👈 id와 함께 DTO 데이터를 풀어서 전달!
    },
  });

  await recordActivity(
    'UPDATE',
    'PROFILE',
    '프로필 정보를 수정했습니다.'
  );

  return {
    ...updatedProfile,
    birthday: updatedProfile.birthday ? updatedProfile.birthday.toISOString().split('T')[0] : null,
  };
};

// 비밀번호 변경
export const changeAdminPassword = async (adminId: number, current: string, newPass: string) => {
  const admin = await prisma.admin.findUnique({ where: { id: adminId } });
  
  if (!admin) throw new Error('ADMIN_NOT_FOUND');

  const isMatch = await bcrypt.compare(current, admin.password);
  if (!isMatch) throw new Error('PASSWORD_MISMATCH');

  const hashedPassword = await bcrypt.hash(newPass, 10);
  
  await prisma.admin.update({
    where: { id: adminId },
    data: { password: hashedPassword },
  });
  
  await recordActivity(
    'UPDATE',
    'PASSWORD',
    '비밀번호를 변경했습니다.'
  )

  return true;
};

// 프로필 이미지 업데이트
export const updateUserProfileImage = async (profileId: number, file: Express.Multer.File) => {

  const currentProfile = await prisma.profile.findUnique({ where: {id : profileId}});

  if(currentProfile?.avatarUrl){
    
    const oldFilePath = path.join(__dirname, '../../', currentProfile.avatarUrl);

    if(fs.existsSync(oldFilePath)){
      fs.unlinkSync(oldFilePath);
      console.log(`🗑️ 이전 이미지 삭제 완료: ${oldFilePath}`);
    }
  }

  const newAvatarUrl = `/uploads/profiles/${file.filename}`;

  await prisma.profile.update({
    where: {id: profileId},
    data: { avatarUrl: newAvatarUrl },
  });

  await recordActivity('UPDATE', 'PROFILEIMAGE', '프로필 이미지를 변경하였습니다.');

  return newAvatarUrl;
}

// 화면용 프로필 가져오기
export const getPublicProfile = async () => {
  
  const profile =  await prisma.profile.findUnique({
    where: {id : 1}
  });

  if(!profile) return null;
  
   return {
    ...profile,
    birthday: profile.birthday ? profile.birthday.toISOString().split('T')[0] : null,
  }
};
