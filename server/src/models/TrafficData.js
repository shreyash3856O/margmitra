import mongoose from 'mongoose';

const trafficDataSchema = new mongoose.Schema({
    zone: {
        type: String,
        required: true,
    },
    congestionIndex: {
        type: Number, // 0 - 100
        required: true,
    },
    averageSpeed: {
        type: Number, // in km/h
        required: true,
    },
    vehicleCount: {
        type: Number,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});

trafficDataSchema.index({ zone: 1, timestamp: -1 });

const TrafficData = mongoose.model('TrafficData', trafficDataSchema);
export default TrafficData;
