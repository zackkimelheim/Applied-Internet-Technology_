// evenWarmer.js
// create Request and Response constructors...
const net = require("net");

const HOST = '127.0.0.1';
const PORT = 8080;

const server = net.createServer((sock) => {

  sock.on('data', (binaryData) => {
    const req = new Request(binaryData);
    const res = new Response(sock);

    if (req.path === "/") {
      res.setHeader("Content-Type", "text/html");
      res.send(200, "<link rel='stylesheet' type='text/css' href='/foo.css'><h2>this is a red header</h2><em>Hello</em> <strong>World</strong>");
      //sock.write('HTTP/1.1 200 ok\r\nContent-Type: text/html\r\n\r\n<link rel="stylesheet" type="text/css" href="/foo.css"><h2>this is a red header</h2><em>Hello</em> <strong>World</strong>');
      //sock.end();
    } else if (req.path === "/foo.css") {
      //this isnt working
      res.setHeader("Content-Type", "text/css");
      res.send(200, "h2 {color: red;}");
      // sock.write('HTTP/1.1 200 ok\r\nContent-Type: text/css\r\n\r\nh2 {color: red;}');
      // sock.end();
    }
    else if (req.path ==="/test"){
      res.sendFile("/html/test.html");
    }
    else if (req.path ==="/bmo1.gif"){
      res.sendFile("/img/bmo1.gif");
    }
    else{
      res.setHeader("Content-Type", "text/plain");
      res.send(404, "uh oh...page not found");
      // sock.write("HTTP/1.1 404\r\nContent-Type: text/plain\r\n\r\nuh oh...404 page not found!");
      // sock.end();
    }
  });
});

server.listen(PORT, HOST);


function Request(httpRequest) {
  httpRequest = "" + httpRequest; //stringify it
  this.httpRequest = httpRequest; //label our this

  //split our string in to part
  const split = httpRequest.split("\r\n"); //now an array filled with strings
  /*[
  GET /foo.html HTTP/1.1 [0]
  Host: localhost:8080   [1]

  body

]

  */
  const request = split[0]; //request part [0]
  let host = split[1]; //header part [1]
  let referer = split[2];
  const body = split[3]; //body part

  //Properties

  //method
  this.method = request.split(" ")[0]; //GET or POST
  //path
  this.path = request.split(" ")[1]; // /foo/bar/baz.html


  //header
  host = host.split(" "); //
  /*
    Host:
    localhost:8080
    User-Agent:
    Mozilla/5.0
  */
  this.headers = {};
  for (let i = 0; i <= host.length; i += 2) {
    if (host[i]) {
      const x = host[i].replace(/:/, "");
      this.headers[x] = host[i + 1]; //dynamically makes the name depending on the input
    }
  }
  referer = referer.split(" ");

  if (referer[1]) {
    const xx = referer[0].replace(/:/, "");
    this.headers[xx] = referer[1];
  }

  //body
  this.body = body;

  this.toString = function() {
    return httpRequest;
  };

}

function Response(sock){
  this.sock = sock;
  this.headers = {};

  //set header
  this.setHeader = function(name,value){
    this.headers[name] = value;
  };
  //write
  this.write = function(data){
    this.sock.write(data);
  };
  //end
  this.end = function(s){
    this.sock.end(s);
  };
  //send
  this.send = function(statusCode,body){
    const statusCodes = {
    "200" : "OK",
    "404" : "Not Found",
    "500" : "Internal Server Error",
    "400" : "Bad Request",
    "301" : "Moved Permanently",
    "302" : "Found",
    "303" : "See Other"
    };

    this.statusCode = statusCode;
    this.body = body;
    let res = 'HTTP/1.1 ' + statusCode + " " + statusCodes[statusCode] + "\r\n";
    for (const i in this.headers){
      res += i + ": " + this.headers[i] + "\r\n\r\n";
    }
    res += this.body;
    this.sock.end(res);
  };

  //writeHead
  this.writeHead = function(statusCode){
    const statusCodes = {
    "200" : "OK",
    "404" : "Not Found",
    "500" : "Internal Server Error",
    "400" : "Bad Request",
    "301" : "Moved Permanently",
    "302" : "Found",
    "303" : "See Other"
    };
    this.statusCode = statusCode;
    let res = "HTTP/1.1" + statusCode + " " + statusCodes[statusCode] + "\r\n";
    for (const i in this.headers){
      res += i + ": " + this.headers[i] + "\r\n\r\n";
    }
    this.write(res);
  };

  this.redirect = function(statusCode, url){
    if(isNaN(statusCode)){
      this.statusCode = 301;
      this.headers["Location"] = url;
    }
    else{
      this.statusCode = statusCode;
      this.headers["Location"] = url;
    }

    this.send(this.statusCode, this.body);

  };

  this.toString = function(){
    const statusCodes = {
    "200" : "OK",
    "404" : "Not Found",
    "500" : "Internal Server Error",
    "400" : "Bad Request",
    "301" : "Moved Permanently",
    "302" : "Found",
    "303" : "See Other"
    };

    let res = "HTTP/1.1 " + this.statusCode + " " + statusCodes[this.statusCode] + "\r\n";
    //header is populated
    if(this.headers !== null){
      for(const i in this.headers){
        res += i + ": " + this.headers[i] + "\r\n"; //add headers to res string
      }
      res += "\r\n";
      if(this.body ==='\r\n' || this.body === undefined){ //if body is empty
        this.body =""; //change body to empty string
      }
      res += this.body;
      return res;
    }
    //header is not populated
    else {
      return res; //as is
    }
  };
  //callback function created
  this.callback = function(contentType, err, data){
    if(err){
      this.writeHead(500);
      this.end();
    }
    else{
      this.setHeader("Content-Type", contentType);
      this.writeHead(200);
      this.write(data);
      this.end();
    }
  };

  this.sendFile = function(fileName){
    const fs = require('fs');
    // const path = require('path');

    //initialize extensions
    const extensions = {
      "jpeg": "image/jpeg",
      "jpg": "image/jpeg",
      "png": "image/png",
      "gif": "image/gif",
      "html": "text/html",
      "css": "text/css",
      "txt": "text/plain"
    };

    const publicRoot = __dirname + "/../public/";
    const file1 = publicRoot + fileName; //absolute path for file to be returned
    //get the proper extension of the file
    const fileExtension = fileName.split(".")[1]; //assuming one period in name
    this.contentType = extensions[fileExtension];

    //if a file is a text then just assume utf8
    if(fileExtension === 'txt'){
      fs.readFile(file1, {encoding: 'utf8'}, this.callback.bind(this,this.contentType));
    }
    //if a file is an image type, the don't specify an encoding to readfile
    else {
      fs.readFile(file1, {}, this.callback.bind(this,this.contentType));
    }



};

}














module.exports = {
  Request: Request,
  Response: Response
};









//
// let s = ''
// s += 'GET /foo.html HTTP/1.1\r\n'; // request line
// s += 'Host: localhost:8080 User-Agent: Mozilla/5.0\r\n'; // headers
// s += '\r\n\r\n';
//
// const req = new Request(s);
//
// console.log("The path is: ", req.path);
// // --> /foo.html
//
// console.log("The method is: ", req.method);
// // --> GET
//
// console.log("The headers are: ", req.headers);
// // --> {'Host': 'localhost:8080' }
//
// console.log("The body is:\n", req.body);
// // --> ''
// // the body is empty in this case ^^^
//
// console.log("To String: \n", req.toString()); // or req + ''
// // -->
// // GET /foo.html HTTP/1.1\r\n
// // Host: localhost:8080
// //
// // (notice the empty line above to denote header / body boundary)
