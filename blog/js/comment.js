var articleId=window.location.pathname.split('/')[2];
var comments=document.getElementById("comments");
var comment_btn=document.getElementById("comment_btn");
var comment_template="";

//When The Comment Btn Is Clicked

function escapeHTML (text)
{
    var $text = document.createTextNode(text);
    var $div = document.createElement('div');
    $div.appendChild($text);
    return $div.innerHTML;
}

comment_btn.onclick= function(){
        var request = new XMLHttpRequest();
        // Capture the response and store it in a variable
        request.onreadystatechange = function () {
          if (request.readyState === XMLHttpRequest.DONE) {
                // Take some action
                if (request.status === 200) {
                    // clear the form & reload all the comments
                    document.getElementById("comment").value = '';
                    loadComments();    
                } else {
                    document.getElementById("comment").value="Must Login Before Posting Comment";
                }
                comment_btn.value = 'COMMENT';
          }
        };
        var comment=document.getElementById("comment").value;
        // Make the request
        request.open('POST', '/submit-comment/' + articleId, true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(JSON.stringify({comment: comment}));  
        comment_btn.value = 'Submitting...';
        
}

function loadComments () {
        // Check if the user is already logged in
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE) {
            if (request.status === 200) {
                var content = '';
                var commentsData = JSON.parse(this.responseText);
                for (var i=0; i< commentsData.length; i++) {
                    var time = new Date(commentsData[i].timestamp);
                    comment_template=`<a class="pull-left" href="#">
					<img class="media-object" src="/images/photo.jpg" alt="Image" width="50px";>
					</a>
					<div class="media-body" style="margin-left:10px;">
						<p class="text-primary">${escapeHTML(commentsData[i].username)}</p> 
						<p class="pull-right"style="margin-top:-8px;color:grey;font-size:10px;">${time.toLocaleTimeString()} on ${time.toLocaleDateString()} </p>
						<p style="margin-top:3px;">${escapeHTML(commentsData[i].comment)}</p>
					</div>
					<hr style="border-top:1px solid grey;">`;
                    content += comment_template;
                }
                comments.innerHTML = content;
            } else {
                comments.innerHTML('Oops! Could not load comments!');
            }
        }
    };
    
    request.open('GET', '/get-comments/' + articleId, true);
    request.send(null);
}

loadComments();

function loadLoggedInUser (username) {
	var loginArea = document.getElementById('login_area');
	loginArea.innerHTML = `<h4 style="color:crimson;"><b>${escapeHTML(username)}</b></h4>`;
}


function loadLoginForm () {
	var loginHtml = `
		<a href="/register" class="btn btn-danger btn-sm"><span class="fa fa-sign-in"></span>&nbsp;Sign Up</a>
  	<a class="btn btn-primary btn-sm"  data-toggle="modal" href='#sign-in'><span class="fa fa-sign-in"></span>&nbsp;Sign In</a>`;
    document.getElementById('login_area').innerHTML = loginHtml;
}

function loadLogin () {
	// Check if the user is already logged in
  var request = new XMLHttpRequest();
  request.onreadystatechange = function () {
  	if (request.readyState === XMLHttpRequest.DONE) {
    	if (request.status === 200) {
      	loadLoggedInUser(this.responseText);
      } else {
        loadLoginForm();
    	}
  	}
	};
    request.open('GET', '/check-login', true);
    request.send(null);
}

loadLogin();

setInterval(loadComments,5000);
setInterval(loadLogin,30000);

var submit = document.getElementById('login_user');

submit.onclick = function () {
	// Create a request object
  var request = new XMLHttpRequest();
	// Capture the response and store it in a variable
  request.onreadystatechange = function () {
		if(request.readyState === XMLHttpRequest.DONE) {
			// Take some action
		  if(request.status === 200) {
				submit.value = 'Sucess!';
				//document.getElementById("sign-in").innerHTML="";
				window.location=window.location.pathname;
		  } else if (request.status === 403) {
		    submit.value = 'Invalid credentials. Try again?';
		  } else if (request.status === 500) {
		    alert('Something went wrong on the server');
		    submit.value = 'Login';
		  } else {
		    alert('Something went wrong on the server');
		    submit.value = 'Login';
		  }
		    loadLogin();
		}
  };
  // Make the request
  var email = document.getElementById('loginemail').value;
  var password = document.getElementById('loginpassword').value;
  console.log(email);
  console.log(password);
  request.open('POST', '/login', true);
  request.setRequestHeader('Content-Type', 'application/json');
  request.send(JSON.stringify({email: email, password: password}));  
  submit.value = 'Logging in...';   
};

document.getElementById("login_user").disabled=true;
function email_check(){
	var loginemail=document.getElementById("loginemail");
	var email_addon=document.getElementById("email_addon");
	var XMLHttpRequestObject=false;
  XMLHttpRequestObject= new XMLHttpRequest();
  	if(XMLHttpRequestObject){
    	XMLHttpRequestObject.open("GET","/checker_email?email="+loginemail.value);
      XMLHttpRequestObject.onreadystatechange = function(){
      	if(XMLHttpRequestObject.status != 400){
		    	//function if mail is not in server
		    	email_addon.innerHTML=`<span class="fa fa-times" style="color:red"></span>`;
		    	document.getElementById("login_user").disabled=true;
        }
        else{
          //function if mail is found on the server
          email_addon.innerHTML=`<span class="fa fa-check"  style="color:green;"></span>`;
          document.getElementById("login_user").disabled=false;
        }
    }
			XMLHttpRequestObject.send(null);
    }
}