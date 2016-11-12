/*
Tech Hunt's Login Security System Monitor....
Version:0.0.1
Author:Satheesh Kumar D
*/


// Offline java script to check wheather the email entered is present in server
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

function loadLoggedInUser (username) {
	var loginArea = document.getElementById('login_area');
	loginArea.innerHTML = `<h4 style="color:yellow;"> Welcome <i>${username}</i></h4>`;
  document.getElementById("logout").innerHTML=`<a class="brand" href="/logout"  style=" padding-left:20px;  padding-right:20px;">
  <span class="fa fa-sign-out" aria-hidden="true"></span>&nbsp;LOGOUT</a>`;   
}


function loadLoginForm () {
	var loginHtml = `
		<a href="/register" class="btn btn-danger btn-lg"><span class="fa fa-sign-in"></span>&nbsp;Sign Up</a>
  	<a class="btn btn-primary btn-lg"  data-toggle="modal" href='#sign-in'><span class="fa fa-sign-in"></span>&nbsp;Sign In</a>`;
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
				window.location="/";
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

//load login function
loadLogin();


