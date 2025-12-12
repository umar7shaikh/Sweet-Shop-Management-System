import express from "express";
import { requireAuth, requireRole } from "../middleware/authMiddleware.js";
import {
  createSweet,
  getAllSweets,
  searchSweets,
} from "../services/sweetService.js";

const router = express.Router();

// POST /api/sweets (admin only)
router.post("/", requireAuth, requireRole("admin"), async (req, res) => {
  try {
    const sweet = await createSweet(req.body);
    res.status(201).json({ sweet });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET /api/sweets (auth)
router.get("/", requireAuth, async (req, res) => {
  const sweets = await getAllSweets();
  res.status(200).json({ sweets });
});

// GET /api/sweets/search (auth)
router.get("/search", requireAuth, async (req, res) => {
  const { name, category, minPrice, maxPrice } = req.query;
  const sweets = await searchSweets({
    name,
    category,
    minPrice: minPrice != null ? Number(minPrice) : undefined,
    maxPrice: maxPrice != null ? Number(maxPrice) : undefined,
  });
  res.status(200).json({ sweets });
});

export default router;
