import React, { useEffect, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import {
    BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
    XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from 'recharts';
import { DollarSign, Clock, Truck, Zap } from 'lucide-react';
import axios from 'axios';

const Analytics = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await axios.get('/api/traffic/analytics');
                setData(res.data);
            } catch {
                setData(getMockAnalytics());
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    if (loading || !data) {
        return (
            <DashboardLayout title="Analytics">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50vh' }}>
                    <div className="loading-spinner" />
                </div>
            </DashboardLayout>
        );
    }

    const { deliveryTrend, zoneDistribution, peakHours, fleetUtilization, costSavings } = data;

    return (
        <DashboardLayout title="Analytics">
            {/* Summary Cards */}
            <div className="analytics-summary">
                <div className="analytics-card animate-count">
                    <div className="a-icon" style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
                        <DollarSign size={20} />
                    </div>
                    <div className="a-value">₹{Number(costSavings.fuelSaved).toLocaleString()}</div>
                    <div className="a-label">Fuel Cost Saved</div>
                </div>
                <div className="analytics-card animate-count" style={{ animationDelay: '0.1s' }}>
                    <div className="a-icon" style={{ background: 'var(--success-light)', color: 'var(--success)' }}>
                        <Clock size={20} />
                    </div>
                    <div className="a-value">{costSavings.timeSaved}h</div>
                    <div className="a-label">Time Saved</div>
                </div>
                <div className="analytics-card animate-count" style={{ animationDelay: '0.2s' }}>
                    <div className="a-icon" style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' }}>
                        <Truck size={20} />
                    </div>
                    <div className="a-value">{costSavings.tripsOptimized}</div>
                    <div className="a-label">Trips Optimized</div>
                </div>
                <div className="analytics-card animate-count" style={{ animationDelay: '0.3s' }}>
                    <div className="a-icon" style={{ background: 'var(--warning-light)', color: 'var(--warning)' }}>
                        <Zap size={20} />
                    </div>
                    <div className="a-value">{costSavings.avgDeliveryTime}m</div>
                    <div className="a-label">Avg Delivery Time</div>
                </div>
            </div>

            <div className="charts-grid" style={{ marginBottom: '1.5rem' }}>
                {/* Delivery Performance */}
                <div className="chart-card">
                    <h3>Delivery Performance</h3>
                    <div className="chart-subtitle">Weekly delivery trends</div>
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={deliveryTrend}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                            <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)', fontSize: '0.8rem' }} />
                            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '0.75rem' }} />
                            <Line type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 3 }} name="Total" />
                            <Line type="monotone" dataKey="consolidated" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3 }} name="Consolidated" />
                            <Line type="monotone" dataKey="onTime" stroke="#8b5cf6" strokeWidth={2.5} dot={{ r: 3 }} name="On Time" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Zone Distribution */}
                <div className="chart-card">
                    <h3>Zone Distribution</h3>
                    <div className="chart-subtitle">Deliveries by zone</div>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={zoneDistribution}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={90}
                                paddingAngle={3}
                                dataKey="value"
                            >
                                {zoneDistribution.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)', fontSize: '0.8rem' }} />
                            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '0.75rem' }} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="charts-grid">
                {/* Peak Hours */}
                <div className="chart-card">
                    <h3>Peak Hours Analysis</h3>
                    <div className="chart-subtitle">Congestion intensity by hour</div>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={peakHours.filter((_, i) => i % 2 === 0)}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                            <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 10 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                            <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)', fontSize: '0.8rem' }} />
                            <Bar dataKey="intensity" radius={[4, 4, 0, 0]} name="Congestion %">
                                {peakHours.filter((_, i) => i % 2 === 0).map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.intensity > 70 ? '#ef4444' : entry.intensity > 40 ? '#f59e0b' : '#10b981'}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Fleet Utilization */}
                <div className="chart-card">
                    <h3>Fleet Utilization</h3>
                    <div className="chart-subtitle">Current fleet status breakdown</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1rem' }}>
                        <FleetBar label="Active" value={fleetUtilization.active} total={fleetUtilization.total} color="#10b981" />
                        <FleetBar label="Idle" value={fleetUtilization.idle} total={fleetUtilization.total} color="#f59e0b" />
                        <FleetBar label="Maintenance" value={fleetUtilization.maintenance} total={fleetUtilization.total} color="#ef4444" />
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'var(--bg-main)', borderRadius: '8px', marginTop: '0.5rem' }}>
                            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Total Fleet</span>
                            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)' }}>{fleetUtilization.total} vehicles</span>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

const FleetBar = ({ label, value, total, color }) => {
    const percent = ((value / total) * 100).toFixed(1);
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 500 }}>{label}</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color }}>{value} ({percent}%)</span>
            </div>
            <div className="capacity-bar" style={{ height: '10px' }}>
                <div className="capacity-bar-fill" style={{ width: `${percent}%`, background: color }} />
            </div>
        </div>
    );
};

function getMockAnalytics() {
    return {
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
    };
}

export default Analytics;
