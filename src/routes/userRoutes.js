const express = require("express");
const User = require("../models/user");
const redisClient = require("../config/redis");
const cacheUser = require("../middleware/cacheMiddleware");
const authMiddleware = require("../middleware/authMiddleware"); // ⭐ ADD

const router = express.Router();


// ✅ PROFILE ROUTE (ADD THIS FIRST)
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    res.json({
      message: "Profile fetched successfully",
      data: user
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ✅ Create User API (POST)
router.post("/", async (req, res) => {
  const user = await User.create(req.body);

  res.json({
    message: "✅ User Created",
    data: user,
  });
});


// ✅ Get User By ID API (GET + Redis Cache)
router.get("/:id", cacheUser, async (req, res) => {
  const userId = req.params.id;

  const user = await User.findById(userId);

  await redisClient.setEx(
    `user:${userId}`,
    30,
    JSON.stringify(user)
  );

  res.json({
    source: "MongoDB Database",
    data: user,
  });
});


// ✅ Update User API (PUT + Cache Invalidate)
router.put("/:id", async (req, res) => {
  const userId = req.params.id;

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    req.body,
    { new: true }
  );

  await redisClient.del(`user:${userId}`);

  res.json({
    message: "✅ User Updated & Cache Cleared",
    data: updatedUser,
  });
});

module.exports = router;
