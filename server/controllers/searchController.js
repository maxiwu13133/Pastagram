const User = require('../models/userModel');


// get searches
const getSearches = async (req, res) => {
  const username = req.params.username;

  try {
    const user = await User.findOne({ username });

    res.status(200).json({ searches: user.searches });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// add search
const addSearch = async (req, res) => {
  const { username, search } = req.body;

  try {
    const user = await User.findOne({ username });

    const updatedSearches = { searches: user.searches.concat(search) };
    const newUser = await User.findOneAndUpdate({ username }, updatedSearches, { new: true });

    res.status(200).json({ newUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// delete search
const removeSearch = async (req, res) => {
  const { username, search } = req.body;

  try {
    const user = await User.findOne({ username });

    const updatedSearches = { searches: user.searches.filter(s => !s.equals(search)) };
    const newUser = await User.findOneAndUpdate({ username }, updatedSearches, { new: true });

    res.status(200).json({ newUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = {
  getSearches, addSearch, removeSearch
};
