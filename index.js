const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose');
const connectDB = require("./config/db");
require('dotenv').config()

connectDB();
app.use(cors());
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let userSchema = new mongoose.Schema({
  username: {
        type: String,
        required: true,
        unique: true
  }
});
const User = mongoose.model('User', userSchema);

let exerciceSchema = new mongoose.Schema({
  userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
  },
  description: {
      type: String,
      required: true
  },
  duration: {
      type: Number,
      required: true
  },
  date: String,
  dateD: Date
});
const Exercise = mongoose.model('Exercice', exerciceSchema);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.post('/api/users', (req, res) => {
  const username = req.body.username;
  const newUser = new User({username: username});
  newUser.save();
  res.json({ username: username, _id: newUser._id})
});

app.get('/api/users', (req, res) => {
  User.find()
    .then((users) => {
    res.json(users)
    })
    .catch((err) => console.log(err))
});




const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
