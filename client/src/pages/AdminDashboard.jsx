import React, { useState, useEffect, useRef } from 'react';
import { getLaws, createLaw, deleteLaw, updateLaw, bulkCreateLaws } from '../services/api';
import { Trash2, Plus, Edit2, X, Save, FileText, Layers, Users, Upload, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';

const AdminDashboard = () => {
    const [laws, setLaws] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentLawId, setCurrentLawId] = useState(null);
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        content: '',
        explanation: '',
        pdf_url: '',
        media_urls: [],
        category_id: 1
    });

    useEffect(() => {
        loadLaws();
    }, []);

    const loadLaws = async () => {
        setLoading(true);
        try {
            const data = await getLaws();
            setLaws(data);
        } catch (error) {
            console.error("Failed to load laws", error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (law) => {
        setIsEditing(true);
        setCurrentLawId(law.id);
        setFormData({
            title: law.title,
            description: law.description,
            content: law.content,
            explanation: law.explanation || '',
            pdf_url: law.pdf_url || '',
            media_urls: typeof law.media_urls === 'string' ? JSON.parse(law.media_urls) : (law.media_urls || []),
            category_id: law.category_id || 1
        });
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this law? This action cannot be undone.")) {
            try {
                await deleteLaw(id);
                setLaws(laws.filter(law => law.id !== id));
            } catch (error) {
                alert("Failed to delete law: " + error.message);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await updateLaw(currentLawId, formData);
            } else {
                await createLaw(formData);
            }
            handleCloseForm();
            loadLaws();
        } catch (error) {
            alert(`Failed to ${isEditing ? 'update' : 'create'} law: ` + error.message);
        }
    };

    const downloadTemplate = () => {
        const template = [{
            title: "Article 14: Equality",
            category_id: 1,
            description: "Equality before law.",
            explanation: "Everyone is the same in the eyes of the law.",
            content: "The State shall not deny to any person equality...",
            media_urls: [],
            pdf_url: ""
        }];
        const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = "law_template.json";
        a.click();
    };

    const handleBulkUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const csvOrJson = event.target.result;
                const lawsArray = JSON.parse(csvOrJson.trim());
                if (Array.isArray(lawsArray)) {
                    await bulkCreateLaws(lawsArray);
                    alert(`${lawsArray.length} laws uploaded successfully!`);
                    loadLaws();
                } else {
                    alert("Invalid JSON format. Expected an array of laws.");
                }
            } catch (err) {
                console.error("JSON Parse Error:", err);
                alert("Error parsing file. Please use the Download Template button to get a valid file.");
            }
        };
        reader.readAsText(file);
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setIsEditing(false);
        setCurrentLawId(null);
        setFormData({ title: '', description: '', content: '', explanation: '', pdf_url: '', media_urls: [], category_id: 1 });
    };

    const addMediaUrl = () => {
        const url = prompt("Enter Image/Diagram URL:");
        if (url) {
            setFormData({ ...formData, media_urls: [...formData.media_urls, url] });
        }
    };

    return (
        <div className="container animate-fade-in" style={{ padding: '2rem 1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ marginBottom: '0.25rem' }}>Admin Dashboard</h1>
                    <p style={{ color: 'var(--secondary)' }}>Manage your legal digital repository (Rich Content Enabled)</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn btn-outline" onClick={downloadTemplate} style={{ gap: '0.5rem' }}>
                        <Download size={18} />
                        Get Template
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        accept=".json"
                        onChange={handleBulkUpload}
                    />
                    <button className="btn btn-outline" onClick={() => fileInputRef.current.click()} style={{ gap: '0.5rem' }}>
                        <Upload size={18} />
                        Bulk Upload (JSON)
                    </button>
                    {!showForm && (
                        <button className="btn btn-primary" onClick={() => setShowForm(true)} style={{ gap: '0.5rem' }}>
                            <Plus size={18} />
                            Add New Law
                        </button>
                    )}
                </div>
            </div>

            {/* Quick Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                {[
                    { label: 'Total Laws', value: laws.length, icon: <FileText size={20} />, color: '#1a365d' },
                    { label: 'Categories', value: 5, icon: <Layers size={20} />, color: '#c5a059' },
                    { label: 'Active Users', value: '12', icon: <Users size={20} />, color: '#1a365d' },
                ].map((stat, i) => (
                    <div key={i} className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ padding: '0.75rem', borderRadius: '50%', backgroundColor: stat.color + '10', color: stat.color }}>
                            {stat.icon}
                        </div>
                        <div>
                            <div style={{ fontSize: '0.875rem', color: 'var(--secondary)' }}>{stat.label}</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stat.value}</div>
                        </div>
                    </div>
                ))}
            </div>

            {showForm && (
                <div className="card" style={{ marginBottom: '2rem', borderTop: `4px solid ${isEditing ? 'var(--secondary)' : 'var(--primary)'}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '1.5rem' }}>{isEditing ? 'Update Legal Document' : 'Propose New Law'}</h2>
                        <button onClick={handleCloseForm} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--secondary)' }}>
                            <X size={24} />
                        </button>
                    </div>
                    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Official Title</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Indian Penal Code Section 302"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--foreground)' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Legal Domain</label>
                                <select
                                    value={formData.category_id}
                                    onChange={e => setFormData({ ...formData, category_id: e.target.value })}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--foreground)' }}
                                >
                                    <option value={1}>Constitutional Law</option>
                                    <option value={2}>Criminal Law</option>
                                    <option value={3}>Civil Law</option>
                                    <option value={4}>Corporate Law</option>
                                    <option value={5}>Family Law</option>
                                </select>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>PDF Link (Optional)</label>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <LinkIcon size={18} style={{ alignSelf: 'center', color: 'var(--secondary)' }} />
                                    <input
                                        type="url"
                                        placeholder="https://example.com/law.pdf"
                                        value={formData.pdf_url}
                                        onChange={e => setFormData({ ...formData, pdf_url: e.target.value })}
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--foreground)' }}
                                    />
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Diagrams / Images</label>
                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                    {formData.media_urls.map((url, i) => (
                                        <div key={i} style={{ position: 'relative', width: '40px', height: '40px', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                                            <img src={url} alt="Diagram" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, media_urls: formData.media_urls.filter((_, idx) => idx !== i) })}
                                                style={{ position: 'absolute', top: 0, right: 0, padding: 0, background: 'red', color: 'white', border: 'none', cursor: 'pointer', fontSize: '10px' }}>
                                                X
                                            </button>
                                        </div>
                                    ))}
                                    <button type="button" onClick={addMediaUrl} className="btn btn-outline" style={{ padding: '0.5rem' }}><ImageIcon size={18} /></button>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Easy Explanation (diagram descriptions)</label>
                            <textarea
                                placeholder="Explain this law in very simple terms for everyone to understand..."
                                value={formData.explanation}
                                onChange={e => setFormData({ ...formData, explanation: e.target.value })}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', minHeight: '100px', background: 'var(--background)', color: 'var(--foreground)' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Brief Summary</label>
                            <textarea
                                required
                                placeholder="A concise explanation of this legal provision..."
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', minHeight: '80px', background: 'var(--background)', color: 'var(--foreground)' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Full Statute / Content</label>
                            <textarea
                                required
                                placeholder="Paste the full text of the law/act here..."
                                value={formData.content}
                                onChange={e => setFormData({ ...formData, content: e.target.value })}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', minHeight: '250px', background: 'var(--background)', color: 'var(--foreground)', fontFamily: 'monospace' }}
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                            <button type="button" className="btn btn-outline" onClick={handleCloseForm}>Discard Changes</button>
                            <button type="submit" className="btn btn-primary" style={{ gap: '0.5rem' }}>
                                <Save size={18} />
                                {isEditing ? 'Apply Updates' : 'Publish Law'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="card" style={{ overflow: 'hidden', padding: 0 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left', backgroundColor: '#f1f5f9' }}>
                            <th style={{ padding: '1.25rem' }}>Statute Title</th>
                            <th style={{ padding: '1.25rem' }}>Domain</th>
                            <th style={{ padding: '1.25rem' }}>Features</th>
                            <th style={{ padding: '1.25rem', textAlign: 'right' }}>Management Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="4" style={{ padding: '3rem', textAlign: 'center' }}>Synchronizing repository...</td></tr>
                        ) : laws.length === 0 ? (
                            <tr><td colSpan="4" style={{ padding: '3rem', textAlign: 'center', color: 'var(--secondary)' }}>Your repository is empty. Start by adding a new law.</td></tr>
                        ) : (
                            laws.map(law => (
                                <tr key={law.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }}>
                                    <td style={{ padding: '1.25rem', fontWeight: '500' }}>{law.title}</td>
                                    <td style={{ padding: '1.25rem' }}>
                                        <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', borderRadius: '4px', backgroundColor: '#e2e8f0' }}>
                                            {law.category_name || 'General'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1.25rem' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            {law.pdf_url && <FileText size={16} title="PDF Attached" style={{ color: '#1a365d' }} />}
                                            {law.explanation && <Layers size={16} title="Easy Explanation" style={{ color: '#c5a059' }} />}
                                            {law.media_urls && JSON.parse(law.media_urls).length > 0 && <ImageIcon size={16} title="Diagrams Included" style={{ color: '#1a365d' }} />}
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.25rem', textAlign: 'right' }}>
                                        <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                                            <button
                                                onClick={() => handleEdit(law)}
                                                className="btn btn-outline"
                                                style={{ padding: '0.4rem', borderRadius: '4px' }}
                                                title="Edit Statute"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(law.id)}
                                                className="btn btn-outline"
                                                style={{ color: '#dc2626', borderColor: '#fee2e2', padding: '0.4rem', borderRadius: '4px' }}
                                                title="Delete Statute"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminDashboard;
