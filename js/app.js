function toggleModal() {
    let modal = document.getElementById('modContainer');
    modal.classList.toggle('hide');
}


function toggleText() {
    let startTalk = document.getElementById('startTalk');
    let overTalk = document.getElementById('gameOver');
    startTalk.classList.toggle('hide');
    overTalk.classList.toggle('hide');
}

let scoreValue = 0;
let score = document.getElementById('score');  
function setScore() {
    score.innerHTML = scoreValue;
}
setScore();


function addScore() {
    scoreValue += 50;
    setScore();
}


// function removeScore() {
//     if(scoreValue > 0 && scoreValue >= 20){
//         scoreValue -= 20;
//     } else if(scoreValue < 20) {
//         scoreValue = 0;
//     }
//     score.innerHTML = scoreValue;
// }


let levelValue = 1;
let level = document.getElementById('level');
function setLevel () {
    level.innerHTML = levelValue;
}
setLevel();
function addLevel() {
    levelValue += 1;
    setLevel();
}


let lives = document.getElementById('lives');
function removeLive() {
    if(lives.firstElementChild){
        lives.removeChild(lives.firstElementChild);
    }
}


function addLive() {
    let live = document.getElementById('live');
    lives.appendChild(live);
}

let gameOver = false;


// Enemies our player must avoid
var Enemy = function(x, y, speed) {
    "use strict";
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.move = 101;
    this.offX = -this.move;
    this.startX = x;
    this.x = x;
    this.y = y + 65;
    this.sprite = 'images/enemy-bug.png';
    this.boundary = this.move * 5;
    this.speed = speed;
};



// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    'use strict';
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if(this.x < this.boundary) {
        this.x += this.speed * dt;
    } else {
        this.x = this.offX * 2;
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};



const bug1 = new Enemy((-101 * 15), 0, 200);
const bug2 = new Enemy(-101, 83, 70);
const bug3 = new Enemy((-101 * 8), 166, 130);
const bug4 = new Enemy((-101 * 2), 166, 400);
const allEnemies = [];
allEnemies.push(bug1, bug2, bug3);


// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
class Hero{
    constructor(){
        //distance of movement per block
        this.moveX = 101;
        this.moveY = 83;

        //initial player position
        this.startX = this.moveX * 2;
        this.startY = (this.moveY * 4) + 65;
        
        //player position
        this.x = this.startX;
        this.y = this.startY;
        this.sprite = 'images/char-boy.png';
        this.gameOver = false;
    }

    //Displays player's initial position 
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }


    update() {
        for (let enemy of allEnemies) {
            if (this.y === enemy.y && (this.x < enemy.x + 70 && enemy.x + 30 < this.x + this.moveX )) {
                this.reset();
                removeLive();
                // removeScore();
            }
        }

        //win condition
        if(this.y < -18) {
            console.log('game won');
            addScore();
            addLevel();
            this.reset();
            
            for (let enemy of allEnemies){
                enemy.speed += 10;
                console.log(enemy.speed);
            }
        }

        if (scoreValue > 200 && !allEnemies.includes(bug4) && bug3.x > bug3.boundary) {
            allEnemies.pop(bug3);
            allEnemies.push(bug4);
        }


        if(!lives.firstElementChild) {
            this.gameOver = true;
            toggleText();
            toggleModal();
        }

        // TODO: Display gameover modal
        //       Implement reset
        //       Organize and comment code
        //       Write documentation
        //       Submit the damn thing


        // if(levelValue === 10 || levelValue === 21 || levelValue === 35) {
        //     addLive();
        // }

        
    }

    //Handles movement of player based on key press
    handleInput(input) {
        switch(input){
            case 'up':
                if(this.y > -this.moveY){
                    this.y -= this.moveY;
                }
                break;
            case 'right':
                if(this.x < this.moveX * 4){
                    this.x += this.moveX;
                }
                break;
            case 'down':
                if(this.y < this.startY){
                    this.y += this.moveY;
                }
                break;
            case 'left':
                if(this.x > 0){
                    this.x -= this.moveX;
                }
                break;
        }
    }

    reset() {
        this.x = this.startX;
        this.y = this.startY;
    }


    checkScore(){
        if(this.gameOver === true){
            console.log('yeah');
        } else {
            console.log("nay");
        }
    }
}


const player = new Hero();
// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player



// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
