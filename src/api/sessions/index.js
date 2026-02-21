import express from 'express';
import { getSessions } from './getSessions.js';
import { deleteSession } from './deleteSession.js';
import { auth } from '../../middlewares/auth.js';

const router = express.Router();

router.get('/', auth, getSessions);
router.delete('/:id', auth, deleteSession);

export default router;
