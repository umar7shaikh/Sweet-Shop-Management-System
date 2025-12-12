import mongoose from "mongoose";

const connectDB = async (mongoUri) => {
  try {
    if (!mongoUri) {
      throw new Error("MongoDB connection string is missing");
    }

    await mongoose.connect(mongoUri, {
      // Using defaults is fine for Mongoose 7+, options no longer required
    });

    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    throw error;
  }
};

export default connectDB;
