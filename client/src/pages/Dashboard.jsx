import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';
import { MapContainer, TileLayer, Polyline, Marker, Popup, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { Truck, TrendingUp, TrendingDown, Wind, Gauge } from 'lucide-react';
import axios from 'axios';

// Fix default leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const MUMBAI_CENTER = [19.0760, 72.8777];

const statusColors = {
    en_route: '#3b82f6',
    delivering: '#10b981',
    idle: '#94a3b8',
};

const statusLabels = {
    en_route: 'En Route',
    delivering: 'Delivering',
    idle: 'Idle',
};

const createVehicleIcon = (status) => {
    const color = statusColors[status] || '#94a3b8';
    return L.divIcon({
        className: 'vehicle-marker',
        html: `<div style="
            width: 28px; height: 28px; border-radius: 50%;
            background: ${color}; border: 3px solid white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            display: flex; align-items: center; justify-content: center;
        ">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <rect x="1" y="3" width="15" height="13" rx="2" ry="2"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
            </svg>
        </div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
    });
};

const Dashboard = () => {
    const { user } = useAuth();
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/traffic/vehicles/live');
                setVehicles(res.data);
            } catch (err) {
                // Use mock data if server not available
                setVehicles(generateMockVehicles());
            } finally {
                setLoading(false);
            }
        };
        fetchData();
        const interval = setInterval(fetchData, 10000);
        return () => clearInterval(interval);
    }, []);

    const stats = useMemo(() => {
        const enRoute = vehicles.filter(v => v.status === 'en_route').length;
        const delivering = vehicles.filter(v => v.status === 'delivering').length;
        const idle = vehicles.filter(v => v.status === 'idle').length;
        return { total: vehicles.length, enRoute, delivering, idle };
    }, [vehicles]);

    // Mock chart data
    const tripData = [
        { day: 'Mon', total: 52, consolidated: 38 },
        { day: 'Tue', total: 48, consolidated: 34 },
        { day: 'Wed', total: 61, consolidated: 42 },
        { day: 'Thu', total: 55, consolidated: 40 },
        { day: 'Fri', total: 58, consolidated: 43 },
        { day: 'Sat', total: 42, consolidated: 30 },
        { day: 'Sun', total: 35, consolidated: 22 },
    ];

    const emissionData = [
        { day: 'Mon', before: 420, after: 280 },
        { day: 'Tue', before: 380, after: 260 },
        { day: 'Wed', before: 450, after: 300 },
        { day: 'Thu', before: 410, after: 275 },
        { day: 'Fri', before: 430, after: 290 },
        { day: 'Sat', before: 350, after: 220 },
        { day: 'Sun', before: 300, after: 180 },
    ];

    return (
        <DashboardLayout title="Authority Insights">
            {/* Stat Cards */}
            <div className="stat-cards-grid">
                <div className="stat-card animate-count">
                    <div className="stat-card-icon" style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
                        <Truck size={22} />
                    </div>
                    <div className="stat-card-info">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span className="value">156</span>
                            <span className="stat-card-trend up"><TrendingUp size={12} /> +12</span>
                        </div>
                        <div className="label">Active Vehicles</div>
                    </div>
                </div>

                <div className="stat-card animate-count" style={{ animationDelay: '0.1s' }}>
                    <div className="stat-card-icon" style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' }}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 3h5v5"/><path d="M4 20L21 3"/><path d="M21 16v5h-5"/><path d="M15 15l6 6"/><path d="M4 4l5 5"/></svg>
                    </div>
                    <div className="stat-card-info">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span className="value">43%</span>
                            <span className="stat-card-trend up"><TrendingUp size={12} /> +8%</span>
                        </div>
                        <div className="label">Trips Consolidated</div>
                    </div>
                </div>

                <div className="stat-card animate-count" style={{ animationDelay: '0.2s' }}>
                    <div className="stat-card-icon" style={{ background: 'var(--success-light)', color: 'var(--success)' }}>
                        <Wind size={22} />
                    </div>
                    <div className="stat-card-info">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span className="value">28%</span>
                            <span className="stat-card-trend up"><TrendingUp size={12} /> +4%</span>
                        </div>
                        <div className="label">Emission Reduction</div>
                    </div>
                </div>

                <div className="stat-card animate-count" style={{ animationDelay: '0.3s' }}>
                    <div className="stat-card-icon" style={{ background: 'var(--danger-light)', color: 'var(--danger)' }}>
                        <Gauge size={22} />
                    </div>
                    <div className="stat-card-info">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span className="value">Low</span>
                            <span className="stat-card-trend down"><TrendingDown size={12} /> -15%</span>
                        </div>
                        <div className="label">Congestion Index</div>
                    </div>
                </div>
            </div>

            {/* Map Section */}
            <div className="map-container" style={{ height: '420px', marginBottom: '1.5rem' }}>
                <MapContainer
                    center={MUMBAI_CENTER}
                    zoom={12}
                    style={{ height: '100%', width: '100%' }}
                    zoomControl={true}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {/* Vehicle markers and routes */}
                    {vehicles.map(vehicle => (
                        <React.Fragment key={vehicle.id}>
                            {/* Route polyline */}
                            {vehicle.route && vehicle.route.length > 0 && (
                                <Polyline
                                    positions={vehicle.route}
                                    pathOptions={{
                                        color: statusColors[vehicle.status],
                                        weight: 3,
                                        opacity: 0.6,
                                        dashArray: vehicle.status === 'en_route' ? '8, 8' : null,
                                    }}
                                />
                            )}

                            {/* Vehicle marker */}
                            <Marker
                                position={[vehicle.position.lat, vehicle.position.lng]}
                                icon={createVehicleIcon(vehicle.status)}
                            >
                                <Popup>
                                    <div className="vehicle-popup-title">{vehicle.licensePlate}</div>
                                    <div className="vehicle-popup-status" style={{
                                        background: statusColors[vehicle.status] + '20',
                                        color: statusColors[vehicle.status],
                                    }}>
                                        ● {statusLabels[vehicle.status]}
                                    </div>
                                    <div className="vehicle-popup-meta">
                                        <div>{vehicle.type}</div>
                                        {vehicle.speed > 0 && <div>Speed: {vehicle.speed} km/h</div>}
                                        {vehicle.eta && <div>ETA: {vehicle.eta}</div>}
                                    </div>
                                </Popup>
                            </Marker>

                            {/* Destination marker */}
                            {vehicle.destination && (
                                <CircleMarker
                                    center={[vehicle.destination.lat, vehicle.destination.lng]}
                                    pathOptions={{
                                        color: statusColors[vehicle.status],
                                        fillColor: statusColors[vehicle.status],
                                        fillOpacity: 0.3,
                                        weight: 2,
                                    }}
                                    radius={6}
                                />
                            )}
                        </React.Fragment>
                    ))}
                </MapContainer>

                {/* Map Overlays */}
                <div className="map-overlay map-overlay-top-right">
                    <div className="map-vehicle-count">
                        <div className="count-label">Active Vehicles</div>
                        <div className="count-value">{stats.total}</div>
                    </div>
                </div>

                <div className="map-overlay map-overlay-bottom-left">
                    <div className="map-legend">
                        <h4>Live Tracking</h4>
                        <div className="map-legend-item">
                            <div className="map-legend-dot" style={{ background: statusColors.en_route }} />
                            <span>En Route ({stats.enRoute})</span>
                        </div>
                        <div className="map-legend-item">
                            <div className="map-legend-dot" style={{ background: statusColors.delivering }} />
                            <span>Delivering ({stats.delivering})</span>
                        </div>
                        <div className="map-legend-item">
                            <div className="map-legend-dot" style={{ background: statusColors.idle }} />
                            <span>Idle ({stats.idle})</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Row */}
            <div className="charts-grid">
                <div className="chart-card">
                    <h3>Trip Consolidation</h3>
                    <div className="chart-subtitle">Total vs consolidated trips this week</div>
                    <ResponsiveContainer width="100%" height={220}>
                        <LineChart data={tripData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                            <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)', fontSize: '0.8rem' }} />
                            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '0.75rem' }} />
                            <Line type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 3 }} name="Total Trips" />
                            <Line type="monotone" dataKey="consolidated" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3 }} name="Consolidated" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className="chart-card">
                    <h3>Emission Reduction</h3>
                    <div className="chart-subtitle">CO₂ before vs after consolidation (kg)</div>
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={emissionData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                            <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)', fontSize: '0.8rem' }} />
                            <Legend iconType="square" iconSize={8} wrapperStyle={{ fontSize: '0.75rem' }} />
                            <Bar dataKey="before" fill="#94a3b8" radius={[4, 4, 0, 0]} name="Before" />
                            <Bar dataKey="after" fill="#10b981" radius={[4, 4, 0, 0]} name="After" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </DashboardLayout>
    );
};

// Fallback mock data when server is not available
function generateMockVehicles() {
    const statuses = ['en_route', 'delivering', 'idle'];
    const types = ['Light Van', 'Heavy Truck', 'Medium Delivery', 'Electric Bike'];
    const plates = ['MH04AB1234', 'MH04CD5678', 'MH02EF9012', 'MH01GH3456', 'MH03IJ7890', 'MH04KL2345'];
    
    return plates.map((plate, i) => {
        const status = statuses[i % 3];
        const baseLat = 19.0760 + (Math.random() - 0.5) * 0.08;
        const baseLng = 72.8777 + (Math.random() - 0.5) * 0.08;
        const destLat = baseLat + (Math.random() - 0.5) * 0.05;
        const destLng = baseLng + (Math.random() - 0.5) * 0.05;
        
        const route = status !== 'idle' ? Array.from({ length: 6 }, (_, j) => {
            const t = j / 5;
            return [
                baseLat + (destLat - baseLat) * t + (Math.random() - 0.5) * 0.005,
                baseLng + (destLng - baseLng) * t + (Math.random() - 0.5) * 0.005,
            ];
        }) : [];

        return {
            id: `v${i}`,
            licensePlate: plate,
            type: types[i % 4],
            status,
            position: { lat: baseLat, lng: baseLng },
            speed: status === 'idle' ? 0 : Math.floor(Math.random() * 40) + 15,
            destination: status !== 'idle' ? { lat: destLat, lng: destLng } : null,
            route,
            eta: status !== 'idle' ? `${Math.floor(Math.random() * 25) + 5} min` : null,
        };
    });
}

export default Dashboard;
