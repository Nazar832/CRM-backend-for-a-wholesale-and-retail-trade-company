import express from "express";
import { addDeal, getDealById, getDeals, updateDeal } from "../controllers/deal.controller.js";

const router = express.Router();

router.get('/', getDeals);

router.get('/:id', getDealById);

router.post('/', addDeal);

router.patch('/:id', updateDeal);

export { router as dealsRouter };