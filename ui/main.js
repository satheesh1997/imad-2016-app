console.log('WEB APP LOADED SUCCESSFULLY!');

var post_btn = document.getElementById("post-btn");
var text1 = document.getElementById("name");
var text2 = document.getElementById("mail");
var text3 = document.getElementById("feed");
//Post Button Click function 

post_btn.onclick = function(){
    var name = text1.value;
    var email = text2.value;
    var feed = text3.value;
    alert("FEED SUBMITED SUCCESSFULLY")
    console.log("Feed Added:");
    console.log("%s has posted %s using email %s",name,feed,email)
};

