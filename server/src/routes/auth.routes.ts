import { Router } from 'express';
import { login, logout, refresh, verify } from '../controllers/auth.controller';
import { authenticateJWT } from '../middlewares/authMiddleware';

const router = Router();

router.post('/login', login);
router.post('/refresh', refresh); 
router.post('/logout', logout);   

router.get('/verify', authenticateJWT, verify);

export default router;