import express from "express";
import { registerUser,loginUser,getMe } from "../controllers/authController.js";
import protect from "../middleware/authMiddleware.js";

const router=express.Router();

//register route
router.post("/register",registerUser);

//login route
router.post("/login",loginUser);

//get logged in user
router.get("/me",protect,getMe);

export default router;