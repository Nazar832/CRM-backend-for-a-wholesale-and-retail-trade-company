import express from "express";
import { addBuyer, deleteBuyer, getBuyerById, getBuyers, updateBuyer } from "../controllers/buyer.controller.js";

const router = express.Router();

router.get('/', getBuyers);

router.get('/:id', getBuyerById);

router.post('/', addBuyer);

router.patch('/:id', updateBuyer);

router.delete('/:id', deleteBuyer);


export { router as buyersRouter };