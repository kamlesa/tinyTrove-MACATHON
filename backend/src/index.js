import express from "express";
import userAuthRoutes from "./routes/userAuthRoute.js";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/user-auth", userAuthRoutes);

const server = app.listen(3000, () =>
  console.log("Server running at localhost:3000")
);
