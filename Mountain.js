function startMTGame() {
  console.log("Mountain Game Loaded!");
  clear();

  isCompletedMT = false;
  shapeLinesMT = [];
  
  hideHomeButtons();   
  backButton.show();   
  
  backButton.position(
  (windowWidth - 1080) / 2 + 15,  //+3
  (windowHeight - 780) / 2 + 15   //+750
);

  cnvMT = createCanvas(1080, 780);
  centerCanvasMT();
  pixelDensity(1);
  strokeWeight(5);
  noFill();

  bgMT = loadImage('BgMT.png', () => console.log("BgMT loaded"));
  bgCompleteMT = loadImage('CompletedMT.png', () => console.log("CompletedMT loaded"));

  makeShapeLinesMT();

  window.draw = drawMTGame;
}

let bgMT;
let bgCompleteMT; 
let shapeLinesMT = []; 
let isCompletedMT = false; 
let cnvMT; 

function centerCanvasMT() {
  let x = (windowWidth - width) / 2;
  let y = (windowHeight - height) / 2;
  cnvMT.position(x, y);
}

function windowResized() {
  centerCanvasMT();
}

function drawMTGame() {
  if (isCompletedMT) {
    background(bgCompleteMT);
    return;
  } else {
    background(bgMT);
  }

  if (mouseIsPressed){
    for (let line of shapeLinesMT){
      for (let p of line.points){
        if (dist(mouseX, mouseY, p.x, p.y) < 10){
          p.hit = true;
        }
      }
    }
  }

  for (let line of shapeLinesMT){
    stroke(255);
    for (let i = 0; i < line.points.length - 1; i++){
      let p1 = line.points[i];
      let p2 = line.points[i+1];
      lineSegmentMT(p1, p2);
    }

    stroke(0, 200, 0);
    for (let i = 0; i < line.points.length - 1; i++){
      let p1 = line.points[i];
      let p2 = line.points[i+1];
      if (p1.hit && p2.hit){
        lineSegmentMT(p1, p2);
      }
    }
  }

  drawProgressBarMT();
}

function drawProgressBarMT(){
  let total = 0;
  let completed = 0;

  for (let line of shapeLinesMT){
    for (let p of line.points){
      total++;
      if (p.hit) completed++;
    }
  }

  let progress = completed / total;

  if (progress >= 1.00 && !isCompletedMT) {
    isCompletedMT = true;
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

function makeShapeLinesMT(){
  shapeLinesMT = [];

  addCurveMT(0, height / 2, width * 0.25, height * 0.0005, width / 2, height / 2);

  addCurveMT(width, height / 2, width * 0.75, height * 0.0005, width / 2, height / 2);

  addLineMT(width / 2, height / 2, width * 0.35, height);
  addLineMT(width / 2, height / 2, width * 0.65, height);

  addTriangleMT(width * 0.19, height * 0.65, width * 0.09, height * 0.90, width * 0.29, height * 0.90);
  addRectMT(width * 0.165, height * 0.90, width * 0.05, height * 0.08);
  
  addTriangleMT(width * 0.33, height * 0.60, width * 0.28, height * 0.75, width * 0.38, height * 0.75);
  addRectMT(width * 0.315, height * 0.75, width * 0.03, height * 0.05);
  
  addTriangleMT(width * 0.06, height * 0.55, width * 0.01, height * 0.70, width * 0.11, height * 0.70);
  addRectMT(width * 0.045, height * 0.70, width * 0.03, height * 0.05);

  addTriangleMT(width * 0.87, height * 0.65, width * 0.77, height * 0.90, width * 0.97, height * 0.90);
  addRectMT(width * 0.845, height * 0.90, width * 0.05, height * 0.08);
  
  addTriangleMT(width * 0.70, height * 0.62, width * 0.65, height * 0.77, width * 0.75, height * 0.77);
  addRectMT(width * 0.685, height * 0.77, width * 0.03, height * 0.07);

  addCircleMT(width / 2, height * 0.15, 75);
}

function addLineMT(x1, y1, x2, y2, step=6){
  let points = [];
  let d = dist(x1, y1, x2, y2);
  let count = d / step;
  for (let i = 0; i <= count; i++){
    let x = lerp(x1, x2, i / count);
    let y = lerp(y1, y2, i / count);
    points.push({x, y, hit:false});
  }
  shapeLinesMT.push({points});
}

function addCurveMT(x1, y1, cx, cy, x2, y2){
  let points = [];
  let step = 0.02;
  for (let t = 0; t <= 1; t += step){
    let x = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * cx + t * t * x2;
    let y = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * cy + t * t * y2;
    points.push({x, y, hit:false});
  }
  shapeLinesMT.push({points});
}

function addTriangleMT(x1, y1, x2, y2, x3, y3){
  addLineMT(x1, y1, x2, y2);
  addLineMT(x2, y2, x3, y3);
  addLineMT(x3, y3, x1, y1);
}

function addRectMT(x, y, w, h){
  addLineMT(x, y, x + w, y);
  addLineMT(x + w, y, x + w, y + h);
  addLineMT(x + w, y + h, x, y + h);
  addLineMT(x, y + h, x, y);
}

function addCircleMT(cx, cy, r){
  let points = [];
  for (let angle = 0; angle <= TWO_PI; angle += 0.1){
    let x = cx + cos(angle) * r;
    let y = cy + sin(angle) * r;
    points.push({x, y, hit:false});
  }
  shapeLinesMT.push({points});
}

function lineSegmentMT(p1, p2){
  line(p1.x, p1.y, p2.x, p2.y);
}

