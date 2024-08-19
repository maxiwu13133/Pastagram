const Post = require('../models/postModel');
const User = require('../models/userModel');

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

// get all posts
const getPosts = async (req, res) => {
  const params = req.params;
  try {
    const user = await User.findOne({ username: params.username });
    const posts = await Post.find({ user_id: user._id});

    res.status(200).json({ posts });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = { createPost, getPosts };
