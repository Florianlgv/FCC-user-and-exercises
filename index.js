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

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});





const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
