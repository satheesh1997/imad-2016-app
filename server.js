//Include Packages
var express = require("express");
var morgan = require("morgan");
var path = require("path");
var mysql = require("mysql");
var crypto = require("crypto");
var bodyParser = require('body-parser');
var session = require('express-session');
var app=express();


//Package Initialitation functions
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(session({
    secret: 'someRandomSecretValue',
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 30}
}));

//Creating Mysql Function
var connection = mysql.createConnection({
	host:'sql202.rf.gd',
	user:'rfgd_19137621',
	password:'vaioxloud',
	database:'rfgd_19137621_Imad'
});



//Connecting to mysql database
connection.connect(function(err){
	if(!err)
		console.log("\nConnection to mysql server successfull..\n");
	else
		console.log("\nError inconnecting to mysql server.."+err+"\n");
		
});


//css routes
app.get('/css/:stylesheet', function (req, res) {
  res.sendFile(path.join(__dirname, 'blog/css', req.params.stylesheet));
});
//font routes
app.get('/fonts/:font', function (req, res) {
  res.sendFile(path.join(__dirname, 'blog/fonts', req.params.font));
});
//js routes
app.get('/js/:script', function (req, res) {
  res.sendFile(path.join(__dirname, 'blog/js', req.params.script));
});
//image routes
app.get('/images/:image', function (req, res) {
  res.sendFile(path.join(__dirname, 'blog/images', req.params.image));
});

//url routes
app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, 'blog', 'index.html'));
});
app.get('/help.html', function(req, res){
  res.sendFile(path.join(__dirname, 'blog', 'hp.html'));
});
app.get('/techhunt', function(req, res){
  res.sendFile(path.join(__dirname, 'blog', 'hp.html'));
});

app.get('/satheesh1997', function(req, res){
  res.sendFile(path.join(__dirname, 'blog', 'profile.html'));
});

app.get('/articles', function(req, res){
	var content="";
	var template="";
	var j=1;
	connection.query("SELECT * FROM article ORDER BY id DESC", function (err, rows, fields) {
      if (err) {
          res.status(500).send(err.toString());
      } else {
      	for (var i in rows) {
  		template=`<div class="lead">${j}]&nbsp;&nbsp;<a href="/article/${rows[i].id}">${rows[i].title}</a></div>
  		<div class="text-primary text-right" style="margin-top:-20px;">${rows[i].views}&nbsp;VIEWS</div><hr>`;
        	content=content+template;
        	j=j+1;
    	}
	res.send(createTemplate(content));
      }
   });
});
app.get('/articlebyname/Articles%20List', function(req, res){
	var content="";
	var template="";
	var j=1;
	connection.query("SELECT * FROM article ORDER BY id DESC", function (err, rows, fields) {
      if (err) {
          res.status(500).send(err.toString());
      } else {
      	for (var i in rows) {
  		template=`<div class="lead">${j}]&nbsp;&nbsp;<a href="/article/${rows[i].id}">${rows[i].title}</a></div>
  		<div class="text-primary text-right" style="margin-top:-20px;">${rows[i].views}&nbsp;VIEWS</div><hr>`;
        	content=content+template;
        	j=j+1;
    	}
	res.send(createTemplate(content));
      }
   });
});

app.get('/article/:id', function(req, res){
	var article_id=req.params.id;
	var num=0;
	var sql    = 'SELECT * FROM article WHERE id = ' + connection.escape(article_id);
	connection.query(sql, function (err, rows, fields) {
      	if (err) {
        	res.status(500).send(err.toString());
      	} else {
	      	for (var i in rows) {
	  		num++;
		}
		if(num >0){
	      		sql='UPDATE article SET views=views+1 WHERE id='+article_id;
	      		connection.query(sql,function(err,results){
			});
			res.send(createarticle(rows[0]));
		}else{
			res.sendFile(path.join(__dirname, 'blog', '404.html'));
		}
	
      }
   });
});
app.get('/articlebyname/:title', function(req, res){
	var article_id=req.params.title;
	var num=0;
		var sql    = 'SELECT * FROM article WHERE title = ' + connection.escape(article_id);
		connection.query(sql, function (err, rows, fields) {
		       if (err) {
				res.status(500).send(err.toString());
		       } else {
			      for (var i in rows) {
		  		num++;
			      }
			      	if(num > 0){
		      			sql='UPDATE article SET views=views+1 WHERE title='+article_id;
	      				connection.query(sql,function(err,results){
					});
					res.send(createarticle(rows[0]));
				}else{
					res.sendFile(path.join(__dirname, 'blog', '404.html'));
				}
		    }
   		});
});

app.get('/register', function(req, res){
  res.send(registerpage());
});

//search keyword function
app.get('/search', function (req, res) {
  var key=req.query.key;
  var titles='["Articles List';
  connection.query("SELECT title FROM article WHERE title LIKE '%"+key+"%'", function (err, rows, fields) {
  	if (err) throw err;
  	for (var i in rows) {
  		if(i>=0)
        	titles=titles+'","'+rows[i].title;
    	}
    	if(!err){
    		res.send(titles+'"]');
	}
  });
});

app.get('/checker_email', function (req, res) {
  var key=req.query.email;
  var mail=null;
  var sql    = 'SELECT mail FROM user WHERE mail = ' + connection.escape(key);
  connection.query(sql, function (err, rows, fields) {
		if (err) throw err;
		for (var i in rows) {
	  		if(i>=0)
			mail=mail+rows[i].mail;
    		}
    		if(mail != null){
    			res.status(400).send(mail);
		}
		else{
		       res.status(200).send(mail);
	       }
    		
  });
});

app.get('/subscribe', function (req, res) {
  var email=req.query.email;
  if(email.length>2){
	  var sql    = "INSERT INTO subscribers (email) VALUES ("+connection.escape(email)+")";
	  connection.query(sql, function (err, rows, fields) {
			if (err){
				res.status(500).send(err.toString());
			 	throw err;
		 	}else{
		 		res.status(200).send("SuccessFully Subcribed...");
	 		}
	    		
	  });
  }
  else{
  	res.status(500).send("Use a valid Email");
  }
});

app.get('/get-trends', function (req, res) {
   connection.query("SELECT * FROM article ORDER BY views DESC", function (err, rows, fields) {
      if (err) {
          res.status(500).send(err.toString());
      } else {
          res.send(JSON.stringify(rows));
      }
   });
});
app.post('/create-user', function (req, res) {
   var username = req.body.username;
   var password = req.body.password;
   var email = req.body.email;
   var salt = crypto.randomBytes(128).toString('hex');
   var dbString = hash(password, salt);
   var sql="INSERT INTO user (username, password , mail) VALUES ('"+username+"','"+dbString+"','"+email+"')";
   connection.query(sql, function (err, rows, fields) {
      if (err) {
          res.status(500).send(err.toString());
      } else {
          res.send('User successfully created: ' + username);
      }
   });
});
app.post('/login', function (req, res) {
   var lemail = req.body.email;
   var lpassword = req.body.password;
   var num=0;
   var sql = 'SELECT * FROM user WHERE mail = ' + connection.escape(lemail);
   connection.query(sql, function (err, rows, fields) {
      if (err) {
          res.status(500).send(err.toString());
      } else {
      		for (var i in rows) {
	  		num++;
		}
          if (num == 0) {
              res.status(403).send('Email/password is invalid');
          } else {
              var dbString = rows[0].password;
              var salt = dbString.split('$')[2];
              var hashedPassword = hash(lpassword, salt);
              if (hashedPassword === dbString) {
                req.session.auth = {userId:rows[0].id};
                res.send('credentials correct!');
              } else {
                res.status(403).send('Email/password is invalid');
              }
          }
      }
   });
});

app.get('/check-login', function (req, res) {
   if (req.session && req.session.auth && req.session.auth.userId) {
       // Load the user object
       var sql="SELECT * FROM user WHERE id ="+req.session.auth.userId;
       connection.query(sql, function (err, rows, fields) {
           if (err) {
              res.status(500).send(err.toString());
           } else {
              res.send(rows[0].username);    
           }
       });
   } else {
       res.status(400).send('You are not logged in');
   }
});

app.get('/logout', function (req, res) {
   delete req.session.auth;
   res.sendFile(path.join(__dirname, 'blog', 'index.html'));
});

//if link not found
app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, 'blog', '404.html'));
});

//hash function
function hash (input, salt) {
    var hashed = crypto.pbkdf2Sync(input, salt, 10000, 512, 'sha512');
    return ["pbkdf2", "10000", salt, hashed.toString('hex')].join('$');
}



//articles function
function createTemplate (data) {
	var articletemplate=`
		<!DOCTYPE>
		<html>
		    <head>
			<script>
			    document.title="Tech Hunt";
			</script>
			<noscript> JavaScript Is Not Enabled On Browser </noscript>
		    <!-- Stylesheet -->
			<link href="/css/bootstrap.min.css" rel="stylesheet">
			<link href="/css/bootstrap-theme.min.css" rel="stylesheet">
			<link href="/css/bootstrap-social.css" rel="stylesheet">
			<link href="/css/font-awesome.css" rel="stylesheet">
		    <!-- Stylesheet added -->
		    <script src="/js/jquery.min.js"></script>
		    <script src="/js/typeahead.min.js"></script>
		    <!-- meta tags -->
			<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0, user-scalable=no">

		    <!-- meta end -->
		    <!-- Authors Fonts -->
			<style>
			    @font-face {
				font-family: sat;
				src: url(/fonts/JosefinSans-Regular.ttf);
			    }
			    @font-face {
				font-family: satbold;
				src: url(/fonts/JosefinSans-SemiBold.ttf);
			    }
			    .brand:hover{
				border-bottom:3px solid crimson;
			    }
			    .src_btn:hover{
				cursor:pointer;
			    }
			    .alink{
				border-bottom:3px solid black;
				border-right:1px solid grey;
			    }
			    .brand{
				border-right:1px solid grey;
			    }
			    .typeahead, .tt-query, .tt-hint {
			
				font-size: 14px;
				padding: 8px;
			    }
			    .typeahead {
				background-color: #FFFFFF;
			    }
			    .typeahead:focus {
				border: 2px solid #0097CF;
			    }
			    .tt-query {
				box-shadow: 0 1px 1px rgba(0, 0, 0, 0.075) inset;
			    }
			    .tt-hint {
				color: #999999;
			    }
			    .tt-dropdown-menu {
				background-color: #FFFFFF;
				border: 1px solid rgba(0, 0, 0, 0.2);
				border-radius: 8px;
				box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
				margin-top: 12px;
				padding: 8px 0;
			    }
			    .tt-suggestion {
				font-size: 14px;
				line-height: 24px;
				padding: 3px 20px;
				width:200px;
			    }
			    .tt-suggestion.tt-is-under-cursor {
				background-color: #0097CF;
				color: #FFFFFF;
			    }
			    .tt-suggestion p {
				margin: 0;
			    }
			</style>
		    </head>
		<body  style="font-family:sat;background:url(/images/bg.jpg);background-attachment: fixed;">
		    <!-- background:darkorchid; -->
		    
		    <nav class="navbar navbar-default navbar-fixed-top" role="navigation">
			<!-- Brand and toggle get grouped for better mobile display -->
			<div class="navbar-header">
			    <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-ex1-collapse">
				<span class="sr-only">Toggle navigation</span>
				<span class="icon-bar"></span>
				<span class="icon-bar"></span>
				<span class="icon-bar"></span>
			    </button>

			    <a href="/" class="navbar-brand" style="margin-right:70px;font-family:satbold; font-size:25px;">
				<span class="fa fa-home" aria-hidden="true"></span>&nbsp;TECH HUNT</a>
			</div>
		    
			<!-- Collect the nav links, forms, and other content for toggling -->
			<div class="collapse navbar-collapse navbar-ex1-collapse" style="background:white;box-shadow: -4px 1px 12px #888888;">
			    <ul class="nav navbar-nav text-center" style="font-family:satbold; font-size:15px;">
				<li class="brand"></li>
				<li></li>
				<li>
				<a class="active alink" href="#"  style=" padding-left:70px; padding-right:70px;border-left:1px solid black;">
				<span class="fa fa-book" aria-hidden="true"></span>&nbsp;ARTICLES</a></li>
				<li></li>
				<li><a class="brand" href="/users"  style=" padding-left:70px; padding-right:70px;">
				<span class="fa fa-users" aria-hidden="true"></span>&nbsp;USERS</a></li>
				<li></li>
				<li><a class="brand" href="/techhunt"  style=" padding-left:60px;  padding-right:60px;">
                <span class="fa fa-phone" aria-hidden="true"></span>&nbsp;HELP & SUPPORT</a></li>
                <li></li>
                <li id="logout"></li>
			    </ul>
			    <form class="navbar-form navbar-right" role="search">
			
				<div class="input-group"  style="font-family:satbold; font-size:25px;">
				<!-- search script -->
				    <script>
					$(document).ready(function(){
					     $('input.typeahead').typeahead({
					            name: 'typeahead',
					            remote:'/search?key=%QUERY',
					            limit : 10
					    });
					});
					function search(){
					   	var keyword=document.getElementById("sterm").value;
                    				window.location="/articlebyname/"+keyword;
					}
				    </script>
				<!-- search script end -->
				    <input type="text" name="typeahead" id="sterm" class="typeahead form-control" autocomplete="off" spellcheck="false" placeholder="Keywords to search article..">
				    <div class="input-group-addon src_btn"onclick="search()">
					<span class="glyphicon glyphicon-search" aria-hidden="true"></span>
				    </div>
				</div>
			
			    </form>
			    
			</div><!-- /.navbar-collapse -->
		    </nav>

		    
		    <div class="container" style="margin-top:100px;">

			<div id="login">
			    
			</div>
			<div class="col-md-8" style="margin-left:20px;margin-right:20px;padding-top:20px; background:white;">
			    ${data}
			</div>

			<div id="ads">
			    
			</div>
	
		   </div>
		    <div style="background:black;padding:10px;color:white;margin-top:30px;">
        	<p class="lead text-right">&copy;Satheesh Kumar D</p>
	</div>
		</body>
		    <!-- Javascripts -->
		    <script src="/js/bootstrap.min.js"></script>
		    
		</html>
	`;
	return articletemplate;
}

//register page template
function registerpage(){
	var template=`
		<!DOCTYPE>
	<html>
	    <head>
		<script>
		    document.title="Join Me";
		</script>
		<noscript> JavaScript Is Not Enabled On Browser </noscript>
	    <!-- Stylesheet -->
		<link href="./css/bootstrap.min.css" rel="stylesheet">
		<link href="./css/bootstrap-theme.min.css" rel="stylesheet">
		<link href="./css/bootstrap-social.css" rel="stylesheet">
		<link href="./css/font-awesome.css" rel="stylesheet">
	    <!-- Stylesheet added -->
	    <script src="./js/jquery.min.js"></script>
	    <script src="./js/typeahead.min.js"></script>
	    <!-- meta tags -->
		<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0, user-scalable=no">

	    <!-- meta end -->
	    <!-- Authors Fonts -->
		<style>
		    @font-face {
		        font-family: sat;
		        src: url(./fonts/JosefinSans-Regular.ttf);
		    }
		    @font-face {
		        font-family: satbold;
		        src: url(./fonts/JosefinSans-SemiBold.ttf);
		    }
	    	</style>
	    </head>
	<body  style="font-family:sat;background:url(/images/bg.jpg);background-attachment: fixed;">
		<div class="conatiner">
			<div class="row">
				<div class="col-lg-4"></div>
				<div class="col-lg-4" style="margin-top:100px;background:white;box-shadow: -4px 1px 12px #888888;padding:10px;">
					<legend class="text-center text-bold" style="font-family:satbold">JOIN TECH-HUNT</legend>
					<p class="text-primary text-center">Register for an account here!</p>
					<div class="input-group">
		                    		<input type="name" class="form-control" name="name" required="" id="username" placeholder="Full Name">
		                    		<div class="input-group-addon"><span class="fa fa-user"></span></div>
		                	</div>
		                	<br>
		                	<div class="input-group">
		                    		<input type="email" name="email" class="form-control" required="" id="registeremail" placeholder="Email Address" onkeyup="email_check()">
		            			<div class="input-group-addon" id="registeremail_addon"><span class="fa fa-envelope"></span></div>
		               		 </div><br>
		               		 <div class="input-group">
		                    		<input type="password" class="form-control" onkeyup="password_check()" required="" id="registerpassword" placeholder="Password">
		                    		<div class="input-group-addon" id="password_addon"><span class="fa fa-key"></span></div>
		               		 </div><br>
		               		 <div class="input-group">
		                    		<input type="password" name="password" class="form-control" onkeyup="cpassword_check()" required="" id="registercpassword" placeholder="Cofirm Password">
		                    		<div class="input-group-addon" id="passwordc_addon"><span class="fa fa-key"></span></div>
		               		 </div><br><br>
		               		 <p class="text-left text-warning">"Clicking register you agree to the rules and regulations of this website"
		               		 </p><br>
		               		 <p class="text-center">
		               		 <button id ="register_user" type="submit" class="btn btn-primary" onclick="register_user()">Register</button>
		               		 <p>
				</div>
				<div class="col-lg-4"></div>
			</div>
		</div>
	</body>
	    <!-- Javascripts -->
	    <script src="./js/bootstrap.min.js"></script>
	    <script src="./js/XaD5644G2ssFLS.js"></script>
	</html>	
	`;
	return template;
}

//creating articles
function createarticle(info){
	var atemplate=`
	<!DOCTYPE>
<html>
    <head>
        <script>
            document.title="Tech Hunt";
        </script>
        <noscript> JavaScript Is Not Enabled On Browser </noscript>
    <!-- Stylesheet -->
        <link href="/css/bootstrap.min.css" rel="stylesheet">
        <link href="/css/bootstrap-theme.min.css" rel="stylesheet">
        <link href="/css/bootstrap-social.css" rel="stylesheet">
        <link href="/css/font-awesome.css" rel="stylesheet">
    <!-- Stylesheet added -->
    <script src="/js/jquery.min.js"></script>
    <script src="/js/typeahead.min.js"></script>
    <!-- meta tags -->
        <meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0, user-scalable=no">

    <!-- meta end -->
    <!-- Authors Fonts -->
        <style>
            @font-face {
                font-family: sat;
                src: url(/fonts/JosefinSans-Regular.ttf);
            }
            @font-face {
                font-family: satbold;
                src: url(/fonts/JosefinSans-SemiBold.ttf);
            }
            .brand:hover{
                border-bottom:3px solid crimson;
            }
            .src_btn:hover{
                cursor:pointer;
            }
            .alink{
                border-bottom:3px solid black;
                border-right:1px solid grey;
            }
            .brand{
                border-right:1px solid grey;
            }
            .typeahead, .tt-query, .tt-hint {
                
                font-size: 14px;
                padding: 8px;
            }
            .typeahead {
                background-color: #FFFFFF;
            }
            .typeahead:focus {
                border: 2px solid #0097CF;
            }
            .tt-query {
                box-shadow: 0 1px 1px rgba(0, 0, 0, 0.075) inset;
            }
            .tt-hint {
                color: #999999;
            }
            .tt-dropdown-menu {
                background-color: #FFFFFF;
                border: 1px solid rgba(0, 0, 0, 0.2);
                border-radius: 8px;
                box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
                margin-top: 12px;
                padding: 8px 0;
            }
            .tt-suggestion {
                font-size: 14px;
                line-height: 24px;
                padding: 3px 20px;
                width:200px;
            }
            .tt-suggestion.tt-is-under-cursor {
                background-color: #0097CF;
                color: #FFFFFF;
            }
            .tt-suggestion p {
                margin: 0;
            }
            .margin-sm{
            	margin-top:0px;
    		}
        </style>
    </head>
<body  style="font-family:sat;background:url(/images/bg.jpg);background-attachment: fixed;">

<nav class="navbar navbar-default navbar-fixed-top" role="navigation">
        <!-- Brand and toggle get grouped for better mobile display -->
        <div class="navbar-header">
            <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-ex1-collapse">
                <span class="sr-only">Toggle navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
            
            
        </div>
    
        <!-- Collect the nav links, forms, and other content for toggling -->
        <div class="collapse navbar-collapse navbar-ex1-collapse" style="background:white;box-shadow: -4px 1px 12px #888888;">
            <ul class="nav navbar-nav text-center" style="font-family:satbold; font-size:15px;">
                <li class="brand"><a href="/" style=" padding-left:70px; padding-right:70px;">
                <span class="fa fa-home" aria-hidden="true"></span>&nbsp;HOME</a></li>
                <li></li>
                <li>
                <a class="alink" href="/articles"  style=" padding-left:70px; padding-right:70px;">
                <span class="fa fa-book" aria-hidden="true"></span>&nbsp;ARTICLES</a></li>
                <li></li>
                <li><a class="brand" href="#team_info"  style=" padding-left:70px; padding-right:70px;">
                <span class="fa fa-users" aria-hidden="true"></span>&nbsp;USERS</a></li>
                <li></li>
                <li><a class="brand" href="/techhunt"  style=" padding-left:60px;  padding-right:60px;">
                <span class="fa fa-phone" aria-hidden="true"></span>&nbsp;HELP & SUPPORT</a></li>
                <li></li>
                <li id="logout"></li>
            	<form class="navbar-form navbar-right" role="search">
                <!-- search script -->
                    <script>
                        $(document).ready(function(){
                             $('input.typeahead').typeahead({
                                    name: 'typeahead',
                                    remote:'/search?key=%QUERY',
                                    limit : 10
                            });
                        });
                        function search(){
                        	var keyword=document.getElementById("sterm").value;
                            window.location="/articlebyname/"+keyword;
                        }
                    </script>
                <!-- search script end -->
                <div class="input-group"  style="font-family:satbold; font-size:25px;">
                    <input type="text" name="typeahead" id="sterm" class="typeahead form-control" autocomplete="off" spellcheck="false" placeholder="Keyword..">
                    <div class="input-group-addon src_btn"onclick="search()">
                        <span class="fa fa-search" aria-hidden="true"></span>
                    </div>
                </div>
                
            </form>
        </div><!-- /.navbar-collapse -->
    </nav>
    
    <div class="container" style="margin-top:100px;">
        
        <div class="row">
            
            <div class="col-lg-9 text-left" style="background:white;padding:10px;margin-left:15px;margin-right:15px;">
                <h1 style="padding-left:20px;">${info.title}</h1>
                <p class="lead text-right text-primary"><a href="/satheesh1997">Posted By : Satheesh Kumar</a></p>
            </div>
            <div class="col-lg-2 text-center" style="background:white;padding:20px;margin-left:15px;margin-right:15px;">
                <h2>${info.date.toDateString()}</h2>
            </div>
        </div>  
        
        <div class="row" style="margin-top:60px;">
            
            <div class="col-lg-9" style="background:white;padding:40px;margin-left:15px;margin-right:15px;">
                <p class="lead text-center">${info.heading}
                </p>
                <div style="font-size:20px;padding:10px;">${info.content}</div>
            </div>
            <div class="col-lg-9" style="background:white;padding:40px;margin-left:15px;margin-right:15px;margin-top:50px;">
                
                <p><div id="disqus_thread"></div></p>
            </div>
            
            
        </div>
        
    </div>
  <script>

			/**
			*  RECOMMENDED CONFIGURATION VARIABLES: EDIT AND UNCOMMENT THE SECTION BELOW TO INSERT DYNAMIC VALUES FROM YOUR PLATFORM OR CMS.
			*  LEARN WHY DEFINING THESE VARIABLES IS IMPORTANT: https://disqus.com/admin/universalcode/#configuration-variables*/
			
			var disqus_config = function () {
			this.page.url = PAGE_URL;  // Replace PAGE_URL with your page's canonical URL variable
			this.page.identifier = PAGE_IDENTIFIER; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
			};
			(function() { // DON'T EDIT BELOW THIS LINE
			var d = document, s = d.createElement('script');
			s.src = '//tech-hunt.disqus.com/embed.js';
			s.setAttribute('data-timestamp', +new Date());
			(d.head || d.body).appendChild(s);
			})();
			</script>
			<noscript>Please enable JavaScript to view the <a href="https://disqus.com/?ref_noscript">comments powered by Disqus.</a></noscript>  
        <div style="background:black;padding:10px;color:white;margin-top:30px;">
        	<p class="lead text-right">&copy;Satheesh Kumar D</p>
	</div>
</body>
<script src="/js/bootstrap.min.js"></script>
</html>
	`;
	return atemplate;
}


//Setting up server
var port = 8080;
app.listen(8080, function () {
  console.log("Satheesh Kumar's blog listening on port " + port);
});


/*

//page show
app.get('/page', function(req, res){
  res.send('page_id: ' + req.query.id);
});

//user show
app.get('/user/:id', function(req, res) {
  res.send('user' + req.params.id);    
});
app.get("/users",function(req,res){
connection.query('SELECT * from user LIMIT 2', function(err, rows, fields) {
connection.end();
  if (!err)
    console.log('The solution is: ', rows);
  else
    console.log('Error while performing Query.');
  });
});

*/

