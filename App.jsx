import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { Search, MessageCircle, User, Compass, LogOut, Heart, Send, Sparkles, ShieldCheck } from 'lucide-react';

const socket = io();

const FALLBACK_MATCHES = [
  {
    id: 101, name: 'Priya Sharma', age: 23, gender: 'Female', distance: '2 km away', matchScore: '95%',
    bio: 'Coffee lover, startup enthusiast & late night drives ☕✨',
    photos: [
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=600&auto=format&fit=crop'
    ],
    online: true, aadhaar_verified: 1
  },
  {
    id: 102, name: 'Anjali Verma', age: 22, gender: 'Female', distance: '4 km away', matchScore: '91%',
    bio: 'Music, Pahad trips & street food explorer 🎵🏔️',
    photos: [
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&auto=format&fit=crop'
    ],
    online: true, aadhaar_verified: 1
  },
  {
    id: 103, name: 'Neha Singh', age: 25, gender: 'Female', distance: '1.5 km away', matchScore: '88%',
    bio: 'Fitness freak, UI designer & dog mom 💻🐶',
    photos: [
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1514315384763-ba401779410f?w=600&auto=format&fit=crop'
    ],
    online: false, aadhaar_verified: 1
  },
  {
    id: 104, name: 'Riya Kapoor', age: 24, gender: 'Female', distance: '5 km away', matchScore: '85%',
    bio: 'Bookworm by day, Bollywood dancer by night 📚💃',
    photos: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&auto=format&fit=crop'
    ],
    online: true, aadhaar_verified: 1
  }
];

export default function App() {
  const [user, setUser] = useState(null);
  const [isLogin, setIsLogin] = useState(false);
  const [activeTab, setActiveTab] = useState('discover');
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '', age: 24, gender: 'Male' });
  const [error, setError] = useState('');
  const [matches] = useState(FALLBACK_MATCHES);
  const [currentPhotoIdx, setCurrentPhotoIdx] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const endpoint = isLogin ? '/api/login' : '/api/register';
      const res = await axios.post(endpoint, formData);
      if (res.data.success) {
        setUser(res.data.user);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed!');
    }
  };

  const nextPhoto = (id, max) => {
    setCurrentPhotoIdx(prev => ({
      ...prev,
      [id]: ((prev[id] || 0) + 1) % max
    }));
  };

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#0B0F19', color: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'sans-serif' }}>
        <div style={{ width: '100%', maxWidth: '400px', padding: '30px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <h1 style={{ color: '#ec4899', fontSize: '28px', margin: 0 }}>DilSe ❤️</h1>
            <p style={{ color: '#9ca3af', fontSize: '14px' }}>Find Your Vibe</p>
          </div>

          {error && <div style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid #ef4444', color: '#fca5a5', padding: '10px', borderRadius: '8px', marginBottom: '15px', fontSize: '14px', textAlign: 'center' }}>{error}</div>}

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div style={{ marginBottom: '15px' }}>
                <label style={{ fontSize: '12px', color: '#f472b6', display: 'block', marginBottom: '5px' }}>FULL NAME</label>
                <input type="text" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} required style={{ width: '100%', padding: '10px', background: '#1f2937', border: '1px solid #374151', borderRadius: '8px', color: '#fff' }} />
              </div>
            )}

            <div style={{ marginBottom: '15px' }}>
              <label style={{ fontSize: '12px', color: '#f472b6', display: 'block', marginBottom: '5px' }}>EMAIL ADDRESS</label>
              <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required style={{ width: '100%', padding: '10px', background: '#1f2937', border: '1px solid #374151', borderRadius: '8px', color: '#fff' }} />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ fontSize: '12px', color: '#f472b6', display: 'block', marginBottom: '5px' }}>PASSWORD</label>
              <input type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required style={{ width: '100%', padding: '10px', background: '#1f2937', border: '1px solid #374151', borderRadius: '8px', color: '#fff' }} />
            </div>

            {!isLogin && (
              <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '12px', color: '#f472b6', display: 'block', marginBottom: '5px' }}>AGE</label>
                  <input type="number" value={formData.age} onChange={(e) => setFormData({...formData, age: e.target.value})} style={{ width: '100%', padding: '10px', background: '#1f2937', border: '1px solid #374151', borderRadius: '8px', color: '#fff' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '12px', color: '#f472b6', display: 'block', marginBottom: '5px' }}>GENDER</label>
                  <select value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})} style={{ width: '100%', padding: '10px', background: '#1f2937', border: '1px solid #374151', borderRadius: '8px', color: '#fff' }}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>
            )}

            <button type="submit" style={{ width: '100%', padding: '12px', background: 'linear-gradient(to right, #db2777, #f43f5e)', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>
              {isLogin ? 'Login' : 'Create Account'}
            </button>

            <p style={{ textAlign: 'center', marginTop: '15px', fontSize: '13px', color: '#9ca3af', cursor: 'pointer' }} onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
            </p>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0B0F19', color: '#fff', display: 'flex', fontFamily: 'sans-serif' }}>
      {/* Sidebar */}
      <div style={{ width: '260px', background: '#111827', borderRight: '1px solid #1f2937', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '30px' }}>
            <span style={{ fontSize: '24px' }}>❤️</span>
            <h1 style={{ fontSize: '22px', color: '#ec4899', margin: 0 }}>DilSe</h1>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button onClick={() => setActiveTab('discover')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: activeTab === 'discover' ? '#db2777' : 'transparent', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer', textAlign: 'left', width: '100%' }}>
              <Compass size={18} /> Discover
            </button>
            <button onClick={() => setActiveTab('messages')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: activeTab === 'messages' ? '#db2777' : 'transparent', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer', textAlign: 'left', width: '100%' }}>
              <MessageCircle size={18} /> Messages
            </button>
            <button onClick={() => setActiveTab('profile')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: activeTab === 'profile' ? '#db2777' : 'transparent', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer', textAlign: 'left', width: '100%' }}>
              <User size={18} /> My Profile
            </button>
          </div>
        </div>

        <div style={{ borderTop: '1px solid #1f2937', paddingTop: '15px', display: 'flex', alignItems: 'center', justifyContent: 'between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#db2777', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
              {user.fullName?.[0] || 'A'}
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{user.fullName || 'Aayan'}</div>
              <div style={{ fontSize: '11px', color: '#10b981' }}>● Online</div>
            </div>
          </div>
          <button onClick={() => setUser(null)} style={{ background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer' }} title="Log Out">
            <LogOut size={18} />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, padding: '30px', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <div style={{ position: 'relative', width: '400px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#9ca3af' }} />
            <input type="text" placeholder="Search by name, vibe, interests..." style={{ width: '100%', padding: '10px 10px 10px 40px', background: '#1f2937', border: '1px solid #374151', borderRadius: '8px', color: '#fff' }} />
          </div>

          <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', background: 'linear-gradient(to right, #8b5cf6, #ec4899)', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>
            <Sparkles size={16} /> AI Wingman
          </button>
        </div>

        {activeTab === 'discover' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '20px', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>🔥 Who's Nearby</h2>
              <span style={{ fontSize: '12px', color: '#9ca3af' }}>Click arrows on photos to scroll</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', maxWidth: '500px' }}>
              {matches.map((m) => {
                const curIdx = currentPhotoIdx[m.id] || 0;
                return (
                  <div key={m.id} style={{ background: '#111827', borderRadius: '16px', border: '1px solid #1f2937', overflow: 'hidden', position: 'relative' }}>
                    <div style={{ position: 'relative', height: '450px', cursor: 'pointer' }} onClick={() => nextPhoto(m.id, m.photos.length)}>
                      <img src={m.photos[curIdx]} alt={m.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      
                      {/* Match Badge */}
                      <div style={{ position: 'absolute', top: '15px', left: '15px', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)', padding: '6px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold', color: '#f472b6' }}>
                        {m.matchScore} Match
                      </div>

                      {/* Active Status */}
                      <div style={{ position: 'absolute', top: '15px', right: '15px', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        ● Active
                      </div>
                    </div>

                    <div style={{ padding: '20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
                        <h3 style={{ margin: 0, fontSize: '20px' }}>{m.name}, {m.age}</h3>
                        {m.aadhaar_verified === 1 && <ShieldCheck size={18} color="#3b82f6" title="Verified Profile" />}
                      </div>
                      <p style={{ color: '#9ca3af', fontSize: '13px', margin: '0 0 15px 0' }}>📍 {m.distance} • {m.gender}</p>
                      <p style={{ fontSize: '14px', marginBottom: '20px' }}>{m.bio}</p>

                      <div style={{ display: 'flex', gap: '15px' }}>
                        <button style={{ flex: 1, padding: '12px', background: '#1f2937', border: '1px solid #374151', borderRadius: '10px', color: '#fff', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}>
                          <MessageCircle size={18} /> Chat
                        </button>
                        <button style={{ width: '48px', height: '48px', background: '#db2777', border: 'none', borderRadius: '10px', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                          <Heart size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'messages' && (
          <div>
            <h2>Messages</h2>
            <p style={{ color: '#9ca3af' }}>Your active conversations will appear here.</p>
          </div>
        )}

        {activeTab === 'profile' && (
          <div>
            <h2>My Profile</h2>
            <div style={{ background: '#111827', padding: '20px', borderRadius: '12px', border: '1px solid #1f2937', maxWidth: '400px', marginTop: '15px' }}>
              <p><strong>Name:</strong> {user.fullName || 'Aayan'}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Age:</strong> {user.age || 24}</p>
              <p><strong>Gender:</strong> {user.gender || 'Male'}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
