import Submission from "../models/Submission.js";
import Task from "../models/Task.js";
import User from "../models/User.js";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

// ==============================
// 🔑 GEMINI CONFIG (REST API)
// ==============================
const API_KEY = process.env.GEMINI_API_KEY?.trim();

if (!API_KEY) {
  console.error("❌ GEMINI API KEY MISSING");
}

const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;
// 📦 FETCH GITHUB README
// ==============================
const getReadme = async (githubLink) => {
  try {
    const urlParts = githubLink.replace(/\/$/, "").split("/");
    const owner = urlParts[urlParts.length - 2];
    const repo = urlParts[urlParts.length - 1];

    if (!owner || !repo) return "Invalid GitHub link.";

    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/readme`,
      {
        headers: {
          Accept: "application/vnd.github.v3.raw",
          "User-Agent": "AI-Internship-Simulator",
        },
      }
    );

    if (!response.ok) return "README not found or repo is private.";

    return await response.text();
  } catch (err) {
    console.error("GitHub Fetch Error:", err.message);
    return "Error fetching repository.";
  }
};

// ==============================
// 🚀 CREATE SUBMISSION
// ==============================
export const createSubmission = async (req, res) => {
  try {
    const { taskId, githubLink, textAnswer } = req.body;

    // ✅ VALIDATION
    if (!taskId) {
      return res.status(400).json({ message: "Task ID is required" });
    }

    if (!githubLink && !textAnswer) {
      return res.status(400).json({
        message: "Provide GitHub link or text answer",
      });
    }

    // ✅ GET TASK
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // ✅ FETCH GITHUB DATA
    let repoContent = "No GitHub provided.";
    if (githubLink && githubLink.includes("github.com")) {
      repoContent = await getReadme(githubLink);
    }

    // ==============================
    // 🧠 GEMINI AI EVALUATION (REST)
    // ==============================
    let score = 5;
    let aiFeedback = "Default feedback";

    const prompt = `
You are a Senior Technical Lead grading an intern's submission.

TASK: ${task.title}
DESCRIPTION: ${task.description}

INTERN ANSWER:
${textAnswer || "N/A"}

GITHUB README CONTENT:
${repoContent.substring(0, 2000)}

Return ONLY valid JSON:
{
  "score": number (0-10),
  "feedback": "short constructive feedback"
}
`;

    try {
      const aiResponse = await fetch(GEMINI_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      });

      const data = await aiResponse.json();

      if (!aiResponse.ok) {
        console.error("GEMINI API ERROR:", data);
        throw new Error("Gemini API failed");
      }

      const responseText =
        data.candidates?.[0]?.content?.parts?.[0]?.text || "";

      // ✅ SAFE JSON PARSE
      let parsed = null;
      const match = responseText.match(/\{[\s\S]*\}/);

      if (match) {
        parsed = JSON.parse(match[0]);
      }

      if (parsed) {
        score = parsed.score ?? score;
        aiFeedback = parsed.feedback ?? aiFeedback;
      }
    } catch (aiErr) {
      console.error("----- GEMINI ERROR FULL -----");
      console.error(aiErr.message);
      console.error("-----------------------------");

      score = githubLink ? 6 : 4;
      aiFeedback = "AI evaluation failed. Needs manual review.";
    }

    // ==============================
    // 🎯 CALCULATE XP
    // ==============================
    const earnedXP = Math.floor((score / 10) * (task.xpReward || 100));

    // ✅ SAVE SUBMISSION
    const submission = await Submission.create({
      user: req.user._id,
      task: taskId,
      githubLink,
      textAnswer,
      aiFeedback,
      score,
      xpEarned: earnedXP,
    });

    // ==============================
    // 👤 UPDATE USER
    // ==============================
    const user = await User.findById(req.user._id);

    if (user) {
      user.xp = (user.xp || 0) + earnedXP;

      if (user.xp >= 1000) user.level = "Senior Intern";
      else if (user.xp >= 500) user.level = "Junior Intern";
      else user.level = "Probationary Intern";

      await user.save();
    }

    // ✅ RESPONSE
    res.status(201).json({
      message: "Submission successful",
      score,
      xpEarned: earnedXP,
      feedback: aiFeedback,
      userXP: user?.xp,
      level: user?.level,
    });
  } catch (err) {
    console.error("SERVER ERROR:", err);
    res.status(500).json({
      message: "Submission failed",
      error: err.message,
    });
  }
};

// ==============================
// 📄 GET USER SUBMISSIONS
// ==============================
export const getMySubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({
      user: req.user._id,
    })
      .populate("task")
      .sort({ createdAt: -1 });

    res.status(200).json(submissions);
  } catch (err) {
    console.error("FETCH ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};