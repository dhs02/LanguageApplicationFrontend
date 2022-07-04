// GET Requests
const loadAllUsers = async () => {
    const url = 'http://localhost:9000/api/users/';
    await fetch(url, {method: 'GET'})
        .then(response => response.json())
        .then(users => {
            let userList = '<ul>';
            users.forEach(user => {
                userList += `<li>${user.id} ${user.firstName} ${user.lastName} ${user.dateOfBirth} ${user.email} ${user.dateCreated} ${user.dateLastModified}</li>`;
            });
            userList += '</ul>';
            document.querySelector('#printUsers').innerHTML = userList;
        });
}

const loadSingleUser = async () => {
    const url = 'http://localhost:9000/api/users/';
    const input = document.querySelector('#loadSingleUser').value;
    await fetch(url + input, {method: 'GET'})
        .then(response => response.json())
        .then(user => {
            const userItem = `<ul><li>${user.id} ${user.firstName} ${user.lastName} ${user.dateOfBirth} ${user.email} ${user.dateCreated} ${user.dateLastModified}</li></ul>`;
            document.querySelector('#printSingleUser').innerHTML = userItem;
        });
}

// POST Requests
const addUserToDatabase = async () => {
    const url = 'http://localhost:9000/api/users/';
    const user = {
        firstName : document.querySelector('#firstName').value,
        lastName : document.querySelector('#lastName').value,
        dateOfBirth : document.querySelector('#dateOfBirth').value,
        email : document.querySelector('#email').value,
        username : document.querySelector('#username').value,
        password : document.querySelector('#password').value
    };
    await fetch(url, {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {'Content-Type': 'application/json'}
    })
    .then(response => response.json())
    .then(responseBody => {
        if (responseBody.status === 409) {
            const testDivje = document.querySelector('#testDivje');
            testDivje.innerHTML = responseBody.message;
            console.log(responseBody.message);
        }
    });
    loadAllUsers();
}

// DELETE Requests
const deleteSingleUser = async () => {
    const url = "http://localhost:9000/api/users/";
    const input = document.querySelector('#userInputDeleteSingleUser').value;
    await fetch(url + input, {method: 'DELETE'})
        .then(response => response.text());
        //.then(responseBody => console.log(responseBody))
    loadAllUsers();
}

// PUT Requests
const editSingleUser = async () => {
    const url = "http://localhost:9000/api/users/";
    const input = document.querySelector('#userInputEditSingleUser').value;
    const user = {
        firstName : document.querySelector('#firstName').value,
        lastName : document.querySelector('#lastName').value,
        dateOfBirth : document.querySelector('#dateOfBirth').value,
        email : document.querySelector('#email').value,
        username : document.querySelector('#username').value,
        password : document.querySelector('#password').value
    };
    await fetch(url + input, {
        method: 'PUT',
        body: JSON.stringify(user),
        headers: {'Content-Type': 'application/json'}
    })
    .then(response => response.json());
   loadAllUsers();
}



//   .then(response => response.json())
//   .then(data => {console.log('Success:', data);})
//   .catch(error => {console.error('Error:', error);});




// function loadAllUsers() {
//     let xhr = new XMLHttpRequest();
//     xhr.onreadystatechange = function(){
//         if (xhr.readyState == 4) {
//             if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
//                 let users = JSON.parse(this.responseText);
//                 let string1 = "<ul>";
//                 for (i=0 ; i<users.length; i++) {
//                     string1 += "<li>"+ users[i].id + " " + users[i].firstName + " " + users[i].lastName + " " + users[i].dateOfBirth + " " + users[i].email + " " + users[i].dateCreated + " " + users[i].dateLastModified + "</li>";
//                 }
//                 string1 += "</ul>";
//                 document.getElementById("printUsers").innerHTML = string1;
//             }
//         }
//     }
//     xhr.open("GET","http://localhost:9000/api/users/", true);
//     xhr.send();
// }

// function loadSingleUser() {
//     let input = document.getElementById('loadSingleUser').value;
//     let xhr = new XMLHttpRequest();
//     xhr.onreadystatechange = function() {
//         if (xhr.readyState == 4) {
//             if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
//                 let user = JSON.parse(this.responseText);
//                 let string1 = "<ul><li>"+ user.id + " " + user.firstName + " " + user.lastName + " " + user.dateOfBirth + " " + user.email + " " + user.dateCreated + " " + user.dateLastModified + "</li></ul>";
//                 document.getElementById("printSingleUser").innerHTML = string1;
//             }
//         }
//     }
//     xhr.open("GET","http://localhost:9000/api/users/"+input, true);
//     xhr.send();
// }

// function addUserToDatabase() {
//     let user = {
//         firstName : document.getElementById('firstName').value,
//         lastName : document.getElementById('lastName').value,
//         dateOfBirth : document.getElementById('dateOfBirth').value,
//         email : document.getElementById('email').value,
//         username : document.getElementById('username').value,
//         password : document.getElementById('password').value,
//     };
//     let json = JSON.stringify(user);

//     let xhr = new XMLHttpRequest();
//     xhr.onloadend = function() {
//         if (xhr.status == 409) {
//             alert("User already exists.");
//         }
//     }
//     xhr.onreadystatechange = function() {
//         if (xhr.readyState == 4) {
//             if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
//                 loadAllUsers();
//             }
//         }
//     }
//     xhr.open("POST","http://localhost:9000/api/users/", true);
//     xhr.setRequestHeader("Content-type","application/json");
//     xhr.send(json);
// }