import type { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt.js";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    let token = req.cookies.token;


    // fallback to Authorization header
    if (!token && req.headers.authorization) {
      const authHeader = req.headers.authorization;
      token = authHeader.split(" ")[1]; // Bearer <token>
    }

    if (!token) {
      return res.status(401).json({ message: "No token" });
    }

    const decoded = verifyToken(token);

    // attach user to request
    (req as any).user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
}