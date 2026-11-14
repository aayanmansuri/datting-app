const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) console.error('DB Error:', err.message);
  else {
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT UNIQUE,
      password TEXT,
      age INTEGER,
      gender TEXT,
      bio TEXT,
      photos TEXT,
      aadhaar_verified INTEGER DEFAULT 0
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      room TEXT,
      sender TEXT,
      text TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, () => {
      db.get(`SELECT COUNT(*) as count FROM users`, (err, row) => {
        if (row && row.count <= 1) {
          const defaultUsers = [
            [
              'Priya Sharma', 'priya@gmail.com', '123456', 23, 'Female',
              'Coffee lover, startup enthusiast & late night drives ☕✨',
              JSON.stringify([
                'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=600&auto=format&fit=crop&q=80'
              ])
            ],
            [
              'Anjali Verma', 'anjali@gmail.com', '123456', 22, 'Female',
              'Music, Pahad trips & street food explorer 🎵🏔️',
              JSON.stringify([
                'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&auto=format&fit=crop&q=80'
              ])
            ],
            [
              'Neha Singh', 'neha@gmail.com', '123456', 25, 'Female',
              'Fitness freak, UI designer & dog mom 💻🐶',
              JSON.stringify([
                'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=600&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1514315384763-ba401779410f?w=600&auto=format&fit=crop&q=80'
              ])
            ],
            [
              'Riya Kapoor', 'riya@gmail.com', '123456', 24, 'Female',
              'Bookworm by day, Bollywood dancer by night 📚💃',
              JSON.stringify([
                'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&auto=format&fit=crop&q=80'
              ])
            ]
          ];
          const stmt = db.prepare(`INSERT OR IGNORE INTO users (name, email, password, age, gender, bio, photos, aadhaar_verified) VALUES (?, ?, ?, ?, ?, ?, ?, 1)`);
          defaultUsers.forEach(u => stmt.run(u));
          stmt.finalize();
        }
      });
    });
  }
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, password, age, gender } = req.body;
  const bio = 'New on DilSe! Looking for good vibes ✨';
  const photos = JSON.stringify([
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop&q=80'
  ]);
  db.run(`INSERT INTO users (name, email, password, age, gender, bio, photos) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [name, email, password, age, gender, bio, photos],
    function(err) {
      if (err) return res.status(400).json({ error: 'Email already registered!' });
      res.json({ user: { id: this.lastID, name, email, age, gender, bio, photos: JSON.parse(photos), aadhaar_verified: 0 } });
    }
  );
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  db.get(`SELECT * FROM users WHERE email = ? AND password = ?`, [email, password], (err, user) => {
    if (err || !user) return res.status(401).json({ error: 'Invalid credentials!' });
    user.photos = user.photos ? JSON.parse(user.photos) : [];
    res.json({ user });
  });
});

app.get('/api/matches', (req, res) => {
  db.all(`SELECT id, name, email, age, gender, bio, photos, aadhaar_verified, 1 as online FROM users`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch matches' });
    const formatted = rows.map(r => ({
      ...r,
      photos: r.photos ? JSON.parse(r.photos) : []
    }));
    res.json({ matches: formatted });
  });
});

app.post('/api/auth/verify-aadhaar', (req, res) => {
  const { userId, aadhaarNumber } = req.body;
  if (!aadhaarNumber || aadhaarNumber.length !== 12) return res.status(400).json({ error: 'Invalid 12-digit ID.' });
  db.run(`UPDATE users SET aadhaar_verified = 1 WHERE id = ?`, [userId], function(err) {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json({ success: true });
  });
});

io.on('connection', (socket) => {
  db.all(`SELECT sender, text FROM messages ORDER BY id ASC LIMIT 50`, [], (err, rows) => {
    if (!err && rows) socket.emit('chat_history', rows);
  });
  socket.on('send_message', (data) => {
    db.run(`INSERT INTO messages (room, sender, text) VALUES (?, ?, ?)`, [data.room || 'room_1', data.sender, data.text], (err) => {
      if (!err) io.emit('receive_message', data);
    });
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`DilSe Backend running on port ${PORT}`));
