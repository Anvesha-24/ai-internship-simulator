// 1. THIS MUST BE THE VERY FIRST LINE
import "dotenv/config"; 

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";

// 2. Now it is safe to import routes
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import submissionRoutes from "./routes/submissionRoutes.js";
import assignmentRoutes from "./routes/assignmentRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import certificateRoutes from "./routes/certificateRoutes.js";

// Database Connection
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

// Debug log to confirm key is actually available to the app
console.log("--- Environment Check ---");
console.log("Key Loaded:", process.env.GEMINI_API_KEY ? "YES" : "NO");
if (process.env.GEMINI_API_KEY) {
    console.log("Key Length:", process.env.GEMINI_API_KEY.trim().length);
}
console.log("-------------------------");

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/certificate", certificateRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});