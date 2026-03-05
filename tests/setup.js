import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

let isConnected = false;

// Setup for tests - connect to MongoDB
beforeAll(async () => {
  try {
    // Use test MongoDB URI from .env
    const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/taskmanager_test";
    
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 3000,
      socketTimeoutMS: 3000,
    });
    console.log("✓ Test database connected");
    isConnected = true;
  } catch (error) {
    console.warn("⚠ MongoDB connection failed - running tests without database");
    console.warn("To fix: Install MongoDB locally or update MONGO_URI in .env file");
    console.warn("Error:", error.message);
    isConnected = false;
  }
});

// Teardown for tests
afterAll(async () => {
  if (isConnected) {
    try {
      // Clear all collections
      const collections = mongoose.connection.collections;
      for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany({});
      }
      
      // Disconnect
      await mongoose.disconnect();
      console.log("✓ Test database disconnected");
    } catch (error) {
      console.error("Error cleaning up test database:", error.message);
    }
  }
});

// Export for test files to check connection status
export { isConnected };