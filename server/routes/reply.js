const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth.js')

// require auth for all post routes
router.use(requireAuth);

// controller functions
const {
  getReplies,
  createReply,
  getUserInfo,
  handleLike,
} = require('../controllers/replyController');

// get replies of comment
router.get('/:id', getReplies);

// create reply 
router.post('/', createReply);

// user info
router.get('/user/:userId', getUserInfo);

// like or unlike reply
router.patch('/like', handleLike);


module.exports = router;
