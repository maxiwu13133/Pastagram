const Post = require('../models/postModel');
const User = require('../models/userModel');
const cloudinary = require('cloudinary').v2;

// create post
const createPost2 = async (req, res) => {
  const user = req.user;
  const { photos, caption } = req.body;

  try {
    const post = await Post.create({ user_id: user._id, photos, caption });

    res.status(200).json({ post });
  } catch (error) {
    res.status(400).json({ error: error.message });
  };
};

// upload and create post
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});


const createPost = async (req, res) => {
  const user = req.user;
  const { files, caption } = req.body;
  const images = [];

  try {

    for (let file of files) {
      const response = await cloudinary.uploader.upload(file);
      images.push({ public_id: response.public_id, url: response.url });
    }

    const post = await Post.create({user_id: user._id, photos: images, caption });

    res.status(200).json({ post });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

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

// delete post
const deletePost = async (req, res) => {
  const post = req.body;

  try {

    for (let photo of post.photos) {
      await cloudinary.uploader.destroy(photo.public_id);
    };

    const response = await Post.deleteOne({ _id: post._id})
    
    res.status(200).json({ result: response });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = { createPost, getPosts, deletePost };
