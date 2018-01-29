//Zachary Kimelheim zk377
//report.js
//const fs = require('fs');
const rev = require('./yelpfunc.js');
const request = require('request');


function yelpDataURL(url) {
  request(url, function(err, response, body) {
    if (!err && response.statusCode === 200 && body) { //we're in

      console.log("==========");
      console.log('url: ' + url);
      console.log("==========\n");

      //Parse JSON data
      let arr = body.trim().split("\n");
      for (let i = 0; i < arr.length; i++) {
        arr[i] = JSON.parse(arr[i]);
      }

      let file;
      let nextFile = true;
      //check if we are getting more json files to read in by looking at last json object in array
      if (arr[arr.length - 1].hasOwnProperty("nextFile")) { //there exists a next file!
        file = arr[arr.length - 1].nextFile;
        nextFile = true;
      } else {
        nextFile = false;
      }

      //filter out our data to get out the "bad" objects...if they exist of course
      arr = arr.filter(function(n) {
        return n.name !== undefined;
      });

      console.log(rev.processYelpData(arr));

      if (nextFile) {
        yelpDataURL('https://foureyes.github.io/csci-ua.0480-fall2017-003/homework/02/' + file);
      }
    } else {
      console.log("Uh oh.");
    }
  });
}

yelpDataURL("https://foureyes.github.io/csci-ua.0480-fall2017-003/homework/02/086e27c89913c5c2dde62b6cdd5a27d2.json");









// //--- Reading File Locally from Part 1 ---
// fs.readFile('business.json', 'utf8', function(err, data) {
//   if (err) {
//     console.log(err);
//   } else {
//     const arr = data.trim().split("\n"); //array of json objects
//     for (let i = 0; i < arr.length; i++) {
//       arr[i] = JSON.parse(arr[i]); //now array is array of javascript objects converted from json
//     }
//
//     //test passes
//     //console.log(arr[80].name, 'is a business located in', arr[80].city, 'with a rating of', arr[80].stars, 'and', arr[80].review_count, 'reviews.');
//
//
//
//     console.log(rev.processYelpData(arr));
//   }
// });
