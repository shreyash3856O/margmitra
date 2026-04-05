import React from 'react';

const Footer = () => {
    return (
        <footer style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-card)', padding: '2rem 0', marginTop: '4rem' }}>
            <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <div style={{ fontWeight: 700, fontSize: '1.25rem', color: 'var(--primary)' }}>
                    MargMitra
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    Ending delivery chaos in cities using intelligent scheduling.
                </p>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '1rem' }}>
                    &copy; {new Date().getFullYear()} MargMitra Inc. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
