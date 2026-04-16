import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import "dotenv/config";

const pool = mysql.createPool({
    host: process.env.DATABASE_HOST || "invalid-host",
    port: parseInt(process.env.DATABASE_PORT || "3306"),
    user: process.env.DATABASE_USERNAME || "invalid-user",
    password: process.env.DATABASE_PASSWORD || "invalid-password",
    database: process.env.DATABASE_NAME || "invalid-db",
});

export const db = drizzle(pool);