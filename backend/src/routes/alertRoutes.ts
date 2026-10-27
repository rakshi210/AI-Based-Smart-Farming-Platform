import { Router } from 'express';
import { getAlerts, resolveAlert } from '../controllers/alertController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken);

router.get('/', getAlerts);
router.patch('/:id/resolve', resolveAlert);

export default router;

