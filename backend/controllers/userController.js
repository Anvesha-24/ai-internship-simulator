//returns logged in users

export const getUserProfile=async(req,res)=>{
    try{
        res.json({
            message:"User profile fetched successfully",
            user:req.user,
        });
    }
    catch(error){
        res.status(500).json({message:error.message});
    }
};