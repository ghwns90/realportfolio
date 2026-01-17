import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'sssssssssssecret';
const JWT_REFRESH = process.env.jwt_REFRESH || 'rrrrrrrrrrrrefresh';

export const login = async (req: Request, res: Response): Promise<void> => {
  try {

    const {username, password} = req.body;

    const admin = await prisma.admin.findUnique({
      where: {username},
    });

    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      res.status(401).json({ message: '아이디 또는 비밀번호가 틀렸습니다.' });
      return;
    }

    const accessToken = jwt.sign({ id: admin.id, username: admin.username }, JWT_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ id: admin.id }, JWT_REFRESH, { expiresIn: '7d' });

    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

    await prisma.refreshToken.deleteMany({
      where: { adminId : admin.id }
    });

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        adminId: admin.id,
        expiresAt: sevenDaysFromNow,
      },
    });

    // Refresh Token은 안전한 HttpOnly 쿠키에 저장
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: '로그인 성공', accessToken });

  } catch (error) {
    res.status(500).json({ message: '서버 에러' });
  }
};

export const refresh = async (req: Request, res: Response) => {

  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) return res.status(401).json({ message: "리프레시 토큰 없음" });
    
  try {
    // 1. DB에 해당 토큰이 있는지 확인
    const savedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { admin: true }
    });

    if(!savedToken || savedToken.expiresAt < new Date()) {
      return res.status(401).json({ message: "만료되었거나 유효하지 않은 토큰" });
    }

    const newAccessToken = jwt.sign(
      { id: savedToken.admin.id, username: savedToken.admin.username },
      JWT_SECRET!,
      { expiresIn: '1h' },
    );

    res.json({ accessToken: newAccessToken });

  } catch (error) {
    res.status(401).json({ message: '토큰 갱신 실패' });
  }
};
// 로그아웃 
export const logout = async (req: Request, res: Response) => {
  
  const token = req.cookies.refreshToken;

  if(token){
    
    try {
      await prisma.refreshToken.delete({
        where: { token }
      });
    } catch (error) {
      console.log('이미 삭제된 토큰입니다');
    }
  }

  res.clearCookie('refreshToken');
  res.status(200).json({message: '로그아웃 되었습니다'});
};
// 토큰 검증
export const verify = (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Valid Token',
    user: req.user
  });
};