let canvasW = 800, canvasH = 500;

// scene objects
let clouds = [];
let sun = { x: canvasW - 140, y: -140, r: 70, targetY: 110, rayAngle: 0 };
let beamAlpha = 0;

let groundH = 80;
let treeX = canvasW / 2;
let groundY = canvasH - groundH;
let treeTopY = groundY - 160;

// water & transport
let waterDrops = [];
let transportParticles = [];
let waterCollected = 0;
let requiredWater = 15;
let dropSpawnTimer = 0;
let dropSpawnInterval = 4;

// growth
let growProgress = 0.0;
let growSpeed = 0.004;
let phase = 0;
let o2Bubbles = [];
let eqAlpha = 0;

// UI
let startBtn, resetBtn;

function setup() {
  let cnv = createCanvas(canvasW, canvasH);
  cnv.parent("animation-container");
  angleMode(RADIANS);
  noStroke();

  // awan awal
  for (let i = 0; i < 5; i++) {
    clouds.push({ x: random(width), y: random(40, 120), size: random(100, 160), speed: random(0.3, 0.7) });
  }

  startBtn = document.getElementById('startBtn');
  resetBtn = document.getElementById('resetBtn');
  startBtn.addEventListener('click', startSequence);
  resetBtn.addEventListener('click', resetScene);

  resetScene();
}

function resetScene() {
  sun.y = -140;
  sun.rayAngle = 0;
  beamAlpha = 0;
  waterDrops = [];
  transportParticles = [];
  waterCollected = 0;
  dropSpawnTimer = 0;
  growProgress = 0;
  phase = 0;
  o2Bubbles = [];
  eqAlpha = 0;
}

function startSequence() {
  resetScene();
  phase = 1;
}

function draw() {
  drawSky();
  drawClouds();
  drawSun(sun.x, sun.y, sun.r);
  drawGround();
  drawTree();

  if (phase === 1) {
    sun.y = lerp(sun.y, sun.targetY, 0.03);
    sun.rayAngle += 0.01;
    if (abs(sun.y - sun.targetY) < 1.5) {
      sun.y = sun.targetY;
      phase = 2;
    }
  } else if (phase === 2) {
    beamAlpha = min(beamAlpha + 2.8, 200);
    if (beamAlpha > 120) {
      if (frameCount % 40 === 0) phase = 3;
    }
  } else if (phase === 3) {
    dropSpawnTimer++;
    if (dropSpawnTimer % dropSpawnInterval === 0) {
      let dx = random(width);
      waterDrops.push({ x: dx, y: -20, vy: random(3, 5) });
    }

    for (let d of waterDrops) {
      d.vy += 0.1;
      d.y += d.vy;
      fill(80, 170, 255, 200);
      ellipse(d.x, d.y, 8, 12);
    }

    for (let i = waterDrops.length - 1; i >= 0; i--) {
      if (waterDrops[i].y >= groundY - 2) {
        // 🚩 Tambahkan air yang terkumpul
        waterCollected++;  
        for (let s = 0; s < 3; s++) {
          transportParticles.push({
            x: treeX,
            y: groundY,
            progress: 0,
            speed: 0.01 + random(0.004, 0.01)
          });
        }
        waterDrops.splice(i, 1);
        if (waterCollected >= requiredWater) {
          phase = 4;
        }
      }
    }
  } else if (phase === 4) {
    for (let t of transportParticles) {
      t.progress += t.speed;
      t.y = lerp(groundY, treeTopY, t.progress);
      fill(70, 160, 255, 220);
      ellipse(treeX + random(-4,4), t.y, 8, 8);
    }

    for (let i = transportParticles.length - 1; i >= 0; i--) {
      if (transportParticles[i].progress >= 0.98) {
        transportParticles.splice(i, 1);
      }
    }

    if (waterCollected >= requiredWater) {
      phase = 5;
    }
  } else if (phase === 5) {
    if (growProgress < 1) {
      growProgress = min(1, growProgress + growSpeed);
    } else {
      phase = 6;
    }
  } else if (phase === 6) {
    eqAlpha = min(eqAlpha + 2.8, 255);
    if (frameCount % 25 === 0 && o2Bubbles.length < 30) {
      o2Bubbles.push({
        x: treeX + random(-80, 80),
        y: treeTopY - 30,
        vx: random(-0.4, 0.4),
        vy: random(-1.2, -0.4),
        size: random(14, 22),
        alpha: 255
      });
    }
  }

  if (phase >= 2) drawSunBeam();

  // ==== O2 bubble ====
  for (let i = o2Bubbles.length - 1; i >= 0; i--) {
    let b = o2Bubbles[i];
    b.x += b.vx;
    b.y += b.vy;
    b.alpha -= 0.6;

    stroke(255, b.alpha);
    strokeWeight(1);
    fill(50, 200, 150, b.alpha);
    ellipse(b.x, b.y, b.size);

    noStroke();
    fill(0, 0, 0, b.alpha);
    textAlign(CENTER, CENTER);
    textSize(12);
    text("O₂", b.x, b.y - 1);

    if (b.alpha <= 0 || b.y < -20) {
      o2Bubbles.splice(i, 1);
    }
  }

  showStatus();
  if (eqAlpha > 0) drawEquation(eqAlpha);
}

/* helpers */

function drawSky() {
  for (let y = 0; y < height; y += 6) {
    let t = map(y, 0, height, 0, 1);
    let r = lerp(210, 170, t);
    let g = lerp(245, 235, t);
    let b = lerp(255, 255, t);
    fill(r, g, b);
    rect(0, y, width, 6);
  }
}

function drawClouds() {
  fill(255, 255, 255, 230);
  for (let c of clouds) {
    ellipse(c.x, c.y, c.size, c.size * 0.6);
    ellipse(c.x + 40, c.y + 10, c.size * 0.8, c.size * 0.5);
    ellipse(c.x - 40, c.y + 10, c.size * 0.7, c.size * 0.5);
    c.x += c.speed;
    if (c.x - c.size > width) {
      c.x = -c.size;
      c.y = random(40, 120);
    }
  }
}

function drawSun(x, y, r) {
  push();
  translate(x, y);
  noStroke();
  for (let i = r * 2; i > 0; i -= 10) {
    fill(255, 220 + i / 10, 120, 40);
    ellipse(0, 0, i * 1.6);
  }
  fill(255, 230, 150);
  ellipse(0, 0, r);
  pop();
}

function drawSunBeam() {
  push();
  fill(255, 230, 130, beamAlpha);
  let tipY = treeTopY;
  let tipHalf = 100;
  beginShape();
    vertex(sun.x, sun.y + 5);
    vertex(treeX - tipHalf, tipY);
    vertex(treeX + tipHalf, tipY);
  endShape(CLOSE);
  pop();
}

function drawGround() {
  noStroke();
  fill(150, 100, 60);
  rect(0, groundY, width, groundH);
}

function drawTree() {
  push();
  // batang
  stroke(100, 70, 40);
  strokeWeight(20);
  line(treeX, groundY, treeX, treeTopY + 30);

  // akar
  stroke(90, 60, 35);
  strokeWeight(8);
  noFill();
  bezier(treeX, groundY, treeX - 40, groundY + 20, treeX - 80, groundY + 40, treeX - 100, groundY + 50);
  bezier(treeX, groundY, treeX + 40, groundY + 20, treeX + 80, groundY + 40, treeX + 100, groundY + 50);
  bezier(treeX, groundY, treeX - 20, groundY + 25, treeX - 40, groundY + 45, treeX - 50, groundY + 55);
  bezier(treeX, groundY, treeX + 20, groundY + 25, treeX + 40, groundY + 45, treeX + 50, groundY + 55);

  noStroke();

  // daun
  fill(40, 160, 70, 200);
  let size = 120 + growProgress * 80;
  ellipse(treeX, treeTopY, size * 1.2, size);
  ellipse(treeX - 60, treeTopY + 20, size, size * 0.8);
  ellipse(treeX + 60, treeTopY + 20, size, size * 0.8);
  ellipse(treeX - 40, treeTopY + 5, size, size * 0.8);
  ellipse(treeX + 40, treeTopY + 5, size, size * 0.8);
  pop();
}

function showStatus() {
  fill(30, 30, 30, 200);
  textSize(14);
  textAlign(LEFT, TOP);
  if (phase === 0) text("Status: Idle — tekan Start.", 12, 12);
  else if (phase === 1) text("Status: Matahari turun...", 12, 12);
  else if (phase === 2) text("Status: Matahari menyorot ke pohon.", 12, 12);
  else if (phase === 3) text("Status: Hujan turun...", 12, 12);
  else if (phase === 4) text("Status: Air terserap akar → naik batang...", 12, 12);
  else if (phase === 5) text("Status: Pohon tumbuh subur...", 12, 12);
  else if (phase === 6) text("Status: Fotosintesis → Glukosa + O₂ dilepaskan", 12, 12);
}

function drawEquation(a) {
  push();
  textAlign(CENTER, CENTER);
  textSize(20);
  fill(40, 40, 40, a);
  text("CO₂ + H₂O + Cahaya Matahari → Glukosa + O₂", width / 2, 36);
  pop();
}