// var canvas;  
// var ctx;
// var x = 400;
// var y = 300;
// var dx = 2;
// var dy = 4;
// var width = 400;
// var height = 400; 

// function square()

var placementx = Math.floor(Math.floor(window.innerWidth * 0.5) - 50);
var placementy = Math.floor(window.innerHeight - 116);

// location array
var jigsawlocation = [];
var size = 3;
for(i = 0; i < (size * size); i++){
    jigsawlocation.push(0);
}
console.log(jigsawlocation.length);

jigsawlocation[(size - 1)] = 1;

for(i = 0; i < (size * size); i++){
    console.log(jigsawlocation[i]);
}

// position
function column(jigsawIndex) {
    var colNumber = 0;
    if(jigsawIndex === 0 || jigsawIndex === 3 || jigsawIndex === 6){
        colNumber = 1;
    }
    else if(jigsawIndex === 1 || jigsawIndex === 4 || jigsawIndex ===7){
        colNumber = 2; 
    }
    else if(jigsawIndex === 2 || jigsawIndex === 5 || jigsawIndex === 8){
        colNumber = 3;
    }
    return colNumber;
}

function row(jigsawIndex) {
    var rowNumber = 0;
    if(jigsawIndex === 0 || jigsawIndex === 1 ||jigsawIndex === 2){
        rowNumber = 1;
    }
    else if(jigsawIndex === 3 || jigsawIndex === 4 || jigsawIndex === 5){
        rowNumber = 2; 
    }
    else if(jigsawIndex === 6 || jigsawIndex === 7 || jigsawIndex === 8){
        rowNumber = 3;
    }
    return rowNumber;
}

// movesets
var openmove;
var index;

function rightmove(index) {
   
}


function moveBall() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    console.log(`The window is ${width}x${height}`);
    const x =  Math.floor(placementx + 100);
    const y =  Math.floor(placementy);
    placementx = x;

    const ball = document.getElementById("ball");
    ball.style.left = `${x}px`;
    ball.style.top = `${y}px`;
}



