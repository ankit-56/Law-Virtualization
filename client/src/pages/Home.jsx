import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { getLaws, searchLaws } from '../services/api';
import LawCard from '../components/LawCard';

const Home = () => {
    const [laws, setLaws] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState(null);

    // Mock categories for simple filtering UI
    const categories = [
        { id: 1, name: 'Constitutional Law' },
        { id: 2, name: 'Criminal Law' },
        { id: 3, name: 'Civil Law' },
        { id: 4, name: 'Corporate Law' },
        { id: 5, name: 'Family Law' }
    ];

    useEffect(() => {
        fetchLaws();
    }, [activeCategory]);

    const fetchLaws = async () => {
        setLoading(true);
        try {
            // If API fails (e.g. database down), we can display empty state or mock data
            // For now assuming API works or returns empty array on error catch in service
            const data = await getLaws(activeCategory);
            setLaws(data);
        } catch (error) {
            console.error("Failed to fetch laws", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (searchQuery.trim()) {
                const data = await searchLaws(searchQuery);
                setLaws(data);
            } else {
                fetchLaws();
            }
        } catch (error) {
            console.error("Search failed", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-fade-in">
            {/* Hero Section */}
            <section style={{
                padding: '4rem 1rem',
                textAlign: 'center',
                background: `linear-gradient(to bottom, rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.95)), url('/src/assets/hero-bg.png')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                marginBottom: '2rem',
                color: 'white'
            }}>
                <div className="container">
                    <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: '#c5a059', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                        Virtualize Legal Knowledge
                    </h1>
                    <p style={{ fontSize: '1.25rem', color: '#e2e8f0', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
                        Access a comprehensive digital library of laws, acts, and regulations. Searchable, accessible, and free for everyone.
                    </p>

                    <form onSubmit={handleSearch} style={{ maxWidth: '500px', margin: '0 auto', position: 'relative' }}>
                        <input
                            type="text"
                            placeholder="Search for laws, acts, or keywords..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '1rem 1rem 1rem 3rem',
                                borderRadius: '999px',
                                border: '1px solid var(--border)',
                                fontSize: '1rem',
                                boxShadow: 'var(--shadow)'
                            }}
                        />
                        <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--secondary)' }} />
                        <button type="submit" className="btn btn-primary" style={{ position: 'absolute', right: '0.5rem', top: '0.5rem', borderRadius: '999px', padding: '0.5rem 1.5rem' }}>
                            Search
                        </button>
                    </form>
                </div>
            </section>

            {/* Categories & Content */}
            <section className="container">
                <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '1rem', marginBottom: '2rem', scrollbarWidth: 'none' }}>
                    <button
                        className={`btn ${activeCategory === null ? 'btn-primary' : 'btn-outline'}`}
                        onClick={() => setActiveCategory(null)}
                    >
                        All
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            className={`btn ${activeCategory === cat.id ? 'btn-primary' : 'btn-outline'}`}
                            onClick={() => setActiveCategory(cat.id)}
                            style={{ whiteSpace: 'nowrap' }}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '2rem' }}>Loading laws...</div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem', paddingBottom: '4rem' }}>
                        {laws.length > 0 ? (
                            laws.map(law => <LawCard key={law.id} law={law} />)
                        ) : (
                            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', color: 'var(--secondary)' }}>
                                <p>No laws found matching your criteria.</p>
                            </div>
                        )}
                    </div>
                )}
            </section>
        </div>
    );
};

export default Home;
