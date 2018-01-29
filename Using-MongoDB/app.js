//app.js
require('./db');

const mongoose = require('mongoose');
const ImagePost = mongoose.model('ImagePost');
const Image = mongoose.model('Image');

const express = require('express');
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
app.set('view engine', 'hbs');
app.use(bodyParser.urlencoded({ extended: false }));

//main page
app.get('/image-post',function(req,res){
	console.log(req.session);
  ImagePost.find(function(err,posts,count){
    if(err){
      res.send(err);
    }
    else{
			//if an error was thrown when trying to post, it will appear in req.session, display to user
			if (req.session.error){
				//create temp to store req.session.error before we clear the session so it doesnt consistently appear
				const temp = req.session.error;
				//clear req.session for next use
				delete req.session.error;
				res.render('image-post', {posts:posts, err:"Error! " + temp['message']});
			}
			else{
				res.render('image-post', {posts:posts});
			}
    }
  });
});

//edit specific posting page
app.get('/image-post/:slug',function(req,res){
  ImagePost.find({slug:req.params.slug},function(err,posts,count){
    if(err){
      res.send(err);
    }
    else{
			if(req.session.errorEdit){
				const temp = req.session.errorEdit;
				//clear req.session for next use
				delete req.session.errorEdit;
				res.render('image-post-edit',{posts:posts, err: "Error! " + temp['message']});
			}
			else{
				res.render('image-post-edit',{posts:posts});
			}
    }
  });
});


//add to main posting board page
app.post('/image-post-add',function(req,res){
  const imgpost = new ImagePost(
    {
      title: req.body.title,
    });
  for(let i=1;i<4;i++){
    if(req.body['url'+i]){
      const img = new Image({
        caption: req.body['caption'+i],
        url: req.body['url'+i]
      });
      imgpost.images.push(img);
    }
  }
  //save the imgpost in our database
  imgpost.save(function(err,result,count){
    if(err){
			req.session.error = err; //store error in session
			res.redirect('/image-post');
    }
    else{
      res.redirect('/image-post');
    }
  });
});

//add an image to specific posting
app.post('/image-post-edit-add-to-post', function(req,res){
  ImagePost.findOne({slug: req.body.slug}, function(err, post, count) {

    post.images.push({caption: req.body.caption, url: req.body.url});
    post.save(function(saveErr, savePost, saveCount) {
      if(saveErr){
				req.session.errorEdit = saveErr;
        res.redirect('/image-post/'+req.body.slug);
      }
      else{
        console.log(savePost);
				res.redirect('/image-post/'+req.body.slug);
      }
    });
    // res.redirect('/image-post/'+req.body.slug);
  });
});


app.post('/image-post-edit-delete', function(req,res){
  ImagePost.findOne({slug: req.body.slug}, function(err, post, count) {
    const arr = req.body.check; //contains all the values that are checked, which are the _ids of each img
    //check how many check boxes were ticked
    console.log(post.images.length);

    if(Array.isArray(arr)){
      //multiple were ticked, we have an array
      for(let i=0;i<arr.length;i++){
        post.images.id(arr[i]).remove();
      }
    }
    else{
      post.images.id(arr).remove();
    }

    console.log(post.images.length);

    //save our work
    post.save(function(saveErr, savePost, saveCount){
      if(saveErr){
        res.send(saveErr);
      }
      else{
        res.redirect('/image-post/'+req.body.slug);
      }
    });
  });

});

app.listen(8080);
console.log("Listening on port 8080");
