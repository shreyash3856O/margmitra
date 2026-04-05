import React, { useEffect, useState, useRef } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import {
    BarChart, Bar, AreaChart, Area, XAxis, YAxis, Tooltip,
    ResponsiveContainer, CartesianGrid, Legend, Cell
} from 'recharts';
import { Leaf, TreePine, Zap, Award, TrendingDown } from 'lucide-react';
import axios from 'axios';

const Emissions = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [animatedCO2, setAnimatedCO2] = useState(0);
    const counterRef = useRef(null);

    useEffect(() => {
        const fetchEmissions = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/traffic/emissions');
                setData(res.data);
            } catch {
                setData(getMockEmissions());
            } finally {
                setLoading(false);
            }
        };
        fetchEmissions();
    }, []);

    // Animate counter
    useEffect(() => {
        if (!data) return;
        const target = parseInt(data.summary.totalCO2Saved);
        const duration = 2000;
        const start = Date.now();

        const animate = () => {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            setAnimatedCO2(Math.floor(target * eased));
            if (progress < 1) {
                counterRef.current = requestAnimationFrame(animate);
            }
        };

        counterRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(counterRef.current);
    }, [data]);

    if (loading || !data) {
        return (
            <DashboardLayout title="Emissions">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50vh' }}>
                    <div className="loading-spinner" />
                </div>
            </DashboardLayout>
        );
    }

    const { monthlyTrends, summary, vehicleTypeEmissions, weeklyData } = data;

    return (
        <DashboardLayout title="Emissions">
            {/* Hero Banner */}
            <div className="emission-hero">
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                        <Leaf size={28} />
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, opacity: 0.9 }}>Environmental Impact</span>
                    </div>
                    <div className="big-number">{animatedCO2.toLocaleString()} kg</div>
                    <div className="big-label">Total CO₂ Emissions Saved</div>
                </div>
                <div className="emission-hero-stats">
                    <div className="emission-hero-stat">
                        <div className="stat-val">{summary.reductionPercent}%</div>
                        <div className="stat-lbl">Reduction</div>
                    </div>
                    <div className="emission-hero-stat">
                        <div className="stat-val">{summary.treesEquivalent}</div>
                        <div className="stat-lbl">Trees Equiv.</div>
                    </div>
                    <div className="emission-hero-stat">
                        <div className="stat-val">{summary.carbonCredits}</div>
                        <div className="stat-lbl">Credits</div>
                    </div>
                </div>
            </div>

            {/* Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                <div className="stat-card">
                    <div className="stat-card-icon" style={{ background: 'var(--success-light)', color: 'var(--success)' }}>
                        <TrendingDown size={20} />
                    </div>
                    <div className="stat-card-info">
                        <div className="value" style={{ fontSize: '1.3rem' }}>{summary.reductionPercent}%</div>
                        <div className="label">Carbon Reduction</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-card-icon" style={{ background: 'rgba(139,92,246,0.1)', color: '#8b5cf6' }}>
                        <Zap size={20} />
                    </div>
                    <div className="stat-card-info">
                        <div className="value" style={{ fontSize: '1.3rem' }}>{summary.greenFleetPercent}%</div>
                        <div className="label">Green Fleet</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-card-icon" style={{ background: 'var(--warning-light)', color: 'var(--warning)' }}>
                        <Award size={20} />
                    </div>
                    <div className="stat-card-info">
                        <div className="value" style={{ fontSize: '1.3rem' }}>{summary.carbonCredits}</div>
                        <div className="label">Carbon Credits</div>
                    </div>
                </div>
            </div>

            <div className="charts-grid" style={{ marginBottom: '1.5rem' }}>
                {/* Monthly Trends */}
                <div className="chart-card">
                    <h3>Monthly Emission Trends</h3>
                    <div className="chart-subtitle">CO₂ output before vs after optimization</div>
                    <ResponsiveContainer width="100%" height={250}>
                        <AreaChart data={monthlyTrends}>
                            <defs>
                                <linearGradient id="gradBefore" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="gradAfter" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                            <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)', fontSize: '0.8rem' }} />
                            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '0.75rem' }} />
                            <Area type="monotone" dataKey="before" stroke="#94a3b8" fill="url(#gradBefore)" strokeWidth={2} name="Before" />
                            <Area type="monotone" dataKey="after" stroke="#10b981" fill="url(#gradAfter)" strokeWidth={2} name="After" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Weekly Comparison */}
                <div className="chart-card">
                    <h3>Weekly CO₂ Comparison</h3>
                    <div className="chart-subtitle">This week's before vs after (kg)</div>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={weeklyData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                            <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)', fontSize: '0.8rem' }} />
                            <Legend iconType="square" iconSize={8} wrapperStyle={{ fontSize: '0.75rem' }} />
                            <Bar dataKey="co2Before" fill="#94a3b8" radius={[4, 4, 0, 0]} name="Before" />
                            <Bar dataKey="co2After" fill="#10b981" radius={[4, 4, 0, 0]} name="After" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Vehicle Type Emissions */}
            <div className="chart-card">
                <h3>Emissions by Vehicle Type</h3>
                <div className="chart-subtitle">Average CO₂ output per delivery (grams)</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginTop: '1rem' }}>
                    {vehicleTypeEmissions.map((vt, i) => {
                        const maxEmission = 200;
                        const heightPercent = (vt.emission / maxEmission) * 100;
                        const color = vt.emission === 0 ? '#10b981' : vt.emission < 50 ? '#10b981' : vt.emission < 100 ? '#f59e0b' : '#ef4444';

                        return (
                            <div key={i} style={{ textAlign: 'center', padding: '1rem', background: 'var(--bg-main)', borderRadius: '10px' }}>
                                <div style={{
                                    height: '120px',
                                    display: 'flex',
                                    alignItems: 'flex-end',
                                    justifyContent: 'center',
                                    marginBottom: '0.75rem',
                                }}>
                                    <div style={{
                                        width: '50px',
                                        height: `${Math.max(heightPercent, 5)}%`,
                                        background: `linear-gradient(180deg, ${color}, ${color}88)`,
                                        borderRadius: '6px 6px 0 0',
                                        transition: 'height 1s ease',
                                        position: 'relative',
                                    }}>
                                        <span style={{
                                            position: 'absolute', top: '-20px',
                                            left: '50%', transform: 'translateX(-50%)',
                                            fontSize: '0.75rem', fontWeight: 700, color,
                                        }}>
                                            {vt.emission}g
                                        </span>
                                    </div>
                                </div>
                                <div style={{ fontWeight: 600, fontSize: '0.8rem', marginBottom: '0.2rem' }}>{vt.type}</div>
                                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{vt.count} vehicles</div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </DashboardLayout>
    );
};

function getMockEmissions() {
    return {
        monthlyTrends: [
            { month: 'Jan', before: 420, after: 180 },
            { month: 'Feb', before: 380, after: 165 },
            { month: 'Mar', before: 450, after: 195 },
            { month: 'Apr', before: 400, after: 170 },
            { month: 'May', before: 430, after: 185 },
            { month: 'Jun', before: 460, after: 200 },
            { month: 'Jul', before: 440, after: 190 },
            { month: 'Aug', before: 420, after: 175 },
            { month: 'Sep', before: 410, after: 168 },
            { month: 'Oct', before: 435, after: 182 },
            { month: 'Nov', before: 390, after: 160 },
            { month: 'Dec', before: 370, after: 150 },
        ],
        summary: {
            totalCO2Saved: '4250',
            reductionPercent: '28.5',
            greenFleetPercent: '38.2',
            carbonCredits: 145,
            treesEquivalent: 280,
        },
        vehicleTypeEmissions: [
            { type: 'Electric Bike', emission: 0, count: 15 },
            { type: 'Light Van', emission: 45, count: 50 },
            { type: 'Medium Delivery', emission: 85, count: 55 },
            { type: 'Heavy Truck', emission: 180, count: 36 },
        ],
        weeklyData: [
            { day: 'Mon', co2Before: 420, co2After: 280 },
            { day: 'Tue', co2Before: 380, co2After: 260 },
            { day: 'Wed', co2Before: 450, co2After: 300 },
            { day: 'Thu', co2Before: 410, co2After: 275 },
            { day: 'Fri', co2Before: 430, co2After: 290 },
            { day: 'Sat', co2Before: 350, co2After: 220 },
            { day: 'Sun', co2Before: 300, co2After: 180 },
        ],
    };
}

export default Emissions;
