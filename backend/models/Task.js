import mongoose from "mongoose";

const taskSchema=new mongoose.Schema({
title:{type:String,required:true},
description:{type:String,required:true},
domain:{type:String,required:true},
levelRequired:{type:String,default:"Intern Level 1"},
xpReward:{type:Number,default:50},
resources:{type:[String]},
},
{timestamps:true}
);
export default mongoose.model("Task",taskSchema);