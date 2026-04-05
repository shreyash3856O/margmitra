import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutGrid, Map, BarChart3, Compass, Leaf,
    Bell, Settings, LogOut, Truck, Package, CalendarCheck
} from 'lucide-react';

const Sidebar = () => {
    const { logout } = useAuth();
    const location = useLocation();
    const [activeRole, setActiveRole] = useState('authority');

    const roles = [
        { id: 'supplier', label: 'Supplier' },
        { id: 'transporter', label: 'Transporter' },
        { id: 'retailer', label: 'Retailer' },
        { id: 'authority', label: 'Authority' },
    ];

    const navItems = [
        { path: '/dashboard', icon: LayoutGrid, label: 'Dashboard' },
        { path: '/heatmap', icon: Map, label: 'City Heatmap' },
        { path: '/analytics', icon: BarChart3, label: 'Analytics' },
        { path: '/zone-insights', icon: Compass, label: 'Zone Insights' },
        { path: '/emissions', icon: Leaf, label: 'Emissions' },
    ];

    const secondaryNav = [
        { path: '/book', icon: CalendarCheck, label: 'Book Slot' },
        { path: '/fleet', icon: Truck, label: 'Fleet Mgmt' },
    ];

    return (
        <aside className="sidebar">
            {/* Logo */}
            <div className="sidebar-logo">
                <div className="sidebar-logo-icon">
                    <Package size={20} />
                </div>
                <div className="sidebar-logo-text">
                    <h2>MargMitra</h2>
                    <span>Smart Logistics</span>
                </div>
            </div>

            {/* Role Switcher */}
            <div className="role-switcher">
                <label>Role</label>
                <div className="role-pills">
                    {roles.map(role => (
                        <button
                            key={role.id}
                            className={`role-pill ${activeRole === role.id ? 'active' : ''}`}
                            onClick={() => setActiveRole(role.id)}
                        >
                            {role.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Navigation */}
            <div className="sidebar-section-label">Navigation</div>
            <nav className="sidebar-nav">
                {navItems.map(item => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
                    >
                        <item.icon size={18} />
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            {/* Secondary Navigation */}
            <div className="sidebar-section-label" style={{ marginTop: '0.5rem' }}>Operations</div>
            <nav className="sidebar-nav">
                {secondaryNav.map(item => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
                    >
                        <item.icon size={18} />
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            {/* Bottom Actions */}
            <div className="sidebar-bottom">
                <NavLink to="/notifications" className="sidebar-nav-item">
                    <Bell size={18} />
                    Notifications
                </NavLink>
                <NavLink to="/settings" className="sidebar-nav-item">
                    <Settings size={18} />
                    Settings
                </NavLink>
                <button className="sidebar-nav-item danger" onClick={logout}>
                    <LogOut size={18} />
                    Sign Out
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
