import { Router } from 'express';
import * as projectController from '../controllers/project.controller';
import { projectSchema } from '../dtos/project.dto';
import { validate } from '../middlewares/validateMiddleware'; // Zod 검증 미들웨어
import { upload } from '../lib/multer'; // 공통 멀터 설정
import { authenticateJWT } from '../middlewares/authMiddleware';
const router = Router();
// 모든 어드민 라우트는 JWT 인증이 필요함
router.use(authenticateJWT);

// --- 프로젝트 관리 API ---
// 조회
router.get('/projects', projectController.listProjects);

// 생성
router.post(
  '/projects',
  upload.single('thumbnail'),
  validate(projectSchema),
  projectController.addProject
);

// 삭제
router.delete('/projects/:id', projectController.removeProject);

// 상태 토글
router.patch('/projects/:id/status', projectController.toggleStatus);

export default router;