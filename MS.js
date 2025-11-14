function startMSGame() {
  console.log("MS Game Loaded!");
  clear();

  isCompletedMS = false;
  shapeLinesMS = [];
  
  hideHomeButtons();   
  backButton.show();   
  
  backButton.position(
  (windowWidth - 1080) / 2 + 15,  
  (windowHeight - 780) / 2 + 15
);

  cnvMS = createCanvas(1080, 780);
  centerCanvas();
  pixelDensity(1);
  strokeWeight(5);
  noFill();

  bgMS = loadImage('BgMS.png', () => console.log("BgMS loaded"));
  bgCompleteMS = loadImage('CompletedMS.png', () => console.log("CompletedMS loaded"));

  makeShapeLinesMS();

  window.draw = drawMSGame;
}

let bgMS;
let bgCompleteMS; 
let shapeLinesMS = []; 
let isCompletedMS = false; 
let cnvMS; 


function centerCanvas() {
  let x = (windowWidth - width) / 2;
  let y = (windowHeight - height) / 2;
  cnvMS.position(x, y);
}

function windowResized() {
  centerCanvas();
}

function drawMSGame() {
  if (isCompletedMS) {
    background(bgCompleteMS);
    return; 
  } else {
    background(bgMS);
  }

  noStroke();
  fill('black'); 
  rect(0, 0, width, 15);
  rect(0, height - 15, width, 15);
  rect(0, 0, 15, height);
  rect(width - 15, 0, 15, height);

  if (mouseIsPressed){
    for (let line of shapeLinesMS){
      for (let p of line.points){
        if (dist(mouseX, mouseY, p.x, p.y) < 12){
          p.hit = true;
        }
      }
    }
  }

  for (let line of shapeLinesMS){
    stroke(255);
    for (let i = 0; i < line.points.length - 1; i++){
      let p1 = line.points[i];
      let p2 = line.points[i+1];
      lineSegmentMS(p1, p2);
    }

    stroke(0, 200, 0);
    for (let i = 0; i < line.points.length - 1; i++){
      let p1 = line.points[i];
      let p2 = line.points[i+1];
      if (p1.hit && p2.hit){
        lineSegmentMS(p1, p2);
      }
    }
  }

  drawProgressBarMS();
}

function drawProgressBarMS(){
  let total = 0;
  let completed = 0;

  for (let line of shapeLinesMS){
    for (let p of line.points){
      total++;
      if (p.hit) completed++;
    }
  }

  let progress = completed / total;

  if (progress >= 1.00 && !isCompletedMS) {
    isCompletedMS = true;
    return; 
  }

  let barWidth = 200;
  let barHeight = 20;
  let x = width - barWidth - 40;
  let y = 40;

  noStroke();
  fill(255, 255, 255, 80);
  rect(x, y, barWidth, barHeight, 10);

  fill(0, 200, 0);
  rect(x, y, barWidth * progress, barHeight, 10);

  fill(255);
  textSize(16);
  textAlign(RIGHT, CENTER);
  text(`${Math.floor(progress * 100)}%`, x + barWidth - 10, y + barHeight / 2);
}

function makeShapeLinesMS(){
  shapeLinesMS = [];

  addLineMS(20, 550, 1060, 550);

  addCircleMS(630, 120, 65);

  addLineMS(20, 300, 300, 150);
  addLineMS(300, 150, 620, 280);

  addLineMS(450, 370, 780, 200);
  addLineMS(780, 200, 1060, 350);

  addLineMS(550, 430, 880, 320);
  addLineMS(880, 320, 1060, 420);

  addLineMS(100, 500, 360, 320);
  addLineMS(360, 320, 670, 500);

  addLineMS(20, 430, 100, 350);
  addLineMS(100, 350, 200, 430);

  makeWaveMS(90, 650);
  makeWaveMS(550, 650);
  makeWaveMS(230, 720);
  makeWaveMS(700, 720);
}

function makeWaveMS(x, y) {
  let path = [
    createVector(x + 0,    y),
    createVector(x + 80,   y - 20),
    createVector(x + 160,  y),
    createVector(x + 240,  y - 20),
    createVector(x + 320,  y)
  ];

  let pts = [];
  for (let i = 0; i < path.length - 1; i++) {
    for (let t = 0; t <= 1; t += 0.02) {

      let p0 = path[max(0, i - 1)];
      let p1 = path[i];
      let p2 = path[i + 1];
      let p3 = path[min(path.length - 1, i + 2)];

      let t2 = t * t;
      let t3 = t2 * t;

      let xC = 0.5 * ((2*p1.x) + (-p0.x+p2.x)*t + (2*p0.x-5*p1.x+4*p2.x-p3.x)*t2 + (-p0.x+3*p1.x-3*p2.x+p3.x)*t3);
      let yC = 0.5 * ((2*p1.y) + (-p0.y+p2.y)*t + (2*p0.y-5*p1.y+4*p2.y-p3.y)*t2 + (-p0.y+3*p1.y-3*p2.y+p3.y)*t3);

      pts.push({x:xC, y:yC, hit:false});
    }
  }

  shapeLinesMS.push({points: pts});
}

function addLineMS(x1, y1, x2, y2, step=6){
  let pts = [];
  let d = dist(x1, y1, x2, y2);
  let count = d / step;
  for (let i = 0; i <= count; i++){
    let x = lerp(x1, x2, i / count);
    let y = lerp(y1, y2, i / count);
    pts.push({x, y, hit:false});
  }
  shapeLinesMS.push({points: pts});
}

function addCircleMS(cx, cy, r){
  let pts = [];
  for (let angle = 0; angle <= TWO_PI; angle += 0.1){
    let x = cx + cos(angle) * r;
    let y = cy + sin(angle) * r;
    pts.push({x, y, hit:false});
  }
  shapeLinesMS.push({points: pts});
}

function lineSegmentMS(p1, p2){
  line(p1.x, p1.y, p2.x, p2.y);
}
