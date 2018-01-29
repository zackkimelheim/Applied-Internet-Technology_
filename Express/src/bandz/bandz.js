// bandz.js
//@author Zachary Kimelheim 
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

//These 3 lines together allow for any file found in the
//public directory to be served as a static file
const path = require('path');
const publicPath = path.resolve(__dirname, 'public');
app.use(express.static(publicPath));
//set hbs as the default view engine
app.set('view engine','hbs');
app.use(bodyParser.urlencoded({extended: false}));


const availableMusic =[];
availableMusic.push({name: "Adele", description: "British beast", filterGenre: "pop", location: "UK"});
availableMusic.push({name: "Calvin Harris", description: "the bo$$", filterGenre: "electronic", location: "Australia"});
availableMusic.push({name: "Dua Lipa", description: "Rising star", filterGenre: "pop", location: "UK"});
availableMusic.push({name: "Avicii", description: "EDM god", filterGenre: "electronic", location: "Sweden"});
availableMusic.push({name: "Coldplay", description: "Soothes the soul", filterGenre: "rock", location: "UK"});
availableMusic.push({name: "Drake", description: "Nobody likes Drake", filterGenre: "hip-hop", location: "USA"});
availableMusic.push({name: "AC/DC", description: "This isn't metal", filterGenre: "metal", location: "USA"});
availableMusic.push({name: "Milonau", description: "Great inspiration", filterGenre: "jazz", location: "USA"});



//only one path served to the app which is this one below
app.get('/', function(req, res){

  const filteredMusic = [];

  //if req.query is not empty, then that means that we have selected something
  if(req.query!== {}){
    for(let i = 0; i < availableMusic.length; i++){
      if(availableMusic[i].filterGenre === req.query.filterGenre){ //genre matches add it new array
        filteredMusic.push(availableMusic[i]);
      }
    }
  }
  if(req.query.filterGenre === undefined){ //nothing selected, don't need to display anything extra
    res.render('bandz', {'availableMusic':availableMusic});
  }else{
    const genre = "(" + req.query.filterGenre + " only)";
    res.render('bandz', {'availableMusic':filteredMusic, "str":genre}); //add the genre too
  }

});

//Add new bands
app.post('/', function(req, res){
  availableMusic.push(req.body);
  res.redirect('/');
});

//listen on the default port 3000
app.listen(3000);
console.log("started server on port 3000");
