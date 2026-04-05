// Mock API implementation to allow the app to run without a backend
const mockData = {
  users: JSON.parse(localStorage.getItem('margmitra_mock_users') || '[]'),
  bookings: JSON.parse(localStorage.getItem('margmitra_mock_bookings') || '[]'),
  vehicles: JSON.parse(localStorage.getItem('margmitra_mock_vehicles') || '[]'),
};

const save = (key) => localStorage.setItem(`margmitra_mock_${key}`, JSON.stringify(mockData[key]));

const MIRABHAYANDAR_CENTER = [19.2952, 72.8544];

const generateMockVehicles = () => {
    const statuses = ['en_route', 'delivering', 'idle'];
    const types = ['Light Van', 'Heavy Truck', 'Medium Delivery', 'Electric Bike'];
    const plates = ['MH04AB1234', 'MH04CD5678', 'MH02EF9012', 'MH01GH3456', 'MH03IJ7890', 'MH04KL2345'];
    
    return plates.map((plate, i) => {
        const status = statuses[i % 3];
        const baseLat = MIRABHAYANDAR_CENTER[0] + (Math.random() - 0.5) * 0.03;
        const baseLng = MIRABHAYANDAR_CENTER[1] + (Math.random() - 0.5) * 0.03;
        const destLat = baseLat + (Math.random() - 0.5) * 0.02;
        const destLng = baseLng + (Math.random() - 0.5) * 0.02;
        
        return {
            id: `v${i}`,
            licensePlate: plate,
            type: types[i % 4],
            status,
            position: { lat: baseLat, lng: baseLng },
            speed: status === 'idle' ? 0 : Math.floor(Math.random() * 40) + 15,
            destination: status !== 'idle' ? { lat: destLat, lng: destLng } : null,
            route: [],
            eta: status !== 'idle' ? `${Math.floor(Math.random() * 25) + 5} min` : null,
        };
    });
};

const mockAxios = {
  get: async (url, config) => {
    console.log(`Mock GET: ${url}`);
    await new Promise(r => setTimeout(r, 400));
    
    if (url.includes('/api/auth/me')) {
      const user = JSON.parse(localStorage.getItem('margmitra_user'));
      return { data: user };
    }
    if (url.includes('/api/traffic/vehicles/live')) {
      return { data: generateMockVehicles() };
    }
    if (url.includes('/api/vehicles')) {
      return { data: mockData.vehicles };
    }
    if (url.includes('/api/traffic/zones') || url.includes('/api/booking/recommendations')) {
        return { data: [
            { id: 1, name: 'Mira Road East', congestionIndex: 78, congestionLevel: 'high', lat: 19.2813, lng: 72.8557, radius: 1200, activeDeliveries: 12, avgSpeed: 18 },
            { id: 2, name: 'Bhayandar West', congestionIndex: 25, congestionLevel: 'low', lat: 19.3100, lng: 72.8450, radius: 1400, activeDeliveries: 5, avgSpeed: 38 },
            { id: 3, name: 'Mira Road West', congestionIndex: 55, congestionLevel: 'medium', lat: 19.2882, lng: 72.8633, radius: 1000, activeDeliveries: 15, avgSpeed: 22 },
        ]};
    }
    if (url.includes('/api/traffic/analytics')) {
        return { data: {
            deliveryTrend: [
                { day: 'Mon', total: 52, consolidated: 38, onTime: 45 },
                { day: 'Tue', total: 48, consolidated: 34, onTime: 42 },
                { day: 'Wed', total: 61, consolidated: 42, onTime: 55 },
                { day: 'Thu', total: 55, consolidated: 40, onTime: 48 },
                { day: 'Fri', total: 58, consolidated: 43, onTime: 50 },
                { day: 'Sat', total: 42, consolidated: 30, onTime: 38 },
                { day: 'Sun', total: 35, consolidated: 22, onTime: 30 },
            ],
            zoneDistribution: [
                { name: 'Downtown Core', value: 85, color: '#ef4444' },
                { name: 'Commercial Hub', value: 65, color: '#f59e0b' },
                { name: 'Suburban', value: 45, color: '#10b981' },
                { name: 'Industrial', value: 55, color: '#8b5cf6' },
                { name: 'Port Zone', value: 35, color: '#06b6d4' },
            ],
            peakHours: Array.from({ length: 24 }, (_, i) => ({
                hour: `${String(i).padStart(2, '0')}:00`,
                intensity: (i >= 8 && i <= 10) || (i >= 17 && i <= 20) ? 70 + Math.floor(Math.random() * 30) : i >= 11 && i <= 16 ? 30 + Math.floor(Math.random() * 30) : Math.floor(Math.random() * 25),
            })),
            fleetUtilization: { total: 156, active: 102, idle: 38, maintenance: 16 },
            costSavings: { fuelSaved: '12450', timeSaved: '420', tripsOptimized: 580, avgDeliveryTime: '32.5' },
        }};
    }
    if (url.includes('/api/traffic/emissions')) {
        return { data: {
            dailyEmissions: [
                { day: 'Mon', CO2: 420 }, { day: 'Tue', CO2: 380 }, { day: 'Wed', CO2: 450 },
                { day: 'Thu', CO2: 410 }, { day: 'Fri', CO2: 430 }, { day: 'Sat', CO2: 350 }, { day: 'Sun', CO2: 300 }
            ],
            reductionTrend: [
                { month: 'Jan', reduction: 12 }, { month: 'Feb', reduction: 18 }, { month: 'Mar', reduction: 25 }, { month: 'Apr', reduction: 28 }
            ],
            metrics: { totalCO2Reduced: '4.2', fuelSaved: '12,450', treeEquivalent: '192', efficiencyGain: '32%' }
        }};
    }
    if (url.includes('/api/booking/my-bookings')) {
        return { data: mockData.bookings };
    }

    return { data: {} };
  },
  post: async (url, data, config) => {
    console.log(`Mock POST: ${url}`, data);
    await new Promise(r => setTimeout(r, 800));

    if (url.includes('/api/auth/register')) {
      if (mockData.users.find(u => u.email === data.email)) throw { response: { data: { message: 'User exists' } } };
      const newUser = { ...data, id: Date.now() };
      mockData.users.push(newUser);
      save('users');
      localStorage.setItem('margmitra_user', JSON.stringify(newUser));
      return { data: newUser };
    }
    if (url.includes('/api/auth/login')) {
      const user = mockData.users.find(u => u.email === data.email && u.password === data.password);
      if (!user) throw { response: { data: { message: 'Invalid credentials' } } };
      localStorage.setItem('margmitra_user', JSON.stringify(user));
      return { data: user };
    }
    if (url.includes('/api/auth/logout')) {
      localStorage.removeItem('margmitra_user');
      return { data: {} };
    }
    if (url.includes('/api/vehicles')) {
      const newVehicle = { ...data, _id: Date.now(), id: Date.now(), status: 'idle' };
      mockData.vehicles.push(newVehicle);
      save('vehicles');
      return { data: newVehicle };
    }
    if (url.includes('/api/booking')) {
        const newBooking = { ...data, id: Date.now(), status: 'confirmed', createdAt: new Date() };
        mockData.bookings.push(newBooking);
        save('bookings');
        return { data: newBooking };
    }

    return { data: {} };
  },
  create: () => mockAxios,
  defaults: { headers: { common: {} } },
  interceptors: { request: { use: () => {} }, response: { use: () => {} } },
};

export default mockAxios;
