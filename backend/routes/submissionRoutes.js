import express from "express";
import { createSubmission,getMySubmissions} from "../controllers/submissionController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createSubmission);

router.get("/my",protect,getMySubmissions);

export default router;