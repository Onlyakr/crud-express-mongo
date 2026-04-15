# Express.js Cheat Sheet

Quick reference for Express.js patterns used in this project.

---

## Basic App Setup

```typescript
import express from "express";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
app.use(helmet());

// Routes
app.get("/path", handler);
app.post("/path", handler);

// Start server
app.listen(PORT, () => {});
```

---

## Request & Response

```typescript
// Get query params
const { key } = req.query;
const name = req.query.name as string;

// Get route params
const { id } = req.params;
const id = req.params.id as string;

// Get body
const { name } = req.body;

// Set response
res.json({ data: "ok" });
res.status(201).json({ data: "ok" });
res.send("Hello");

// Set cookie
res.cookie("name", "value", {
  httpOnly: true,
  secure: true,
  sameSite: "lax",
  maxAge: 60000,
});

// Clear cookie
res.clearCookie("name");
```

---

## Router

```typescript
import express from "express";
const router = express.Router();

router.get("/", handler);
router.get("/:id", handler);
router.post("/", handler);
router.put("/:id", handler);
router.delete("/:id", handler);

export default router;
```

---

## Middleware

```typescript
// Basic middleware
function logger(req, res, next) {
  console.log(req.method, req.path);
  next();
}

// Async middleware
async function auth(req, res, next) {
  try {
    const user = await verifyToken(req.cookies.token);
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
}

// Use middleware
app.use(logger);
app.use("/api", auth);
```

---

## Error Handling

```typescript
// Sync error handler
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({ message: "Internal error" });
});

// Async try-catch in controller
try {
  const data = await db.find();
  res.json(data);
} catch (error) {
  console.error("Error:", error.message);
  res.status(500).json({ message: "Internal error" });
}
```

---

## Mongoose Schema

```typescript
import { Schema, model } from "mongoose";

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  createdAt: { type: Date, default: Date.now },
});

// Add index
userSchema.index({ email: 1 });

const User = model("User", userSchema);
export default User;
```

---

## Mongoose Queries

```typescript
// Find all
const users = await User.find({ role: "user" });

// Find one
const user = await User.findOne({ email: "a@b.com" });

// Find by ID
const user = await User.findById(id);

// Create
const user = await User.create({ name: "John" });
// or
const user = new User({ name: "John" });
await user.save();

// Update
await User.findByIdAndUpdate(id, { name: "John" }, { new: true });

// Delete
await User.findByIdAndDelete(id);

// Count
const count = await User.countDocuments({ role: "user" });
```

---

## Zod Validation

```typescript
import z from "zod";

// Schema
const createUserSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.email(),
  password: z.string().min(8),
});

// Validate
const result = schema.safeParse(req.body);

if (!result.success) {
  const errors = z.treeifyError(result.error);
  return res.status(400).json({ errors });
}

const { name } = result.data;
```

---

## JWT

```typescript
import jwt from "jsonwebtoken";
import env from "./config/env.js";

// Sign token
const token = jwt.sign({ sub: userId }, env.JWT_ACCESS_SECRET, {
  expiresIn: "30m",
});

// Verify token
const payload = jwt.verify(token, env.JWT_ACCESS_SECRET);
```

---

## bcrypt

```typescript
import bcrypt from "bcryptjs";

// Hash password
const hash = await bcrypt.hash(password, 10);

// Compare
const match = await bcrypt.compare(password, hash);
```

---

## Cookie Options

```typescript
res.cookie("name", "value", {
  httpOnly: true,        // No JS access
  secure: true,         // HTTPS only
  sameSite: "strict",   // CSRF protection
  maxAge: 1000 * 60 * 60 * 24, // 24 hours
  path: "/",
  domain: undefined,
});
```

---

## Common Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK |
| 201 | Created |
| 204 | No Content |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Internal Error |

---

## Useful Patterns

### Paginated Query
```typescript
const page = Math.max(1, parseInt(req.query.page as string) || 1);
const limit = Math.min(100, parseInt(req.query.limit as string) || 10);
const skip = (page - 1) * limit;

const [data, total] = await Promise.all([
  Model.find().skip(skip).limit(limit),
  Model.countDocuments(),
]);
```

### Filter with Query Params
```typescript
const filter: any = {};
if (req.query.status) filter.status = req.query.status;
if (req.query.search) {
  filter.$or = [
    { name: { $regex: req.query.search, $options: "i" } },
  ];
}
```

### Async Handler Wrapper
```typescript
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
```

### Check Ownership
```typescript
const post = await Posts.findById(id);
if (post.author.toString() !== req.userId) {
  return res.status(403).json({ message: "Forbidden" });
}
```