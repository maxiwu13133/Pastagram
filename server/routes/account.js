const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth.js')

// require auth for all account routes
router.use(requireAuth);

// controller functions
const { 
  getAccountInfo,
  updateUser,
  deletePfp,
  deleteUser
 } = require('../controllers/accountController');

// get account info
router.get('/', getAccountInfo);

// update a user
router.patch('/update', updateUser);

// delete pfp
router.delete('/pfp', deletePfp);

// delete user
router.delete('/', deleteUser);

module.exports = router;
