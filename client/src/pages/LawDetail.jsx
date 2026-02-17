import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getLawById, toggleBookmark, getUserBookmarks } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Bookmark, Download, CheckCircle } from 'lucide-react';
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

                // Check if bookmarked if user is logged in
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
        const input = document.getElementById('law-content');
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

    if (loading) return <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>Loading...</div>;
    if (!law) return <div className="container" style={{ padding: '4rem', textAlign: 'center' }}><h2>Law not found</h2><Link to="/" className="btn btn-primary" style={{ marginTop: '1rem' }}>Go Home</Link></div>;

    return (
        <div className="container animate-fade-in" style={{ padding: '2rem 1rem' }}>
            <Link to="/" className="btn btn-outline" style={{ marginBottom: '2rem', gap: '0.5rem', display: 'inline-flex' }}>
                <ArrowLeft size={16} /> Back to Laws
            </Link>

            <article className="card" style={{ padding: '2rem' }}>
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
                        <h1 style={{ fontSize: '2rem' }}>{law.title}</h1>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={handleDownloadPDF} className="btn btn-primary" style={{ gap: '0.5rem' }} title="Download PDF">
                            <Download size={20} />
                            PDF
                        </button>
                        <button
                            onClick={handleBookmark}
                            disabled={bookmarkLoading}
                            className={`btn ${isBookmarked ? 'btn-primary' : 'btn-outline'}`}
                            style={{ gap: '0.5rem' }}
                            title={isBookmarked ? "Remove Bookmark" : "Bookmark"}
                        >
                            {isBookmarked ? <CheckCircle size={20} /> : <Bookmark size={20} />}
                            {isBookmarked ? 'Bookmarked' : 'Bookmark'}
                        </button>
                    </div>
                </div>

                <div style={{ color: 'var(--secondary)', marginBottom: '2rem', fontStyle: 'italic', fontSize: '1.1rem' }}>
                    {law.description}
                </div>

                <div id="law-content" className="law-content" style={{ lineHeight: '1.8', whiteSpace: 'pre-wrap', padding: '1rem', backgroundColor: 'var(--card)' }}>
                    {law.content}
                </div>
            </article>
        </div>
    );
};

export default LawDetail;
