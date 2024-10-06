const User = require('../models/userModel');


// get saved posts of user
const getSaved = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findOne({ _id: userId });

    res.status(200).json({ saved: user.saved });
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
    res.status(400).json({ error: error,message });
  }
}


// remove post from saved
const removeSaved = async (req, res) => {
  const { userId, postId } = req.body;

  try {
    const user = await User.findOne({ _id: userId });
    const newSaved = { saved: user.saved.filter(save => !save.equals(postId)) };
    await User.findOneAndUpdate({ _id: userId }, newSaved, { new: true });

    res.status(200).json({ newSaved: newSaved.saved });
  } catch (error) {
    res.status(400).json({ error: error,message });
  }
}


module.exports = {
  getSaved,
  addSaved,
  removeSaved
};
