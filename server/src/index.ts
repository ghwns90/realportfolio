/// <reference types="node" />
import express, { Request, Response } from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import adminRoutes from './routes/admin.routes';
import publicRoutes from './routes/public.routes';
import path from 'path';
import { authenticateJWT } from 'middlewares/authMiddleware';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  // 쿠키사용 시 필수
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/', (req: Request, res: Response)=> {
  res.send('포트폴리오 서버가 정상적으로 돌아가고 있어, 선배!');
})


//-----------------일반 라우터----------------
app.use('/api', publicRoutes);
// 로그인 라우터
app.use('/api/auth', authRoutes);


//------------------ admin -------------------
app.use('/api/admin', authenticateJWT, adminRoutes);



app.listen(PORT, () => {
  console.log(`
  ################################################
  🛡️  Server listening on port: ${PORT} 🛡️
  🌱  Environment: ${process.env.NODE_ENV || 'development'}
  ################################################
  `);
});