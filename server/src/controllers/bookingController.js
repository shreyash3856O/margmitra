import { db, generateId } from '../config/memoryDB.js';
import { predictCongestion } from '../services/congestionEngine.js';

// @desc    Get recommended slots for a zone and vehicle
// @route   GET /api/booking/recommendations?zone=...&vehicleType=...
// @access  Private
const getRecommendedSlots = async (req, res) => {
    const { zone } = req.query;

    try {
        const now = new Date().getTime();
        let slots = db.slots.filter(s => s.zone === zone && s.startTime > now);

        if (slots.length === 0) {
            // Generate mock slots
            for (let i = 0; i < 24; i += 2) {
                const start = new Date(Date.now() + (i * 60 * 60 * 1000));
                const end = new Date(start.getTime() + (2 * 60 * 60 * 1000));
                
                db.slots.push({
                    _id: generateId(),
                    zone,
                    startTime: start.getTime(),
                    endTime: end.getTime(),
                    congestionLevel: predictCongestion(zone, start),
                    maxCapacity: 50,
                    currentLoad: Math.floor(Math.random() * 20),
                    isAvailable: true
                });
            }
            slots = db.slots.filter(s => s.zone === zone && s.startTime > now);
        }

        res.json(slots.sort((a,b) => a.startTime - b.startTime));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new delivery booking
// @route   POST /api/booking
// @access  Private
const createBooking = async (req, res) => {
    const { vehicleId, slotId, pickupAddress, deliveryAddress, loadWeight } = req.body;

    try {
        const slot = db.slots.find(s => s._id === slotId);
        if (!slot) return res.status(404).json({ message: 'Slot not found' });

        if (slot.currentLoad >= slot.maxCapacity) return res.status(400).json({ message: 'Slot is fully booked' });

        const vehicle = db.vehicles.find(v => v._id === vehicleId);
        if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });

        const booking = {
            _id: generateId(),
            user: req.user._id,
            vehicle: vehicleId,
            slot: slotId,
            pickupAddress,
            deliveryAddress,
            loadWeight,
            status: 'Confirmed',
            createdAt: new Date().getTime()
        };

        db.bookings.push(booking);
        slot.currentLoad += 1;

        // Mock population
        res.status(201).json({
            ...booking,
            vehicle,
            slot
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user bookings
// @route   GET /api/booking/my-bookings
// @access  Private
const getMyBookings = async (req, res) => {
    try {
        const userBookings = db.bookings
            .filter(b => b.user === req.user._id)
            .map(b => ({
                ...b,
                vehicle: db.vehicles.find(v => v._id === b.vehicle),
                slot: db.slots.find(s => s._id === b.slot)
            }))
            .sort((a, b) => b.createdAt - a.createdAt);
        
        res.json(userBookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { getRecommendedSlots, createBooking, getMyBookings };
