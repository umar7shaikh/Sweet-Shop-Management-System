import express from "express";
import { requireAuth, requireRole } from "../middleware/authMiddleware.js";
import {
  createSweet,
  getAllSweets,
  searchSweets,
  updateSweet,
  deleteSweetById,
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

// PUT /api/sweets/:id (admin only)
router.put("/:id", requireAuth, requireRole("admin"), async (req, res) => {
  try {
    const updated = await updateSweet(req.params.id, req.body);
    res.status(200).json({ sweet: updated });
  } catch (error) {
    if (error.message === "Sweet not found") {
      return res.status(404).json({ message: error.message });
    }
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/sweets/:id (admin only)
router.delete("/:id", requireAuth, requireRole("admin"), async (req, res) => {
  try {
    await deleteSweetById(req.params.id);
    res.status(204).send();
  } catch (error) {
    if (error.message === "Sweet not found") {
      return res.status(404).json({ message: error.message });
    }
    res.status(400).json({ message: error.message });
  }
});

export default router;
