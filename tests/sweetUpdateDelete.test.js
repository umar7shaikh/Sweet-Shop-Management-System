import "dotenv/config";
import mongoose from "mongoose";
import Sweet from "../src/models/sweet.model.js";
import {
  updateSweet,
  deleteSweetById,
} from "../src/services/sweetService.js";

describe("SweetService update and delete", () => {
  let sweet;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_TEST_URI);
  });

  beforeEach(async () => {
    sweet = await Sweet.create({
      name: "Original",
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

  it("should update a sweet's details", async () => {
    const updated = await updateSweet(sweet._id.toString(), {
      name: "Updated",
      price: 150,
    });

    expect(updated.name).toBe("Updated");
    expect(updated.price).toBe(150);
  });

  it("should throw when updating with negative price", async () => {
    await expect(
      updateSweet(sweet._id.toString(), { price: -10 })
    ).rejects.toThrow("Price must be a non-negative number");
  });

  it("should delete a sweet by id", async () => {
    await deleteSweetById(sweet._id.toString());
    const found = await Sweet.findById(sweet._id);
    expect(found).toBeNull();
  });
});
