var score = 0;
var bullets = [];
var enemies = [];

var player = {
    x: 10,
    y: 200,
    pacmouth: 320,
    pacdir: 0,
    psize: 32,
    speed: 10
};

const winScore = 10;
var showStartScreen = true;
var showWinSccreen = false;


function Bullet() {
    this.x = player.x + 40;
    this.y = player.y + 15;
    this.speed = 5;
}

function Enemy() {
    this.ghostNum = randomNumber(5) * 64;
    this.x = randomNumber(20) * 1000;
    this.y = randomNumber(4) * 100;
    this.speed = 5;
    console.log(this.x, this.y);
}
for (i = 0; i < 50; i++) {
    if (showWinSccreen) {
        enemies = [];
    }
    enemies.push(enemies[i]);
    enemies[i] = new Enemy;
}

// canvas

var canvas = document.createElement("canvas");
var context = canvas.getContext("2d");
document.body.appendChild(canvas);
canvas.width = 900;
canvas.height = 400;

// img

var mainImage;
mainImage = new Image();
mainImage.ready = false;
mainImage.onload = checkReady;
mainImage.src = "pac.png";

function checkReady() {
    this.ready = true;
    playgame();
}

var keyclick = {};
document.addEventListener("keydown", function (event) {
    keyclick[event.keyCode] = true;
    move(keyclick);
}, false);
document.addEventListener("keyup", function (event) {
    delete keyclick[event.keyCode];
}, false);
document.addEventListener("space", function (event) {
    delete keyclick[event.keyCode];
}, false);

function move(keyclick) {

    if (38 in keyclick) {
        player.y -= player.speed;
        player.pacdir = 0;
    }

    if (40 in keyclick) {
        player.y += player.speed;
        player.pacdir = 0;
    }

    if (32 in keyclick) {
        for (i = 0; i < 1; i++) {
            if (showWinSccreen) {
                bullets = [];
            }
            bullets.push(bullets[i]);
            bullets[i] = new Bullet;
            break;
        }
    }
    if (player.y >= (canvas.height - 32)) {
        player.y = 0;
    }
    if (player.y < 0) {
        player.y = (canvas.height - 32);
    }
};

function playgame() {
    render();
    requestAnimationFrame(playgame);
}

function randomNumber(n) {
    return Math.floor(Math.random() * n);
}

function render() {
    context.fillStyle = "green";
    context.fillRect(0, 0, canvas.width, canvas.height);

    canvas.addEventListener('mousedown', handleMouseClick);

    if (showStartScreen) {
        context.font = "45px Verdana";
        context.fillStyle = "white";
        context.fillText("Kliknij aby zargrać!", 200, 300);
    }

    function handleMouseClick(ent) {
        if (showWinSccreen) {
            score = 0;
            showWinSccreen = false;
        }
        if (showStartScreen) {
            showStartScreen = false;
        }
    }
    if (score >= winScore) {
        showWinSccreen = true;
        context.font = "45px Verdana";
        context.fillStyle = "white";
        context.fillText("Wygraeś! " + "Twoj wynik: " + score, 250, 100);
        context.fillText("Kliknij aby zargrać ponownie!", 200, 300);
    }

    if (score < winScore && showStartScreen == false) {
        context.font = "20px Verdana";
        context.fillStyle = "white";
        context.fillText("Twoj wynik: " + score, 450, 30);
        for (i = 0; i < bullets.length; i++) {
            context.fillStyle = "#ffffff";
            context.beginPath();
            context.arc(bullets[i].x, bullets[i].y, 5, 0, Math.PI * 2, true);
            context.closePath();
            context.fill();
            bullets[i].x += bullets[i].speed;
            if (bullets[i].x > 900) {
                bullets.splice(i, 1);
            }
        }
        for (i = 0; i < enemies.length; i++) {
            enemies[i].x -= enemies[i].speed;
            enemies[i].display = context.drawImage(mainImage, enemies[i].ghostNum, 0, 32, 32, enemies[i].x, enemies[i].y, 32, 32);
            if (enemies[i].x < 0) {
                enemies[i].x = 1100;
                score = score - 1;
                if (score < 0) {
                    score = 0;
                }
            } else if (enemies[i].ghostNum == 128 && score >= 10) {
                enemies[i].x -= enemies[i].speed + 2;
            } else if (enemies[i].ghostNum == 192 && score >= 30) {
                enemies[i].y -= enemies[i].speed;
                if (enemies[i].y < 0) {
                    enemies[i].y = 400;
                }
            } else if (enemies[i].ghostNum == 64 && score >= 20) {
                enemies[i].y += enemies[i].speed;
                if (enemies[i].y > 400) {
                    enemies[i].y = 0;
                }
            }
        }
        var bulletCheck = 0;
        for (i = bullets.length - 1; i >= 0; i--) {
            for (j = enemies.length - 1; j >= 0; j--) {
                if ((bullets[i].x >= enemies[j].x && bullets[i].x <= (enemies[j].x + 16) &&
                        bullets[i].y >= enemies[j].y && bullets[i].y <= (enemies[j].y + 32))) {
                    bulletCheck = +1;
                    score = score + 1;
                    if (bulletCheck >= 1) {
                        enemies.splice(j, 1);
                    }
                    bullets.splice(i, 1);
                    break;
                }
            }
        }
        context.drawImage(mainImage, player.pacmouth, player.pacdir, 32, 32, player.x, player.y, 32, 32);
    }
}