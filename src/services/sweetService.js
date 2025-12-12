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
