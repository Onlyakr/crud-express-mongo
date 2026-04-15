# Express.js CRUD + Auth

A backend API built with **Express.js**, **TypeScript**, and **Validation**.

---

## Tech Stack
- **Runtime:** Node.js
- **Framework:** Express.js 5
- **Language:** TypeScript 6
- **Validation:** Zod 4
- **Database:** MongoDB via Mongoose 9
- **Security:** Bcryptjs (hashing) + JWT
- **Email:** Nodemailer
- **Linting & Formatting:** Biome

---

## Project Structure

```
src/
├── config/              # Database connection, env variables
├── middlewares/         # Auth guards
├── modules/
│   ├── auth/            # Login, register, email verification
│   │   ├── auth.controller.ts
│   │   ├── auth.routes.ts
│   │   └── auth.schema.ts
│   ├── posts/           # CRUD for blog posts
│   │   ├── posts.controller.ts
│   │   ├── posts.model.ts
│   │   ├── posts.routes.ts
│   │   ├── posts.schema.ts
│   │   └── posts.service.ts
│   ├── users/           # User model
│   │   └── users.model.ts
│   └── items/           # Items CRUD (demo)
│       └── items.routes.ts
├── utils/               # Shared helpers (email, token, hash)
├── server.ts            # App entry point
└── app.ts              # Express app setup
```

---

## Environment Variables

```env
NODE_ENV=development
LISTEN_PORT=8000

MONGO_URI=mongodb+srv://...

JWT_ACCESS_SECRET=your_access_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key

SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
EMAIL_FROM=no-reply@myapp.com

APP_URL=http://localhost:8000
```

---

## API Endpoints

### Authentication (`/auth`)
| Method | Endpoint | Description |
|-------|----------|-------------|
| POST | `/auth/register` | Create new account |
| GET | `/auth/verify-email` | Verify email token |
| POST | `/auth/login` | Login & receive tokens |
| POST | `/auth/refresh` | Refresh access token |
| POST | `/auth/logout` | Clear cookies |

### Posts (`/api/v1/posts`) - Requires Auth
| Method | Endpoint | Description |
|-------|----------|-------------|
| GET | `/posts` | Get all posts (paginated) |
| GET | `/posts/:id` | Get single post |
| POST | `/posts` | Create post |
| PUT | `/posts/:id` | Update post |
| DELETE | `/posts/:id` | Delete post |

### Items (`/api/v1/items`)
| Method | Endpoint | Description |
|-------|----------|-------------|
| GET | `/items` | Get all items |
| GET | `/items/:id` | Get single item |
| POST | `/items` | Create item |
| PUT | `/items/:id` | Replace item |
| PATCH | `/items/:id` | Update item |
| DELETE | `/items/:id` | Delete item |

---

## Authentication

Tokens are sent via **httpOnly cookies**:

- `accessToken` - 30 min expiry
- `refreshToken` - 7 day expiry

Both cookies are set on login and refresh.

---

## Scripts

```bash
pnpm dev      # Start development server
pnpm build    # Compile TypeScript
pnpm start    # Run production server
pnpm lint     # Run Biome linter
pnpm format   # Format code
```

---

## Getting Started

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev
```

---

## Auth Flow

1. **Register:** `POST /auth/register` → Creates user, sends verification email
2. **Verify Email:** Click link in email → Token verified
3. **Login:** `POST /auth/login` → Returns accessToken + refreshToken cookies
4. **Authenticated Requests:** Cookies sent automatically with requests
5. **Refresh:** `POST /auth/refresh` → New accessToken cookie (if refreshToken valid)
6. **Logout:** `POST /auth/logout` → Clears both cookies

---

## Quick Reference

See [SUMMARY.md](./SUMMARY.md) for Express.js cheat sheet.

---

## License

ISC