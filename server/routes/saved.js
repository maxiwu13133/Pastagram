const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth.js')

// require auth for all post routes
router.use(requireAuth);

// controller functions
const {
  getSaved,
  addSaved,
  removeSaved
} = require('../controllers/savedController');

// get saved posts
router.get('/', getSaved);

// add post to saved
router.patch('/add', addSaved);

// remove saved
router.patch('/remove', removeSaved);


module.exports = router;
