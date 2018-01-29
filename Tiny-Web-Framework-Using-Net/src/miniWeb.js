// miniWeb.js
// define your Request, Response and App objects here
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

  // console.log(request);
  // console.log(host);
  //
  // console.log(referer);
  // console.log(body);

  //Properties

  //method
  this.method = request.split(" ")[0]; //GET or POST
  //path
  this.path = request.split(" ")[1]; // /foo/bar/baz.html

  //console.log(this.path);

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
  // const statusCodes1 = {
  // "200" : "OK",
  // "404" : "Not Found",
  // "500" : "Internal Server Error",
  // "400" : "Bad Request",
  // "301" : "Moved Permanently",
  // "302" : "Found",
  // "303" : "See Other"
  // };
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
    const path = require('path');

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
    if(fileExtension === 'txt' || fileExtension === 'html' || fileExtension === 'css'){
      fs.readFile(file1, {encoding: 'utf8'}, this.callback.bind(this,this.contentType));
    }
    //if a file is an image type, the don't specify an encoding to readfile
    else {
      fs.readFile(file1, {}, this.callback.bind(this,this.contentType));
    }



};

}

class App {
  constructor(){
    const net = require('net');
    this.routes = {};
    this.server = net.createServer(this.handleConnection.bind(this));
  }

  get(path, cb){
    this.routes[path] = cb;
  }
  listen(port, host){
    this.server.listen(port,host);
  }
  handleConnection(sock){
    sock.on("data", this.handleRequestData.bind(this,sock));
  }
  handleRequestData(sock,binaryData){
    const str = "" + binaryData;
    this.data = str;
    this.req = new Request(str);
    this.res = new Response(sock);


    //is host header defined? if not 400 or 404
		if(!this.req.headers.hasOwnProperty("Host")){
			this.res.send(400, "400 Invalid Request");
			this.res.end();
			return;
		}
		if(!this.routes.hasOwnProperty(this.req.path)){
			this.res.send(404, "404 File Not Found.");
			this.res.end();
			return;
		}

      //handle path whether or not there is a trailing slash
      if(this.req.path.length > 1 && this.req.path.charAt(this.req.path.length - 1) === '/') {
        this.req.path = this.req.path.substring(0, this.request.path.length - 1);
      }

      //display current path if it exists
      this.routes[this.req.path](this.req, this.res);


      //callback for when the connection is closed
      sock.on('close', this.logResponse.bind(this,this.req,this.res));

  }
    logResponse(req,res){
      console.log(req.toString() + "\r\n" + res.toString());
      //console.log(req.method + " " + req.path + " - " + res.statusCode + " " + res.statusCodes1[res.statusCode]);
    }

}


module.exports = {
  App: App,
  Response: Response,
  Request: Request
};
