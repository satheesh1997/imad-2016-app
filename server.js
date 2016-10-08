var express = require('express');
var morgan = require('morgan');
var path = require('path');

var app = express();
app.use(morgan('combined'));

app.get('/index', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'load.html'));
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});


app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});

app.get('/author', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui/images', 'sat.jpg'));
});

app.get('/bg', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui/images', 'bg.jpg'));
});

app.get('/fb-icon', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui/images', 'fb1.png'));
});

app.get('/utub-icon', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui/images', 'you.png'));
});

app.get('/twitter-icon', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui/images', 'twitter.png'));
});

app.get('/google-icon', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui/images', 'google.png'));
});

app.get('/rss-icon', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui/images', 'rss.png'));
});

var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log("IMAD course app listening on port" + port);
});
