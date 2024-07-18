const express = require('express');
const router = express.Router();


// controller functions
const { loginUser, signupUser, getCommunity, followUser, unfollowUser } = require('../controllers/userController');


// login route
router.post('/login', loginUser);

// signup route
router.post('/signup', signupUser);

// get community
router.get('/community', getCommunity);

// follow a user
router.patch('/follow', followUser);

// unfollow a user
router.patch('/unfollow', unfollowUser);


module.exports = router;
