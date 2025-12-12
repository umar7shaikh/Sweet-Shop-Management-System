import express from "express";
import { registerUser, loginUser } from "../services/authService.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await registerUser({ name, email, password });

    const safeUser = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    };

    res.status(201).json({ user: safeUser });
  } catch (error) {
    if (error.message === "Email already in use") {
      return res.status(409).json({ message: error.message });
    }
    res.status(400).json({ message: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const { token, user } = await loginUser({ email, password });

    const safeUser = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    };

    res.status(200).json({ token, user: safeUser });
  } catch (error) {
    res.status(401).json({ message: "Invalid email or password" });
  }
});

export default router;
