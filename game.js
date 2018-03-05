let canvas = document.getElementById('game');
let context = canvas.getContext('2d');
let count = document.getElementById('count');

let timer = 0;
let maxRadius = 50;

let circles = [];
let score = {
  count: 0,
  score: 0
};

function update() {
  timer++;

  if (timer%40 == 0) {
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

function game(){
  update();
  render();
  requestAnimFrame(game);
}

function addCount(){
  count.children[0].innerHTML++;
}

function kill(event) {

  for (i in circles) {
    let x2 = Math.pow(Math.abs(event.offsetX - circles[i].x), 2);
    let y2 = Math.pow(Math.abs(event.offsetY - circles[i].y), 2);
    let L = Math.sqrt(Math.abs(x2 - y2));

    if (L <= circles[i].R) {
      circles.splice(i, 1);
      addCount();
    } else {

    }
  }
}

function init() {
  canvas.addEventListener("click",  function(event) {
    kill(event);
  });
}

function start() {
  init();
  game();
}

document.addEventListener("DOMContentLoaded", start);
