import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import LawDetail from './pages/LawDetail';
import AdminDashboard from './pages/AdminDashboard';
import { MessageCircle, X, Send, ExternalLink, Loader2 } from 'lucide-react';
import { searchLaws } from './services/api';
import ProtectedRoute from './components/ProtectedRoute';
import { Link, useNavigate } from 'react-router-dom';

import Register from './pages/Register';
import Login from './pages/Login';
import Bookmarks from './pages/Bookmarks';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello! I am your legal assistant. How can I help you today?", isBot: true }
  ]);
  const [input, setInput] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    const userMsg = { text: userText, isBot: false };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      // Small delay for natural feel
      await new Promise(resolve => setTimeout(resolve, 500));

      const results = await searchLaws(userText);

      let botResponse;
      if (results && results.length > 0) {
        botResponse = (
          <div>
            <p>I found {results.length} relevant legal provision{results.length > 1 ? 's' : ''}:</p>
            <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {results.slice(0, 3).map(law => (
                <div
                  key={law.id}
                  onClick={() => {
                    navigate(`/law/${law.id}`);
                    setIsOpen(false);
                  }}
                  style={{
                    fontSize: '0.85rem',
                    background: 'rgba(255,255,255,0.1)',
                    padding: '0.4rem',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.5rem'
                  }}
                >
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{law.title}</span>
                  <ExternalLink size={12} flexShrink={0} />
                </div>
              ))}
            </div>
            {results.length > 3 && <p style={{ fontSize: '0.75rem', marginTop: '0.4rem', opacity: 0.8 }}>And {results.length - 3} more...</p>}
          </div>
        );
      } else {
        botResponse = "I couldn't find any specific laws matching that. Try searching for 'Constitution', 'Theft', or 'Rights'.";
      }

      setMessages(prev => [...prev, { text: botResponse, isBot: true }]);
    } catch (error) {
      console.error("Chatbot search failed", error);
      setMessages(prev => [...prev, { text: "Sorry, I'm having trouble connecting to the legal database right now.", isBot: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 50 }}>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="btn btn-primary"
          style={{ borderRadius: '999px', width: '3.5rem', height: '3.5rem', padding: 0, boxShadow: 'var(--shadow)' }}
        >
          <MessageCircle size={24} />
        </button>
      )}

      {isOpen && (
        <div className="card animate-fade-in" style={{ width: '350px', height: '500px', display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)', background: 'var(--primary)', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1rem', color: 'white' }}>Legal Assistant</h3>
            <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: 'white' }}>
              <X size={20} />
            </button>
          </div>

          <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {messages.map((msg, idx) => (
              <div key={idx} style={{
                alignSelf: msg.isBot ? 'flex-start' : 'flex-end',
                background: msg.isBot ? 'var(--secondary)' : 'var(--primary)',
                color: 'white',
                padding: '0.75rem',
                borderRadius: '1rem',
                borderBottomLeftRadius: msg.isBot ? '0' : '1rem',
                borderBottomRightRadius: msg.isBot ? '1rem' : '0',
                maxWidth: '80%'
              }}>
                {msg.text}
              </div>
            ))}
            {isLoading && (
              <div style={{ alignSelf: 'flex-start', background: 'var(--secondary)', color: 'white', padding: '0.5rem 1rem', borderRadius: '1rem', borderBottomLeftRadius: 0 }}>
                <Loader2 size={16} className="animate-spin" />
              </div>
            )}
          </div>

          <form onSubmit={handleSend} style={{ padding: '0.75rem', borderTop: '1px solid var(--border)', display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              className="input"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask about a law..."
              disabled={isLoading}
              style={{ flex: 1, padding: '0.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--foreground)' }}
            />
            <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem' }} disabled={isLoading}>
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1, position: 'relative' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/law/:id" element={<LawDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/bookmarks"
            element={
              <ProtectedRoute>
                <Bookmarks />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Chatbot />
      </main>
      <Footer />
    </div>
  );
}

export default App;
