import express from "express";
import { getTasks,getTaskById,createTask } from "../controllers/taskController.js";
import protect from "../middleware/authMiddleware.js";

const router=express.Router();

router.get("/",protect,getTasks);
router.get("/:id",protect,getTaskById);
router.post("/",protect,createTask);

export default router;
