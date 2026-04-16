import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "invalid-secret"; // move to .env in real apps

export function generateToken(payload: object) {
  return jwt.sign(payload, SECRET, {
    expiresIn: "1h",
  });
}

export function verifyToken(token: string) {
  return jwt.verify(token, SECRET);
}