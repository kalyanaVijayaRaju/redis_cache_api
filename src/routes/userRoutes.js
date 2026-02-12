const express = require("express");
const User = require("../models/user");
const redisClient = require("../config/redis");
const cacheUser = require("../middleware/cacheMiddleware");
const authMiddleware = require("../middleware/authMiddleware"); // ⭐ ADD
const roleMiddleware = require("../middleware/roleMiddleware");   // ⭐ ADD

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

// All users API GET
router.get("/", authMiddleware, roleMiddleware("admin"), async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Exclude passwords from response
    res.json(users);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.get( "/admin",authMiddleware,roleMiddleware("admin"),(req, res) => {
    res.json({ message: "Welcome Admin! You have access." });
  }
);


// ✅ Create User API (POST)
router.post("/", async (req, res) => {
  const user = await User.create(req.body);

  res.json({
    message: "✅ User Created",
    data: user,
  });
});

// Current user API (GET)

router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 5;

      const skip = (page - 1) * limit;

      const users = await User.find()
        .select("-password")
        .skip(skip)
        .limit(limit);

      const totalUsers = await User.countDocuments();

      res.json({
        totalUsers,
        currentPage: page,
        totalPages: Math.ceil(totalUsers / limit),
        users
      });

    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);



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
