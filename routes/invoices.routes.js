import express from "express";
import { returnInvoice } from "../controllers/invoice.controller.js";

const router = express.Router();

router.get('/:dealId', returnInvoice)

export { router as invoicesRouter };