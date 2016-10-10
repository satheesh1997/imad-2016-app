var express = require('express');
var morgan = require('morgan');
var path = require('path');
var fs = require('fs');
var data = fs.readFileSync("posts.agx");

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

//blog page rendering function

var blog = {
  title : 'BLOG | SATHEESH KUMAR D',
};

function createblog(details){
    var title = details.title;
    var content = data.toString();

    var blogtemplate =`
      <!doctype html>
          <html>

          <head>
              <link href="/ui/style.css" rel="stylesheet" />
              <title>${title}</title>
              <meta charset="UTF-8">
              <meta http-equiv="X-UA-Compatible" content="IE=edge">
              <meta name="author" content="Satheesh Kumar,http://www.facebook.com/satheesh1997">
              <!-- <link rel="shortcut icon" href="./assets/images/clogo.gif" type="image/x-icon"> -->
              <meta name="description" content=" I am Satheesh Kumar. This is my portfolio">
              <meta name="theme-color" content="#ea713d">
          </head>

          <body>
              <div class="nav nav-overlay">
                  <p class="nav-head">BLOG
                      <button class="nav-btn1" id="blog-btn">BLOG</button>
                      <button class="nav-btn" id="about-btn">ABOUT</button>
                      <button class="nav-btn" id="contact-btn">CONTACT</button>
                  </p>
              </div>
              <div class="space"></div>
              <div class="space"></div>
              <div class="space"></div>
          

              <div class="container">      
                  <div class="bio">
                      <div class="overlay">
                          <h4 class="mint center">POSTS</h4>
                          <hr>
                      </div>
                  </div>
                      <div class="space"></div>
                  <div id="blog-post">
                      ${content}
                      <div class="space"></div>


                  </div>
              </div>


              <div class="space"></div>
              <div class=" copyright overlay">

                  <h4 class="mint cptext">COPYRIGHT 2016 - 2017</h4>
                  <p class="copy cptext">Satheesh Kumar D | Designed By Aplus Studios
                  </p>
                  <hr>
              </div>

              <script type="text/javascript" src="/ui/main.js"></script>
              
          </body>

          </html>
    `;
    return blogtemplate;
}

app.get('/blog', function (req, res) {
  res.send(createblog(blog));
});

var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log("IMAD course app listening on port " + port);
});
