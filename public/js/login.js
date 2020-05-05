'use strict';

document.querySelector('body').onload = main;

function main() {
    document.getElementById('login-form').onsubmit = (event) => {
        event.preventDefault();

        sendPass();
        
        return false;
    }
}

async function sendPass() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    console.log(`we have gathered username and password`);
    const res = await fetch('http://40.122.47.209/login', {
        method: 'post',
        body: JSON.stringify({username, password}),
        headers: {'Content-Type': 'application/json'}
    });
    console.log(`we are in the middle of sendPass()`);
    if (res.status === 200) {
        alert('Login successful');
    } else if (res.status === 401) {
        alert('Incorrect username/password');
    } else {
        window.location = '/error';
    }
}