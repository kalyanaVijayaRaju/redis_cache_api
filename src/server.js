const cookieParser = require("cookie-parser");
require('dns').setDefaultResultOrder('ipv4first');
const express = require("express");
const authRoutes = require("./routes/authRoutes");
require("dotenv").config();
const path = require("path");
const cors = require("cors");

const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(express.json());

app.use(cookieParser());

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use(express.static(path.join(__dirname, "../public")));

const startServer = async () => {
  try {
    // 1️⃣ Wait for MongoDB first
    await connectDB();

    // 2️⃣ Then start server
    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server running on port ${process.env.PORT}`);
    });

  } catch (err) {
    console.log("Server start failed:", err);
  }
};

startServer();

// Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
