const express = require("express");
require("dotenv").config();

const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");

const app = express();

// ✅ JSON body parser
app.use(express.json());

// ✅ Connect MongoDB
connectDB();

// ✅ Routes
app.use("/api/users", userRoutes);

// ✅ Start Server
app.listen(process.env.PORT, () => {
  console.log(`🚀 Server running on port ${process.env.PORT}`);
});