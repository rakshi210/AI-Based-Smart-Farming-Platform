import { Router } from 'express';
import {
  handleCropRecommendation,
  handleIrrigationRecommendation,
  handleFertilizerRecommendation,
  getRecommendationHistory,
} from '../controllers/recommendationController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken);

router.post('/crop', handleCropRecommendation);
router.post('/irrigation', handleIrrigationRecommendation);
router.post('/fertilizer', handleFertilizerRecommendation);
router.get('/history', getRecommendationHistory);

export default router;

