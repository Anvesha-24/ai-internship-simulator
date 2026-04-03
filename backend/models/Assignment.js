//tracks which studemt is assigned which task,submission and status
import mongoose from "mongoose";

const assignmentSchema=new mongoose.Schema({
    user:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
    task:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
    status:{type:String,default:"Pending"},
    submissionLink:{type:String},
    textAnswer:{type:String,default:""},
    xpEarned:{type:Number,default:0},
},
{timestamps:true}
);
export default mongoose.model("Assignment",assignmentSchema);