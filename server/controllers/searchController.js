const User = require('../models/userModel');


// get searches
const getSearches = async (req, res) => {
  const username = req.params.username;

  try {
    const user = await User.findOne({ username });
    const deletedUsers = await User.find({ deleted: true });
    const searches = [];

    for (const search of user.searches) {
      const searchedUser = await User.findOne({ _id: search._id });
      if (deletedUsers.includes(searchedUser)) {
        searches.push({
          _id: searchedUser._id,
          username: searchedUser.username,
          pfp: searchedUser.pfp,
          fullName: searchedUser.fullName
        });
      }
    }

    res.status(200).json({ searches });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// add search
const addSearch = async (req, res) => {
  const { username, search } = req.body;

  try {
    const user = await User.findOne({ username });
    const filteredSearches = user.searches.filter(s => !s.equals(search));

    const updatedSearches = { searches: filteredSearches.concat(search) };
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

// get all users for search
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    
    res.status(200).json({ users });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// clear search history
const clearSearch = async (req, res) => {
  const { username } = req.body;

  try {
    const clearedSearches = { searches: [] };
    const newUser = await User.findOneAndUpdate({ username }, clearedSearches, { new: true });
    res.status(200).json({ newUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = {
  getSearches, addSearch, removeSearch,
  getUsers, clearSearch
};
