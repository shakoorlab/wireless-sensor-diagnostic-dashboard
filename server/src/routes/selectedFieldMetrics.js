import express from 'express';
import { getHourlyStatus } from '../controllers/selectedFieldMetrics.js';

const router = express.Router();

// router.get('/reporting-summary', getReportingSummary); // for pie chart
// router.get('/inactive-sensors', getInactiveSensors); // for sensor activity list
router.get('/hourly-status', getHourlyStatus); //for hourly status table

export default router;
