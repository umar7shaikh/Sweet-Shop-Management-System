import "dotenv/config";
import jwt from "jsonwebtoken";
import express from "express";
import request from "supertest";
import { requireAuth, requireRole } from "../src/middleware/authMiddleware.js";

describe("Auth middleware", () => {
  const JWT_SECRET = process.env.JWT_SECRET || "test_secret";

  const createAppWithRoute = (handler) => {
    const app = express();
    app.use(express.json());
    app.get("/protected", handler, (req, res) => {
      res.json({ ok: true, user: req.user });
    });
    return app;
  };

  it("should reject missing authorization header", async () => {
    const app = createAppWithRoute(requireAuth);

    const res = await request(app).get("/protected");

    expect(res.statusCode).toBe(401);
  });

  it("should reject invalid token", async () => {
    const app = createAppWithRoute(requireAuth);

    const res = await request(app)
      .get("/protected")
      .set("Authorization", "Bearer invalid.token.here");

    expect(res.statusCode).toBe(401);
  });

  it("should attach user to req for valid token", async () => {
    const payload = { sub: "123", role: "customer", email: "u@example.com" };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

    const app = createAppWithRoute(requireAuth);

    const res = await request(app)
      .get("/protected")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("user");
    expect(res.body.user).toMatchObject(payload);
  });

  it("should reject non-admin user on admin-only route", async () => {
    const payload = { sub: "123", role: "customer", email: "u@example.com" };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

    const app = createAppWithRoute((req, res, next) =>
      requireAuth(req, res, (err) => {
        if (err) return next(err);
        requireRole("admin")(req, res, next);
      })
    );

    const res = await request(app)
      .get("/protected")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(403);
  });

  it("should allow admin user on admin-only route", async () => {
    const payload = { sub: "123", role: "admin", email: "admin@example.com" };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

    const app = createAppWithRoute((req, res, next) =>
      requireAuth(req, res, (err) => {
        if (err) return next(err);
        requireRole("admin")(req, res, next);
      })
    );

    const res = await request(app)
      .get("/protected")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.user.role).toBe("admin");
  });
});
