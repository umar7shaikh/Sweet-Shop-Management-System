import jwt from "jsonwebtoken";

export const requireAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization token missing" });
    }

    const token = authHeader.split(" ")[1];

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT secret not configured");
    }

    const payload = jwt.verify(token, secret);

    req.user = {
      sub: payload.sub,
      role: payload.role,
      email: payload.email,
    };

    return next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const requireRole = (role) => (req, res, next) => {
  if (!req.user || req.user.role !== role) {
    return res.status(403).json({ message: "Forbidden" });
  }
  return next();
};
