const Post = require('../models/Post');
const path = require('path');
const fs = require('fs');

// Helper to build image URL
const getImageUrl = (req, filename) => {
  if (!filename) return null;
  return `${req.protocol}://${req.get('host')}/uploads/${filename}`;
};

// Helper to delete image file
const deleteImageFile = (filename) => {
  if (!filename) return;
  // Handle both full paths and just filenames
  const fname = path.basename(filename);
  const filePath = path.join(__dirname, '..', 'uploads', fname);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

// @desc    Get all posts with search, filter, pagination
// @route   GET /api/posts
// @access  Public
const getPosts = async (req, res, next) => {
  try {
    const { search, category, type, status, sort = 'newest', page = 1, limit = 12 } = req.query;

    const query = {};

    // Search filter
    if (search && search.trim()) {
      query.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
        { location: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    // Category filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // Type filter (Lost/Found)
    if (type && type !== 'All') {
      query.type = type;
    }

    // Status filter
    if (status && status !== 'All') {
      query.status = status;
    }

    // Sort
    const sortOrder = sort === 'oldest' ? { createdAt: 1 } : { createdAt: -1 };

    // Pagination
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [posts, total] = await Promise.all([
      Post.find(query).sort(sortOrder).skip(skip).limit(limitNum).lean(),
      Post.countDocuments(query),
    ]);

    // Attach image URLs
    const postsWithUrls = posts.map((post) => ({
      ...post,
      imageUrl: post.image ? `${req.protocol}://${req.get('host')}/uploads/${path.basename(post.image)}` : null,
    }));

    res.json({
      success: true,
      count: postsWithUrls.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      posts: postsWithUrls,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get statistics for dashboard
// @route   GET /api/posts/stats
// @access  Public
const getStats = async (req, res, next) => {
  try {
    const [total, lost, found, resolved] = await Promise.all([
      Post.countDocuments(),
      Post.countDocuments({ type: 'Lost' }),
      Post.countDocuments({ type: 'Found' }),
      Post.countDocuments({ status: 'Resolved' }),
    ]);

    res.json({
      success: true,
      stats: { total, lost, found, resolved },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single post
// @route   GET /api/posts/:id
// @access  Public
const getPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).lean();

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const postWithUrl = {
      ...post,
      imageUrl: post.image ? `${req.protocol}://${req.get('host')}/uploads/${path.basename(post.image)}` : null,
    };

    res.json({ success: true, post: postWithUrl });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid post ID' });
    }
    next(error);
  }
};

// @desc    Create new post
// @route   POST /api/posts
// @access  Public
const createPost = async (req, res, next) => {
  try {
    const { title, description, type, category, location, date, contactName, contactEmail, contactPhone, status } = req.body;

    // Build post data
    const postData = {
      title,
      description,
      type,
      category,
      location,
      date,
      contactName,
      contactEmail,
      contactPhone: contactPhone || null,
      status: status || 'Active',
      createdBy: req.user ? req.user._id : null,
    };

    // Handle image upload
    if (req.file) {
      postData.image = req.file.filename;
    }

    const post = await Post.create(postData);

    const postWithUrl = {
      ...post.toObject(),
      imageUrl: post.image ? `${req.protocol}://${req.get('host')}/uploads/${post.image}` : null,
    };

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      post: postWithUrl,
    });
  } catch (error) {
    // If post creation fails, clean up uploaded file
    if (req.file) {
      deleteImageFile(req.file.filename);
    }
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    next(error);
  }
};

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Public
const updatePost = async (req, res, next) => {
  try {
    const existingPost = await Post.findById(req.params.id);

    if (!existingPost) {
      // Clean up uploaded file if post not found
      if (req.file) deleteImageFile(req.file.filename);
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    // Ownership check (allow if post has no owner (demo) OR if current user is owner)
    if (existingPost.createdBy && existingPost.createdBy.toString() !== req.user.id) {
       if (req.file) deleteImageFile(req.file.filename);
       return res.status(403).json({ success: false, message: 'Not authorized to update this item' });
    }


    const { title, description, type, category, location, date, contactName, contactEmail, contactPhone, status } = req.body;

    const updateData = {
      title,
      description,
      type,
      category,
      location,
      date,
      contactName,
      contactEmail,
      contactPhone: contactPhone || null,
      status,
    };

    // Handle image update
    if (req.file) {
      // Delete old image if exists
      if (existingPost.image) {
        deleteImageFile(existingPost.image);
      }
      updateData.image = req.file.filename;
    }

    // Remove undefined fields
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] === undefined) delete updateData[key];
    });

    const updatedPost = await Post.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    }).lean();

    const postWithUrl = {
      ...updatedPost,
      imageUrl: updatedPost.image
        ? `${req.protocol}://${req.get('host')}/uploads/${path.basename(updatedPost.image)}`
        : null,
    };

    res.json({
      success: true,
      message: 'Post updated successfully',
      post: postWithUrl,
    });
  } catch (error) {
    if (req.file) deleteImageFile(req.file.filename);
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid post ID' });
    }
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    next(error);
  }
};

// @desc    Resolve a post
// @route   PATCH /api/posts/:id/resolve
// @access  Public
const resolvePost = async (req, res, next) => {
  try {
    const existingPost = await Post.findById(req.params.id);
    if (!existingPost) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    if (existingPost.createdBy && existingPost.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to resolve this item' });
    }

    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { status: 'Resolved' },
      { new: true, runValidators: true }
    ).lean();

    const postWithUrl = {
      ...post,
      imageUrl: post.image ? `${req.protocol}://${req.get('host')}/uploads/${path.basename(post.image)}` : null,
    };

    res.json({
      success: true,
      message: 'Post marked as resolved',
      post: postWithUrl,
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid post ID' });
    }
    next(error);
  }
};

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Public
const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    // Ownership Check
    if (post.createdBy && post.createdBy.toString() !== req.user.id) {
       return res.status(403).json({ success: false, message: 'Not authorized to delete this item' });
    }

    // Delete associated image file
    if (post.image) {
      deleteImageFile(post.image);
    }

    await Post.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Post deleted successfully',
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid post ID' });
    }
    next(error);
  }
};

module.exports = {
  getPosts,
  getStats,
  getPost,
  createPost,
  updatePost,
  resolvePost,
  deletePost,
};
