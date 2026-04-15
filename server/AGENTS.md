# AGENTS.md

## Commands

- `pnpm dev` - Start dev server with watch mode
- `pnpm build` - Compile TypeScript to dist/
- `pnpm start` - Run production server
- `pnpm lint` - Run Biome linter
- `pnpm format` - Format code with Biome

## Entry Points

- **Dev:** `src/server.ts` (uses `tsx watch`)
- **App:** `src/app.ts` (Express setup)

## Required Env (.env)

```env
MONGO_URI=mongodb://localhost:27017/crud_db
JWT_SECRET=your_secret_key
```

## Routes

All routes prefixed with `/api/v1/`:

- `/api/v1/items` - Items CRUD
- `/api/v1/auth` - Auth (register, login, verify-email)
- `/api/v1/posts` - Posts CRUD (protected, requires auth middleware)

## Tech Stack

- **Runtime:** Node.js (ESM via `"type": "module"`)
- **TS:** Strict mode enabled
- **Linter:** Biome (not ESLint/Prettier)
- **Test:** Jest + Supertest (installed but not configured)

## Gotchas

- Uses `.js` extension in imports (ESM requirement)
- MongoDB must be running before `pnpm dev`
- `posts` routes are protected via auth middleware in app.ts:41 (uses auth.middleware.ts)
- Test script is placeholder only