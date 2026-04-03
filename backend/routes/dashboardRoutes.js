import express from "express";
import { getDashbaord } from "../controllers/dashboardController.js";
import protect from "../middleware/authMiddleware.js";

const router=express.Router();

router.get("/",protect,getDashbaord);

export default router;