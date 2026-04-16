import { mysqlTable, int, varchar, text, timestamp } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }),
  password: varchar("password", { length: 255 }),
  created_at:  timestamp("created_at").notNull().defaultNow(),
  last_login_at: timestamp("last_login_at").notNull().defaultNow(),
});

export const items = mysqlTable("items", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }),
  price: int("price"),
  description: text("description"),
  created_at:  timestamp("created_at").notNull().defaultNow(),
});