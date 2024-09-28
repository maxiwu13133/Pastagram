const Reply = require('../models/replyModel');
const Comment = require('../models/commentModel');
const Post = require('../models/postModel');
const User = require('../models/userModel');


// get replies of comment
const getReplies = async (req, res) => {
  const commentId = req.params.id;

  try {
    const replies = await Reply.find({ comment_id: commentId });
    
    res.status(200).json({ replies });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}


// create reply
const createReply = async (req, res) => {
  const { comment, text } = req.body;
  const user = req.user;

  try {
    const reply = await Reply.create({ user_id: user._id, comment_id: comment._id, text });

    
    res.status(200).json({ reply });
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


module.exports = { getReplies, createReply };