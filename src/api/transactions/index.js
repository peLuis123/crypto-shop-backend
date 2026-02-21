import express from 'express';
import { getTransactions, getTransactionById } from './getTransactions.js';
import { auth } from '../../middlewares/auth.js';

const router = express.Router();

router.get('/', auth, getTransactions);
router.get('/:id', auth, getTransactionById);

export default router;
