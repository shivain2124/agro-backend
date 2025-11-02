// routes/soilRoutes.js
import express from 'express';
import SoilSample from '../models/SoilSample.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

// ✅ Get all soil samples for the logged-in user
router.get('/all', authenticate, async (req, res) => {
  try {
    const samples = await SoilSample.find({ user: req.userId }).sort({ timestamp: -1 });
    res.json(samples);
  } catch (err) {
    console.error('Error fetching soil samples:', err);
    res.status(500).json({ message: 'Failed to fetch soil data' });
  }
});

export default router;