import { Router } from "express";
import { generateToken } from "../utils/jwt.js";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { eq, and } from "drizzle-orm";


export const authRouter: Router = Router();

authRouter.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  const [user] = await db
  .select()
  .from(users)
  .where(
    and(
      eq(users.email, email),
      eq(users.password, password)
    )
  );

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = generateToken({
    userId: user.id,
    email: user.email,
  });

  // send via cookie (best practice)
  res.cookie("token", token, {
    httpOnly: true,
    secure: false, // true in production (HTTPS)
    sameSite: "lax",
  });

  res.json({ 
    message: "Login successful", 
    token: token, 
    user: user 
  });
  
});

authRouter.post("/api/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false, // true in production (HTTPS)
    sameSite: "lax",
  });

  res.json({ message: "Logout successful" });
});