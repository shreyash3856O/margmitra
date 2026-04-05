import express from 'express';
import { getZones, getLiveVehicles, getAnalytics, getEmissions } from '../controllers/trafficController.js';

const router = express.Router();

router.get('/zones', getZones);
router.get('/vehicles/live', getLiveVehicles);
router.get('/analytics', getAnalytics);
router.get('/emissions', getEmissions);

export default router;
