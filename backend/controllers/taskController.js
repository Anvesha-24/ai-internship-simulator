import Task from "../models/Task.js";

//get tasks for logged in user's domain
export const getTasks=async(req,res)=>{
    try{
        const tasks=await Task.find({domain:req.user.domain});
        res.json(tasks);
    }
    catch(err){
        res.status(500).json({message:"Failed to fetch tasks"});
    }
};

//get a single task
export const getTaskById=async(req,res)=>{
    try{
        const task=await Task.findById(req.params.id);

        if(!task)
            return res.status(404).json({message:"Task not found"});

        if(task.domain!==req.user.domain){
            return res.status(403).json({message:"Not allowed"});
        }
        res.json(task);
    }
    catch(err){
        res.status(500).json({message:"Failed to open task"});
    }
};

export const createTask=async(req,res)=>{
    try{
        const{title,description,domain,xpReward}=req.body;
        const task=await Task.create({
            title,
            description,
            domain,
            xpReward,
        });
        res.status(201).json(task);
    }
    catch(err){
        res.status(500).json({message:"Failed to create task"});
    }
};

