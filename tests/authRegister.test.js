import "dotenv/config";
import mongoose from "mongoose";
import User from "../src/models/user.model.js";
import { registerUser } from "../src/services/authService.js";

describe("AuthService.registerUser", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_TEST_URI);
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should create a new user with hashed password", async () => {
    const user = await registerUser({
      name: "Umar",
      email: "umar@example.com",
      password: "StrongPass123",
    });

    expect(user).toBeDefined();
    expect(user.email).toBe("umar@example.com");
    expect(user.passwordHash).toBeDefined();
    expect(user.passwordHash).not.toBe("StrongPass123");
  });

  it("should not allow duplicate email", async () => {
    await registerUser({
      name: "First",
      email: "duplicate@example.com",
      password: "Password1!",
    });

    await expect(
      registerUser({
        name: "Second",
        email: "duplicate@example.com",
        password: "Password1!",
      })
    ).rejects.toThrow("Email already in use");
  });
});
