import express from "express";
import {getStudentAssignments,submitAssignment} from "../controllers/assignmentController.js";
import protect from "../middleware/authMiddleware.js";

const router=express.Router();

//get tasks assigned to logged in user
router.get("/",protect,getStudentAssignments);

//submit a task
router.post("/",protect,submitAssignment);

export default router;

