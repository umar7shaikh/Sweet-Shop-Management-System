import "dotenv/config";
import mongoose from "mongoose";
import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../src/app.js";
import Sweet from "../src/models/sweet.model.js";
import User from "../src/models/user.model.js";

const makeToken = (user) => {
  const payload = {
    sub: user._id.toString(),
    role: user.role,
    email: user.email,
  };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
};

describe("Sweet HTTP routes", () => {
  let adminUser;
  let adminToken;
  let customerUser;
  let customerToken;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_TEST_URI);

    adminUser = await User.create({
      name: "Admin",
      email: "admin@sweets.com",
      passwordHash: "hashed",
      role: "admin",
    });
    customerUser = await User.create({
      name: "Customer",
      email: "customer@sweets.com",
      passwordHash: "hashed",
      role: "customer",
    });

    adminToken = makeToken(adminUser);
    customerToken = makeToken(customerUser);
  });

  afterEach(async () => {
    await Sweet.deleteMany({});
  });

  afterAll(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  it("should allow admin to create a sweet", async () => {
    const res = await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Gulab Jamun",
        category: "Traditional",
        price: 50,
        quantity: 10,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("sweet");
    expect(res.body.sweet.name).toBe("Gulab Jamun");
  });

  it("should forbid non-admin from creating a sweet", async () => {
    const res = await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({
        name: "Ladoo",
        category: "Festival",
        price: 30,
        quantity: 5,
      });

    expect(res.statusCode).toBe(403);
  });

  it("should list all sweets for authenticated users", async () => {
    await Sweet.create({
      name: "Barfi",
      category: "Special",
      price: 100,
      quantity: 5,
    });

    const res = await request(app)
      .get("/api/sweets")
      .set("Authorization", `Bearer ${customerToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("sweets");
    expect(res.body.sweets).toHaveLength(1);
  });

  it("should search sweets by filters", async () => {
    await Sweet.create({
      name: "Kaju Barfi",
      category: "Special",
      price: 200,
      quantity: 3,
    });
    await Sweet.create({
      name: "Milk Barfi",
      category: "Special",
      price: 120,
      quantity: 4,
    });

    const res = await request(app)
      .get("/api/sweets/search")
      .set("Authorization", `Bearer ${customerToken}`)
      .query({ name: "Barfi", category: "Special", minPrice: 150 });

    expect(res.statusCode).toBe(200);
    expect(res.body.sweets).toHaveLength(1);
    expect(res.body.sweets[0].name).toBe("Kaju Barfi");
  });

  it("should allow admin to update a sweet", async () => {
    const created = await Sweet.create({
      name: "Old",
      category: "Test",
      price: 50,
      quantity: 5,
    });

    const res = await request(app)
      .put(`/api/sweets/${created._id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "New Name", price: 60 });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("sweet");
    expect(res.body.sweet.name).toBe("New Name");
    expect(res.body.sweet.price).toBe(60);
  });

  it("should allow admin to delete a sweet", async () => {
    const created = await Sweet.create({
      name: "To Delete",
      category: "Test",
      price: 40,
      quantity: 2,
    });

    const res = await request(app)
      .delete(`/api/sweets/${created._id}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(204);
  });

  it("should allow customer to purchase a sweet and reduce quantity", async () => {
    const created = await Sweet.create({
      name: "Buy Me",
      category: "Test",
      price: 20,
      quantity: 5,
    });

    const res = await request(app)
      .post(`/api/sweets/${created._id}/purchase`)
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ amount: 2 });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("sweet");
    expect(res.body.sweet.quantity).toBe(3);
  });

  it("should forbid purchase when insufficient stock", async () => {
    const created = await Sweet.create({
      name: "Low Stock",
      category: "Test",
      price: 20,
      quantity: 1,
    });

    const res = await request(app)
      .post(`/api/sweets/${created._id}/purchase`)
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ amount: 5 });

    expect(res.statusCode).toBe(400);
  });

  it("should allow admin to restock a sweet", async () => {
    const created = await Sweet.create({
      name: "Restock Me",
      category: "Test",
      price: 20,
      quantity: 1,
    });

    const res = await request(app)
      .post(`/api/sweets/${created._id}/restock`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ amount: 4 });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("sweet");
    expect(res.body.sweet.quantity).toBe(5);
  });
});
