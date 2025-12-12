import Sweet from "../models/sweet.model.js";

export const purchaseSweet = async (id, amount) => {
  const qty = Number(amount);

  if (!Number.isFinite(qty) || !Number.isInteger(qty) || qty <= 0) {
    throw new Error("Purchase amount must be positive");
  }

  const sweet = await Sweet.findById(id);
  if (!sweet) {
    throw new Error("Sweet not found");
  }

  if (sweet.quantity < qty) {
    throw new Error("Insufficient stock");
  }

  sweet.quantity -= qty;
  await sweet.save();
  return sweet;
};

export const restockSweet = async (id, amount) => {
  const qty = Number(amount);

  if (!Number.isFinite(qty) || !Number.isInteger(qty) || qty <= 0) {
    throw new Error("Restock amount must be positive");
  }

  const sweet = await Sweet.findById(id);
  if (!sweet) {
    throw new Error("Sweet not found");
  }

  sweet.quantity += qty;
  await sweet.save();
  return sweet;
};
