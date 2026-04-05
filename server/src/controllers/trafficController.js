import { db, generateId } from '../config/memoryDB.js';

// Zones with Mira Bhayandar coordinates
const ZONES = [
    { id: 'miraroad', name: 'Mira Road', lat: 19.2813, lng: 72.8557, radius: 1200, color: '#f59e0b' },
    { id: 'bhayandare', name: 'Bhayandar East', lat: 19.3000, lng: 72.8580, radius: 1500, color: '#8b5cf6' },
    { id: 'bhayandarw', name: 'Bhayandar West', lat: 19.3100, lng: 72.8450, radius: 1400, color: '#10b981' },
    { id: 'goldennest', name: 'Golden Nest', lat: 19.2882, lng: 72.8633, radius: 1000, color: '#ef4444' },
    { id: 'kashimira', name: 'Kashimira', lat: 19.2741, lng: 72.8715, radius: 1300, color: '#06b6d4' },
];


// Simulate vehicle positions near Mumbai
const generateVehiclePositions = () => {
    const statuses = ['en_route', 'delivering', 'idle'];
    const vehicleTypes = ['Light Van', 'Heavy Truck', 'Medium Delivery', 'Electric Bike'];
    const names = ['MH04AB1234', 'MH04CD5678', 'MH02EF9012', 'MH01GH3456', 'MH03IJ7890', 'MH04KL2345', 'MH02MN6789', 'MH01OP1234'];
    
    return names.map((plate, i) => {
        const zone = ZONES[i % ZONES.length];
        const status = statuses[i % statuses.length];
        const jitterLat = (Math.random() - 0.5) * 0.02;
        const jitterLng = (Math.random() - 0.5) * 0.02;
        
        return {
            id: `veh_${i}`,
            licensePlate: plate,
            type: vehicleTypes[i % vehicleTypes.length],
            status,
            position: {
                lat: zone.lat + jitterLat,
                lng: zone.lng + jitterLng,
            },
            speed: status === 'idle' ? 0 : Math.floor(Math.random() * 40) + 15,
            heading: Math.floor(Math.random() * 360),
            destination: status !== 'idle' ? {
                lat: zone.lat + (Math.random() - 0.5) * 0.025,
                lng: zone.lng + (Math.random() - 0.5) * 0.025,
            } : null,
            route: status !== 'idle' ? generateRoute(
                zone.lat + jitterLat,
                zone.lng + jitterLng,
                zone.lat + (Math.random() - 0.5) * 0.025,
                zone.lng + (Math.random() - 0.5) * 0.025,
                5 + Math.floor(Math.random() * 5)
            ) : [],

            eta: status !== 'idle' ? `${Math.floor(Math.random() * 30) + 5} min` : null,
            zone: zone.id,
        };
    });
};

// Generate a realistic-looking route between two points
function generateRoute(startLat, startLng, endLat, endLng, numPoints) {
    const points = [];
    for (let i = 0; i <= numPoints; i++) {
        const t = i / numPoints;
        const lat = startLat + (endLat - startLat) * t + (Math.random() - 0.5) * 0.008;
        const lng = startLng + (endLng - startLng) * t + (Math.random() - 0.5) * 0.008;
        points.push([lat, lng]);
    }
    return points;
}

// @desc    Get zone congestion data for heatmap
// @route   GET /api/traffic/zones
const getZones = async (req, res) => {
    try {
        const hour = new Date().getHours();
        const zonesWithData = ZONES.map(zone => {
            let congestion;
            if ((hour >= 8 && hour <= 10) || (hour >= 17 && hour <= 20)) {
                congestion = 60 + Math.floor(Math.random() * 40);
            } else if (hour > 10 && hour < 17) {
                congestion = 30 + Math.floor(Math.random() * 30);
            } else {
                congestion = Math.floor(Math.random() * 30);
            }

            return {
                ...zone,
                congestionIndex: congestion,
                congestionLevel: congestion > 70 ? 'high' : congestion > 40 ? 'medium' : 'low',
                activeDeliveries: Math.floor(Math.random() * 20) + 2,
                avgSpeed: Math.floor(Math.random() * 30) + 10,
                vehicleCount: Math.floor(Math.random() * 50) + 5,
            };
        });

        res.json(zonesWithData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get live vehicle positions
// @route   GET /api/traffic/vehicles/live
const getLiveVehicles = async (req, res) => {
    try {
        const vehicles = generateVehiclePositions();
        res.json(vehicles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get analytics data
// @route   GET /api/traffic/analytics
const getAnalytics = async (req, res) => {
    try {
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const hours = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`);
        
        const deliveryTrend = days.map(day => ({
            day,
            total: Math.floor(Math.random() * 40) + 30,
            consolidated: Math.floor(Math.random() * 25) + 15,
            onTime: Math.floor(Math.random() * 30) + 20,
        }));

        const zoneDistribution = ZONES.map(z => ({
            name: z.name,
            value: Math.floor(Math.random() * 100) + 20,
            color: z.color,
        }));

        const peakHours = hours.map(hour => {
            const h = parseInt(hour);
            let intensity;
            if ((h >= 8 && h <= 10) || (h >= 17 && h <= 20)) intensity = 70 + Math.floor(Math.random() * 30);
            else if (h >= 11 && h <= 16) intensity = 30 + Math.floor(Math.random() * 30);
            else intensity = Math.floor(Math.random() * 25);
            return { hour, intensity };
        });

        const fleetUtilization = {
            total: 156,
            active: 89 + Math.floor(Math.random() * 30),
            idle: 20 + Math.floor(Math.random() * 15),
            maintenance: 5 + Math.floor(Math.random() * 5),
        };

        const costSavings = {
            fuelSaved: (Math.random() * 5000 + 8000).toFixed(0),
            timeSaved: (Math.random() * 200 + 300).toFixed(0),
            tripsOptimized: Math.floor(Math.random() * 200) + 400,
            avgDeliveryTime: (Math.random() * 10 + 25).toFixed(1),
        };

        res.json({ deliveryTrend, zoneDistribution, peakHours, fleetUtilization, costSavings });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get emission metrics
// @route   GET /api/traffic/emissions
const getEmissions = async (req, res) => {
    try {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        const monthlyTrends = months.map(month => ({
            month,
            before: Math.floor(Math.random() * 200) + 300,
            after: Math.floor(Math.random() * 150) + 100,
        }));

        const summary = {
            totalCO2Saved: (Math.random() * 2000 + 3000).toFixed(0),
            reductionPercent: (Math.random() * 10 + 25).toFixed(1),
            greenFleetPercent: (Math.random() * 20 + 30).toFixed(1),
            carbonCredits: Math.floor(Math.random() * 50) + 120,
            treesEquivalent: Math.floor(Math.random() * 100) + 200,
        };

        const vehicleTypeEmissions = [
            { type: 'Electric Bike', emission: 0, count: 15 },
            { type: 'Light Van', emission: 45, count: 50 },
            { type: 'Medium Delivery', emission: 85, count: 55 },
            { type: 'Heavy Truck', emission: 180, count: 36 },
        ];

        const weeklyData = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => ({
            day,
            co2Before: Math.floor(Math.random() * 100) + 350,
            co2After: Math.floor(Math.random() * 80) + 150,
        }));

        res.json({ monthlyTrends, summary, vehicleTypeEmissions, weeklyData });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { getZones, getLiveVehicles, getAnalytics, getEmissions };
