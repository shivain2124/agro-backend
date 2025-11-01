import express from "express";
import {
  submitSoilData,
  getAllSoilSamples,
} from "../controllers/soilController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();
router.post("/submit", authenticate, submitSoilData);
router.get("/all", authenticate, getAllSoilSamples);
export default router;
