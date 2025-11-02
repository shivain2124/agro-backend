import express from "express";
import multer from "multer";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Mock ML prediction endpoint
router.post("/predict", upload.single("file"), async (req, res) => {
  try {
    // In a real model you’d parse req.file.buffer → run ML → send predictions
    res.json({
      predictions: [
        { crop: "Wheat", confidence: 0.92 },
        { crop: "Rice", confidence: 0.81 },
        { crop: "Maize", confidence: 0.77 },
        { crop: "Sugarcane", confidence: 0.66 },
      ],
      accuracy: 0.91,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Prediction failed" });
  }
});

export default router;