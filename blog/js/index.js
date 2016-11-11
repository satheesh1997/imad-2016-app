var t1=document.getElementById("t1");
var t2=document.getElementById("t2");
var t3=document.getElementById("t3");
var t4=document.getElementById("t4");
var t5=document.getElementById("t5");

t1.innerHTML=`<div class="loader4"></div><p class="lead text-center">LOADING</p>`;
t2.innerHTML=`<div class="loader4"></div><p class="lead text-center">LOADING</p>`;
t3.innerHTML=`<div class="loader4"></div><p class="lead text-center">LOADING</p>`;
t4.innerHTML=`<div class="loader4"></div><p class="lead text-center">LOADING</p>`;
t5.innerHTML=`<div class="loader4"></div><p class="lead text-center">LOADING</p>`;

function loadtrends(){
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE) {
            if (request.status === 200) {
                var trends = JSON.parse(this.responseText);
                    t1.innerHTML=`
			<legend class="text-center" style="font-family:satbold;font-size:17px;">${trends[0].title}</legend> 
                   	<p class="text-center">
                   	<img src="${trends[0].image}" width="150px;"/>
                   	</p>
                    	<p class="legend">${trends[0].heading}</p>
                    	<p class="text-right text-primary"><a href="/article/${trends[0].id}">More>>></a></p>
		`;
		t2.innerHTML=`
			<legend class="text-center" style="font-family:satbold;font-size:17px;">${trends[1].title}</legend> 
                   	<p class="text-center">
                   	<img src="${trends[1].image}" width="150px;"/>
                   	</p>
                    	<p class="legend">${trends[1].heading}</p>
                    	<p class="text-right text-primary"><a href="/article/${trends[1].id}">More>>></a></p>
		`;
		t3.innerHTML=`
			<legend class="text-center" style="font-family:satbold;font-size:17px;"> ${trends[2].title}</legend> 
                   	<p class="text-center">
                   	<img src="${trends[2].image}" width="150px;"/>
                   	</p>
                    	<p class="legend">${trends[2].heading}</p>
                    	<p class="text-right text-primary"><a href="/article/${trends[2].id}">More>>></a></p>
		`;
		t4.innerHTML=`
			<legend class="text-center" style="font-family:satbold;font-size:17px;"> ${trends[3].title}</legend> 
                   	<p class="text-center">
                   	<img src="${trends[3].image}" width="150px;"/>
                   	</p>
                    	<p class="legend"${trends[3].heading}></p>
                    	<p class="text-right text-primary"><a href="/article/${trends[3].id}">More>>></a></p>
		`;
		t5.innerHTML=`
			<legend class="text-center" style="font-family:satbold;font-size:17px;"> ${trends[4].title}</legend> 
                   	<p class="text-center">
                   	<img src="${trends[4].image}" width="150px;"/>
                   	</p>
                    	<p class="legend">${trends[4].heading}</p>
                    	<p class="text-right text-primary"><a href="/article/${trends[4].id}">More>>></a></p>
		`;
            } else {
                t1.innerHTML=`<p class="text-center text-danger">ERROR IN LOADING</p>`;
		t2.innerHTML="ERROR LOADING....";
		t3.innerHTML="ERROR LOADING....";
		t4.innerHTML="ERROR LOADING....";
		t5.innerHTML="ERROR LOADING....";
            }
        }
    };
    
    request.open('GET', '/get-trends');
    request.send(null);
}

loadtrends();

