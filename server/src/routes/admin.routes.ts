import { Router } from 'express';
import * as profileController from '../controllers/profile.controller';
import { authenticateJWT } from '../middlewares/authMiddleware';
import { validate } from '../middlewares/validateMiddleware'; // 👈 검사기
import { updateProfileSchema, changePasswordSchema } from '../dtos/profile.dto';
import { upload } from '../lib/multer';

const router = Router();

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

export default router;