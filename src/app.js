import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "./routes/auth.routes.js";
import sweetRoutes from "./routes/sweet.routes.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "sweet-shop-api" });
});

app.use("/api/auth", authRoutes);
app.use("/api/sweets", sweetRoutes);

export default app;
