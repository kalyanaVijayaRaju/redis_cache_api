const mongoose = require("mongoose");

const connectDB = async () => {
  const directUri = process.env.MONGO_URI;

  const options = {
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000,
    tls: true,
    retryWrites: false,
  };

  if (directUri) {
    try {
      console.log(`\n🔗 Connecting to MongoDB...`);
      
      await mongoose.connect(directUri, options);
      console.log("✅ MongoDB Connected Successfully");
      return;
    } catch (err) {
      console.log("❌ MongoDB Connection Failed:", err.message);
      process.exit(1);
    }
  }

  console.log("❌ No MongoDB connection string provided in environment");
  process.exit(1);
};

module.exports = connectDB;

module.exports = connectDB;