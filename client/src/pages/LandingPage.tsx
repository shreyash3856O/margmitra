import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Clock, Map, TrendingDown, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
    const navigate = useNavigate();
    const { scrollYProgress } = useScroll();
    const mapY = useTransform(scrollYProgress, [0, 1], [0, -100]);

    return (
        <div style={{ overflowX: 'hidden' }}>
            {/* Hero Section */}
            <section style={{ minHeight: '90vh', display: 'flex', alignItems: 'center', position: 'relative', paddingTop: '4rem' }}>
                <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div style={{ display: 'inline-block', padding: '0.5rem 1rem', background: 'var(--accent-light)', color: 'var(--accent)', borderRadius: '99px', fontSize: '0.875rem', fontWeight: 600, marginBottom: '1.5rem' }}>
                            Smart City Logistics
                        </div>
                        <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', letterSpacing: '-0.02em', marginBottom: '1.5rem', color: 'var(--primary)' }}>
                            End Delivery Chaos in Cities.
                        </h1>
                        <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '2.5rem', maxWidth: '500px', lineHeight: 1.6 }}>
                            Coordinate delivery timings dynamically using predictive congestion patterns. Save fuel, reduce emissions, and boost efficiency with intelligent scheduling.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button onClick={() => navigate('/register')} className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
                                Get Started Free <ArrowRight size={20} />
                            </button>
                        </div>
                    </motion.div>
                    
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        style={{ position: 'relative' }}
                    >
                        {/* Abstract visual representing traffic reduction */}
                        <div style={{ background: 'var(--bg-card)', borderRadius: '24px', padding: '2rem', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.25rem' }}>Mira Road Zone</h3>
                                    <p style={{ color: 'var(--success)', fontSize: '0.875rem', fontWeight: 600 }}>Active Scheduling • Traffic -34%</p>
                                </div>
                                <div style={{ background: 'var(--success)', color: 'white', padding: '0.5rem', borderRadius: '50%' }}>
                                    <CheckCircle2 size={24} />
                                </div>
                            </div>
                            
                            {/* Mock Timeline */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {[
                                    { time: '10:00 AM', status: 'available', color: 'var(--success)', bg: 'rgba(16, 185, 129, 0.1)' },
                                    { time: '12:00 PM', status: 'congested', color: 'var(--danger)', bg: 'rgba(239, 68, 68, 0.1)' },
                                    { time: '02:00 PM', status: 'optimal', color: 'var(--success)', bg: 'rgba(16, 185, 129, 0.1)' },
                                ].map((slot, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'var(--bg-main)', borderRadius: '12px' }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: slot.bg, color: slot.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                            <Clock size={20} />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: 600 }}>{slot.time}</div>
                                        </div>
                                        <div className="badge" style={{ background: slot.bg, color: slot.color }}>
                                            {slot.status}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Impact Metrics Section */}
            <section style={{ padding: '6rem 0', background: 'var(--primary)', color: 'white' }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', textAlign: 'center' }}>
                        {[
                            { icon: <TrendingDown size={40} />, metric: '30%', label: 'Reduction in Local Congestion' },
                            { icon: <Clock size={40} />, metric: '45 mins', label: 'Average Time Saved per Route' },
                            { icon: <Map size={40} />, metric: '15+', label: 'City Zones Optimized Globally' }
                        ].map((stat, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.2 }}
                                style={{ padding: '2rem' }}
                            >
                                <div style={{ color: 'var(--accent-light)', marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>{stat.icon}</div>
                                <div style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '0.5rem' }}>{stat.metric}</div>
                                <div style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.7)' }}>{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
