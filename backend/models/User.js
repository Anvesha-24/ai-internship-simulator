import mongoose from "mongoose";

const userSchema=new mongoose.Schema(
{
name:{type:String, required:true},
email:{type:String,required:true,unique:true},
password:{type:String,required:true},
domain:{type:String,default:"Web"},
level:{type:String,default:"Intern Level 1"},
xp:{type:Number,default:0}, //experience points
},
{timestamps:true},
);

export default mongoose.model("User",userSchema);