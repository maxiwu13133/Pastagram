const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const Schema = mongoose.Schema;

const commentSchema = new Schema({
  user_id: {
    type: ObjectId,
    required: true,
    ref: 'User'
  },
  post_id: {
    type: ObjectId,
    required: true,
    ref: 'Post'
  },
  text: {
    type: String,
    required: true
  },
  likes: [{
    type: ObjectId,
    required: true,
    default: [],
    ref: 'User'
  }]
}, { timestamps: true });

module.exports = mongoose.model('Comment', commentSchema);
