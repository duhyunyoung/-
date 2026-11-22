/* 엘리의 간식 마을 - 놀이 */
(function () {
  'use strict';

  var A = window.Art, W = window.World;
  var TILE = W.TILE, TAU = Math.PI * 2;
  var SAVE_KEY = 'sweetTown.v1';

  function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }
  function dist(ax, ay, bx, by) { var dx = ax - bx, dy = ay - by; return Math.sqrt(dx * dx + dy * dy); }
  function $(id) { return document.getElementById(id); }

  var app = $('app'), cv = $('game'), ctx = cv.getContext('2d');
  var hudEl = $('hud');
  var coinCountEl = $('coinCount'), coinPill = $('coinPill');
  var missionWhoEl = $('missionWho'), missionProgEl = $('missionProg'), missionTextEl = $('missionText');
  var invBar = $('invBar');
  var stickZone = $('stickZone'), stickKnob = $('stickKnob');
  var btnShop = $('btnShop'), btnDeco = $('btnDeco'), btnAct = $('btnAct'), actIco = $('actIco'), actLbl = $('actLbl');
  var btnSound = $('btnSound'), btnHelp = $('btnHelp');
  var scrim = $('scrim'), sheet = $('sheet'), sheetTitle = $('sheetTitle'), sheetBody = $('sheetBody'), sheetClose = $('sheetClose');
  var decoBar = $('decoBar'), decoItems = $('decoItems'), decoHint = $('decoHint'), btnDecoDone = $('btnDecoDone'), btnDecoShop = $('btnDecoShop');
  var dlg = $('dialogue'), dlgAva = $('dlgAva'), dlgName = $('dlgName'), dlgText = $('dlgText'), dlgBtns = $('dlgBtns');
  var fishingEl = $('fishing'), fishCanvas = $('fishCanvas'), fishCtx = fishCanvas.getContext('2d');
  var fishMsg = $('fishMsg'), fishTap = $('fishTap'), fishClose = $('fishClose');
  var introEl = $('intro'), introArt = $('introArt'), introCtx = introArt.getContext('2d'), introStart = $('introStart');
  var toastEl = $('toast');

  var ITEMS = {
    candy: { name: '딸기 사탕' },
    marshmallow: { name: '마시멜로' },
    cotton: { name: '솜사탕' },
    choco: { name: '초코칩' },
    gummy: { name: '구미베어' },
    starjelly: { name: '별젤리' }
  };
  var FURN_NAME = {};
  W.shop.forEach(function (s) { FURN_NAME[s.id] = s.name; });

  var ICON = {
    talk: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.6 5.4h14.8a1.9 1.9 0 011.9 1.9v7.2a1.9 1.9 0 01-1.9 1.9H9.4l-4.8 3.1V5.4z" fill="#fff" stroke="#fff" stroke-width="1.5" stroke-linejoin="round"/><circle cx="9" cy="11" r="1.2" fill="#ff9ec4"/><circle cx="12" cy="11" r="1.2" fill="#ff9ec4"/><circle cx="15" cy="11" r="1.2" fill="#ff9ec4"/></svg>',
    pick: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.2l2.3 4.8 5.3.8-3.8 3.7.9 5.2L12 15.2l-4.7 2.5.9-5.2L4.4 8.8l5.3-.8z" fill="#fff" stroke="#fff" stroke-width="1.1" stroke-linejoin="round"/></svg>',
    fish: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.4 12c3-4.5 7.1-5.7 10.4-5.7 3.5 0 6.2 2.2 6.8 5.7-.6 3.5-3.3 5.7-6.8 5.7C10.5 17.7 6.4 16.5 3.4 12z" fill="#fff" stroke="#fff" stroke-width="1.3" stroke-linejoin="round"/><path d="M20.2 12l2.4-3.3v6.6z" fill="#fff"/><circle cx="15.8" cy="11" r="1.15" fill="#ff9ec4"/></svg>',
    shop: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.2 8h11.6l-1 11.4a1.6 1.6 0 01-1.6 1.4H8.8a1.6 1.6 0 01-1.6-1.4L6.2 8z" fill="#fff" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M9 8.4a3 3 0 016 0" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>'
  };
  var ICON_SOUND = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9.4h3.4L12 5.6v12.8L7.4 14.6H4z" fill="currentColor"/><path d="M15.4 8.6a4.6 4.6 0 010 6.8M17.9 6.1a8 8 0 010 11.8" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>';
  var ICON_MUTE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9.4h3.4L12 5.6v12.8L7.4 14.6H4z" fill="currentColor"/><path d="M15.4 9.4l4.8 5M20.2 9.4l-4.8 5" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>';
  var COIN_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.9l2.7 5.7 6.2.8-4.6 4.3 1.2 6.2L12 16.8 6.5 19.9l1.2-6.2-4.6-4.3 6.2-.8z" fill="#ffd045" stroke="#e29a18" stroke-width="1.2" stroke-linejoin="round"/></svg>';

  /* ---------------- 저장 ---------------- */

  function defaultState() {
    return {
      v: 1, coins: 10,
      inv: { candy: 0, marshmallow: 0, cotton: 0, choco: 0, gummy: 0, starjelly: 0 },
      owned: {}, placed: [], questIdx: 0, stage: 'offer',
      muted: false, seenIntro: false,
      px: 15.2, py: 14.7
    };
  }

  function load() {
    var s = defaultState();
    try {
      var raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return s;
      var d = JSON.parse(raw);
      if (!d || typeof d !== 'object') return s;
      if (typeof d.coins === 'number' && isFinite(d.coins)) s.coins = Math.max(0, Math.round(d.coins));
      if (d.inv) for (var k in s.inv) if (typeof d.inv[k] === 'number' && isFinite(d.inv[k])) s.inv[k] = Math.max(0, Math.round(d.inv[k]));
      if (d.owned) for (var k2 in d.owned) if (typeof d.owned[k2] === 'number' && isFinite(d.owned[k2])) s.owned[k2] = Math.max(0, Math.round(d.owned[k2]));
      if (Object.prototype.toString.call(d.placed) === '[object Array]') {
        s.placed = d.placed.filter(function (p) {
          return p && typeof p.x === 'number' && typeof p.y === 'number' && typeof p.t === 'string' && FURN_NAME[p.t];
        }).map(function (p) { return { t: p.t, x: Math.round(p.x), y: Math.round(p.y) }; });
      }
      if (typeof d.questIdx === 'number' && d.questIdx >= 0) s.questIdx = Math.floor(d.questIdx);
      if (d.stage === 'offer' || d.stage === 'active') s.stage = d.stage;
      if (typeof d.muted === 'boolean') s.muted = d.muted;
      if (typeof d.seenIntro === 'boolean') s.seenIntro = d.seenIntro;
      if (typeof d.px === 'number' && typeof d.py === 'number') {
        if (W.canStand(d.px, d.py)) { s.px = d.px; s.py = d.py; }
      }
    } catch (e) { /* 저장이 깨졌으면 새로 시작 */ }
    return s;
  }

  var S = load();
  var saveTimer = null;

  function writeSave() {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify({
        v: 1, coins: S.coins, inv: S.inv, owned: S.owned, placed: S.placed,
        questIdx: S.questIdx, stage: S.stage, muted: S.muted, seenIntro: S.seenIntro,
        px: Math.round(S.px * 100) / 100, py: Math.round(S.py * 100) / 100
      }));
    } catch (e) { }
  }

  function save() {
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(writeSave, 260);
  }

  window.addEventListener('pagehide', writeSave);
  document.addEventListener('visibilitychange', function () { if (document.hidden) writeSave(); });

  /* ---------------- 소리 (WebAudio로 직접 만든 소리) ---------------- */

  var Sound = {
    ctx: null, master: null, muted: false, musicTimer: null, musicStep: 0,
    unlock: function () {
      if (this.muted) { this.icon(); return; }
      try {
        if (!this.ctx) {
          var AC = window.AudioContext || window.webkitAudioContext;
          if (!AC) return;
          this.ctx = new AC();
          this.master = this.ctx.createGain();
          this.master.gain.value = 0.5;
          this.master.connect(this.ctx.destination);
        }
        if (this.ctx.state === 'suspended') this.ctx.resume();
        this.startMusic();
      } catch (e) { }
    },
    tone: function (freq, dur, type, vol, delay, slideTo) {
      if (this.muted || !this.ctx) return;
      try {
        var t0 = this.ctx.currentTime + (delay || 0);
        var o = this.ctx.createOscillator();
        var g = this.ctx.createGain();
        o.type = type || 'sine';
        o.frequency.setValueAtTime(freq, t0);
        if (slideTo) o.frequency.exponentialRampToValueAtTime(Math.max(40, slideTo), t0 + dur);
        g.gain.setValueAtTime(0.0001, t0);
        g.gain.exponentialRampToValueAtTime(Math.max(0.001, vol || 0.12), t0 + 0.014);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
        o.connect(g);
        g.connect(this.master);
        o.start(t0);
        o.stop(t0 + dur + 0.03);
      } catch (e) { }
    },
    noise: function (dur, vol) {
      if (this.muted || !this.ctx) return;
      try {
        var n = Math.floor(this.ctx.sampleRate * dur);
        var buf = this.ctx.createBuffer(1, n, this.ctx.sampleRate);
        var data = buf.getChannelData(0);
        for (var i = 0; i < n; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / n);
        var src = this.ctx.createBufferSource();
        src.buffer = buf;
        var f = this.ctx.createBiquadFilter();
        f.type = 'bandpass';
        f.frequency.value = 1100;
        var g = this.ctx.createGain();
        g.gain.value = vol || 0.12;
        src.connect(f); f.connect(g); g.connect(this.master);
        src.start();
      } catch (e) { }
    },
    pop: function () { this.tone(760, 0.09, 'triangle', 0.18); this.tone(1140, 0.12, 'sine', 0.12, 0.05); },
    blip: function () { this.tone(560, 0.08, 'sine', 0.1); },
    talk: function () { this.tone(620 + Math.random() * 160, 0.07, 'triangle', 0.08); },
    coin: function () {
      var seq = [1046, 1318, 1568, 2093];
      for (var i = 0; i < seq.length; i++) this.tone(seq[i], 0.16, 'triangle', 0.11, i * 0.07);
    },
    buy: function () { this.tone(880, 0.1, 'triangle', 0.14); this.tone(1320, 0.16, 'triangle', 0.1, 0.08); },
    place: function () { this.tone(520, 0.08, 'sine', 0.12); this.tone(840, 0.12, 'sine', 0.09, 0.05); },
    splash: function () { this.noise(0.32, 0.14); this.tone(430, 0.22, 'sine', 0.08, 0, 180); },
    nope: function () { this.tone(320, 0.13, 'sine', 0.1, 0, 230); },
    success: function () {
      var seq = [784, 988, 1175, 1568];
      for (var i = 0; i < seq.length; i++) this.tone(seq[i], 0.2, 'triangle', 0.13, i * 0.09);
    },
    startMusic: function () {
      if (this.musicTimer || !this.ctx || this.muted) return;
      var self = this;
      var melody = [523.25, 659.25, 783.99, 659.25, 587.33, 698.46, 880, 698.46,
        523.25, 659.25, 783.99, 1046.5, 880, 783.99, 659.25, 587.33];
      this.musicTimer = setInterval(function () {
        if (self.muted || document.hidden) return;
        var f = melody[self.musicStep % melody.length];
        self.tone(f, 0.45, 'triangle', 0.028);
        if (self.musicStep % 4 === 0) self.tone(f / 2, 0.9, 'sine', 0.038);
        self.musicStep++;
      }, 430);
    },
    icon: function () {
      btnSound.innerHTML = this.muted ? ICON_MUTE : ICON_SOUND;
      btnSound.setAttribute('aria-label', this.muted ? '소리 켜기' : '소리 끄기');
    },
    setMuted: function (m) {
      this.muted = !!m;
      S.muted = this.muted;
      this.icon();
      if (this.muted && this.ctx) {
        try { this.master.gain.value = 0; } catch (e) { }
      } else {
        if (this.ctx) { try { this.master.gain.value = 0.5; } catch (e) { } }
        this.unlock();
      }
      save();
    }
  };
  Sound.muted = !!S.muted;
  Sound.icon();

  /* ---------------- 화면 크기와 카메라 ---------------- */

  var view = { w: 360, h: 640, dpr: 1, zoom: 1 };
  var cam = { x: W.WORLD_W / 2, y: W.WORLD_H / 2 };

  function resize() {
    var w = app.clientWidth || window.innerWidth;
    var h = app.clientHeight || window.innerHeight;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = Math.round(w * dpr);
    cv.height = Math.round(h * dpr);
    cv.style.width = w + 'px';
    cv.style.height = h + 'px';
    view.w = w; view.h = h; view.dpr = dpr;
    view.zoom = clamp(Math.min(w / (11 * TILE), h / (9 * TILE)), 0.5, 2.2);
    cameraClamp();
  }

  function cameraClamp() {
    var vw = view.w / view.zoom, vh = view.h / view.zoom;
    if (vw >= W.WORLD_W) cam.x = W.WORLD_W / 2;
    else cam.x = clamp(cam.x, vw / 2, W.WORLD_W - vw / 2);
    if (vh >= W.WORLD_H) cam.y = W.WORLD_H / 2;
    else cam.y = clamp(cam.y, vh / 2, W.WORLD_H - vh / 2);
  }

  function s2w(sx, sy) {
    return {
      x: (sx - view.w / 2) / view.zoom + cam.x,
      y: (sy - view.h / 2) / view.zoom + cam.y
    };
  }
  function w2s(wx, wy) {
    return {
      x: (wx - cam.x) * view.zoom + view.w / 2,
      y: (wy - cam.y) * view.zoom + view.h / 2
    };
  }

  /* ---------------- 놀이 상태 ---------------- */

  var walk = { target: null, anim: 0, dust: 0 };
  var joy = { active: false, id: null, dx: 0, dy: 0 };
  var deco = { on: false, sel: null, hover: null };
  var hint = { kind: null, target: null, label: '말 걸기' };
  var parts = [];
  var floats = [];
  var introOpen = false, introShown = false;
  var dialogueOpen = false, sheetOpen = false, fishingOpen = false;
  var terrainCanvas = null;

  /* ---------------- 미션 ---------------- */

  function curQuest() {
    if (S.questIdx < W.quests.length) return W.quests[S.questIdx];
    return W.loopQuest(S.questIdx - W.quests.length);
  }
  function nameOf(id) { var n = W.npcById[id]; return n ? n.name : ''; }
  function npcPoint(id) {
    var n = W.npcById[id];
    return n ? { x: n.x, y: n.y } : null;
  }
  function placedCount(type) {
    var c = 0;
    for (var i = 0; i < S.placed.length; i++) if (S.placed[i].t === type) c++;
    return c;
  }
  function questProgress(q) {
    if (!q) return 0;
    if (q.kind === 'place') return placedCount(q.item);
    return S.inv[q.item] || 0;
  }
  function questReady(q) {
    if (!q) return false;
    if (q.kind === 'place') return placedCount(q.item) > 0;
    return (S.inv[q.item] || 0) >= q.need;
  }

  function updateMission() {
    var q = curQuest();
    if (!q) return;
    var have = questProgress(q);
    var name = ITEMS[q.item] ? ITEMS[q.item].name : FURN_NAME[q.item];
    var giverName = nameOf(q.giver);

    if (S.stage === 'offer') {
      missionWhoEl.textContent = giverName + '의 부탁';
      missionProgEl.textContent = '기다려요';
      missionTextEl.textContent = giverName + '에게 가서 말을 걸어 보세요!';
      return;
    }
    missionWhoEl.textContent = giverName + '의 부탁';

    if (q.kind === 'place') {
      missionProgEl.textContent = have > 0 ? '완료' : '0/1';
      missionTextEl.textContent = have > 0
        ? '놓았어요! ' + giverName + '에게 알려 주세요!'
        : FURN_NAME[q.item] + '을(를) 상점에서 사서 빈 땅에 놓아 주세요';
      return;
    }

    missionProgEl.textContent = Math.min(have, q.need) + '/' + q.need;
    if (q.kind === 'deliver') {
      missionTextEl.textContent = have >= q.need
        ? name + ' ' + q.need + '개를 ' + nameOf(q.to) + '에게 전해 주세요!'
        : name + ' ' + q.need + '개를 모아요';
    } else {
      missionTextEl.textContent = have >= q.need
        ? name + ' ' + q.need + '개를 ' + giverName + '에게 가져다주세요!'
        : name + ' ' + q.need + '개를 모아요';
    }
  }

  /* ---------------- HUD ---------------- */

  function thumbSweet(type, size) {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var c = document.createElement('canvas');
    c.width = Math.round(size * dpr); c.height = Math.round(size * dpr);
    c.style.width = size + 'px'; c.style.height = size + 'px';
    var g = c.getContext('2d');
    g.scale(dpr, dpr);
    A.drawSweet(g, type, size / 2, size / 2, size * 0.78, 0);
    return c;
  }

  function thumbFurniture(id, size) {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var c = document.createElement('canvas');
    c.width = Math.round(size * dpr); c.height = Math.round(size * dpr);
    c.style.width = size + 'px'; c.style.height = size + 'px';
    var g = c.getContext('2d');
    g.scale(dpr, dpr);
    A.drawFurniture(g, id, size / 2, size * 0.95, size / 82, 0);
    return c;
  }

  var lastCoins = S.coins;

  function updateHud() {
    coinCountEl.textContent = S.coins;
    if (S.coins !== lastCoins) {
      coinPill.classList.remove('bump');
      void coinPill.offsetWidth;
      coinPill.classList.add('bump');
      lastCoins = S.coins;
    }

    var q = curQuest();
    var needItem = (q && S.stage === 'active' && q.kind !== 'place') ? q.item : null;
    var types = [];
    for (var k in ITEMS) if ((S.inv[k] || 0) > 0) types.push(k);
    if (needItem && types.indexOf(needItem) < 0) types.unshift(needItem);
    types = types.slice(0, 6);

    invBar.innerHTML = '';
    for (var i = 0; i < types.length; i++) {
      var t = types[i];
      var chip = document.createElement('div');
      chip.className = 'chip' + ((S.inv[t] || 0) > 0 ? '' : ' dim');
      chip.appendChild(thumbSweet(t, 28));
      var sp = document.createElement('span');
      sp.textContent = (S.inv[t] || 0);
      chip.appendChild(sp);
      chip.title = ITEMS[t].name;
      invBar.appendChild(chip);
    }
    updateMission();
  }

  var toastTimer = null;
  function toast(msg, kind) {
    toastEl.textContent = msg;
    toastEl.className = 'toast show' + (kind ? ' ' + kind : '');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.className = 'toast' + (kind ? ' ' + kind : ''); }, 2100);
  }

  /* ---------------- 반짝이와 축하 ---------------- */

  var CONFETTI = ['#ff9ec4', '#ffd45c', '#9fd8ff', '#b5e8a8', '#d5b3ff', '#ffffff'];

  function addConfetti(x, y, n) {
    for (var i = 0; i < n; i++) {
      var a = Math.random() * TAU, sp = 40 + Math.random() * 150;
      parts.push({
        x: x, y: y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 60,
        life: 0, max: 0.9 + Math.random() * 0.9,
        size: 3 + Math.random() * 4,
        color: CONFETTI[Math.floor(Math.random() * CONFETTI.length)],
        rot: Math.random() * TAU, vr: (Math.random() - 0.5) * 12,
        kind: 'confetti'
      });
    }
  }

  function addSparkles(x, y, n) {
    for (var i = 0; i < n; i++) {
      var a = Math.random() * TAU, sp = 20 + Math.random() * 70;
      parts.push({
        x: x, y: y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 20,
        life: 0, max: 0.6 + Math.random() * 0.7,
        size: 3 + Math.random() * 4, color: '#fffbe0',
        rot: Math.random() * TAU, vr: 3, kind: 'spark'
      });
    }
  }

  function addCoinPart(x, y) {
    for (var i = 0; i < 6; i++) {
      parts.push({
        x: x + (Math.random() - 0.5) * 30, y: y, vx: (Math.random() - 0.5) * 50,
        vy: -70 - Math.random() * 60, life: 0, max: 1.1, size: 7 + Math.random() * 3,
        color: '#ffd45c', rot: 0, vr: 2, kind: 'coin'
      });
    }
  }

  function addPuff(x, y) {
    parts.push({
      x: x, y: y, vx: (Math.random() - 0.5) * 12, vy: -6 - Math.random() * 8,
      life: 0, max: 0.5, size: 4 + Math.random() * 3, color: 'rgba(255,255,255,.8)',
      rot: 0, vr: 0, kind: 'puff'
    });
  }

  function celebrateAt(x, y, coins) {
    addConfetti(x, y - 20, 34);
    addSparkles(x, y - 20, 14);
    addCoinPart(x, y - 40);
    if (coins) addFloat(x, y - 70, '★ +' + coins + ' 별 코인', '#b0781f');
  }

  function addFloat(x, y, text, color) {
    floats.push({ x: x, y: y, text: text, color: color || '#b0708f', life: 0, max: 1.6 });
  }

  function updateParts(dt) {
    var i, p;
    for (i = parts.length - 1; i >= 0; i--) {
      p = parts[i];
      p.life += dt;
      if (p.life >= p.max) { parts.splice(i, 1); continue; }
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      if (p.kind === 'confetti') { p.vy += 220 * dt; p.vx *= 0.985; p.rot += p.vr * dt; }
      else if (p.kind === 'coin') { p.vy += 260 * dt; p.rot += p.vr * dt; }
      else if (p.kind === 'spark') { p.vx *= 0.96; p.vy *= 0.96; p.rot += p.vr * dt; }
      else { p.vy *= 0.97; }
    }
    for (i = floats.length - 1; i >= 0; i--) {
      floats[i].life += dt;
      floats[i].y -= 26 * dt;
      if (floats[i].life >= floats[i].max) floats.splice(i, 1);
    }
  }

  function drawParts() {
    var i, p, a;
    for (i = 0; i < parts.length; i++) {
      p = parts[i];
      a = 1 - p.life / p.max;
      ctx.save();
      ctx.globalAlpha = Math.max(0, a);
      if (p.kind === 'confetti') {
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        A.rr(ctx, -p.size / 2, -p.size / 3, p.size, p.size * 0.66, 1.4);
        ctx.fill();
      } else if (p.kind === 'spark') {
        A.drawSparkle(ctx, p.x, p.y, p.size, a, p.rot);
      } else if (p.kind === 'coin') {
        A.drawCoin(ctx, p.x, p.y, p.size);
      } else {
        ctx.fillStyle = p.color;
        A.circ(ctx, p.x, p.y, p.size * (1 + p.life * 2));
        ctx.fill();
      }
      ctx.restore();
    }
  }

  function drawFloats() {
    for (var i = 0; i < floats.length; i++) {
      var f = floats[i];
      var a = 1 - Math.max(0, (f.life - f.max * 0.55) / (f.max * 0.45));
      ctx.save();
      ctx.globalAlpha = Math.max(0, a);
      ctx.font = '900 15px "Apple SD Gothic Neo","Malgun Gothic",system-ui,sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.lineWidth = 4;
      ctx.strokeStyle = 'rgba(255,255,255,.95)';
      ctx.strokeText(f.text, f.x, f.y);
      ctx.fillStyle = f.color;
      ctx.fillText(f.text, f.x, f.y);
      ctx.restore();
    }
  }

  /* ---------------- 마을 그리기 ---------------- */

  function isReady(p) {
    return !p.readyAt || performance.now() >= p.readyAt;
  }

  function drawProp(p, bx, by, t) {
    if (p.kind === 'lollipop') A.drawLollipopTree(ctx, bx, by, p.v, t);
    else if (p.kind === 'cocoa') A.drawCocoaTree(ctx, bx, by, p.v, t);
    else if (p.kind === 'cotton') A.drawCottonBush(ctx, bx, by, p.v, t);
    else if (p.kind === 'marshmallow') A.drawMarshmallowBush(ctx, bx, by, p.v, t);
    else if (p.kind === 'bench') A.drawBench(ctx, bx, by, t);
    if (p.item && isReady(p)) {
      A.drawSparkle(ctx, bx + 17, by - 66, 3.2 + Math.sin(t * 4 + p.x) * 1.3, 0.85, t * 0.7);
      A.drawSparkle(ctx, bx - 15, by - 50, 2.2 + Math.cos(t * 3.4 + p.y) * 0.9, 0.7, -t * 0.5);
    }
  }

  function drawNpcLabel(npc, bx, by) {
    if (deco.on) return;
    var d = dist(npc.x, npc.y, S.px, S.py);
    if (d > 5.6) return;
    var txt = npc.name;
    ctx.save();
    ctx.font = '900 11px "Apple SD Gothic Neo","Malgun Gothic",system-ui,sans-serif';
    var wd = ctx.measureText(txt).width + 16;
    ctx.globalAlpha = clamp((5.8 - d) / 1.4, 0, 1);
    ctx.fillStyle = 'rgba(255,255,255,.94)';
    A.rr(ctx, bx - wd / 2, by - 60, wd, 18, 9);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,190,215,.95)';
    ctx.lineWidth = 1.4;
    ctx.stroke();
    ctx.fillStyle = '#b0708f';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(txt, bx, by - 50.5);
    ctx.restore();
  }

  function drawPondShimmer(t) {
    var cx = W.pond.cx * TILE, cy = W.pond.cy * TILE;
    var rx = W.pond.rx * TILE, ry = W.pond.ry * TILE;
    ctx.save();
    A.ell(ctx, cx, cy, rx - 4, ry - 4);
    ctx.clip();
    for (var i = 0; i < 4; i++) {
      var ph = ((t * 0.1 + i * 0.25) % 1);
      var yy = cy + ry - ph * ry * 2;
      ctx.globalAlpha = 0.3 * (1 - ph);
      ctx.fillStyle = '#ffffff';
      A.ell(ctx, cx + Math.sin(t * 1.3 + i * 2) * 44, yy, 60 * (1 - ph * 0.35), 6);
      ctx.fill();
    }
    ctx.globalAlpha = 0.75;
    for (var s = 0; s < 5; s++) {
      var ang = t * 0.55 + s * 1.26;
      var px = cx + Math.cos(ang) * rx * 0.62;
      var py = cy + Math.sin(ang * 1.4) * ry * 0.55;
      A.drawSparkle(ctx, px, py, 2.6 + Math.sin(t * 3 + s) * 1.1, 0.4 + 0.35 * Math.sin(t * 2.2 + s));
    }
    ctx.restore();
  }

  function drawClouds(t) {
    var list = [{ x: 0.12, y: 2.6, s: 30, a: 0.34, v: 5 }, { x: 0.62, y: 1.6, s: 24, a: 0.3, v: 8 }, { x: 1.0, y: 3.6, s: 27, a: 0.26, v: 3.5 }];
    for (var i = 0; i < list.length; i++) {
      var c = list[i];
      var x = ((c.x * W.WORLD_W + t * c.v * 6) % (W.WORLD_W + 240)) - 120;
      A.drawCloud(ctx, x, c.y * TILE, c.s, c.a);
    }
  }

  function drawArrow(t) {
    var p = arrowTarget();
    if (!p) return;
    var dx = p.x - S.px, dy = p.y - S.py;
    var d = Math.sqrt(dx * dx + dy * dy);
    if (d < 2.6) return;
    var ang = Math.atan2(dy, dx);
    ctx.save();
    ctx.translate(S.px * TILE + Math.cos(ang) * 40, S.py * TILE - 56 + Math.sin(ang) * 40);
    ctx.rotate(ang);
    ctx.globalAlpha = 0.6 + Math.sin(t * 4) * 0.2;
    ctx.beginPath();
    ctx.moveTo(13, 0);
    ctx.lineTo(-9, -9);
    ctx.lineTo(-4, 0);
    ctx.lineTo(-9, 9);
    ctx.closePath();
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.strokeStyle = '#ff9ec4';
    ctx.lineWidth = 2.4;
    ctx.stroke();
    ctx.restore();
  }

  function drawDecoGrid(t) {
    var vw = view.w / view.zoom, vh = view.h / view.zoom;
    var x0 = Math.max(0, Math.floor((cam.x - vw / 2) / TILE) - 1);
    var x1 = Math.min(W.MAP_W - 1, Math.ceil((cam.x + vw / 2) / TILE));
    var y0 = Math.max(0, Math.floor((cam.y - vh / 2) / TILE) - 1);
    var y1 = Math.min(W.MAP_H - 1, Math.ceil((cam.y + vh / 2) / TILE));
    ctx.save();
    ctx.fillStyle = 'rgba(255,244,250,.16)';
    ctx.fillRect(x0 * TILE, y0 * TILE, (x1 - x0 + 1) * TILE, (y1 - y0 + 1) * TILE);
    ctx.setLineDash([5, 5]);
    ctx.lineWidth = 1.6 / Math.max(0.8, view.zoom);
    for (var ty = y0; ty <= y1; ty++) {
      for (var tx = x0; tx <= x1; tx++) {
        if (!W.placeable(tx, ty)) continue;
        ctx.strokeStyle = 'rgba(255,255,255,.72)';
        ctx.strokeRect(tx * TILE + 4, ty * TILE + 4, TILE - 8, TILE - 8);
      }
    }
    ctx.restore();
  }

  function render(t) {
    ctx.setTransform(view.dpr, 0, 0, view.dpr, 0, 0);
    ctx.clearRect(0, 0, view.w, view.h);
    ctx.save();
    ctx.translate(view.w / 2, view.h / 2);
    ctx.scale(view.zoom, view.zoom);
    ctx.translate(-cam.x, -cam.y);

    ctx.fillStyle = '#c9e9b8';
    ctx.fillRect(0, 0, W.WORLD_W, W.WORLD_H);
    if (terrainCanvas) ctx.drawImage(terrainCanvas, 0, 0);

    drawPondShimmer(t);
    drawClouds(t);

    var list = [];
    list.push({ y: W.houseAnchor.y, f: function () { A.drawHouse(ctx, W.houseAnchor.x, W.houseAnchor.y, 1, t); } });

    var i;
    for (i = 0; i < W.props.length; i++) {
      (function (p) {
        var bx = (p.x + 0.5) * TILE, by = (p.y + 0.95) * TILE;
        list.push({ y: by, f: function () { drawProp(p, bx, by, t); } });
      })(W.props[i]);
    }
    for (i = 0; i < S.placed.length; i++) {
      (function (p) {
        var bx = (p.x + 0.5) * TILE, by = (p.y + 0.95) * TILE;
        list.push({ y: by, f: function () { A.drawFurniture(ctx, p.t, bx, by, 1.12, t); } });
      })(S.placed[i]);
    }
    for (i = 0; i < W.npcs.length; i++) {
      (function (npc) {
        var bx = npc.x * TILE, by = npc.y * TILE;
        list.push({
          y: by, f: function () {
            A.drawAnimal(ctx, npc.kind, bx, by, 1.12, t, npc.face);
            drawNpcLabel(npc, bx, by);
          }
        });
      })(W.npcs[i]);
    }
    list.push({
      y: S.py * TILE, f: function () {
        A.drawGirl(ctx, S.px * TILE, S.py * TILE, 1.06, t, walk.anim > 0, S.dir);
      }
    });
    list.sort(function (a, b) { return a.y - b.y; });
    for (i = 0; i < list.length; i++) list[i].f();

    // 부탁 표시
    var targetId = questTargetNpc();
    if (targetId) {
      var npc = W.npcById[targetId];
      if (npc) A.drawMarker(ctx, npc.x * TILE, npc.y * TILE - 74, t);
    }

    drawParts();
    drawFloats();
    drawArrow(t);
    if (deco.on) drawDecoGrid(t);

    ctx.restore();
  }

  /* ---------------- 길 안내 ---------------- */

  function questTargetNpc() {
    var q = curQuest();
    if (!q) return null;
    if (S.stage === 'offer') return q.giver;
    if (q.kind === 'place') return placedCount(q.item) > 0 ? q.giver : null;
    if (q.kind === 'deliver') return (S.inv[q.item] || 0) >= q.need ? q.to : null;
    return (S.inv[q.item] || 0) >= q.need ? q.giver : null;
  }

  function sourcePoint(item) {
    if (item === 'gummy' || item === 'starjelly') {
      return { x: W.pond.cx - W.pond.rx - 0.8, y: W.pond.cy + 0.6 };
    }
    var best = null, bd = 1e9;
    for (var i = 0; i < W.props.length; i++) {
      var p = W.props[i];
      if (p.item !== item) continue;
      var d = dist(p.x, p.y, S.px, S.py);
      if (d < bd && isReady(p)) { bd = d; best = p; }
    }
    if (!best) {
      for (var j = 0; j < W.props.length; j++) {
        var p2 = W.props[j];
        if (p2.item !== item) continue;
        var d2 = dist(p2.x, p2.y, S.px, S.py);
        if (d2 < bd) { bd = d2; best = p2; }
      }
    }
    return best ? { x: best.x + 0.5, y: best.y + 0.55 } : null;
  }

  function arrowTarget() {
    var q = curQuest();
    if (!q) return null;
    if (S.stage === 'offer') return npcPoint(q.giver);
    if (q.kind === 'place') return placedCount(q.item) > 0 ? npcPoint(q.giver) : null;
    if (q.kind === 'deliver') {
      if ((S.inv[q.item] || 0) >= q.need) return npcPoint(q.to);
      return sourcePoint(q.item);
    }
    if ((S.inv[q.item] || 0) >= q.need) return npcPoint(q.giver);
    return sourcePoint(q.item);
  }

  /* ---------------- 움직임 ---------------- */

  function setWalkTarget(tx, ty) {
    tx = clamp(tx, 0.8, W.MAP_W - 0.8);
    ty = clamp(ty, 0.8, W.MAP_H - 0.8);
    if (!W.canStand(tx, ty)) {
      var found = null;
      for (var r = 0.4; r <= 4.4 && !found; r += 0.4) {
        for (var a = 0; a < 16; a++) {
          var nx = tx + Math.cos((a / 16) * TAU) * r;
          var ny = ty + Math.sin((a / 16) * TAU) * r;
          if (W.canStand(nx, ny)) { found = { x: nx, y: ny }; break; }
        }
      }
      if (!found) return;
      tx = found.x; ty = found.y;
    }
    walk.target = { x: tx, y: ty };
  }

  function updateWorld(dt, t) {
    var busy = dialogueOpen || sheetOpen || fishingOpen;
    var vx = 0, vy = 0;

    if (!busy && !deco.on) {
      if (joy.active && (Math.abs(joy.dx) + Math.abs(joy.dy)) > 0.2) {
        vx = joy.dx; vy = joy.dy;
        walk.target = null;
      } else if (walk.target) {
        var dx = walk.target.x - S.px, dy = walk.target.y - S.py;
        var d = Math.sqrt(dx * dx + dy * dy);
        if (d < 0.12) walk.target = null;
        else { vx = dx / d; vy = dy / d; }
      }
    }

    if (vx || vy) {
      var l = Math.sqrt(vx * vx + vy * vy);
      vx /= l; vy /= l;
      var sp = 3.2;
      var nx = S.px + vx * sp * dt, ny = S.py + vy * sp * dt;
      if (W.canStand(nx, S.py)) S.px = nx;
      if (W.canStand(S.px, ny)) S.py = ny;
      walk.anim += dt;
      if (Math.abs(vx) > Math.abs(vy)) S.dir = vx > 0 ? 'right' : 'left';
      else S.dir = vy > 0 ? 'down' : 'up';
      walk.dust -= dt;
      if (walk.dust <= 0) {
        walk.dust = 0.34;
        addPuff(S.px * TILE + (Math.random() - 0.5) * 10, S.py * TILE - 3);
      }
    } else {
      walk.anim = 0;
    }

    // 동물 친구 산책
    for (var i = 0; i < W.npcs.length; i++) {
      var n = W.npcs[i];
      if (!n.wander) continue;
      var ndx = n.tx - n.x, ndy = n.ty - n.y;
      var nd = Math.sqrt(ndx * ndx + ndy * ndy);
      if (nd < 0.15) {
        n.wait -= dt;
        if (n.wait <= 0) {
          n.tx = clamp(n.home.x + (Math.random() * 2 - 1) * n.wander, 1, W.MAP_W - 1);
          n.ty = clamp(n.home.y + (Math.random() * 2 - 1) * n.wander * 0.6, 1, W.MAP_H - 1);
          n.wait = 1.6 + Math.random() * 3.2;
        }
      } else {
        var sp2 = 0.62;
        var ax = n.x + (ndx / nd) * sp2 * dt, ay = n.y + (ndy / nd) * sp2 * dt;
        if (W.canStand(ax, ay)) { n.x = ax; n.y = ay; }
        else { n.tx = n.x; n.ty = n.y; }
        if (Math.abs(ndx) > 0.05) n.face = ndx > 0 ? 'right' : 'left';
      }
    }

    updateParts(dt);
    updateInteract();

    // 카메라
    var k = Math.min(1, dt * 6.5);
    cam.x += (S.px * TILE - cam.x) * k;
    cam.y += (S.py * TILE - cam.y) * k;
    cameraClamp();
  }

  function updateInteract() {
    if (deco.on) {
      hint.kind = null; hint.target = null;
      setActButton('놓기', '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v10M8 10l4 4 4-4" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M5 18h14" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/></svg>');
      return;
    }
    var best = null, i;

    for (i = 0; i < W.npcs.length; i++) {
      var n = W.npcs[i];
      var dn = dist(n.x, n.y, S.px, S.py);
      if (dn < 1.95 && (!best || dn < best.d)) best = { d: dn, kind: 'talk', target: n };
    }
    if (!best) {
      for (i = 0; i < W.props.length; i++) {
        var p = W.props[i];
        if (!p.item) continue;
        var dp = dist(p.x + 0.5, p.y + 0.55, S.px, S.py);
        if (dp < 1.5 && (!best || dp < best.d)) best = { d: dp, kind: 'gather', target: p };
      }
    }
    if (!best && W.distToPond(S.px, S.py) < 1.9) {
      best = { d: 0, kind: 'fish', target: null };
    }

    hint.kind = best ? best.kind : null;
    hint.target = best ? best.target : null;

    if (hint.kind === 'talk') setActButton('말 걸기', ICON.talk);
    else if (hint.kind === 'gather') setActButton('줍기', ICON.pick);
    else if (hint.kind === 'fish') setActButton('낚시', ICON.fish);
    else setActButton('둘러보기', ICON.talk);
  }

  var lastAct = '';
  function setActButton(label, icon) {
    if (lastAct === label) return;
    lastAct = label;
    actLbl.textContent = label;
    actIco.innerHTML = icon;
  }

  /* ---------------- 줍기 ---------------- */

  function gather(p) {
    var now = performance.now();
    if (!isReady(p)) {
      toast('아직 자라는 중이에요. 조금만 기다려 주세요!');
      Sound.nope();
      return;
    }
    S.inv[p.item] = (S.inv[p.item] || 0) + 1;
    p.readyAt = now + 7000;
    var bx = (p.x + 0.5) * TILE, by = (p.y + 0.6) * TILE;
    addSparkles(bx, by - 30, 8);
    addFloat(bx, by - 56, ITEMS[p.item].name + ' +1', '#a3557f');
    Sound.pop();
    save();
    updateHud();
  }

  /* ---------------- 대화 ---------------- */

  function avatarCanvas(npc) {
    var size = 46;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var c = document.createElement('canvas');
    c.width = Math.round(size * dpr); c.height = Math.round(size * dpr);
    c.style.width = size + 'px'; c.style.height = size + 'px';
    var g = c.getContext('2d');
    g.scale(dpr, dpr);
    A.drawAnimal(g, npc.kind, size / 2, size - 1, 0.74, 0, npc.face);
    return c;
  }

  function showDialogue(npc, text, buttons) {
    dlgName.textContent = npc ? (npc.name + ' · ' + npc.role) : '엘리의 간식 마을';
    dlgText.textContent = text;
    dlgAva.innerHTML = '';
    if (npc) dlgAva.appendChild(avatarCanvas(npc));
    dlgBtns.innerHTML = '';
    var list = buttons || [['알겠어요!', closeDialogue, true]];
    for (var i = 0; i < list.length; i++) {
      (function (b) {
        var el = document.createElement('button');
        el.textContent = b[0];
        if (b[2]) el.className = 'primary';
        el.addEventListener('click', function () {
          Sound.blip();
          b[1]();
        });
        dlgBtns.appendChild(el);
      })(list[i]);
    }
    dlg.classList.add('show');
    dialogueOpen = true;
    walk.target = null;
    Sound.talk();
  }

  function closeDialogue() {
    dlg.classList.remove('show');
    dialogueOpen = false;
  }

  var IDLE = {
    somsom: ['오늘 마을이 정말 달콤해!', '엘리야, 나랑 같이 놀자!', '롤리팝 나무가 반짝반짝 빛나고 있어!', '솜솜은 폭신폭신 솜사탕을 좋아해!'],
    koko: ['폴폴~ 마시멜로 냄새가 좋아!', '엘리, 오늘도 반가워!', '과자집 창문은 젤리로 만들어졌대!', '초콜릿 길을 걸으면 기분이 좋아져!'],
    jelly: ['야옹~ 연못에서 통통 구미베어가 헤엄쳐!', '엘리, 낚시 잘해? 별젤리도 있어!', '젤리 연못은 만지면 말랑말랑해!', '고양이 젤리는 마시멜로를 제일 좋아해!'],
    ppiak: ['삐약삐약!', '나는 초코칩을 모으고 있어!', '엘리랑 놀면 정말 재미있어!', '과자집 지붕은 딸기 맛이래!']
  };

  function idleTalk(npc) {
    var lines = IDLE[npc.id] || ['안녕!'];
    var line = lines[Math.floor(Math.random() * lines.length)];
    showDialogue(npc, line, [['또 만나요!', closeDialogue, true]]);
  }

  function talkTo(npc) {
    var q = curQuest();
    if (!q) { idleTalk(npc); return; }

    if (S.stage === 'offer' && npc.id === q.giver) {
      showDialogue(npc, q.ask, [
        ['좋아요! 할래요', function () {
          S.stage = 'active';
          closeDialogue();
          save();
          updateHud();
          Sound.success();
          toast('부탁을 받았어요! ' + (q.hud || ''), 'gold');
        }, true],
        ['나중에 할래요', function () { closeDialogue(); }]
      ]);
      return;
    }

    if (S.stage === 'active' && npc.id === q.giver && q.kind === 'deliver') {
      if ((S.inv[q.item] || 0) >= q.need) {
        showDialogue(npc, '와, 잘 모았구나! 그런데 이건 ' + nameOf(q.to) + '에게 직접 전해 줄래?', [['알겠어요!', closeDialogue, true]]);
      } else {
        showDialogue(npc, q.busy + ' (' + (S.inv[q.item] || 0) + '/' + q.need + ')', [['다시 해 볼게요', closeDialogue, true]]);
      }
      return;
    }

    if (S.stage === 'active' && npc.id === q.giver) {
      if (questReady(q)) completeAtGiver(q, npc);
      else showDialogue(npc, q.busy + ' (' + (S.inv[q.item] || 0) + '/' + q.need + ')', [['다시 해 볼게요', closeDialogue, true]]);
      return;
    }

    if (S.stage === 'active' && q.kind === 'deliver' && npc.id === q.to) {
      if ((S.inv[q.item] || 0) >= q.need) completeAtTarget(q, npc);
      else showDialogue(npc, '고마워! 여기서 기다릴게. ' + ITEMS[q.item].name + '을(를) ' + q.need + '개 모아서 와 줘!', [['알겠어요!', closeDialogue, true]]);
      return;
    }

    idleTalk(npc);
  }

  function completeAtGiver(q, npc) {
    if (q.kind !== 'place') S.inv[q.item] = Math.max(0, (S.inv[q.item] || 0) - q.need);
    S.coins += q.coins;
    S.questIdx++;
    S.stage = 'offer';
    closeDialogue();
    Sound.success();
    Sound.coin();
    celebrateAt(npc.x * TILE, npc.y * TILE - 24, q.coins);
    showDialogue(npc, q.done + '  별 코인 ' + q.coins + '개를 받았어요!', [['고마워요!', closeDialogue, true]]);
    save();
    updateHud();
  }

  function completeAtTarget(q, npc) {
    S.inv[q.item] = Math.max(0, (S.inv[q.item] || 0) - q.need);
    S.coins += q.coins;
    S.questIdx++;
    S.stage = 'offer';
    closeDialogue();
    Sound.success();
    Sound.coin();
    celebrateAt(npc.x * TILE, npc.y * TILE - 24, q.coins);
    showDialogue(npc, q.done + '  대신 전해 줘서 고마워! 별 코인 ' + q.coins + '개를 받았어요!', [['고마워요!', closeDialogue, true]]);
    save();
    updateHud();
  }

  /* ---------------- 낚시 ---------------- */

  var fish = { pos: 0.1, dir: 1, speed: 0.55, zone: 0.3, zoneStart: 0.35, caught: 0, splash: 0, msg: '', wob: 0 };

  function openFishing() {
    if (fishingOpen) return;
    fishingOpen = true;
    fish.caught = 0;
    fish.pos = 0.05;
    fish.dir = 1;
    fish.zoneStart = 0.2 + Math.random() * 0.45;
    fish.zone = 0.3;
    fish.msg = '초록색 칸에 올 때 톡 눌러 봐!';
    fishMsg.textContent = fish.msg;
    fishingEl.classList.add('show');
    walk.target = null;
    Sound.blip();
  }

  function closeFishing() {
    fishingOpen = false;
    fishingEl.classList.remove('show');
    if (fish.caught > 0) toast(fish.caught + '마리나 낚았어요! 정말 잘했어요!', 'gold');
  }

  function fishTapHandler() {
    if (!fishingOpen) return;
    Sound.unlock();
    var inZone = fish.pos >= fish.zoneStart && fish.pos <= fish.zoneStart + fish.zone;
    if (inZone) {
      var type = Math.random() < 0.68 ? 'gummy' : 'starjelly';
      S.inv[type] = (S.inv[type] || 0) + 1;
      fish.caught++;
      fish.splash = 1;
      fish.lastType = type;
      fish.msg = (type === 'gummy' ? '구미베어' : '별젤리') + '를 낚았어요! (모두 ' + fish.caught + '마리)';
      fishMsg.textContent = fish.msg;
      Sound.splash();
      Sound.tone(1046, 0.14, 'triangle', 0.12, 0.1);
      Sound.tone(1318, 0.2, 'triangle', 0.1, 0.2);
      fish.zoneStart = 0.16 + Math.random() * 0.52;
      fish.zone = 0.3;
      fish.pos = 0;
      fish.dir = 1;
      save();
      updateHud();
    } else {
      fish.msg = '앗, 놓쳤어요! 초록색 칸에 올 때 다시 톡!';
      fishMsg.textContent = fish.msg;
      Sound.nope();
    }
  }

  function drawFishing(t, dt) {
    var g = fishCtx;
    var w = 360, h = 196;
    fish.pos += fish.dir * fish.speed * dt;
    if (fish.pos > 1) { fish.pos = 1; fish.dir = -1; }
    if (fish.pos < 0) { fish.pos = 0; fish.dir = 1; }
    fish.splash = Math.max(0, fish.splash - dt * 1.6);

    var sky = g.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, '#e8f8ff');
    sky.addColorStop(0.42, '#b7e6fa');
    sky.addColorStop(1, '#8ed3ef');
    g.fillStyle = sky;
    g.fillRect(0, 0, w, h);

    // 물결
    g.strokeStyle = 'rgba(255,255,255,.55)';
    g.lineWidth = 3;
    for (var i = 0; i < 3; i++) {
      g.beginPath();
      var yy = 70 + i * 34;
      for (var x = 0; x <= w; x += 20) {
        var py = yy + Math.sin((x * 0.03) + t * 1.4 + i) * 5;
        if (x === 0) g.moveTo(x, py); else g.lineTo(x, py);
      }
      g.stroke();
    }

    // 헤엄치는 젤리들
    var swimmers = [
      { x: (t * 34) % (w + 90) - 45, y: 118, s: 1, c: '#ff9db4' },
      { x: w - ((t * 26 + 120) % (w + 90)) + 45, y: 152, s: 0.8, c: '#ffd873' },
      { x: (t * 20 + 180) % (w + 90) - 45, y: 92, s: 0.7, c: '#c7b0ff' }
    ];
    for (var s = 0; s < swimmers.length; s++) {
      drawSwimmer(g, swimmers[s], t);
    }

    // 낚시줄과 찌
    var bobY = 74 + Math.sin(t * 2.2) * 5;
    var bx = 180;
    g.strokeStyle = 'rgba(120,90,70,.55)';
    g.lineWidth = 1.6;
    g.beginPath();
    g.moveTo(bx, 0);
    g.quadraticCurveTo(bx + 3, 30, bx, bobY);
    g.stroke();
    g.fillStyle = '#ff7fae';
    A.ell(g, bx, bobY, 9, 11);
    g.fill();
    g.fillStyle = '#fff';
    A.ell(g, bx, bobY + 3, 9, 4.5);
    g.fill();
    g.fillStyle = '#ff7fae';
    A.ell(g, bx, bobY + 3, 9, 2.2);
    g.fill();

    if (fish.splash > 0) {
      g.save();
      g.globalAlpha = fish.splash;
      g.strokeStyle = 'rgba(255,255,255,.9)';
      g.lineWidth = 3;
      for (var r = 0; r < 3; r++) {
        g.beginPath();
        g.ellipse(bx, bobY + 8, 12 + (1 - fish.splash) * 40 + r * 6, 6 + (1 - fish.splash) * 18 + r * 3, 0, 0, TAU);
        g.stroke();
      }
      g.restore();
      A.drawSweet(g, fish.lastType || 'gummy', bx, bobY - 6, 34, t);
    }

    // 타이밍 바
    var barX = 26, barY = h - 34, barW = w - 52, barH = 18;
    g.fillStyle = 'rgba(255,255,255,.75)';
    A.rr(g, barX - 4, barY - 4, barW + 8, barH + 8, 12);
    g.fill();
    g.fillStyle = '#e7f2d8';
    A.rr(g, barX, barY, barW, barH, 9);
    g.fill();
    g.fillStyle = 'rgba(126,200,120,.85)';
    A.rr(g, barX + barW * fish.zoneStart, barY, barW * fish.zone, barH, 9);
    g.fill();
    g.fillStyle = 'rgba(255,255,255,.8)';
    A.rr(g, barX + barW * fish.zoneStart + 2, barY + 2, barW * fish.zone - 4, barH * 0.35, 5);
    g.fill();
    // 마커
    var mx = barX + barW * fish.pos;
    g.fillStyle = '#ff5f86';
    A.rr(g, mx - 5, barY - 8, 10, barH + 16, 5);
    g.fill();
    g.fillStyle = '#fff';
    g.beginPath();
    g.moveTo(mx, barY - 12);
    g.lineTo(mx - 7, barY - 20);
    g.lineTo(mx + 7, barY - 20);
    g.closePath();
    g.fill();

    // 안내
    g.font = '900 13px "Apple SD Gothic Neo","Malgun Gothic",system-ui,sans-serif';
    g.textAlign = 'center';
    g.fillStyle = '#5f7f92';
    g.fillText('녹색 칸에서 톡!', w / 2, 26);
  }

  function drawSwimmer(g, s, t) {
    g.save();
    g.translate(s.x, s.y + Math.sin(t * 2 + s.y) * 3);
    g.scale(s.s, s.s);
    g.globalAlpha = 0.85;
    g.fillStyle = s.c;
    A.ell(g, 0, 0, 13, 8);
    g.fill();
    g.beginPath();
    g.moveTo(11, 0);
    g.lineTo(20, -7);
    g.lineTo(20, 7);
    g.closePath();
    g.fill();
    g.fillStyle = 'rgba(255,255,255,.85)';
    A.circ(g, -5, -2, 1.8);
    g.fill();
    g.fillStyle = '#3a2b26';
    A.circ(g, -3.5, -1.6, 1);
    g.fill();
    g.restore();
  }

  /* ---------------- 상점과 꾸미기 ---------------- */

  function openSheet(title) {
    sheetTitle.textContent = title;
    sheetOpen = true;
    scrim.classList.add('show');
    sheet.classList.add('open');
    sheet.setAttribute('aria-hidden', 'false');
    walk.target = null;
  }

  function closeSheet() {
    sheetOpen = false;
    scrim.classList.remove('show');
    sheet.classList.remove('open');
    sheet.setAttribute('aria-hidden', 'true');
  }

  function buildShop() {
    sheetBody.innerHTML = '';
    var grid = document.createElement('div');
    grid.className = 'shop-grid';
    for (var i = 0; i < W.shop.length; i++) {
      (function (it) {
        var card = document.createElement('div');
        card.className = 'shop-card';

        var th = document.createElement('div');
        th.className = 'shop-thumb';
        th.appendChild(thumbFurniture(it.id, 62));
        card.appendChild(th);

        var nm = document.createElement('div');
        nm.className = 'shop-name';
        nm.textContent = it.name;
        card.appendChild(nm);

        var ds = document.createElement('div');
        ds.className = 'shop-desc';
        ds.textContent = it.desc;
        card.appendChild(ds);

        var own = document.createElement('div');
        own.className = 'shop-owned';
        var cnt = S.owned[it.id] || 0;
        own.textContent = cnt > 0 ? ('가지고 있는 것 ' + cnt + '개') : ' ';
        card.appendChild(own);

        var btn = document.createElement('button');
        btn.className = 'shop-buy';
        btn.innerHTML = COIN_SVG + ' <span>' + it.price + '</span>';
        btn.addEventListener('click', function () { buy(it); });
        card.appendChild(btn);

        grid.appendChild(card);
      })(W.shop[i]);
    }
    sheetBody.appendChild(grid);
    var note = document.createElement('div');
    note.className = 'help-note';
    note.textContent = '산 가구는 아래 꾸미기 버튼을 눌러 마을에 놓을 수 있어요.';
    sheetBody.appendChild(note);
  }

  function buy(it) {
    if (S.coins < it.price) {
      toast('별 코인이 ' + (it.price - S.coins) + '개 더 필요해요!');
      Sound.nope();
      return;
    }
    S.coins -= it.price;
    S.owned[it.id] = (S.owned[it.id] || 0) + 1;
    Sound.buy();
    save();
    updateHud();
    buildShop();
    toast(it.name + '을(를) 샀어요! 꾸미기로 놓아 보세요', 'gold');
    addCoinPart(S.px * TILE, S.py * TILE - 40);
  }

  function toggleDeco() {
    deco.on = !deco.on;
    if (deco.on) {
      closeSheet();
      dialogueCloseIfOpen();
      app.classList.add('deco');
      decoBar.classList.add('show');
      deco.sel = firstOwned();
      buildDecoBar();
      walk.target = null;
      toast('노란 점선 안을 톡 누르면 가구가 놓여요');
      Sound.blip();
    } else {
      app.classList.remove('deco');
      decoBar.classList.remove('show');
      deco.hover = null;
      Sound.blip();
    }
    updateInteract();
  }

  function dialogueCloseIfOpen() {
    if (dialogueOpen) closeDialogue();
  }

  function firstOwned() {
    for (var k in S.owned) if (S.owned[k] > 0) return k;
    return null;
  }

  function buildDecoBar() {
    decoItems.innerHTML = '';
    var any = false;
    for (var i = 0; i < W.shop.length; i++) {
      var it = W.shop[i];
      var cnt = S.owned[it.id] || 0;
      if (cnt <= 0) continue;
      any = true;
      (function (it, cnt) {
        var b = document.createElement('button');
        b.className = 'deco-item' + (deco.sel === it.id ? ' sel' : '');
        b.appendChild(thumbFurniture(it.id, 44));
        var lb = document.createElement('span');
        lb.textContent = it.name.replace('롤리팝 ', '');
        b.appendChild(lb);
        var cc = document.createElement('span');
        cc.className = 'cnt';
        cc.textContent = cnt;
        b.appendChild(cc);
        b.addEventListener('click', function () {
          deco.sel = it.id;
          buildDecoBar();
          Sound.blip();
        });
        decoItems.appendChild(b);
      })(it, cnt);
    }
    if (!any) {
      var empty = document.createElement('div');
      empty.className = 'deco-empty';
      empty.textContent = '아직 가구가 없어요. 상점에서 사 보세요!';
      decoItems.appendChild(empty);
      var sb = document.createElement('button');
      sb.className = 'deco-item';
      sb.appendChild(thumbFurniture('lamppost', 44));
      var sl = document.createElement('span');
      sl.textContent = '상점';
      sb.appendChild(sl);
      sb.addEventListener('click', openShop);
      decoItems.appendChild(sb);
    }
    decoHint.textContent = deco.sel
      ? (FURN_NAME[deco.sel] + '을(를) 놓을 곳을 톡 누르세요')
      : '놓을 가구를 골라 주세요';
  }

  function decoTap(sx, sy) {
    var wp = s2w(sx, sy);
    var tx = Math.floor(wp.x / TILE), ty = Math.floor(wp.y / TILE);
    if (tx < 0 || ty < 0 || tx >= W.MAP_W || ty >= W.MAP_H) return;

    var existing = null;
    for (var i = 0; i < S.placed.length; i++) {
      if (S.placed[i].x === tx && S.placed[i].y === ty) { existing = S.placed[i]; break; }
    }
    if (existing) {
      S.placed.splice(S.placed.indexOf(existing), 1);
      S.owned[existing.t] = (S.owned[existing.t] || 0) + 1;
      deco.sel = existing.t;
      Sound.pop();
      save();
      buildDecoBar();
      toast(FURN_NAME[existing.t] + '을(를) 가져왔어요');
      return;
    }
    if (!deco.sel) {
      var f = firstOwned();
      if (!f) { toast('상점에서 가구를 먼저 사 보세요!'); return; }
      deco.sel = f;
    }
    if ((S.owned[deco.sel] || 0) <= 0) {
      toast('그 가구는 다 놓았어요!');
      return;
    }
    if (!W.placeable(tx, ty)) {
      toast('여기에는 놓을 수 없어요. 다른 곳을 눌러 보세요');
      Sound.nope();
      return;
    }
    S.placed.push({ t: deco.sel, x: tx, y: ty });
    S.owned[deco.sel]--;
    Sound.place();
    addSparkles((tx + 0.5) * TILE, (ty + 0.5) * TILE, 6);
    save();
    buildDecoBar();
    updateHud();

    // 가로등 부탁 완료
    var q = curQuest();
    if (q && S.stage === 'active' && q.kind === 'place' && placedCount(q.item) > 0) {
      S.coins += q.coins;
      S.questIdx++;
      S.stage = 'offer';
      Sound.success();
      Sound.coin();
      celebrateAt((tx + 0.5) * TILE, (ty + 0.5) * TILE - 20, q.coins);
      toast('마을이 반짝반짝! ' + nameOf(q.giver) + '가 기뻐해요. ★ +' + q.coins, 'gold');
      save();
      updateHud();
    }
  }

  /* ---------------- 도움말 ---------------- */

  function openHelp() {
    sheetTitle.textContent = '노는 방법';
    sheetBody.innerHTML = '';
    var ul = document.createElement('ul');
    ul.className = 'help-list';
    var tips = [
      '<b>톡 누르면 걸어가요.</b> 가고 싶은 곳을 화면에서 콕 누르면 엘리가 걸어가요.',
      '<b>동물 친구에게 말을 걸어요.</b> 친구 가까이 가면 오른쪽 아래 커다란 버튼이 <b>말 걸기</b>로 바뀌어요.',
      '<b>간식을 모아요.</b> 롤리팝 나무와 솜사탕 덤불, 마시멜로 덤불 가까이 가서 <b>줍기</b>를 눌러요.',
      '<b>연못에서 낚시해요.</b> 젤리 연못 가까이 가서 <b>낚시</b>를 누르고, 초록색 칸에 올 때 <b>톡!</b>',
      '<b>별 코인으로 상점에서 가구를 사요.</b> 왼쪽 아래 <b>상점</b> 버튼을 눌러요.',
      '<b>꾸미기</b>를 누르면 점선 칸을 톡 눌러 가구를 놓거나 다시 가져올 수 있어요.',
      '놀이는 폰에 저절로 저장돼요. 껐다 켜도 우리 마을이 그대로 남아 있어요.'
    ];
    for (var i = 0; i < tips.length; i++) {
      var li = document.createElement('li');
      li.innerHTML = tips[i];
      ul.appendChild(li);
    }
    sheetBody.appendChild(ul);

    var reset = document.createElement('button');
    reset.className = 'help-danger';
    reset.textContent = '마을 처음부터 다시 시작하기';
    reset.addEventListener('click', function () {
      if (window.confirm('정말 처음부터 다시 시작할까요?\n모은 간식과 가구, 별 코인이 모두 사라져요.')) {
        try { localStorage.removeItem(SAVE_KEY); } catch (e) { }
        window.location.reload();
      }
    });
    sheetBody.appendChild(reset);

    var note = document.createElement('div');
    note.className = 'help-note';
    note.textContent = '엘리를 위한 달콤한 마을 · 저장은 이 폰에만 돼요';
    sheetBody.appendChild(note);

    openSheet('노는 방법');
  }

  function openShop() {
    buildShop();
    openSheet('간식 상점');
  }

  /* ---------------- 입력 ---------------- */

  function canvasTap(e) {
    if (introOpen || dialogueOpen || sheetOpen || fishingOpen) return;
    var rect = cv.getBoundingClientRect();
    var sx = e.clientX - rect.left, sy = e.clientY - rect.top;
    Sound.unlock();
    if (deco.on) { decoTap(sx, sy); return; }
    var wp = s2w(sx, sy);
    setWalkTarget(wp.x / TILE, wp.y / TILE);
    addSparkles(wp.x, wp.y, 4);
  }

  cv.addEventListener('pointerdown', function (e) {
    if (e.button !== undefined && e.button !== 0) return;
    e.preventDefault();
    canvasTap(e);
  }, { passive: false });

  cv.addEventListener('contextmenu', function (e) { e.preventDefault(); });

  // 조이스틱
  function joyUpdate(e) {
    var r = stickZone.getBoundingClientRect();
    var cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    var dx = (e.clientX - cx) / (r.width * 0.4);
    var dy = (e.clientY - cy) / (r.height * 0.4);
    var len = Math.sqrt(dx * dx + dy * dy);
    if (len > 1) { dx /= len; dy /= len; len = 1; }
    if (len < 0.16) { dx = 0; dy = 0; }
    joy.dx = dx; joy.dy = dy;
    stickKnob.style.transform = 'translate(' + (dx * 32) + 'px,' + (dy * 36) + 'px)';
  }
  function joyEnd() {
    joy.active = false;
    joy.id = null;
    joy.dx = 0; joy.dy = 0;
    stickKnob.style.transform = 'translate(0,0)';
  }
  stickZone.addEventListener('pointerdown', function (e) {
    e.preventDefault();
    Sound.unlock();
    joy.active = true;
    joy.id = e.pointerId;
    try { stickZone.setPointerCapture(e.pointerId); } catch (err) { }
    joyUpdate(e);
  }, { passive: false });
  stickZone.addEventListener('pointermove', function (e) {
    if (!joy.active || e.pointerId !== joy.id) return;
    e.preventDefault();
    joyUpdate(e);
  }, { passive: false });
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(function (ev) {
    stickZone.addEventListener(ev, joyEnd);
  });

  btnAct.addEventListener('click', function () {
    Sound.unlock();
    if (deco.on) {
      toast('빈 땅(점선 칸)을 톡 눌러 가구를 놓아 보세요');
      return;
    }
    if (hint.kind === 'talk' && hint.target) talkTo(hint.target);
    else if (hint.kind === 'gather' && hint.target) gather(hint.target);
    else if (hint.kind === 'fish') openFishing();
    else toast('동물 친구나 간식 나무 가까이 가 보세요!');
  });

  btnShop.addEventListener('click', function () { Sound.unlock(); openShop(); });
  btnDeco.addEventListener('click', function () { Sound.unlock(); toggleDeco(); });
  btnDecoDone.addEventListener('click', function () { toggleDeco(); });
  btnDecoShop.addEventListener('click', function () { Sound.unlock(); openShop(); });
  btnHelp.addEventListener('click', function () { Sound.unlock(); openHelp(); });
  btnSound.addEventListener('click', function () { Sound.setMuted(!Sound.muted); });
  sheetClose.addEventListener('click', function () { closeSheet(); });
  scrim.addEventListener('click', function () { closeSheet(); });

  fishTap.addEventListener('pointerdown', function (e) { e.preventDefault(); fishTapHandler(); }, { passive: false });
  fishClose.addEventListener('click', function () { closeFishing(); });

  document.addEventListener('pointerdown', function () { Sound.unlock(); }, { once: false });

  window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (dialogueOpen) closeDialogue();
      else if (fishingOpen) closeFishing();
      else if (sheetOpen) closeSheet();
      else if (deco.on) toggleDeco();
    }
    if (e.key === ' ' && fishingOpen) { e.preventDefault(); fishTapHandler(); }
  });

  /* ---------------- 시작 ---------------- */

  function startGame() {
    introOpen = false;
    introEl.classList.add('hide');
    setTimeout(function () { introEl.style.display = 'none'; }, 450);
    hudEl.style.display = 'flex';
    S.seenIntro = true;
    writeSave();
    Sound.unlock();
    Sound.success();
    setTimeout(function () { toast('동물 친구에게 말을 걸어 보세요!', 'gold'); }, 600);
    updateHud();
  }

  function showIntro() {
    introOpen = true;
    introEl.style.display = 'flex';
    introEl.classList.remove('hide');
    hudEl.style.display = 'none';
  }

  introStart.addEventListener('click', function () {
    Sound.unlock();
    startGame();
  });

  function drawIntroArt(t, dt) {
    introCtx.clearRect(0, 0, introArt.width, introArt.height);
    A.drawIntroScene(introCtx, introArt.width, introArt.height, t);
  }

  /* ---------------- 메인 반복 ---------------- */

  var last = 0, lastSave = 0;

  function loop(now) {
    if (!last) last = now;
    var dt = Math.min(0.05, (now - last) / 1000);
    if (dt <= 0) dt = 0.016;
    last = now;
    var t = now / 1000;

    if (!introOpen) updateWorld(dt, t);
    render(t);
    if (fishingOpen) drawFishing(t, dt);
    if (introOpen) drawIntroArt(t, dt);

    if (!introOpen && now - lastSave > 5000) {
      lastSave = now;
      save();
    }
    requestAnimationFrame(loop);
  }

  /* ---------------- 초기화 ---------------- */

  function init() {
    resize();
    terrainCanvas = W.buildTerrainCanvas();
    cam.x = S.px * TILE;
    cam.y = S.py * TILE;
    cameraClamp();
    updateHud();
    updateInteract();
    lastCoins = S.coins;

    if (S.seenIntro) {
      introEl.classList.add('hide');
      introEl.style.display = 'none';
      hudEl.style.display = 'flex';
    } else {
      showIntro();
    }

    window.addEventListener('resize', resize);
    window.addEventListener('orientationchange', function () { setTimeout(resize, 180); });
    if (window.visualViewport) window.visualViewport.addEventListener('resize', resize);

    setTimeout(resize, 60);
    requestAnimationFrame(loop);
  }

  // 확인용으로 현재 상태를 읽을 수 있게 (놀이에는 영향 없음)
  window.__st = function () {
    var q = curQuest();
    return {
      coins: S.coins, inv: S.inv, owned: S.owned, placed: S.placed,
      px: Math.round(S.px * 100) / 100, py: Math.round(S.py * 100) / 100,
      questIdx: S.questIdx, stage: S.stage, quest: q ? q.title : null,
      hint: hint.kind, deco: deco.on, sel: deco.sel, fishing: fishingOpen,
      dialogue: dialogueOpen, sheet: sheetOpen, intro: introOpen,
      muted: Sound.muted
    };
  };

  init();
})();
