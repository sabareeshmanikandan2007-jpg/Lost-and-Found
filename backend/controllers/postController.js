const Post = require('../models/Post');
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

// Helper to upload image to Cloudinary using stream
const uploadImageToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'findy' },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

// Helper to delete image from Cloudinary
const deleteImageFromCloudinary = async (imageUrl) => {
  if (!imageUrl || !imageUrl.includes('res.cloudinary.com')) return;
  try {
    const parts = imageUrl.split('/');
    const lastPart = parts[parts.length - 1]; // e.g. xjzhq1a0h9o9jz.jpg
    const folder = parts[parts.length - 2]; // e.g. findy
    const fileName = lastPart.split('.')[0]; // e.g. xjzhq1a0h9o9jz
    
    const publicId = `${folder}/${fileName}`;
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error('Error deleting from Cloudinary:', err);
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

    // Attach image URLs (support legacy local urls just in case, though they will 404 on Vercel)
    const postsWithUrls = posts.map((post) => ({
      ...post,
      imageUrl: post.image && post.image.startsWith('http') 
        ? post.image 
        : (post.image ? `${req.protocol}://${req.get('host')}/uploads/${post.image}` : null),
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
      imageUrl: post.image && post.image.startsWith('http') 
        ? post.image 
        : (post.image ? `${req.protocol}://${req.get('host')}/uploads/${post.image}` : null),
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
  let uploadedImageUrl = null;
  try {
    const { title, description, type, category, location, date, contactName, contactEmail, contactPhone, status } = req.body;

    // Handle image upload to Cloudinary directly in memory stream
    if (req.file) {
      try {
        const result = await uploadImageToCloudinary(req.file.buffer);
        uploadedImageUrl = result.secure_url;
      } catch (uploadError) {
        return res.status(500).json({ success: false, message: 'Image upload failed' });
      }
    }

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
      image: uploadedImageUrl
    };

    const post = await Post.create(postData);

    const postWithUrl = {
      ...post.toObject(),
      imageUrl: post.image,
    };

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      post: postWithUrl,
    });
  } catch (error) {
    // If post creation fails, clean up uploaded image if exists
    if (uploadedImageUrl) {
      deleteImageFromCloudinary(uploadedImageUrl);
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
  let uploadedImageUrl = null;
  try {
    const existingPost = await Post.findById(req.params.id);

    if (!existingPost) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    // Ownership check (allow if post has no owner (demo) OR if current user is owner)
    if (existingPost.createdBy && existingPost.createdBy.toString() !== req.user.id) {
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
      try {
        const result = await uploadImageToCloudinary(req.file.buffer);
        uploadedImageUrl = result.secure_url;
        updateData.image = uploadedImageUrl;
        
        // Mark old image for deletion
        if (existingPost.image) {
          deleteImageFromCloudinary(existingPost.image); // Fire and forget deletion
        }
      } catch (uploadError) {
        return res.status(500).json({ success: false, message: 'Image upload failed' });
      }
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
      imageUrl: updatedPost.image && updatedPost.image.startsWith('http') 
        ? updatedPost.image 
        : (updatedPost.image ? `${req.protocol}://${req.get('host')}/uploads/${updatedPost.image}` : null),
    };

    res.json({
      success: true,
      message: 'Post updated successfully',
      post: postWithUrl,
    });
  } catch (error) {
    if (uploadedImageUrl) {
      deleteImageFromCloudinary(uploadedImageUrl);
    }
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
      imageUrl: post.image && post.image.startsWith('http') 
        ? post.image 
        : (post.image ? `${req.protocol}://${req.get('host')}/uploads/${post.image}` : null),
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

    // Delete associated image from Cloudinary
    if (post.image) {
      deleteImageFromCloudinary(post.image);
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
