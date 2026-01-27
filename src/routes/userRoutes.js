const express = require("express");
const User = require("../models/user");
const redisClient = require("../config/redis");
const cacheUser = require("../middleware/cacheMiddleware");

const router = express.Router();


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

  // ✅ Fetch from MongoDB
  const user = await User.findById(userId);

  // ✅ Store result in Redis for 60 seconds
  await redisClient.setEx(
    `user:${userId}`,
    60,
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

  // ✅ Clear Redis Cache after update
  await redisClient.del(`user:${userId}`);

  res.json({
    message: "✅ User Updated & Cache Cleared",
    data: updatedUser,
  });
});

module.exports = router;