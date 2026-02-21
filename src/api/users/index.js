import express from 'express';
import { getProfile } from './getProfile.js';
import { updateProfile } from './updateProfile.js';
import { updatePassword } from './updatePassword.js';
import { connectWallet } from './connectWallet.js';
import { auth } from '../../middlewares/auth.js';

const router = express.Router();

router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);
router.put('/password', auth, updatePassword);
router.post('/wallet/connect', auth, connectWallet);

export default router;
