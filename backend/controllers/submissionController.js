import Submission from "../models/Submission.js";
import Task from "../models/Task.js";
import User from "../models/User.js";
import fetch from "node-fetch";
import dotenv from "dotenv";
import Groq from "groq-sdk";

dotenv.config();

// ==============================
// 🔑 GROQ CONFIG
// ==============================

// Create Groq instance using API key
const groq = new Groq({
apiKey: process.env.GROQ_API_KEY?.trim(),
});

// Check if API key exists
if (!process.env.GROQ_API_KEY) {
console.error("❌ GROQ API KEY MISSING");
}

// ==============================
// 📦 FETCH GITHUB README
// ==============================

const getReadme = async (githubLink) => {
try {
// Extract owner & repo from GitHub URL
const urlParts = githubLink.replace(/\$/, "").split("/");
const owner = urlParts[urlParts.length - 2];
const repo = urlParts[urlParts.length - 1];

if (!owner || !repo) return "Invalid GitHub link.";

// Call GitHub API
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
console.error("GitHub README Error:", err.message);
return "Error fetching README.";
}
};

// ==============================
// 📁 FETCH REPO STRUCTURE
// ==============================

const getRepoStructure = async (githubLink) => {
try {
const urlParts = githubLink.replace(/\$/, "").split("/");
const owner = urlParts[urlParts.length - 2];
const repo = urlParts[urlParts.length - 1];

const response = await fetch(
  `https://api.github.com/repos/${owner}/${repo}/contents`,
  {
    headers: { "User-Agent": "AI-Internship-Simulator" },
  }
);

if (!response.ok) return "No structure found.";

const data = await response.json();

// Get first 20 files/folders
const files = data.map((item) => item.name).slice(0, 20);

return files.join(", ");

} catch {
return "Error fetching structure.";
}
};

// ==============================
// 💻 FETCH LANGUAGES USED
// ==============================

const getRepoLanguages = async (githubLink) => {
try {
const urlParts = githubLink.replace(/\$/, "").split("/");
const owner = urlParts[urlParts.length - 2];
const repo = urlParts[urlParts.length - 1];

const response = await fetch(
  `https://api.github.com/repos/${owner}/${repo}/languages`,
  {
    headers: { "User-Agent": "AI-Internship-Simulator" },
  }
);

if (!response.ok) return "Languages not found.";

const data = await response.json();

// Extract language names
return Object.keys(data).join(", ");

} catch {
return "Error fetching languages.";
}
};

// ==============================
// 🧠 SAFE JSON PARSER
// ==============================

const safeParseJSON = (text) => {
try {
// Extract only JSON part from AI response
const match = text.match(/{[\s\S]*}/);
return match ? JSON.parse(match[0]) : null;
} catch {
return null;
}
};

// ==============================
// 🤖 FALLBACK (if AI fails)
// ==============================

const fallbackEvaluation = (githubLink, textAnswer) => {
return {
score: githubLink && textAnswer ? 7 : githubLink ? 6 : textAnswer ? 5 : 3,
feedback:
"AI failed. Basic evaluation based on submission completeness.",
evaluation: {
code_quality: githubLink ? 6 : 4,
clarity: textAnswer ? 6 : 4,
completeness: githubLink && textAnswer ? 7 : 5,
problem_solving: 5,
},
};
};

// ==============================
// 🚀 CREATE SUBMISSION
// ==============================

export const createSubmission = async (req, res) => {
try {
const { taskId, githubLink, textAnswer } = req.body;

// ==============================
// ✅ VALIDATION
// ==============================

if (!taskId) {
  return res.status(400).json({ message: "Task ID is required" });
}

if (!githubLink && !textAnswer) {
  return res.status(400).json({
    message: "Provide GitHub link or text answer",
  });
}

// ==============================
// ✅ GET TASK FROM DB
// ==============================

const task = await Task.findById(taskId);
if (!task) {
  return res.status(404).json({ message: "Task not found" });
}

// ==============================
// 📦 FETCH GITHUB DATA
// ==============================

let repoContent = "No README.";
let repoStructure = "No structure.";
let repoLanguages = "Unknown";

if (githubLink && githubLink.includes("github.com")) {
  repoContent = await getReadme(githubLink);
  repoStructure = await getRepoStructure(githubLink);
  repoLanguages = await getRepoLanguages(githubLink);
}

// ==============================
// 🧠 AI EVALUATION
// ==============================

let score = 5;
let aiFeedback = "Evaluation pending";
let evaluation = null;

const prompt = `

You are a Senior Technical Lead grading an intern's submission.

TASK: ${task.title}
DESCRIPTION: ${task.description}

INTERN ANSWER:
${textAnswer || "N/A"}

GITHUB README:
${repoContent.substring(0, 1500)}

REPOSITORY STRUCTURE:
${repoStructure}

TECH STACK:
${repoLanguages}

Evaluate based on:

Code quality
Project structure
Clarity
Completeness
Problem solving

Return ONLY valid JSON:
{
"code_quality": number (0-10),
"clarity": number (0-10),
"completeness": number (0-10),
"problem_solving": number (0-10),
"final_score": number (0-10),
"feedback": "short constructive feedback"
}
`;

try {
  const aiResponse = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    temperature: 0.3,
    max_tokens: 400,
    messages: [
      {
        role: "system",
        content:
          "You are a strict technical evaluator. Respond ONLY with JSON.",
      },
      { role: "user", content: prompt },
    ],
  });

  const responseText =
    aiResponse.choices?.[0]?.message?.content || "";

  const parsed = safeParseJSON(responseText);

  if (parsed) {
    score = parsed.final_score ?? score;
    aiFeedback = parsed.feedback ?? aiFeedback;

    evaluation = {
      code_quality: parsed.code_quality,
      clarity: parsed.clarity,
      completeness: parsed.completeness,
      problem_solving: parsed.problem_solving,
    };
  } else {
    throw new Error("Invalid JSON");
  }
} catch (err) {
  console.error("❌ GROQ ERROR:", err.message);

  const fallback = fallbackEvaluation(githubLink, textAnswer);
  score = fallback.score;
  aiFeedback = fallback.feedback;
  evaluation = fallback.evaluation;
}

// ==============================
// 🎯 CALCULATE XP
// ==============================

const earnedXP = Math.floor((score / 10) * (task.xpReward || 100));

// ==============================
// 💾 SAVE TO DATABASE
// ==============================

const submission = await Submission.create({
  user: req.user._id,
  task: taskId,
  githubLink,
  textAnswer,
  aiFeedback,
  score,
  evaluation,
  xpEarned: earnedXP,
});

// ==============================
// 👤 UPDATE USER XP & LEVEL
// ==============================

const user = await User.findById(req.user._id);

if (user) {
  user.xp = (user.xp || 0) + earnedXP;

  if (user.xp >= 1000) user.level = "Senior Intern";
  else if (user.xp >= 500) user.level = "Junior Intern";
  else user.level = "Probationary Intern";

  await user.save();
}

// ==============================
// ✅ RESPONSE
// ==============================

res.status(201).json({
  message: "Submission successful",
  score,
  evaluation,
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