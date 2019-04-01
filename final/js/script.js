//var ballRadius;
//var ballHit = 0;
//var ballSpeed;

//---------------------------------------------------------------//
var ball;
var console;
var gameState;
var gameOverMenu;
var restartButton;
var scoreboard;
var score;
//---------------------------------------------------------------//
var radiusBall;
var index;
//ball position
var xPosBall;
var yPosBall;

//ball speed
var xSpeedBall;
var ySpeedBall;

//ball direction
var xDirBall;
var yDirBall;
//---------------------------------------------------------------//
//canvas
//---------------------------------------------------------------//
var context;
var screenWidth;
var screenHeight;
var canvas;
var setInterval;
var document;
var window;
var gameSpeed;
//---------------------------------------------------------------//
//the pad
//---------------------------------------------------------------//
var xPosPad;
var yPosPad;

//size of pad
var padW;
var padH;

//direction of pad 
var padDir;

//speed of pad
var padSpeed;
//---------------------------------------------------------------//
//wall
//---------------------------------------------------------------//
var border;

var tileW;
var tileH;
var tileGap;

var tileX;
var tileY;
var tileCount;

//---------------------------------------------------------------//
//intro
//---------------------------------------------------------------//

//---------------------------------------------------------------//
function gameInitialize() {
    canvas = document.getElementById("game-screen");
    context = canvas.getContext("2d");

    screenWidth = window.innerWidth;
    screenHeight = window.innerHeight;

    canvas.width = screenWidth;
    canvas.height = screenHeight;

    border = 20;

    tileW = 4;
    tileH = 10;
    tileGap = 2;
    
    tileX = screenWidth / 2 - tileW / 2;
    tileY = 0;
    tileCount = screenHeight / (tileH + tileGap);

    document.addEventListener("keydown", keyboardHandler);

    score=0;
    gameOverMenu = document.getElementById("gameOver");
    centerMenuPosition(gameOverMenu);

    restartButton = document.getElementById("restartButton");
    restartButton.addEventListener("click", gameRestart);
    setState("PLAY");
    scoreboard = document.getElementById("scoreboard");
}

function gameLoop() {
    gameDraw();
    drawScoreboard();
    if (gameState == "PLAY") {
        padDraw();
        ballUpdate();
        ballDraw();
    }

}


function gameDraw() {
    context.clearRect(0, 0, screenWidth, screenHeight);
    context.fillStyle = "green";
    context.fillRect(0, 0, screenWidth, screenHeight);

    //paint the mid lane
    context.fillStyle = "black";
    for (var i = 0; i < tileCount; i++) {
        tileY = i * (tileH + tileGap);
        context.fillRect(tileX, tileY, tileW, tileY);
    }

    //paint the white walls
    context.fillStyle = "white";
    //top
    context.fillRect(0, 0, screenWidth, border);
    //bot
    context.fillRect(0, screenHeight - border, screenWidth, border);
    //left wall
    context.fillRect(0, 0, border, screenHeight);


}
/*function wallInitialize(){
      border = 20;
        
      tileW = 4;
      tileH = 10;
      tileGap = 2;
        
      tileX = screenWidth/2- tileW/2;
      tileY = 0; 
      tileCount = screenHeight/(tileH+tileGap);
}*/
/* 
function wallDraw() {
     context.clearRect(0,0,screenWidth,screenHeight);
            context.fillStyle = "green";
            context.fillRect(0,0,screenWidth,screenHeight);
            
            //paint the mid lane
            context.fillStyle="black";
            for (var i=0;i<tileCount;i++){
                tileY = i*(tileH + tileGap);
                context.fillRect(tileX,tileY,tileW,tileY);
            }
            
            //paint the white walls
            context.fillStyle="white";
            //top
            context.fillRect(0,0,screenWidth,border);
            //bot
            context.fillRect(0,screenHeight-border,screenWidth,border);
            //left wall
            context.fillRect(0,0,border,screenHeight);
} 
*/

//---------------------------------------------------------------//
//ball
//---------------------------------------------------------------//
function ballInitialize() {

    //game speed

    radiusBall = 6;
    gameSpeed = 2;
    //ball position
    xPosBall = 200;
    yPosBall = 300;

    //ball speed
    xSpeedBall = 1;
    ySpeedBall = 1;

    //ball direction
    xDirBall = -1;
    yDirBall = -1;

    for (index = radiusBall; index >= radiusBall; index--) {
        ball = [];
        ball.push({
            x: index,
            y: 0
        });
    }
}

function ballDraw() {

    //paint ball
    context.fillStyle = "yellow";
    context.beginPath();
    context.arc(xPosBall, yPosBall, radiusBall, 0, Math.PI * 2, false);
    context.fill();
    context.closePath();

    //change positoon of the ball
    xPosBall = xPosBall + xSpeedBall * xDirBall;
    yPosBall = yPosBall + ySpeedBall * yDirBall;

    //does it hit the left wall?
    if (xPosBall <= border + radiusBall) {
        xDirBall = 1;
    }
    //top
    if (yPosBall <= border + radiusBall) {
        yDirBall = 1;
    }
    //bottom
    if (yPosBall >= screenHeight - border - radiusBall) {
        yDirBall = -1;
    }
    //pad
    if (yPosBall >= yPosPad && yPosBall <= yPosPad + padH && xPosBall >= xPosPad && xPosBall <= xPosPad + padW) {
        xDirBall = -1;
        
    }
    checkBallCollision(yPosBall, xPosBall);
    checkWallCollision(yPosBall, xPosBall);


}

function ballUpdate() {
    var ballheadX = ball[0].x;
    var ballheadY = ball[0].y;

    ballheadX++;

    var balltail = ball.pop();
    balltail.x = ballheadX;
    balltail.y = ballheadY;
    ball.unshift(balltail);
}
//---------------------------------------------------------------//
//pad
//---------------------------------------------------------------//
function padInitialize() {
    //the pad
    xPosPad = screenWidth - 20;
    yPosPad = screenHeight / 2;

    //size of pad
    padW = 12;
    padH = 90;

    //direction of pad 
    padDir = 0;

    //speed of pad
    padSpeed = 2;

}

function padDraw() {
    //draw the pad
    context.fillStyle = "blue";
    context.fillRect(xPosPad, yPosPad, padW, padH);

    yPosPad = yPosPad + padSpeed * padDir;
}


function padUpdate() {

}

function checkBallCollision(yPosBall, xPosBall) {
    if (yPosBall >= yPosPad && yPosBall <= yPosPad + padH && xPosBall >= xPosPad && xPosBall <= xPosPad + padW) {
        score++;
        console.log("Score+1");
    }
}

function checkWallCollision(yPosBall, xPosBall) {
    if (xPosBall > xPosPad) {
        console.log("game over");
        setState("GAME OVER");
    }
}

//---------------------------------------------------------------//
//key
//---------------------------------------------------------------//
document.onkeydown = function (e) {
    if (e.keyCode == 38) {
        padDir = -1;
    }
    if (e.keyCode == 40) {
        padDir = 1;
    }
}
document.onkeyup = function (e) {
    if (e.keyCode == 38 || e.keyCode == 40) {
        padDir = 0;
    }
}

//---------------------------------------------------------------//
//game state
//---------------------------------------------------------------//
function setState(state) {
    gameState = state;
    showMenu(state);
}
//---------------------------------------------------------------//
//menu
//---------------------------------------------------------------//
function displayMenu(menu) {
    menu.style.visibility = "visible";
}

function hideMenu(menu) {
    menu.style.visibility = "hidden";
}

function showMenu(state) {
    if (state == "GAME OVER") {
        displayMenu(gameOverMenu);
    } 
}

function centerMenuPosition(menu) {
    menu.style.top = (screenHeight / 2) - (menu.offsetHeight / 2) + "px";
    menu.style.left = (screenWidth / 2) - (menu.offsetWidth / 2) + "px";
}

function gameRestart() {
    score=0;
    ballInitialize();
    padInitialize();
    hideMenu(gameOverMenu);
    setState("PLAY");

}

function keyboardHandler(event) {
    console.log(event);
}
//---------------------------------------------------------------//
//
//---------------------------------------------------------------//
function drawScoreboard() {
    scoreboard.innerHTML ="Score : " +score;
}



//---------------------------------------------------------------//        
gameInitialize();
ballInitialize();
padInitialize();
setInterval(gameLoop, gameSpeed);


ballUpdate();
padUpdate();
