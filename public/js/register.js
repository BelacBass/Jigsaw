"use strict";

document.querySelector("body").onload = main;

function main() {
    document.getElementById("register_form").onsubmit = (event) => {
        event.preventDefault();

        processForm(event);

        return false;
    };
}

function processForm (event) {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    console.log(`${username}`);

    if (password !== confirmPassword) {
        alert(`Passwords do not match.`);
        return;
    }

    const data = {username, password};
    fetch("http://40.122.47.209/register", {
        method: "post",
        body: JSON.stringify(data),
        headers: {"Content-Type": "application/json"}
    }).then( res => {
        //redirect to home for now, change to puzzle when finished
        //location.href = "http://40.122.47.209/";
        return res.json();
    }).then( data => {
        console.log(data);
    }).catch( err => {
        console.log(err);
    });

    // }).then( async res => {
    //     if (res.status === 200) {
    //         alert('Account Created');
    //         //redirect to home for now, change to puzzle when finished
    //         location.href = "http://40.122.47.209/";
    //     } else if (res.status === 409) {
    //         alert('Username exists');
    //     } else {
    //         window.location = '/error';
    //     }
    // }).catch( err => {
    //     console.log(err);
    // });
}



































