import jwt from "jsonwebtoken";

export const authenticate = (req, res, next) => {
  console.log("AUTH HEADER:", req.headers.authorization);
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token missing or invalid format" });
  }

  const token = authHeader.substring(7);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch {
    return res.status(409).json({ message: "Invalid/expired token" });
  }
};
