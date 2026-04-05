import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    vehicle: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehicle',
        required: true,
    },
    slot: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DeliverySlot',
        required: true,
    },
    pickupAddress: {
        type: String,
        required: [true, 'Please add a pickup address'],
    },
    deliveryAddress: {
        type: String,
        required: [true, 'Please add a delivery address'],
    },
    loadWeight: {
        type: Number, // in kg
        required: [true, 'Please add load weight'],
    },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'],
        default: 'Pending',
    },
    bookingDate: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
