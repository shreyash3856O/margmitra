import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MapPin, Truck, LayoutDashboard, LogOut, Menu } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="glass" style={{ position: 'sticky', top: 0, zIndex: 1000, padding: '1rem 0' }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 800, fontSize: '1.5rem', color: 'var(--primary)' }}>
                    <div style={{ background: 'var(--accent)', color: 'white', padding: '0.4rem', borderRadius: '8px', display: 'flex' }}>
                        <Truck size={24} />
                    </div>
                    margmitra
                </Link>

                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    {user ? (
                        <>
                            <Link to="/dashboard" className="btn-outline btn" style={{ border: 'none', fontWeight: 500 }}>
                                <LayoutDashboard size={18} /> Dashboard
                            </Link>
                            <Link to="/fleet" className="btn-outline btn" style={{ border: 'none', fontWeight: 500 }}>
                                <Truck size={18} /> Fleet
                            </Link>
                            <Link to="/book" className="btn-outline btn" style={{ border: 'none', fontWeight: 500 }}>
                                <MapPin size={18} /> Book Slot
                            </Link>
                            <button onClick={logout} className="btn-outline btn" style={{ border: 'none', color: 'var(--danger)', fontWeight: 500 }}>
                                <LogOut size={18} /> Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" style={{ fontWeight: 500 }}>Login</Link>
                            <Link to="/register" className="btn btn-primary">Join Platform</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
