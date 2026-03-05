import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const mongoUri =
      process.env.MONGO_URI || "mongodb://localhost:27017/taskmanager";

    const conn = await mongoose.connect(mongoUri);

    console.log(`✓ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("✗ Database connection failed");
    console.error("Error:", error.message);

    process.exit(1);
  }
};

export default connectDB;