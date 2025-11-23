import express from 'express';
import { enhanceText } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protect ensures only logged-in users can use your API quota
router.post('/enhance', protect, enhanceText);

export default router;