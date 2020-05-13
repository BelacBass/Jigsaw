'use strict';

document.querySelector('body').onload = main;

function main () {
    document.getElementById('login-form').onsubmit = (event) => {
        event.preventDefault();
        
        sendPass();
        
        return false;
    }
}

async function sendPass () {

    //console.log("sending password to db");

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const res = await fetch('http://40.122.47.209/login', {
        method: 'post',
        body: JSON.stringify({username, password}),
        headers: {'Content-Type': 'application/json'}
    });
    if (res.status === 200) {
        alert('Login successful');
        location.href = "http://40.122.47.209/puzzle";
    } else if (res.status === 401) {
        alert('Incorrect username/password');
    } else {
        //window.location = '/error';
        console.log('error');
    }
}
















