import React from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';
import { Search, Bell } from 'lucide-react';

const DashboardLayout = ({ children, title }) => {
    const { user } = useAuth();

    const getInitial = () => {
        if (!user?.name) return 'U';
        return user.name.charAt(0).toUpperCase();
    };

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="dashboard-main">
                {/* Top Header */}
                <header className="dashboard-header">
                    <div className="dashboard-header-left">
                        <h2>{title || 'Dashboard'}</h2>
                    </div>
                    <div className="dashboard-header-right">
                        <div className="header-search">
                            <Search size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                            <input type="text" placeholder="Search..." />
                        </div>
                        <button className="header-icon-btn">
                            <Bell size={18} />
                            <span className="notif-dot" />
                        </button>
                        <div className="header-avatar">
                            {getInitial()}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="dashboard-content fade-in">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
