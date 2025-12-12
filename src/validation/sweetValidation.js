export const validateSweetInput = ({ name, category, price, quantity }) => {
  const errors = [];

  if (!name || typeof name !== "string" || name.trim().length < 2) {
    errors.push("Name must be at least 2 characters");
  }

  if (!category || typeof category !== "string" || category.trim().length < 2) {
    errors.push("Category must be at least 2 characters");
  }

  if (typeof price !== "number" || Number.isNaN(price) || price < 0) {
    errors.push("Price must be a non-negative number");
  }

  if (!Number.isInteger(quantity) || quantity < 0) {
    errors.push("Quantity must be a non-negative integer");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
