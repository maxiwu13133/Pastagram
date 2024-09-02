const User = require('../models/userModel');
const validator = require('validator');
const cloudinary = require('cloudinary').v2;


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


// upload pfp and update profile
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const updateUser = async (req, res) => {
  const { email, fullName, username, bio, pfp, user_username, pfpChanged } = req.body;
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
    
    if (pfpChanged) {
      const response = await cloudinary.uploader.upload(pfp);
      const image = { public_id: response.public_id, url: response.url };

      const updateInfo = { email, fullName, username, bio, pfp: image };
      const updatedUser = await User.findOneAndUpdate({ _id: user_id }, updateInfo, { new: true });
      
      res.status(200).json({ username: updatedUser.username, hello: "hello", pfp: updatedUser.pfp });
      return;
    }
    const updateInfo = { email, fullName, username, bio, pfp: pfp };
    const updatedUser = await User.findOneAndUpdate({ _id: user_id }, updateInfo, { new: true });

    res.status(200).json({ username: updatedUser.username, pfp: updatedUser.pfp });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}


// delete pfp from cloudinary
const deletePfp = async (req, res) => {
  const user_id = req.user._id;

  try {
    const user = await User.findOne({ _id: user_id });
    const public_id = user.pfp.public_id;
    if (public_id) {
      const response = await cloudinary.uploader.destroy(public_id);
      res.status(200).json({ result: response.result });
      return;
    }
    res.status(200).json({ result: "ok" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = { getAccountInfo, updateUser, deletePfp };