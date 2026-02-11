const redis = require("redis");

try { require("dotenv").config(); } catch (e) {}

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

const redisclient = redis.createClient({
    url: REDIS_URL,
    socket: {
        tls: true,   // ⭐ important for Upstash
    }
});

redisclient.on("connect", async ()  =>  {
   await console.log("✅ Redis Connected Successfully");
});

redisclient.on("error", (err) => {
    console.log("❌ Redis Connection Failed:", err);
    process.exit(1);
});

redisclient.connect().catch((err) => {
    console.log("❌ Redis Connection Failed:", err);
    process.exit(1);
});

module.exports = redisclient;
