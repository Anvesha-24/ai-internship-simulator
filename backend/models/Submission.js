import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },
    githubLink: {
      type: String,
      default: "",
    },
    textAnswer: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"], // Added enum for better data integrity
      default: "pending",
    },
    score: {
      type: Number, // Added this to store the 0-10 grade from Gemini
      default: 0,
    },
    xpEarned: {
      type: Number,
      default: 0,
    },
    aiFeedback: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Submission", submissionSchema);