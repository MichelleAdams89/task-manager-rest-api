import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// Global flag to indicate if MongoDB is connected
global.isMongoConnected = false;

// Setup for tests - connect to MongoDB if available
beforeAll(async () => {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/taskmanager_test";
    
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    });
    console.log("✓ Test database connected");
    global.isMongoConnected = true;
  } catch (error) {
    console.warn("⚠ MongoDB connection failed - running tests without database");
    console.warn("To fix: Install MongoDB locally or update MONGO_URI in .env file");
    console.warn("Error:", error.message);
    global.isMongoConnected = false;
  }
});

// Teardown for tests
afterAll(async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      // Clear all collections if connected
      const collections = mongoose.connection.collections;
      for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany({});
      }
      
      // Disconnect
      await mongoose.disconnect();
      console.log("✓ Test database disconnected");
    }
  } catch (error) {
    console.error("Error cleaning up test database:", error.message);
  }
});