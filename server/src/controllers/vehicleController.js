import { db, generateId } from '../config/memoryDB.js';

// @desc    Register a new vehicle
// @route   POST /api/vehicles
// @access  Private (Logistics/Admin)
const registerVehicle = async (req, res) => {
    const { licensePlate, type, capacity } = req.body;

    try {
        const vehicleExists = db.vehicles.find(v => v.licensePlate === licensePlate);
        if (vehicleExists) {
            return res.status(400).json({ message: 'Vehicle already registered' });
        }

        const vehicle = {
            _id: generateId(),
            owner: req.user._id,
            licensePlate,
            type,
            capacity,
            status: 'Active',
            createdAt: new Date().getTime()
        };

        db.vehicles.push(vehicle);
        res.status(201).json(vehicle);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all vehicles for a user
// @route   GET /api/vehicles
// @access  Private
const getMyVehicles = async (req, res) => {
    try {
        const vehicles = db.vehicles.filter(v => v.owner === req.user._id);
        res.json(vehicles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all vehicles (Admin only)
// @route   GET /api/vehicles/all
// @access  Private/Admin
const getAllVehicles = async (req, res) => {
    try {
        res.json(db.vehicles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { registerVehicle, getMyVehicles, getAllVehicles };
