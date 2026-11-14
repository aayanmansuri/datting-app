import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { Search, MessageCircle, User, Compass, LogOut, Heart, Send, Sparkles, ShieldCheck, MapPin, BadgeCheck, X, ChevronLeft, ChevronRight } from 'lucide-react';

const socket = io("http://localhost:5000");

const FALLBACK_MATCHES = [
  {
    id: 101, name: 'Priya Sharma', age: 23, gender: 'Female', distance: '2 km away', matchScore: '96%',
    bio: 'Coffee lover, startup enthusiast & late night drives ☕✨',
    photos: [
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=600&auto=format&fit=crop&q=80'
    ],
    online: true, aadhaar_verified: 1
  },
  {
    id: 102, name: 'Anjali Verma', age: 22, gender: 'Female', distance: '4 km away', matchScore: '92%',
    bio: 'Music, Pahad trips & street food explorer 🎵🏔️',
    photos: [
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&auto=format&fit=crop&q=80'
    ],
    online: true, aadhaar_verified: 1
  },
  {
    id: 103, name: 'Neha Singh', age: 25, gender: 'Female', distance: '1.5 km away', matchScore: '89%',
    bio: 'Fitness freak, UI designer & dog mom 💻🐶',
    photos: [
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1514315384763-ba401779410f?w=600&auto=format&fit=crop&q=80'
    ],
    online: false, aadhaar_verified: 1
  },
  {
    id: 104, name: 'Riya Kapoor', age: 24, gender: 'Female', distance: '5 km away', matchScore: '94%',
    bio: 'Bookworm by day, Bollywood dancer by night 📚💃',
    photos: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&auto=format&fit=crop&q=80'
    ],
    online: true, aadhaar_verified: 1
  }
];

function ProfileCard({ match, onChat, onLike }) {
  const [photoIdx, setPhotoIdx] = useState(0);
  const photoList = match.photos && match.photos.length > 0 
    ? match.photos 
    : ['https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&auto=format&fit=crop&q=80'];

  const nextPhoto = (e) => {
    e.stopPropagation();
    setPhotoIdx((prev) => (prev + 1) % photoList.length);
  };

  const prevPhoto = (e) => {
    e.stopPropagation();
    setPhotoIdx((prev) => (prev - 1 + photoList.length) % photoList.length);
  };

  return (
    <div className="group bg-[#0f1623] border border-white/10 rounded-3xl overflow-hidden shadow-2xl hover:border-rose-500/40 transition-all duration-300 flex flex-col">
      <div className="h-80 relative overflow-hidden select-none">
        {photoList.length > 1 && (
          <div className="absolute top-2.5 left-3 right-3 z-20 flex gap-1.5">
            {photoList.map((_, i) => (
              <div
                key={i}
                onClick={() => setPhotoIdx(i)}
                className={`h-1 flex-1 rounded-full cursor-pointer transition-all ${i === photoIdx ? 'bg-white shadow-sm' : 'bg-white/35'}`}
              />
            ))}
          </div>
        )}

        <img
          src={photoList[photoIdx]}
          alt={match.name}
          className="w-full h-full object-cover transition-all duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f1623] via-black/15 to-transparent pointer-events-none"></div>

        {photoList.length > 1 && (
          <>
            <button
              onClick={prevPhoto}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-black/45 hover:bg-black/75 p-1.5 rounded-full text-white opacity-0 group-hover:opacity-100 transition"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextPhoto}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-black/45 hover:bg-black/75 p-1.5 rounded-full text-white opacity-0 group-hover:opacity-100 transition"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        <div className="absolute top-6 left-4 right-4 flex items-center justify-between z-10 pointer-events-none">
          <span className="bg-black/55 backdrop-blur-md text-rose-300 text-xs font-bold px-3 py-1 rounded-full border border-white/10">
            {match.matchScore || '94%'} Match
          </span>
          {match.online && (
            <span className="bg-emerald-500/20 backdrop-blur-md text-emerald-300 text-xs px-2.5 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1.5">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span> Active
            </span>
          )}
        </div>

        <div className="absolute bottom-4 left-4 right-4 z-10 pointer-events-none">
          <h3 className="text-2xl font-bold flex items-center gap-1.5">
            {match.name}, {match.age}
            <BadgeCheck className="w-5 h-5 text-sky-400 fill-sky-400/20" />
          </h3>
          <p className="text-xs text-gray-300 flex items-center gap-1 mt-1">
            <MapPin className="w-3.5 h-3.5 text-rose-400" /> {match.distance || '2.5 km away'} • {match.gender}
          </p>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <p className="text-sm text-gray-300 leading-relaxed mb-5">{match.bio}</p>
        <div className="flex gap-3">
          <button
            onClick={() => onChat(match)}
            className="flex-1 bg-white/10 hover:bg-white/15 py-3 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 transition"
          >
            <MessageCircle className="w-4 h-4 text-rose-400" /> Chat
          </button>
          <button
            onClick={() => onLike(match)}
            className="w-12 h-12 bg-gradient-to-tr from-rose-500 to-pink-600 hover:scale-105 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-600/30 transition"
          >
            <Heart className="w-5 h-5 text-white fill-white" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [isLoginView, setIsLoginView] = useState(true);
  const [activeTab, setActiveTab] = useState('discover');
  
  const [formData, setFormData] = useState({ name: '', email: '', password: '', age: 24, gender: 'Male' });
  const [error, setError] = useState('');
  
  const [matches, setMatches] = useState(FALLBACK_MATCHES);
  const [searchQuery, setSearchQuery] = useState('');
  const [matchedModal, setMatchedModal] = useState(null);
  
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [activeChatUser, setActiveChatUser] = useState(FALLBACK_MATCHES[0]);
  
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiMessages, setAiMessages] = useState([
    { sender: 'ai', text: 'Hey! Main aapka AI Wingman hoon. Koi badhiya pickup line ya dating tip chahiye?' }
  ]);

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const endpoint = isLoginView ? '/api/auth/login' : '/api/auth/register';
      const res = await axios.post(`http://localhost:5000${endpoint}`, formData);
      if (res.data && res.data.user) setUser(res.data.user);
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication failed!');
    }
  };

  useEffect(() => {
    if (user) {
      axios.get('http://localhost:5000/api/matches')
        .then(res => {
          if (res.data.matches && res.data.matches.length > 0) {
            const others = res.data.matches.filter(m => m.email !== user.email);
            setMatches(others.length > 0 ? others : FALLBACK_MATCHES);
          }
        })
        .catch(() => setMatches(FALLBACK_MATCHES));
    }
  }, [user]);

  useEffect(() => {
    socket.on('chat_history', (history) => setMessages(history));
    socket.on('receive_message', (data) => setMessages(prev => [...prev, data]));
    return () => {
      socket.off('chat_history');
      socket.off('receive_message');
    };
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    socket.emit('send_message', { room: 'room_1', sender: user.name, text: newMessage });
    setNewMessage('');
  };

  const handleAiSend = (e) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;
    const userMsg = aiPrompt;
    setAiMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setAiPrompt('');
    setTimeout(() => {
      let reply = "Try this: 'Kya aap WiFi ho? Kyunki main aapke sath strong connection feel kar raha hoon! 😉'";
      if (userMsg.toLowerCase().includes('coffee')) reply = "Ye bhejo: 'Aaj sham ko filter coffee peene chalein? Meri taraf से!' ☕";
      setAiMessages(prev => [...prev, { sender: 'ai', text: reply }]);
    }, 600);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-950 via-slate-950 to-indigo-950 flex items-center justify-center p-4">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl w-full max-w-md text-white">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="p-2.5 bg-gradient-to-tr from-rose-500 to-pink-600 rounded-2xl shadow-lg shadow-rose-500/30">
              <Heart className="text-white fill-white w-7 h-7" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white to-rose-200 bg-clip-text text-transparent">DilSe</h1>
          </div>
          <h2 className="text-xl font-semibold text-center mb-6">{isLoginView ? 'Welcome Back!' : 'Find Your Vibe'}</h2>
          {error && <div className="bg-rose-500/20 border border-rose-500/50 text-rose-200 p-3 rounded-xl mb-4 text-sm">{error}</div>}
          <form onSubmit={handleAuth} className="space-y-4">
            {!isLoginView && (
              <div>
                <label className="text-xs uppercase tracking-wider text-rose-300 font-semibold">Full Name</label>
                <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full mt-1.5 p-3.5 bg-white/5 rounded-xl border border-white/10 focus:outline-none focus:border-rose-500 transition" placeholder="Aayan Mansuri" />
              </div>
            )}
            <div>
              <label className="text-xs uppercase tracking-wider text-rose-300 font-semibold">Email Address</label>
              <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full mt-1.5 p-3.5 bg-white/5 rounded-xl border border-white/10 focus:outline-none focus:border-rose-500 transition" placeholder="name@gmail.com" />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-rose-300 font-semibold">Password</label>
              <input type="password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full mt-1.5 p-3.5 bg-white/5 rounded-xl border border-white/10 focus:outline-none focus:border-rose-500 transition" placeholder="••••••" />
            </div>
            {!isLoginView && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs uppercase tracking-wider text-rose-300 font-semibold">Age</label>
                  <input type="number" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} className="w-full mt-1.5 p-3.5 bg-white/5 rounded-xl border border-white/10 focus:outline-none focus:border-rose-500" />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wider text-rose-300 font-semibold">Gender</label>
                  <select value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})} className="w-full mt-1.5 p-3.5 bg-slate-900 rounded-xl border border-white/10 focus:outline-none focus:border-rose-500">
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>
            )}
            <button type="submit" className="w-full py-3.5 bg-gradient-to-r from-rose-500 to-pink-600 rounded-xl font-bold shadow-lg shadow-rose-600/30 hover:scale-[1.01] transition">{isLoginView ? 'Login to DilSe' : 'Create Account'}</button>
          </form>
          <p className="text-center mt-6 text-sm text-gray-400 cursor-pointer hover:text-white transition" onClick={() => setIsLoginView(!isLoginView)}>
            {isLoginView ? "New here? Create an account" : "Already have an account? Login"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#090d16] text-white overflow-hidden font-sans">
      <div className="w-64 bg-[#0f1623] border-r border-white/5 flex flex-col justify-between p-6">
        <div>
          <div className="flex items-center gap-3 mb-10">
            <div className="p-2 bg-gradient-to-tr from-rose-500 to-pink-600 rounded-xl shadow-lg shadow-rose-500/20">
              <Heart className="text-white fill-white w-6 h-6" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight">DilSe</span>
          </div>
          <nav className="space-y-2">
            <button onClick={() => setActiveTab('discover')} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-medium transition ${activeTab === 'discover' ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg shadow-rose-600/25' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
              <Compass className="w-5 h-5" /> Discover
            </button>
            <button onClick={() => setActiveTab('chat')} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-medium transition ${activeTab === 'chat' ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg shadow-rose-600/25' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
              <MessageCircle className="w-5 h-5" /> Messages
            </button>
            <button onClick={() => setActiveTab('profile')} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-medium transition ${activeTab === 'profile' ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg shadow-rose-600/25' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
              <User className="w-5 h-5" /> My Profile
            </button>
          </nav>
        </div>

        <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-rose-500 to-purple-600 flex items-center justify-center font-bold text-sm">
              {user.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-sm flex items-center gap-1">
                {user.name}
                {user.aadhaar_verified ? <BadgeCheck className="w-4 h-4 text-sky-400" /> : null}
              </p>
              <p className="text-xs text-emerald-400">● Online</p>
            </div>
          </div>
          <button onClick={() => setUser(null)} className="text-gray-400 hover:text-rose-500 transition"><LogOut className="w-5 h-5" /></button>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-y-auto p-8 relative">
        <div className="flex items-center justify-between mb-8 bg-[#0f1623]/80 backdrop-blur-md p-4 rounded-2xl border border-white/5">
          <div className="flex items-center gap-3 w-1/2 bg-[#090d16] px-4 py-3 rounded-xl border border-white/10 focus-within:border-rose-500/50 transition">
            <Search className="w-5 h-5 text-gray-400" />
            <input type="text" placeholder="Search by name, vibe, or interest..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="bg-transparent border-none focus:outline-none w-full text-sm text-white" />
          </div>
          <button onClick={() => setAiChatOpen(!aiChatOpen)} className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3 rounded-xl text-sm font-semibold shadow-lg shadow-indigo-600/25 hover:scale-[1.02] transition">
            <Sparkles className="w-4 h-4" /> AI Wingman
          </button>
        </div>

        {activeTab === 'discover' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">🔥 Who's Nearby</h2>
              <span className="text-xs text-gray-400 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">Click arrows on photos to scroll</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {matches
                .filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()) || m.bio.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((match, i) => (
                  <ProfileCard
                    key={match.id || i}
                    match={match}
                    onChat={(m) => { setActiveChatUser(m); setActiveTab('chat'); }}
                    onLike={(m) => setMatchedModal(m)}
                  />
                ))}
            </div>
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="flex-1 flex bg-[#0f1623] border border-white/10 rounded-3xl overflow-hidden h-[calc(100vh-140px)]">
            <div className="w-72 border-r border-white/5 p-4 overflow-y-auto hidden md:block">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4 px-2">Your Matches</h3>
              <div className="space-y-2">
                {matches.map((m, idx) => (
                  <div
                    key={idx}
                    onClick={() => setActiveChatUser(m)}
                    className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition ${activeChatUser?.name === m.name ? 'bg-rose-500/20 border border-rose-500/30' : 'hover:bg-white/5'}`}
                  >
                    <img src={m.photos?.[0]} alt={m.name} className="w-11 h-11 rounded-full object-cover" />
                    <div>
                      <p className="font-semibold text-sm">{m.name}</p>
                      <p className="text-xs text-gray-400 truncate w-36">{m.bio}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1 flex flex-col">
              <div className="bg-[#090d16]/50 p-4 border-b border-white/5 flex items-center gap-3">
                <img src={activeChatUser?.photos?.[0]} alt="" className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <h3 className="font-semibold text-sm flex items-center gap-1">
                    {activeChatUser?.name || 'Live Room'} <BadgeCheck className="w-4 h-4 text-sky-400" />
                  </h3>
                  <p className="text-xs text-emerald-400">Online now</p>
                </div>
              </div>

              <div className="flex-1 p-6 overflow-y-auto space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 mt-20">
                    <p className="text-sm">Say hi to {activeChatUser?.name}! Need a line? Ask AI Wingman ✨</p>
                  </div>
                ) : (
                  messages.map((m, idx) => (
                    <div key={idx} className={`flex flex-col ${m.sender === user.name ? 'items-end' : 'items-start'}`}>
                      <span className="text-[11px] text-gray-500 mb-1 px-1">{m.sender}</span>
                      <div className={`px-4 py-3 rounded-2xl max-w-sm text-sm ${m.sender === user.name ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-br-none' : 'bg-white/10 text-gray-200 rounded-bl-none'}`}>
                        {m.text}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <form onSubmit={sendMessage} className="p-4 bg-[#090d16]/50 border-t border-white/5 flex gap-3">
                <input type="text" placeholder="Type a sweet message..." value={newMessage} onChange={e => setNewMessage(e.target.value)} className="flex-1 bg-white/5 border border-white/10 px-4 py-3 rounded-2xl focus:outline-none focus:border-rose-500 text-sm" />
                <button type="submit" className="bg-gradient-to-r from-rose-500 to-pink-600 px-6 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-600/20 hover:opacity-95 transition"><Send className="w-5 h-5" /></button>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="max-w-xl bg-[#0f1623] border border-white/10 p-8 rounded-3xl shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">My Profile Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs uppercase text-gray-400 font-semibold">Full Name</label>
                <input type="text" disabled value={user.name} className="w-full mt-1.5 p-3.5 bg-[#090d16] rounded-xl border border-white/10 text-gray-300" />
              </div>
              <div>
                <label className="text-xs uppercase text-gray-400 font-semibold">Email Address</label>
                <input type="text" disabled value={user.email} className="w-full mt-1.5 p-3.5 bg-[#090d16] rounded-xl border border-white/10 text-gray-300" />
              </div>
              <div className="p-5 bg-[#090d16] rounded-2xl border border-white/10 mt-4">
                <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-rose-500" /> Identity Verification
                </h3>
                {user.aadhaar_verified ? (
                  <p className="text-emerald-400 text-sm font-medium flex items-center gap-1.5">
                    <BadgeCheck className="w-4 h-4 text-sky-400" /> Your profile has the Verified Blue Badge!
                  </p>
                ) : (
                  <div className="space-y-3 mt-3">
                    <input type="text" id="verifyInput" maxLength="12" placeholder="Enter 12-digit ID number" className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-rose-500" />
                    <button
                      onClick={async () => {
                        const val = document.getElementById('verifyInput').value;
                        try {
                          const res = await axios.post('http://localhost:5000/api/auth/verify-aadhaar', { userId: user.id, aadhaarNumber: val });
                          if (res.data.success) setUser({ ...user, aadhaar_verified: 1 });
                        } catch (err) {
                          alert(err.response?.data?.error || 'Verification failed');
                        }
                      }}
                      className="w-full bg-gradient-to-r from-rose-500 to-pink-600 py-3 rounded-xl text-sm font-semibold transition"
                    >
                      Get Verified Badge
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {matchedModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-b from-rose-950 to-[#0f1623] border border-rose-500/30 p-8 rounded-3xl max-w-sm w-full text-center relative shadow-2xl">
              <button onClick={() => setMatchedModal(null)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
              <div className="inline-block p-3 bg-rose-500/20 rounded-full mb-4">
                <Heart className="w-10 h-10 text-rose-500 fill-rose-500 animate-bounce" />
              </div>
              <h2 className="text-3xl font-extrabold bg-gradient-to-r from-rose-400 to-pink-300 bg-clip-text text-transparent mb-2">It's a Match!</h2>
              <p className="text-sm text-gray-300 mb-6">You and <span className="font-bold text-white">{matchedModal.name}</span> liked each other.</p>
              <img src={matchedModal.photos?.[0]} alt={matchedModal.name} className="w-28 h-28 rounded-full object-cover mx-auto border-4 border-rose-500 shadow-xl mb-6" />
              <button
                onClick={() => { setActiveChatUser(matchedModal); setMatchedModal(null); setActiveTab('chat'); }}
                className="w-full py-3.5 bg-gradient-to-r from-rose-500 to-pink-600 rounded-2xl font-bold shadow-lg shadow-rose-600/30 mb-3"
              >
                Send a Message
              </button>
              <button onClick={() => setMatchedModal(null)} className="text-xs text-gray-400 hover:text-white">Keep Browsing</button>
            </div>
          </div>
        )}

        {aiChatOpen && (
          <div className="fixed bottom-6 right-6 w-80 bg-[#0f1623] border border-indigo-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col z-50">
            <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-white font-semibold text-sm">
                <Sparkles className="w-4 h-4" /> AI Wingman
              </div>
              <button onClick={() => setAiChatOpen(false)} className="text-white/80 hover:text-white font-bold">✕</button>
            </div>
            <div className="h-64 p-4 overflow-y-auto space-y-3 text-xs">
              {aiMessages.map((m, idx) => (
                <div key={idx} className={`p-3 rounded-2xl leading-relaxed ${m.sender === 'ai' ? 'bg-indigo-950/60 text-indigo-200 border border-indigo-500/20' : 'bg-white/10 text-white ml-auto max-w-[80%]'}`}>
                  {m.text}
                </div>
              ))}
            </div>
            <form onSubmit={handleAiSend} className="p-3 bg-[#090d16] border-t border-white/10 flex gap-2">
              <input type="text" placeholder="Ask for a pickup line..." value={aiPrompt} onChange={e => setAiPrompt(e.target.value)} className="flex-1 bg-white/5 border border-white/10 px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-indigo-500" />
              <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 px-3 rounded-xl"><Send className="w-4 h-4 text-white" /></button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
