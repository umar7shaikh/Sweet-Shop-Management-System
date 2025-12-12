import "dotenv/config";
import mongoose from "mongoose";
import Sweet from "../src/models/sweet.model.js";
import { createSweet, getAllSweets, searchSweets } from "../src/services/sweetService.js";

describe("SweetService", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_TEST_URI);
  });

  afterEach(async () => {
    await Sweet.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should create a valid sweet", async () => {
    const sweet = await createSweet({
      name: "Gulab Jamun",
      category: "Traditional",
      price: 50,
      quantity: 10,
    });

    expect(sweet).toBeDefined();
    expect(sweet.name).toBe("Gulab Jamun");
    expect(sweet.price).toBe(50);
    expect(sweet.quantity).toBe(10);
  });

  it("should reject sweet with negative price", async () => {
    await expect(
      createSweet({
        name: "Ladoo",
        category: "Festival",
        price: -10,
        quantity: 5,
      })
    ).rejects.toThrow("Price must be a non-negative number");
  });

  it("should list all sweets", async () => {
    await createSweet({
      name: "Barfi",
      category: "Special",
      price: 100,
      quantity: 5,
    });
    await createSweet({
      name: "Rasgulla",
      category: "Traditional",
      price: 80,
      quantity: 8,
    });

    const sweets = await getAllSweets();

    expect(sweets).toHaveLength(2);
  });

  it("should search sweets by name and category and price range", async () => {
    await createSweet({
      name: "Kaju Barfi",
      category: "Special",
      price: 200,
      quantity: 3,
    });
    await createSweet({
      name: "Milk Barfi",
      category: "Special",
      price: 120,
      quantity: 4,
    });

    const result = await searchSweets({
      name: "Barfi",
      category: "Special",
      minPrice: 150,
      maxPrice: 250,
    });

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Kaju Barfi");
  });
});
