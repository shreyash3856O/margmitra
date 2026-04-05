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
            { id: 1, name: 'Mira Road East', congestion: 0.8, status: 'congested', time: '09:00 AM' },
            { id: 2, name: 'Bhayandar West', congestion: 0.3, status: 'optimal', time: '11:00 AM' },
            { id: 3, name: 'Mira Road West', congestion: 0.5, status: 'available', time: '02:00 PM' },
        ]};
    }
    if (url.includes('/api/traffic/analytics')) {
        return { data: { trips: 156, efficiency: 84 } };
    }
    if (url.includes('/api/traffic/emissions')) {
        return { data: { reduction: '28%' } };
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
