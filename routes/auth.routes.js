import express from "express";
import { login } from "../controllers/employee.controller.js";

const router = express.Router();

router.post('/', login);

export { router as authRouter };