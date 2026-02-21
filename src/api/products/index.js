import express from 'express';
import { getAllProducts, getProductById } from './getProducts.js';
import { createProduct } from './createProduct.js';
import { updateProduct } from './updateProduct.js';
import { deleteProduct } from './deleteProduct.js';
import { auth, adminOnly } from '../../middlewares/auth.js';

const router = express.Router();

router.get('/', getAllProducts);
router.get('/:id', getProductById);

router.post('/', auth, adminOnly, createProduct);
router.put('/:id', auth, adminOnly, updateProduct);
router.delete('/:id', auth, adminOnly, deleteProduct);

export default router;
