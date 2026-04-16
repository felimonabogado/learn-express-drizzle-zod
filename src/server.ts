import express from "express";
import { userRouter } from "./routes/users.js";
import { itemsRouter } from "./routes/items.js";
import { authRouter } from "./routes/auth.js";
import cookieParser from "cookie-parser";

const port = process.env.PORT || 4000;
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(authRouter);
app.use(userRouter);
app.use(itemsRouter);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// 404 handler - MUST be last
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});


app.listen(port, () => {
  console.log(`Server running on port http://localhost:${port}`);
});