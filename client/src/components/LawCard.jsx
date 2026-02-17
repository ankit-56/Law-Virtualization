import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

const LawCard = ({ law }) => {
    return (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%', transition: 'transform 0.2s' }}>
            <div style={{ paddingBottom: '0.5rem', marginBottom: '0.5rem', borderBottom: '1px solid var(--border)' }}>
                <span className="badge" style={{
                    fontSize: '0.75rem',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '999px',
                    backgroundColor: 'var(--secondary)',
                    color: 'white',
                    opacity: 0.8
                }}>
                    {law.category_name || 'General'}
                </span>
            </div>
            <h3 style={{ marginBottom: '0.5rem', fontSize: '1.25rem' }}>{law.title}</h3>
            <p style={{ color: 'var(--secondary)', flexGrow: 1, marginBottom: '1rem', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                {law.description}
            </p>
            <Link to={`/law/${law.id}`} className="btn btn-outline" style={{ marginTop: 'auto', width: '100%', gap: '0.5rem' }}>
                <BookOpen size={16} />
                Read Full Law
            </Link>
        </div>
    );
};

export default LawCard;
