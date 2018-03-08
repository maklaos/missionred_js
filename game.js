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
let hitTexts = [];
let levelText = [];

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

  for (i in hitTexts) {
    hitTexts[i].time--;

    if(hitTexts[i].time == 0) {
      hitTexts.splice(i, 1);
    }
  }

  for (i in levelText) {
    levelText[i].time--;

    if(levelText[i].time == 0) {
      levelText.splice(i, 1);
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
  context.fillText(lang.score + ': ' + statistic.score, 10, 25);
  context.fillText(lang.lives + ': ' + statistic.lives, 512, 25);
	context.fillText(lang.hits + ': ' + statistic.hits, 10, 640);
  context.fillText(lang.level + ': ' + statistic.level, 250, 640);
  context.fillText(lang.misses + ': ' + statistic.misses, 480, 640);

  context.strokeStyle  = '#f00';
  context.fillStyle  = '#fff';
  context.lineWidth = 3;

  for (i in circles) {
    context.beginPath();
    context.arc(circles[i].x, circles[i].y, circles[i].R, 0, Math.PI*2);
    context.fill();
    context.stroke();
  }

  for (i in hitTexts) {
    context.fillStyle = hitTexts[i].color;
    context.font = "bold 10px Arial";
  	context.fillText(hitTexts[i].text, hitTexts[i].x, hitTexts[i].y);
    context.fillStyle  = '#fff';
  }

  for (i in levelText) {
    context.fillStyle = "#fff";
    context.font = "bold 30px Arial";
  	context.fillText(levelText[i].text, levelText[i].x, levelText[i].y);
  }
}

function level(n) {
  nextLevel = levels[n-1].nextLevel;
  speed = levels[n-1].speed;
  points = levels[n-1].points;

  levelAnimation(n);
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
      hitAnimation(event, '+', '#0f0');
      shoot = true;
    }
  }

  if (shoot == false) {
    statistic.misses++;
    statistic.score -= points;
    hitAnimation(event, '-', '#f00');
  }
}

// animate text
function hitAnimation(event, sign, color) {
  hitTexts.push({
    x: event.offsetX + maxRadius / 3,
    y: event.offsetY - maxRadius / 3,
    text: sign + points,
    time: 10,
    color: color
  });
}

function levelAnimation(num) {
  levelText.push({
    x: canvas.width / 2 - 50,
    y: canvas.height / 2,
    time: 100,
    text: lang.levelCaps + ' ' + num
  });
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
	context.strokeText(lang.gameover, 70, 250);

  context.font = "bold 30px Arial";
  context.lineWidth = 2;

  let accuracy = 100 - (statistic.misses / statistic.hits) * 100;

	context.strokeText(lang.score + ': ' + statistic.score, 90, 300);
  context.strokeText(lang.level + ': ' + statistic.level, 90, 330);
  context.strokeText(lang.hits + ': ' + statistic.hits, 90, 360);
  context.strokeText(lang.misses + ': ' + statistic.misses, 90, 390);
  context.strokeText(lang.accuracy + ': ' + Math.round(accuracy) + '%', 90, 420);

  context.font = "bold 48px Arial";
  context.lineWidth = 2;
	context.strokeText(lang.playAgain, 90, 550);

  statistic.game++;
  scores.innerHTML += lang.game +' ' + statistic.game + ': ';
  scores.innerHTML += '(' + lang.score + ': ' + statistic.score + ') ';
  scores.innerHTML += '(' + lang.level + ': ' + statistic.level + ') ';
  scores.innerHTML += '(' + lang.hits + ': ' + statistic.hits + ') ';
  scores.innerHTML += '(' + lang.misses + ': ' + statistic.misses + ') ';
  scores.innerHTML += '(' + lang.accuracy + ': ' + Math.round(accuracy) + '%' + ')</br>';
}

function welcome() {
  context.clearRect(0, 0, 600, 650);

  context.fillStyle = "#fff";
  context.strokeStyle = "#f00";

	context.font = "bold 120px Arial";
  context.lineWidth = 5;

	context.strokeText(lang.welcome, 50, 200);

  context.strokeText(lang.to, 230, 300);

  context.font = "bold 100px Arial";
  context.strokeText('Missionred', 50, 400);

  context.font = "bold 48px Arial";
  context.lineWidth = 2;
	context.strokeText(lang.toStart, 50, 500);
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
