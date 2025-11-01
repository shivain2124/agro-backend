// routes/chatRoutes.js
import express from 'express';
import multer from 'multer';
import { authenticate } from '../middleware/authMiddleware.js';
import { chatAsk } from '../controllers/chatController.js';

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// Send text only (JSON) or text+image (multipart/form-data)
router.post('/ask', authenticate, upload.single('image'), chatAsk);

export default router;