import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { User, Bell, Lock, Globe, Save } from 'lucide-react';

const Settings = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');
    const [saved, setSaved] = useState(false);

    const handleSave = (e) => {
        e.preventDefault();
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <DashboardLayout title="Settings">
            <div style={{ display: 'flex', gap: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
                
                {/* Settings Sidebar */}
                <div style={{ width: '250px', flexShrink: 0 }}>
                    <div className="card-static" style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <button 
                                onClick={() => setActiveTab('profile')}
                                style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '8px', background: activeTab === 'profile' ? 'rgba(16, 185, 129, 0.1)' : 'transparent', color: activeTab === 'profile' ? 'var(--sidebar-accent)' : 'var(--text-muted)', fontWeight: activeTab === 'profile' ? 600 : 500, textAlign: 'left', transition: 'all 0.2s ease' }}
                            >
                                <User size={18} />
                                Profile Settings
                            </button>
                            <button 
                                onClick={() => setActiveTab('notifications')}
                                style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '8px', background: activeTab === 'notifications' ? 'rgba(16, 185, 129, 0.1)' : 'transparent', color: activeTab === 'notifications' ? 'var(--sidebar-accent)' : 'var(--text-muted)', fontWeight: activeTab === 'notifications' ? 600 : 500, textAlign: 'left', transition: 'all 0.2s ease' }}
                            >
                                <Bell size={18} />
                                Notification Preferences
                            </button>
                            <button 
                                onClick={() => setActiveTab('security')}
                                style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '8px', background: activeTab === 'security' ? 'rgba(16, 185, 129, 0.1)' : 'transparent', color: activeTab === 'security' ? 'var(--sidebar-accent)' : 'var(--text-muted)', fontWeight: activeTab === 'security' ? 600 : 500, textAlign: 'left', transition: 'all 0.2s ease' }}
                            >
                                <Lock size={18} />
                                Security & Privacy
                            </button>
                            <button 
                                onClick={() => setActiveTab('region')}
                                style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '8px', background: activeTab === 'region' ? 'rgba(16, 185, 129, 0.1)' : 'transparent', color: activeTab === 'region' ? 'var(--sidebar-accent)' : 'var(--text-muted)', fontWeight: activeTab === 'region' ? 600 : 500, textAlign: 'left', transition: 'all 0.2s ease' }}
                            >
                                <Globe size={18} />
                                Region Settings
                            </button>
                        </div>
                    </div>
                </div>

                {/* Settings Content */}
                <div style={{ flex: 1 }}>
                    <div className="card-static">
                        {activeTab === 'profile' && (
                            <form onSubmit={handleSave}>
                                <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <User size={20} style={{ color: 'var(--sidebar-accent)' }} /> Profile Information
                                </h3>
                                
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-main)' }}>Full Name</label>
                                            <input type="text" defaultValue={user?.name || 'Jane Doe'} style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-main)', outline: 'none' }} />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-main)' }}>Email Address</label>
                                            <input type="email" defaultValue={user?.email || 'jane.doe@margmitra.com'} style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-main)', outline: 'none' }} />
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-main)' }}>Organization</label>
                                        <input type="text" defaultValue="MargMitra Logistics Sub" style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-main)', outline: 'none' }} />
                                    </div>
                                    
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-main)' }}>Role</label>
                                        <input type="text" defaultValue={user?.role || 'Authority Manager'} disabled style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-card)', outline: 'none', color: 'var(--text-muted)' }} />
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                                        <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--sidebar-accent)', color: 'white' }}>
                                            <Save size={18} /> {saved ? 'Saved Successfully!' : 'Save Changes'}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        )}

                        {activeTab !== 'profile' && (
                            <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-muted)' }}>
                                <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.2 }}>⚙️</div>
                                <h3>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Settings</h3>
                                <p style={{ marginTop: '0.5rem', maxWidth: '300px', margin: '0.5rem auto 0' }}>This section is currently under construction and will be available in the next release.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Settings;
