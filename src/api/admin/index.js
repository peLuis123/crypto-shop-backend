import express from 'express';
import { auth, adminOnly } from '../../middlewares/auth.js';
import { getAdminStats } from './getStats.js';
import { getSales } from './getSales.js';
import { getUsers } from './getUsers.js';
import { refundOrder } from './refundOrder.js';
import { getCustomers } from './getCustomers.js';
import { blockCustomer } from './blockCustomer.js';
import { exportCustomers } from './exportCustomers.js';
import { getAdminProducts } from './getAdminProducts.js';
import { createProduct } from '../products/createProduct.js';
import { updateProduct } from '../products/updateProduct.js';
import { deleteProduct } from '../products/deleteProduct.js';
import { updateOrderStatus } from '../orders/updateOrderStatus.js';

const router = express.Router();

router.get('/stats', auth, adminOnly, getAdminStats);
router.get('/sales', auth, adminOnly, getSales);
router.get('/users', auth, adminOnly, getUsers);
router.post('/orders/:id/refund', auth, adminOnly, refundOrder);
router.patch('/orders/:id/status', auth, adminOnly, updateOrderStatus);
router.get('/customers', auth, adminOnly, getCustomers);
router.patch('/customers/:id/block', auth, adminOnly, blockCustomer);
router.post('/customers/export', auth, adminOnly, exportCustomers);
router.get('/products', auth, adminOnly, getAdminProducts);
router.post('/products', auth, adminOnly, createProduct);
router.patch('/products/:id', auth, adminOnly, updateProduct);
router.delete('/products/:id', auth, adminOnly, deleteProduct);

export default router;
