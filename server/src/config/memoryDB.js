export const db = {
    users: [],
    vehicles: [],
    slots: [],
    bookings: [],
    trafficData: []
};

// Generates a simple random ID string
export const generateId = () => Math.random().toString(36).substr(2, 9);
