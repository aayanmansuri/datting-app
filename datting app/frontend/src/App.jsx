import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { Search, MessageCircle, User, Compass, LogOut, Heart, Send, Sparkles, ShieldCheck } from 'lucide-react';

const socket = io();

const FALLBACK_MATCHES = [
  { id: 1, name: 'Priya Sharma', age: 22, location: 'Delhi', vibe: 'Coffee & Code ☕', match: '95%', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80' },
  { id: 2, name: 'Ananya Verma', age: 23, location: 'Noida', vibe: 'Music & Midnight Drives 🌙', match: '91%', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=500&q=80' },
  { id: 3, name: 'Neha Singh', age: 21, location: 'Gurugram', vibe: 'Art, Books & Chai 📚', match: '88%', image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=500&q=80' }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('discover');
  const [user, setUser] = useState({ fullName: 'Aayan', email: 'aayanmansuri3336@gmail.com' });
  const [matches] = useState(FALLBACK_MATCHES);
  const [messages, setMessages] = useState([
    { sender: 'Priya', text: 'Hey Aayan! Loved your DevOps setup 🚀', time: '10:42 AM' }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const sendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    setMessages([...messages, { sender: 'You', text: inputMessage, time: 'Just now' }]);
    setInputMessage('');
  };

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#0b0f19', color: '#fff', fontFamily: 'sans-serif', overflow: 'hidden' }}>
      {/* Sidebar */}
      <div style={{ width: '260px', background: '#111827', borderRight: '1px solid #1f2937', display: 'flex', flexDirection: 'column', padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '30px' }}>
          <span style={{ fontSize: '24px' }}>❤️</span>
          <h1 style={{ fontSize: '22px', fontWeight: 'bold', background: 'linear-gradient(to right, #ec4899, #f43f5e)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 }}>DilSe</h1>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
          <button onClick={() => setActiveTab('discover')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px', border: 'none', background: activeTab === 'discover' ? '#db2777' : 'transparent', color: '#fff', cursor: 'pointer', textAlign: 'left', fontWeight: '500' }}>
            <Compass size={20} /> Discover
          </button>
          <button onClick={() => setActiveTab('chat')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px', border: 'none', background: activeTab === 'chat' ? '#db2777' : 'transparent', color: '#fff', cursor: 'pointer', textAlign: 'left', fontWeight: '500' }}>
            <MessageCircle size={20} /> Chats & AI
          </button>
          <button onClick={() => setActiveTab('profile')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px', border: 'none', background: activeTab === 'profile' ? '#db2777' : 'transparent', color: '#fff', cursor: 'pointer', textAlign: 'left', fontWeight: '500' }}>
            <User size={20} /> Profile
          </button>
        </div>

        <div style={{ borderTop: '1px solid #1f2937', paddingTop: '15px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: '14px', fontWeight: 'bold', margin: 0 }}>{user.fullName}</p>
            <p style={{ fontSize: '11px', color: '#9ca3af', margin: 0 }}>Online & Ready 🚀</p>
          </div>
          <button onClick={() => setUser(null)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }} title="Log Out">
            <LogOut size={18} />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        {activeTab === 'discover' && (
          <div style={{ padding: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
              <div>
                <h2 style={{ fontSize: '26px', fontWeight: 'bold', margin: 0 }}>Discover Vibe 🌟</h2>
                <p style={{ color: '#9ca3af', fontSize: '14px', margin: '5px 0 0 0' }}>Find people matching your frequency around you.</p>
              </div>
              <div style={{ background: 'rgba(236, 72, 153, 0.1)', border: '1px solid #ec4899', padding: '8px 16px', borderRadius: '20px', color: '#f472b6', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={16} /> AI Wingman Active
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
              {matches.map((match) => (
                <div key={match.id} style={{ background: '#111827', borderRadius: '16px', overflow: 'hidden', border: '1px solid #1f2937', position: 'relative' }}>
                  <img src={match.image} alt={match.name} style={{ width: '100%', height: '320px', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', top: '15px', right: '15px', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)', padding: '4px 10px', borderRadius: '20px', color: '#34d399', fontSize: '12px', fontWeight: 'bold' }}>
                    {match.match} Match
                  </div>
                  <div style={{ padding: '20px' }}>
                    <h3 style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 5px 0' }}>{match.name}, {match.age}</h3>
                    <p style={{ color: '#9ca3af', fontSize: '13px', margin: '0 0 15px 0' }}>📍 {match.location} • {match.vibe}</p>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button style={{ flex: 1, padding: '10px', background: '#1f2937', border: 'none', borderRadius: '10px', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>Pass</button>
                      <button style={{ flex: 1, padding: '10px', background: 'linear-gradient(to right, #ec4899, #f43f5e)', border: 'none', borderRadius: '10px', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>Connect ❤️</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'chat' && (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '20px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '15px' }}>Messages & AI Wingman 💬</h2>
            <div style={{ flex: 1, background: '#111827', borderRadius: '16px', border: '1px solid #1f2937', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', overflowY: 'auto' }}>
                {messages.map((m, idx) => (
                  <div key={idx} style={{ alignSelf: m.sender === 'You' ? 'flex-end' : 'flex-start', background: m.sender === 'You' ? '#db2777' : '#1f2937', padding: '12px 18px', borderRadius: '12px', maxWidth: '70%' }}>
                    <p style={{ fontSize: '12px', color: '#fbcfe8', margin: '0 0 4px 0' }}>{m.sender}</p>
                    <p style={{ margin: 0, fontSize: '14px' }}>{m.text}</p>
                  </div>
                ))}
              </div>
              <form onSubmit={sendMessage} style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                <input type="text" value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} placeholder="Type a message or ask AI Wingman..." style={{ flex: 1, padding: '12px 16px', background: '#1f2937', border: '1px solid #374151', borderRadius: '12px', color: '#fff', outline: 'none' }} />
                <button type="submit" style={{ background: '#db2777', border: 'none', padding: '0 20px', borderRadius: '12px', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Send size={18} />
                </button>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div style={{ padding: '40px', maxWidth: '600px' }}>
            <h2 style={{ fontSize: '26px', fontWeight: 'bold', marginBottom: '20px' }}>Your DilSe Profile 👤</h2>
            <div style={{ background: '#111827', padding: '30px', borderRadius: '16px', border: '1px solid #1f2937', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#f472b6', display: 'block', marginBottom: '5px' }}>FULL NAME</label>
                <input type="text" value={user.fullName} readOnly style={{ width: '100%', padding: '12px', background: '#1f2937', border: '1px solid #374151', borderRadius: '8px', color: '#fff' }} />
              </div>
              <div>
                <label style={{ fontSize: '12px', color: '#f472b6', display: 'block', marginBottom: '5px' }}>EMAIL</label>
                <input type="email" value={user.email} readOnly style={{ width: '100%', padding: '12px', background: '#1f2937', border: '1px solid #374151', borderRadius: '8px', color: '#fff' }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#34d399', fontSize: '14px' }}>
                <ShieldCheck size={20} /> Verified DevOps & Cloud Profile Active
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
