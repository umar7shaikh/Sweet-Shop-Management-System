import "dotenv/config";
import mongoose from "mongoose";
import User from "../src/models/user.model.js";
import { registerUser } from "../src/services/authService.js";
import { loginUser } from "../src/services/authService.js";

describe("AuthService.loginUser", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_TEST_URI);
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should return a jwt token for valid credentials", async () => {
    await registerUser({
      name: "Umar",
      email: "login@example.com",
      password: "StrongPass123",
    });

    const { token } = await loginUser({
      email: "login@example.com",
      password: "StrongPass123",
    });

    expect(token).toBeDefined();
    expect(typeof token).toBe("string");
  });

  it("should throw error for invalid email", async () => {
    await expect(
      loginUser({
        email: "unknown@example.com",
        password: "SomePass123",
      })
    ).rejects.toThrow("Invalid email or password");
  });

  it("should throw error for wrong password", async () => {
    await registerUser({
      name: "Umar",
      email: "login2@example.com",
      password: "CorrectPass123",
    });

    await expect(
      loginUser({
        email: "login2@example.com",
        password: "WrongPass",
      })
    ).rejects.toThrow("Invalid email or password");
  });
});
