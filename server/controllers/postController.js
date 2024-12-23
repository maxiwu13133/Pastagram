const Post = require('../models/postModel');
const User = require('../models/userModel');
const Comment = require('../models/commentModel');
const Reply = require('../models/replyModel');
const cloudinary = require('cloudinary').v2;


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
    
    // remove from cloudinary
    for (let photo of post.photos) {
      await cloudinary.uploader.destroy(photo.public_id);
    };

    // delete replies of comments of post
    const comments = await Comment.find({ post_id: post._id });

    for (const comment of comments) {
      await Reply.deleteMany({ comment_id: comment._id });
    }

    const response = await Post.deleteOne({ _id: post._id})
    await Comment.deleteMany({ post_id: post._id });

    // remove deleted post from user saved 
    const usersSaved = await User.find({ saved: { $in: post._id } });
    
    for (const user of usersSaved) {
      const updatedInfo = { saved: user.saved.filter(x => !x.equals(post._id)) };
      await User.findOneAndUpdate({ _id: user._id }, updatedInfo);
    }
    
    res.status(200).json({ result: response });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}


// like and unlike a post
const likePost = async (req, res) => {
  const { id, username } = req.body;

  try {
    const user = await User.findOne({ username });
    const post = await Post.findOne({ _id: id });

    if (post.likes.includes(user._id)) {
      const updatedPost = { likes: post.likes.filter(like => !like.equals(user._id)) };
      const newPost = await Post.findOneAndUpdate({ _id: id }, updatedPost, { new: true });

      return res.status(200).json({ newPost, result: 'unliked' });
    }

    const updatedPost = { likes: post.likes.concat(user._id) };
    const newPost = await Post.findOneAndUpdate({ _id: id }, updatedPost, { new: true });


    res.status(200).json({ newPost, result: 'liked' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}


// get post likes
const getPostLikes = async (req, res) => {
  const postId = req.params.id;

  try {
    const post = await Post.findOne({ _id: postId });
    const users = [];

    for (const userId of post.likes) {
      const user = await User.findOne({ _id: userId });
      users.push({
        username: user.username, fullName: user.fullName, pfp: user.pfp, followers: user.followers,
        deleted: user.deleted, _id: user._id
      });
    }

    res.status(200).json({ users })
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}


// get friend posts
const getFriendPosts = async (req, res) => {
  const userId = req.user._id;

  try {
    const user = await User.findOne({ _id: userId });
    let allPosts = [];
    const friends = {};
    
    for (const following of user.following) {
      const posts = await Post.find({ user_id: following });
      allPosts = allPosts.concat(posts);

      const friend = await User.findOne({ _id: following });
      friends[friend._id] = { username: friend.username, pfp: friend.pfp };
    }

    res.status(200).json({ allPosts, friends });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }

}


// get user info of post
const getInfo = async (req, res) => {
  const user_id = req.params.user_id;

  try {
    const user = await User.findOne({ _id: user_id });

    res.status(200).json({ username: user.username, pfp: user.pfp });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}


module.exports = { createPost, getPosts, deletePost, likePost, getPostLikes, getFriendPosts, getInfo };
