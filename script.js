var canvas = document.getElementById("canvas");
/** @type {CanvasRenderingContext2D} */
var ctx = canvas.getContext("2d");
let lastFrame = Date.now();

canvas.width = innerWidth; 
canvas.height = innerHeight;

let goright = false
let goleft = false
let speed = 1;
let touchingFloor = false;
let mapVelocityX = speed;
let stop = false;

window.onkeydown = /** @param {KeyboardEvent} e */function(e) {
    if (e.key == "w" || e.key == "ArrowUp" || e.key == " ") {
        if (touchingFloor == true){
            player1.velocityY = -5
        }
        touchingFloor = false
    }
    if (e.key == "a" || e.key == "ArrowLeft") {
        goleft = true
    }
    if (e.key == "s" || e.key == "ArrowDown") {
        
    }
    if (e.key == "d" || e.key == "ArrowRight") {
        goright = true
    }
}

window.onkeyup = function(e) {
    if (e.key == "w" || e.key == "ArrowUp" || e.key == " ") {
    }
    if (e.key == "s" || e.key == "ArrowDown") {
        
    }
    if (e.key == "a" || e.key == "ArrowLeft") {
        goleft = false
    }
    if (e.key == "d" || e.key == "ArrowRight") {
        goright = false
    }
}

class Player {
    constructor(color) {
        this.color = color;
        this.width = 20;
        this.height = 50;
        this.x = 20;
        this.y = canvas.height/2;
        this.velocityY = 0;
        this.velocityX = 0;

        this.update = function () {
            if (goright) {
                this.velocityX = speed
            }
            if (goleft) {
                this.velocityX = -speed
            }
            if (goright && goleft) {
                this.velocityX = 0
            }
            if (this.x < 0) {
                this.velocityX = 0
            }
            if (goright == false && goleft == false) {
                this.velocityX = 0
            }

            this.velocityY += 9.82 * t;


            this.y += this.velocityY
            this.x += this.velocityX
        
            touchingFloor = false
            stop = false
            for (let g=0;g<floorArray.length;g++) {
                if (this.x >= floorArray[g].x && this.x + this.width <= floorArray[g].x + boxWidth && this.y + this.height > floorArray[g].checkY) {
                    this.y = floorArray[g].checkY - this.height 
                    this.velocityY = 0
                    touchingFloor = true
                }
                if (this.x >= floorArray[g].x && this.x + this.width >= floorArray[g].x + boxWidth && this.x <= floorArray[g].x + boxWidth &&  this.y + this.height > floorArray[g].checkY) {
                    this.y = floorArray[g].checkY - this.height 
                    this.velocityY = 0
                    touchingFloor = true
                }
                if (this.x <= floorArray[g].x && this.x + this.width >= floorArray[g].x &&  this.y + this.height > floorArray[g].checkY) {
                    this.y = floorArray[g].checkY - this.height 
                    this.velocityY = 0
                    touchingFloor = true
                }

                // if (g < floorArray.length-1 && floorArray[g+1].checkY < floorArray[g].checkY && this.x + this.width >= floorArray[g].x + boxWidth - (speed) && this.x + this.width <= floorArray[g].x + boxWidth && this.y + this.height >= floorArray[g+1].checkY && this.velocityX != -speed) {
                //     this.x = floorArray[g+1].x - 1 - this.width
                //     this.velocityX = 0;
                //     mapVelocityX = 0;
                //     stop = true
                // }
                if (g < floorArray.length-1 && floorArray[g+1].height > floorArray[g].height && this.x + this.width == floorArray[g].x + boxWidth && this.y + this.height >= floorArray[g+1].checkY && this.velocityX != -speed) {
                    this.x = floorArray[g].x + boxWidth - this.width -1
                    this.velocityX = 0;
                    mapVelocityX = 0;
                    stop = true
                }
                if (g > 0 && floorArray[g-1].checkY < floorArray[g].checkY && this.x== floorArray[g].x && this.x + this.width >= floorArray[g].x && this.y + this.height >= floorArray[g-1].checkY && this.velocityX != speed) {
                    this.x = floorArray[g].x +2
                    console.log("ds")
                    this.velocityX = 0;
                }
            }
            if (stop == false) {
                mapVelocityX = speed;
            }

            if (this.x > canvas.width/2-this.width/2) {
                this.x = canvas.width/2-this.width/2
                mapGoRight()
            }
            if (this.x < 0) {
                this.x = 0
            }

            this.draw();
        };

        this.draw = function () {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        };
    }
}

let floorArray = []
let floorArrayLeft = [];
let boxWidth = 50;
let grassHeight = 20
class Floor {
    constructor(x, height, changer) {
        this.width = boxWidth;
        this.height = height;
        this.grassHeight = grassHeight;
        this.x = x;
        this.y = canvas.height-this.height + this.grassHeight;
        this.checkY = canvas.height-this.height;
        this.changer = changer;

        this.update = function () {
            this.draw();
        };

        this.draw = function () {
            ctx.fillStyle = "#572E0A";
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.fillStyle = "#637f40";
            ctx.fillRect(this.x, this.y - this.grassHeight, this.width, this.grassHeight);
        };
    }
}

let randomizer0;
let randomizer1;
let randomizer2;
let randomizerHold;
let changer0 = 0.6
let changer1 = 0.5
let changer2 = 0.3
let changerHold = 0.3;
let diff;
let spawnCounter = 0;

function mapGoRight () {
    let counter = 0; 
    for (let e=0;e<floorArray.length;e++) {
        floorArray[e].x -= mapVelocityX;
        if (floorArray[e].x + floorArray[e].width < canvas.width) {
            counter++
        }
        if (counter == floorArray.length) {
            let height = floorArray[e].height
            randomizer0 = Math.random()
            randomizer1 = Math.random()
            randomizer2 = Math.random()
            changer1 = floorArray[e].changer
            
            if (randomizer0 < changer0) {
                randomizer2 < changer2 ? diff = grassHeight*2: diff = grassHeight

                randomizer1 < changer1 ? height += diff: height -= diff
            }
            

            if (height <= grassHeight) {
                height = grassHeight
                changer1 = 1
            }
            if (height >= canvas.height-grassHeight) {
                height = canvas.height-grassHeight
                changer1 = 0
            }
            else {
                changer1 = 0.5
            }
            

            floorArray.push(new Floor(canvas.width, height, changer1))
        }
    }
}
function goLeft () {
}

function spawnFloor () {
    let height = grassHeight*2
    let gag = 0
    let bab = 0
    for (let x=0; x<canvas.width; x += boxWidth){
        randomizer0 = Math.random()
        randomizer1 = Math.random()
        randomizer2 = Math.random()
        randomizerHold = Math.random()
        if (randomizer0 < changer0) {
            randomizer2 < changer2 ? diff = grassHeight*2: diff = grassHeight
            
            if (spawnCounter > 2 && randomizerHold > changerHold) {
                    randomizer1 < changer1 ? height += diff: height -= diff
                    bab++
                    console.log(bab, "not same")
            }
            else if (spawnCounter > 2) {
                gag++
                console.log(gag, "same")
                floorArray[spawnCounter-2].height < floorArray[spawnCounter-1].height ? height += diff: height -= diff;
            }
        }
        
        if (height <= grassHeight) {
            height = grassHeight
            changer1 = 1
        }
        if (height >= canvas.height-grassHeight) {
            height = canvas.height-grassHeight
            changer1 = 0
        }
        else {
            changer1 = 0.5
        }
        floorArray.push(new Floor(x, height, changer1))
        spawnCounter++
    }
}


let player1 = new Player("red")
spawnFloor()

function animate () {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    t = (Date.now() - lastFrame) / 1000;
    lastFrame = Date.now();

    player1.update();
    for (i=0;i<floorArray.length;i++) {
        floorArray[i].update()
    }
}
requestAnimationFrame(animate);