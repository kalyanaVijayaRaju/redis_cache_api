const redisClient = require("../config/redis");

// ✅ Middleware to check Redis cache before DB query
const cacheUser = async (req, res, next) => {
  const userId = req.params.id;

  // ✅ Redis key format
  const cacheKey = `user:${userId}`;

  // ✅ Check if user data is already cached
  const cachedData = await redisClient.get(cacheKey);

  if (cachedData) {
    console.log("✅ Cache HIT (Redis)");

    // ✅ Return cached response instantly
    return res.json({
      source: "Redis Cache",
      data: JSON.parse(cachedData),
    });
  }

  console.log("❌ Cache MISS (MongoDB)");
  next();
};

module.exports = cacheUser;