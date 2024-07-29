const Post = require('../models/postModel');

const createPost = async (req, res) => {
  const { photo, caption } = req.body;

  // if (!photo) {
  //   return res.status(400).json({ error: 'Please upload a photo' })
  // }

  try {
    const user_id = req.user._id;
    const post = await Post.create({ user_id, photo, caption });
    res.status(200).json(post);

  } catch (error) {
    res.status(400).json({ error: error.message });
  };
};

module.exports = { createPost };
