//toggle modal on button click
function toggleModal() {
    let modal = document.getElementById('modContainer');
    modal.classList.toggle('hide');
}

//changes  text on modal
function toggleText() {
    let startTalk = document.getElementById('startTalk');
    let overTalk = document.getElementById('gameOver');
    startTalk.classList.toggle('hide');
    overTalk.classList.toggle('hide');
}

let score = document.getElementById('score');
let scoreValue = parseInt(score.innerHTML);

//increase score
function addScore() {
    scoreValue += 50;
    score.innerHTML = scoreValue;
}


// function removeScore() {
//     if(scoreValue > 0 && scoreValue >= 20){
//         scoreValue -= 20;
//     } else if(scoreValue < 20) {
//         scoreValue = 0;
//     }
//     score.innerHTML = scoreValue;
// }

let level = document.getElementById('level');
let levelValue = parseInt(level.innerHTML);

//increase level after each win
function addLevel() {
    levelValue += 1;
    level.innerHTML = levelValue;
}


let lives = document.getElementById('lives');

//decrease lives after collision
function removeLive() {
    if(lives.firstElementChild){
        lives.removeChild(lives.firstElementChild);
    }
}


// function addLive() {
//     let live = document.getElementById('live');
//     lives.appendChild(live);
// }

let gameOver = false;


// Enemies our player must avoid
var Enemy = function(x, y, speed) {
    "use strict";
    //Variables of Enemy
    this.move = 101;
    this.offX = -this.move;
    this.startX = x;
    this.x = x;
    this.y = y + 65;

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.boundary = this.move * 5;
    this.speed = speed;
};



// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    'use strict';
    // Movements multiplied by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers. Moves the enemy within the frame and
    //reset its position after exceeding the frame/boundary
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


//All bug objects defined as instanceOf the Enemy() constructor
// parameters are starting X position, Y position and speed
const bug1 = new Enemy((-101 * 15), 0, 200);
const bug2 = new Enemy(-101, 83, 70);
const bug3 = new Enemy((-101 * 8), 166, 130);
const bug4 = new Enemy((-101 * 2), 166, 400);

//Empty array to contain our enemies
const allEnemies = [];

//adds bugs to array for rendering
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

        //player Character/image
        this.sprite = 'images/char-boy.png';

        //Game status boolean
        this.gameOver = false;
    }

    //Displays player's initial position 
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

    //Updates the game with every condition and movement,
    //Houses most of the game functionality
    update() {
        //Checks for collision
        for (let enemy of allEnemies) {
            if (this.y === enemy.y && (this.x < enemy.x + 70 && enemy.x + 30 < this.x + this.moveX )) {
                //Reset player position to starting position
                this.reset();

                //Reduce live after collision
                removeLive();
                // removeScore();
            }
        }

        //win condition (if player reaches top)
        if(this.y < -18) {
            //increase score
            addScore();
            //increase level
            addLevel();
            //reverts to start position
            this.reset();
            
            //increases enemies speed after each win
            for (let enemy of allEnemies){
                enemy.speed += 10;
            }
        }

        //add a new(faster) enemy(4) when score goes above 200 when enemy(3) goes off 
        //removes enemy(3)
        if (scoreValue > 200 && !allEnemies.includes(bug4) && bug3.x > bug3.boundary) {
            allEnemies.pop(bug3);
            allEnemies.push(bug4);
        }

        //Game over condition(if all lives are exhausted)
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

    //Handles movement of player based on key press and ensure 
    //player stays within the game frame
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

    //resets player position to start position
    reset() {
        this.x = this.startX;
        this.y = this.startY;
    }
}

//Instantiating player
const player = new Hero();


function restart () {
    player.gameOver = false;
}

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
