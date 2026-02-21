import express from 'express';
import { createOrder } from './createOrder.js';
import { getOrders, getOrderById } from './getOrders.js';
import { payOrder } from './payOrder.js';
import { updateOrderStatus } from './updateOrderStatus.js';
import { auth, adminOnly } from '../../middlewares/auth.js';

const router = express.Router();

router.post('/', auth, createOrder);
router.get('/', auth, getOrders);
router.get('/:id', auth, getOrderById);
router.post('/:id/pay', auth, payOrder);

router.patch('/:id/status', auth, adminOnly, updateOrderStatus);

export default router;
