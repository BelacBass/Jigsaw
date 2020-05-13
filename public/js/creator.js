"use strict";

const id = _id => document.getElementById(_id);
var canvas = document.getElementById("canvas"),
ctx = canvas.getContext("2d");

/*
    set canvas size
*/
canvas.width = canvas.height = 750;

/*
    set puzzle size attributes
*/
var name,
    size,
    pieces,
    width,
    height,
    shapes = [],
    gridLocation = [];

// data for loading picture
var input = document.getElementById("input"),
    reader = new FileReader(),
    img = new Image(),
    imgW,
    imgH,
    imgData,
    tileDim,
    tileCountX,
    tileCountY,
    tiles = [];

document.querySelector("body").onload = main;

function main() {
    document.getElementById('puzzle-form').onsubmit = (event) => {
        event.preventDefault();

        processFormSubmit(event);

        return false;
    }

    document.getElementById('save-form').onsubmit = (event) => {
        event.preventDefault();

        processFormSave(event);

        return false;
    }
}

async function processFormSubmit(event) {
    let selectedSize = id('puzzle-size').value;
    size = selectedSize;
    console.log(`selected size is: ${size}`);

    // the following makes sure that the index used in ImageData() is meets the requirments: must be a multiple of (4 * width) or (4 * width * height)
    //      a side-effect of this is that as the over-all size of the puzzle varies as the number of puzzle pieces change
    var tempWidth = canvas.width/size;
    width = tempWidth - (tempWidth % 4);
    var tempHeight = canvas.height/size;
    height = tempHeight - (tempHeight % 4);

    tileDim = height;
    tileCountX = tileCountY = size;

    reader.readAsDataURL(input.files[0]);
    reader.onload = function() {
        img.src = reader.result;
        img.onload = function() {
            grabImage();
            draw();
        }   
    }

    console.log(input.files[0]);
    console.log(input.files[0].name);

    // fetch("http://40.122.47.209/creator", {
    //     method: "post",
    //     //body: JSON.stringify(data),
    //     headers: {"Content-Type": "application/json"}
    // }).then( async res => {
    //     if(res.status === 200) {
    //         console.log("status 200");
    //     }
    // }).catch( err => {
    //     console.log(err);
    // })
}

async function processFormSave(event) {

    const puzzleName = document.getElementById("puzzle-name").value;
    const puzzleImg = input.files[0].name;
    const puzzleSize = size;

    // var imgData;
    // var xhr = new XMLHttpRequest();
    // var imgUri = img.src;  // your image url which you needed to download first
    // xhr.open("GET", imgUri);
    // xhr.responseType = "blob";  // just make sure you get the blob type in response
    // xhr.onload = function() {
    // imgData = xhr.response;
    // uploadImage(imgData);
    // }
    // xhr.send();


    const data = {puzzleName, puzzleImg, puzzleSize};
    fetch("http://40.122.47.209/upload", {
        method: "post",
        body: JSON.stringify(data),
        headers: {"content-Type": "application/json"}
    }).then( async res=> {
        if(res.status === 200) {
            alert('Puzzle Saved');
        } else {
            console.log("warning");
            //window.loaction = '/error'
        }
    }).catch( err => {
        console.log("err");
    })




}

/*
    get mouse location inside of canvas
*/
function getMousePos(canvas, event) {
	var rect = canvas.getBoundingClientRect();
	return {
		x: event.clientX - rect.left,
		y: event.clientY - rect.top
	};
}

/*
    canvas listening for click
*/
canvas.addEventListener('click', function(evt) {
    var mousePos = getMousePos(canvas, evt);
    console.log(mousePos);

    var column = Math.floor(mousePos.x/width);
    var row = Math.floor(mousePos.y/height);

    console.log(`row: ${row}, column: ${column}`);

    movePiece(mousePos.x, mousePos.y, row, column);

}, false);

/*
    functions to help find the row, column, and (x,y) coordinates for each piece
*/
function row(gridNum) {
    return Math.floor(gridNum/size);
}

function column(gridNum) {
    return gridNum % size;
}

function coordinates(gridNum) {
    var coordX = column(gridNum) * width;
    var coordY = row(gridNum) * height;
    return {
        x:coordX,
        y:coordY
    };
}

function setPuzzle() {
    shapes.length = 0; // empty shapes[]
    gridLocation.length = 0;
    tiles.length = 0;

    getTiles();
    
    pieces = Math.pow(size, 2) - 1;
    // width = canvas.width/size;
    // height = canvas.height/size;
    console.log(`pieces: ${pieces}, width: ${width}, height: ${height}`);

    // store shapes
    for(var i = 0; i < pieces; i++){
        var grid = coordinates(i);
        shapes.push({curLocation:i, piecesNum:i, x:grid.x, y:grid.y}); 
    }

    // set the empty space 0 to bottom right corner
    for(var i = 0; i < (size*size); i++){
        gridLocation.push(1);
    }
    gridLocation[pieces] = 0;

    // return imgTiles;
}

function draw(){

    // var tiles = setPuzzle();
    setPuzzle();

    ctx.clearRect(0,0,canvas.width,canvas.height);
    //background grey
    ctx.fillStyle = "rgb(234,240,238)";
    ctx.fillRect(0, 0, (width * size), (height * size));
    ctx.strokeRect(0, 0, (width * size), (height * size));

    ctx.stokeStyle = "grey";
    for(var i = 0; i < pieces; i++) {

        // console.log(shapes[i]);
        var index = shapes[i].piecesNum;
        
        // console.log(`index: ${index}`);        

        ctx.putImageData(tiles[index], tiles[index].x, tiles[index].y);
        ctx.strokeRect(shapes[index].x, shapes[index].y, imgW, imgH);
    }
}

// look into combining draw() and redraw()
//      try to have an if statment that allows for setPuzzle()
function redraw(){

    ctx.clearRect(0,0,canvas.width,canvas.height);
    //background grey
    ctx.fillStyle = "rgb(234,240,238)";
    ctx.fillRect(0, 0, (width * size), (height * size));
    ctx.strokeRect(0, 0, (width * size), (height * size));

    ctx.stokeStyle = "grey";
    for(var i = 0; i < pieces; i++) {

        // console.log(shapes[i]);

        var index = shapes[i].piecesNum;

        // console.log(`index: ${index}`);        

        ctx.putImageData(tiles[index], shapes[index].x, shapes[index].y);
        ctx.strokeRect(shapes[index].x, shapes[index].y, imgW, imgH);

    }
}


// make sure parameters x and y are not needed and if so, remove them
function movePiece(x, y, row, column) {
    var gridNum = column + (row * size);
    var gridCheck = moveCheck(gridNum);
    // console.log(`result: ${gridCheck.result}`);
    if(gridCheck.result) {
        // console.log("The move is open");

        if(gridCheck.direction === `right`){
            // console.log("moving right");
            for(var i = 0; i < (pieces); i++){
                if(shapes[i].curLocation === gridNum){
                    // console.log(shapes[i].curLocation);
                    shapes[i].x = shapes[i].x + width; // update width
                    shapes[i].curLocation = gridNum + 1;
                    gridLocation[gridNum + 1] = 1; // update gridlocations
                    gridLocation[gridNum] = 0;
                    
                    // console.log(shapes[i].curLocation);
                }
            }
        } else if(gridCheck.direction === `left`){
            // console.log("moving left");

            for(var i = 0; i < (pieces); i++){
                if(shapes[i].curLocation === gridNum){
                    // console.log(shapes[i].curLocation);

                    shapes[i].x = shapes[i].x - width; // update width
                    shapes[i].curLocation = gridNum - 1;
                    gridLocation[gridNum - 1] = 1; // update gridlocations
                    gridLocation[gridNum] = 0;

                    // console.log(shapes[i].curLocation);
                }
            }

        } else if(gridCheck.direction === `up`){
            // console.log("moving up");

            for(var i = 0; i < (pieces); i++){
                if(shapes[i].curLocation === gridNum){
                    // console.log(shapes[i].curLocation);
                    shapes[i].y = shapes[i].y - height; // update height
                    shapes[i].curLocation = (Number(Number(gridNum) - Number(size)));
                    gridLocation[Number(Number(gridNum) - Number(size))] = 1; // update gridlocations
                    gridLocation[gridNum] = 0;

                    // console.log(shapes[i].curLocation);
                }
            }

        } else if(gridCheck.direction === `down`){
            // console.log("moving down");

            for(var i = 0; i < (pieces); i++){
                if(shapes[i].curLocation === gridNum){

                    // console.log(shapes[i].curLocation);

                    shapes[i].y = shapes[i].y + height; // update height
                    shapes[i].curLocation = (Number(Number(gridNum) + Number(size)));
                    gridLocation[Number(Number(gridNum) + Number(size))] = 1; // update gridlocations
                    gridLocation[gridNum] = 0;

                    // console.log(shapes[i].curLocation);
                }
            }
        }

        redraw();

    } else {
        alert("Chosen Piece has NO Open Move");
    }
}

function moveCheck(gridNum) {
    var result = false;
    var direction = ``;
    // console.log(`gridNum: ${Number(Number(gridNum) + Number(size))}`);
    // console.log(`${gridLocation[gridNum - 1]}`);
    // console.log(`${gridLocation[gridNum + 1]}`);
    // console.log(`${gridLocation[gridNum - size]}`);
    // console.log(`${gridLocation[Number(Number(gridNum) + Number(size))]}`);


    // this is for the console to print out if I you click on the open square
    if(gridLocation[gridNum] === 0) {
        console.log(`this is the open square`);
    }
    //

    if(((gridNum % size) !== 0) && (gridLocation[gridNum - 1] === 0)){
        result = true;
        direction = `left`;
        // gridLocation[gridNum - 1] = 1;
        // console.log("needs to move left");
    } else if(((gridNum % size) !== (size - 1)) && (gridLocation[gridNum + 1] === 0)){
        result = true;
        direction = `right`;
        // gridLocation[gridNum + 1] = 0;
        // console.log("needs to move right");

    } else if((gridNum >= size) && (gridLocation[gridNum - size] === 0)){
        result = true;
        direction = `up`;
        // gridLocation[gridLocation - size] = 1;
        // console.log("needs to move up");


    // removed condition from the following if statement: "((gridNum + size) > pieces) &&""
    } else if( (gridLocation[Number(Number(gridNum) + Number(size))] === 0)){
        result = true;
        direction = `down`;
        // gridLocation[Number(Number(gridNum) + Number(size))] = 1;
        // console.log("needs to move down");
    } 
    return {
        result:result,
        direction:direction
    };
}




function grabImage() {
    imgW = img.width;
    imgH = img.height;

    ctx.drawImage(img, 0, 0);
    imgData = ctx.getImageData(0, 0, imgW, imgH).data;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function getTiles() {
    // var tiles = [];
    for (var yi = 0; yi < size; yi++) {
        for (var xi = 0; xi < size; xi++) {
            tiles.push(imgSlice(xi * tileDim, yi * tileDim));
        }
    }
    // return tiles;
}

function imgSlice(x, y) {
    
    // console.log("entering imgSlice()");
    // console.log(`x: ${x}, y: ${y}`);

    var tile = [];

    for (var i = 0; i < tileDim; i++) {
        tile.push(...imgData.slice(getTileIndex(x, y + i), getTileIndex(x + tileDim, y + i)));
        // console.log(`tile[${i}]: ${tile[i]}`);
    }

    // console.log(`tileDim: ${tileDim}`);
    tile = new ImageData(new Uint8ClampedArray(tile), tileDim, tileDim);
    // console.log(`ImageData: ${tile.data}`);
    tile.x = x;
    tile.y = y;
    return tile;
}

function getTileIndex(x, y) {
    var i = Xindex(x) + Yindex(y);
	if (i > imgData.length) console.warn("XY out of bounds");
	return i;
}

function Yindex(y) {
    var i = imgW * 4 * y;
	if (i > imgData.length) console.warn("Y out of bounds");
	return i;
}

function Xindex(x) {
    var i = x * 4;
	if (i > imgData.length) console.warn("X out of bounds");
	return i;
}

function randomize() {
    // console.log("random!");
    if(shapes.length === 0){
        alert("Puzzle has not been defined yet");
    } else {
        var grid = [];
        var result = [];
        var index;
        for (var i = 0; i < pieces; i++) grid.push(i);
        var j = 0;
        while (j < grid.length) {
            index = grid[Math.floor(Math.random()*grid.length)];
            if(!exists(index, result)){
                result.push(index);
                j++;
            }
        }
        // for(var i = 0; i < pieces; i++) {
        //     console.log(`result[${i}] = ${result[i]}`);
        // }

        transfer(result);

        redraw();

    }
}

function exists(index, list) {
    var result = false;
    for (var i = 0; i < list.length; i++) {
        if(index === list[i]){
            result = true;
        }
    }
    return result;
}

function transfer(moveSet) {
        var temp = [];
    for(var i = 0; i < pieces; i++) temp.push(shapes[moveSet[i]]);
    for(var i = 0; i < pieces; i++) {
        shapes[i] = temp[i];
        shapes[i].curLocation = moveSet[i];
    }
}

function savePuzzle() {
    //console.log("Puzzle saved to the Database");

    if(shapes.length === 0){
        alert("Puzzle has not been defined yet");
    }

}







// function uploadImage(blobImg) {
//   // console.log(blobImg);

//   var imgData = new FormData();  // create a new form data
//   imgData.append("image", blobImg, "node_icon.png");

//   // append single image blob for single multer upload, append more images with the same feild name for array upload
//   // do not forget to provide the file name while appending the form data, otherwise it will be uploaded as blob file which further needed a conversion 

//   //call your node server api here and send the imgData
//   var uri = encodeURI("node server api to upload with multer");
//   var $ = window.jQuery;
//   $.ajax({
//     url: uri,
//     data: imgData,
//     cache: false,
//     contentType: false,
//     processData: false,
//     type: 'POST',
//     error: function(err) {
//       console.log('AJAX ERROR: ' + err);
//       //handle the error response if any
//     },
//     success: function(result) {
//       //handle the success response here if any
//     }
//   });
// }









































