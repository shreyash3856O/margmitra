import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    licensePlate: {
        type: String,
        required: [true, 'Please add a license plate'],
        unique: true,
    },
    type: {
        type: String,
        enum: ['Light Van', 'Heavy Truck', 'Medium Delivery', 'Electric Bike'],
        required: [true, 'Please add a vehicle type'],
    },
    capacity: {
        type: Number, // in kg
        required: [true, 'Please add vehicle capacity'],
    },
    status: {
        type: String,
        enum: ['Active', 'Maintenance', 'Inactive'],
        default: 'Active',
    },
}, {
    timestamps: true,
});

const Vehicle = mongoose.model('Vehicle', vehicleSchema);
export default Vehicle;
