import React, { useState, useEffect } from 'react';
import { useBooking } from '../context/BookingContext';
import { useNavigate } from 'react-router-dom';
import { MapPin, Search, Calendar, Info } from 'lucide-react';
import { format } from 'date-fns';
import axios from 'axios';
import DashboardLayout from '../components/DashboardLayout';

const BookingPage = () => {
    const { slots, fetchSlots, createBooking, loading, error } = useBooking();
    const navigate = useNavigate();
    
    const [zone, setZone] = useState('downtown');
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [vehicles, setVehicles] = useState([]);
    const [bookingDetails, setBookingDetails] = useState({
        vehicleId: '', pickupAddress: '', deliveryAddress: '', loadWeight: ''
    });

    // Fetch user fleets
    useEffect(() => {
        axios.get('http://localhost:5000/api/vehicles', { withCredentials: true })
            .then(res => {
                setVehicles(res.data);
                if(res.data.length > 0) setBookingDetails(prev => ({...prev, vehicleId: res.data[0]._id}));
            })
            .catch(err => console.error(err));
    }, []);

    const handleSearch = () => {
        fetchSlots(zone);
        setSelectedSlot(null);
    };

    const handleBooking = async (e) => {
        e.preventDefault();
        try {
            await createBooking({
                ...bookingDetails,
                slotId: selectedSlot._id
            });
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
        }
    };

    const getCongestionColor = (level) => {
        switch(level) {
            case 'low': return { bg: 'rgba(16, 185, 129, 0.1)', text: 'var(--success)' };
            case 'medium': return { bg: 'rgba(245, 158, 11, 0.1)', text: 'var(--warning)' };
            case 'high': return { bg: 'rgba(239, 68, 68, 0.1)', text: 'var(--danger)' };
            default: return { bg: 'var(--bg-main)', text: 'var(--text-muted)' };
        }
    };

    return (
        <DashboardLayout title="Schedule Delivery">
            <div className="page-header">
                <h1>Schedule Smart Delivery</h1>
                <p>Configure zone and choose an AI-optimized time slot to reduce traffic.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.5fr) minmax(0, 1fr)', gap: '2rem' }}>
                
                {/* Left Side: Slot Picker */}
                <div>
                    <div className="card" style={{ marginBottom: '2rem' }}>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Delivery Zone</label>
                                <div style={{ position: 'relative' }}>
                                    <MapPin size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                    <select 
                                        value={zone} 
                                        onChange={(e) => setZone(e.target.value)}
                                        style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '8px', border: '1px solid var(--border)', outline: 'none', appearance: 'none', background: 'var(--bg-main)' }}
                                    >
                                        <option value="downtown">Downtown Core</option>
                                        <option value="commercial">Commercial Hub</option>
                                        <option value="residential">Suburban Residential</option>
                                    </select>
                                </div>
                            </div>
                            <button onClick={handleSearch} className="btn btn-primary" disabled={loading}>
                                <Search size={18} /> {loading ? 'Analyzing...' : 'Find Slots'}
                            </button>
                        </div>
                    </div>

                    <h3 style={{ marginBottom: '1rem' }}>AI Forecasted Slots</h3>
                    {slots.length === 0 && !loading && (
                        <div style={{ textAlign: 'center', padding: '3rem', background: 'var(--bg-main)', borderRadius: '12px', border: '1px dashed var(--border)' }}>
                            <Calendar size={48} style={{ color: 'var(--border)', margin: '0 0 1rem 0' }} />
                            <p style={{ color: 'var(--text-muted)' }}>Search for a zone to see recommended delivery times.</p>
                        </div>
                    )}
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                        {slots.map(slot => {
                            const colors = getCongestionColor(slot.congestionLevel);
                            const isSelected = selectedSlot?._id === slot._id;
                            return (
                                <div 
                                    key={slot._id}
                                    onClick={() => setSelectedSlot(slot)}
                                    className={`card ${isSelected ? 'selected' : ''}`}
                                    style={{ 
                                        cursor: 'pointer', 
                                        border: isSelected ? '2px solid var(--accent)' : '1px solid var(--border)',
                                        transform: isSelected ? 'translateY(-4px)' : 'none',
                                        boxShadow: isSelected ? 'var(--shadow)' : 'none'
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                        <span style={{ fontWeight: 600 }}>{format(new Date(slot.startTime), 'HH:mm')}</span>
                                        <span className="badge" style={{ background: colors.bg, color: colors.text }}>{slot.congestionLevel}</span>
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                        Capacity: {slot.currentLoad}/{slot.maxCapacity} Full
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Right Side: Booking Form details */}
                <div className="card" style={{ height: 'fit-content' }}>
                    <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>Booking Details</h3>
                    
                    {!selectedSlot ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                            <Info size={16} /> Select a slot on the left to proceed.
                        </div>
                    ) : (
                        <form onSubmit={handleBooking} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ background: 'var(--bg-main)', padding: '1rem', borderRadius: '8px', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                                <strong>Selected:</strong> {format(new Date(selectedSlot.startTime), 'PPP - HH:mm a')}
                            </div>

                            {error && <div style={{ color: 'var(--danger)', fontSize: '0.875rem' }}>{error}</div>}

                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Select Vehicle</label>
                                <select 
                                    required
                                    value={bookingDetails.vehicleId} 
                                    onChange={(e) => setBookingDetails({...bookingDetails, vehicleId: e.target.value})}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', outline: 'none' }}
                                >
                                    <option value="" disabled>Choose a vehicle</option>
                                    {vehicles.map(v => (
                                        <option key={v._id} value={v._id}>{v.licensePlate} ({v.type})</option>
                                    ))}
                                </select>
                                {vehicles.length === 0 && <span style={{fontSize: '0.75rem', color: 'var(--warning)', marginTop: '0.25rem', display: 'block'}}>Please register a vehicle in Fleet first.</span>}
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Load Weight (kg)</label>
                                <input 
                                    required
                                    type="number" 
                                    value={bookingDetails.loadWeight}
                                    onChange={(e) => setBookingDetails({...bookingDetails, loadWeight: e.target.value})}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', outline: 'none' }}
                                    placeholder="e.g. 500"
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Pickup Address</label>
                                <textarea 
                                    required
                                    rows="2"
                                    value={bookingDetails.pickupAddress}
                                    onChange={(e) => setBookingDetails({...bookingDetails, pickupAddress: e.target.value})}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', outline: 'none', resize: 'vertical' }}
                                    placeholder="Warehouse start location..."
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Delivery Address</label>
                                <textarea 
                                    required
                                    rows="2"
                                    value={bookingDetails.deliveryAddress}
                                    onChange={(e) => setBookingDetails({...bookingDetails, deliveryAddress: e.target.value})}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', outline: 'none', resize: 'vertical' }}
                                    placeholder="Final destination..."
                                />
                            </div>

                            <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', justifyContent: 'center' }}>
                                Confirm Schedule
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default BookingPage;
