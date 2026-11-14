const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const upload = require('./utils/s3Service');

app.use(express.json());

app.get('/', (req, res) => {
  res.send('MatchBox Backend is running and connected to S3!');
});

// S3 Media Upload Endpoint
app.post('/api/upload', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    res.status(200).json({
      message: 'File successfully uploaded to S3!',
      imageUrl: req.file.location, // S3 file ka direct public URL
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
