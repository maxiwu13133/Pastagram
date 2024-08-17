const Post = require('../models/postModel');

// create post
const createPost = async (req, res) => {
  const user = req.user;
  const { photos, caption } = req.body;

  try {
    const post = await Post.create({ user_id: user._id, photos, caption });

    res.status(200).json({ post });
  } catch (error) {
    res.status(400).json({ error: error.message });
  };
};

module.exports = { createPost };
