import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Scale, LogIn, User, LogOut, Settings, Bookmark } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav style={{
            borderBottom: '1px solid var(--border)',
            padding: '1rem 0',
            backgroundColor: '#1a365d', // Navy Blue
            color: 'white',
            position: 'sticky',
            top: 0,
            zIndex: 1000,
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', fontSize: '1.5rem', color: 'white', textDecoration: 'none', fontFamily: 'Merriweather, serif' }}>
                    <Scale color="#c5a059" /> {/* Gold Icon */}
                    LawVirtual
                </Link>
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <Link to="/" style={{ color: '#e2e8f0', textDecoration: 'none', fontSize: '0.95rem' }}>Home</Link>

                    {user?.role === 'admin' && (
                        <Link to="/admin" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#e2e8f0', textDecoration: 'none', fontSize: '0.95rem' }}>
                            <Settings size={16} />
                            Admin
                        </Link>
                    )}

                    {user ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                            <Link to="/bookmarks" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#e2e8f0', textDecoration: 'none', fontSize: '0.95rem' }}>
                                <Bookmark size={16} />
                                My Bookmarks
                            </Link>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#c5a059', fontWeight: '500' }}>
                                <User size={18} />
                                {user.username}
                            </div>
                            <button
                                onClick={handleLogout}
                                className="btn btn-outline"
                                style={{
                                    padding: '0.4rem 0.8rem',
                                    fontSize: '0.85rem',
                                    borderColor: '#c5a059',
                                    color: '#c5a059',
                                    gap: '0.4rem'
                                }}
                            >
                                <LogOut size={16} />
                                Logout
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" className="btn" style={{
                            textDecoration: 'none',
                            gap: '0.5rem',
                            backgroundColor: '#c5a059',
                            color: '#1a365d',
                            fontWeight: 'bold'
                        }}>
                            <LogIn size={18} />
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
