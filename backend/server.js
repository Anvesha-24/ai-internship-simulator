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

// Initialize Express
const app = express();

// 1. UNIVERSAL CORS (Must be at the top)
// Using origin: true ensures it matches whatever Vercel URL is calling it
app.use(cors({
  origin: true, 
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// 2. JSON PARSER
app.use(express.json());

// 3. INITIALIZE DATABASE
connectDB();

// 4. ENVIRONMENT DEBUG LOGS
console.log("--- Production Check ---");
console.log("Gemini API Key Loaded:", process.env.GEMINI_API_KEY ? "YES" : "NO");
console.log("Mongo URI Available:", process.env.MONGO_URI ? "YES" : "NO");
console.log("------------------------");

// 5. API ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/certificate", certificateRoutes);

// 6. HEALTH CHECK / ROOT ROUTE
app.get("/", (req, res) => {
  res.send("AI Internship Simulator API is running...");
});

// 7. SERVER STARTUP
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});