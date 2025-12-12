import "dotenv/config";
import mongoose from "mongoose";
import Sweet from "../src/models/sweet.model.js";
import {
  purchaseSweet,
  restockSweet,
} from "../src/services/inventoryService.js";

describe("InventoryService", () => {
  let sweet;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_TEST_URI);
  });

  beforeEach(async () => {
    sweet = await Sweet.create({
      name: "Inventory Sweet",
      category: "Test",
      price: 100,
      quantity: 5,
    });
  });

  afterEach(async () => {
    await Sweet.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should decrease quantity on purchase", async () => {
    const updated = await purchaseSweet(sweet._id.toString(), 2);
    expect(updated.quantity).toBe(3);
  });

  it("should not allow purchase more than stock", async () => {
    await expect(purchaseSweet(sweet._id.toString(), 10)).rejects.toThrow(
      "Insufficient stock"
    );
  });

  it("should not allow purchase when sweet not found", async () => {
    await expect(
      purchaseSweet("000000000000000000000000", 1)
    ).rejects.toThrow("Sweet not found");
  });

  it("should increase quantity on restock", async () => {
    const updated = await restockSweet(sweet._id.toString(), 5);
    expect(updated.quantity).toBe(10);
  });

  it("should reject negative restock amount", async () => {
    await expect(restockSweet(sweet._id.toString(), -1)).rejects.toThrow(
      "Restock amount must be positive"
    );
  });
});
