const redis = require("redis");

// Try to load .env if dotenv is installed (no crash if it's not present)
try { require("dotenv").config(); } catch (e) {}

// Provide a sensible default so the app works without an env file
const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

const redisclient = redis.createClient({
    url: REDIS_URL,
});

redisclient.on("connect", () => {
    console.log("✅ Redis Connected Successfully");
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