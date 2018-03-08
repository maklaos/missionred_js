let canvas = document.getElementById('game');
let context = canvas.getContext('2d');
let scores = document.getElementById('scores');

let state = 'welcome';

let timer = 0;
let maxRadius = 45;

let nextLevel;
let speed;
let points;

let circles = [];
let statistic = {
  hits: 0,
  misses: 0,
  score: 0,
  level: 1,
  lives: 5,
  game: 0
};
let levels;

function update() {
  timer++;

  if (timer%(100-speed) == 0) {
    circles.push({
      R: 1,
      x: Math.floor(Math.random() * (canvas.width - maxRadius * 2) + maxRadius),
      y: Math.floor(Math.random() * (canvas.height - maxRadius * 4) + maxRadius * 2),
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
        statistic.lives--;
      }
    }
  }

  if (statistic.lives === 0) {
    state = 'gameover';
  }
}

function render() {
  context.clearRect(0, 0, 600, 650);

  context.strokeStyle = "#fff";
  context.font = "bold 20px Arial";
  context.lineWidth = 1;
  context.fillText('Score: ' + statistic.score, 10, 25);
  context.fillText('Lives: ' + statistic.lives, 520, 25);
	context.fillText('Hits: ' + statistic.hits, 10, 640);
  context.fillText('Level: ' + statistic.level, 250, 640);
  context.fillText('Misses: ' + statistic.misses, 480, 640);

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
  nextLevel = levels[n-1].nextLevel;
  speed = levels[n-1].speed;
  points = levels[n-1].points;
}

function addCount(){
  statistic.score += Number(points);
  statistic.hits++;

  if (statistic.score >= nextLevel) {
    statistic.level++;
    statistic.lives = 5;
    level(statistic.level);
  }
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
    }
  }

  if (shoot == false) {
    statistic.misses++;
    statistic.score -= points;
  }
}

// animate text
function hitAnimation() {

}

function missAnimation() {

}

function levelAnimation() {

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

  statistic.hits = 0;
  statistic.misses = 0;
  statistic.score = 0;
  statistic.lives = 5;
  statistic.level = 1;

  level(1);
}

function gameover() {
  context.clearRect(0, 0, 600, 650);
  context.fillStyle = "#fff";
	context.font = "bold 85px Arial";
	context.strokeStyle = "#f00";
	context.lineWidth = 5;
	context.strokeText('Game Over', 70, 250);

  context.font = "bold 30px Arial";
  context.lineWidth = 2;

  let accuracy = 100 - (statistic.misses / statistic.hits) * 100;

	context.strokeText('Score: ' + statistic.score, 90, 300);
  context.strokeText('Level: ' + statistic.level, 90, 330);
  context.strokeText('Hits: ' + statistic.hits, 90, 360);
  context.strokeText('Misses: ' + statistic.misses, 90, 390);
  context.strokeText('Accuracy: ' + Math.round(accuracy) + '%', 90, 420);

  context.font = "bold 48px Arial";
  context.lineWidth = 2;
	context.strokeText('click to play again', 90, 550);

  statistic.game++;
  scores.innerHTML += 'Game  ' + statistic.game + ': ';
  scores.innerHTML += '(Score: ' + statistic.score + ') ';
  scores.innerHTML += '(Level: ' + statistic.level + ') ';
  scores.innerHTML += '(Hits: ' + statistic.hits + ') ';
  scores.innerHTML += '(Misses: ' + statistic.misses + ') ';
  scores.innerHTML += '(Accuracy: ' + Math.round(accuracy) + '%' + ')</br>';
}

function welcome() {
  context.clearRect(0, 0, 600, 650);

  context.fillStyle = "#fff";
  context.strokeStyle = "#f00";

	context.font = "bold 120px Arial";
  context.lineWidth = 5;

	context.strokeText('Welcome', 50, 200);

  context.strokeText('to', 230, 300);

  context.font = "bold 100px Arial";
  context.strokeText('Missionred', 50, 400);

  context.font = "bold 48px Arial";
  context.lineWidth = 2;
	context.strokeText('click anywhere to start', 50, 500);
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
