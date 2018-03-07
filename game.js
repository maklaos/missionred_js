let canvas = document.getElementById('game');
let context = canvas.getContext('2d');
let count = document.getElementById('count');

let state = 'welcome';

let timer = 0;
let maxRadius = 50;
let speed = 40;
let points = 5;

let circles = [];
let statistic = {
  count: 0,
  score: 0,
  level: 1
};
let levels = {
  "1": {
    maxRadius: 50,
    speed: 40,
    points: 5
  },
  "2": {
    maxRadius: 49,
    speed: 25,
    points: 15
  }
}

function update() {
  timer++;

  if (timer%speed == 0) {
    circles.push({
      R: 1,
      x: Math.floor(Math.random() * (canvas.width - maxRadius * 2) + maxRadius),
      y: Math.floor(Math.random() * (canvas.height - maxRadius * 2) + maxRadius),
      grow: true
    });
  }

  for (i in circles) {
    if (circles[i].grow) {
      circles[i].R++;

      if (circles[i].R == maxRadius) {
        circles[i].grow = false;
      }
    } else{
      circles[i].R--;

      if(circles[i].R == 0) {
        circles.splice(i, 1);
      }
    }
  }
}

function render() {
  context.clearRect(0, 0, 600, 600);

  context.strokeStyle  = '#f00';
  context.fillStyle  = '#fff';
  context.lineWidth = 3;

  for (i in circles) {
    context.beginPath();
    context.arc(circles[i].x, circles[i].y, circles[i].R, 0, Math.PI*2);
    context.fill();
    context.stroke();
  }

}

function level(n) {
  maxRadius = levels[n].maxRadius;
  speed = levels[n].speed;
  points = levels[n].points;
}

function addCount(){
  if (statistic.score >= 50) {
    level(2);
    statistic.level = 2;
  }

  count.children[0].innerHTML = ++statistic.count;
  statistic.score = statistic.count * 5;
  count.children[1].innerHTML = statistic.score;
  count.children[2].innerHTML = statistic.level;

}

function fire(event) {
  let shoot = false;

  for (i in circles) {
    let x2 = Math.pow(Math.abs(event.offsetX - circles[i].x), 2);
    let y2 = Math.pow(Math.abs(event.offsetY - circles[i].y), 2);
    let L = Math.sqrt(Math.abs(x2 - y2));

    if (L <= circles[i].R) {
      circles.splice(i, 1);
      addCount();
      shoot = true;
    } else {

    }
  }

  if (shoot == false) {
    state = 'gameover';
  }
}

// engine

let requestAnimFrame = (function(){
    return window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function(callback){
            window.setTimeout(callback, 1000 / 20);
        };
})();

function clearStatistic() {
  circles = [];

  statistic.count = 0;
  statistic.score = 0;
  statistic.level = 1;

  count.children[0].innerHTML = statistic.count;
  count.children[1].innerHTML = statistic.score;
  count.children[2].innerHTML = statistic.level;

  level(1);
}

function gameover() {
  context.clearRect(0, 0, 600, 600);
  context.fillStyle = "#fff";
	context.font = "bold 85px Arial";
	context.strokeStyle = "#f00";
	context.lineWidth = 5;
	context.strokeText('Game Over', 70, 250);

  context.font = "bold 30px Arial";
  context.lineWidth = 2;
	context.strokeText('Count: ' + statistic.count, 90, 300);
  context.strokeText('Score: ' + statistic.score, 90, 330);
  context.strokeText('Level: ' + statistic.level, 90, 360);

  context.font = "bold 48px Arial";
  context.lineWidth = 2;
	context.strokeText('click to play again', 90, 480);
}

function welcome() {
  context.clearRect(0, 0, 600, 600);

  context.fillStyle = "#fff";
  context.strokeStyle = "#f00";

	context.font = "bold 120px Arial";
  context.lineWidth = 5;

	context.strokeText('Welcome', 50, 130);

  context.strokeText('to', 230, 230);

  context.font = "bold 100px Arial";
  context.strokeText('Missionred', 50, 330);

  context.font = "bold 48px Arial";
  context.lineWidth = 2;
	context.strokeText('click anywhere to start', 50, 430);
}

function game(){
  if (state == 'welcome') {
    welcome();
    return;
  } else if (state == 'gameover') {
    gameover();
    return;
  }

  update();
  render();
  requestAnimFrame(game);
}

function init() {
  canvas.addEventListener("click",  function(event) {
    if(state == 'welcome') {
      state = 'game';
      clearStatistic();
      game();
    } else if (state == 'gameover') {
      state = 'welcome';
      game();
    } else {
      fire(event);
    }
  });
}

function start() {
  init();
  game();
}

document.addEventListener("DOMContentLoaded", start);
