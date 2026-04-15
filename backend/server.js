// Must be the very first line to ensure process.env is populated
import "dotenv/config"; 

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";

// Import Routes
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import submissionRoutes from "./routes/submissionRoutes.js";
import assignmentRoutes from "./routes/assignmentRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import certificateRoutes from "./routes/certificateRoutes.js";

// Initialize Database
connectDB();

const app = express();

// Middleware
app.use(express.json());

// Optimized CORS for Production
app.use(cors({
  origin: [
    "http://localhost:5173", 
    "https://ai-internship-simulator.vercel.app" // Add your actual Vercel domain here
  ],
  credentials: true
}));

// Environment Variable Debug (Confirming keys are ready for Gemini/MongoDB)
console.log("--- Production Check ---");
console.log("Gemini API Key Loaded:", process.env.GEMINI_API_KEY ? "YES" : "NO");
console.log("Mongo URI Available:", process.env.MONGO_URI ? "YES" : "NO");
console.log("------------------------");

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/certificate", certificateRoutes);

// Health check for Render
app.get("/", (req, res) => res.send("AI Internship Simulator API is running..."));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});