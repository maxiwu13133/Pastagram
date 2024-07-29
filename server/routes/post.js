const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth.js')

// require auth for all post routes
router.use(requireAuth);

// controller functions
const { createPost } = require('../controllers/postController');

router.post('/', createPost);


module.exports = router