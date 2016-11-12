/*
Tech Hunt's Register System Monitor....
Version:0.0.1
Author:Satheesh Kumar D
*/


// Offline java script to check wheather the email entered is present in server
var eerror=1;
var cerror=1;
var perror=1;


document.getElementById("register_user").disabled=true;


function email_check(){
	var loginemail=document.getElementById("registeremail");
	var email_addon=document.getElementById("registeremail_addon");
  var XMLHttpRequestObject=false;
  XMLHttpRequestObject= new XMLHttpRequest();
  	if(XMLHttpRequestObject){
    	XMLHttpRequestObject.open("GET","/checker_email?email="+loginemail.value);
    	XMLHttpRequestObject.onreadystatechange = function(){
      	if(XMLHttpRequestObject.status == 400){
		    //function if mail is found in server
		    	email_addon.innerHTML=`<span class="fa fa-times" style="color:red"></span>`;
		    	document.getElementById("register_user").disabled=true;
		    	eerror=1;
      	}
        else{
        	//function if mail is not found on the server
          email_addon.innerHTML=`<span class="fa fa-check"  style="color:green;"></span>`;
          document.getElementById("register_user").disabled=false;
          eerror=0;
        }
      }
    	XMLHttpRequestObject.send(null);
    }
}

//check wheater the password is greater than 8 chars
function password_check(){
	var password=document.getElementById("registerpassword").value;
	var pass_addon=document.getElementById("password_addon");
	if(password.length < 8){
	//if the password is less than 8 chars
		pass_addon.innerHTML=`<span class="fa fa-times" style="color:red"></span>`;
  	document.getElementById("register_user").disabled=true;
  	perror=1;
	}
	else{
		pass_addon.innerHTML=`<span class="fa fa-check"  style="color:green;"></span>`;
  	document.getElementById("register_user").disabled=false;
  	perror=0;
	}
}

//check wheater the password is equall to the confirm password
function cpassword_check(){
	var password=document.getElementById("registerpassword").value;
	var cpassword=document.getElementById("registercpassword").value;
	var pass_addon=document.getElementById("passwordc_addon");
	if(password != cpassword){
	//if the password is equall
		pass_addon.innerHTML=`<span class="fa fa-times" style="color:red"></span>`;
  	document.getElementById("register_user").disabled=true;
  	cerror=1;
	}
	else{
		pass_addon.innerHTML=`<span class="fa fa-check"  style="color:green;"></span>`;
  	document.getElementById("register_user").disabled=false;
  	cerror=0;
	}
}

var register = document.getElementById('register_user');


register.onclick = function () {
        // Create a request object
	if(eerror == 1 || perror == 1 || cerror == 1){
		alert("Check Your Details Correctly");
  	document.getElementById("register_user").disabled=true;
	}
	else{
  	var request = new XMLHttpRequest();
    	// Capture the response and store it in a variable
      request.onreadystatechange = function () {
      	if (request.readyState === XMLHttpRequest.DONE) {
      		// Take some action
          if (request.status === 200) {
          	alert('User created successfully');
            register.value = 'Registered!';
            window.location("/");
            document.getElementById('username').value="";
        		document.getElementById('registerpassword').value="";
        		document.getElementById('registeremail').value="";
            } else {
            	alert('Could not register the user');
              register.value = 'Register';
            }
          }
        };
        // Make the request
        var username = document.getElementById('username').value;
        var password = document.getElementById('registerpassword').value;
        var email = document.getElementById('registeremail').value;
        console.log(username);
        console.log(email);
        request.open('POST', '/create-user', true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(JSON.stringify({username: username, password: password, email:email}));  
        register.value = 'Registering..';
    }
    
};



