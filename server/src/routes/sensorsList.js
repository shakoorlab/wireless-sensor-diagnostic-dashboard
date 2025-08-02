import { Router } from 'express';
import { listSensors } from '../controllers/sensorsList.js';

const router = Router();

router.get('/', listSensors);

// router.get('/:id/measurements', …)

export default router;
