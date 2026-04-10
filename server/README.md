# Express.js CRUD + Auth Refresh

A backend API built to refresh core concepts in **Express.js**, **TypeScript**, and **Validation**.

---

## Project Goals
- **Modular Architecture:** Organized by features (Auth, Posts, Users)
- **Type Safety:** Full TypeScript implementation.
- **Validation:** Schema-based validation using **Zod**
- **Auth:** JWT-based authentication with password hashing.
- **Database Integration:** Document modeling with **Mongoose (MongoDB)**.

---

## Tech Stack
- **Runtime:** Node.js
- **Framework:** Express.js 5
- **Language:** TypeScript 6
- **Validation:** Zod 4
- **Database:** MongoDB via Mongoose 9
- **Security:** Bcryptjs (Hashing) + JWT
- **Email:** Nodemailer
- **Linting:** Biome

---

## Project Structure
Following a **Modular (Feature-based)** approach:

```
src/
├── config/              # Database connection, Env variables
├── middlewares/         # Auth guards
├── modules/
│   ├── auth/            # Login, Register, Email verification
│   │   ├── auth.controller.ts
│   │   ├── auth.routes.ts
│   │   └── auth.schema.ts (Zod)
│   ├── posts/           # CRUD for Blog posts (empty)
│   │   └── posts.routes.ts
│   ├── users/          # User model
│   │   └── users.model.ts
│   └── items/          # Items CRUD (in-memory)
│       └── items.routes.ts
├── utils/               # Shared helpers (email, token, hash, mock-data)
└── server.ts            # App entry point
```

---

## API Roadmap

### **1. Authentication (`/auth`)**
- [x] `POST /register` - Create new account (Bcrypt hashing + Email verification)
- [x] `GET /verify-email` - Verify email token
- [x] `POST /login` - Authenticate user & receive JWT

### **2. Posts (`/posts`)**
- [ ] CRUD endpoints (not yet implemented)

### **3. Items (`/items`)**
- [x] `GET /` - Fetch all items (with optional query filter)
- [x] `GET /:id` - Get single item
- [x] `POST /` - Create item
- [x] `PUT /:id` - Replace item
- [x] `PATCH /:id` - Update item
- [x] `DELETE /:id` - Remove item

---

## Getting Started

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Environment Setup
Create a `.env` file:
```env
PORT=8000
MONGO_URI=mongodb://localhost:27017/crud_db
JWT_SECRET=your_super_secret_key
```

### 3. Run Development Server
```bash
pnpm dev
```

### 4. Available Scripts
```bash
pnpm dev      # Start development server with watch mode
pnpm build    # Compile TypeScript to dist/
pnpm start    # Run compiled production server
pnpm lint     # Run Biome linter
pnpm format   # Format code with Biome
```

---

## Key Concepts to Refresh
- **Middleware Pattern:** Implementing auth guards and validation middleware.
- **Controller vs Service:** Keeping controllers "thin" (handling req/res) and services "fat" (handling business logic).
- **Zod Integration:** Defining schemas and using `schema.safeParse()` for cleaner validation logic.
- **JWT Auth:** Token-based authentication with httpOnly cookies.