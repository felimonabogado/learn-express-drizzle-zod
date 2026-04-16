import { db } from "../index.js";
import { users } from "../schema.js";
import { seedItems } from "./items.seed.js";

async function seed() {
    await db.insert(users).values([
        {
            name: "Admin",
            email: "admin@high6.com",
            password: "admin123"
        },
        {
            name: "John Doe",
            email: "john@high6.com",
            password: "password123"
        }
    ]);

    await seedItems();

    console.log("Users Seeding completed");
    process.exit(0);
}

seed();