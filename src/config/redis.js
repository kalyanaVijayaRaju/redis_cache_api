const redis = require("redis");

const redisclient = redis.createClient({
    url: process.env.REDIS_URL,
});

redisclient.connect();

redisclient.on("connect",() => {
    console.log("✅ Redis Connected Successfully");
});

redisclient.on("error",(err) => {
    console.log("❌ Redis Connection Failed:", err);
    process.exit(1);
});

module.exports = redisclient;