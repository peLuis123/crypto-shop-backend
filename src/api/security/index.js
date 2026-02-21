import express from 'express';
import { enable2FA } from './enable2FA.js';
import { verify2FA } from './verify2FA.js';
import { auth } from '../../middlewares/auth.js';

const router = express.Router();

router.post('/2fa/enable', auth, enable2FA);
router.post('/2fa/verify', auth, verify2FA);

export default router;
