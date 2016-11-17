//Include Packages
var express = require("express");
var morgan = require("morgan");
var path = require("path");
var Pool = require('pg').Pool;
var crypto = require("crypto");
var bodyParser = require('body-parser');
var session = require('express-session');
var app=express();

var config = {
    user: 'satheesh1997',
    database: 'satheesh1997',
    host: 'db.imad.hasura-app.io',
    port: '5432',
    password: process.env.DB_PASSWORD
};

//Package Initialitation functions
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(session({
    secret: 'someRandomSecretValue',
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 30}
}));

//css routes
app.get('/css/:stylesheet', function (req, res) {
  res.sendFile(path.join(__dirname, 'blog/css', req.params.stylesheet));
});

//font routes
app.get('/fonts/:font', function (req, res) {
  res.sendFile(path.join(__dirname, 'blog/fonts', req.params.font));
});

//font routes
app.get('/favicon.ico', function (req, res) {
  res.sendFile(path.join(__dirname, 'blog', 'favicon.ico'));
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

//help page
app.get('/techhunt', function(req, res){
  res.sendFile(path.join(__dirname, 'blog', 'hp.html'));
});

//author
app.get('/satheesh1997', function(req, res){
  res.sendFile(path.join(__dirname, 'blog', 'pro.html'));
});
//flames
app.get('/flames', function(req, res){
  res.sendFile(path.join(__dirname, 'blog', 'flames.htm'));
});
//flames
app.get('/downloads/flames.zip', function(req, res){
  res.sendFile(path.join(__dirname, 'downloads', 'flames.zip'));
});
var pool = new Pool(config);
//author
app.get('/users', function(req, res){
  res.sendFile(path.join(__dirname, 'blog', 'users.html'));
});

//articles route
app.get('/articles', function(req, res){
	var content="";
	var template="";
	var j=1;
	pool.query("SELECT * FROM article",function (err, result){
      if (err) {
          res.status(500).send(err.toString());
      } else {
      	for (var i=0;i<result.rows.length;i++) {
  			template=`<div class="lead">${j}]&nbsp;&nbsp;<a href="/article/${result.rows[i].id}">${result.rows[i].title}</a></div>
  			<div class="text-primary text-right" style="margin-top:-20px;">${result.rows[i].views}&nbsp;VIEWS</div><hr>`;
        	content=content+template;
        	j=j+1;
    	}
		res.send(createTemplate(content));
      }
   });
});

//articles route
app.get('/showusers', function(req, res){
	var content="";
	var template="";
	pool.query('SELECT * FROM "user" ORDER BY id DESC', function (err, result) {
      if (err) {
          res.status(500).send(err.toString());
      } else {
      	for (var i=0;i<result.rows.length;i++) {
  			template=`<tr>
                        <td>${result.rows[i].id}</td>
                    	<td>${result.rows[i].username}</td>
                        <td>${result.rows[i].mail}</td>
                    </tr>`;
        	content=content+template;
    	}
		res.send(content);
      }
   });
});

//article byname route
app.get('/articlebyname/Articles%20List', function(req, res){
	var content="";
	var template="";
	var j=1;
	pool.query("SELECT * FROM article ORDER BY id DESC", function (err, result) {
		if (err) {
			res.status(500).send(err.toString());
		} else {
			for (var i=0;i<result.rows.length;i++) {
				template=`<div class="lead">${j}]&nbsp;&nbsp;<a href="/article/${result.rows[i].id}">${result.rows[i].title}</a></div>
				<div class="text-primary text-right" style="margin-top:-20px;">${result.rows[i].views}&nbsp;VIEWS</div><hr>`;
		  		content=content+template;
		  		j=j+1;
			}
			res.send(createTemplate(content));
		}
   });
});


//article id route
app.get('/article/:id', function(req, res){
	pool.query("SELECT * FROM article WHERE id = $1", [req.params.id], function (err, result)  {
			if (err) {
				res.status(500).send(err.toString());
			} else {
				if(result.rows.length === 0){
					res.send(errorpage("The Requested Article Is Not Found On The Server"));
				}else{
		  			pool.query('UPDATE article SET views=views+1 WHERE id =$1',[req.params.id],function(err,result){ });
					res.send(createarticle(result.rows[0]));
				}
	
		  }
   });
});


//article by name
app.get('/articlebyname/:title', function(req, res){
	pool.query('SELECT * FROM article WHERE title = $1', [req.params.title], function (err, result) {
	 	if (err) {
			res.status(500).send(err.toString());
		} else {
		  	if(result.rows.length === 0){
		  			res.send(errorpage("The Requested Article Is Not Found On The Server"));
				}else{
					pool.query("UPDATE article SET views=views+1 WHERE id =$1",[result.rows[0].id],function(err,result){ });
					res.send(createarticle(result.rows[0]));
				}
		 }
 	});
});


//register page route
app.get('/register', function(req, res){
  	res.send(registerpage());
});

//search keyword function
app.get('/search', function (req, res) {
  	var titles='["Articles List';
  	var key=req.query.key;
	pool.query("SELECT title FROM article WHERE title LIKE $1",['%'+key+'%'], function (err, result) {
		if (err) {
			res.status(500).send(err.toString());
		} else {
	  		for(var i=0;i<result.rows.length;i++) {
	    		titles=titles+'","'+result.rows[i].title;
			}
			//res.send(titles+'"]');
			res.send(JSON.stringify(result.rows.title));
		}
  	});
});

//checker_email route
app.get('/checker_email', function (req, res) {
  var mail=null;
  pool.query('SELECT * FROM "user" WHERE mail = $1',[req.query.email], function (err, result) {
		if (err) {
			res.status(500).send(err.toString());
		} else {
			if(result.rows.length == 0){
				res.status(200).send(req.query.email);
			}
			else{
				res.status(400).send(result.rows[0].mail);
			}
		}	
  });
});

//subscribe route
app.get('/subscribe', function (req, res) {
  	var email=req.query.email;
  	if(email.length>2){
	  	pool.query('INSERT INTO subscribers (email) VALUES ($1)', [req.query.email], function (err, result){
			if (err){
				res.status(500).send(err.toString());
		 	}else{
		 		res.status(200).send("SuccessFully Subcribed...");
	 		}
	  	});
  	}
  	else{
  		res.status(500).send("Use a valid Email");
  	}
});

//get-trends route
app.get('/get-trends', function (req, res) {
   	pool.query('SELECT * FROM article ORDER BY views DESC', function (err, result) {
		if (err) {
			res.status(500).send(err.toString());
		} else {
			res.send(JSON.stringify(result.rows));
		}
	});
});

app.get('/get-comments/:articleid', function (req, res) {
   // make a select request
   // return a response with the results
   pool.query('SELECT comment.*, "user".username FROM article, comment, "user" WHERE article.id = $1 AND article.id = comment.article_id AND comment.user_id = "user".id ORDER BY comment.timestamp DESC', [req.params.articleid], function (err, result){
      if (err) {
          res.status(500).send(err.toString());
      } else {
          res.send(JSON.stringify(result.rows));
      }
   });
});

app.post('/submit-comment/:articleid', function (req, res) {
   // Check if the user is logged in
    var comment=req.body.comment;
    if (req.session && req.session.auth && req.session.auth.userId) {
        // First check if the article exists and get the article-id
        var sql="SELECT * FROM article where id ="+req.params.articleid;
        pool.query(sql, function (err, result) {
            if (err) {
                res.status(500).send(err.toString());
            } else {
                if (result.rows.length === 0) {
                    res.status(400).send('Article not found');
                } else {
                    var articleId = req.params.articleid;
                    var userId = req.session.auth.userId;
                    // Now insert the right comment for this article
                    var sql="INSERT INTO comment (article_id, user_id , comment) VALUES ('"+articleId+"','"+userId+"','"+comment+"')";
                    pool.query(sql,function (err, result) {
                            if (err) {
                                res.status(500).send(err.toString());
                            } else {
                                res.status(200).send('Comment inserted!')
                            }
                    });
                }
            }
       });     
    } else {
        res.status(403).send('Only logged in users can comment');
    }
});

//create user route
app.post('/create-user', function (req, res) {
	var password = req.body.password;
	var salt = crypto.randomBytes(128).toString('hex');
	var dbString = hash(password, salt);
	pool.query('INSERT INTO "user" (username, password , mail) VALUES ($1, $2, $3)',[req.body.username,dbString,req.body.email], function (err, result) {
		if (err) {
			res.status(500).send(err.toString());
		} else {
			res.send('User successfully created: ' + username);
		}
	});
});

//login route
app.post('/login', function (req, res) {
   	var lemail = req.body.email;
   	var lpassword = req.body.password;
   	var sql = 'SELECT * FROM "user" WHERE mail = ' + connection.escape(lemail);
   	pool.query(sql, function (err, result) {
    	if (err) {
      		res.status(500).send(err.toString());
    	} else {
        	if (result.rows.length === 0) {
        		res.status(403).send('Email/password is invalid');
        	} else {
		      	var dbString = result.rows[0].password;
		      	var salt = dbString.split('$')[2];
		      	var hashedPassword = hash(lpassword, salt);
		      	if (hashedPassword === dbString) {
		        	req.session.auth = {userId:result.rows[0].id};
		        	res.send('Credentials Correct!');
		      	} else {
		        	res.status(403).send('Email/Password Is Invalid');
		      	}
        	}
      	}
   });
});

//check login route
app.get('/check-login', function (req, res) {
   	if (req.session && req.session.auth && req.session.auth.userId) {
		var sql='SELECT * FROM "user" WHERE id ='+req.session.auth.userId;
     	pool.query(sql, function (err, result) {
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

//logout route
app.get('/logout', function (req, res) {
   delete req.session.auth;
   res.sendFile(path.join(__dirname, 'blog', 'index.html'));
});

//if route not found
app.get('*', function (req, res) {
  res.send(errorpage("The Requested Path/Url Is Not Found On The Server"));
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
		<body  style="font-family:sat;background:#3b5998;">
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

		    
		    <div class="container" style="margin-top:100px;height:700px;">

			<div id="login">
			    
			</div>
			<div class="col-md-12" style="margin-left:20px;margin-right:20px;padding-top:20px; background:white;">
			    ${data}
			</div>

			<div id="ads">
			    
			</div>
	
		   </div>
	   
		 
	 <div class="col-lg-12" style="background:black;padding-top:20px;padding-bottom:20px;color:white;font-size:15px;margin-top:10px;">
        	<p class="text-center"><span class="fa fa-copyright"></span>&nbsp;Satheesh Kumar 2016-17</p>
        	<p class="text-center">Made in <span class="fa fa-heart"></span>&nbsp;India</p>
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
<body  style="font-family:sat;background:#3b5998;">


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
    <!-- sign in modal -->
    <div class="modal fade" id="sign-in">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h4 class="modal-title text-center">TECH HUNT</h4>
                </div>
                <div class="modal-body">
                    <legend>Login Form</legend>
                    <div id="loginalert">
                        <div class="alert alert-warning text-center">
                            <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
                            <strong>SECURITY SYSTEM ALERT!</strong><br> Kindly Use The Email Registered For Login in!
                        </div>
                    </div>
                    <div class="input-group">
                        <input type="email" class="form-control" required="" id="loginemail" placeholder="Email Address" onkeyup="email_check()">
                        <div class="input-group-addon" id="email_addon"><span class="fa fa-envelope"></span></div>
                    </div>
                    <br>
                    <div class="input-group">
                        <input type="password" class="form-control" required="" id="loginpassword" placeholder="Password">
                        <div class="input-group-addon" id="password_addon"><span class="fa fa-key"></span></div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">CANCEL</button>
                    <button id ="login_user" type="submit" class="btn btn-primary">LOGIN</button>
                </div>
            </div>
        </div>
    </div>
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
                
             <div class="form-group col-md-7" style="margin-top:30px;">
						<legend>COMMENTS&nbsp;|&nbsp;<span id="login_area"></span></legend>
						<textarea name="comment" id="comment" class="form-control" rows="3" required="required" placeholder="Enter your comments..."></textarea>
						<p class="text-right" style="margin-top:20px;"><button id="comment_btn" type="submit" class="btn btn-md btn-primary">
						<span class="fa fa-comment"></span>&nbsp;COMMENT</button></p>
						
						<div class="media" style="padding:5px;" id="comments">
						</div>
						
			</div>
            </div>
            <input type="hidden" id="article_id" value="${info.id}">
            
        </div>
        
    </div> 
    <div class="col-lg-12" style="background:black;padding-top:20px;padding-bottom:20px;color:white;font-size:15px;margin-top:10px;">
    	<p class="text-center"><span class="fa fa-copyright"></span>&nbsp;Satheesh Kumar 2016-17</p>
    	<p class="text-center">Made in <span class="fa fa-heart"></span>&nbsp;India</p>
	</div>
	</body>
	<script src="/js/bootstrap.min.js"></script>
	<script src="/js/comment.js"></script>
	</html>
`;

	return atemplate;
}

function errorpage(data){
	var error_template=`
		<!DOCTYPE>
<html>
    <head>
		<script>
		    document.title="404";
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
	    <script src="/js/bootstrap.min.js"></script>
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

	<body  style="font-family:sat;background:#3b5998;">

	    <div class="container" style="color:white;margin-top:100px;">
	        <p class="text-center" style="font-size:200px;"><span class="fa fa-warning"></span></p>
	        <p class="text-center" style="font-size:40px;margin-top:40px;">"${data}"</p>				
	    </div>

	<body>

</html>


	`;
	return error_template;
}


//Setting up server
var port = 8080;
app.listen(8080, function () {
  console.log("Satheesh Kumar's blog listening on port " + port);
});
