import mongoose from "mongoose";
import dotenv from "dotenv";
import Task from "./models/Task.js";
import connectDB from "./config/db.js";

dotenv.config();
connectDB();

const tasks = [
  // ================= WEB DEV =================
  {
    title: "Build a basic HTML portfolio",
    description: "Create a simple personal portfolio using HTML and CSS.",
    domain: "Web",
    levelRequired: "Intern Level 1",
    xpReward: 50,
  },
  {
    title: "Responsive landing page",
    description: "Design a responsive landing page using Flexbox and media queries.",
    domain: "Web",
    levelRequired: "Intern Level 1",
    xpReward: 60,
  },
  {
    title: "JavaScript Todo App",
    description: "Build a todo app with add, delete, and mark-complete features.",
    domain: "Web",
    levelRequired: "Intern Level 2",
    xpReward: 80,
  },
  {
    title: "Weather App using API",
    description: "Fetch weather data from a public API and display it.",
    domain: "Web",
    levelRequired: "Intern Level 2",
    xpReward: 100,
  },
  {
    title: "React Notes App",
    description: "Create a notes app using React and local storage.",
    domain: "Web",
    levelRequired: "Intern Level 2",
    xpReward: 120,
  },
  {
    title: "Authentication System",
    description: "Implement login and signup using JWT.",
    domain: "Web",
    levelRequired: "Intern Level 3",
    xpReward: 150,
  },
  {
    title: "CRUD App with MongoDB",
    description: "Build a CRUD application using MongoDB and Express.",
    domain: "Web",
    levelRequired: "Intern Level 3",
    xpReward: 170,
  },
  {
    title: "Role-based Dashboard",
    description: "Create a dashboard with admin and user roles.",
    domain: "Web",
    levelRequired: "Intern Level 3",
    xpReward: 180,
  },
  {
    title: "Deploy MERN App",
    description: "Deploy your MERN stack app on Render or Vercel.",
    domain: "Web",
    levelRequired: "Advanced Intern",
    xpReward: 200,
  },
  {
    title: "Full Stack Project",
    description: "Build a full-stack project with authentication and database.",
    domain: "Web",
    levelRequired: "Advanced Intern",
    xpReward: 250,
  },

  // ================= AI =================
  {
    title: "Python Basics",
    description: "Write basic Python programs using loops and functions.",
    domain: "AI",
    levelRequired: "Intern Level 1",
    xpReward: 50,
  },
  {
    title: "Numpy & Pandas",
    description: "Perform data operations using NumPy and Pandas.",
    domain: "AI",
    levelRequired: "Intern Level 1",
    xpReward: 70,
  },
  {
    title: "Data Visualization",
    description: "Visualize datasets using Matplotlib and Seaborn.",
    domain: "AI",
    levelRequired: "Intern Level 2",
    xpReward: 90,
  },
  {
    title: "Linear Regression Model",
    description: "Train a linear regression model using sklearn.",
    domain: "AI",
    levelRequired: "Intern Level 2",
    xpReward: 120,
  },
  {
    title: "Classification Model",
    description: "Build a classification model using logistic regression.",
    domain: "AI",
    levelRequired: "Intern Level 2",
    xpReward: 140,
  },
  {
    title: "Decision Tree Model",
    description: "Train a decision tree classifier.",
    domain: "AI",
    levelRequired: "Intern Level 3",
    xpReward: 160,
  },
  {
    title: "Neural Network",
    description: "Create a simple neural network using TensorFlow or PyTorch.",
    domain: "AI",
    levelRequired: "Intern Level 3",
    xpReward: 180,
  },
  {
    title: "Image Classifier",
    description: "Build an image classifier using CNN.",
    domain: "AI",
    levelRequired: "Intern Level 3",
    xpReward: 200,
  },
  {
    title: "AI Chatbot",
    description: "Build a chatbot using NLP.",
    domain: "AI",
    levelRequired: "Advanced Intern",
    xpReward: 220,
  },
  {
    title: "Final AI Project",
    description: "Build a complete AI project using real-world data.",
    domain: "AI",
    levelRequired: "Advanced Intern",
    xpReward: 300,
  },

  // ================= DATA SCIENCE =================
  {
    title: "CSV Data Analysis",
    description: "Analyze a CSV dataset using Pandas.",
    domain: "Data",
    levelRequired: "Intern Level 1",
    xpReward: 50,
  },
  {
    title: "Data Cleaning",
    description: "Clean missing and null values in a dataset.",
    domain: "Data",
    levelRequired: "Intern Level 1",
    xpReward: 70,
  },
  {
    title: "Exploratory Data Analysis",
    description: "Perform EDA on a dataset.",
    domain: "Data",
    levelRequired: "Intern Level 2",
    xpReward: 100,
  },
  {
    title: "Visualization Dashboard",
    description: "Build charts using Power BI or matplotlib.",
    domain: "Data",
    levelRequired: "Intern Level 2",
    xpReward: 120,
  },
  {
    title: "SQL Queries",
    description: "Write complex SQL queries for analysis.",
    domain: "Data",
    levelRequired: "Intern Level 2",
    xpReward: 140,
  },
  {
    title: "Correlation Study",
    description: "Analyze correlations between variables.",
    domain: "Data",
    levelRequired: "Intern Level 3",
    xpReward: 160,
  },
  {
    title: "Prediction Model",
    description: "Build a prediction model using regression.",
    domain: "Data",
    levelRequired: "Intern Level 3",
    xpReward: 180,
  },
  {
    title: "Time Series Analysis",
    description: "Analyze time series data.",
    domain: "Data",
    levelRequired: "Intern Level 3",
    xpReward: 200,
  },
  {
    title: "Big Dataset Handling",
    description: "Handle large datasets efficiently.",
    domain: "Data",
    levelRequired: "Advanced Intern",
    xpReward: 220,
  },
  {
    title: "Final Data Project",
    description: "Build a complete data science project.",
    domain: "Data",
    levelRequired: "Advanced Intern",
    xpReward: 300,
  },
];

const seedTasks = async () => {
  try {
    await Task.deleteMany();
    await Task.insertMany(tasks);
    console.log("✅ Tasks seeded successfully!");
    process.exit();
  } catch (error) {
    console.error("❌ Error seeding tasks:", error);
    process.exit(1);
  }
};

seedTasks();