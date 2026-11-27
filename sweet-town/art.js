/* 엘리의 간식 마을 - 그림 그리기 (모두 코드로 직접 그림) */
window.Art = (function () {
  'use strict';
  var TAU = Math.PI * 2;

  function rr(g, x, y, w, h, r) {
    var m = Math.min(Math.abs(w) / 2, Math.abs(h) / 2);
    r = Math.min(r, m);
    g.beginPath();
    g.moveTo(x + r, y);
    g.arcTo(x + w, y, x + w, y + h, r);
    g.arcTo(x + w, y + h, x, y + h, r);
    g.arcTo(x, y + h, x, y, r);
    g.arcTo(x, y, x + w, y, r);
    g.closePath();
  }
  function ell(g, x, y, rx, ry) {
    g.beginPath();
    g.ellipse(x, y, Math.abs(rx), Math.abs(ry), 0, 0, TAU);
    g.closePath();
  }
  function circ(g, x, y, r) {
    g.beginPath();
    g.arc(x, y, Math.abs(r), 0, TAU);
    g.closePath();
  }
  function starPath(g, cx, cy, outer, inner, points) {
    points = points || 5;
    g.beginPath();
    for (var i = 0; i < points * 2; i++) {
      var a = -Math.PI / 2 + (i * Math.PI) / points;
      var r = i % 2 ? inner : outer;
      var x = cx + Math.cos(a) * r;
      var y = cy + Math.sin(a) * r;
      if (i) g.lineTo(x, y); else g.moveTo(x, y);
    }
    g.closePath();
  }
  function drop(g, cx, cy, rx, ry) {
    g.beginPath();
    g.moveTo(cx, cy - ry);
    g.bezierCurveTo(cx + rx, cy - ry * 0.25, cx + rx * 0.9, cy + ry, cx, cy + ry);
    g.bezierCurveTo(cx - rx * 0.9, cy + ry, cx - rx, cy - ry * 0.25, cx, cy - ry);
    g.closePath();
  }
  function shadow(g, cx, cy, rx, ry, a) {
    g.save();
    g.fillStyle = 'rgba(128,96,120,' + (a == null ? 0.15 : a) + ')';
    ell(g, cx, cy, rx, ry);
    g.fill();
    g.restore();
  }
  function swirl(g, cx, cy, r, c1, c2, turns) {
    g.save();
    var rad = g.createRadialGradient(cx - r * 0.35, cy - r * 0.35, r * 0.1, cx, cy, r);
    rad.addColorStop(0, c1);
    rad.addColorStop(1, c2);
    circ(g, cx, cy, r);
    g.fillStyle = rad;
    g.fill();
    g.strokeStyle = 'rgba(255,255,255,.9)';
    g.lineWidth = Math.max(1, r * 0.17);
    g.lineCap = 'round';
    g.beginPath();
    var n = 90, tt = (turns || 2.6) * TAU;
    for (var i = 0; i <= n; i++) {
      var a = (i / n) * tt;
      var rr2 = r * 0.07 + r * 0.82 * (i / n);
      var x = cx + Math.cos(a) * rr2, y = cy + Math.sin(a) * rr2;
      if (i) g.lineTo(x, y); else g.moveTo(x, y);
    }
    g.stroke();
    g.restore();
  }
  function sprinkle(g, x, y, s, color, rot) {
    g.save();
    g.translate(x, y);
    g.rotate(rot || 0);
    g.fillStyle = color;
    rr(g, -s, -s * 0.38, s * 2, s * 0.76, s * 0.4);
    g.fill();
    g.restore();
  }

  /* ---------------- 간식 아이템 ---------------- */

  function sweetCandy(g, t) {
    // 딸기 사탕
    g.save();
    var bg = g.createLinearGradient(0, -12, 0, 16);
    bg.addColorStop(0, '#ff9ab4');
    bg.addColorStop(0.55, '#ff5f86');
    bg.addColorStop(1, '#e8325f');
    g.beginPath();
    g.moveTo(0, -11);
    g.bezierCurveTo(12, -13, 14, 2, 0, 16);
    g.bezierCurveTo(-14, 2, -12, -13, 0, -11);
    g.closePath();
    g.fillStyle = bg;
    g.fill();
    g.strokeStyle = 'rgba(190,30,70,.35)';
    g.lineWidth = 1;
    g.stroke();
    g.fillStyle = '#fff6cf';
    var seeds = [[-5, -1], [4, -3], [-2, 5], [5, 6], [-6, 8], [1, 10], [7, 1], [-7, 4]];
    for (var i = 0; i < seeds.length; i++) {
      ell(g, seeds[i][0], seeds[i][1], 1.05, 1.5);
      g.fill();
    }
    g.save();
    g.globalAlpha = 0.55;
    g.fillStyle = '#fff';
    ell(g, -5, 1, 2.6, 4.4);
    g.fill();
    g.restore();
    // 잎
    g.fillStyle = '#6fcf7f';
    g.beginPath();
    g.moveTo(0, -12);
    g.bezierCurveTo(6, -20, 12, -15, 0, -12);
    g.bezierCurveTo(-4, -19, -11, -15, 0, -12);
    g.closePath();
    g.fill();
    g.strokeStyle = '#4aa95c';
    g.lineWidth = 1.4;
    g.beginPath();
    g.moveTo(0, -12); g.lineTo(0, -17);
    g.stroke();
    g.restore();
  }

  function sweetMarshmallow(g) {
    g.save();
    var bg = g.createLinearGradient(0, -10, 0, 10);
    bg.addColorStop(0, '#ffffff');
    bg.addColorStop(0.65, '#fff6fa');
    bg.addColorStop(1, '#f3dfe8');
    rr(g, -11, -9, 22, 19, 7);
    g.fillStyle = bg;
    g.fill();
    g.strokeStyle = 'rgba(214,178,196,.6)';
    g.lineWidth = 1;
    g.stroke();
    g.save();
    g.globalAlpha = 0.8;
    g.fillStyle = '#fff';
    rr(g, -7.5, -6.5, 15, 4, 2);
    g.fill();
    g.restore();
    g.restore();
  }

  function sweetCotton(g) {
    g.save();
    g.strokeStyle = '#fffdf9';
    g.lineWidth = 3;
    g.lineCap = 'round';
    g.beginPath();
    g.moveTo(0, 3); g.lineTo(0, 17);
    g.stroke();
    var puffs = [[-7, -4, 7], [0, -7, 8], [7, -3, 6.5], [0, 1, 7], [-4, 2, 5.5], [5, 2, 5]];
    for (var i = 0; i < puffs.length; i++) {
      var pg = g.createRadialGradient(puffs[i][0] - 2, puffs[i][1] - 2, 1, puffs[i][0], puffs[i][1], puffs[i][2]);
      pg.addColorStop(0, '#ffd9ea');
      pg.addColorStop(1, '#ffa6cd');
      circ(g, puffs[i][0], puffs[i][1], puffs[i][2]);
      g.fillStyle = pg;
      g.fill();
    }
    g.restore();
  }

  function sweetChoco(g) {
    g.save();
    var bg = g.createLinearGradient(0, -10, 0, 10);
    bg.addColorStop(0, '#a3703f');
    bg.addColorStop(1, '#6f4426');
    rr(g, -11, -10, 22, 21, 4);
    g.fillStyle = bg;
    g.fill();
    g.strokeStyle = 'rgba(60,34,18,.5)';
    g.lineWidth = 1.2;
    g.beginPath();
    g.moveTo(0, -9.5); g.lineTo(0, 10);
    g.moveTo(-10.5, 0.5); g.lineTo(10.5, 0.5);
    g.stroke();
    g.fillStyle = '#4b2a13';
    var chips = [[-5, -4], [5, -5], [-4.5, 5.5], [5.5, 4.5]];
    for (var i = 0; i < chips.length; i++) {
      ell(g, chips[i][0], chips[i][1], 1.7, 1.7);
      g.fill();
    }
    g.fillStyle = 'rgba(255,230,200,.35)';
    rr(g, -9, -8.5, 7, 2.4, 1.2);
    g.fill();
    g.restore();
  }

  function sweetGummy(g, t) {
    g.save();
    g.globalAlpha = 0.94;
    var bg = g.createLinearGradient(0, -14, 0, 16);
    bg.addColorStop(0, '#ff8f8f');
    bg.addColorStop(1, '#f0475f');
    g.fillStyle = bg;
    g.strokeStyle = 'rgba(220,60,90,.5)';
    g.lineWidth = 1;
    // 몸
    ell(g, 0, 5, 8.6, 8.2); g.fill(); g.stroke();
    // 머리
    circ(g, 0, -5.5, 7.2); g.fill(); g.stroke();
    // 귀
    circ(g, -5, -11, 2.7); g.fill(); g.stroke();
    circ(g, 5, -11, 2.7); g.fill(); g.stroke();
    // 팔
    ell(g, -8.6, 2, 2.8, 5); g.fill(); g.stroke();
    ell(g, 8.6, 2, 2.8, 5); g.fill(); g.stroke();
    // 다리
    ell(g, -4, 12.5, 3.2, 3.6); g.fill(); g.stroke();
    ell(g, 4, 12.5, 3.2, 3.6); g.fill(); g.stroke();
    // 얼굴
    g.globalAlpha = 0.95;
    g.fillStyle = '#5a1b2a';
    circ(g, -2.4, -6, 1.1); g.fill();
    circ(g, 2.4, -6, 1.1); g.fill();
    g.strokeStyle = '#7d2233';
    g.lineWidth = 0.9;
    g.beginPath();
    g.arc(0, -3.6, 1.9, 0.25, Math.PI - 0.25);
    g.stroke();
    g.fillStyle = 'rgba(255,255,255,.75)';
    circ(g, -3, -8.6, 1.5); g.fill();
    g.restore();
  }

  function sweetStar(g, t) {
    g.save();
    var pulse = 1 + Math.sin((t || 0) * 3) * 0.04;
    g.scale(pulse, pulse);
    starPath(g, 0, 1, 13.5, 6, 5);
    var bg = g.createRadialGradient(-3, -5, 1, 0, 1, 15);
    bg.addColorStop(0, '#fff8c0');
    bg.addColorStop(0.55, '#ffd84a');
    bg.addColorStop(1, '#f5a623');
    g.fillStyle = bg;
    g.fill();
    g.strokeStyle = 'rgba(226,150,20,.55)';
    g.lineWidth = 1.2;
    g.stroke();
    g.fillStyle = 'rgba(255,255,255,.85)';
    circ(g, -3.4, -3.4, 1.9); g.fill();
    g.restore();
  }

  function drawSweet(g, type, cx, cy, size, t) {
    g.save();
    g.translate(cx, cy);
    var k = (size || 34) / 40;
    g.scale(k, k);
    if (type === 'candy') sweetCandy(g, t);
    else if (type === 'marshmallow') sweetMarshmallow(g, t);
    else if (type === 'cotton') sweetCotton(g, t);
    else if (type === 'choco') sweetChoco(g, t);
    else if (type === 'gummy') sweetGummy(g, t);
    else if (type === 'starjelly') sweetStar(g, t);
    else if (type === 'cookie') sweetCookie(g, t);
    else if (type === 'cupcake') sweetCupcake(g, t);
    g.restore();
  }

  /* ---------------- 가구 ---------------- */

  function furnLamppost(g, t) {
    // 기둥
    shadow(g, 0, 2, 13, 5, 0.16);
    var pg = g.createLinearGradient(-3, 0, 3, 0);
    pg.addColorStop(0, '#ffe9f3');
    pg.addColorStop(1, '#f6c9dc');
    rr(g, -3, -60, 6, 61, 3);
    g.fillStyle = pg;
    g.fill();
    g.strokeStyle = 'rgba(190,140,165,.45)';
    g.lineWidth = 1;
    g.stroke();
    // 받침
    g.fillStyle = '#f2a9c6';
    rr(g, -10, -6, 20, 8, 4);
    g.fill();
    // 빛
    var glow = g.createRadialGradient(0, -72, 2, 0, -72, 30);
    glow.addColorStop(0, 'rgba(255,240,170,.85)');
    glow.addColorStop(1, 'rgba(255,240,170,0)');
    circ(g, 0, -72, 30);
    g.fillStyle = glow;
    g.fill();
    swirl(g, 0, -72, 15, '#fff1b8', '#ffb3d1', 2.4);
    g.strokeStyle = '#fff';
    g.lineWidth = 2.5;
    circ(g, 0, -72, 15);
    g.stroke();
  }

  function furnMacaron(g, t) {
    shadow(g, 0, 2, 20, 6, 0.16);
    // 다리
    g.strokeStyle = '#e6a9c2';
    g.lineWidth = 3;
    g.lineCap = 'round';
    g.beginPath();
    g.moveTo(-11, -16); g.lineTo(-13, -1);
    g.moveTo(11, -16); g.lineTo(13, -1);
    g.stroke();
    // 윗면
    g.fillStyle = '#ffd0e2';
    ell(g, 0, -22, 20, 7);
    g.fill();
    g.fillStyle = '#ffb7d3';
    ell(g, 0, -27, 19, 6.5);
    g.fill();
    g.fillStyle = '#fff6fb';
    ell(g, 0, -24.5, 15, 3.6);
    g.fill();
    // 마카롱 접시
    g.fillStyle = '#fffdf8';
    ell(g, 0, -18, 18, 4.6);
    g.fill();
    // 위에 놓인 마카롱
    g.fillStyle = '#c8ecff';
    ell(g, 0, -32, 8, 3.4);
    g.fill();
    g.fillStyle = '#a9e0fb';
    ell(g, 0, -35, 7.5, 3.2);
    g.fill();
    g.fillStyle = '#fff';
    ell(g, 0, -33.5, 5.6, 1.5);
    g.fill();
  }

  function furnFountain(g, t) {
    shadow(g, 0, 2, 24, 7, 0.18);
    // 받침
    var bg = g.createLinearGradient(0, -18, 0, 0);
    bg.addColorStop(0, '#c08a63');
    bg.addColorStop(1, '#8a5a3b');
    rr(g, -22, -14, 44, 15, 6);
    g.fillStyle = bg;
    g.fill();
    g.fillStyle = '#6f452c';
    ell(g, 0, -14, 18, 5);
    g.fill();
    // 초콜릿 물
    g.fillStyle = '#a8703f';
    ell(g, 0, -14, 15, 3.8);
    g.fill();
    // 중간 단
    rr(g, -15, -32, 30, 9, 4);
    g.fillStyle = '#b57d57';
    g.fill();
    g.fillStyle = '#7a4c2e';
    ell(g, 0, -32, 12, 3.4);
    g.fill();
    // 위 단
    rr(g, -8, -46, 16, 7, 3);
    g.fillStyle = '#c08a63';
    g.fill();
    // 흘러내리는 초콜릿
    g.fillStyle = 'rgba(120,72,40,.85)';
    var drips = [[-13, -14], [-6, -14], [6, -14], [13, -14]];
    for (var i = 0; i < drips.length; i++) {
      var wob = Math.sin((t || 0) * 2 + i) * 0.8;
      drop(g, drips[i][0] + wob, -20, 2.2, 5.5);
      g.fill();
    }
    g.fillStyle = 'rgba(150,95,55,.9)';
    for (var j = -1; j <= 1; j++) {
      drop(g, j * 5, -38, 1.8, 4.5);
      g.fill();
    }
    // 위에서 솟는 초코
    g.fillStyle = '#8a5a3b';
    g.beginPath();
    g.moveTo(0, -46);
    g.quadraticCurveTo(-5, -56, 0, -62 + Math.sin((t || 0) * 3) * 1.5);
    g.quadraticCurveTo(5, -56, 0, -46);
    g.fill();
    g.fillStyle = 'rgba(255,220,180,.5)';
    circ(g, -1.5, -55, 1.3);
    g.fill();
    // 딸기 장식
    g.fillStyle = '#ff6b8e';
    circ(g, -18, -20, 3);
    g.fill();
    g.fillStyle = '#6fcf7f';
    circ(g, -18, -22.5, 1.6);
    g.fill();
  }

  function furnPlant(g, t) {
    shadow(g, 0, 2, 13, 5, 0.16);
    var pg = g.createLinearGradient(0, -18, 0, 0);
    pg.addColorStop(0, '#bdf0e0');
    pg.addColorStop(1, '#8fd8c4');
    g.beginPath();
    g.moveTo(-11, -18);
    g.lineTo(11, -18);
    g.lineTo(8, 0);
    g.lineTo(-8, 0);
    g.closePath();
    g.fillStyle = pg;
    g.fill();
    g.fillStyle = '#a5e6d3';
    rr(g, -12.5, -21, 25, 6, 3);
    g.fill();
    // 젤리 꽃
    var cols = ['#ff9ec4', '#ffd75e', '#a9c8ff', '#b5e8a8'];
    for (var i = 0; i < 4; i++) {
      var a = -Math.PI / 2 + (i - 1.5) * 0.5;
      var x = Math.cos(a) * 8, y = -22 + Math.sin(a) * 8;
      g.strokeStyle = '#7cc9a5';
      g.lineWidth = 2;
      g.beginPath();
      g.moveTo(0, -21); g.quadraticCurveTo(x * 0.6, y + 4, x, y);
      g.stroke();
      var wob = Math.sin((t || 0) * 2 + i) * 0.8;
      g.fillStyle = cols[i];
      rr(g, x - 3.4 + wob, y - 4, 6.8, 8, 2.4);
      g.fill();
      g.fillStyle = 'rgba(255,255,255,.7)';
      circ(g, x - 1 + wob, y - 1.6, 1.3);
      g.fill();
    }
  }

  function furnSofa(g, t) {
    shadow(g, 0, 2, 22, 6, 0.16);
    // 등받이 솜사탕
    var puffs = [[-14, -22, 9], [-4, -26, 10], [7, -25, 9.5], [15, -21, 8]];
    for (var i = 0; i < puffs.length; i++) {
      var pg = g.createRadialGradient(puffs[i][0] - 2, puffs[i][1] - 3, 1, puffs[i][0], puffs[i][1], puffs[i][2]);
      pg.addColorStop(0, '#ffe4f0');
      pg.addColorStop(1, '#ffb0d2');
      circ(g, puffs[i][0], puffs[i][1], puffs[i][2]);
      g.fillStyle = pg;
      g.fill();
    }
    // 좌석
    g.fillStyle = '#ffc6de';
    rr(g, -19, -16, 38, 15, 7);
    g.fill();
    g.fillStyle = '#ffdcea';
    rr(g, -16, -14.5, 32, 6, 3);
    g.fill();
    // 다리
    g.fillStyle = '#fff6fb';
    rr(g, -15, -2, 5, 4, 2);
    g.fill();
    rr(g, 10, -2, 5, 4, 2);
    g.fill();
  }

  function furnFence(g, t) {
    for (var s = 0; s < 2; s++) {
      var x = s ? 13 : -13;
      g.fillStyle = '#fff8f4';
      rr(g, x - 2.6, -30, 5.2, 31, 2.6);
      g.fill();
      g.save();
      g.beginPath();
      rr(g, x - 2.6, -30, 5.2, 31, 2.6);
      g.clip();
      g.fillStyle = '#ff8fae';
      for (var i = 0; i < 5; i++) {
        g.save();
        g.translate(x - 6, -28 + i * 7);
        g.rotate(-0.5);
        g.fillRect(-8, 0, 18, 3.2);
        g.restore();
      }
      g.restore();
      g.fillStyle = '#ffd0e0';
      circ(g, x, -31, 3.2);
      g.fill();
    }
    g.fillStyle = '#ffb7d0';
    rr(g, -13, -22, 26, 4.4, 2);
    g.fill();
    rr(g, -13, -12, 26, 4.4, 2);
    g.fill();
    g.fillStyle = 'rgba(255,255,255,.7)';
    rr(g, -12, -21.4, 24, 1.4, 0.7);
    g.fill();
  }

  var FURN = {
    lamppost: furnLamppost,
    macaron: furnMacaron,
    fountain: furnFountain,
    plant: furnPlant,
    sofa: furnSofa,
    fence: furnFence,
    gummylamp: furnGummyLamp,
    cakefountain: furnCakeFountain,
    heartchair: furnHeartChair,
    starbed: furnStarBed,
    ovenbrick: furnOvenDecor,
    rainbowarch: furnRainbowArch
  };

  function drawFurniture(g, type, cx, baseY, scale, t) {
    if (!FURN[type]) return;
    g.save();
    g.translate(cx, baseY);
    g.scale(scale || 1, scale || 1);
    FURN[type](g, t);
    g.restore();
  }

  /* ---------------- 나무와 덤불 ---------------- */

  function drawLollipopTree(g, cx, baseY, variant, t) {
    var pal = [
      ['#ffd3e6', '#ff7fb2', '#fff0f7'],
      ['#d6f3e4', '#4fc99b', '#f0fff8'],
      ['#e6dcff', '#a98bf0', '#f7f2ff'],
      ['#fff0c2', '#ffc433', '#fffbe8']
    ][variant % 4];
    var sway = Math.sin((t || 0) * 1.2 + variant) * 1.6;
    shadow(g, cx, baseY, 20, 6, 0.16);
    g.save();
    g.translate(cx, baseY);
    // 줄기
    g.strokeStyle = '#d8a97e';
    g.lineWidth = 7;
    g.lineCap = 'round';
    g.beginPath();
    g.moveTo(0, 0);
    g.quadraticCurveTo(sway * 0.3, -20, sway, -38);
    g.stroke();
    g.strokeStyle = 'rgba(255,255,255,.3)';
    g.lineWidth = 2;
    g.beginPath();
    g.moveTo(-1.4, -2);
    g.quadraticCurveTo(-1, -20, sway * 0.8, -36);
    g.stroke();
    // 잎
    g.fillStyle = '#7ed492';
    ell(g, -9, -22, 7, 4);
    g.fill();
    ell(g, 9, -26, 7, 4);
    g.fill();
    // 사탕
    swirl(g, sway, -52, 22, pal[0], pal[1], 2.4);
    // 반짝이
    g.globalAlpha = 0.6 + Math.sin((t || 0) * 3 + variant) * 0.3;
    g.fillStyle = '#fff';
    starPath(g, sway + 14, -64, 4, 1.8, 4);
    g.fill();
    g.restore();
  }

  function drawCocoaTree(g, cx, baseY, variant, t) {
    var sway = Math.sin((t || 0) * 1.1 + variant * 2) * 1.4;
    shadow(g, cx, baseY, 19, 6, 0.16);
    g.save();
    g.translate(cx, baseY);
    g.strokeStyle = '#c08a63';
    g.lineWidth = 8;
    g.lineCap = 'round';
    g.beginPath();
    g.moveTo(0, 0);
    g.quadraticCurveTo(sway * 0.4, -18, sway, -32);
    g.stroke();
    g.fillStyle = '#79cf8b';
    ell(g, -12, -20, 8, 4.4);
    g.fill();
    ell(g, 12, -24, 7.5, 4.2);
    g.fill();

    function chocoChunk(x, y, w, h, rot) {
      g.save();
      g.translate(x, y);
      g.rotate(rot || 0);
      var bg = g.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2);
      bg.addColorStop(0, '#a5703f');
      bg.addColorStop(0.55, '#8a5a35');
      bg.addColorStop(1, '#6a4023');
      rr(g, -w / 2, -h / 2, w, h, 6);
      g.fillStyle = bg;
      g.fill();
      g.strokeStyle = 'rgba(52,28,14,.4)';
      g.lineWidth = 1.4;
      g.stroke();
      g.fillStyle = 'rgba(255,228,196,.3)';
      rr(g, -w / 2 + 3, -h / 2 + 3, w * 0.42, 3.4, 1.7);
      g.fill();
      g.fillStyle = '#4a2a13';
      ell(g, -w * 0.18, -h * 0.16, 1.8, 1.8);
      g.fill();
      ell(g, w * 0.2, h * 0.14, 1.6, 1.6);
      g.fill();
      g.restore();
    }

    chocoChunk(sway - 8, -50, 30, 28, 0.12);
    chocoChunk(sway + 11, -46, 24, 24, -0.16);
    chocoChunk(sway, -58, 26, 22, -0.06);
    // 반짝이
    g.globalAlpha = 0.65 + Math.sin((t || 0) * 3 + variant) * 0.25;
    g.fillStyle = '#fff';
    starPath(g, sway - 16, -60, 3.6, 1.5, 4);
    g.fill();
    g.globalAlpha = 1;
    g.restore();
  }

  function cottonPuff(g, x, y, r, c1, c2) {
    var pg = g.createRadialGradient(x - r * 0.3, y - r * 0.35, r * 0.15, x, y, r);
    pg.addColorStop(0, c1);
    pg.addColorStop(1, c2);
    circ(g, x, y, r);
    g.fillStyle = pg;
    g.fill();
    g.strokeStyle = 'rgba(255,255,255,.55)';
    g.lineWidth = 1.2;
    g.stroke();
  }

  function drawCottonBush(g, cx, baseY, variant, t) {
    var bob = Math.sin((t || 0) * 1.6 + variant) * 1.2;
    shadow(g, cx, baseY, 20, 6, 0.15);
    g.save();
    g.translate(cx, baseY + bob * 0.3);
    var pal = variant % 3 === 0 ? ['#ffe6f2', '#ff9fce'] : variant % 3 === 1 ? ['#e4f1ff', '#9fc6ff'] : ['#fff4d9', '#ffd479'];
    g.fillStyle = '#8ad7a0';
    ell(g, 0, -3, 18, 5);
    g.fill();
    cottonPuff(g, -10, -12, 11, pal[0], pal[1]);
    cottonPuff(g, 9, -13, 10, pal[0], pal[1]);
    cottonPuff(g, 0, -20, 12, pal[0], pal[1]);
    cottonPuff(g, -2, -10, 9, pal[0], pal[1]);
    g.globalAlpha = 0.75;
    g.fillStyle = '#fff';
    starPath(g, 12, -24, 3.6, 1.4, 4);
    g.fill();
    g.restore();
  }

  function drawMarshmallowBush(g, cx, baseY, variant, t) {
    var bob = Math.sin((t || 0) * 1.5 + variant * 1.7) * 1;
    shadow(g, cx, baseY, 18, 6, 0.15);
    g.save();
    g.translate(cx, baseY + bob * 0.3);
    g.fillStyle = '#8ad7a0';
    ell(g, 0, -3, 17, 5);
    g.fill();
    var spots = [[-9, -12, 8, 9], [4, -15, 9, 10], [11, -9, 7, 8], [-3, -8, 8, 8]];
    for (var i = 0; i < spots.length; i++) {
      var sg = g.createLinearGradient(0, -30, 0, 2);
      sg.addColorStop(0, '#ffffff');
      sg.addColorStop(1, '#f2dbe6');
      rr(g, spots[i][0] - spots[i][2] / 2, spots[i][1] - spots[i][3] / 2, spots[i][2], spots[i][3], 4);
      g.fillStyle = sg;
      g.fill();
      g.strokeStyle = 'rgba(214,180,198,.55)';
      g.lineWidth = 1;
      g.stroke();
    }
    g.restore();
  }

  function drawBench(g, cx, baseY, t) {
    shadow(g, cx, baseY, 22, 6, 0.15);
    g.save();
    g.translate(cx, baseY);
    // 마시멜로 기둥
    g.fillStyle = '#fffdfa';
    rr(g, -16, -12, 8, 13, 3);
    g.fill();
    rr(g, 8, -12, 8, 13, 3);
    g.fill();
    // 쿠션
    g.fillStyle = '#ffb7d3';
    rr(g, -21, -17, 42, 8, 4);
    g.fill();
    g.fillStyle = '#ffd7e6';
    rr(g, -19, -16.5, 38, 3.4, 1.7);
    g.fill();
    // 하트
    g.fillStyle = '#ff7fae';
    g.beginPath();
    g.moveTo(11, -20);
    g.bezierCurveTo(14, -25, 19, -21, 15, -17);
    g.bezierCurveTo(13, -15, 11, -16, 11, -16);
    g.bezierCurveTo(11, -16, 9, -15, 7, -17);
    g.bezierCurveTo(3, -21, 8, -25, 11, -20);
    g.fill();
    g.restore();
  }

  /* ---------------- 과자집 ---------------- */

  function drawHouse(g, cx, baseY, scale, t) {
    g.save();
    g.translate(cx, baseY);
    g.scale(scale, scale);

    var bw = 330, bh = 176, bx = -bw / 2, by = -bh;

    shadow(g, 0, 6, 230, 34, 0.16);

    // 벽
    var wg = g.createLinearGradient(0, by, 0, 0);
    wg.addColorStop(0, '#fffaf1');
    wg.addColorStop(0.7, '#ffeed9');
    wg.addColorStop(1, '#ffdcc0');
    rr(g, bx, by, bw, bh, 16);
    g.fillStyle = wg;
    g.fill();

    // 웨하스 세로 결
    g.save();
    rr(g, bx, by, bw, bh, 16);
    g.clip();
    g.strokeStyle = 'rgba(214,168,128,.35)';
    g.lineWidth = 1.4;
    for (var i = 0; i < 12; i++) {
      var x = bx + 14 + i * 27;
      g.beginPath();
      g.moveTo(x, by);
      g.lineTo(x, by + bh);
      g.stroke();
    }
    // 초콜릿 아래 띠
    var cb = g.createLinearGradient(0, -40, 0, 0);
    cb.addColorStop(0, '#a06a45');
    cb.addColorStop(1, '#7b4b2e');
    g.fillStyle = cb;
    g.fillRect(bx, by + bh - 34, bw, 34);
    g.fillStyle = 'rgba(255,225,190,.25)';
    g.fillRect(bx, by + bh - 34, bw, 3);
    // 젤리 콩 장식
    var gum = ['#ff8fb3', '#ffd75e', '#96d9ff', '#b7e8a8', '#d5b3ff'];
    for (var k = 0; k < 20; k++) {
      var gx = bx + 10 + k * 16.4;
      var col = gum[k % gum.length];
      g.fillStyle = col;
      g.beginPath();
      g.arc(gx, by + bh - 22, 5.6, Math.PI, 0);
      g.closePath();
      g.fill();
      g.fillStyle = 'rgba(255,255,255,.55)';
      circ(g, gx - 1.8, by + bh - 24.5, 1.6);
      g.fill();
    }
    g.restore();

    // 창문
    function window_(wx) {
      var wy = by + 34, ww = 62, wh = 56;
      g.save();
      g.fillStyle = '#fffdf8';
      rr(g, wx - ww / 2 - 5, wy - 5, ww + 10, wh + 10, 10);
      g.fill();
      var jg = g.createLinearGradient(wx - ww / 2, wy, wx + ww / 2, wy + wh);
      jg.addColorStop(0, '#ffe2f0');
      jg.addColorStop(0.5, '#cfeaff');
      jg.addColorStop(1, '#ffd6ea');
      rr(g, wx - ww / 2, wy, ww, wh, 7);
      g.fillStyle = jg;
      g.fill();
      g.strokeStyle = 'rgba(255,255,255,.9)';
      g.lineWidth = 4;
      g.beginPath();
      g.moveTo(wx, wy); g.lineTo(wx, wy + wh);
      g.moveTo(wx - ww / 2, wy + wh / 2); g.lineTo(wx + ww / 2, wy + wh / 2);
      g.stroke();
      // 반짝임
      g.fillStyle = 'rgba(255,255,255,.85)';
      g.beginPath();
      g.moveTo(wx - 18, wy + 12);
      g.lineTo(wx - 6, wy + 22);
      g.lineTo(wx - 20, wy + 26);
      g.closePath();
      g.fill();
      // 창가 화분
      g.fillStyle = '#c98f68';
      rr(g, wx - ww / 2 - 2, wy + wh + 4, ww + 4, 8, 3);
      g.fill();
      g.fillStyle = '#7ed492';
      for (var i = 0; i < 4; i++) {
        circ(g, wx - ww / 2 + 8 + i * 15, wy + wh + 3, 4.5);
        g.fill();
      }
      g.fillStyle = '#ffb3d1';
      for (var j = 0; j < 3; j++) {
        circ(g, wx - ww / 2 + 15 + j * 15, wy + wh, 2.8);
        g.fill();
      }
      g.restore();
    }
    window_(-88);
    window_(88);

    // 문
    var dw = 76, dh = 96, dx = 0;
    g.save();
    g.fillStyle = '#fffdf8';
    g.beginPath();
    g.moveTo(dx - dw / 2 - 6, 0);
    g.lineTo(dx - dw / 2 - 6, -dh + 12);
    g.quadraticCurveTo(dx - dw / 2 - 6, -dh - 10, dx, -dh - 10);
    g.quadraticCurveTo(dx + dw / 2 + 6, -dh - 10, dx + dw / 2 + 6, -dh + 12);
    g.lineTo(dx + dw / 2 + 6, 0);
    g.closePath();
    g.fill();
    var dg = g.createLinearGradient(0, -dh, 0, 0);
    dg.addColorStop(0, '#9a6340');
    dg.addColorStop(1, '#6e4529');
    g.beginPath();
    g.moveTo(dx - dw / 2, 0);
    g.lineTo(dx - dw / 2, -dh + 12);
    g.quadraticCurveTo(dx - dw / 2, -dh, dx, -dh);
    g.quadraticCurveTo(dx + dw / 2, -dh, dx + dw / 2, -dh + 12);
    g.lineTo(dx + dw / 2, 0);
    g.closePath();
    g.fillStyle = dg;
    g.fill();
    g.fillStyle = 'rgba(255,235,210,.18)';
    rr(g, dx - dw / 2 + 8, -dh + 16, 10, 60, 5);
    g.fill();
    // 하트 창
    g.fillStyle = '#ffd0e2';
    g.beginPath();
    g.moveTo(0, -64);
    g.bezierCurveTo(10, -78, 24, -66, 12, -54);
    g.bezierCurveTo(6, -48, 0, -50, 0, -50);
    g.bezierCurveTo(0, -50, -6, -48, -12, -54);
    g.bezierCurveTo(-24, -66, -10, -78, 0, -64);
    g.fill();
    // 손잡이
    g.fillStyle = '#ffe08a';
    circ(g, 26, -36, 4.6);
    g.fill();
    g.restore();

    // 문 앞 마시멜로 계단
    g.fillStyle = '#fffdf8';
    rr(g, -40, -8, 80, 10, 5);
    g.fill();
    g.fillStyle = '#f0dbe6';
    rr(g, -34, -2, 68, 7, 3.5);
    g.fill();

    // 지붕
    var roofW = bw * 1.16, roofTop = by - 118, roofBottom = by + 16;
    g.beginPath();
    g.moveTo(-roofW / 2, roofBottom);
    g.bezierCurveTo(-roofW / 2 + 6, by - 78, -roofW * 0.26, roofTop, 0, roofTop);
    g.bezierCurveTo(roofW * 0.26, roofTop, roofW / 2 - 6, by - 78, roofW / 2, roofBottom);
    g.closePath();
    var rg = g.createLinearGradient(0, roofTop, 0, roofBottom);
    rg.addColorStop(0, '#ffc2da');
    rg.addColorStop(0.55, '#ff9ec4');
    rg.addColorStop(1, '#ff7fae');
    g.fillStyle = rg;
    g.fill();
    g.strokeStyle = 'rgba(214,110,150,.35)';
    g.lineWidth = 2;
    g.stroke();

    // 지붕 줄무늬
    g.save();
    g.beginPath();
    g.moveTo(-roofW / 2, roofBottom);
    g.bezierCurveTo(-roofW / 2 + 6, by - 78, -roofW * 0.26, roofTop, 0, roofTop);
    g.bezierCurveTo(roofW * 0.26, roofTop, roofW / 2 - 6, by - 78, roofW / 2, roofBottom);
    g.closePath();
    g.clip();
    g.fillStyle = 'rgba(255,255,255,.34)';
    for (var s = -5; s <= 5; s++) {
      g.save();
      g.translate(s * 40, 0);
      g.rotate(0.12);
      g.fillRect(-8, roofTop - 10, 14, 180);
      g.restore();
    }
    // 지붕 사탕
    var candyCols = ['#ffe08a', '#a9e6ff', '#c8b4ff', '#b7e8a8', '#fff'];
    for (var c = 0; c < 14; c++) {
      var px = -roofW / 2 + 24 + c * 30 + (c % 2) * 6;
      var py = roofBottom - 26 - (c % 3) * 16;
      g.fillStyle = candyCols[c % candyCols.length];
      rr(g, px - 4, py - 3, 8, 5.5, 2.6);
      g.fill();
    }
    g.restore();

    // 처마 프로스팅(흘러내리는 크림)
    g.save();
    var dripY = roofBottom - 2;
    g.fillStyle = '#fffaf2';
    g.beginPath();
    g.moveTo(-roofW / 2, dripY - 10);
    for (var d = 0; d <= 16; d++) {
      var dxp = -roofW / 2 + (d * roofW) / 16;
      var dz = 8 + Math.sin(d * 1.7) * 5;
      g.quadraticCurveTo(dxp - roofW / 32, dripY + dz, dxp, dripY + 1);
    }
    g.lineTo(roofW / 2, dripY - 18);
    g.lineTo(-roofW / 2, dripY - 18);
    g.closePath();
    g.fill();
    g.strokeStyle = 'rgba(230,205,190,.5)';
    g.lineWidth = 1.4;
    g.stroke();
    g.restore();

    // 굴뚝 (마시멜로)
    var chX = 108, chTop = by - 96;
    var chg = g.createLinearGradient(chX - 16, 0, chX + 16, 0);
    chg.addColorStop(0, '#fff6fb');
    chg.addColorStop(0.45, '#ffffff');
    chg.addColorStop(1, '#f4dee9');
    rr(g, chX - 15, chTop, 30, 42, 8);
    g.fillStyle = chg;
    g.fill();
    g.strokeStyle = 'rgba(206,168,188,.7)';
    g.lineWidth = 1.4;
    g.stroke();
    // 마시멜로 결
    g.strokeStyle = 'rgba(206,168,188,.55)';
    g.lineWidth = 1.2;
    for (var mm = 1; mm <= 2; mm++) {
      g.beginPath();
      g.moveTo(chX - 14, chTop + mm * 14);
      g.lineTo(chX + 14, chTop + mm * 14);
      g.stroke();
    }
    g.fillStyle = '#ffd0e2';
    rr(g, chX - 15, chTop + 5, 30, 6, 3);
    g.fill();
    g.fillStyle = '#fffdf8';
    rr(g, chX - 19, chTop - 8, 38, 11, 5.5);
    g.fill();
    g.strokeStyle = 'rgba(206,168,188,.7)';
    g.lineWidth = 1.2;
    g.stroke();
    // 연기 (솜사탕 구름)
    for (var p = 0; p < 4; p++) {
      var tt = ((t || 0) * 0.35 + p * 0.25) % 1;
      var py2 = chTop - 14 - tt * 52;
      var pr = 9 + tt * 8;
      g.globalAlpha = (1 - tt) * 0.75;
      var sg2 = g.createRadialGradient(chX - 3, py2 - 3, 1, chX, py2, pr);
      sg2.addColorStop(0, '#ffffff');
      sg2.addColorStop(1, '#ffd3e8');
      circ(g, chX + Math.sin(tt * 6 + p) * 6, py2, pr);
      g.fillStyle = sg2;
      g.fill();
    }
    g.globalAlpha = 1;

    // 문 양옆 롤리팝 기둥
    function pillar(px, col1, col2) {
      g.strokeStyle = '#fffdf8';
      g.lineWidth = 6;
      g.lineCap = 'round';
      g.beginPath();
      g.moveTo(px, 0);
      g.lineTo(px, -64);
      g.stroke();
      swirl(g, px, -78, 16, col1, col2, 2.2);
    }
    pillar(-72, '#ffe6f2', '#ff7fb2');
    pillar(72, '#e2f6ff', '#59c2ee');

    // 지붕 위 리본
    g.fillStyle = '#ff7fae';
    g.beginPath();
    g.moveTo(0, roofTop + 6);
    g.bezierCurveTo(-24, roofTop - 6, -30, roofTop + 16, -6, roofTop + 12);
    g.bezierCurveTo(-26, roofTop + 26, -14, roofTop + 34, 0, roofTop + 12);
    g.closePath();
    g.fill();
    g.beginPath();
    g.moveTo(0, roofTop + 6);
    g.bezierCurveTo(24, roofTop - 6, 30, roofTop + 16, 6, roofTop + 12);
    g.bezierCurveTo(26, roofTop + 26, 14, roofTop + 34, 0, roofTop + 12);
    g.closePath();
    g.fill();
    g.fillStyle = '#ffb3d1';
    circ(g, 0, roofTop + 10, 5);
    g.fill();

    // 문가 화분
    g.save();
    g.translate(-128, 0);
    furnPlant(g, t);
    g.restore();
    g.save();
    g.translate(128, 0);
    g.scale(0.85, 0.85);
    furnPlant(g, t);
    g.restore();

    // 과자집 팻말
    g.save();
    g.translate(-150, -6);
    g.fillStyle = '#c98f68';
    rr(g, -3, -46, 6, 46, 3);
    g.fill();
    g.fillStyle = '#fffdf8';
    rr(g, -46, -68, 92, 26, 8);
    g.fill();
    g.strokeStyle = '#ffb7d0';
    g.lineWidth = 3;
    rr(g, -46, -68, 92, 26, 8);
    g.stroke();
    g.fillStyle = '#b0708f';
    g.font = 'bold 15px "Apple SD Gothic Neo","Malgun Gothic",system-ui,sans-serif';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText('엘리네 집', 0, -54);
    g.restore();

    g.restore();
  }

  /* ---------------- 동물 친구들 ---------------- */

  var ANIMAL = {
    rabbit: { body: '#fffdfd', body2: '#ffe4ee', inner: '#ffc2d8', nose: '#ff8fb0', ear: 'long' },
    bear: { body: '#d09a68', body2: '#b87a45', inner: '#f6dfc6', nose: '#6b4326', ear: 'round' },
    cat: { body: '#ffe8c9', body2: '#f4d0a6', inner: '#ffc0cc', nose: '#ff8fb0', ear: 'pointy' },
    chick: { body: '#ffe066', body2: '#ffc92e', inner: '#ffe066', nose: '#ff9f1c', ear: 'none' }
  };

  function drawAnimal(g, kind, cx, baseY, scale, t, face) {
    var a = ANIMAL[kind] || ANIMAL.rabbit;
    var bob = Math.sin((t || 0) * 2.2 + cx * 0.1) * 1.4;
    g.save();
    g.translate(cx, baseY + bob);
    g.scale(scale || 1, scale || 1);
    shadow(g, 0, 2 - bob, 13, 4.5, 0.16);

    // 발
    g.fillStyle = a.body2;
    ell(g, -7, -1, 4.4, 2.8);
    g.fill();
    ell(g, 7, -1, 4.4, 2.8);
    g.fill();

    // 몸통
    var bg = g.createLinearGradient(0, -26, 0, 2);
    bg.addColorStop(0, a.body);
    bg.addColorStop(1, a.body2);
    ell(g, 0, -12, 12.5, 12.5);
    g.fillStyle = bg;
    g.fill();
    g.strokeStyle = 'rgba(160,120,140,.22)';
    g.lineWidth = 1.2;
    g.stroke();
    // 배
    g.fillStyle = 'rgba(255,255,255,.65)';
    ell(g, 0, -8, 7, 7.5);
    g.fill();

    // 팔
    g.fillStyle = a.body2;
    ell(g, -12, -13, 3.6, 5);
    g.fill();
    ell(g, 12, -13, 3.6, 5);
    g.fill();

    // 귀
    g.fillStyle = a.body;
    if (a.ear === 'long') {
      g.save();
      g.translate(-5.5, -34);
      g.rotate(-0.18);
      rr(g, -3.4, -17, 6.8, 20, 3.4);
      g.fill();
      g.restore();
      g.save();
      g.translate(5.5, -34);
      g.rotate(0.18);
      rr(g, -3.4, -17, 6.8, 20, 3.4);
      g.fill();
      g.restore();
      g.fillStyle = a.inner;
      g.save();
      g.translate(-5.5, -34);
      g.rotate(-0.18);
      rr(g, -1.5, -14, 3, 15, 1.6);
      g.fill();
      g.restore();
      g.save();
      g.translate(5.5, -34);
      g.rotate(0.18);
      rr(g, -1.5, -14, 3, 15, 1.6);
      g.fill();
      g.restore();
    } else if (a.ear === 'round') {
      circ(g, -8.5, -32, 5.4);
      g.fill();
      circ(g, 8.5, -32, 5.4);
      g.fill();
      g.fillStyle = a.inner;
      circ(g, -8.5, -32, 2.8);
      g.fill();
      circ(g, 8.5, -32, 2.8);
      g.fill();
    } else if (a.ear === 'pointy') {
      g.beginPath();
      g.moveTo(-10, -30);
      g.lineTo(-12.5, -42);
      g.lineTo(-3, -33);
      g.closePath();
      g.fill();
      g.beginPath();
      g.moveTo(10, -30);
      g.lineTo(12.5, -42);
      g.lineTo(3, -33);
      g.closePath();
      g.fill();
      g.fillStyle = a.inner;
      g.beginPath();
      g.moveTo(-9, -31);
      g.lineTo(-10.5, -38.5);
      g.lineTo(-5.5, -33);
      g.closePath();
      g.fill();
      g.beginPath();
      g.moveTo(9, -31);
      g.lineTo(10.5, -38.5);
      g.lineTo(5.5, -33);
      g.closePath();
      g.fill();
    } else {
      // 병아리 머리 털
      g.strokeStyle = a.body2;
      g.lineWidth = 2.6;
      g.lineCap = 'round';
      g.beginPath();
      g.moveTo(-2, -36); g.lineTo(-3, -41);
      g.moveTo(1, -36); g.lineTo(2, -42);
      g.stroke();
    }

    // 머리
    var hg = g.createRadialGradient(-3, -31, 2, 0, -27, 14);
    hg.addColorStop(0, a.body);
    hg.addColorStop(1, a.body2);
    circ(g, 0, -27, 11.5);
    g.fillStyle = hg;
    g.fill();
    g.strokeStyle = 'rgba(160,120,140,.2)';
    g.lineWidth = 1.2;
    g.stroke();

    // 얼굴
    if (kind === 'chick') {
      g.fillStyle = a.nose;
      g.beginPath();
      g.moveTo(-3.4, -25);
      g.lineTo(3.4, -25);
      g.lineTo(0, -20.5);
      g.closePath();
      g.fill();
      g.fillStyle = '#5a4636';
      circ(g, -4.6, -29, 1.5);
      g.fill();
      circ(g, 4.6, -29, 1.5);
      g.fill();
      g.fillStyle = 'rgba(255,255,255,.9)';
      circ(g, -5.1, -29.6, 0.6);
      g.fill();
      circ(g, 4.1, -29.6, 0.6);
      g.fill();
      g.fillStyle = 'rgba(255,150,170,.5)';
      ell(g, -8, -24, 2.6, 1.7);
      g.fill();
      ell(g, 8, -24, 2.6, 1.7);
      g.fill();
    } else {
      // 눈
      g.fillStyle = '#4a3a30';
      circ(g, -4.2, -29.5, 1.75);
      g.fill();
      circ(g, 4.2, -29.5, 1.75);
      g.fill();
      g.fillStyle = '#fff';
      circ(g, -4.8, -30.2, 0.7);
      g.fill();
      circ(g, 3.6, -30.2, 0.7);
      g.fill();
      // 볼
      g.fillStyle = 'rgba(255,150,175,.45)';
      ell(g, -7.6, -25.6, 2.7, 1.7);
      g.fill();
      ell(g, 7.6, -25.6, 2.7, 1.7);
      g.fill();
      // 코와 입
      g.fillStyle = a.nose;
      ell(g, 0, -24.4, 2, 1.5);
      g.fill();
      g.strokeStyle = '#6b4a3a';
      g.lineWidth = 1;
      g.lineCap = 'round';
      g.beginPath();
      g.arc(0, -22.4, 1.7, 0.2, Math.PI - 0.2);
      g.stroke();
      // 수염 (고양이)
      if (kind === 'cat') {
        g.strokeStyle = 'rgba(120,90,70,.55)';
        g.lineWidth = 0.9;
        g.beginPath();
        g.moveTo(-7, -24); g.lineTo(-14, -25.5);
        g.moveTo(-7, -22.6); g.lineTo(-14, -21.6);
        g.moveTo(7, -24); g.lineTo(14, -25.5);
        g.moveTo(7, -22.6); g.lineTo(14, -21.6);
        g.stroke();
      }
    }

    // 꼬리
    if (kind === 'cat') {
      g.strokeStyle = a.body2;
      g.lineWidth = 3.4;
      g.lineCap = 'round';
      g.beginPath();
      g.moveTo(11, -8);
      g.quadraticCurveTo(20, -12, 17, -22);
      g.stroke();
    } else if (kind === 'rabbit') {
      g.fillStyle = '#fff';
      circ(g, 12, -8, 4);
      g.fill();
    } else if (kind === 'bear') {
      g.fillStyle = a.body2;
      circ(g, 12, -9, 3.2);
      g.fill();
    }

    g.restore();
  }

  /* ---------------- 엘리(플레이어) ---------------- */

  function drawGirl(g, cx, baseY, scale, t, walking, face, dirX) {
    g.save();
    g.translate(cx, baseY);
    g.scale(scale || 1, scale || 1);
    var step = walking ? Math.sin((t || 0) * 11) : 0;
    var bob = walking ? Math.abs(Math.sin((t || 0) * 11)) * 1.6 : Math.sin((t || 0) * 2) * 0.7;
    g.translate(0, -bob);
    var mir = face === 'left' ? -1 : 1;
    g.scale(mir, 1);

    shadow(g, 0, 2 + bob, 12, 4.2, 0.18);

    // 다리
    g.fillStyle = '#ffe0c8';
    rr(g, -6.5 + step * 2.2, -13, 5.2, 13, 2.6);
    g.fill();
    rr(g, 1.3 - step * 2.2, -13, 5.2, 13, 2.6);
    g.fill();
    // 신발
    g.fillStyle = '#ff7fae';
    rr(g, -7.6 + step * 2.2, -3.4, 7, 4.4, 2.2);
    g.fill();
    rr(g, 0.6 - step * 2.2, -3.4, 7, 4.4, 2.2);
    g.fill();

    // 드레스
    var dg = g.createLinearGradient(0, -32, 0, -8);
    dg.addColorStop(0, '#ffd0e4');
    dg.addColorStop(0.6, '#ffa8cc');
    dg.addColorStop(1, '#ff86b5');
    g.beginPath();
    g.moveTo(-7, -32);
    g.lineTo(7, -32);
    g.quadraticCurveTo(13, -18, 15, -10);
    g.quadraticCurveTo(0, -4, -15, -10);
    g.quadraticCurveTo(-13, -18, -7, -32);
    g.closePath();
    g.fillStyle = dg;
    g.fill();
    // 드레스 물방울 무늬
    g.fillStyle = 'rgba(255,255,255,.7)';
    var dots = [[-6, -16], [2, -13], [7, -19], [-2, -24], [-9, -11]];
    for (var i = 0; i < dots.length; i++) {
      circ(g, dots[i][0], dots[i][1], 1.5);
      g.fill();
    }
    // 하얀 깃
    g.fillStyle = '#fffdf8';
    g.beginPath();
    g.moveTo(-7, -32);
    g.lineTo(0, -26);
    g.lineTo(7, -32);
    g.closePath();
    g.fill();
    // 리본
    g.fillStyle = '#ff5f86';
    g.beginPath();
    g.moveTo(0, -31);
    g.bezierCurveTo(-8, -37, -9, -28, -1, -29);
    g.bezierCurveTo(-8, -25, -4, -21, 0, -29);
    g.closePath();
    g.fill();
    g.beginPath();
    g.moveTo(0, -31);
    g.bezierCurveTo(8, -37, 9, -28, 1, -29);
    g.bezierCurveTo(8, -25, 4, -21, 0, -29);
    g.closePath();
    g.fill();

    // 팔
    g.fillStyle = '#ffe0c8';
    g.save();
    g.translate(10, -28);
    g.rotate(0.35 + step * 0.15);
    rr(g, -2.4, 0, 4.8, 13, 2.4);
    g.fill();
    g.restore();
    g.save();
    g.translate(-10, -28);
    g.rotate(-0.35 - step * 0.15);
    rr(g, -2.4, 0, 4.8, 13, 2.4);
    g.fill();
    g.restore();

    // 머리
    g.fillStyle = '#ffe3cc';
    circ(g, 0, -43, 11.5);
    g.fill();
    // 머리카락
    g.fillStyle = '#8a5a3b';
    g.beginPath();
    g.arc(0, -43, 12.2, Math.PI * 1.03, Math.PI * 1.97);
    g.closePath();
    g.fill();
    g.beginPath();
    g.moveTo(-12, -44);
    g.quadraticCurveTo(-13, -36, -8, -33);
    g.quadraticCurveTo(-10, -40, -6, -42);
    g.closePath();
    g.fill();
    g.beginPath();
    g.moveTo(12, -44);
    g.quadraticCurveTo(13, -36, 8, -33);
    g.quadraticCurveTo(10, -40, 6, -42);
    g.closePath();
    g.fill();
    // 앞머리
    g.beginPath();
    g.moveTo(-11, -47);
    g.quadraticCurveTo(-6, -54, 0, -52);
    g.quadraticCurveTo(7, -54, 11, -47);
    g.quadraticCurveTo(6, -49, 0, -47);
    g.quadraticCurveTo(-6, -49, -11, -47);
    g.closePath();
    g.fill();
    // 양갈래 머리
    g.fillStyle = '#8a5a3b';
    ell(g, -13.5, -38, 4.6, 6.4);
    g.fill();
    ell(g, 13.5, -38, 4.6, 6.4);
    g.fill();
    g.fillStyle = '#ff7fae';
    circ(g, -12.4, -44, 2.1);
    g.fill();
    circ(g, 12.4, -44, 2.1);
    g.fill();

    // 얼굴
    if (face !== 'up') {
      g.fillStyle = '#4a3327';
      ell(g, -4.2, -43.5, 1.7, 2.1);
      g.fill();
      ell(g, 4.2, -43.5, 1.7, 2.1);
      g.fill();
      g.fillStyle = '#fff';
      circ(g, -4.7, -44.4, 0.7);
      g.fill();
      circ(g, 3.7, -44.4, 0.7);
      g.fill();
      g.fillStyle = 'rgba(255,140,170,.5)';
      ell(g, -7.4, -40, 2.5, 1.6);
      g.fill();
      ell(g, 7.4, -40, 2.5, 1.6);
      g.fill();
      g.strokeStyle = '#b4586f';
      g.lineWidth = 1;
      g.lineCap = 'round';
      g.beginPath();
      g.arc(0, -39.2, 1.9, 0.3, Math.PI - 0.3);
      g.stroke();
    }

    g.restore();
  }

  /* ---------------- 구름, 반짝이, 별 ---------------- */

  function drawCloud(g, cx, cy, s, alpha) {
    g.save();
    g.globalAlpha = alpha == null ? 0.5 : alpha;
    var puffs = [[-s * 0.9, 0, s * 0.55], [-s * 0.2, -s * 0.32, s * 0.7], [s * 0.62, -s * 0.1, s * 0.6], [s * 1.15, s * 0.1, s * 0.42]];
    for (var i = 0; i < puffs.length; i++) {
      var pg = g.createRadialGradient(cx + puffs[i][0] - 4, cy + puffs[i][1] - 5, 2, cx + puffs[i][0], cy + puffs[i][1], puffs[i][2]);
      pg.addColorStop(0, '#ffffff');
      pg.addColorStop(1, '#ffe4f1');
      circ(g, cx + puffs[i][0], cy + puffs[i][1], puffs[i][2]);
      g.fillStyle = pg;
      g.fill();
    }
    g.restore();
  }

  function drawCoin(g, cx, cy, r) {
    g.save();
    var cg = g.createRadialGradient(cx - r * 0.3, cy - r * 0.35, r * 0.1, cx, cy, r);
    cg.addColorStop(0, '#fff6c0');
    cg.addColorStop(0.6, '#ffd85e');
    cg.addColorStop(1, '#f0a92a');
    circ(g, cx, cy, r);
    g.fillStyle = cg;
    g.fill();
    g.strokeStyle = 'rgba(214,150,20,.6)';
    g.lineWidth = Math.max(1, r * 0.14);
    g.stroke();
    starPath(g, cx, cy, r * 0.62, r * 0.28, 5);
    g.fillStyle = 'rgba(255,255,255,.95)';
    g.fill();
    g.restore();
  }

  function drawSparkle(g, cx, cy, s, alpha, rot) {
    g.save();
    g.globalAlpha = alpha == null ? 1 : alpha;
    g.translate(cx, cy);
    g.rotate(rot || 0);
    starPath(g, 0, 0, s, s * 0.22, 4);
    g.fillStyle = '#fffbe0';
    g.fill();
    g.restore();
  }

  function drawMarker(g, cx, cy, t) {
    var bob = Math.sin((t || 0) * 3) * 2.5;
    g.save();
    g.translate(cx, cy + bob);
    g.fillStyle = 'rgba(255,255,255,.95)';
    rr(g, -12, -13, 24, 21, 7);
    g.fill();
    g.strokeStyle = '#ffc0d8';
    g.lineWidth = 2;
    g.stroke();
    g.beginPath();
    g.moveTo(-4, 8);
    g.lineTo(0, 14);
    g.lineTo(4, 8);
    g.closePath();
    g.fillStyle = 'rgba(255,255,255,.95)';
    g.fill();
    starPath(g, 0, -2.5, 8, 3.4, 5);
    g.fillStyle = '#ffcf4d';
    g.fill();
    g.restore();
  }

  /* ---------------- 인트로 그림 ---------------- */

  function drawIntroScene(g, w, h, t) {
    var sky = g.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, '#ffe9f5');
    sky.addColorStop(0.5, '#ffdcec');
    sky.addColorStop(0.72, '#eef7dc');
    sky.addColorStop(1, '#dcf2cd');
    g.fillStyle = sky;
    g.fillRect(0, 0, w, h);
    // 해
    var sg = g.createRadialGradient(w * 0.82, h * 0.16, 4, w * 0.82, h * 0.16, 70);
    sg.addColorStop(0, 'rgba(255,240,170,.95)');
    sg.addColorStop(1, 'rgba(255,240,170,0)');
    circ(g, w * 0.82, h * 0.16, 70);
    g.fillStyle = sg;
    g.fill();
    drawCloud(g, w * 0.18, h * 0.13, 24, 0.9);
    drawCloud(g, w * 0.52, h * 0.07, 17, 0.7);
    drawCloud(g, w * 0.93, h * 0.32, 15, 0.6);
    // 땅
    g.fillStyle = '#c9e9b8';
    g.beginPath();
    g.moveTo(0, h * 0.72);
    g.quadraticCurveTo(w * 0.5, h * 0.67, w, h * 0.72);
    g.lineTo(w, h);
    g.lineTo(0, h);
    g.closePath();
    g.fill();
    g.fillStyle = '#bfe2ad';
    for (var i = 0; i < 30; i++) {
      var fx = (i * 53 % w) + 6;
      var fy = h * 0.76 + ((i * 37) % (h * 0.22));
      g.fillStyle = i % 3 ? '#b3d9a0' : '#ffd0e2';
      circ(g, fx, fy, 2.2);
      g.fill();
    }

    function at(x, y, s, fn) {
      g.save();
      g.translate(x, y);
      g.scale(s, s);
      fn();
      g.restore();
    }

    at(w * 0.07, h * 1.0, 1.9, function () { drawLollipopTree(g, 0, 0, 0, t); });
    at(w * 0.94, h * 1.0, 1.9, function () { drawLollipopTree(g, 0, 0, 1, t); });
    at(w * 0.22, h * 1.02, 1.4, function () { drawCottonBush(g, 0, 0, 0, t); });
    at(w * 0.5, h * 1.0, 0.74, function () { drawHouse(g, 0, 0, 1, t); });
    at(w * 0.26, h * 0.99, 1.55, function () { drawAnimal(g, 'rabbit', 0, 0, 1, t, 'right'); });
    at(w * 0.77, h * 0.99, 1.55, function () { drawAnimal(g, 'bear', 0, 0, 1, t, 'left'); });
    at(w * 0.64, h * 1.0, 1.65, function () { drawGirl(g, 0, 0, 1, t, false, 'right'); });

    // 반짝이
    for (var s = 0; s < 6; s++) {
      var sx = w * (0.14 + s * 0.14);
      var sy = h * (0.18 + ((s * 17) % 32) / 100);
      drawSparkle(g, sx, sy, 3.4 + (s % 3), 0.5 + Math.sin(t * 2 + s) * 0.3);
    }
  }

  /* ================= 2차 업그레이드: 더 귀여운 친구들 · 실내 · 새 가구 ================= */

  function clamp01(v) { return v < 0 ? 0 : (v > 1 ? 1 : v); }

  function heart(g, cx, cy, s) {
    g.beginPath();
    g.moveTo(cx, cy + s * 0.72);
    g.bezierCurveTo(cx - s * 1.55, cy - s * 0.08, cx - s * 0.6, cy - s * 1.1, cx, cy - s * 0.34);
    g.bezierCurveTo(cx + s * 0.6, cy - s * 1.1, cx + s * 1.55, cy - s * 0.08, cx, cy + s * 0.72);
    g.closePath();
  }

  function bowTie(g, x, y, s, c1, c2) {
    g.save();
    g.translate(x, y);
    g.fillStyle = c1;
    g.beginPath();
    g.moveTo(0, 0);
    g.bezierCurveTo(-s * 1.2, -s * 0.95, -s * 1.6, s * 0.6, -s * 0.12, s * 0.28);
    g.closePath();
    g.fill();
    g.beginPath();
    g.moveTo(0, 0);
    g.bezierCurveTo(s * 1.2, -s * 0.95, s * 1.6, s * 0.6, s * 0.12, s * 0.28);
    g.closePath();
    g.fill();
    g.fillStyle = c2;
    circ(g, 0, s * 0.06, s * 0.34);
    g.fill();
    g.fillStyle = 'rgba(255,255,255,.72)';
    circ(g, -s * 0.62, -s * 0.3, s * 0.15);
    g.fill();
    circ(g, s * 0.62, -s * 0.3, s * 0.15);
    g.fill();
    g.restore();
  }

  function cuteEyes(g, d, y, r, lash) {
    var grd = g.createLinearGradient(0, y - r, 0, y + r);
    grd.addColorStop(0, '#5c4134');
    grd.addColorStop(1, '#2f211a');
    g.fillStyle = grd;
    ell(g, -d, y, r * 0.88, r);
    g.fill();
    ell(g, d, y, r * 0.88, r);
    g.fill();
    g.fillStyle = 'rgba(255,255,255,.97)';
    circ(g, -d - r * 0.28, y - r * 0.34, r * 0.44);
    g.fill();
    circ(g, d - r * 0.28, y - r * 0.34, r * 0.44);
    g.fill();
    g.fillStyle = 'rgba(255,255,255,.62)';
    circ(g, -d + r * 0.4, y + r * 0.42, r * 0.19);
    g.fill();
    circ(g, d + r * 0.4, y + r * 0.42, r * 0.19);
    g.fill();
    if (lash) {
      g.strokeStyle = 'rgba(92,65,52,.75)';
      g.lineWidth = Math.max(0.9, r * 0.18);
      g.lineCap = 'round';
      g.beginPath();
      g.moveTo(-d - r * 0.95, y - r * 0.66);
      g.lineTo(-d - r * 1.35, y - r * 1.05);
      g.moveTo(d + r * 0.95, y - r * 0.66);
      g.lineTo(d + r * 1.35, y - r * 1.05);
      g.stroke();
    }
  }

  function cheeks(g, d, y, s) {
    g.fillStyle = 'rgba(255,150,180,.42)';
    ell(g, -d, y, s, s * 0.64);
    g.fill();
    ell(g, d, y, s, s * 0.64);
    g.fill();
    g.strokeStyle = 'rgba(255,126,162,.42)';
    g.lineWidth = 0.9;
    g.lineCap = 'round';
    g.beginPath();
    g.moveTo(-d - s * 0.4, y + s * 0.16); g.lineTo(-d - s * 0.7, y - s * 0.24);
    g.moveTo(d + s * 0.4, y + s * 0.16); g.lineTo(d + s * 0.7, y - s * 0.24);
    g.stroke();
  }

  function sweetCookie(g, t) {
    g.save();
    var bg = g.createRadialGradient(-4, -4, 2, 0, 1, 15);
    bg.addColorStop(0, '#eec189');
    bg.addColorStop(0.7, '#d9a05e');
    bg.addColorStop(1, '#bf8343');
    circ(g, 0, 1, 13);
    g.fillStyle = bg;
    g.fill();
    g.strokeStyle = 'rgba(150,100,55,.5)';
    g.lineWidth = 1.2;
    g.stroke();
    g.fillStyle = '#5c3a22';
    var chips = [[-5, -4], [4, -3], [-1, 5], [6, 6], [-7, 4], [1, -7]];
    for (var i = 0; i < chips.length; i++) {
      ell(g, chips[i][0], chips[i][1] + 1, 1.9, 1.7);
      g.fill();
    }
    g.globalAlpha = 0.55;
    g.fillStyle = '#fff';
    ell(g, -5, -3.4, 3, 1.8);
    g.fill();
    g.restore();
  }

  function sweetCupcake(g, t) {
    g.save();
    // 컵
    g.beginPath();
    g.moveTo(-9, 1);
    g.lineTo(9, 1);
    g.lineTo(6.4, 14);
    g.lineTo(-6.4, 14);
    g.closePath();
    var cg = g.createLinearGradient(0, 1, 0, 14);
    cg.addColorStop(0, '#ffd6ea');
    cg.addColorStop(1, '#ff9ec4');
    g.fillStyle = cg;
    g.fill();
    g.strokeStyle = 'rgba(214,120,158,.4)';
    g.lineWidth = 1;
    for (var i = -1; i <= 1; i++) {
      g.beginPath();
      g.moveTo(i * 4.6 - 1.6, 2);
      g.lineTo(i * 3.4 - 0.6, 13);
      g.stroke();
    }
    // 크림
    var puffs = [[-6, -3, 6], [0, -7, 7.4], [6, -3, 6], [0, 0, 6.4]];
    for (var p = 0; p < puffs.length; p++) {
      var pg = g.createRadialGradient(puffs[p][0] - 1.6, puffs[p][1] - 2, 1, puffs[p][0], puffs[p][1], puffs[p][2]);
      pg.addColorStop(0, '#fffaf2');
      pg.addColorStop(1, '#ffd9e8');
      circ(g, puffs[p][0], puffs[p][1], puffs[p][2]);
      g.fillStyle = pg;
      g.fill();
    }
    g.fillStyle = '#ff5f86';
    circ(g, 0, -12.4, 3.2);
    g.fill();
    g.fillStyle = '#6fcf7f';
    ell(g, 1.8, -14.6, 2.4, 1.2);
    g.fill();
    g.restore();
  }

  /* ---------- 동물 친구 v2 (더 귀엽게) ---------- */

  function drawAnimal2(g, kind, cx, baseY, scale, t, face) {
    var a = ANIMAL[kind] || ANIMAL.rabbit;
    var tt = t || 0;
    var seed = cx * 0.09 + baseY * 0.02;
    var bob = Math.sin(tt * 2.2 + seed) * 1.3;
    var breath = 1 + Math.sin(tt * 2.6 + seed) * 0.022;
    var swing = Math.sin(tt * 2.4 + seed);
    g.save();
    g.translate(cx, baseY + bob);
    g.scale(scale || 1, scale || 1);
    shadow(g, 0, 2 - bob, 14, 5, 0.17);
    g.scale(1, breath);

    // 발
    g.fillStyle = a.body2;
    ell(g, -7, -1, 4.8, 3);
    g.fill();
    ell(g, 7, -1, 4.8, 3);
    g.fill();

    // 꼬리 (몸 뒤)
    if (kind === 'rabbit') {
      g.fillStyle = '#ffffff';
      circ(g, 12.6, -9, 4.4);
      g.fill();
      g.fillStyle = 'rgba(255,222,236,.85)';
      circ(g, 12.6, -9, 2.5);
      g.fill();
    } else if (kind === 'cat') {
      g.strokeStyle = a.body2;
      g.lineWidth = 3.6;
      g.lineCap = 'round';
      g.beginPath();
      g.moveTo(11, -8);
      g.quadraticCurveTo(20 + swing * 3, -14, 16 - swing * 3.2, -24);
      g.stroke();
    } else if (kind === 'bear') {
      g.fillStyle = a.body2;
      circ(g, 12, -9, 3.4);
      g.fill();
    }

    // 몸통
    var bg = g.createLinearGradient(0, -26, 0, 2);
    bg.addColorStop(0, a.body);
    bg.addColorStop(1, a.body2);
    ell(g, 0, -12, 12.8, 12.8);
    g.fillStyle = bg;
    g.fill();
    g.strokeStyle = 'rgba(160,120,140,.22)';
    g.lineWidth = 1.2;
    g.stroke();
    g.fillStyle = 'rgba(255,255,255,.62)';
    ell(g, 0, -8, 7.4, 7.8);
    g.fill();

    // 팔
    g.fillStyle = a.body2;
    ell(g, -12.2, -13, 3.8, 5.2);
    g.fill();
    ell(g, 12.2, -13, 3.8, 5.2);
    g.fill();
    g.fillStyle = 'rgba(255,255,255,.34)';
    ell(g, -12.2, -15, 1.5, 1.9);
    g.fill();
    ell(g, 12.2, -15, 1.5, 1.9);
    g.fill();

    // 몸 장식
    if (kind === 'bear') {
      bowTie(g, 0, -21, 4.2, '#9fe4b4', '#5cbb7d');
    } else if (kind === 'cat') {
      g.strokeStyle = '#ff7fae';
      g.lineWidth = 3;
      g.lineCap = 'round';
      g.beginPath();
      g.moveTo(-9.4, -21);
      g.quadraticCurveTo(0, -18, 9.4, -21);
      g.stroke();
      g.fillStyle = '#ffd45c';
      circ(g, 0, -18.6, 2.7);
      g.fill();
      g.fillStyle = '#e2a01c';
      circ(g, 0, -18.6, 1.1);
      g.fill();
    }

    // 귀
    if (a.ear === 'long') {
      for (var e = 0; e < 2; e++) {
        var dir = e ? 1 : -1;
        g.save();
        g.translate(dir * 5.6, -33);
        g.rotate(dir * 0.16 + swing * 0.055 * dir);
        g.fillStyle = a.body;
        rr(g, -3.7, -18, 7.4, 21, 3.7);
        g.fill();
        g.strokeStyle = 'rgba(200,160,180,.35)';
        g.lineWidth = 1;
        g.stroke();
        g.fillStyle = a.inner;
        rr(g, -1.7, -15, 3.4, 16, 1.7);
        g.fill();
        if (dir > 0) bowTie(g, 1.4, 2.4, 3.1, '#ff9ec4', '#f4719f');
        g.restore();
      }
      // 꽃 한 송이
      g.fillStyle = '#fff3b0';
      for (var f = 0; f < 5; f++) {
        var fa = (f / 5) * TAU;
        circ(g, -9.4 + Math.cos(fa) * 2.4, -35.4 + Math.sin(fa) * 2.4, 1.9);
        g.fill();
      }
      g.fillStyle = '#ffab3d';
      circ(g, -9.4, -35.4, 1.5);
      g.fill();
    } else if (a.ear === 'round') {
      for (var e2 = 0; e2 < 2; e2++) {
        var d2 = e2 ? 1 : -1;
        g.fillStyle = a.body;
        circ(g, d2 * 8.6, -32, 5.6);
        g.fill();
        g.fillStyle = a.inner;
        circ(g, d2 * 8.6, -32, 2.9);
        g.fill();
      }
    } else if (a.ear === 'pointy') {
      var pw = swing * 0.06;
      g.fillStyle = a.body;
      g.beginPath();
      g.moveTo(-10, -30); g.lineTo(-13.4 - pw * 6, -43); g.lineTo(-2.6, -33.4);
      g.closePath(); g.fill();
      g.beginPath();
      g.moveTo(10, -30); g.lineTo(13.4 + pw * 6, -43); g.lineTo(2.6, -33.4);
      g.closePath(); g.fill();
      g.fillStyle = a.inner;
      g.beginPath();
      g.moveTo(-8.8, -31.4); g.lineTo(-10.6 - pw * 4, -39.4); g.lineTo(-5.4, -33.6);
      g.closePath(); g.fill();
      g.beginPath();
      g.moveTo(8.8, -31.4); g.lineTo(10.6 + pw * 4, -39.4); g.lineTo(5.4, -33.6);
      g.closePath(); g.fill();
      // 고양이 리본
      bowTie(g, 0, -50.5, 3.4, '#ffd45c', '#f0a92a');
    } else {
      g.strokeStyle = a.body2;
      g.lineWidth = 2.6;
      g.lineCap = 'round';
      g.beginPath();
      g.moveTo(-2.4, -36); g.lineTo(-3.4, -41.4);
      g.moveTo(1, -36); g.lineTo(2, -42.4);
      g.stroke();
      // 병아리 꽃핀
      g.fillStyle = '#ffd6e8';
      for (var pf = 0; pf < 5; pf++) {
        var pa = (pf / 5) * TAU;
        circ(g, 8 + Math.cos(pa) * 2.2, -37 + Math.sin(pa) * 2.2, 1.7);
        g.fill();
      }
      g.fillStyle = '#ff9ec4';
      circ(g, 8, -37, 1.4);
      g.fill();
    }

    // 머리
    var hg = g.createRadialGradient(-3, -31, 2, 0, -27.5, 14.5);
    hg.addColorStop(0, a.body);
    hg.addColorStop(1, a.body2);
    circ(g, 0, -27.5, 11.8);
    g.fillStyle = hg;
    g.fill();
    g.strokeStyle = 'rgba(160,120,140,.2)';
    g.lineWidth = 1.2;
    g.stroke();

    // 얼굴
    if (kind === 'chick') {
      cuteEyes(g, 4.4, -29, 1.9, false);
      g.fillStyle = a.nose;
      g.beginPath();
      g.moveTo(-3.4, -25.2);
      g.lineTo(3.4, -25.2);
      g.lineTo(0, -20.6);
      g.closePath();
      g.fill();
      cheeks(g, 7.8, -24.4, 2.5);
      g.fillStyle = 'rgba(255,255,255,.5)';
      circ(g, 0, -22.6, 0.9);
      g.fill();
    } else {
      cuteEyes(g, 4.4, -29.2, 2.1, true);
      cheeks(g, 7.6, -25.4, 2.7);
      g.fillStyle = a.nose;
      ell(g, 0, -24.4, 2.1, 1.55);
      g.fill();
      g.strokeStyle = '#7a5442';
      g.lineWidth = 1.05;
      g.lineCap = 'round';
      g.beginPath();
      g.arc(0, -22.8, 1.8, 0.22, Math.PI - 0.22);
      g.stroke();
      if (kind === 'cat') {
        g.strokeStyle = 'rgba(120,90,70,.5)';
        g.lineWidth = 0.9;
        g.beginPath();
        g.moveTo(-7, -24.4); g.lineTo(-14.4, -25.8);
        g.moveTo(-7, -23); g.lineTo(-14.4, -22);
        g.moveTo(7, -24.4); g.lineTo(14.4, -25.8);
        g.moveTo(7, -23); g.lineTo(14.4, -22);
        g.stroke();
      }
      if (kind === 'rabbit') {
        g.strokeStyle = 'rgba(255,255,255,.6)';
        g.lineWidth = 1;
        g.beginPath();
        g.moveTo(-5.6, -32.4); g.lineTo(-7.4, -34.4);
        g.moveTo(5.6, -32.4); g.lineTo(7.4, -34.4);
        g.stroke();
      }
    }

    g.restore();
  }

  /* ---------- 엘리 v2 ---------- */

  function drawGirl2(g, cx, baseY, scale, t, walking, face, dirX) {
    var tt = t || 0;
    g.save();
    g.translate(cx, baseY);
    g.scale(scale || 1, scale || 1);
    var step = walking ? Math.sin(tt * 11) : 0;
    var bob = walking ? Math.abs(Math.sin(tt * 11)) * 1.7 : Math.sin(tt * 2) * 0.75;
    g.translate(0, -bob);
    var mir = face === 'left' ? -1 : 1;
    g.scale(mir, 1);
    var breath = 1 + Math.sin(tt * 2.3) * 0.012;
    g.scale(1, breath);

    shadow(g, 0, 2 + bob, 12.4, 4.3, 0.18);

    // 다리
    g.fillStyle = '#ffe0c8';
    rr(g, -6.5 + step * 2.2, -13, 5.2, 13, 2.6);
    g.fill();
    rr(g, 1.3 - step * 2.2, -13, 5.2, 13, 2.6);
    g.fill();
    // 신발
    g.fillStyle = '#ff7fae';
    rr(g, -7.6 + step * 2.2, -3.4, 7, 4.4, 2.2);
    g.fill();
    rr(g, 0.6 - step * 2.2, -3.4, 7, 4.4, 2.2);
    g.fill();
    g.fillStyle = 'rgba(255,255,255,.55)';
    circ(g, -4.6 + step * 2.2, -1.8, 1.3);
    g.fill();
    circ(g, 3.6 - step * 2.2, -1.8, 1.3);
    g.fill();

    // 드레스
    var dg = g.createLinearGradient(0, -32, 0, -8);
    dg.addColorStop(0, '#ffd7e9');
    dg.addColorStop(0.55, '#ffa8cc');
    dg.addColorStop(1, '#ff86b5');
    g.beginPath();
    g.moveTo(-7, -32);
    g.lineTo(7, -32);
    g.quadraticCurveTo(13, -18, 15.4, -10);
    g.quadraticCurveTo(0, -3.4, -15.4, -10);
    g.quadraticCurveTo(-13, -18, -7, -32);
    g.closePath();
    g.fillStyle = dg;
    g.fill();
    g.strokeStyle = 'rgba(226,132,168,.28)';
    g.lineWidth = 1;
    g.stroke();
    // 드레스 물방울 무늬
    g.fillStyle = 'rgba(255,255,255,.72)';
    var dots = [[-6, -16], [2, -13], [7, -19], [-2, -24], [-9, -11], [6, -9.6]];
    for (var i = 0; i < dots.length; i++) {
      circ(g, dots[i][0], dots[i][1], 1.5);
      g.fill();
    }
    // 드레스 단 (물결)
    g.fillStyle = '#fff4fa';
    g.beginPath();
    g.moveTo(-15, -10.4);
    g.quadraticCurveTo(-11, -6.4, -7.4, -9.6);
    g.quadraticCurveTo(-3.6, -12.6, 0, -9.2);
    g.quadraticCurveTo(3.6, -6.6, 7.4, -9.6);
    g.quadraticCurveTo(11, -12.4, 15, -8.4);
    g.quadraticCurveTo(0, -3, -15, -10.4);
    g.closePath();
    g.fill();
    // 하얀 깃
    g.fillStyle = '#fffdf8';
    g.beginPath();
    g.moveTo(-7, -32);
    g.lineTo(0, -26);
    g.lineTo(7, -32);
    g.closePath();
    g.fill();
    // 가슴 리본
    bowTie(g, 0, -28.4, 4.4, '#ff5f86', '#e8325f');

    // 팔
    g.fillStyle = '#ffe0c8';
    g.save();
    g.translate(10, -28);
    g.rotate(0.35 + step * 0.15);
    rr(g, -2.4, 0, 4.8, 13, 2.4);
    g.fill();
    g.restore();
    g.save();
    g.translate(-10, -28);
    g.rotate(-0.35 - step * 0.15);
    rr(g, -2.4, 0, 4.8, 13, 2.4);
    g.fill();
    g.restore();

    // 양갈래 머리 (뒤)
    g.fillStyle = '#8a5a3b';
    var sway = walking ? Math.sin(tt * 8) * 0.5 : Math.sin(tt * 1.6) * 0.24;
    ell(g, -13.6 + sway, -37.4, 4.8, 7);
    g.fill();
    ell(g, 13.6 - sway, -37.4, 4.8, 7);
    g.fill();

    // 머리
    g.fillStyle = '#ffe3cc';
    circ(g, 0, -43, 11.6);
    g.fill();

    // 머리카락
    g.fillStyle = '#8a5a3b';
    g.beginPath();
    g.arc(0, -43, 12.3, Math.PI * 1.02, Math.PI * 1.98);
    g.closePath();
    g.fill();
    g.beginPath();
    g.moveTo(-12, -45);
    g.quadraticCurveTo(-13.4, -37, -8.4, -33.4);
    g.quadraticCurveTo(-10.4, -40, -6, -42.4);
    g.closePath();
    g.fill();
    g.beginPath();
    g.moveTo(12, -45);
    g.quadraticCurveTo(13.4, -37, 8.4, -33.4);
    g.quadraticCurveTo(10.4, -40, 6, -42.4);
    g.closePath();
    g.fill();
    // 앞머리
    g.beginPath();
    g.moveTo(-11, -47.4);
    g.quadraticCurveTo(-6, -55, 0, -52.6);
    g.quadraticCurveTo(7, -55, 11, -47.4);
    g.quadraticCurveTo(6, -49.6, 0, -47.4);
    g.quadraticCurveTo(-6, -49.6, -11, -47.4);
    g.closePath();
    g.fill();
    // 머리 윤기
    g.fillStyle = 'rgba(255,255,255,.3)';
    ell(g, -5.4, -49.4, 3.6, 1.5);
    g.fill();
    // 양갈래 묶는 리본
    bowTie(g, -12.6, -43.4, 3.1, '#ff7fae', '#f4568c');
    bowTie(g, 12.6, -43.4, 3.1, '#ff7fae', '#f4568c');
    // 별 머리핀
    starPath(g, 8.4, -48.6, 3.4, 1.5, 5);
    g.fillStyle = '#ffd45c';
    g.fill();

    // 얼굴
    if (face !== 'up') {
      cuteEyes(g, 4.3, -43.4, 2.35, true);
      cheeks(g, 7.6, -39.6, 2.6);
      g.strokeStyle = '#c25a76';
      g.lineWidth = 1.05;
      g.lineCap = 'round';
      g.beginPath();
      g.arc(0, -39, 2, 0.3, Math.PI - 0.3);
      g.stroke();
      g.fillStyle = 'rgba(255,255,255,.75)';
      circ(g, 0, -36.6, 0.9);
      g.fill();
    }

    g.restore();
  }

  /* ---------- 꼬마 사람 친구들 ---------- */

  var KID = {
    momo: { skin: '#ffe4cd', skin2: '#f6cbaa', hair: '#ff8fb8', hair2: '#ef6f9f', dress: '#ffe79a', dress2: '#ffc94d', hem: '#fff6d2', shoes: '#ff8fb8', style: 'buns', acc: 'star' },
    luna: { skin: '#ffe6d5', skin2: '#f6d2bd', hair: '#c1a6f5', hair2: '#a686e6', dress: '#a8e6cf', dress2: '#78d4b2', hem: '#e9fff8', shoes: '#8fd8c4', style: 'long', acc: 'band' },
    haru: { skin: '#ffe0c8', skin2: '#f6cba9', hair: '#8a5a3b', hair2: '#6d4529', dress: '#a9d4ff', dress2: '#7fbcf5', hem: '#eaf5ff', shoes: '#6fa8e0', style: 'short', acc: 'cap' },
    bora: { skin: '#ffe8d8', skin2: '#f7d2bd', hair: '#f0a04a', hair2: '#d9822f', dress: '#d9bcff', dress2: '#bf9cf7', hem: '#f6eeff', shoes: '#b98cff', style: 'bob', acc: 'glasses' }
  };

  function drawKid(g, kind, cx, baseY, scale, t, walking, face) {
    var k = KID[kind] || KID.momo;
    var tt = t || 0;
    var seed = cx * 0.06 + 1.7;
    var step = walking ? Math.sin(tt * 11 + seed) : 0;
    var bob = walking ? Math.abs(Math.sin(tt * 11 + seed)) * 1.5 : Math.sin(tt * 2.1 + seed) * 0.6;
    g.save();
    g.translate(cx, baseY);
    g.scale(scale || 1, scale || 1);
    g.translate(0, -bob);
    var mir = face === 'left' ? -1 : 1;
    g.scale(mir, 1);
    g.scale(1, 1 + Math.sin(tt * 2.4 + seed) * 0.012);

    shadow(g, 0, 2 + bob, 11.4, 4, 0.17);

    // 다리
    g.fillStyle = k.skin2;
    rr(g, -6 + step * 2, -12, 4.6, 12, 2.3);
    g.fill();
    rr(g, 1.4 - step * 2, -12, 4.6, 12, 2.3);
    g.fill();
    g.fillStyle = k.shoes;
    rr(g, -7 + step * 2, -3.2, 6.6, 4.2, 2.1);
    g.fill();
    rr(g, 0.6 - step * 2, -3.2, 6.6, 4.2, 2.1);
    g.fill();

    // 옷
    var dg = g.createLinearGradient(0, -31, 0, -8);
    dg.addColorStop(0, k.dress);
    dg.addColorStop(1, k.dress2);
    g.beginPath();
    g.moveTo(-6.6, -31);
    g.lineTo(6.6, -31);
    g.quadraticCurveTo(11, -20, 12.4, -10);
    g.quadraticCurveTo(0, -5.2, -12.4, -10);
    g.quadraticCurveTo(-11, -20, -6.6, -31);
    g.closePath();
    g.fillStyle = dg;
    g.fill();
    g.strokeStyle = 'rgba(160,120,140,.2)';
    g.lineWidth = 1;
    g.stroke();
    // 옷 단
    g.fillStyle = k.hem;
    g.beginPath();
    g.moveTo(-12.2, -10.6);
    g.quadraticCurveTo(-8, -7.4, -4, -9.6);
    g.quadraticCurveTo(0, -11.6, 4, -9.6);
    g.quadraticCurveTo(8, -7.4, 12.2, -10.6);
    g.quadraticCurveTo(0, -5, -12.2, -10.6);
    g.closePath();
    g.fill();
    // 단추
    g.fillStyle = 'rgba(255,255,255,.8)';
    circ(g, 0, -24, 1.3);
    g.fill();
    circ(g, 0, -19.6, 1.3);
    g.fill();

    // 팔
    g.fillStyle = k.skin;
    g.save();
    g.translate(9.2, -28);
    g.rotate(0.34 + step * 0.16);
    rr(g, -2.2, 0, 4.4, 12, 2.2);
    g.fill();
    g.restore();
    g.save();
    g.translate(-9.2, -28);
    g.rotate(-0.34 - step * 0.16);
    rr(g, -2.2, 0, 4.4, 12, 2.2);
    g.fill();
    g.restore();

    // 뒤머리
    g.fillStyle = k.hair;
    if (k.style === 'long') {
      g.beginPath();
      g.moveTo(-10.6, -42);
      g.quadraticCurveTo(-15, -30, -11.2, -18.6);
      g.quadraticCurveTo(-4, -16, 0, -21.4);
      g.quadraticCurveTo(4, -16, 11.2, -18.6);
      g.quadraticCurveTo(15, -30, 10.6, -42);
      g.closePath();
      g.fill();
    } else if (k.style === 'bob') {
      g.beginPath();
      g.moveTo(-11.2, -42);
      g.quadraticCurveTo(-14.4, -32, -9.8, -28.4);
      g.quadraticCurveTo(0, -25, 9.8, -28.4);
      g.quadraticCurveTo(14.4, -32, 11.2, -42);
      g.closePath();
      g.fill();
    } else if (k.style === 'buns') {
      circ(g, -12.6, -45, 5);
      g.fill();
      circ(g, 12.6, -45, 5);
      g.fill();
      g.fillStyle = k.hair2;
      circ(g, -12.6, -45, 2.6);
      g.fill();
      circ(g, 12.6, -45, 2.6);
      g.fill();
      g.fillStyle = k.hair;
    }

    // 얼굴
    g.fillStyle = k.skin;
    circ(g, 0, -40.5, 10.6);
    g.fill();
    g.strokeStyle = 'rgba(180,140,160,.2)';
    g.lineWidth = 1;
    g.stroke();

    // 앞머리
    g.fillStyle = k.hair;
    g.beginPath();
    g.moveTo(-10.9, -41.4);
    g.quadraticCurveTo(-9.6, -50.8, 0, -50.8);
    g.quadraticCurveTo(9.6, -50.8, 10.9, -41.4);
    g.quadraticCurveTo(7.4, -46, 3.4, -44.2);
    g.quadraticCurveTo(0, -47.2, -3.4, -44.2);
    g.quadraticCurveTo(-7.4, -46, -10.9, -41.4);
    g.closePath();
    g.fill();
    g.fillStyle = 'rgba(255,255,255,.28)';
    ell(g, -4.4, -47.6, 3.2, 1.4);
    g.fill();
    g.fillStyle = k.hair;

    // 스타일별 머리 장식
    if (k.acc === 'cap') {
      g.fillStyle = '#ff7fae';
      g.beginPath();
      g.arc(0, -45.6, 10.6, Math.PI * 1.06, Math.PI * 1.94);
      g.closePath();
      g.fill();
      g.fillStyle = '#ff5f86';
      rr(g, 4.6, -47.4, 12.4, 4, 2);
      g.fill();
      g.fillStyle = '#fff';
      circ(g, -6, -49.6, 2.4);
      g.fill();
      g.fillStyle = '#ffd45c';
      starPath(g, -6, -49.6, 1.7, 0.8, 5);
      g.fill();
    } else if (k.acc === 'band') {
      g.strokeStyle = '#fff3b0';
      g.lineWidth = 3.2;
      g.lineCap = 'round';
      g.beginPath();
      g.arc(0, -41.4, 10.4, Math.PI * 1.12, Math.PI * 1.88);
      g.stroke();
      g.fillStyle = '#ffd45c';
      circ(g, 9.4, -46.4, 2);
      g.fill();
    } else if (k.acc === 'star') {
      starPath(g, 8.2, -47.8, 3.2, 1.4, 5);
      g.fillStyle = '#fff3b0';
      g.fill();
    }

    // 얼굴
    cuteEyes(g, 4, -41, 2.15, true);
    cheeks(g, 7.2, -37.6, 2.5);
    g.strokeStyle = '#b4566f';
    g.lineWidth = 1;
    g.lineCap = 'round';
    g.beginPath();
    g.arc(0, -36.8, 1.9, 0.3, Math.PI - 0.3);
    g.stroke();

    if (k.acc === 'glasses') {
      g.strokeStyle = 'rgba(110,170,210,.95)';
      g.lineWidth = 1.5;
      circ(g, -4, -41, 3.6);
      g.stroke();
      circ(g, 4, -41, 3.6);
      g.stroke();
      g.beginPath();
      g.moveTo(-0.6, -41);
      g.lineTo(0.6, -41);
      g.stroke();
      g.fillStyle = 'rgba(255,255,255,.45)';
      ell(g, -5.2, -42.4, 1.5, 0.9);
      g.fill();
    }

    g.restore();
  }

  /* ---------- 과자집 안 소품 ---------- */

  function drawCookieOven(g, cx, baseY, scale, t, heat) {
    var h = clamp01(heat || 0);
    var tt = t || 0;
    g.save();
    g.translate(cx, baseY);
    g.scale(scale || 1, scale || 1);
    shadow(g, 0, 2, 30, 8, 0.18);

    var bg = g.createLinearGradient(0, -66, 0, 0);
    bg.addColorStop(0, '#ecc094');
    bg.addColorStop(1, '#c98f63');
    rr(g, -30, -62, 60, 62, 14);
    g.fillStyle = bg;
    g.fill();
    g.strokeStyle = 'rgba(150,100,65,.4)';
    g.lineWidth = 1.6;
    g.stroke();

    g.strokeStyle = 'rgba(150,100,65,.2)';
    g.lineWidth = 1;
    for (var r = 0; r < 4; r++) {
      var yy = -50 + r * 13;
      g.beginPath();
      g.moveTo(-27, yy);
      g.lineTo(27, yy);
      g.stroke();
      for (var c2 = 0; c2 < 3; c2++) {
        var xx = -22 + c2 * 15 + (r % 2) * 7;
        g.beginPath();
        g.moveTo(xx, yy);
        g.lineTo(xx, yy + 13);
        g.stroke();
      }
    }

    // 위 크림
    g.fillStyle = '#fff6ea';
    rr(g, -32, -70, 64, 12, 6);
    g.fill();
    g.strokeStyle = 'rgba(210,180,160,.6)';
    g.lineWidth = 1.2;
    g.stroke();

    // 창(문)
    var dg = g.createRadialGradient(-3, -36, 3, 0, -30, 26);
    dg.addColorStop(0, 'rgba(255,242,190,' + (0.6 + h * 0.4) + ')');
    dg.addColorStop(0.55, 'rgba(255,168,92,' + (0.45 + h * 0.5) + ')');
    dg.addColorStop(1, 'rgba(126,70,38,.96)');
    circ(g, 0, -30, 20);
    g.fillStyle = dg;
    g.fill();

    g.save();
    circ(g, 0, -30, 17);
    g.clip();
    for (var i2 = 0; i2 < 6; i2++) {
      var ax = -12 + (i2 % 3) * 12 + (i2 > 2 ? 5 : 0);
      var ay = -37 + Math.floor(i2 / 3) * 12;
      g.fillStyle = '#d8a46a';
      ell(g, ax, ay, 5.2, 4.2);
      g.fill();
      g.fillStyle = '#6b3f22';
      circ(g, ax - 1.4, ay - 1, 0.9);
      g.fill();
      circ(g, ax + 1.6, ay + 1.2, 0.8);
      g.fill();
    }
    g.restore();

    g.strokeStyle = '#fff3e0';
    g.lineWidth = 3.6;
    circ(g, 0, -30, 20);
    g.stroke();
    g.strokeStyle = 'rgba(255,255,255,.7)';
    g.lineWidth = 1.4;
    g.beginPath();
    g.arc(0, -30, 13.4, Math.PI * 1.05, Math.PI * 1.55);
    g.stroke();

    // 김이 모락모락
    if (h > 0.05) {
      for (var s = 0; s < 4; s++) {
        var ph = (tt * 0.7 + s * 0.26) % 1;
        g.globalAlpha = (1 - ph) * h * 0.8;
        g.fillStyle = '#fffaf2';
        circ(g, -10 + s * 7 + Math.sin(ph * 6 + s) * 3, -50 - ph * 30, 2.4 + ph * 3.4);
        g.fill();
      }
      g.globalAlpha = 1;
    }

    // 손잡이
    g.fillStyle = '#ffd45c';
    rr(g, 15.6, -34, 6, 13, 3);
    g.fill();
    g.strokeStyle = 'rgba(200,150,30,.5)';
    g.lineWidth = 1;
    g.stroke();

    // 굴뚝
    g.fillStyle = '#e0ae82';
    rr(g, -9, -94, 18, 26, 6);
    g.fill();
    g.fillStyle = '#fff6ea';
    rr(g, -12, -98, 24, 9, 4.5);
    g.fill();
    g.restore();
  }

  function drawCakeTable(g, cx, baseY, scale, t) {
    g.save();
    g.translate(cx, baseY);
    g.scale(scale || 1, scale || 1);
    shadow(g, 0, 2, 26, 7, 0.17);

    // 다리
    g.fillStyle = '#fff6ec';
    rr(g, -14, -18, 5, 18, 2.5);
    g.fill();
    rr(g, 9, -18, 5, 18, 2.5);
    g.fill();
    // 식탁보
    g.fillStyle = '#ffd0e2';
    rr(g, -25, -26, 50, 10, 5);
    g.fill();
    g.fillStyle = '#fff6fb';
    ell(g, 0, -26, 25, 7);
    g.fill();
    // 물결 보자기
    g.fillStyle = '#ffc0d8';
    g.beginPath();
    g.moveTo(-25, -22);
    g.quadraticCurveTo(-18, -14, -11, -22);
    g.quadraticCurveTo(-4, -14, 3, -22);
    g.quadraticCurveTo(10, -14, 17, -22);
    g.quadraticCurveTo(21, -18, 25, -22);
    g.lineTo(25, -20);
    g.lineTo(-25, -20);
    g.closePath();
    g.fill();

    // 케이크 접시
    g.fillStyle = '#fffdf8';
    ell(g, 0, -27, 16, 5);
    g.fill();
    g.fillStyle = '#ffe6f1';
    ell(g, 0, -28, 14, 4);
    g.fill();
    // 케이크 아래층
    g.fillStyle = '#fff0f6';
    rr(g, -13, -42, 26, 14, 5);
    g.fill();
    g.fillStyle = '#ffd0e2';
    rr(g, -13, -36, 26, 4, 2);
    g.fill();
    // 케이크 위층
    g.fillStyle = '#ffd9e8';
    rr(g, -9, -52, 18, 11, 5);
    g.fill();
    g.fillStyle = '#fffaf2';
    rr(g, -9, -52, 18, 4, 2);
    g.fill();
    // 딸기
    g.fillStyle = '#ff5f86';
    g.beginPath();
    g.moveTo(0, -58);
    g.quadraticCurveTo(5, -57, 4, -52);
    g.quadraticCurveTo(0, -49, -4, -52);
    g.quadraticCurveTo(-5, -57, 0, -58);
    g.closePath();
    g.fill();
    g.fillStyle = '#6fcf7f';
    ell(g, 0, -58.4, 3.2, 1.4);
    g.fill();
    g.fillStyle = '#fff6cf';
    circ(g, -1.2, -54.6, 0.6);
    g.fill();
    circ(g, 1.4, -53.4, 0.6);
    g.fill();
    // 양초
    g.fillStyle = '#a9d8ff';
    rr(g, -5, -62, 3, 8, 1.5);
    g.fill();
    g.fillStyle = '#ffd45c';
    drop(g, -3.5, -65, 1.6, 2.6);
    g.fill();
    g.restore();
  }

  function drawCottonBed(g, cx, baseY, scale, t, pal) {
    var p = pal || { frame: '#e8b7cf', sheet: '#ffd9e8', pillow: '#fffafc', star: '#ffd45c' };
    g.save();
    g.translate(cx, baseY);
    g.scale(scale || 1, scale || 1);
    shadow(g, 0, 2, 32, 8, 0.17);
    // 머리판
    g.fillStyle = p.frame;
    rr(g, -32, -44, 64, 44, 14);
    g.fill();
    g.fillStyle = 'rgba(255,255,255,.4)';
    rr(g, -28, -40, 56, 8, 4);
    g.fill();
    // 이불
    g.fillStyle = p.sheet;
    rr(g, -30, -24, 60, 24, 12);
    g.fill();
    // 솜사탕 이불 폭신함
    for (var i = 0; i < 4; i++) {
      var px = -22 + i * 15;
      var pg = g.createRadialGradient(px - 2, -26, 1, px, -22, 10);
      pg.addColorStop(0, '#ffffff');
      pg.addColorStop(1, p.sheet);
      circ(g, px, -22, 8.4);
      g.fillStyle = pg;
      g.fill();
    }
    // 베개
    g.fillStyle = p.pillow;
    rr(g, -26, -38, 22, 14, 7);
    g.fill();
    g.strokeStyle = 'rgba(220,180,200,.5)';
    g.lineWidth = 1;
    g.stroke();
    // 별
    starPath(g, 8, -34, 6.4, 2.8, 5);
    g.fillStyle = p.star;
    g.fill();
    g.fillStyle = 'rgba(255,255,255,.8)';
    circ(g, 6, -36, 1.6);
    g.fill();
    // 반짝이
    g.globalAlpha = 0.5 + Math.sin((t || 0) * 2.6) * 0.3;
    g.fillStyle = '#fffbe0';
    starPath(g, 18, -42, 3, 1.2, 4);
    g.fill();
    g.restore();
  }

  function drawFireplace(g, cx, baseY, scale, t) {
    var tt = t || 0;
    g.save();
    g.translate(cx, baseY);
    g.scale(scale || 1, scale || 1);
    shadow(g, 0, 2, 28, 7, 0.17);
    // 초코 벽돌 벽
    var bg = g.createLinearGradient(0, -58, 0, 0);
    bg.addColorStop(0, '#a5714a');
    bg.addColorStop(1, '#7c4f31');
    rr(g, -26, -56, 52, 56, 8);
    g.fillStyle = bg;
    g.fill();
    g.strokeStyle = 'rgba(50,28,14,.35)';
    g.lineWidth = 1;
    for (var r = 0; r < 5; r++) {
      g.beginPath();
      g.moveTo(-25, -46 + r * 11);
      g.lineTo(25, -46 + r * 11);
      g.stroke();
    }
    // 불구멍
    g.fillStyle = '#4a2a18';
    g.beginPath();
    g.moveTo(-15, 0);
    g.lineTo(-15, -30);
    g.quadraticCurveTo(0, -42, 15, -30);
    g.lineTo(15, 0);
    g.closePath();
    g.fill();
    // 불꽃
    for (var f = 0; f < 3; f++) {
      var fl = 0.7 + Math.sin(tt * 6 + f * 1.7) * 0.3;
      var fg2 = g.createLinearGradient(0, -6, 0, -30 * fl);
      fg2.addColorStop(0, '#ff7f3a');
      fg2.addColorStop(0.6, '#ffc24d');
      fg2.addColorStop(1, 'rgba(255,240,170,.25)');
      g.fillStyle = fg2;
      g.beginPath();
      g.moveTo(-6 + f * 6, -2);
      g.quadraticCurveTo(-4 + f * 6, -18 * fl, -1 + f * 6, -26 * fl);
      g.quadraticCurveTo(2 + f * 6, -16 * fl, 4 + f * 6, -2);
      g.closePath();
      g.fill();
    }
    g.fillStyle = 'rgba(255,220,120,.28)';
    circ(g, 0, -16, 24);
    g.fill();
    // 난로 위 마시멜로
    g.fillStyle = '#fffdf8';
    rr(g, -30, -62, 60, 9, 4.5);
    g.fill();
    g.strokeStyle = 'rgba(210,180,160,.6)';
    g.lineWidth = 1.1;
    g.stroke();
    g.fillStyle = '#fffaf2';
    rr(g, -20, -70, 13, 9, 4);
    g.fill();
    rr(g, -2, -70, 13, 9, 4);
    g.fill();
    g.fillStyle = '#ffd0e2';
    circ(g, -13.5, -70, 1.6);
    g.fill();
    circ(g, 4.5, -70, 1.6);
    g.fill();
    g.restore();
  }

  /* ---------- 새 상점 가구 ---------- */

  function furnGummyLamp(g, t) {
    shadow(g, 0, 2, 14, 5, 0.16);
    g.fillStyle = '#fff6ec';
    rr(g, -4, -38, 8, 38, 4);
    g.fill();
    g.fillStyle = '#ffd9e8';
    rr(g, -11, -4, 22, 7, 3.5);
    g.fill();
    var glow = g.createRadialGradient(0, -52, 3, 0, -52, 26);
    glow.addColorStop(0, 'rgba(255,170,120,.55)');
    glow.addColorStop(1, 'rgba(255,170,120,0)');
    circ(g, 0, -52, 26);
    g.fillStyle = glow;
    g.fill();
    // 곰젤리 모양 갓
    g.save();
    g.translate(0, -52);
    g.fillStyle = '#ff8f8f';
    circ(g, -6, -10, 4.4);
    g.fill();
    circ(g, 6, -10, 4.4);
    g.fill();
    ell(g, 0, 2, 10, 10.4);
    g.fill();
    circ(g, 0, -7, 8);
    g.fill();
    g.fillStyle = 'rgba(255,255,255,.45)';
    ell(g, -3.4, -10, 3, 2);
    g.fill();
    g.fillStyle = '#7a2b3c';
    circ(g, -2.6, -8, 1);
    g.fill();
    circ(g, 2.6, -8, 1);
    g.fill();
    g.restore();
    g.globalAlpha = 0.6 + Math.sin((t || 0) * 2.4) * 0.25;
    g.fillStyle = '#fff6c0';
    starPath(g, 12, -66, 3.4, 1.3, 4);
    g.fill();
    g.globalAlpha = 1;
  }

  function furnCakeFountain(g, t) {
    shadow(g, 0, 2, 24, 7, 0.18);
    g.fillStyle = '#fffdf8';
    ell(g, 0, -2, 24, 7);
    g.fill();
    g.fillStyle = '#ffe6f1';
    rr(g, -20, -16, 40, 14, 6);
    g.fill();
    g.fillStyle = '#ffd0e2';
    rr(g, -20, -12, 40, 4, 2);
    g.fill();
    g.fillStyle = '#fffaf2';
    rr(g, -14, -30, 28, 16, 6);
    g.fill();
    g.fillStyle = '#ff9ec4';
    rr(g, -14, -22, 28, 4, 2);
    g.fill();
    // 위 접시
    g.fillStyle = '#fffdf8';
    ell(g, 0, -32, 12, 4);
    g.fill();
    // 딸기 시럽 줄기
    g.fillStyle = 'rgba(255,120,160,.85)';
    g.beginPath();
    g.moveTo(0, -32);
    g.quadraticCurveTo(-6, -44, 0, -52 + Math.sin((t || 0) * 3) * 1.4);
    g.quadraticCurveTo(6, -44, 0, -32);
    g.fill();
    g.fillStyle = 'rgba(255,190,215,.9)';
    circ(g, -1.6, -44, 1.4);
    g.fill();
    g.fillStyle = '#ff5f86';
    circ(g, 0, -55, 3.4);
    g.fill();
    g.fillStyle = '#6fcf7f';
    ell(g, 0, -57.4, 3, 1.4);
    g.fill();
    // 떨어지는 시럽
    for (var i = 0; i < 4; i++) {
      var d = (t * 0.7 + i * 0.25) % 1;
      g.globalAlpha = 0.75 * (1 - d);
      drop(g, -16 + i * 10.5, -18 - d * 12, 1.5, 3.4);
      g.fillStyle = '#ff9ec4';
      g.fill();
    }
    g.globalAlpha = 1;
  }

  function furnHeartChair(g, t) {
    shadow(g, 0, 2, 18, 6, 0.16);
    g.fillStyle = '#ffe6ef';
    rr(g, -16, -10, 32, 10, 5);
    g.fill();
    g.fillStyle = '#ffb0d0';
    heart(g, 0, -24, 15);
    g.fill();
    g.strokeStyle = 'rgba(220,130,170,.4)';
    g.lineWidth = 1.4;
    g.stroke();
    g.fillStyle = '#ffd9e8';
    heart(g, 0, -22, 10.6);
    g.fill();
    g.fillStyle = '#fff';
    ell(g, -5, -27, 4, 2.2);
    g.fill();
    g.fillStyle = '#fff6ec';
    rr(g, -13, -2, 4, 4, 2);
    g.fill();
    rr(g, 9, -2, 4, 4, 2);
    g.fill();
  }

  function furnStarBed(g, t) {
    drawCottonBed(g, 0, 0, 1, t, { frame: '#c8b4ff', sheet: '#e2d6ff', pillow: '#fdfaff', star: '#fff3b0' });
  }

  function furnOvenDecor(g, t) {
    drawCookieOven(g, 0, 0, 0.62, t, 0.45);
  }

  function furnRainbowArch(g, t) {
    shadow(g, 0, 2, 26, 7, 0.16);
    var cols = ['#ff9ec4', '#ffd45c', '#b5e8a8', '#9fd8ff', '#c8b4ff'];
    for (var i = 0; i < 5; i++) {
      g.strokeStyle = cols[i];
      g.lineWidth = 5.2;
      g.lineCap = 'round';
      g.beginPath();
      g.arc(0, -6, 34 - i * 5.4, Math.PI * 1.06, Math.PI * 1.94);
      g.stroke();
    }
    g.fillStyle = '#fffdf8';
    rr(g, -35, -10, 8, 10, 4);
    g.fill();
    rr(g, 27, -10, 8, 10, 4);
    g.fill();
    for (var s = 0; s < 3; s++) {
      g.globalAlpha = 0.55 + Math.sin((t || 0) * 2.6 + s) * 0.3;
      g.fillStyle = '#fffbe0';
      starPath(g, -22 + s * 22, -46 + (s % 2) * 6, 3.2, 1.3, 4);
      g.fill();
    }
    g.globalAlpha = 1;
    g.fillStyle = '#ff9ec4';
    circ(g, -14, -40, 2.6);
    g.fill();
    g.fillStyle = '#ffd45c';
    circ(g, 16, -40, 2.6);
    g.fill();
  }

  return {
    TAU: TAU,
    rr: rr, ell: ell, circ: circ, starPath: starPath, shadow: shadow, swirl: swirl, drop: drop,
    drawSweet: drawSweet, drawFurniture: drawFurniture, drawHouse: drawHouse,
    drawLollipopTree: drawLollipopTree, drawCocoaTree: drawCocoaTree,
    drawCottonBush: drawCottonBush, drawMarshmallowBush: drawMarshmallowBush,
    drawBench: drawBench, drawAnimal: drawAnimal2, drawGirl: drawGirl2, drawKid: drawKid,
    drawCloud: drawCloud, drawCoin: drawCoin, drawSparkle: drawSparkle, drawMarker: drawMarker,
    drawIntroScene: drawIntroScene, sprinkle: sprinkle,
    drawCookieOven: drawCookieOven, drawCakeTable: drawCakeTable,
    drawCottonBed: drawCottonBed, drawFireplace: drawFireplace, heartPath: heart
  };

})();
