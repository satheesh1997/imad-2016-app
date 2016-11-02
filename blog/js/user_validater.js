var label=document.getElementById("myname");

var uname=document.getElementById("uname");
var pass=document.getElementById("pass");

var nsubmit=document.getElementById("nsubmit");
var psubmit=document.getElementById("psubmit");

var alert=document.getElementById("alert");


nsubmit.onclick=function(){
    nsubmit.value="Verifying..";
    nsubmit.disabled="true";
    checker();
}

psubmit.onclick=function(){
    psubmit.value="Logging in...";
    psubmit.disabled="true";
    pchecker();
}

function checker(){
    if(uname.value){
        console.log("CH: Checking For User Details......");
        getData("validate_user.php?uname=" + uname.value);
    }
    else{
        nsubmit.value="Submit";
        nsubmit.disabled=false;
    }
}

function pchecker(){
    if(pass.value){
        console.log("CH: Verifying User......");
        getpData("validate_user.php?pass=" + pass.value);
    }
    else{
        psubmit.value="Submit";
        psubmit.disabled=false;
    }
}


function getData(datasource){
    var XMLHttpRequestObject=false;
    XMLHttpRequestObject= new XMLHttpRequest();
    if(XMLHttpRequestObject){
        XMLHttpRequestObject.open("GET",datasource);
        XMLHttpRequestObject.onreadystatechange = function(){
            if(XMLHttpRequestObject.readyState == 4 && XMLHttpRequestObject.status == 200){
                if(XMLHttpRequestObject.responseText == "nouser"){
                    alert.innerHTML=`<div class="alert alert-danger" style="margin-left:10px;margin-right:10px;">
                            <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
                            Account Not Exists!
                    </div>`;
                    console.log("User Details Not Found");
                    nsubmit.value="Submit";
                    nsubmit.disabled=false;
                }
                else{
                    label.innerHTML=XMLHttpRequestObject.responseText;
                    console.log("User Details Found");
                    uname.type="hidden";
                    nsubmit.type="hidden";
                    pass.type="password";
                    psubmit.type="submit";
                }
            }
        }
        XMLHttpRequestObject.send(null);
    }
}

function getpData(datasource){
    var XMLHttpRequestObject=false;
    XMLHttpRequestObject= new XMLHttpRequest();
    if(XMLHttpRequestObject){
        XMLHttpRequestObject.open("GET",datasource);
        XMLHttpRequestObject.onreadystatechange = function(){
            if(XMLHttpRequestObject.readyState == 4 && XMLHttpRequestObject.status == 200){
                if(XMLHttpRequestObject.responseText == "mismatch"){
                    alert.innerHTML=`<div class="alert alert-danger" style="margin-left:10px;margin-right:10px;">
                            <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
                            Password Mismatch
                    </div>`;
                    psubmit.innerHTML="Submit";
                    psubmit.disabled=false;
                }
                else{
                    console.log("Success");
                    setTimeout(function(){
        		window.location.href="./home.php";
                    },5000);
                }
            }
        }
        XMLHttpRequestObject.send(null);
    }
}

