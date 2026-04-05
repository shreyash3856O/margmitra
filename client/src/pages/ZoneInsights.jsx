import React, { useEffect, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { MapContainer, TileLayer, Circle, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {
    LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import { MapPin, Truck, Clock, Gauge, TrendingUp } from 'lucide-react';
import axios from 'axios';

const ZONES = [
    { id: 'downtown', name: 'Downtown Core', lat: 18.9388, lng: 72.8354 },
    { id: 'commercial', name: 'Commercial Hub', lat: 19.0760, lng: 72.8777 },
    { id: 'residential', name: 'Suburban Residential', lat: 19.1136, lng: 72.8697 },
    { id: 'industrial', name: 'Industrial Area', lat: 19.0330, lng: 72.8560 },
    { id: 'portzone', name: 'Port Zone', lat: 18.9540, lng: 72.8440 },
];

const ZoneInsights = () => {
    const [selectedZone, setSelectedZone] = useState(ZONES[0]);
    const [zoneData, setZoneData] = useState([]);

    useEffect(() => {
        const fetchZones = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/traffic/zones');
                setZoneData(res.data);
            } catch {
                setZoneData(getMockZoneData());
            }
        };
        fetchZones();
    }, []);

    const currentZoneData = zoneData.find(z => z.id === selectedZone.id);

    // Mock timeline data for selected zone
    const congestionTimeline = Array.from({ length: 24 }, (_, i) => {
        let value;
        if ((i >= 8 && i <= 10) || (i >= 17 && i <= 20)) value = 60 + Math.floor(Math.random() * 30);
        else if (i >= 11 && i <= 16) value = 30 + Math.floor(Math.random() * 20);
        else value = 5 + Math.floor(Math.random() * 20);
        return { hour: `${String(i).padStart(2, '0')}:00`, congestion: value };
    });

    // Recommended delivery windows
    const recommendedWindows = [
        { time: '06:00 - 08:00', level: 'low', label: 'Optimal', color: '#10b981' },
        { time: '10:30 - 12:00', level: 'medium', label: 'Moderate', color: '#f59e0b' },
        { time: '14:00 - 16:30', level: 'low', label: 'Optimal', color: '#10b981' },
        { time: '21:00 - 23:00', level: 'low', label: 'Optimal', color: '#10b981' },
    ];

    return (
        <DashboardLayout title="Zone Insights">
            <div className="zone-grid">
                {/* Zone List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div className="card-static">
                        <h4 style={{ fontSize: '0.85rem', marginBottom: '0.75rem' }}>Select Zone</h4>
                        <div className="zone-list">
                            {ZONES.map(zone => {
                                const data = zoneData.find(z => z.id === zone.id);
                                const isSelected = selectedZone.id === zone.id;
                                return (
                                    <div
                                        key={zone.id}
                                        className={`zone-card ${isSelected ? 'selected' : ''}`}
                                        onClick={() => setSelectedZone(zone)}
                                        style={{ padding: '0.75rem 1rem' }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                            <MapPin size={14} style={{ color: isSelected ? 'var(--accent)' : 'var(--text-muted)' }} />
                                            <span style={{ fontWeight: 600, fontSize: '0.8rem' }}>{zone.name}</span>
                                        </div>
                                        {data && (
                                            <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.7rem', color: 'var(--text-muted)', paddingLeft: '22px' }}>
                                                <span>{data.activeDeliveries} active</span>
                                                <span>{data.avgSpeed} km/h</span>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Zone Details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {/* Zone Header Stats */}
                    {currentZoneData && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
                            <div className="stat-card" style={{ padding: '1rem' }}>
                                <div className="stat-card-icon" style={{ background: 'var(--accent-light)', color: 'var(--accent)', width: '36px', height: '36px' }}>
                                    <Gauge size={18} />
                                </div>
                                <div className="stat-card-info">
                                    <div className="value" style={{ fontSize: '1.25rem' }}>{currentZoneData.congestionIndex}%</div>
                                    <div className="label">Congestion</div>
                                </div>
                            </div>
                            <div className="stat-card" style={{ padding: '1rem' }}>
                                <div className="stat-card-icon" style={{ background: 'var(--success-light)', color: 'var(--success)', width: '36px', height: '36px' }}>
                                    <Truck size={18} />
                                </div>
                                <div className="stat-card-info">
                                    <div className="value" style={{ fontSize: '1.25rem' }}>{currentZoneData.activeDeliveries}</div>
                                    <div className="label">Active</div>
                                </div>
                            </div>
                            <div className="stat-card" style={{ padding: '1rem' }}>
                                <div className="stat-card-icon" style={{ background: 'var(--warning-light)', color: 'var(--warning)', width: '36px', height: '36px' }}>
                                    <TrendingUp size={18} />
                                </div>
                                <div className="stat-card-info">
                                    <div className="value" style={{ fontSize: '1.25rem' }}>{currentZoneData.avgSpeed}</div>
                                    <div className="label">Avg km/h</div>
                                </div>
                            </div>
                            <div className="stat-card" style={{ padding: '1rem' }}>
                                <div className="stat-card-icon" style={{ background: 'rgba(139,92,246,0.1)', color: '#8b5cf6', width: '36px', height: '36px' }}>
                                    <Clock size={18} />
                                </div>
                                <div className="stat-card-info">
                                    <div className="value" style={{ fontSize: '1.25rem' }}>{currentZoneData.vehicleCount}</div>
                                    <div className="label">Vehicles</div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="zone-detail-grid">
                        {/* Congestion Timeline */}
                        <div className="chart-card">
                            <h3 style={{ fontSize: '0.9rem' }}>Congestion Timeline</h3>
                            <div className="chart-subtitle">{selectedZone.name} — 24h forecast</div>
                            <ResponsiveContainer width="100%" height={200}>
                                <LineChart data={congestionTimeline}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                                    <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 10 }} interval={3} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 10 }} domain={[0, 100]} />
                                    <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)', fontSize: '0.8rem' }} />
                                    <Line type="monotone" dataKey="congestion" stroke="#ef4444" strokeWidth={2} dot={false} name="Congestion %" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Recommended Windows */}
                        <div className="card-static">
                            <h3 style={{ fontSize: '0.9rem', marginBottom: '0.25rem' }}>Recommended Windows</h3>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Best delivery times for {selectedZone.name}</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {recommendedWindows.map((w, i) => (
                                    <div key={i} style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                        padding: '0.75rem 1rem', background: 'var(--bg-main)', borderRadius: '8px',
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <Clock size={14} style={{ color: w.color }} />
                                            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{w.time}</span>
                                        </div>
                                        <span className="badge" style={{ background: w.color + '20', color: w.color }}>{w.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Zone Map */}
                    <div className="map-container" style={{ height: '250px' }}>
                        <MapContainer
                            center={[selectedZone.lat, selectedZone.lng]}
                            zoom={13}
                            key={selectedZone.id}
                            style={{ height: '100%', width: '100%' }}
                        >
                            <TileLayer
                                attribution='&copy; OpenStreetMap'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <Circle
                                center={[selectedZone.lat, selectedZone.lng]}
                                radius={2000}
                                pathOptions={{
                                    color: currentZoneData?.congestionIndex > 70 ? '#ef4444' : currentZoneData?.congestionIndex > 40 ? '#f59e0b' : '#10b981',
                                    fillOpacity: 0.2,
                                    weight: 2,
                                }}
                            >
                                <Popup>{selectedZone.name}</Popup>
                            </Circle>
                        </MapContainer>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

function getMockZoneData() {
    return [
        { id: 'downtown', congestionIndex: 78, congestionLevel: 'high', activeDeliveries: 12, avgSpeed: 18, vehicleCount: 45 },
        { id: 'commercial', congestionIndex: 55, congestionLevel: 'medium', activeDeliveries: 8, avgSpeed: 25, vehicleCount: 32 },
        { id: 'residential', congestionIndex: 25, congestionLevel: 'low', activeDeliveries: 5, avgSpeed: 38, vehicleCount: 15 },
        { id: 'industrial', congestionIndex: 62, congestionLevel: 'medium', activeDeliveries: 15, avgSpeed: 22, vehicleCount: 28 },
        { id: 'portzone', congestionIndex: 82, congestionLevel: 'high', activeDeliveries: 20, avgSpeed: 12, vehicleCount: 50 },
    ];
}

export default ZoneInsights;
