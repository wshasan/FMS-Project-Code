function startSeaGame() {
  console.log("Sea Game Loaded!");
  clear();

  isCompletedSea = false;
  shapeLinesSea = [];
  
  hideHomeButtons();   
  backButton.show();   
  
  backButton.position(
  (windowWidth - 1080) / 2 + 15,  
  (windowHeight - 780) / 2 + 15
);

  cnvSea = createCanvas(1080, 780);
  centerCanvasSea();
  pixelDensity(1);
  strokeWeight(5);
  noFill();

  bgSea = loadImage('BgSea.png', () => console.log("BgSea loaded"));
  bgCompleteSea = loadImage('CompletedSea.png', () => console.log("CompletedSea loaded"));

  makeShapeLinesSea();

  window.draw = drawSeaGame;
}

let bgSea;
let bgCompleteSea;
let shapeLinesSea = [];
let isCompletedSea = false;
let cnvSea;

function drawSeaGame() {
  if (!bgSea || !bgSea.width) {
    background(255);
    textAlign(CENTER, CENTER);
    textSize(24);
    fill(0);
    text("Loading background...", width / 2, height / 2);
    return;
  }

  if (isCompletedSea) {
    background(bgCompleteSea);
    return;
  } else {
    background(bgSea);
  }
  noStroke();
  fill('black'); 
  rect(0, 0, width, 15);
  rect(0, height - 15, width, 15);
  rect(0, 0, 15, height);
  rect(width - 15, 0, 15, height);

  if (mouseIsPressed) {
    for (let line of shapeLinesSea) {
      for (let p of line.points) {
        if (dist(mouseX, mouseY, p.x, p.y) < 10) {
          p.hit = true;
        }
      }
    }
  }

  for (let line of shapeLinesSea) {
    stroke(250);
    for (let i = 0; i < line.points.length - 1; i++) {
      let p1 = line.points[i];
      let p2 = line.points[i + 1];
      lineSegmentSea(p1, p2);
    }

    stroke(0, 200, 0);
    for (let i = 0; i < line.points.length - 1; i++) {
      let p1 = line.points[i];
      let p2 = line.points[i + 1];
      if (p1.hit && p2.hit) {
        lineSegmentSea(p1, p2);
      }
    }
  }

  drawProgressBarSea();
}

function centerCanvasSea() {
  let x = (windowWidth - width) / 2;
  let y = (windowHeight - height) / 2;
  cnvSea.position(x, y);
}

function drawProgressBarSea() {
  let total = 0;
  let completed = 0;

  for (let line of shapeLinesSea) {
    for (let p of line.points) {
      total++;
      if (p.hit) completed++;
    }
  }

  let progress = completed / total;

  if (progress >= 1.0 && !isCompletedSea) {
    isCompletedSea = true;
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

function makeShapeLinesSea(){
  shapeLinesSea = []; 

  let short1 = 100;
  let long1 = short1 * sqrt(3);
  let base1 = createVector(width/2, height/2);
  let triLength1 = createVector(base1.x - short1, base1.y);
  let triHeight1 = createVector(base1.x, base1.y - long1);
  addLineWithPointsSea(base1, triLength1);
  addLineWithPointsSea(triLength1, triHeight1);
  addLineWithPointsSea(triHeight1, base1);

  let short2 = 70;
  let long2 = short2 * sqrt(3);
  let base2 = createVector((width/2) + 25, height/2);
  let triLength2 = createVector(base2.x + short2, base2.y);
  let triHeight2 = createVector(base2.x, base2.y - long2);
  addLineWithPointsSea(base2, triLength2);
  addLineWithPointsSea(triLength2, triHeight2);
  addLineWithPointsSea(triHeight2, base2);

  let cx = width/2, topY = (height/2) + 20, bottomW = 245, h = 60, ratio = 0.6;
  let topW = bottomW * ratio;
  let p1 = createVector(cx - bottomW/2, topY);
  let p2 = createVector(cx + bottomW/2, topY);
  let p3 = createVector(cx + topW/2, topY + h);
  let p4 = createVector(cx - topW/2, topY + h);
  addLineWithPointsSea(p1, p2);
  addLineWithPointsSea(p2, p3);
  addLineWithPointsSea(p3, p4);
  addLineWithPointsSea(p4, p1);

  makeWaveLineSea();
  makeStarFishSea();
  makeSeaweedSea();
  makeSunSea();
  makeFishSea();
}

function makeWaveLineSea(){
  let topY = (height/2) + 20;
  let h = 60;
  let waveY = topY + h + 25;
  let step = 10;
  let points = [];
  for (let x = 20; x <= width - 20; x += step){
    let y = waveY + sin(x * 0.02) * 10;
    points.push({x, y, hit:false});
  }
  shapeLinesSea.push({points});
}

function makeStarFishSea(){
  let cx = width / 2;
  let cy = height - 130;
  let outerR = 50;
  let innerR = 22;
  let points = [];

  for (let i = 0; i < 10; i++){
    let angle = PI / 5 * i - HALF_PI;
    let r = (i % 2 === 0) ? outerR : innerR;
    let x = cx + cos(angle) * r;
    let y = cy + sin(angle) * r;
    points.push({x, y, hit:false});
  }
  points.push(points[0]); 

  let detailedPoints = [];
  for (let i = 0; i < points.length - 1; i++){
    let a = points[i];
    let b = points[i + 1];
    let d = dist(a.x, a.y, b.x, b.y);
    let step = 5;
    let count = d / step;
    for (let j = 0; j <= count; j++){
      let x = lerp(a.x, b.x, j / count);
      let y = lerp(a.y, b.y, j / count);
      detailedPoints.push({x, y, hit:false});
    }
  }
  shapeLinesSea.push({points: detailedPoints});
}

function makeSeaweedSea(){
  let baseY = height - 40;
  let step = 6;

  function addSeaweed(xBase, heightSeaweed, lean){
    let points = [];
    for (let y = 0; y <= heightSeaweed; y += step){
      let offset = sin(y * 0.1 + lean) * 10; 
      points.push({x: xBase + offset, y: baseY - y, hit:false});
    }
    shapeLinesSea.push({points});
  }

  addSeaweed(80, 120, 0);
  addSeaweed(130, 150, 1);
  addSeaweed(180, 100, 2);
  addSeaweed(width - 80, 120, 3);
  addSeaweed(width - 130, 160, 4);
  addSeaweed(width - 180, 110, 5);
}

function makeSunSea(){
  let cx = width / 2;
  let cy = 100;
  let radius = 70;
  let points = [];
  let step = TWO_PI / 100;
  for (let angle = 0; angle <= TWO_PI; angle += step){
    let x = cx + cos(angle) * radius;
    let y = cy + sin(angle) * radius;
    points.push({x, y, hit:false});
  }
  points.push(points[0]);
  shapeLinesSea.push({points});
}

function makeFishSea(){
  let baseY = height - 160;
  function addFish(xBase, size, flip=false){
    let points = [];
    let bodyLength = size;
    let bodyHeight = size * 0.3;
    let tailSize = size * 0.4;
    let step = TWO_PI / 50;

    for (let angle = 0; angle <= TWO_PI; angle += step){
      let x = xBase + cos(angle) * (bodyLength / 2);
      let y = baseY + sin(angle) * (bodyHeight / 2);
      points.push({x, y, hit:false});
    }

    let tailX = flip ? xBase + bodyLength/2 : xBase - bodyLength/2;
    let tailDir = flip ? 1 : -1;
    let tail = [
      createVector(tailX, baseY),
      createVector(tailX + tailDir * tailSize, baseY - tailSize / 2),
      createVector(tailX + tailDir * tailSize, baseY + tailSize / 2),
      createVector(tailX, baseY)
    ];

    for (let i = 0; i < tail.length - 1; i++){
      addLineWithPointsSea(tail[i], tail[i+1], 4);
    }

    shapeLinesSea.push({points});
  }

  addFish(260, 80, false);
  addFish(380, 60, false);
  addFish(width - 260, 80, true);
  addFish(width - 380, 60, true);
}

function addLineWithPointsSea(a, b, step = 6){
  let points = [];
  let d = dist(a.x, a.y, b.x, b.y);
  let count = d / step;
  for (let i = 0; i <= count; i++){
    let x = lerp(a.x, b.x, i / count);
    let y = lerp(a.y, b.y, i / count);
    points.push({x, y, hit:false});
  }
  shapeLinesSea.push({points});
}

function lineSegmentSea(p1, p2){
  line(p1.x, p1.y, p2.x, p2.y);
}

