var nerror=1;
var perror=1;

function rchecker(){
    if(document.getElementById("rname").value){
        getrData("validate_user.php?qu=" + document.getElementById("rname").value);
    }
    if(perror == 0 && nerror ==0){
            console.log("Register Form Can Be Submitted Now");
            rsubmit.disabled=false;
    }
    else{
        rsubmit.disabled=true;
    }
}

function getrData(datasource){
    var XMLHttpRequestObject=false;
    XMLHttpRequestObject= new XMLHttpRequest();
    if(XMLHttpRequestObject){
        XMLHttpRequestObject.open("GET",datasource);
        var hname=document.getElementById("hname");
        XMLHttpRequestObject.onreadystatechange = function(){
            if(XMLHttpRequestObject.readyState == 4 && XMLHttpRequestObject.status == 200){
                if(XMLHttpRequestObject.responseText == "notok"){
                    hname.innerHTML="User Name Already Taken!";
                    hname.style.color="red";
                    rsubmit.disabled=true;
                    nerror=1;
                }
                else{
                    hname.innerHTML="User Name available!";
                    hname.style.color="green";
                    nerror=0;
                }
            }
        }
        XMLHttpRequestObject.send(null);
    }
}


function pcheck(){
    var rpass=document.getElementById("rpass");
    if(rpass.value.length < 8){
        var hpass=document.getElementById("hpass");
        hpass.innerHTML="Must be > 8 chars!";
        hpass.style.color="red";
        rsubmit.disabled=true;
        perror=1;
    }
    else{
        var hpass=document.getElementById("hpass");
        hpass.innerHTML="Good";
        hpass.style.color="green";
        perror=0;
    }
    if(perror == 0 && nerror ==0){
            console.log("Register Form Can Be Submitted Now");
            rsubmit.disabled=false;
    }
    else{
        rsubmit.disabled=true;
    }
    
}

function cpcheck(){
    var rpass=document.getElementById("rpass");
    var rcpass=document.getElementById("rcpass");
    var rsubmit=document.getElementById("rsubmit");
    if(rpass.value != rcpass.value){
        var hcpass=document.getElementById("hcpass");
        hcpass.innerHTML="Passwords Mismatch";
        hcpass.style.color="red";
        rsubmit.disabled=true;
         perror=1;
    }
    else{
        var hcpass=document.getElementById("hcpass");
        hcpass.innerHTML="Passwords Accepted!";
        hcpass.style.color="green";
        perror=0;
    }
    if(perror == 0 && nerror ==0){
            console.log("Register Form Can Be Submitted Now");
            rsubmit.disabled=false;
    }
    else{
        rsubmit.disabled=true;
    }
}

