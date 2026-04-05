import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Truck, Plus } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';

const FleetPage = () => {
    const [vehicles, setVehicles] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ licensePlate: '', type: 'Light Van', capacity: '' });

    const fetchVehicles = async () => {
        try {
            const res = await axios.get('/api/vehicles', { withCredentials: true });
            setVehicles(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchVehicles();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/vehicles', formData, { withCredentials: true });
            setFormData({ licensePlate: '', type: 'Light Van', capacity: '' });
            setShowForm(false);
            fetchVehicles();
        } catch (err) {
            console.error("Error creating vehicle", err);
            alert(err.response?.data?.message || 'Failed to register');
        }
    };

    return (
        <DashboardLayout title="Fleet Management">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Fleet Management</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Manage registered logistics vehicles.</p>
                </div>
                <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
                    <Plus size={18} /> Add Vehicle
                </button>
            </div>

            {showForm && (
                <div className="card fade-in" style={{ marginBottom: '2rem', maxWidth: '600px' }}>
                    <h3 style={{ marginBottom: '1rem' }}>Register New Vehicle</h3>
                    <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>License Plate</label>
                            <input 
                                required type="text" value={formData.licensePlate}
                                onChange={e => setFormData({...formData, licensePlate: e.target.value})}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }}
                                placeholder="MH 04 AB 1234"
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Vehicle Type</label>
                            <select 
                                required value={formData.type}
                                onChange={e => setFormData({...formData, type: e.target.value})}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }}
                            >
                                <option value="Light Van">Light Van</option>
                                <option value="Heavy Truck">Heavy Truck</option>
                                <option value="Medium Delivery">Medium Delivery</option>
                                <option value="Electric Bike">Electric Bike</option>
                            </select>
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Capacity (kg)</label>
                            <input 
                                required type="number" value={formData.capacity}
                                onChange={e => setFormData({...formData, capacity: e.target.value})}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }}
                                placeholder="1000"
                            />
                        </div>
                        <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                            <button type="submit" className="btn btn-primary">Register</button>
                            <button type="button" onClick={() => setShowForm(false)} className="btn btn-outline">Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                {vehicles.map(v => (
                    <div key={v._id} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ background: 'var(--bg-main)', color: 'var(--primary)', padding: '1rem', borderRadius: '12px' }}>
                            <Truck size={28} />
                        </div>
                        <div>
                            <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{v.licensePlate}</div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{v.type} • {v.capacity}kg</div>
                            <div className="badge" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', marginTop: '0.5rem', display: 'inline-block' }}>{v.status}</div>
                        </div>
                    </div>
                ))}
                {vehicles.length === 0 && !showForm && (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', color: 'var(--text-muted)', background: 'var(--bg-main)', borderRadius: '12px' }}>
                        No vehicles registered yet. Add one to start scheduling deliveries.
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default FleetPage;
