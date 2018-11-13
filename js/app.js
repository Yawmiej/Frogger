/*TODO: Add lives
        Set game over functionality
        Display gameover modal
        Implement reset
        Display Stats on modal
        Display Stats on Canvas to avoid scrolling
        Add Gems and lives
        Add select character 
*/
      


let score = document.getElementById('score');
let scoreValue = parseInt(score.innerHTML);
let level = document.getElementById('level');
let levelValue = parseInt(level.innerHTML);
let startButton = document.getElementById('start');
// let lives = document.getElementById('lives');
// let liveValue = parseInt(lives.innerHTML);


//toggle modal on button click
function toggleModal() {
    let modal = document.getElementById('modContainer');
    modal.classList.toggle('hide');
}


startButton.addEventListener('click', function(){
    toggleModal();
});

//changes  text on modal
// function toggleText() {
//     let startTalk = document.getElementById('startTalk');
//     let overTalk = document.getElementById('gameOver');
//     startTalk.classList.toggle('hide');
//     overTalk.classList.toggle('hide');
// }


//increase score
function addScore() {
    scoreValue += 50;
    score.innerHTML = scoreValue;
}



//increase level after each win
function addLevel() {
    levelValue += 1;
    level.innerHTML = levelValue;
}


//decrease lives after collision(TODO)
// function removeLive() {
//     liveValue--;
//     lives.innerHTML = liveValue;
// }

// add live when gem is collected (no Gem yet)
// function addLive() {
//     let live = document.getElementById('live');
//     lives.appendChild(live);
// }


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
const bug4 = new Enemy((-101 * 12), 83, 350);

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
            if (this.y === enemy.y && (this.x < enemy.x + 70 &&
                enemy.x + 30 < this.x + this.moveX )) {
                //Reset player position to starting position
                this.reset();

                //Reduce live after collision(TODO)
                // removeLive();
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

        //Increase enemy speed at interval (bugged)
        // let newSpeed = bug2.speed + 150;
        // for (let i = 1, interv = 250; i < 6; i++) {
        //     let interval = i * interv;
        //     if (scoreValue === interval && bug2.speed !== newSpeed && bug2.x > bug2.boundary) {
        //         bug2.speed = newSpeed;
        //         console.log(bug2.speed);
        //     }
        // }


        // Substitutes a faster bug for another when score exceeds 250 and the bug is out 
        // of sight
        if (scoreValue > 250 && bug2.x > bug2.boundary && !allEnemies.includes(bug4)) {
                allEnemies.splice(1, 1, bug4);
        }
        

        // //Game over condition(if all lives are exhausted)(TODO)
        // if(liveValue === 0) {
        //     this.gameOver = true;
        // }


        /* if(levelValue === 10 || levelValue === 21 || levelValue === 35) {
            addLive();
         }*/
        
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
