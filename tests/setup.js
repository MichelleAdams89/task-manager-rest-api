import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

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
  } catch (error) {
    console.warn("⚠ MongoDB not available in test environment");
    console.warn("   Continuing with in-memory data only");
    // Don't exit - allow tests to run with in-memory data
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