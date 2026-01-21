import { Router } from 'express';
import * as profileController from '../controllers/profile.controller';
import * as projectController from '../controllers/project.controller';
import * as resumeController from '../controllers/resume.controller';

const router = Router();
// 유저용 프로필 조회
router.get('/profile', profileController.getPublicProfile);

// 유저용 프로젝트 조회
router.get('/projects', projectController.getPublicProjects);

// 유저용 이력 조회
router.get('/resumes', resumeController.getPublicResumes);

export default router;  