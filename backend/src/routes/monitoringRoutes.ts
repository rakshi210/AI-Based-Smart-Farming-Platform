import { Router } from 'express';
import { addMonitoringData, getMonitoringData } from '../controllers/monitoringController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken);

router.post('/', addMonitoringData);
router.get('/', getMonitoringData);

export default router;

