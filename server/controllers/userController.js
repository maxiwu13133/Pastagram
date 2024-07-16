const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

// User session expires after 1 day
const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: '6h' });
}

// login user
const loginUser = async (req, res) => {
  const { identifier, password } = req.body;

  try {
    const user = await User.login(identifier, password);

    // create a token
    const token = createToken(user._id);

    res.status(200).json({ id: identifier, token });
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

    res.status(200).json({ id: email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  };
}

// get followers of user
const getFollowers = async (req, res) => {
  const { _id } = req.body;

  try {
    const user = await User.findById(_id);

    res.status(200).json({ user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  };
}


// get user following
const getFollowing = async (req, res) => {
  const { _id } = req.body;

  try {
    const user = await User.findById(_id);

    res.status(200).json({ user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  };
}

// follow user
const followUser = async (req, res) => {
  const { _id, targetId } = req.body;

  // Update following list of user
  const user = await User.findOne({ _id });

  if (user.following.includes(targetId)) {
    return res.status(400).json({ error: 'User already followed' });
  }
  const updateFollowing = { following: user.following.concat(targetId) };
  const updatedUser = await User.findOneAndUpdate({ _id }, updateFollowing, { new: true });
  
  // Update followers list of target
  const target = await User.findOne({ _id: targetId });
  const updateFollowers = { followers: target.followers.concat(_id) };
  await User.findOneAndUpdate({ _id: targetId }, updateFollowers);

  res.status(200).json({ updatedUser });
}

// unfollow user
const unfollowUser = async (req, res) => {
  const { _id, targetId } = req.body;

  // Update following list of user
  const user = await User.findOne({ _id });

  if (!user.following.includes(targetId)) {
    return res.status(400).json({ error: 'User is already not being followed'});
  }
  const updateFollowing = { following: user.following.filter((followingUser) => followingUser != targetId) };
  const updatedUser = await User.findOneAndUpdate({ _id }, updateFollowing, { new: true });

  // Update followers list of target
  const target = await User.findOne({ _id: targetId });
  const updateFollowers = { followers: target.followers.filter((follower) => follower != _id) };
  await User.findOneAndUpdate({ _id: targetId }, updateFollowers);

  res.status(200).json({ updatedUser });
}

module.exports = { loginUser, signupUser, getFollowers, getFollowing, followUser, unfollowUser };
