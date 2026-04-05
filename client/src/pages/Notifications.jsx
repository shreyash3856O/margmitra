import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { Bell, AlertTriangle, Info, CheckCircle } from 'lucide-react';

const Notifications = () => {
    const [notifications, setNotifications] = useState([
        { id: 1, type: 'warning', title: 'High Traffic Alert', message: 'Heavy congestion reported on Western Express Hwy near Mira Road exit.', time: '10 mins ago', read: false },
        { id: 2, type: 'info', title: 'Route Optimization', message: 'Vehicle MH-04-AB-1234 route has been diverted to avoid traffic.', time: '1 hour ago', read: false },
        { id: 3, type: 'success', title: 'Delivery Completed', message: 'Delivery to Golden Nest Market was successfully completed.', time: '2 hours ago', read: true },
        { id: 4, type: 'warning', title: 'Emission Threshold', message: 'Fleet CO2 emissions are nearing the daily limit. Please review active trips.', time: '5 hours ago', read: true },
    ]);

    const markAsRead = (id) => {
        setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    const getIcon = (type) => {
        switch (type) {
            case 'warning': return <AlertTriangle size={20} className="text-warning" style={{ color: 'var(--warning)' }} />;
            case 'success': return <CheckCircle size={20} className="text-success" style={{ color: 'var(--success)' }} />;
            case 'info':
            default: return <Info size={20} className="text-primary" style={{ color: 'var(--sidebar-accent)' }} />;
        }
    };

    return (
        <DashboardLayout title="Notifications">
            <div className="card-static" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Bell size={20} style={{ color: 'var(--sidebar-accent)' }} />
                        <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Recent Alerts</h2>
                    </div>
                    <button onClick={markAllAsRead} className="btn btn-outline btn-sm">
                        Mark all as read
                    </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {notifications.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                            No notifications right now.
                        </div>
                    ) : (
                        notifications.map(notif => (
                            <div 
                                key={notif.id} 
                                style={{ 
                                    display: 'flex', 
                                    gap: '1rem', 
                                    padding: '1rem', 
                                    borderRadius: '12px', 
                                    background: notif.read ? 'transparent' : 'rgba(16, 185, 129, 0.05)', 
                                    border: `1px solid ${notif.read ? 'var(--border)' : 'var(--sidebar-accent)'}`,
                                    transition: 'all 0.2s ease',
                                    cursor: 'pointer'
                                }}
                                onClick={() => markAsRead(notif.id)}
                            >
                                <div style={{ flexShrink: 0, marginTop: '0.2rem' }}>
                                    {getIcon(notif.type)}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                        <div style={{ fontWeight: 600, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            {notif.title}
                                            {!notif.read && <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--sidebar-accent)' }}></span>}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{notif.time}</div>
                                    </div>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{notif.message}</div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Notifications;
