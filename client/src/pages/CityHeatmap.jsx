import React, { useEffect, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { MapContainer, TileLayer, Circle, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Clock, Layers, Route, ParkingCircle } from 'lucide-react';
import axios from 'axios';

const MIRABHAYANDAR_CENTER = [19.2952, 72.8544];

const CityHeatmap = () => {
    const [zones, setZones] = useState([]);
    const [selectedZone, setSelectedZone] = useState(null);
    const [timeHour, setTimeHour] = useState(new Date().getHours());
    const [activeLayers, setActiveLayers] = useState(['traffic']);

    useEffect(() => {
        fetchZones();
    }, []);

    const fetchZones = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/traffic/zones');
            setZones(res.data);
        } catch {
            setZones(getMockZones());
        }
    };

    const getCongestionColorForIndex = (index) => {
        if (index > 70) return { fill: '#ef4444', opacity: 0.35 };
        if (index > 40) return { fill: '#f59e0b', opacity: 0.3 };
        return { fill: '#10b981', opacity: 0.25 };
    };

    const toggleLayer = (layer) => {
        setActiveLayers(prev =>
            prev.includes(layer) ? prev.filter(l => l !== layer) : [...prev, layer]
        );
    };

    const layers = [
        { id: 'traffic', label: 'Traffic Density', icon: Layers },
        { id: 'routes', label: 'Delivery Routes', icon: Route },
        { id: 'parking', label: 'Parking Zones', icon: ParkingCircle },
    ];

    // Mock delivery routes (Mira Bhayandar)
    const deliveryRoutes = [
        { id: 1, positions: [[19.274, 72.871], [19.280, 72.865], [19.281, 72.855]], color: '#3b82f6' },
        { id: 2, positions: [[19.281, 72.855], [19.288, 72.863], [19.300, 72.858]], color: '#8b5cf6' },
        { id: 3, positions: [[19.310, 72.845], [19.305, 72.855], [19.288, 72.863]], color: '#10b981' },
    ];

    // Mock parking zones (Mira Bhayandar)
    const parkingZones = [
        { lat: 19.283, lng: 72.856, name: 'Mira Road Stn Parking', spots: 45 },
        { lat: 19.302, lng: 72.850, name: 'Bhayandar East Hub', spots: 30 },
        { lat: 19.288, lng: 72.863, name: 'Golden Nest Market', spots: 60 },
    ];

    return (
        <DashboardLayout title="City Heatmap">
            <div className="heatmap-layout">
                {/* Map */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div className="map-container" style={{ flex: 1, minHeight: '400px' }}>
                        <MapContainer
                            center={MIRABHAYANDAR_CENTER}
                            zoom={13}
                            style={{ height: '100%', width: '100%' }}
                        >
                            <TileLayer
                                attribution='&copy; OpenStreetMap'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />

                            {/* Congestion circles */}
                            {activeLayers.includes('traffic') && zones.map(zone => {
                                const colors = getCongestionColorForIndex(zone.congestionIndex);
                                return (
                                    <Circle
                                        key={zone.id}
                                        center={[zone.lat, zone.lng]}
                                        radius={zone.radius}
                                        pathOptions={{
                                            color: colors.fill,
                                            fillColor: colors.fill,
                                            fillOpacity: colors.opacity,
                                            weight: 2,
                                        }}
                                        eventHandlers={{
                                            click: () => setSelectedZone(zone),
                                        }}
                                    >
                                        <Popup>
                                            <div className="vehicle-popup-title">{zone.name}</div>
                                            <div className="vehicle-popup-meta">
                                                <div>Congestion: {zone.congestionIndex}%</div>
                                                <div>Active Deliveries: {zone.activeDeliveries}</div>
                                                <div>Avg Speed: {zone.avgSpeed} km/h</div>
                                            </div>
                                        </Popup>
                                    </Circle>
                                );
                            })}

                            {/* Delivery Routes */}
                            {activeLayers.includes('routes') && deliveryRoutes.map(route => (
                                <Polyline
                                    key={route.id}
                                    positions={route.positions}
                                    pathOptions={{ color: route.color, weight: 3, opacity: 0.7, dashArray: '6, 6' }}
                                />
                            ))}

                            {/* Parking Zones */}
                            {activeLayers.includes('parking') && parkingZones.map((zone, i) => (
                                <Circle
                                    key={i}
                                    center={[zone.lat, zone.lng]}
                                    radius={300}
                                    pathOptions={{ color: '#8b5cf6', fillColor: '#8b5cf6', fillOpacity: 0.15, weight: 2 }}
                                >
                                    <Popup>
                                        <div className="vehicle-popup-title">{zone.name}</div>
                                        <div className="vehicle-popup-meta">Available spots: {zone.spots}</div>
                                    </Popup>
                                </Circle>
                            ))}
                        </MapContainer>
                    </div>

                    {/* Time Slider */}
                    <div className="time-slider-container">
                        <Clock size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, minWidth: '55px' }}>
                            {String(timeHour).padStart(2, '0')}:00
                        </span>
                        <input
                            type="range"
                            min="0"
                            max="23"
                            value={timeHour}
                            onChange={(e) => setTimeHour(parseInt(e.target.value))}
                        />
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', minWidth: '70px' }}>
                            {timeHour >= 8 && timeHour <= 10 || timeHour >= 17 && timeHour <= 20
                                ? '🔴 Rush Hour'
                                : timeHour >= 11 && timeHour <= 16
                                    ? '🟡 Moderate'
                                    : '🟢 Low Traffic'}
                        </span>
                    </div>
                </div>

                {/* Right Panel */}
                <div className="heatmap-sidebar">
                    {/* Layer Toggles */}
                    <div className="card-static">
                        <h4 style={{ fontSize: '0.85rem', marginBottom: '0.75rem' }}>Map Layers</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {layers.map(layer => (
                                <label
                                    key={layer.id}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '0.75rem',
                                        padding: '0.5rem 0.75rem', borderRadius: '8px', cursor: 'pointer',
                                        background: activeLayers.includes(layer.id) ? 'var(--accent-light)' : 'var(--bg-main)',
                                        transition: 'all 0.15s ease',
                                    }}
                                >
                                    <input
                                        type="checkbox"
                                        checked={activeLayers.includes(layer.id)}
                                        onChange={() => toggleLayer(layer.id)}
                                        style={{ accentColor: 'var(--accent)' }}
                                    />
                                    <layer.icon size={16} style={{ color: activeLayers.includes(layer.id) ? 'var(--accent)' : 'var(--text-muted)' }} />
                                    <span style={{ fontSize: '0.8rem', fontWeight: 500 }}>{layer.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Zone List */}
                    <div className="card-static" style={{ flex: 1 }}>
                        <h4 style={{ fontSize: '0.85rem', marginBottom: '0.75rem' }}>Zone Status</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {zones.map(zone => {
                                const colors = getCongestionColorForIndex(zone.congestionIndex);
                                return (
                                    <div
                                        key={zone.id}
                                        className={`zone-card ${selectedZone?.id === zone.id ? 'selected' : ''}`}
                                        onClick={() => setSelectedZone(zone)}
                                        style={{ padding: '0.75rem 1rem' }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                                            <span style={{ fontWeight: 600, fontSize: '0.8rem' }}>{zone.name}</span>
                                            <span className="badge" style={{ background: colors.fill + '20', color: colors.fill }}>
                                                {zone.congestionLevel}
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                                            <span>{zone.activeDeliveries} deliveries</span>
                                            <span>{zone.avgSpeed} km/h</span>
                                        </div>
                                        <div className="capacity-bar">
                                            <div
                                                className="capacity-bar-fill"
                                                style={{ width: `${zone.congestionIndex}%`, background: colors.fill }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

function getMockZones() {
    return [
        { id: 'miraroad', name: 'Mira Road', lat: 19.2813, lng: 72.8557, radius: 1200, congestionIndex: 78, congestionLevel: 'high', activeDeliveries: 12, avgSpeed: 18, vehicleCount: 45 },
        { id: 'bhayandare', name: 'Bhayandar East', lat: 19.3000, lng: 72.8580, radius: 1500, congestionIndex: 55, congestionLevel: 'medium', activeDeliveries: 8, avgSpeed: 25, vehicleCount: 32 },
        { id: 'bhayandarw', name: 'Bhayandar West', lat: 19.3100, lng: 72.8450, radius: 1400, congestionIndex: 25, congestionLevel: 'low', activeDeliveries: 5, avgSpeed: 38, vehicleCount: 15 },
        { id: 'goldennest', name: 'Golden Nest', lat: 19.2882, lng: 72.8633, radius: 1000, congestionIndex: 62, congestionLevel: 'medium', activeDeliveries: 15, avgSpeed: 22, vehicleCount: 28 },
        { id: 'kashimira', name: 'Kashimira', lat: 19.2741, lng: 72.8715, radius: 1300, congestionIndex: 82, congestionLevel: 'high', activeDeliveries: 20, avgSpeed: 12, vehicleCount: 50 },
    ];
}

export default CityHeatmap;
