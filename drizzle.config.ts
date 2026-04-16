import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: 'mysql',
  schema: './src/db/schema.ts',
  dbCredentials: {
    host: process.env.DATABASE_HOST || 'invalid-host',
    port: parseInt(process.env.DATABASE_PORT || '3306'),
    user: process.env.DATABASE_USERNAME || 'invalid-user',
    password: process.env.DATABASE_PASSWORD || 'invalid-password',
    database: process.env.DATABASE_NAME || 'invalid-database'
  }
})
