// db.js
/*
author: Zachary Kimelheim
Ned id: zk377
*/
const mongoose = require('mongoose');
//my schema goes here!!

const Movie = new mongoose.Schema({
  title: String,
  director: String,
  year: Number
});

mongoose.model('Movie', Movie);

mongoose.connect('mongodb://localhost/hw05');
