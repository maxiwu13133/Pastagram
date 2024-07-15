const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  fullName: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

// static signup method
userSchema.statics.signup = async function (email, fullName, username, password) {

  // validation
  if (!email || !fullName || !username || !password) {
    throw Error('All fields must be filled');
  };
  if (!validator.isEmail(email)) {
    throw Error('Email is not valid');
  };
  if (!validator.isStrongPassword(password)) {
    throw Error('Password not strong enough');
  };

  const emailExists = await this.findOne({ email });

  if (emailExists) {
    throw Error('Email already in use');
  };

  const usernameExists = await this.findOne({ username });

  if (usernameExists) {
    throw Error('Username already in use');
  };


  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({ email, fullName, username, password: hash });
 
  return user;
}

// static login method
const validateInfo = async (user, password) => {

  if (!user) {
    throw Error('Incorrect login information.');
  };

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw Error('Incorrect login information.');
  };

  return user;
}

userSchema.statics.login = async function(identifier, password) {

  if (!identifier || !password) {
    throw Error('All fields must be filled');
  };

  if (validator.isEmail(identifier)) {
    const user = await this.findOne({ email: identifier });
    return validateInfo(user, password);
  } else {
    const user = await this.findOne({ username: identifier });
    return validateInfo(user, password);
  }
}

module.exports = mongoose.model('User', userSchema);
