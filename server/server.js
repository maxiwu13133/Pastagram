require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const userRoutes = require('./routes/user');
const postRoutes = require('./routes/post');
const accountRoutes = require('./routes/account');
const commentRoutes = require('./routes/comment');

// express app
const app = express();

// middleware
app.use(express.json({ limit: '200mb' }));
app.use(cors());

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
})

// routes
app.use('/api/user', userRoutes);
app.use('/api/post', postRoutes);
app.use('/api/account', accountRoutes);
app.use('/api/comment', commentRoutes);

// connect to db
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    // listen for requests
    app.listen(process.env.PORT, () => {
      console.log('listening on', process.env.PORT);
    })
  })
  .catch((error) => {
    console.log(error);
  });