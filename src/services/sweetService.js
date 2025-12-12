import Sweet from "../models/sweet.model.js";
import { validateSweetInput } from "../validation/sweetValidation.js";

export const createSweet = async (input) => {
  const { isValid, errors } = validateSweetInput(input);
  if (!isValid) {
    throw new Error(errors[0]);
  }

  const sweet = await Sweet.create(input);
  return sweet;
};

export const getAllSweets = async () => {
  const sweets = await Sweet.find().sort({ createdAt: -1 });
  return sweets;
};

export const searchSweets = async ({ name, category, minPrice, maxPrice }) => {
  const filter = {};

  if (name) {
    filter.name = { $regex: name, $options: "i" };
  }

  if (category) {
    filter.category = { $regex: category, $options: "i" };
  }

  if (minPrice != null || maxPrice != null) {
    filter.price = {};
    if (minPrice != null) filter.price.$gte = Number(minPrice);
    if (maxPrice != null) filter.price.$lte = Number(maxPrice);
  }

  const sweets = await Sweet.find(filter).sort({ createdAt: -1 });
  return sweets;
};

export const updateSweet = async (id, updates) => {
  const existing = await Sweet.findById(id);
  if (!existing) {
    throw new Error("Sweet not found");
  }

  const merged = {
    name: updates.name ?? existing.name,
    category: updates.category ?? existing.category,
    price: updates.price ?? existing.price,
    quantity: updates.quantity ?? existing.quantity,
  };

  const { isValid, errors } = validateSweetInput(merged);
  if (!isValid) {
    throw new Error(errors[0]);
  }

  Object.assign(existing, updates);
  await existing.save();
  return existing;
};

export const deleteSweetById = async (id) => {
  const deleted = await Sweet.findByIdAndDelete(id);
  if (!deleted) {
    throw new Error("Sweet not found");
  }
};