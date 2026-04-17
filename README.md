# Express.js Backend Setup Guide

This is a TypeScript-based Express.js backend application with MySQL database integration using Drizzle ORM, JWT authentication, and built-in data seeding.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Environment Setup](#environment-setup)
- [Database Configuration](#database-configuration)
- [Authentication & JWT](#authentication--jwt)
- [Database Seeding](#database-seeding)
- [Running the Application](#running-the-application)
- [Development Commands](#development-commands)
- [API Endpoints](#api-endpoints)
- [Security Best Practices](#security-best-practices)
- [Dependencies](#dependencies)

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **pnpm** (Package Manager) - [Installation Guide](https://pnpm.io/installation)
- **MySQL** (v5.7 or higher) - [Download](https://www.mysql.com/downloads/)

Verify installation:
```bash
node --version
pnpm --version
mysql --version
```

---

## Installation

### 1. Clone or Navigate to Project Directory
```bash
cd your-project-directory
```

### 2. Install Dependencies
```bash
pnpm install
```

This will install all required packages defined in `package.json`:
- **express** - Web framework
- **mysql2** - MySQL client
- **drizzle-orm** - ORM for database operations
- **dotenv** - Environment variable management
- **zod** - Schema validation
- **typescript** - Type safety

---

## Project Structure

```
backend-app/
├── src/
│   ├── server.ts              # Main application entry point
│   ├── db/
│   │   ├── index.ts           # Database connection & Drizzle setup
│   │   ├── schema.ts          # Database schema definitions
│   │   └── seed/
│   │       ├── index.ts       # Main seed script
│   │       └── items.seed.ts  # Items seed data
│   ├── routes/
│   │   ├── auth.ts            # Authentication routes (login, logout)
│   │   ├── users.ts           # User-related API routes
│   │   └── items.ts           # Items API routes
│   ├── middleware/
│   │   └── auth.ts            # JWT authentication middleware
│   ├── utils/
│   │   └── jwt.ts             # JWT token generation & verification
│   └── validators/
│       ├── user.ts            # User input validation schemas
│       └── item.ts            # Item input validation schemas
├── .env                        # Environment variables (local, NOT in git)
├── .env.example                # Template for environment variables
├── .gitignore                  # Git ignore rules
├── package.json                # Project dependencies & scripts
├── tsconfig.json               # TypeScript configuration
├── pnpm-lock.yaml              # Dependency lock file
└── README.md                   # This file
```

---

## Environment Setup

### 1. Create `.env` File

Copy the `.env.example` file to `.env`:

```bash
cp .env.example .env
```

### 2. Configure Environment Variables

Edit `.env` and fill in your actual database credentials and JWT secret:

```env
# Database Configuration
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=your_database_user
DB_PASSWORD=your_secure_password
DB_NAME=your_database_name

# JWT Configuration
JWT_SECRET=your_super_secret_key_change_in_production

# Server Configuration (optional)
PORT=4000
```

**⚠️ IMPORTANT:** 
- **NEVER** commit `.env` to version control
- `.env` is already listed in `.gitignore`
- Each developer must have their own `.env` file with their credentials
- Use a strong, random string for `JWT_SECRET` in production

---

## Database Configuration

### 1. Create MySQL Database

Connect to your MySQL server:

```bash
mysql -u root -p
```

Create the database:

```sql
CREATE DATABASE express_db;
USE express_db;
```

### 2. Database Connection

The database connection is configured in [`src/db/index.ts`](src/db/index.ts):

```typescript
const pool = mysql.createPool({
    host: process.env.DB_HOST!,
    port: parseInt(process.env.DB_PORT!),
    user: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_NAME!,
});
```

**Environment Variable Validation:**
The application will fail at startup if any required environment variables are missing. This prevents runtime errors due to misconfiguration.

### 3. Define Your Schema

The schema is already defined in [`src/db/schema.ts`](src/db/schema.ts) with two main tables:

**Users Table:**
```typescript
export const users = mysqlTable("users", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }),
  password: varchar("password", { length: 255 }),
  created_at:  timestamp("created_at").notNull().defaultNow(),
  last_login_at: timestamp("last_login_at").notNull().defaultNow(),
});
```

**Items Table:**
```typescript
export const items = mysqlTable("items", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }),
  price: int("price"),
  description: text("description"),
  created_at:  timestamp("created_at").notNull().defaultNow(),
});
```

You can customize these tables as needed. For schema migrations, use:
```bash
pnpm push
```

---

## Authentication & JWT

This application uses **JWT (JSON Web Tokens)** for stateless authentication.

### Token Management

- **Token Generation**: Handled by [`src/utils/jwt.ts`](src/utils/jwt.ts)
- **Token Expiry**: Tokens expire after 1 hour
- **Token Storage**: Stored in HTTP-only cookies and sent via Authorization header

```typescript
// Generate a token
const token = generateToken({ userId: user.id, email: user.email });

// Verify a token
const decoded = verifyToken(token);
```

### Authentication Middleware

Protected routes use the auth middleware from [`src/middleware/auth.ts`](src/middleware/auth.ts):

```typescript
import { authMiddleware } from "../middleware/auth.js";

// Protect a route
app.get("/api/protected", authMiddleware, (req, res) => {
  const user = (req as any).user; // Access decoded token
  res.json({ message: "Protected resource", user });
});
```

The middleware checks for tokens in:
1. **HTTP-only Cookie** (`token` cookie) - Recommended
2. **Authorization Header** (`Bearer <token>`) - Fallback

### Login & Logout

**Login:**
```bash
curl -X POST http://localhost:4000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@high6.com", "password": "admin123"}'
```

**Logout:**
```bash
curl -X POST http://localhost:4000/api/logout
```

---

## Database Seeding

Quickly populate your database with initial data using the seed script.

### Run Seed

```bash
pnpm seed
```

This will:
1. Insert sample users into the `users` table
2. Insert sample items into the `items` table via `items.seed.ts`
3. Exit the process

### Seed Files

**Users Seed** - [`src/db/seed/index.ts`](src/db/seed/index.ts):
```typescript
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
```

**Items Seed** - [`src/db/seed/items.seed.ts`](src/db/seed/items.seed.ts):
Create custom items seed data by editing this file.

---

## Running the Application

### Development Mode

Start the development server with hot-reload:

```bash
pnpm dev
```

The server will start and watch for file changes. Press `Ctrl+C` to stop.

### Production Build (if applicable)

Build TypeScript to JavaScript:
```bash
pnpm build
```

---

## Development Commands

| Command | Description |
|---------|-------------|
| `pnpm install` | Install all dependencies |
| `pnpm dev` | Run development server with hot-reload |
| `pnpm seed` | Populate database with initial seed data |
| `pnpm push` | Push schema changes to database (Drizzle migrations) |
| `pnpm test` | Run tests (if configured) |

---

## API Endpoints

### Health Check
- **GET** `/api/health` - Server status check

### Authentication
- **POST** `/api/login` - Login with email and password
- **POST** `/api/logout` - Clear authentication token

### Users
- **GET** `/api/users` - Get all users (protected)
- **POST** `/api/users` - Create a new user (protected)

### Items
- **GET** `/api/items` - Get all items
- **POST** `/api/items` - Create a new item (protected)

---

## Security Best Practices

### 1. **Environment Variables**
- ✅ Store sensitive data (credentials, API keys, JWT_SECRET) in `.env`
- ✅ Use `.env.example` as a template without real values
- ✅ Add `.env` to `.gitignore`
- ❌ Never hardcode credentials in code
- ❌ Never commit `.env` to version control

### 2. **Database Security**
- ✅ Use strong passwords for database accounts
- ✅ Limit database user permissions to specific tables/operations
- ✅ Use SSL connections for remote MySQL servers
- ❌ Never use default credentials (root/root)

### 3. **Input Validation**
- ✅ Validate all user inputs using Zod schemas
- ✅ Sanitize inputs before database queries
- ✅ Use parameterized queries (built-in with mysql2)
- ❌ Never trust client input

### 4. **JWT & Authentication**
- ✅ Store JWT_SECRET in `.env` (never hardcode)
- ✅ Use HTTP-only cookies for token storage (prevent XSS attacks)
- ✅ Set `secure: true` in production (HTTPS only)
- ✅ Set token expiration times (currently 1 hour)
- ✅ Implement refresh tokens for long-lived sessions (recommended)
- ❌ Never expose JWT_SECRET in frontend code
- ❌ Never log sensitive token information

### 5. **Error Handling**
- ✅ Log errors securely without exposing sensitive information
- ✅ Return generic error messages to clients
- ❌ Never expose database credentials or internal errors to frontend

### 6. **Git Management**
- ✅ Keep `.env` in `.gitignore`
- ✅ Track `.env.example` instead
- ✅ Use Git pre-commit hooks to prevent `.env` commits
- ❌ Never push `.env` files

---

## Dependencies

### Production Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| express | ^5.2.1 | Web framework |
| mysql2 | ^3.22.0 | MySQL client |
| drizzle-orm | ^0.45.2 | ORM for database operations |
| dotenv | ^17.4.2 | Environment variable management |
| jsonwebtoken | ^9.0.3 | JWT token generation & verification |
| cookie-parser | ^1.4.7 | Parse HTTP cookies |
| zod | ^4.3.6 | Schema validation |

### Development Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| typescript | ^6.0.2 | Type safety |
| @types/node | ^25.6.0 | Node.js type definitions |
| @types/express | ^5.0.6 | Express type definitions |
| @types/jsonwebtoken | ^9.0.10 | JWT type definitions |
| @types/cookie-parser | ^1.4.10 | Cookie parser type definitions |
| tsx | ^4.21.0 | TypeScript executor |
| ts-node | ^10.9.2 | TypeScript Node runner |
| drizzle-kit | ^0.31.10 | Drizzle migrations & schema management |

---

## Troubleshooting

### Error: Missing environment variables
**Solution:** Ensure `.env` file exists and all required variables are set.
```bash
cp .env.example .env
# Edit .env with your actual credentials
```

### Error: Cannot connect to MySQL
**Solution:** Verify:
- MySQL server is running
- Credentials in `.env` are correct
- Database exists: `CREATE DATABASE express_db;`
- User has proper permissions

### Port already in use
**Solution:** Change the port in your server configuration or kill the process using the port.

---

## Quick Start

**Get the app running in 5 minutes:**

```bash
# 1. Install dependencies
pnpm install

# 2. Create and configure .env
cp .env.example .env
# Edit .env with your database credentials and JWT_SECRET

# 3. Create database
mysql -u root -p
# CREATE DATABASE express_db;

# 4. Push schema to database
pnpm push

# 5. Seed initial data
pnpm seed

# 6. Start development server
pnpm dev
```

Server will run at `http://localhost:4000`

---

## Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [Drizzle ORM Docs](https://orm.drizzle.team/)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Zod Validation](https://zod.dev/)
- [JWT.io](https://jwt.io/) - JWT information and debugger
- [jsonwebtoken NPM](https://www.npmjs.com/package/jsonwebtoken) - JWT library docs

---

## License

ISC

---

## Notes

- This application includes JWT authentication - customize token expiry and payload as needed
- Database seeding is useful for development/testing - add more seed files as your data grows
- Remember to use strong JWT_SECRET and enable HTTPS in production
- Customize `.env.example` as your project requirements change
