//Include Packages
var express = require("express");
var morgan = require("morgan");
var path = require("path");
var app=express();


//Package Initialitation functions
app.use(morgan('combined'));



//bootstrap connecting functions
app.get('/css/bootstrap.min.css', function(req, res){
  res.sendFile(path.join(__dirname, 'blog/css', 'bootstrap.min.css'));
});
app.get('/js/bootstrap.min.js', function(req, res){
  res.sendFile(path.join(__dirname, 'blog/js', 'bootstrap.min.js'));
});
app.get('/js/jquery.min.js', function(req, res){
  res.sendFile(path.join(__dirname, 'blog/js', 'jquery.min.js'));
});
app.get('/fonts/glyphicons-halflings-regular.woff2', function (req, res) {
  res.sendFile(path.join(__dirname, 'blog/fonts/', 'glyphicons-halflings-regular.woff2'));
});

app.get('/fonts/glyphicons-halflings-regular.eot', function (req, res) {
  res.sendFile(path.join(__dirname, 'blog/fonts/', 'glyphicons-halflings-regular.eot'));
});

app.get('/fonts/glyphicons-halflings-regular.svg', function (req, res) {
  res.sendFile(path.join(__dirname, 'blog/fonts/', 'glyphicons-halflings-regular.svg'));
});

app.get('/fonts/glyphicons-halflings-regular.ttf', function (req, res) {
  res.sendFile(path.join(__dirname, 'blog/fonts/', 'glyphicons-halflings-regular.ttf'));
});

app.get('/fonts/glyphicons-halflings-regular.woff', function (req, res) {
  res.sendFile(path.join(__dirname, 'blog/fonts/', 'glyphicons-halflings-regular.woff'));
});

app.get('/fonts/JosefinSans-Regular.ttf', function (req, res) {
  res.sendFile(path.join(__dirname, 'blog/fonts/', 'JosefinSans-Regular.ttf'));
});

app.get('/fonts/JosefinSans-SemiBold.ttf', function (req, res) {
  res.sendFile(path.join(__dirname, 'blog/fonts/', 'JosefinSans-SemiBold.ttf'));
});



app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, 'blog', 'index.html'));
});


//page show
app.get('/page', function(req, res){
  res.send('page_id: ' + req.query.id);
});

//user show
app.get('/user/:id', function(req, res) {
  res.send('user' + req.params.id);    
});



//if link not found
app.get('*', function (req, res) {
  res.send(`<title>404 ERROR | Page Missing</title><h1 align="center"> The Requested Page Is Not Found On The Server!</h1>`);
});



//Setting up server
var port = 8080;
app.listen(8080, function () {
  console.log("Satheesh Kumar's blog listening on port " + port);
});

