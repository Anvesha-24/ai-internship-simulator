import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Assignment from "../models/Assignment.js";
import Task from "../models/Task.js";

// ================= REGISTER USER =================
export const registerUser = async (req, res) => {
  try {
    // 1. Get data from frontend
    const { name, email, password,domain} = req.body;

    // 2. Validation
    if (!name || !email || !password || !domain) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 3. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 4. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 5. Create user in DB
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      domain
    });

    //assign first 3 tasks of that domain
    const tasksToAssign=await Task.find({domain}).limit(3);
    for(const task of tasksToAssign){
        await Assignment.create({user: user._id,task: task._id});
    }

    // 6. Create JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 7. Send response
    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        domain: user.domain,
        level: user.level,
        xp: user.xp,
      },
    });

  } catch (error) {
    console.log("REGISTER ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// ================= LOGIN USER =================
export const loginUser = async (req, res) => {
  try {
    // 1. Get login data
    const { email, password } = req.body;

    // 2. Validation
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 3. Check user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 4. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 5. Create token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 6. Send response
    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        domain: user.domain,
        level: user.level,
        xp: user.xp,
      },
    });

  } catch (error) {
    console.log("LOGIN ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

//get me
// ================= GET CURRENT USER =================
export const getMe = async (req, res) => {
  try {
    // req.user.id comes from your auth middleware
    const user = await User.findById(req.user.id).select("-password");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.log("GET ME ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};