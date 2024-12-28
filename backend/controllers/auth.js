import express, { Router } from "express";
import { User } from "../models/Signup.js";
import bcrypt from "bcrypt";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
// import { generateVerificationCode } from "../utils/generateverifactioncode.js";


export const signup = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    if (!username || !email || !password) {
      throw new Error("Please provide all required fields");
    }
    const UserAlreadyExist = await User.findOne({ email });
    if (UserAlreadyExist) {
      return res.status(400).json({success:false, message: "User already exist" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken =  Math.floor(100000 + Math.random() * 900000).toString();;
    const user = new User({ username, email, password: hashedPassword, verificationToken, verificationExpireAt: Date.now() + 24 * 60 * 60 * 1000 });

    await user.save();

    generateTokenAndSetCookie(res, user._id);

    res.status(201).json({ success: true, message: "User created successfully", user:{
        ...user._doc,
        password: "undefined"
    } });
  } catch (error) {
    console.log(error, "unable to signup");
  }
};

export const login = async (req, res) => {
        const { email, password } = req.body;
        try {
          if (!email || !password) {
            return res.status(400).json({ success: false, message: "Please provide email and password" });
          }
          const user = await User.findOne({ email });
          if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
          }
      
          const isPasswordValid = await bcrypt.compare(password, user.password);
          if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
          }
      
          generateTokenAndSetCookie(res, user._id);
      
          res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
              ...user.toObject(),
              password: undefined
            }
          });
        } catch (error) {
          console.error("Unable to login:", error);
          res.status(500).json({ success: false, message: "An error occurred during login" });
        }
      };
      

      export const logout = async (req , res) => {
        try {
          res.clearCookie('jwt');
          res.status(200).json({ success: true, message: "Logged out successfully" });
        } catch (error) {
          console.error("Unable to logout:", error);
          res.status(500).json({ success: false, message: "An error occurred during logout" });
        }
      };
