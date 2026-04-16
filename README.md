# Express.js Backend Setup Guide

This is a TypeScript-based Express.js backend application with MySQL database integration using Drizzle ORM.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Environment Setup](#environment-setup)
- [Database Configuration](#database-configuration)
- [Running the Application](#running-the-application)
- [Development Commands](#development-commands)
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
│   │   └── schema.ts          # Database schema definitions
│   ├── routes/
│   │   └── users.ts           # User-related API routes
│   └── validators/
│       └── user.ts            # Input validation schemas
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

Edit `.env` and fill in your actual database credentials:

```env
# Database Configuration
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=your_database_user
DB_PASSWORD=your_secure_password
DB_NAME=your_database_name
```

**⚠️ IMPORTANT:** 
- **NEVER** commit `.env` to version control
- `.env` is already listed in `.gitignore`
- Each developer must have their own `.env` file with their credentials

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

Edit [`src/db/schema.ts`](src/db/schema.ts) to define your database tables using Drizzle ORM syntax.

Example:
```typescript
import { mysqlTable, varchar, int } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
    id: int().primaryKey().autoincrement(),
    name: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
});
```

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
| `pnpm test` | Run tests (if configured) |

---

## Security Best Practices

### 1. **Environment Variables**
- ✅ Store sensitive data (credentials, API keys) in `.env`
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

### 4. **Error Handling**
- ✅ Log errors securely without exposing sensitive information
- ✅ Return generic error messages to clients
- ❌ Never expose database credentials or internal errors to frontend

### 5. **Git Management**
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
| zod | ^4.3.6 | Schema validation |

### Development Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| typescript | ^6.0.2 | Type safety |
| @types/node | ^25.6.0 | Node.js type definitions |
| @types/express | ^5.0.6 | Express type definitions |
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

## Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [Drizzle ORM Docs](https://orm.drizzle.team/)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Zod Validation](https://zod.dev/)

---

## License

ISC

---

## Notes

- This is a template guide. Customize it based on your specific project needs.
- Add more sections as your project grows (API documentation, testing, deployment, etc.)
- Keep dependencies updated: `pnpm update`
