const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const validator = require('validator');

// User session expires after 6 hrs
const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: '6h' });
}

// Find username from email
const findUsername = async (identifier) => {
  if (validator.isEmail(identifier)) {
    const user = await User.findOne({ email: identifier });
    return (user.username);
  }

  return (identifier);
}


// login user
const loginUser = async (req, res) => {
  const { identifier, password } = req.body;

  try {
    const user = await User.login(identifier, password);
    // create a token
    const token = createToken(user._id);
    const username = await findUsername(identifier);

    res.status(200).json({ username, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  };
}


// signup user
const signupUser = async (req, res) => {
  const { email, fullName, username, password } = req.body;

  try {
    const user = await User.signup(email, fullName, username, password);

    // create a token
    const token = createToken(user._id);

    res.status(200).json({ username, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  };
}


// get community
const getCommunity = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username });
    
    res.status(200).json({ followers: user.followers, following: user.following });
  } catch (error) {
    res.status(400).json({ error: error.message });
  };
}


// follow user
const followUser = async (req, res) => {
  const { username, targetUsername } = req.body;

  // Update following list of user
  const user = await User.findOne({ username });
  const target = await User.findOne({ username: targetUsername });

  if (user.following.includes(target._id)) {
    return res.status(400).json({ error: 'User already followed' });
  }
  const updateFollowing = { following: user.following.concat(target._id) };
  const updatedUser = await User.findOneAndUpdate({ username }, updateFollowing, { new: true });
  
  // Update followers list of target
  const updateFollowers = { followers: target.followers.concat(user._id) };
  await User.findOneAndUpdate({ username: targetUsername }, updateFollowers);

  res.status(200).json({ updatedUser });
}


// unfollow user
const unfollowUser = async (req, res) => {
  const { username, targetUsername } = req.body;

  // Update following list of user
  const user = await User.findOne({ username });
  const target = await User.findOne({ username: targetUsername });

  if (!user.following.includes(target._id)) {
    return res.status(400).json({ error: 'User is already not being followed'});
  }
  const updateFollowing = { following: user.following.filter((followingUser) => followingUser != target._id) };
  const updatedUser = await User.findOneAndUpdate({ username }, updateFollowing, { new: true });

  // Update followers list of target
  const updateFollowers = { followers: target.followers.filter((follower) => follower != user._id) };
  await User.findOneAndUpdate({ username: targetUsername }, updateFollowers);

  res.status(200).json({ updatedUser });
}

module.exports = { loginUser, signupUser, getCommunity, followUser, unfollowUser };
