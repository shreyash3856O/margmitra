import mongoose from 'mongoose';

const deliverySlotSchema = new mongoose.Schema({
    zone: {
        type: String,
        required: [true, 'Please add a zone'],
    },
    startTime: {
        type: Date,
        required: [true, 'Please add a start time'],
    },
    endTime: {
        type: Date,
        required: [true, 'Please add an end time'],
    },
    maxCapacity: {
        type: Number,
        default: 50, // max number of deliveries allowed in this slot
    },
    currentLoad: {
        type: Number,
        default: 0,
    },
    congestionLevel: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'low',
    },
    isAvailable: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});

deliverySlotSchema.index({ zone: 1, startTime: 1 });

const DeliverySlot = mongoose.model('DeliverySlot', deliverySlotSchema);
export default DeliverySlot;
