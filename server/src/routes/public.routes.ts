import { Router } from 'express';
import * as publicController from '../controllers/public.controller';

const router = Router();
// 유저용 프로필 조회
router.get('/profile', publicController.getProfile);

export default router;