
"use strict";

const id = _id => document.getElementById(_id);

//document.querySelector("body").onload = main;

// function main() {
//     document.getElementById()
// }



function redirectRegister() {

    console.log(`This is coming from the redirectRegister fn`);

    location.href = "http://40.122.47.209/register";

    // var url = "http://40.122.47.209/register"
    // window.location(url);
}

function redirectLogin() {
    location.href = "http://40.122.47.209/login";
}

function redirectPuzzle() {
    location.href = "http://40.122.47.209/puzzle";
}



