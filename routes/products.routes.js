import express from "express";
import { addProduct, deleteProduct, getProductById, getProducts, updateProduct } from "../controllers/product.controller.js";

const router = express.Router();

router.get('/', getProducts);

router.get('/:id', getProductById);

router.post('/', addProduct);

router.patch('/:id', updateProduct);

router.delete('/:id', deleteProduct);

export { router as productsRouter };