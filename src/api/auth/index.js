import express from 'express';
import * as authController from './authController.js';
import { auth } from '../../middlewares/auth.js';
import { validateRegister, validateLogin } from '../../middlewares/validation.js';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// Rate limiting para login/register
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 intentos
  message: 'Too many login attempts, please try again later'
});

router.post('/register', authLimiter, validateRegister, authController.register);
router.post('/login', authLimiter, validateLogin, authController.login);
router.post('/logout', auth, authController.logout);
router.post('/refresh-token', authController.refreshAccessToken);
router.get('/profile', auth, authController.getProfile);

export default router;
