import { Router } from 'express';
import * as profileController from '../controllers/profile.controller';
import * as projectController from '../controllers/project.controller';
import * as resumeController from '../controllers/resume.controller';
import { authenticateJWT } from '../middlewares/authMiddleware';
import { validate } from '../middlewares/validateMiddleware'; // 👈 검사기
import { updateProfileSchema, changePasswordSchema } from '../dtos/profile.dto';
import { upload } from '../lib/multer';
import { projectSchema } from 'dtos/project.dto';
import { resumeSchema } from 'dtos/resume.dto';

const router = Router();

//---------------------------프로필---------------------------------
router.use(authenticateJWT);

// 프로필 조회
router.get('/profile', profileController.getProfile);
// 프로필 수정
router.put(
  '/profile', 
  validate(updateProfileSchema),
  profileController.updateProfile);
// 비밀번호 수정
router.put(
  '/password', 
  validate(changePasswordSchema),
  profileController.updatePassword);
// 프로필 사진 업데이트
router.put('/profile/avatar', upload.single('avatar'), profileController.updateAvatar);


//-----------------------프로젝트----------------------------------
router.get('/projects', projectController.listProjects);

router.post('/projects', upload.single('thumbnail'), validate(projectSchema), projectController.addProject);

router.patch('/projects/:id/status', projectController.toggleStatus);

router.delete('/projects/:id', projectController.removeProject);

//--------------------------이력관리---------------------------------
router.get('/resumes', resumeController.listResumes);

router.post('/resumes', validate(resumeSchema), resumeController.addResume);

router.delete('/resumes/:id', resumeController.removeResume);

router.patch('/resumes/:id/order', resumeController.updateOrder);

export default router;