const express = require('express');
const upload = require('../utils/uploadConfig');
const authMiddleware = require('../middleware/authMiddleware');
const requireRole = require('../middleware/roleMiddleware');
const { uploadImage, uploadMultipleImages } = require('../controllers/uploadController');

const router = express.Router();

const handleUploadError = (res, err) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ success: false, message: 'Each image must be 5 MB or smaller' });
  }
  if (err.code === 'LIMIT_FILE_COUNT') {
    return res.status(400).json({ success: false, message: 'Maximum 4 images allowed per upload' });
  }
  return res.status(400).json({ success: false, message: err.message || 'Upload failed' });
};

const singleUpload = (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) return handleUploadError(res, err);
    next();
  });
};

const multipleUpload = (req, res, next) => {
  upload.array('images', 4)(req, res, (err) => {
    if (err) return handleUploadError(res, err);
    next();
  });
};

router.use(authMiddleware, requireRole('admin'));

// Single image — useful for service image or one knife photo
router.post('/', singleUpload, uploadImage);

// Up to 4 images — useful when creating/editing a knife
router.post('/multiple', multipleUpload, uploadMultipleImages);

module.exports = router;
