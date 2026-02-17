import React, { useState, useEffect } from 'react';
import { getLaws, createLaw, deleteLaw, updateLaw } from '../services/api';
import { Trash2, Plus, Edit2, X, Save, FileText, Layers, Users } from 'lucide-react';

const AdminDashboard = () => {
    const [laws, setLaws] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentLawId, setCurrentLawId] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        content: '',
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

    const handleCloseForm = () => {
        setShowForm(false);
        setIsEditing(false);
        setCurrentLawId(null);
        setFormData({ title: '', description: '', content: '', category_id: 1 });
    };

    return (
        <div className="container animate-fade-in" style={{ padding: '2rem 1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ marginBottom: '0.25rem' }}>Admin Dashboard</h1>
                    <p style={{ color: 'var(--secondary)' }}>Manage your legal digital repository</p>
                </div>
                {!showForm && (
                    <button className="btn btn-primary" onClick={() => setShowForm(true)} style={{ gap: '0.5rem' }}>
                        <Plus size={18} />
                        Add New Law
                    </button>
                )}
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
                            <th style={{ padding: '1.25rem' }}>Last Modified</th>
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
                                    <td style={{ padding: '1.25rem', fontSize: '0.875rem', color: 'var(--secondary)' }}>
                                        {new Date(law.created_at).toLocaleDateString()}
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
