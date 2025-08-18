import express from 'express';
import { getHourlyStatus } from '../controllers/selectedFieldMetrics.js';
import { getWeeklyStatus } from '../controllers/selectedFieldMetrics.js';
import asyncHandler from '../middlewares/asyncHandler.js';

const router = express.Router();

// router.get('/reporting-summary', getReportingSummary); // for pie chart
// router.get('/inactive-sensors', getInactiveSensors); // for sensor activity list
router.get('/hourly-status', asyncHandler(getHourlyStatus)); //for daily status table
router.get('/weekly-status', getWeeklyStatus); // for weekly status table

export default router;
