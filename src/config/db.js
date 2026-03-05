import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/taskmanager";
    
    await mongoose.connect(mongoUri);

    console.log("✓ MongoDB connected successfully");
  } catch (error) {
    console.error("✗ Database connection failed");
    console.error("Error:", error.message);
    
    // In development, log the error but don't exit
    // In production tests, this would fail appropriately
    if (process.env.NODE_ENV === "production") {
      process.exit(1);
    }
  }
};

export default connectDB;