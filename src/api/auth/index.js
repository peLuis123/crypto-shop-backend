import express from 'express';
import { register } from './register.js';
import { login } from './login.js';
import { logout } from './logout.js';
import { refreshToken } from './refreshToken.js';
import { getProfile } from './getProfile.js';
import { auth } from '../../middlewares/auth.js';
import { validateRegister, validateLogin } from '../../middlewares/validation.js';
import rateLimit from 'express-rate-limit';

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many login attempts, please try again later'
});

router.post('/register', authLimiter, validateRegister, register);
router.post('/login', authLimiter, validateLogin, login);
router.post('/logout', auth, logout);
router.post('/refresh-token', refreshToken);
router.get('/profile', auth, getProfile);

export default router;
