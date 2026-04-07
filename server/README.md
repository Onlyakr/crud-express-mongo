# Express.js CRUD + Auth Refresh
A backend API built to refresh core concepts in **Express.js**, **TypeScript**, and **Validation**.

---

## Project Goals
- **Modular Architecture:** Organized by features (Auth, Posts, Users)
- **Type Safety:** Full TypeScript implementation.
- **Validation:** Schema-based validation using **Zod**
- **Auth:** Implementation of JWT or Session-based authentication with password hashing.
- **Database Integration:** Document modeling with **Mongoose (MongoDB)**.

---

## Tech Stack
- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Validation:** Zod
- **Database:** MongoDB via Mongoose
- **Security:** Bcrypt (Hashing) + Passport.js or JWT
- **Testing:** Jest + SuperTest

---

## Project Structure
Following a **Modular (Feature-based)** approach:

```text
src/
├── config/             # Database connection, Env variables
├── middlewares/        # Global Error handler, Auth guards
├── modules/            # Domain logic (The "Heart" of the app)
│   ├── auth/           # Login, Register, Logout
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.routes.ts
│   │   └── auth.schema.ts (Zod)
│   └── posts/          # CRUD for Blog posts
│       ├── post.controller.ts
│       ├── post.service.ts
│       ├── post.routes.ts
│       └── post.model.ts
├── utils/              # Shared helpers
├── validators/         # Domain logic (The "Heart" of the app)
└── index.ts            # App entry point
```

---
<!--
## API Roadmap

### **1. Authentication (`/api/auth`)**
- [ ] `POST /register` - Create new account (Bcrypt hashing)
- [ ] `POST /login` - Authenticate user & start session/token
- [ ] `POST /logout` - Clear session/token
- [ ] `GET /status` - Verify authentication state

### **2. Posts CRUD (`/api/posts`)**
- [ ] `GET /` - Fetch all posts (Public)
- [ ] `POST /` - Create a post (**Auth Required** + **Zod Validation**)
- [ ] `GET /:id` - Get single post detail
- [ ] `PATCH /:id` - Update post content (Owner only)
- [ ] `DELETE /:id` - Remove post (Owner only)

---

## Getting Started

### 1. Install Dependencies
```bash
npm install express mongoose zod bcrypt cookie-parser passport passport-local express-session
npm install --save-dev typescript tsx @types/node @types/express @types/bcrypt
```

### 2. Environment Setup
Create a `.env` file:
```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/refresh_db
SESSION_SECRET=your_super_secret_key
```

### 3. Scripts
Add these to your `package.json`:
```json
"scripts": {
  "dev": "nodemon src/index.ts",
  "build": "tsc",
  "start": "node dist/index.js"
}
```

----->

## Key Concepts to Refresh
* **Middleware Pattern:** Implementing a global `errorHandler` and `validateSchema` middleware.
* **Controller vs Service:** Keeping controllers "thin" (handling req/res) and services "fat" (handling business logic).
* **Zod Integration:** Defining schemas and using `schema.safeParse()` for cleaner validation logic.
* **Error Handling:** Using `async/await` with `try/catch` or a custom `AsyncHandler` wrapper.
