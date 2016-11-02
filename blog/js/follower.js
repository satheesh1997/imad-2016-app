function follow(){
    senddata("./follower.php?action=1");
}

function ufollow(){
    senddata("./follower.php?action=2");
}


function senddata(datasource){
    var XMLHttpRequestObject=false;
    XMLHttpRequestObject= new XMLHttpRequest();
    if(XMLHttpRequestObject){
        XMLHttpRequestObject.open("GET",datasource);
        XMLHttpRequestObject.onreadystatechange = function(){
            if(XMLHttpRequestObject.readyState == 4 && XMLHttpRequestObject.status == 200){
                if(XMLHttpRequestObject.responseText == "success"){
                    console.log("SUCCESS");
                }
                else{
                    prompt("Error In Following!");
                }
            }
        }
        XMLHttpRequestObject.send(null);
    }
}