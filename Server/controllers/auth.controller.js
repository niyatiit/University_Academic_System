import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

//Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET);
};

const register = async (req, res) => {
  try {
    const { username, email, password, department } = req.body;

    if (!username || !email || !password || !department) {
      return res.status(400).json({ message: "All Fields are requierd " });
    }

    const validDepartment = ["BCA", "MCA", "BBA", "MBA", "B.TECH", "JMC"];
    if (!validDepartment.includes(department)) {
      return res.status(400).json({ message: "Invalid Department selected" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User is already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      department,
    });

    const token = generateToken(user._id);

    return res.status(201).json({
      message: "User Register Successfully",
      token,
      user,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and Password are required" });
    }

    console.log("Login attempt with email:", email);  // 👈 add this

    const user = await User.findOne({ email });
    console.log("Found user:", user);  // 👈 add this

    if (!user) {
      return res.status(400).json({ message: "Invalid Email or Password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match:", isMatch);  // 👈 add this

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Email or password" });
    }

    const token = generateToken(user._id);

    return res.status(200).json({ message: "Login Successfully", token, user });
  } catch (error) {
    return res.status(500).json({ message: "Server Error", error: error.message }); // 👈 also fix this bug
  }
};

export {register , login}