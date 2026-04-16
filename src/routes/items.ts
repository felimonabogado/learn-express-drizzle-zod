import { Router } from "express";
import { createItemsScheme } from "../validators/item.js";
import { db } from "../db/index.js";
import { items } from "../db/schema.js";
import { eq } from "drizzle-orm";

export const itemsRouter: Router = Router();

itemsRouter.post("/api/items", async (req, res) => {
    const result = createItemsScheme.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json(result.error);
    }

    const item = await db.insert(items).values(result.data);

    res.json({ message: "Item created", item });
});

itemsRouter.get("/api/items", async (req, res) => {
    const allItems = await db.select().from(items);
    res.json(allItems);
});

itemsRouter.get("/api/items/:id", async (req, res) => {
    const { id } = req.params;
    const  [item] = await db.select().from(items).where(eq(items.id, Number(id)));

    if (!item) {
        return res.status(404).json({ message: "Item not found" });
    }

    return res.json(item);
});

itemsRouter.patch("/api/items/:id", async (req, res) => {
    const { id } = req.params;
    const result = createItemsScheme.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json(result.error);
    }

    const [item] = await db.select().from(items).where(eq(items.id, Number(id)));

    if (!item) {
        return res.status(404).json({ message: "Item not found" });
    }

    const updatedItem = await db.update(items).set(result.data).where(eq(items.id, Number(id)));

    res.json({ message: "Item updated", item: updatedItem });
});

itemsRouter.delete("/api/items/:id", async (req, res) => {
    const { id } = req.params;

    const [item] = await db.select().from(items).where(eq(items.id, Number(id)));

    if (!item) {
        return res.status(404).json({ message: "Item not found" });
    }

    const deletedItem = await db.delete(items).where(eq(items.id, Number(id)));

    if (!deletedItem) {
        return res.status(404).json({ message: "Item not found" });
    }

    res.json({ message: "Item deleted" });
});