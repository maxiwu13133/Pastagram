const Post = require('../models/postModel');

// create post
const createPost = async (req, res) => {
  const user = req.user;

  try {

    res.status(200).json({ data: req.body })
  } catch (error) {
    res.status(400).json({ error: error.message });
  };
};

module.exports = { createPost };
