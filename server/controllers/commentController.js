const Comment = require('../models/commentModel');
const Post = require('../models/postModel');

// get comment by id
const getComments = async (req, res) => {
  const id = req.params.id;

  try {
    const comment = await Comment.findOne({ _id: id });

    res.status(200).json({ comment });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// create comment
const createComment = async (req, res) => {
  const { post: p, text } = req.body;
  const user = req.user;

  try {

    const comment = await Comment.create({ user_id: user._id, text, likes: 0 });
    const post = await Post.findOne({ _id: p._id });

    const updateComments = { comments: post.comments.concat(comment) };
    const newPost = await Post.findOneAndUpdate({ _id:  p._id }, updateComments, { new: true });

    res.status(200).json({ newPost });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}


module.exports = { getComments, createComment };