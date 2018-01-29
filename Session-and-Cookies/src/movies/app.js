// app.js

/*
author: Zachary Kimelheim
Ned id: zk377
*/
const express = require('express');
require('./db');
const bodyParser = require('body-parser');
const app = express();
const session = require('express-session');
const sessionOptions = {
	secret: 'secret for signing session id',
	saveUninitialized: false,
	resave: false
};
app.use(session(sessionOptions));
const path = require('path');
const publicPath = path.resolve(__dirname, 'public');
app.use(express.static(publicPath));
const mongoose = require('mongoose');
const Movie = mongoose.model('Movie');
app.set('view engine', 'hbs');
app.use(bodyParser.urlencoded({ extended: false }));


app.get('/movies', function(req, res) {
  if(req.query.Director){
    Movie.find({director: req.query.Director}, function(err, movies, count) {
      if(err) {
        res.send(err);
      }
      const str = "Showing only movies directed by: " + req.query.Director;
      console.log('movies', movies);
      res.render( 'index', {movies: movies, str: str});
    });
  }
  else{
    Movie.find(function(err, movies, count) {
      if(err) {
        res.send(err);
      }
      res.render( 'index', {movies: movies, str:""});
    });
  }
  console.log(req.query);
});

//delete feature
app.post('/movies',function(req,res){
  Movie.findOneAndRemove({title: req.body.title, year: req.body.year, director: req.body.director}, function(err,movies,count){
    console.log("success. " + req.body.title + " removed.");
    res.redirect("/movies");
  });

});

app.get('/movies/add', function(req,res){
  res.render('addMovie');
});

app.post('/movies/add',function(req,res){
  const mov = new Movie(
    {
      title: req.body.title,
      director: req.body.director,
      year: req.body.year
    });
  if(req.session.userMovies){
    req.session.userMovies+=mov.title+";"+mov.director+";"+mov.year+"\n";
  }
  else{
    req.session.userMovies=mov.title+";"+mov.director+";"+mov.year+"\n";
  }
  mov.save(function(err,result,count){
    res.redirect('/movies');
  });

});

app.get('/movies/mymovies',function(req,res){
  if(req.session.userMovies){
    const arr = req.session.userMovies.split('\n');
    const obj = [];
    for(let i=0;i<arr.length;i++){
      const mov1 = arr[i].split(';');
      const myMov = {
        title: mov1[0],
        director: mov1[1],
        year: mov1[2]
      };
      obj.push(myMov);
    }

    res.render('mymovies',{sessionMovies: obj});
  }
  else{
    res.send("You haven't added any movies yet this session!");
  }

});




app.listen(3000);
console.log("started server on port 3000");
