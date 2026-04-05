import express from 'express';
import { registerVehicle, getMyVehicles, getAllVehicles } from '../controllers/vehicleController.js';
import { protect, logistics, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .post(protect, logistics, registerVehicle)
    .get(protect, getMyVehicles);

router.get('/all', protect, admin, getAllVehicles);

export default router;
