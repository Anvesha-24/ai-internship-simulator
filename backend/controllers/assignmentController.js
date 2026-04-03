import Assignment from "../models/Assignment.js";
import Task from "../models/Task.js";
import User from "../models/User.js";

//get assignments for logged in users
export const getStudentAssignments=async(req,res)=>{
    try{
const assignments=await Assignment.find({user:req.user.id})
.populate("task");
res.json(assignments);
    }
    catch(err){
res.status(500).json({message:err.message});
    }
};

//submit a task
export const submitAssignment = async (req, res) => {
  try {
    const { assignmentId, submissionLink, textAnswer } = req.body;

    if (!submissionLink && !textAnswer) {
      return res
        .status(400)
        .json({ message: "Provide GitHub link or text answer" });
    }

    const assignment = await Assignment.findById(assignmentId).populate("task");

    if (!assignment)
      return res.status(404).json({ message: "Assignment not found" });

    if (assignment.status !== "Pending")
      return res.status(400).json({ message: "Assignment already submitted" });

    assignment.submissionLink = submissionLink || "";
    assignment.textAnswer = textAnswer || "";
    assignment.status = "Submitted";
    assignment.xpEarned = assignment.task.xpReward;

    await assignment.save();

    // update user XP
    const user = await User.findById(req.user.id);
    user.xp += assignment.task.xpReward;

    // level logic
    if (user.xp >= 500) user.level = "Intern level 3";
    else if (user.xp >= 200) user.level = "Intern level 2";

    await user.save();

    res.json({
      message: "Task submitted successfully",
      assignment,
      user,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};