const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const Schema = mongoose.Schema;

const replySchema = new Schema({
  user_id: {
    type: ObjectId,
    required: true,
    ref: 'User'
  },
  comment_id: {
    type: ObjectId,
    required: true,
    ref: 'Comment'
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

module.exports = mongoose.model('Reply', replySchema);
