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

app.post('/api/users/:_id/exercises', async (req, res) => {
  const userId = req.params._id;
  let username;
  const description = req.body.description;
  const duration = req.body.duration;
  const date = req.body.date != "" ? new Date(req.body.date) : new Date();
  dateString = date.toDateString();
  await User.findOne({ _id: userId })
    .then((data) => { username = data.username })
    .catch((err) => { res.status(500).json({ error: err }) });
  const newExercise = new Exercise({
                          userId: userId, 
                          description: description,
                          duration: duration,
                          date: dateString,
                          dateD: date
                          });
  newExercise.save();
  res.json({"_id": userId,"username": username,"date": dateString,"duration": duration,"description": description})
});

app.get('/api/users/:_id/logs', async (req, res) => {
  const userId = req.params._id;
  const from = req.query.from ? new Date(req.query.from) : undefined;
  const to = req.query.to ? new Date(req.query.to) : undefined;
  const limit = req.query.limit;
  
  const user = await User.findOne({ _id: userId });
  if (!user) return res.status(404).send('user not found');

  let exerciseQuery = { userId: userId };
  if (req.query.from || req.query.to) {
    exerciseQuery.dateD = {};
    if (req.query.from) {
      exerciseQuery.dateD.$gte = from;
    }
    if (req.query.to) {
      exerciseQuery.dateD.$lte = to;
    }
  }

  const userExercises = await Exercise.find(exerciseQuery, 'description duration date -_id').limit(isNaN(limit) ? 0 : limit).exec();
  res.json({ 
      username: user.username,
      count: userExercises.length,
      _id: userId,
      log: userExercises
      });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
