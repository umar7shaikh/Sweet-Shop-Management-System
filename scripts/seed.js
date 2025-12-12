import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../src/models/user.model.js";
import Sweet from "../src/models/sweet.model.js";

const SALT_ROUNDS = 10;

const run = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error("MONGODB_URI is not set");
    }

    await mongoose.connect(uri);
    console.log("✅ Connected to MongoDB for seeding");

    // Clear existing data (optional)
    await User.deleteMany({});
    await Sweet.deleteMany({});

    // Create admin user
    const passwordHash = await bcrypt.hash("AdminPass123!", SALT_ROUNDS);

    const admin = await User.create({
      name: "Admin User",
      email: "admin@sweets.com",
      passwordHash,
      role: "admin",
    });

    console.log("✅ Admin user created:", admin.email);

    // Seed some sweets
    const sweets = await Sweet.insertMany([
      {
        name: "Gulab Jamun",
        category: "Traditional",
        price: 50,
        quantity: 20,
      },
      {
        name: "Rasgulla",
        category: "Traditional",
        price: 40,
        quantity: 15,
      },
      {
        name: "Kaju Barfi",
        category: "Special",
        price: 200,
        quantity: 10,
      },
    ]);

    console.log(`✅ Inserted ${sweets.length} sweets`);

    await mongoose.connection.close();
    console.log("✅ Seeding completed and connection closed");
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    process.exit(1);
  }
};

run();
