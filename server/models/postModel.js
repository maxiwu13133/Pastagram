const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const Schema = mongoose.Schema;

const postSchema = new Schema({
  user_id: {
    type: ObjectId,
    required: true
  },
  photo: {
    type: String,
    required: true
  },
  caption: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);
