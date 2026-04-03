import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect=async(req,res,next)=>{
try{
let token;
//get token from headers
if(
    req.headers.authorization && 
    req.headers.authorization.startsWith("Bearer")
){
    token=req.headers.authorization.split(" ")[1];
}
//if no token
if(!token){
    return res.status(401).json({message:"Not authorized,no token"});
}
//verify token
const decoded=jwt.verify(token,process.env.JWT_SECRET);

//get user from db(without password)
req.user=await User.findById(decoded.id).select("-password");

next();
}
catch(err){
res.status(401).json({message:"Not authorized,token failed"});
}
};

export default protect;