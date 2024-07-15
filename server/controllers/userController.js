const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

// User session expires after 1 day
const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: '6h' });
}

// login user
const loginUser = async (req, res) => {
  const { identifier, password } = req.body;

  try {
    const user = await User.login(identifier, password);

    // create a token
    const token = createToken(user._id);

    res.status(200).json({ id: identifier, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  };
}

// signup user
const signupUser = async (req, res) => {
  const { email, fullName, username, password } = req.body;

  try {
    const user = await User.signup(email, fullName, username, password);

    // create a token
    const token = createToken(user._id);

    res.status(200).json({ id: email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  };
}

module.exports = { loginUser, signupUser };
