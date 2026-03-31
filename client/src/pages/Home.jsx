import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getLaws, getCategories } from '../services/api';
import { Search, BookOpen, Scale, Shield, Users, Briefcase, Heart } from 'lucide-react';

const Home = () => {
    const [laws, setLaws] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [lawsData, catsData] = await Promise.all([
                    activeCategory ? getLaws(activeCategory) : getLaws(),
                    getCategories()
                ]);
                setLaws(lawsData);
                setCategories(catsData);
            } catch (error) {
                console.error("Failed to fetch data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [activeCategory]);

    const filteredLaws = laws.filter(law =>
        law.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        law.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getCategoryIcon = (name) => {
        switch (name) {
            case 'Constitutional Law': return <Shield size={20} />;
            case 'Criminal Law': return <Scale size={20} />;
            case 'Civil Law': return <Users size={20} />;
            case 'Corporate Law': return <Briefcase size={20} />;
            case 'Family Law': return <Heart size={20} />;
            default: return <BookOpen size={20} />;
        }
    };

    return (
        <div className="home-container" style={{ minHeight: '100vh' }}>
            {/* Hero Section */}
            <header className="hero-section" style={{
                backgroundImage: `url('/src/assets/hero-bg.png')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative',
                minHeight: '400px', /* Decreased from 600px */
                display: 'flex',
                alignItems: 'center'
            }}>
                <div className="hero-overlay"></div>
                <div className="container hero-content animate-fade-in">
                    <h1 className="animate-float" style={{ fontSize: '3.5rem', marginBottom: '1rem', textShadow: '0 4px 20px rgba(0,0,0,0.6)', lineHeight: '1.2' }}>
                        Virtualized <span style={{ color: 'var(--primary)' }}>Indian Law</span>
                    </h1>
                    <p style={{ fontSize: '1.4rem', marginBottom: '3rem', opacity: 0.95, fontWeight: '300', letterSpacing: '0.05em', maxWidth: '700px', margin: '0 auto 3rem' }}>
                        Empowering citizens with a digital gateway to legal knowledge. 
                        Search. Learn. Understand your rights through a premium localized experience.
                    </p>
                    
                    <div className="glass" style={{
                        maxWidth: '700px',
                        margin: '0 auto',
                        padding: '0.75rem',
                        borderRadius: '999px',
                        display: 'flex',
                        alignItems: 'center',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                        border: '1px solid rgba(255,255,255,0.2)'
                    }}>
                        <Search size={28} style={{ marginLeft: '1.5rem', color: 'var(--primary)' }} />
                        <input
                            type="text"
                            placeholder="Search by act name, section number, or keyword..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '1rem',
                                background: 'transparent',
                                border: 'none',
                                color: 'white',
                                fontSize: '1.2rem',
                                outline: 'none'
                            }}
                        />
                    </div>
                </div>
            </header>

            <main className="container" style={{ paddingBottom: '8rem', marginTop: '4rem', position: 'relative', zIndex: 10 }}>
                {/* Category Selection */}
                <div className="glass" style={{ 
                    display: 'flex', 
                    gap: '0.75rem', 
                    flexWrap: 'wrap', 
                    justifyContent: 'center', 
                    marginBottom: '5rem',
                    padding: '1.5rem',
                    borderRadius: '2rem',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
                }}>
                    <button
                        className={`category-chip ${!activeCategory ? 'active' : ''}`}
                        onClick={() => setActiveCategory(null)}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        <BookOpen size={18} /> Display All
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            className={`category-chip ${activeCategory === cat.id ? 'active' : ''}`}
                            onClick={() => setActiveCategory(cat.id)}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                        >
                            {getCategoryIcon(cat.name)}
                            {cat.name}
                        </button>
                    ))}
                </div>

                {/* Featured Content */}
                {laws.length > 0 && !activeCategory && !searchQuery && (
                    <div className="card glass" style={{ 
                        marginBottom: '6rem', 
                        padding: '4rem',
                        borderLeft: '12px solid var(--primary)', 
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2rem',
                        animation: 'fadeIn 1.2s ease-out',
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)'
                    }}>
                        <div style={{ fontWeight: '800', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '1rem', letterSpacing: '0.2em', fontSize: '0.9rem' }}>
                            <div style={{ width: '40px', height: '2px', background: 'var(--primary)' }}></div>
                            FEATURED LEGAL STATUTE
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '3rem', alignItems: 'center' }}>
                            <div>
                                <h2 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', color: 'var(--accent)', lineHeight: '1' }}>{laws[0].title}</h2>
                                <p style={{ fontSize: '1.4rem', color: '#475569', marginBottom: '2.5rem', fontStyle: 'italic', maxWidth: '800px', lineHeight: '1.6' }}>
                                    "{laws[0].description}"
                                </p>
                                <Link to={`/law/${laws[0].id}`} className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1rem' }}>
                                    Explore Full Documentation
                                </Link>
                            </div>
                            <div className="animate-float" style={{ borderRadius: '1.5rem', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', border: '4px solid white' }}>
                                <img 
                                    src={laws[0].media_urls && JSON.parse(laws[0].media_urls)[0] || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=800&auto=format&fit=crop'} 
                                    alt="Featured" 
                                    style={{ width: '100%', height: '300px', objectFit: 'cover' }}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Grid Layout */}
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h3 style={{ fontSize: '2.5rem', color: 'var(--accent)' }}>Legal Knowledge Base</h3>
                    <div style={{ width: '60px', height: '4px', background: 'var(--primary)', margin: '1rem auto' }}></div>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '5rem' }}>
                        <div className="animate-float" style={{ fontSize: '1.5rem', color: 'var(--secondary)' }}>Syncing Legal Records...</div>
                    </div>
                ) : (
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', 
                        gap: '2.5rem' 
                    }}>
                        {filteredLaws.length > 0 ? (
                            filteredLaws.map((law, index) => (
                                <article key={law.id} className="card" style={{ animationDelay: `${index * 0.1}s` }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                                        <span className="badge" style={{ 
                                            background: '#f1f5f9', 
                                            color: 'var(--accent)', 
                                            padding: '0.4rem 1rem', 
                                            borderRadius: '999px',
                                            fontSize: '0.75rem',
                                            fontWeight: '700',
                                            textTransform: 'uppercase'
                                        }}>
                                            {law.category_name}
                                        </span>
                                        <BookOpen size={20} color="var(--primary)" />
                                    </div>
                                    <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--accent)', minHeight: '3.5rem' }}>{law.title}</h3>
                                    <p style={{ color: 'var(--secondary)', marginBottom: '2rem', fontSize: '1rem', display: '-webkit-box', WebkitLineClamp: '3', WebkitBoxOrient: 'vertical', overflow: 'hidden', height: '4.8rem' }}>
                                        {law.description}
                                    </p>
                                    <Link to={`/law/${law.id}`} className="btn btn-outline" style={{ width: '100%' }}>
                                        Read Full Statute
                                    </Link>
                                </article>
                            ))
                        ) : (
                            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '5rem' }}>
                                <Shield size={64} color="var(--border)" style={{ marginBottom: '1rem' }} />
                                <h2 style={{ color: 'var(--secondary)' }}>No records matching your search were found.</h2>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Home;
