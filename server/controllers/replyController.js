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
    const reply = await Reply.create({ user_id: user._id, comment_id: comment, text });

    
    res.status(200).json({ reply });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}


// user info for reply
const getUserInfo = async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findOne({ _id: userId });

    res.status(200).json({ username: user.username, pfp: user.pfp.url });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}


// like and unlike a reply
const handleLike = async (req, res) => {
  const { replyId, userId } = req.body;

  try {

    const reply = await Reply.findOne({ _id: replyId });

    if (reply.likes.includes(userId)) {
      const updateLikes = { likes: reply.likes.filter(user => !user.equals(userId)) };
      const newReply = await Reply.findOneAndUpdate({ _id: replyId }, updateLikes, { new: true });
      return res.status(200).json({ newReply });
    }
    const updateLikes = { likes: reply.likes.concat(userId) };

    const newReply = await Reply.findOneAndUpdate({ _id: replyId }, updateLikes, { new: true });

    res.status(200).json({ newReply });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}


// delete comment
const deleteReply = async (req, res) => {
  const { replyId } = req.body;

  try {
    const reply = await Reply.findOne({ _id: replyId });
    console.log(reply);
      
    res.status(200).json({  }); 
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}


module.exports = { getReplies, createReply, deleteReply, getUserInfo, handleLike };