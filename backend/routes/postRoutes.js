const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const {
  getPosts,
  getStats,
  getPost,
  createPost,
  updatePost,
  resolvePost,
  deletePost,
} = require('../controllers/postController');

// Multer storage configuration
const storage = multer.memoryStorage();

// File filter — allow only images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extValid = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeValid = allowedTypes.test(file.mimetype.split('/')[1]);

  if (extValid && mimeValid) {
    cb(null, true);
  } else {
    cb(new Error('Only JPG, JPEG, PNG, and WEBP images are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

// Multer error handler middleware
const handleUpload = (req, res, next) => {
  const uploadSingle = upload.single('image');
  uploadSingle(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ success: false, message: 'File size must be less than 5 MB' });
      }
      return res.status(400).json({ success: false, message: err.message });
    } else if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    next();
  });
};

const { protect } = require('../middleware/authMiddleware');

// Routes
router.get('/stats', getStats);
router.get('/', getPosts);
router.get('/:id', getPost);
router.post('/', protect, handleUpload, createPost);
router.put('/:id', protect, handleUpload, updatePost);
router.patch('/:id/resolve', protect, resolvePost);
router.delete('/:id', protect, deletePost);

module.exports = router;
