const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const Schema = mongoose.Schema;

const postSchema = new Schema({
  user_id: {
    type: ObjectId,
    required: true
  },
  photos: [{
    type: String
  }],
  caption: {
    type: String
  },
  comments: [{
    type: ObjectId, 
    ref: 'Comment'
  }],
  likes: [{
    type: ObjectId,
    ref: 'User'
  }]
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);
