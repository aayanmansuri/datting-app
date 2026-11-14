const express = require('express');
const app = express(); // <--- Yeh line sabse upar honi zaroori hai!
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.send('MatchBox Backend is running and connected to S3!');
});

// Server start karne wali line hamesha aakhir mein honi chahiye
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
