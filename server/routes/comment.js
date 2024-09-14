const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth.js')

// require auth for all post routes
router.use(requireAuth);

// controller functions
const { 
  getComments,
  createComment,
  likeComment
} = require('../controllers/commentController');

// get comments of post
router.get('/:id', getComments);

// create comment on post
router.post('/', createComment);

// like comment
router.patch('/', likeComment);


module.exports = router