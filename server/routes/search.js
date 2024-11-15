const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth.js')

// require auth for all post routes
router.use(requireAuth);

// controller functions
const {
  getSearches,
  addSearch,
  removeSearch,
  getUsers,
  clearSearch
} = require('../controllers/searchController');

// get users
router.get('/', getUsers);

// get searches of a user
router.get('/:username', getSearches);

// add search
router.patch('/add', addSearch);

// delete search
router.patch('/remove', removeSearch);

// clear search history
router.patch('/clear', clearSearch);


module.exports = router;
