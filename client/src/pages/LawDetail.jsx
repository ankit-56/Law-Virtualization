import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getLawById, toggleBookmark, getUserBookmarks } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Bookmark, Download, CheckCircle, ExternalLink, Info, Image as ImageIcon } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const LawDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [law, setLaw] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [bookmarkLoading, setBookmarkLoading] = useState(false);

    useEffect(() => {
        const fetchLaw = async () => {
            try {
                const data = await getLawById(id);
                setLaw(data);

                if (user) {
                    const bookmarks = await getUserBookmarks(user.id);
                    const bookmarked = bookmarks.some(b => b.id === parseInt(id));
                    setIsBookmarked(bookmarked);
                }
            } catch (error) {
                console.error("Failed to fetch law details", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLaw();
    }, [id, user]);

    const handleBookmark = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        setBookmarkLoading(true);
        try {
            await toggleBookmark({ user_id: user.id, law_id: law.id });
            setIsBookmarked(!isBookmarked);
        } catch (error) {
            console.error("Failed to toggle bookmark", error);
        } finally {
            setBookmarkLoading(false);
        }
    };

    const handleDownloadPDF = async () => {
        const input = document.getElementById('full-law-document');
        if (!input) return;

        try {
            const canvas = await html2canvas(input);
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`${law.title}.pdf`);
        } catch (error) {
            console.error("Failed to download PDF", error);
        }
    };

    if (loading) return <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>Loading legal document...</div>;
    if (!law) return <div className="container" style={{ padding: '4rem', textAlign: 'center' }}><h2>Law not found</h2><Link to="/" className="btn btn-primary" style={{ marginTop: '1rem' }}>Go Home</Link></div>;

    const mediaUrls = law.media_urls ? (typeof law.media_urls === 'string' ? JSON.parse(law.media_urls) : law.media_urls) : [];

    return (
        <div className="container animate-fade-in" style={{ padding: '2rem 1rem' }}>
            <Link to="/" className="btn btn-outline" style={{ marginBottom: '2rem', gap: '0.5rem', display: 'inline-flex' }}>
                <ArrowLeft size={16} /> Back to Repository
            </Link>

            <div id="full-law-document">
                <article className="card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                        <div>
                            <span className="badge" style={{
                                backgroundColor: 'var(--primary)',
                                color: 'white',
                                padding: '0.25rem 0.75rem',
                                borderRadius: '999px',
                                fontSize: '0.875rem',
                                display: 'inline-block',
                                marginBottom: '0.5rem'
                            }}>
                                {law.category_name || 'General'}
                            </span>
                            <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{law.title}</h1>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            {law.pdf_url && (
                                <a href={law.pdf_url} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ gap: '0.5rem' }}>
                                    <ExternalLink size={20} />
                                    Original PDF
                                </a>
                            )}
                            <button onClick={handleDownloadPDF} className="btn btn-primary" style={{ gap: '0.5rem' }}>
                                <Download size={20} />
                                Generate PDF
                            </button>
                            <button
                                onClick={handleBookmark}
                                disabled={bookmarkLoading}
                                className={`btn ${isBookmarked ? 'btn-primary' : 'btn-outline'}`}
                                style={{ gap: '0.5rem' }}
                            >
                                {isBookmarked ? <CheckCircle size={20} /> : <Bookmark size={20} />}
                                {isBookmarked ? 'Bookmarked' : 'Bookmark'}
                            </button>
                        </div>
                    </div>

                    <div style={{ color: 'var(--secondary)', marginBottom: '1.5rem', fontStyle: 'italic', fontSize: '1.2rem', borderLeft: '4px solid var(--primary)', paddingLeft: '1rem' }}>
                        {law.description}
                    </div>

                    {/* Rich Content: Explanation & Diagrams */}
                    {(law.explanation || mediaUrls.length > 0) && (
                        <div style={{ backgroundColor: '#fcf8f0', borderRadius: 'var(--radius)', padding: '1.5rem', marginBottom: '2rem', border: '1px solid #c5a05950' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#c5a059', marginBottom: '1rem', fontWeight: 'bold' }}>
                                <Info size={20} />
                                EASY EXPLANATION & VISUALS
                            </div>

                            {mediaUrls.length > 0 && (
                                <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', marginBottom: '1.5rem', paddingBottom: '0.5rem' }}>
                                    {mediaUrls.map((url, i) => (
                                        <div key={i} style={{ flex: '0 0 auto', width: '300px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border)', backgroundColor: 'white' }}>
                                            <img src={url} alt={`Diagram ${i + 1}`} style={{ width: '100%', height: '180px', objectFit: 'contain' }} />
                                            <div style={{ padding: '0.5rem', fontSize: '0.75rem', textAlign: 'center', color: 'var(--secondary)' }}>
                                                Diagram/Visual {i + 1}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div style={{ lineHeight: '1.6', color: '#1a365d', fontSize: '1.05rem' }}>
                                {law.explanation}
                            </div>
                        </div>
                    )}

                    <div id="law-content" className="law-content" style={{
                        lineHeight: '2',
                        whiteSpace: 'pre-wrap',
                        padding: '1.5rem',
                        backgroundColor: '#f8fafc',
                        borderRadius: 'var(--radius)',
                        border: '1px solid var(--border)',
                        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)',
                        fontFamily: 'serif',
                        fontSize: '1.1rem'
                    }}>
                        {law.content}
                    </div>
                </article>
            </div>
        </div>
    );
};

export default LawDetail;
