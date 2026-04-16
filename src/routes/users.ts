import { Router } from "express";
import { createUserSchema } from "../validators/user.js";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { authMiddleware } from "../middleware/auth.js";

export const userRouter: Router = Router();

userRouter.post("/api/users", authMiddleware, async (req, res) => {
  const result = createUserSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json(result.error);
  }

  const user = await db.insert(users).values(result.data);

  res.json({ message: "User created", user });
});

userRouter.get("/api/users", authMiddleware, async (req, res) => {
  const allUsers = await db.select().from(users);

  res.json(allUsers);
});

userRouter.get("/api/users/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;

  const user = await db.select().from(users).where(eq(users.id, Number(id)));

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user);
});

userRouter.patch("/api/users/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const result = createUserSchema.safeParse(req.body);
  if(!result.success) {
    return res.status(400).json(result.error);
  }

  const updatedUser = await db.update(users).set(result.data).where(eq(users.id, Number(id)));

  if (!updatedUser) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json({ message: "User updated", user: updatedUser });
});

userRouter.delete("/api/users/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;

  const deletedUser = await db.delete(users).where(eq(users.id, Number(id)));

  if (!deletedUser) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json({ message: "User deleted", user: deletedUser });
});