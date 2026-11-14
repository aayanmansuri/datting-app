const { S3Client } = require('@aws-sdk/client-s3');
const multer = require('multer');
const multerS3 = require('multer-s3');

// 1. S3 Client Initialize karo (Apna AWS Region yahan dalo, jaise ap-south-1)
const s3 = new S3Client({
  region: process.env.AWS_REGION || "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

// 2. Multer S3 Storage Configuration
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME || 'matchbox-media-storage-2026',
    acl: 'public-read', // Taaki upload hone ke baad photo publically dikh sake
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, 'uploads/' + Date.now().toString() + '-' + file.originalname);
    }
  })
});

module.exports = upload;
