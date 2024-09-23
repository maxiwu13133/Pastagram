const Comment = require('../models/commentModel');
const Post = require('../models/postModel');
const User = require('../models/userModel');


// get comment by id
const getComments = async (req, res) => {
  const id = req.params.id;

  try {
    const comment = await Comment.findOne({ _id: id });
    const user = await User.findOne({ _id: comment.user_id });
    
    res.status(200).json({ comment, username: user.username, pfp: user.pfp });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}


// create comment
const createComment = async (req, res) => {
  const { post: p, text } = req.body;
  const user = req.user;

  try {

    const comment = await Comment.create({ user_id: user._id, post_id: p._id, text });
    const post = await Post.findOne({ _id: p._id });

    const updateComments = { comments: post.comments.concat(comment) };
    const newPost = await Post.findOneAndUpdate({ _id:  p._id }, updateComments, { new: true });
    
    res.status(200).json({ newComments: newPost.comments });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}


// like and unlike a comment
const likeComment = async (req, res) => {
  const { commentId, userId } = req.body;

  try {

    const comment = await Comment.findOne({ _id: commentId });

    if (comment.likes.includes(userId)) {
      const updateLikes = { likes: comment.likes.filter(user => !user.equals(userId)) };
      const newComment = await Comment.findOneAndUpdate({ _id: commentId }, updateLikes, { new: true });
      return res.status(200).json({ newComment });
    }
    const updateLikes = { likes: comment.likes.concat(userId) };

    const newComment = await Comment.findOneAndUpdate({ _id: commentId }, updateLikes, { new: true });

    res.status(200).json({ newComment });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}


// delete comment
const deleteComment = async (req, res) => {
  const { commentId, postId } = req.body;

  try {
    await Comment.deleteOne({ _id: commentId });
    const post = await Post.findOne({ _id: postId });

    const updatedComments = { comments: post.comments.filter(comment => !comment._id.equals(commentId)) };
    const newPost = await Post.findOneAndUpdate({ _id: postId }, updatedComments, { new: true });
      
    res.status(200).json({ newPost }); 
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}


// info of users who liked the comment
const likedInfo = async (req, res) => {
  const commentId = req.params.id;

  try {
    const comment = await Comment.findOne({ _id: commentId });
    
    const users = [];

    for (const userId of comment.likes) {
      const user = await User.findOne({ _id: userId });
      users.push({ username: user.username, fullName: user.fullName, pfp: user.pfp, followers: user.followers });
    }

    res.status(200).json({ users });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}


module.exports = { getComments, createComment, likeComment, deleteComment, likedInfo };