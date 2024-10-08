require('dotenv').config();

const _ = require('lodash');

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

    res.status(200).json({ username, token, picture: user.picture });
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
    
    res.status(200).json({ 
      _id: user._id,
      email: user.email,
      fullName: user.fullName,
      followers: user.followers,
      following: user.following,
      bio: user.bio,
      pfp: user.pfp,
      saved: user.saved
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  };
}


// follow user
const followUser = async (req, res) => {
  const { username, targetUsername } = req.body;

  // Update following list of user
  try {
    const user = await User.findOne({ username });
    const target = await User.findOne({ username: targetUsername });
    if (user.following.includes(target._id)) {
      return res.status(200).json({ error: 'User already followed' });
    }
    const updateFollowing = { following: user.following.concat(target._id) };
    const newUser = await User.findOneAndUpdate({ username }, updateFollowing, { new: true });
    
    // Update followers list of target
    const updateFollowers = { followers: target.followers.concat(user._id) };
    const newTargetUser = await User.findOneAndUpdate({ username: targetUsername }, updateFollowers);

    res.status(200).json({ newUser, newTargetUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}


// unfollow user
const unfollowUser = async (req, res) => {
  const { username, targetUsername } = req.body;

  // Update following list of user
  try {
    const user = await User.findOne({ username });
    const target = await User.findOne({ username: targetUsername });

    if (!user.following.includes(target._id)) {
      return res.status(200).json({ error: 'User is already not being followed'});
    }
    const updateFollowing = { following: user.following.filter(followingUser => !followingUser.equals(target._id)) };
    const newUser = await User.findOneAndUpdate({ username }, updateFollowing, { new: true });

    // Update followers list of target
    const updateFollowers = { followers: target.followers.filter((follower) => !follower.equals(user._id)) };
    const newTargetUser = await User.findOneAndUpdate({ username: targetUsername }, updateFollowers);

    res.status(200).json({ newUser, newTargetUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}


// get suggested friends
const shuffleRandomly = (arr) => {
  for (var i = arr.length - 1; i >= 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
}

const getSuggest = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findOne({ _id: userId });
    const followingList = user.following;

    const followersOfFollowing = [];
    const allSuggestions = [];

    // not following any accounts 
    if (followingList.length === 0) {
      return res.status(200).json({ suggested });
    };

    // get all followers of following
    for (const followingId of followingList) {
      const following = await User.findOne({ _id: followingId });
      followersOfFollowing.push(...following.followers);
    };

    // count frequencies of followers
    const uniq = _.countBy(followersOfFollowing)
    const followersSorted = Object.keys(uniq).sort((a, b) => uniq[b] - uniq[a]);

    // get all following of top followers of following
    for (const followerId of followersSorted) {
      const follower = await User.findOne({ _id: followerId });
      allSuggestions.push(...follower.following);
    };

    // count frequencies of followings of followers
    const uniqSuggestions = _.countBy(allSuggestions);
    const suggestionsSorted = Object.keys(uniqSuggestions).sort((a, b) => uniqSuggestions[b] - uniqSuggestions[a]);
    const notFollowedSuggestions = suggestionsSorted.filter(suggestion => !user.following.includes(suggestion));
    const bestSuggestions = notFollowedSuggestions.filter(suggestion => !user._id.equals(suggestion));

    for (const sug of bestSuggestions) {
      const sugg = await User.findOne({ _id: sug });
      console.log(sugg.username);
    }

    res.status(200).json({ suggested: bestSuggestions });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}


module.exports = { 
  loginUser, signupUser, // account
  getCommunity, // user info
  followUser, unfollowUser, // user and user interaction
  getSuggest,
};
