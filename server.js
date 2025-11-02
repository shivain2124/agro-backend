import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import soilRoutes from "./routes/soilRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import mlRoutes from "./routes/mlRoutes.js";
import ingestRoutes from "./routes/ingestRoutes.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/soil", soilRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/ml", mlRoutes);
app.use("/api/ingest", ingestRoutes);

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected");
    const port = process.env.PORT || 5173;
    app.listen(port, () => console.log(`Server running on port ${port}`));
  })
  .catch((err) => console.error(err));
console.log("Groq key exists:", !!process.env.GROK_API_KEY);
