import express from 'express';
import { getRecommendedSlots, createBooking, getMyBookings } from '../controllers/bookingController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(protect, getRecommendedSlots)
    .post(protect, createBooking);

router.get('/my-bookings', protect, getMyBookings);

export default router;
