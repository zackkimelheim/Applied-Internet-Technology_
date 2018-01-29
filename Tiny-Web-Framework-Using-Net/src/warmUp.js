// warmUp.js
const net = require("net");

const HOST = '127.0.0.1';
const PORT = 8080;

const server = net.createServer((sock) => {

  //upon connection this is displayed to the client
  sock.write("HTTP/1.1 200 OK\r\nContent-Type: text/html\r\n\r\n<em>Hello</em> <strong>World</strong>");
  sock.end();
});

server.listen(PORT, HOST);



//command line
//window 1: node warmUp.js
//window 2: curl -i localhost:8080 OR nc localhost 8080 will both make the connection 


// //specifies what to be done when a client connects
// //returns an instance of a server object
// const server = net.createServer((sock) => {
//
//   //if client types something then the server will receive it and print it out here
//   sock.on('data', (binaryData) => {
//     console.log(`got data\n=====\n${binaryData}`);
//
//     //sock.write(binaryData); //echo
//
//     // uncomment me if you want the connection to close
//     // immediately after we send back data
//     // sock.end();
//   });
//
//
//
//
//
//   sock.write("Writing"); //upon connection this is displayed to the client
//   //sock.end("Ending"); //this will close the connection and return this call back to the client
//   //when the connection closes, this is returned to the user
//   sock.on('close', (data) => {
//     console.log(`closed - ${sock.remoteAddress}:${sock.remotePort}`);
//   });
//   console.log(`got connection from ${sock.remoteAddress}:${sock.remotePort}`);
// });
//
// //this tells the server to start accepting connections on the supplied port and host name
// server.listen(PORT, HOST);
