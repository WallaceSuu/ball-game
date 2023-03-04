// setup canvas

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const ballCount = document.querySelector('p');

const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);

// ball counter
let counter=0;

// function to generate random number

function random(min, max) {
  const num = Math.floor(Math.random() * (max - min + 1)) + min;
  return num;
}

// function to generate random color

function randomRGB() {
  return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
}

// shape class
class Shape {
    x;
    y;
    velX;
    velY;

    constructor(x, y, velX, velY, exists) {
        this.x=x;
        this.y=y;
        this.velX=velX;
        this.velY=velY;
        exists=true;
    }
}

// modelling the balls as an object
class Ball extends Shape {
    constructor(x, y, velX, velY, color, size) {
        super(x, y, velX, velY);
        this.color=color;
        this.size=size;
        this.exists=true;
    }

    hello() {
        console.log("hello!");
    }

    draw() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.size, 0, 2*Math.PI);
        ctx.fill();
    }

    //moving the ball
    update() {
        if ((this.x+this.y)>=width) {
            this.velX = -(this.velX);
        }

        if ((this.x-this.size)<=0) {
            this.velX = -(this.velX);
        }

        if ((this.y+this.size)>=height) {
            this.velY = -(this.velY);
        }

        if ((this.y-this.size) <=0) {
            this.velY = -(this.velY);
        }

        this.x += this.velX;
        this.y += this.velY;
    }

    collisionDetect() {
        for (const ball of balls) {
            if ((this !==ball) && (ball.exists===true)) {
                const dx = this.x - ball.x;
                const dy = this.y - ball.y;
                const distance = Math.sqrt(dx*dx + dy*dy);

                if (distance < this.size + ball.size) {
                    ball.color = this.color = randomRGB();
                }
            }
        }
    }

}

// Player controlled "evil circle"
class EvilCircle extends Shape {
    constructor (x, y) {
        super(x, y, 20, 20);
        this.color="white";
        this.size=10;

        window.addEventListener("keydown", (e) => {
            switch (e.key) {
              case "a":
                this.x -= this.velX;
                break;
              case "d":
                this.x += this.velX;
                break;
              case "w":
                this.y -= this.velY;
                break;
              case "s":
                this.y += this.velY;
                break;
            }
          });
          
    }

    draw() {
        ctx.beginPath();
        ctx.lineWidth=3;
        ctx.strokeStyle = this.color;
        ctx.arc(this.x, this.y, this.size, 0, 2*Math.PI);
        ctx.stroke();
    }

    checkBounds() {
        if ((this.x+this.size)>=width) {
            this.x -= this.size;
        }

        if ((this.x-this.size)<=0) {
            this.x += this.size;
        }

        if ((this.y+this.size)>=height) {
           this.y -= this.size;
        }

        if ((this.y-this.size) <=0) {
            this.y += this.size;
        }
    }

    collisionDetect() {
            for (const ball of balls) {
                if (ball.exists===true) {
                    const dx = this.x - ball.x;
                    const dy = this.y - ball.y;
                    const distance = Math.sqrt(dx*dx + dy*dy);
    
                    if (distance < this.size + ball.size) {
                        ball.exists=false;
                        counter++; 
                        ballCount.textContent= `Ball count: ${counter}`;
                    }
                }
            }
        }

}

//storing player
const player = new EvilCircle(0, 0);

// Storing balls
const balls = [];

while (balls.length<100){
    const size = random(10, 20);
    const ball = new Ball(
        random (0+size, width-size),
        random(0+size, height - size),
        random(-12, 12),
        random(-12, 12),
        randomRGB(),
        size
    );
    balls.push(ball);
}

//animating the balls
function loop() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
    ctx.fillRect(0, 0, width, height);

    for (const ball of balls) {
        if (ball.exists===true) {
        ball.draw();
        ball.update();
        ball.collisionDetect();
        }
        player.draw();
        player.checkBounds();
        player.collisionDetect();
    }


    requestAnimationFrame(loop);
}

loop();