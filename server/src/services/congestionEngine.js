import { db } from '../config/memoryDB.js';

/**
 * Mock Conestion Engine
 * Predicts congestion level based on time of day and zone.
 */
const predictCongestion = (zone, time) => {
    const hour = new Date(time).getHours();
    
    // Rush hours: 8-10 AM and 5-8 PM
    if ((hour >= 8 && hour <= 10) || (hour >= 17 && hour <= 20)) {
        return 'high';
    }
    
    // Moderate hours: 10 AM - 5 PM
    if (hour > 10 && hour < 17) {
        return 'medium';
    }
    
    // Low congestion: Night and early morning
    return 'low';
};

/**
 * Simulates real-time traffic data for a zone
 */
const getRealTimeTraffic = async (zone) => {
    return {
        zone,
        congestionIndex: Math.floor(Math.random() * 100),
        averageSpeed: Math.floor(Math.random() * 40) + 10,
        vehicleCount: Math.floor(Math.random() * 1000),
        timestamp: new Date()
    };
};

export { predictCongestion, getRealTimeTraffic };
