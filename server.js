import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import mongoose from "mongoose";

import authRoute from "./routes/auth.js";
import postsRoute from "./routes/posts.js";

dotenv.config();

const app = express(); // ✅ DEFINE FIRST

// 🔥 Middleware
app.use(express.json());
app.use("/api/posts", checkJwt, postRoutes);

app.use(cors({
  origin: [
    "https://blockerspace.com",
    "http://localhost:5173"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// 🔥 Routes
app.use("/api/auth", authRoute);
app.use("/api/posts", postsRoute);

// 🔥 Temporary OTP storage
const otps = {};

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// 🔥 Email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// 🔥 Send OTP
app.post("/send-otp", async (req, res) => {
  const { email } = req.body;

  if (!email.endsWith("@gmail.com")) {
    return res.status(400).json({ error: "Only Gmail addresses allowed" });
  }

  const otp = generateOTP();
  otps[email] = otp;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otp}. It expires in 5 minutes.`,
    });

    res.json({ message: "OTP sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send OTP" });
  }
});

// 🔥 Verify OTP
app.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;

  if (otps[email] === otp) {
    delete otps[email];
    res.json({ message: "Verified successfully" });
  } else {
    res.status(400).json({ error: "Invalid OTP" });
  }
});

// 🔥 Home route
app.get("/", (req, res) => res.send("Backend is running"));

// 🔥 MongoDB connection
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("MongoDB connection error:", err));