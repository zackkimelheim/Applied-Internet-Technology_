// fansite.js
// create your own fansite using your miniWeb framework
const App = require('./miniweb.js').App;
const app = new App();

const [HOST, PORT] = ['127.0.0.1', 8080];


app.get('/', function(req,res){
  res.sendFile("/html/index.html");
});

//import img in to file by doing this
app.get('/homeimg', function(req,res){
  res.sendFile("/img/kazoo1.gif");
});

app.get('/about', function(req,res){
  res.sendFile("/html/about.html");
});

app.get('/css/base.css', function(req, res){
  res.sendFile("/css/base.css");
});

app.get('/rando', function(req,res){
  res.sendFile("/html/rando.html");
});

//works
app.get('/img/image1.jpg', function(req,res){
  res.sendFile('/img/kazoo0.jpg');
});

//works
app.get('/img/image2.png', function(req,res){
  res.sendFile('/img/kazooo.png');
});

//works
app.get('/img/image3.gif', function(req, res){
  res.sendFile('/img/kazoo6.gif');
});

app.get('/home', function(req, res){
  res.redirect(301, '/');
  res.end();
});

app.get('/randopic', function(req,res){
  const rando = Math.floor(Math.random()* 6)+1;
  const file = "/img/kazoo" + rando + ".gif";
  res.sendFile(file);
});

app.listen(PORT, HOST);
