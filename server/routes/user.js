const express = require('express');
const router = express.Router();


// controller functions
const { loginUser, signupUser, getFollowers, getFollowing, followUser, unfollowUser } = require('../controllers/userController');


// login route
router.post('/login', loginUser);

// signup route
router.post('/signup', signupUser);

// get followers
router.get('/followers', getFollowers);

// get following
router.get('/following', getFollowing);

// follow a user
router.patch('/follow', followUser);

// unfollow a user
router.patch('/unfollow', unfollowUser);


module.exports = router;
