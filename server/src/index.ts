/// <reference types="node" />
import express, { Request, Response } from 'express';
import cors from 'cors';
import projectRoutes from './routes/projectRoutes';
import authRoutes from './routes/auth.routes';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cookieParser());
app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response)=> {
  res.send('포트폴리오 서버가 정상적으로 돌아가고 있어, 선배!');
})
// 프로젝트 라우터
app.use('/api/projects', projectRoutes);
// 로그인 라우터
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`
  ################################################
  🛡️  Server listening on port: ${PORT} 🛡️
  🌱  Environment: ${process.env.NODE_ENV || 'development'}
  ################################################
  `);
});