let canvas = document.getElementById('game');
let context = canvas.getContext('2d');

let countField = document.getElementById('count');
let scoreField = document.getElementById('score');
let levelField = document.getElementById('level');

let countName = 'Count: ';
let scoreName = 'Score: ';
let levelName = 'Level: ';

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
let levels;

function update() {
  timer++;

  if (timer%speed == 0) {
    circles.push({
      R: 1,
      x: Math.floor(Math.random() * (canvas.width - maxRadius * 2) + maxRadius),
      y: Math.floor(Math.random() * (canvas.height - maxRadius * 2) + maxRadius),
      growing: true
    });
  }

  for (i in circles) {
    if (circles[i].growing) {
      circles[i].R++;

      if (circles[i].R == maxRadius) {
        circles[i].growing = false;
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
  maxRadius = levels[n-1].maxRadius;
  speed = levels[n-1].speed;
  points = levels[n-1].points;
}

function addCount(){
  if (statistic.score >= 50) {
    level(2);
    statistic.level = 2;
  }

  statistic.score += Number(points);

  countField.innerHTML = countName + ++statistic.count;
  scoreField.innerHTML = scoreName + statistic.score;
  levelField.innerHTML = levelName + statistic.level;

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

  countField.innerHTML = countName + statistic.count;
  scoreField.innerHTML = scoreName + statistic.score;
  levelField.innerHTML = levelName + statistic.level;

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

  httpGet('levels.json', getLevels);
}

function start() {
  init();
  game();
}

document.addEventListener("DOMContentLoaded", start);

function httpGet(url, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", url, true);
    xmlHttp.send(null);
}

function getLevels(response) {
  levels = JSON.parse(response).levels;
}
