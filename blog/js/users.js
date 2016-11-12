var users=document.getElementById("users");

function loadusers(){
	var request = new XMLHttpRequest();
        request.onreadystatechange = function () {
          if (request.readyState === XMLHttpRequest.DONE) {
                if (request.status === 200) {
                	var result = this.responseText;
                    users.innerHTML=result;
                } else {
                    users.innerHTML="ERROR IN LOADING USERS";
                }
            }
        };
    request.open('GET', '/showusers');
    request.send(null);
}

loadusers();

/*<tr>
                                    <td>USER_ID</td>
                                    <td>NAME</td>
                                    <td>EMAIL</td>
                                </tr>`
                                */