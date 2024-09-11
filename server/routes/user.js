const express = require('express');
const router = express.Router();


// controller functions
const { 
  loginUser,
  signupUser,
  getCommunity,
  followUser,
  unfollowUser,
  getUser
} = require('../controllers/userController');

// login route
router.post('/login', loginUser);

// signup route
router.post('/signup', signupUser);

// get community
router.get('/community/:username', getCommunity);

// follow a user
router.patch('/follow', followUser);

// unfollow a user
router.patch('/unfollow', unfollowUser);

// get username and pfp for comments
router.get('/:id', getUser);


module.exports = router;
