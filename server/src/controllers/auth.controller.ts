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

    const accessToken = jwt.sign({ id: admin.id, username: admin.username }, JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ id: admin.id }, JWT_REFRESH, { expiresIn: '7d' });

    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

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

export const refresh = async (req: Request, res: Response): Promise<void> => {

  const token = req.cookies.refreshToken;

  if(!token) {
    res.status(401).json({ message: '다시 로그인 해 해주세요' });
    return;
  }

  try {
    // 1차 검증 위조된 토큰인지 라이브러리로 확인
    const decoded = jwt.verify(token, JWT_REFRESH) as unknown as {id: number};
    // 2차 검증: DB에 살아있는 토큰인지 확인
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token },
    });

    if(!storedToken || storedToken.expiresAt < new Date()){
      res.clearCookie('refreshToken');
      res.status(403).json({message: '유효하지 않거나 만료된 토큰입니다.'});
      return;
    }

    const newAccessToken = jwt.sign(
      {id: decoded.id},
      JWT_SECRET,
      {expiresIn: '15m'}
    );

    res.status(200).json({ accessToken: newAccessToken });

  } catch (error) {
    res.status(403).json({ message: '리프레시 토큰이 만료되었습니다.' });
  }
};

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

