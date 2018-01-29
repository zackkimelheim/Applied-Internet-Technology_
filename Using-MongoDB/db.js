// db.js
/*
author: Zachary Kimelheim
Ned id: zk377
*/
const mongoose = require('mongoose');
const URLSlugs = require('mongoose-url-slugs');


//my schema goes here!!

const Image = new mongoose.Schema({
  caption: String,
  url: {type: String, required: true}
});

const ImagePost = new mongoose.Schema({
  title: {type: String, required: true},
  images: {type: [Image], required: true}
});

//slug
ImagePost.plugin(URLSlugs('title'));


mongoose.model('Image', Image);
mongoose.model('ImagePost', ImagePost);


mongoose.connect('mongodb://localhost/hw06');
