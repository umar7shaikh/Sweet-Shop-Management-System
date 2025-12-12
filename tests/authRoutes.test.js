import "dotenv/config";
import mongoose from "mongoose";
import request from "supertest";
import app from "../src/app.js";
import User from "../src/models/user.model.js";

describe("Auth HTTP routes", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_TEST_URI);
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("POST /api/auth/register should create user", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Umar",
      email: "route-register@example.com",
      password: "StrongPass123",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("user");
    expect(res.body.user).toHaveProperty("email", "route-register@example.com");
    expect(res.body.user).not.toHaveProperty("passwordHash");
  });

  it("POST /api/auth/login should return jwt for valid credentials", async () => {
    await request(app).post("/api/auth/register").send({
      name: "Umar",
      email: "route-login@example.com",
      password: "StrongPass123",
    });

    const res = await request(app).post("/api/auth/login").send({
      email: "route-login@example.com",
      password: "StrongPass123",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(typeof res.body.token).toBe("string");
  });

  it("POST /api/auth/login should reject invalid credentials", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "unknown@example.com",
      password: "WrongPass",
    });

    expect(res.statusCode).toBe(401);
  });
});
