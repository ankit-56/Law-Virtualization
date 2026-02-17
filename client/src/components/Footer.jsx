import React from 'react';

const Footer = () => {
    return (
        <footer style={{
            borderTop: '1px solid var(--border)',
            padding: '2rem 0',
            marginTop: 'auto',
            textAlign: 'center',
            color: 'var(--secondary)'
        }}>
            <div className="container">
                <p>&copy; 2026 Law Virtualization Platform. All rights reserved.</p>
                <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>Empowering public awareness through legal accessibility.</p>
            </div>
        </footer>
    );
};

export default Footer;
