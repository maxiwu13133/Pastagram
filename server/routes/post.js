const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth.js')

// require auth for all post routes
router.use(requireAuth);

// controller functions
const { 
  createPost,
  getPosts,
  deletePost,
} = require('../controllers/postController');

// create post
router.post('/', createPost);

// get posts of user
router.get('/:username', getPosts);

// delete post
router.delete('/delete', deletePost);


module.exports = router