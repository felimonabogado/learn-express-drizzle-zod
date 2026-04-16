import { db } from "../index.js";
import { items } from "../schema.js";

export async function seedItems() {
    await db.insert(items).values([
        {
            name: "Item 1",
            price: 100,
            description: "Description for Item 1"
        },
        {
            name: "Item 2",
            price: 200,
            description: "Description for Item 2"
        }
    ]);

    console.log("Items Seeding completed");
    process.exit(0);
}