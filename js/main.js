var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');

// Создание объекта
var bird = new Image(); 
var bg = new Image(); 
var fg = new Image();
var pipeUp = new Image(); 
var pipeBottom = new Image(); 

// Изображения
bird.src = "img/bird.png"; 
bg.src = "img/bg.png";
fg.src = "img/fg.png";
pipeUp.src = "img/pipeUp.png"; 
pipeBottom.src = "img/pipeBottom.png"; 

// Звуковые файлы
var fly = new Audio(); 
var score_audio = new Audio(); 

fly.src = "audio/fly.mp3";
score_audio.src = "audio/score.mp3"; 

var gap = 90;

var xPos = 10;
var yPos = 150;

var grav = 2.5;

var pressed = false;

var pipe = [];

pipe[0] = {
 x : canvas.width,
 y : 0
}

var score = 0;

document.addEventListener("keydown", keyDownHandler, false); // обработка нажатия на пробел
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    if(e.keyCode == 32) {
        pressed = true;
    }
}

function keyUpHandler(e) {
    if(e.keyCode == 32) {
        pressed = false;
    }
}

function draw() {
    ctx.drawImage(bg, 0, 0);  

    for(var i = 0; i < pipe.length; i++) {
        ctx.drawImage(pipeUp, pipe[i].x, pipe[i].y);
        ctx.drawImage(pipeBottom, pipe[i].x, pipe[i].y + pipeUp.height + gap);
       
        pipe[i].x -= 2;
       
        if(pipe[i].x == 118) { // рисуются новые препятствия после того, как впереди идущий по x находится на 118 пикселе
            pipe.push({
            x : canvas.width,
            y : Math.floor(Math.random() * pipeUp.height) - pipeUp.height //генерация рандомных чисел для координаты
            });
        }
       
        // Отслеживание прикосновений
        if(xPos + bird.width >= pipe[i].x
        && xPos <= pipe[i].x + pipeUp.width
        && (yPos <= pipe[i].y + pipeUp.height
        || yPos + bird.height >= pipe[i].y + pipeUp.height + gap) || yPos + bird.height >= canvas.height - fg.height) {
        location.reload(); // Перезагрузка страницы
        }
        if(pipe[i].x == 6) { //подключение аудио
            score++;
            score_audio.play();
        }
    }
   
    ctx.drawImage(fg, 0, canvas.height - fg.height);
    ctx.drawImage(bird, xPos, yPos);

    yPos += grav;

    if (yPos >= canvas.height - fg.height - (bird.height / 1.5) || yPos == 0) {
        alert("GAME OVER");
        document.location.reload();
        clearInterval(interval); 
    }

    if(pressed) {
        yPos -= 6.5;
        fly.play();
    }

    ctx.fillStyle = "#000";
    ctx.font = "24px Verdana";
    ctx.fillText("Счет: " + score, 10, canvas.height - 20);

    requestAnimationFrame(draw); // зациклить функцию
}
pipeBottom.onload = draw(); // вызов функции draw после того, как прогрузилась последняя картинка