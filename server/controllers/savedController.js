const User = require('../models/userModel');
const Post = require('../models/postModel');


// get saved posts of user
const getSaved = async (req, res) => {
  const self = req.user;

  try {
    const user = await User.findOne({ _id: self._id });
    const saved = []

    for (const save of user.saved) {
      const post = await Post.findOne({ _id: save });
      saved.push(post);
    }

    res.status(200).json({ saved });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}


// add post to saved
const addSaved = async (req, res) => {
  const { postId } = req.body;
  const self = req.user;

  try {
    const user = await User.findOne({ _id: self._id });
    const newSaved = { saved: user.saved.concat(postId) };
    await User.findOneAndUpdate({ _id: self._id }, newSaved, { new: true });

    res.status(200).json({ newSaved: newSaved.saved });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}


// remove post from saved
const removeSaved = async (req, res) => {
  const { postId } = req.body;
  const self = req.user;

  try {
    const user = await User.findOne({ _id: self._id });
    const newSaved = { saved: user.saved.filter(save => !save.equals(postId)) };
    await User.findOneAndUpdate({ _id: self._id }, newSaved, { new: true });

    res.status(200).json({ newSaved: newSaved.saved });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}


module.exports = {
  getSaved,
  addSaved,
  removeSaved
};
