import express from "express";
import { userRouter } from "./routes/users.js";

const port = 4000;
const app = express();
app.use(express.json());

app.use(userRouter);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(port, () => {
  console.log(`Server running on port http://localhost:${port}`);
});