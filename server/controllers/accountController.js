const User = require('../models/userModel');
const validator = require('validator');

// get account info
const getAccountInfo = async (req, res) => {
  const user = req.user;

  try {
    const info = await User.findOne({ _id: user._id });

    res.status(200).json({ info });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// update profile
const updateUser = async (req, res) => {
  const { email, fullName, username, bio, picture, user_username } = req.body;
  const user_id = req.user._id;

  try {
    // validation
    const emailExists = await User.findOne({ email });
    if (!validator.isEmail(email) || emailExists && !emailExists._id.equals(user_id)) {
      throw Error('Email is unavailable');
    }
    const usernameExists = await User.findOne({ username });
    if (usernameExists && !(usernameExists.username === user_username)) {
      throw Error('Username is unavailable');
    }
    const updateInfo = picture ? { email, fullName, username, bio, picture } : { email, fullName, username, bio};
    const updatedUser = await User.findOneAndUpdate({ _id: user_id }, updateInfo, { new: true });
    
    res.status(200).json({ username: updatedUser.username, picture: updatedUser.picture })
  } catch (error) {
    res.status(400).json({ error: error.message });
  }

}


module.exports = { getAccountInfo, updateUser };