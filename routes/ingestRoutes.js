// routes/ingestRoutes.js
import express from 'express';
import SoilSample from '../models/SoilSample.js';
import User from '../models/User.js';

const router = express.Router();

/**
 * POST /api/ingest/soil
 * Headers: x-api-key: <deviceKey>
 * Body: { userId, N, P, K, ph, moisture, latitude, longitude, timestamp? }
 */
router.post('/soil', async (req, res) => {
  try {
    const apiKey = (req.headers['x-api-key'] || '').trim();
    if (!apiKey) return res.status(401).json({ message: 'x-api-key missing' });

    // Find user who owns this device key
    const owner = await User.findOne({ ingestKey: apiKey });
    if (!owner) return res.status(401).json({ message: 'Invalid x-api-key' });

    const {
      N, P, K, ph, moisture,
      latitude, longitude,
      timestamp
    } = req.body || {};

    if (N == null || P == null || K == null) {
      return res.status(400).json({ message: 'N,P,K are required' });
    }

    const sample = await SoilSample.create({
      user: owner._id,
      N, P, K,
      ph, moisture,
      latitude, longitude,
      timestamp: timestamp ? new Date(timestamp) : new Date()
    });

    res.status(201).json({ ok: true, id: sample._id });
  } catch (e) {
    console.error('INGEST ERROR:', e);
    res.status(500).json({ message: 'Ingest failed' });
  }
});

export default router;