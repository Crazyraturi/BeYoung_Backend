import express from "express";
import { register } from "../database/controllers/userController.js";

const router = express.Router();

router.post("/register", register);

export default router;
