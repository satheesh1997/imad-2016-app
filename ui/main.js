console.log('WEB APP LOADED SUCCESSFULLY!');


//Nav Click Buttons

var blog_btn = document.getElementById("blog-btn");
var contact_btn = document.getElementById("contact-btn");
var about_btn = document.getElementById("about-btn");

//blog-btn function
blog_btn.onclick = function(){
    console.log("Window Blog Button Pressed");
    window.location.href="/blog";
};

blog_btn.onmouseover = function(){
    blog_btn.style.color="pink";
    console.log("Window Blog Button Hovered Up");
};
blog_btn.onmouseleave = function(){
    blog_btn.style.color="yellow";
    console.log("Window Blog Button Hovered Down");
};

//contact_btn function

contact_btn.onclick = function(){
    console.log("Window contact Button Pressed");
    window.location.href="/index/#contact";
};

contact_btn.onmouseover = function(){
    contact_btn.style.color="pink";
    console.log("Window contact Button Hovered Up");
};
contact_btn.onmouseleave = function(){
    contact_btn.style.color="yellow";
    console.log("Window contact Button Hovered Down");
};

//about_btn function

about_btn.onclick = function(){
    console.log("Window about Button Pressed");
    window.location.href="/index";
};

about_btn.onmouseover = function(){
    about_btn.style.color="pink";
    console.log("Window about Button Hovered Up");
};
about_btn.onmouseleave = function(){
    about_btn.style.color="yellow";
    console.log("Window about Button Hovered Down");
};

var fs = require("fs");

var data = fs.readFileSync("posts.agx").toString();

console.log(data);




