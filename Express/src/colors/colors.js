// colors.js
// @author Zachary Kimelheim 
'use strict';
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const Color = require('./colorlib.js').Color;

//These 3 lines together allow for any file found in the
//public directory to be served as a static file
const path = require('path');
const publicPath = path.resolve(__dirname, 'public');
app.use(express.static(publicPath));
//set hbs as the default view engine
app.set('view engine','hbs');
app.use(bodyParser.urlencoded({extended: false}));


//converts rgb value to hex
function toHex(r,g,b){

    let userColortoHex = "#";
    const tempred = r.toString(16);
    if(tempred.length === 1){
      userColortoHex += "0";
    }
    userColortoHex+=tempred;

    const tempgreen = g.toString(16);
    if(tempgreen.length === 1){
      userColortoHex += "0";
    }
    userColortoHex+=tempgreen;

    const tempblue = b.toString(16);
    if(tempblue.length === 1){
      userColortoHex += "0";
    }
    userColortoHex+=tempblue;

    return userColortoHex;
}



//set default path
app.use(function(req,res,next){
  console.log(req.method, req.path);
  next();
});

//Accept the following rules:
//1.  / --> redirects to /colors
app.get('/', function(req,res){
  res.redirect("colors");
});

//2. /about --> goes to page describing the site
app.get('/about',function(req,res){
  res.render('about');
});


//store all colors from txt file in to an array of Color objects
const colorList = fs.readFileSync('colors.txt').toString();
const colorArr = colorList.split('\n'); //colorArr has an array filled
                                        //with SpringGreen,#00FF7F
const colors = []; //empty object
for(let i=0; i<colorArr.length;i++){
  const currColor = colorArr[i].split(",");
  colors.push(new Color(currColor[0],currColor[1]));
} //all colors are now stored as Color objects in Object array colors

app.get('/colors', function(req,res){


  const red = parseInt(req.query.red) || 0; //ex : 255
  const green = parseInt(req.query.green) || 0; //ex: 0
  const blue = parseInt(req.query.blue) || 0; //ex: 50
  const num = parseInt(req.query.total) || 0;

  let userColortoHex = "";
  userColortoHex = toHex(red,green,blue); //255,0,0 = ff0000
  let name = "";

  //find name of color if it exists
  for(let i =0; i<colors.length;i++){
    if(colors[i].hex === userColortoHex.toUpperCase()){ //color exists in here give it a name
      name = colors[i].name;
      break;
    }
  }

  //We made a Color object specified from the User input
  const userCol = new Color(name,userColortoHex); //color object from user input
  //console.log(new Color(name,userColortoHex));


  //create Color Object array that has num random elements in it
  const random = [];
  for(let j=0;j<num;j++){
    const rand = Math.floor(Math.random()*colors.length)+1;
    random.push(colors[rand]);
  }

  //pass in the input Color object, the Color object array random, and the int value num
  res.render('colors',{input:userCol, array:random, num: num});
});

//listen on the default port 3000
app.listen(3000);
console.log("started server on port 3000");
