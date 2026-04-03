import Submission from "../models/Submission.js";
import Task from "../models/Task.js";
import User from "../models/User.js";

export const getDashbaord=async(req,res)=>{
    try{
        const userId=req.body._id;
    const submissions=await Submission.find({user:userId}).populate("task");
    const completed=submissions.filter(s=>s.status=="Completed");
    const pendinf=submissions.filter(s=>s.status==="Pending");

    const xpEarned=completed.reduce((sum,s)=>sum+s.task.xpEarned,0);

    const domainTasks=await Task.find({domain:req.user.domain});
    const domainProgress=Math.round((completed.length/domainTasks.length)*100);

    res.json({
        completedCount:completed.length,
        pendingCount:pending.length,
        xpEarned,
        domainProgress,
        completedTasks:completed,
        pendingTasks:pending
    });
    
    }
    catch(err){
        res.statsu(500).json({message:"Dashboard error"});
    }
};

