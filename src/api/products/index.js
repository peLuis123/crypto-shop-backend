import express from 'express';
import * as productController from './productController.js';
import { auth, adminOnly } from '../../middlewares/auth.js';

const router = express.Router();

// Públicas (todos pueden ver)
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

// Solo ADMIN puede crear, actualizar, eliminar
router.post('/', auth, adminOnly, productController.createProduct);
router.put('/:id', auth, adminOnly, productController.updateProduct);
router.delete('/:id', auth, adminOnly, productController.deleteProduct);

export default router;
