import { validateSweetInput } from "../src/validation/sweetValidation.js";

describe("validateSweetInput", () => {
  it("should be valid for correct sweet data", () => {
    const result = validateSweetInput({
      name: "Gulab Jamun",
      category: "Traditional",
      price: 50,
      quantity: 10,
    });

    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("should reject negative price", () => {
    const result = validateSweetInput({
      name: "Ladoo",
      category: "Festival",
      price: -10,
      quantity: 5,
    });

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("Price must be a non-negative number");
  });

  it("should reject negative quantity", () => {
    const result = validateSweetInput({
      name: "Barfi",
      category: "Special",
      price: 100,
      quantity: -1,
    });

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain(
      "Quantity must be a non-negative integer"
    );
  });

  it("should reject short name and category", () => {
    const result = validateSweetInput({
      name: "A",
      category: "B",
      price: 10,
      quantity: 1,
    });

    expect(result.isValid).toBe(false);
    expect(result.errors).toEqual(
      expect.arrayContaining([
        "Name must be at least 2 characters",
        "Category must be at least 2 characters",
      ])
    );
  });
});
