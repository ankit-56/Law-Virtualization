import React, { useState, useEffect } from 'react';
import { Bookmark, ArrowLeft, BookOpen } from 'lucide-react';
import { getUserBookmarks } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LawCard from '../components/LawCard';
import { Link } from 'react-router-dom';

const Bookmarks = () => {
    const { user } = useAuth();
    const [bookmarks, setBookmarks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchBookmarks();
        }
    }, [user]);

    const fetchBookmarks = async () => {
        setLoading(true);
        try {
            const data = await getUserBookmarks(user.id);
            setBookmarks(data);
        } catch (error) {
            console.error("Failed to fetch bookmarks", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container animate-fade-in" style={{ padding: '2rem 1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ backgroundColor: 'var(--primary)', color: 'white', padding: '0.75rem', borderRadius: '50%' }}>
                    <Bookmark size={24} />
                </div>
                <div>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>My Bookmarks</h1>
                    <p style={{ color: 'var(--secondary)' }}>Your personal collection of saved legal provisions</p>
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '4rem' }}>Synchronizing your collection...</div>
            ) : bookmarks.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem', paddingBottom: '4rem' }}>
                    {bookmarks.map(law => (
                        <LawCard key={law.id} law={law} />
                    ))}
                </div>
            ) : (
                <div className="card" style={{ textAlign: 'center', padding: '5rem 2rem', backgroundColor: '#f8fafc' }}>
                    <div style={{ color: 'var(--border)', marginBottom: '1.5rem' }}>
                        <Bookmark size={64} strokeWidth={1} />
                    </div>
                    <h2 style={{ marginBottom: '1rem' }}>No Bookmarks Yet</h2>
                    <p style={{ color: 'var(--secondary)', marginBottom: '2rem', maxWidth: '400px', margin: '0 auto 2rem' }}>
                        When you find a law or statute you'd like to save for later, click the bookmark icon on the detail page.
                    </p>
                    <Link to="/" className="btn btn-primary" style={{ gap: '0.5rem' }}>
                        <ArrowLeft size={18} />
                        Explore Laws
                    </Link>
                </div>
            )}
        </div>
    );
};

export default Bookmarks;
