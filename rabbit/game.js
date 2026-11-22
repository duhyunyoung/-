/* =========================================================================
   토끼잡기 — 원본 규칙 그대로 (코리아보드게임즈 〈토끼잡기〉)
   52장 = 채소 12종 × 4장 + 토끼 도둑 4장 / 시작 시 토끼 1장 제외 → 51장
   ========================================================================= */
(function () {
  'use strict';

  /* ---------------------------------------------------------------- 데이터 */
  var VEG = [
    { key: 'carrot',   name: '당근',     emoji: '🥕', c1: '#F5871F', c2: '#FFE4C2' },
    { key: 'tomato',   name: '토마토',   emoji: '🍅', c1: '#E0473E', c2: '#FFD9D4' },
    { key: 'cucumber', name: '오이',     emoji: '🥒', c1: '#3E8E41', c2: '#D9EFC9' },
    { key: 'corn',     name: '옥수수',   emoji: '🌽', c1: '#CF9C05', c2: '#FFF1C2' },
    { key: 'eggplant', name: '가지',     emoji: '🍆', c1: '#6C4AB6', c2: '#E4D9FA' },
    { key: 'broccoli', name: '브로콜리', emoji: '🥦', c1: '#2E7D32', c2: '#D5EECF' },
    { key: 'onion',    name: '양파',     emoji: '🧅', c1: '#B066C6', c2: '#F3E0F8' },
    { key: 'pumpkin',  name: '호박',     emoji: '🎃', c1: '#D2761B', c2: '#FFE2BC' },
    { key: 'mushroom', name: '버섯',     emoji: '🍄', c1: '#A4664B', c2: '#F2E1D6' },
    { key: 'pepper',   name: '고추',     emoji: '🌶️', c1: '#C62828', c2: '#FFD2CE' },
    { key: 'potato',   name: '감자',     emoji: '🥔', c1: '#A8823F', c2: '#EFE1C4' },
    { key: 'cabbage',  name: '배추',     emoji: '🥬', c1: '#6F9E2E', c2: '#E8F6CA' }
  ];
  var RABBIT = { key: 'rabbit', name: '토끼 도둑', emoji: '🐰', c1: '#8D6E63', c2: '#EFE1DA', rabbit: true };
  var ORDER = {};
  VEG.forEach(function (v, i) { ORDER[v.key] = i; });
  ORDER.rabbit = 99;

  var AI_POOL = [
    { a: '🐻', n: '곰' }, { a: '🦊', n: '여우' }, { a: '🐼', n: '판다' },
    { a: '🐸', n: '개구리' }, { a: '🐧', n: '펭귄' }
  ];
  var PASS_AVATARS = ['🙂', '😎', '🐯', '🐷', '🐨', '🦁'];

  /* ---------------------------------------------------------------- 설정/상태 */
  var CONFIG = { mode: 'ai', count: 4, variant: false };
  var NAMES = { ai: null, pass: null };

  var S = {
    mode: 'ai', players: [], turn: 0, excluded: null, discards: [],
    phase: 'idle', over: false, sound: true, lastAddedUid: 0,
    turnCount: 0, dealing: false
  };

  var D = {};

  /* ---------------------------------------------------------------- 유틸 */
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var $one = function (sel, root) { return (root || document).querySelector(sel); };
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  var ri = function (n) { return Math.floor(Math.random() * n); };
  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) {
      var j = ri(i + 1), t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function cacheDom() {
    [
      'scr-start', 'scr-game', 'scr-result', 'mode-seg', 'mode-desc', 'count-seg',
      'count-value', 'names-list', 'variant-toggle', 'btn-start', 'btn-rules-start',
      'btn-sound', 'btn-rules', 'opponents', 'banner', 'stage', 'stage-cards',
      'discard', 'discard-cnt', 'me', 'me-avatar', 'me-name', 'turn-dot', 'me-count',
      'myhand', 'hint', 'res-emoji', 'res-title', 'res-sub', 'reveal-excluded',
      'reveal-left', 'reveal-note', 'result-list', 'btn-again', 'btn-home', 'cover',
      'cover-avatar', 'cover-name', 'cover-name2', 'btn-cover', 'modal',
      'btn-modal-x', 'btn-modal-ok'
    ].forEach(function (id) {
      D[id.replace(/-([a-z])/g, function (m, c) { return c.toUpperCase(); })] = document.getElementById(id);
    });
  }

  /* ---------------------------------------------------------------- 사운드 */
  var ac = null;
  function audio() {
    if (!S.sound) return null;
    if (!ac) {
      try { ac = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { ac = null; }
    }
    if (ac && ac.state === 'suspended') { try { ac.resume(); } catch (e) {} }
    return ac;
  }
  function tone(freq, dur, type, vol, delay) {
    var a = audio(); if (!a) return;
    dur = dur || 0.09; type = type || 'sine'; vol = vol || 0.05; delay = delay || 0;
    var t = a.currentTime + delay;
    var o = a.createOscillator(), g = a.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(a.destination);
    o.start(t); o.stop(t + dur + 0.03);
  }
  var sfx = {
    tap: function () { tone(520, 0.05, 'triangle', 0.045); },
    draw: function () { tone(360, 0.06, 'sine', 0.05); tone(520, 0.07, 'sine', 0.04, 0.05); },
    pair: function () { tone(660, 0.08, 'triangle', 0.055); tone(990, 0.12, 'triangle', 0.045, 0.08); },
    pop: function () { tone(780, 0.05, 'square', 0.025); },
    escape: function () { tone(523, 0.1, 'sine', 0.055); tone(659, 0.1, 'sine', 0.055, 0.09); tone(784, 0.16, 'sine', 0.055, 0.18); },
    win: function () { tone(523, 0.1, 'sine', 0.06); tone(784, 0.1, 'sine', 0.06, 0.1); tone(1046, 0.22, 'sine', 0.06, 0.2); },
    lose: function () { tone(392, 0.16, 'sawtooth', 0.035); tone(311, 0.16, 'sawtooth', 0.035, 0.15); tone(233, 0.3, 'sawtooth', 0.035, 0.3); }
  };

  /* ---------------------------------------------------------------- 카드 */
  var uid = 0;
  function makeCard(def) {
    return { uid: ++uid, key: def.key, name: def.name, emoji: def.emoji, c1: def.c1, c2: def.c2, rabbit: !!def.rabbit };
  }
  function createDeck() {
    var deck = [];
    VEG.forEach(function (v) { for (var i = 0; i < 4; i++) deck.push(makeCard(v)); });
    for (var i = 0; i < 4; i++) deck.push(makeCard(RABBIT));
    return deck; // 52장
  }
  function sortHand(p) {
    p.hand.sort(function (a, b) { return (ORDER[a.key] || 0) - (ORDER[b.key] || 0); });
  }
  function discardPairs(p) {
    var groups = {}, k;
    p.hand.forEach(function (c) { (groups[c.key] = groups[c.key] || []).push(c); });
    var removed = [];
    Object.keys(groups).forEach(function (key) {
      var arr = groups[key];
      var n = arr.length - (arr.length % 2);
      for (var i = 0; i < n; i++) removed.push(arr[i]);
    });
    if (removed.length) {
      p.hand = p.hand.filter(function (c) { return removed.indexOf(c) === -1; });
    }
    return removed;
  }

  function cardEl(card) {
    var el = document.createElement('div');
    el.className = 'card' + (card.rabbit ? ' rabbit' : '');
    el.style.setProperty('--c1', card.c1);
    el.style.setProperty('--c2', card.c2);
    var em = document.createElement('span'); em.className = 'emoji'; em.textContent = card.emoji;
    var nm = document.createElement('span'); nm.className = 'nm'; nm.textContent = card.name;
    el.appendChild(em); el.appendChild(nm);
    el._card = card;
    return el;
  }
  function backEl() {
    var el = document.createElement('div');
    el.className = 'card back';
    var s = document.createElement('span'); s.className = 'emblem'; s.textContent = '🌿';
    el.appendChild(s);
    return el;
  }

  /* ---------------------------------------------------------------- 레이아웃/좌표 */
  function rectOf(el) {
    var r = el.getBoundingClientRect();
    return { left: r.left, top: r.top, width: r.width, height: r.height };
  }
  function stageSlotRect() {
    var r = D.stage.getBoundingClientRect();
    var w = 76, h = 108;
    return { left: r.left + r.width / 2 - w / 2, top: r.top + r.height / 2 - h / 2, width: w, height: h };
  }
  function handSlotRect() {
    var r = D.myhand.getBoundingClientRect();
    var w = 58, h = 84;
    return { left: r.left + r.width / 2 - w / 2, top: r.top + r.height / 2 - h / 2 + 6, width: w, height: h };
  }
  function panelRect(id) {
    var el = $one('.opp[data-id="' + id + '"]');
    if (el) return rectOf(el);
    return stageSlotRect();
  }

  function flyGhost(from, to, opts) {
    opts = opts || {};
    var dur = opts.dur || 340;
    var el = opts.back ? backEl() : cardEl(opts.card);
    el.classList.add('ghost');
    el.style.left = from.left + 'px';
    el.style.top = from.top + 'px';
    el.style.width = from.width + 'px';
    el.style.height = from.height + 'px';
    el.style.fontSize = Math.max(9, from.width * 0.42) + 'px';
    document.body.appendChild(el);
    el.getBoundingClientRect(); // reflow
    var scale = to.width / from.width;
    var dx = to.left - from.left + (to.width - from.width * scale) / 2;
    var dy = to.top - from.top + (to.height - from.height * scale) / 2;
    el.style.transition = 'transform ' + dur + 'ms cubic-bezier(.2,.8,.3,1)';
    el.style.transform = 'translate(' + dx + 'px,' + dy + 'px) scale(' + scale + ') rotate(' + (opts.spin || 0) + 'deg)';
    return sleep(dur + 20).then(function () { el.remove(); });
  }

  function showStage(cards, isBack) {
    D.stageCards.innerHTML = '';
    var out = [];
    cards.forEach(function (c) {
      var el = isBack ? backEl() : cardEl(c);
      el.classList.add('stage-card', 'enter');
      D.stageCards.appendChild(el);
      out.push(el);
    });
    return out;
  }
  function clearStage() { D.stageCards.innerHTML = ''; }

  function bumpDiscard() {
    D.discardCnt.textContent = String(Math.floor(S.discards.length / 2));
    D.discard.classList.remove('bump');
    void D.discard.offsetWidth;
    D.discard.classList.add('bump');
  }
  function renderDiscard() {
    D.discardCnt.textContent = String(Math.floor(S.discards.length / 2));
  }

  /* ---------------------------------------------------------------- 배너/힌트 */
  function setBanner(html) {
    D.banner.innerHTML = html;
    D.banner.classList.remove('flash');
    void D.banner.offsetWidth;
    D.banner.classList.add('flash');
  }
  function setHint(t) { D.hint.textContent = t || ''; }

  /* ---------------------------------------------------------------- 시작 화면 */
  function defaultRows(mode) {
    var rows = [];
    if (mode === 'ai') {
      rows.push({ name: '나', avatar: '🙂', ai: false });
      AI_POOL.forEach(function (a) { rows.push({ name: a.n, avatar: a.a, ai: true }); });
    } else {
      PASS_AVATARS.forEach(function (av, i) { rows.push({ name: '플레이어 ' + (i + 1), avatar: av, ai: false }); });
    }
    return rows;
  }
  function store(mode) {
    if (!NAMES[mode]) NAMES[mode] = defaultRows(mode);
    return NAMES[mode];
  }

  function renderNames() {
    var list = D.namesList;
    list.innerHTML = '';
    var rows = store(CONFIG.mode);
    for (var i = 0; i < CONFIG.count; i++) {
      var r = rows[i];
      var row = document.createElement('div');
      row.className = 'name-row';

      var av = document.createElement('span'); av.className = 'avatar'; av.textContent = r.avatar;
      var input = document.createElement('input');
      input.className = 'name-input';
      input.maxLength = 8;
      input.value = r.name;
      input.setAttribute('aria-label', '플레이어 이름');
      (function (target) {
        input.addEventListener('input', function () { target.name = this.value; });
      })(r);
      var tag = document.createElement('span');
      tag.className = 'tag' + (r.ai ? ' ai' : '');
      tag.textContent = r.ai ? 'AI' : (CONFIG.mode === 'pass' ? 'P' + (i + 1) : '나');

      row.appendChild(av); row.appendChild(input); row.appendChild(tag);
      list.appendChild(row);
    }
  }

  function initStartScreen() {
    D.modeSeg.addEventListener('click', function (e) {
      var b = e.target.closest('.seg-btn');
      if (!b) return;
      CONFIG.mode = b.dataset.mode;
      $$('.seg-btn', D.modeSeg).forEach(function (x) { x.classList.toggle('active', x === b); });
      D.modeDesc.textContent = CONFIG.mode === 'ai'
        ? '나 1명 + AI 1~5명. AI가 차례를 자동으로 진행해요.'
        : '한 기기를 돌려가며 2~6명이 함께. 차례마다 가림막이 나와요.';
      renderNames();
      sfx.tap();
    });

    D.countSeg.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      CONFIG.count = parseInt(b.dataset.count, 10);
      $$('button', D.countSeg).forEach(function (x) { x.classList.toggle('active', x === b); });
      D.countValue.textContent = CONFIG.count + '명';
      renderNames();
      sfx.tap();
    });

    D.variantToggle.addEventListener('click', function () {
      CONFIG.variant = !CONFIG.variant;
      D.variantToggle.setAttribute('aria-checked', CONFIG.variant ? 'true' : 'false');
      sfx.tap();
    });

    D.btnStart.addEventListener('click', startGame);
    D.btnRulesStart.addEventListener('click', openModal);
    D.btnAgain.addEventListener('click', startGame);
    D.btnHome.addEventListener('click', function () {
      showScreen('start');
      renderNames();
    });
    D.btnRules.addEventListener('click', openModal);
    D.btnModalX.addEventListener('click', closeModal);
    D.btnModalOk.addEventListener('click', closeModal);
    D.modal.addEventListener('click', function (e) { if (e.target === D.modal) closeModal(); });

    D.btnSound.addEventListener('click', function () {
      S.sound = !S.sound;
      updateSoundBtn();
      try { localStorage.setItem('tokki-sound', S.sound ? 'on' : 'off'); } catch (e) {}
      if (S.sound) sfx.tap();
    });

    var rt = null;
    window.addEventListener('resize', function () {
      clearTimeout(rt);
      rt = setTimeout(function () {
        if (D.scrGame.classList.contains('active') && S.phase !== 'anim' && !S.dealing) renderBoard();
      }, 150);
    });
  }

  function updateSoundBtn() { D.btnSound.textContent = S.sound ? '🔊' : '🔇'; }

  function openModal() { D.modal.classList.remove('hidden'); }
  function closeModal() { D.modal.classList.add('hidden'); }

  function showScreen(name) {
    ['scrStart', 'scrGame', 'scrResult'].forEach(function (k) {
      D[k].classList.toggle('active', k === 'scr' + name.charAt(0).toUpperCase() + name.slice(1));
    });
    if (name === 'result') D.scrResult.scrollTop = 0;
    if (name === 'start') D.scrStart.scrollTop = 0;
  }

  /* ---------------------------------------------------------------- 게임 준비 */
  function buildPlayers() {
    var rows = store(CONFIG.mode);
    S.players = [];
    for (var i = 0; i < CONFIG.count; i++) {
      var r = rows[i];
      var nm = (r.name || '').trim();
      if (!nm) nm = (i === 0 ? '나' : '플레이어 ' + (i + 1));
      S.players.push({
        id: i, name: nm, avatar: r.avatar,
        ai: (S.mode === 'ai' ? i > 0 : false),
        hand: [], escaped: false, pairs: 0, initialRemoved: []
      });
    }
  }

  function dealRound() {
    var deck = shuffle(createDeck());
    if (CONFIG.variant) {
      S.excluded = deck.splice(ri(deck.length), 1)[0];       // 공식 변형: 무작위 1장 빼기
    } else {
      var idx = 0;
      for (var i = 0; i < deck.length; i++) { if (deck[i].rabbit) { idx = i; break; } }
      S.excluded = deck.splice(idx, 1)[0];                   // 원본 기본: 토끼 카드 1장 제외
    }

    S.players.forEach(function (p) { p.hand = []; p.escaped = false; p.pairs = 0; p.initialRemoved = []; });
    deck.forEach(function (c, i) { S.players[i % S.players.length].hand.push(c); });

    S.discards = [];
    S.players.forEach(function (p) {
      sortHand(p);
      p.initialRemoved = discardPairs(p);
      p.pairs = Math.floor(p.initialRemoved.length / 2);
      if (p.initialRemoved.length) S.discards.push.apply(S.discards, p.initialRemoved);
      if (p.hand.length === 0) p.escaped = true;
    });

    S.turn = 0;
    for (var j = 0; j < S.players.length; j++) {
      if (S.players[j].hand.length > 0) { S.turn = j; break; }
    }
  }

  function startGame() {
    S.mode = CONFIG.mode;
    S.over = false;
    S.phase = 'setup';
    S.turnCount = 0;
    S.lastAddedUid = 0;
    S.discards = [];
    buildPlayers();
    dealRound();
    clearStage();
    showScreen('game');
    renderBoard();
    renderDiscard();
    setHint('');
    setBanner('🃏 카드를 고르게 나눠 주는 중…');
    dealSequence();
  }

  async function dealSequence() {
    S.dealing = true;
    await sleep(620);
    var escapers = S.players.filter(function (p) { return p.escaped; });
    var any = false;
    for (var i = 0; i < S.players.length; i++) {
      var p = S.players[i];
      if (p.initialRemoved.length) {
        any = true;
        setBanner(p.avatar + ' ' + esc(p.name) + ' — 같은 카드 <em>' +
          p.initialRemoved.length + '장</em>을 바로 버렸어요');
        sfx.pop();
        bumpDiscard();
        await sleep(430);
      }
    }
    if (!any) {
      setBanner('아무도 처음에 버릴 짝이 없었어요. 바로 시작!');
      await sleep(560);
    }
    for (var k = 0; k < escapers.length; k++) {
      setBanner('🎉 ' + escapers[k].avatar + ' <em>' + esc(escapers[k].name) + '</em>, 카드가 없어 바로 탈출!');
      sfx.escape();
      await sleep(900);
    }
    S.dealing = false;
    renderBoard();
    if (checkOver()) { finishGame(); return; }
    startTurn();
  }

  /* ---------------------------------------------------------------- 렌더 */
  function viewingId() { return S.mode === 'ai' ? 0 : S.turn; }
  function alivePlayers() { return S.players.filter(function (p) { return p.hand.length > 0; }); }
  function checkOver() { return alivePlayers().length <= 1; }

  function targetIndexFor(fromId) {
    var n = S.players.length;
    for (var k = 1; k <= n; k++) {
      var i = (fromId + k) % n;
      if (S.players[i].hand.length > 0) return i;
    }
    return -1;
  }

  function renderBoard(opts) {
    opts = opts || {};
    if (!S.players.length) return;
    var viewId = viewingId();
    var needTarget = (S.phase === 'pick' && S.players[S.turn] && !S.players[S.turn].ai);
    var targetId = needTarget ? targetIndexFor(S.turn) : -1;
    renderOpponents(viewId, targetId);
    renderMeHead(viewId);
    if (!opts.skipHand) renderMyHand(viewId);
    renderDiscard();
    D.turnDot.hidden = !(S.players[S.turn] && S.players[S.turn].id === viewId && S.phase === 'pick');
  }

  function renderMeHead(viewId) {
    var me = S.players[viewId];
    if (!me) return;
    D.meAvatar.textContent = me.avatar;
    D.meName.textContent = me.name;
    D.meCount.textContent = me.hand.length + '장';
  }

  function renderOpponents(viewId, targetId) {
    var box = D.opponents;
    box.innerHTML = '';
    var opps = S.players.filter(function (p) { return p.id !== viewId; });
    var n = opps.length;
    var cols = n <= 3 ? Math.max(1, n) : (n === 4 ? 2 : 3);
    box.style.gridTemplateColumns = 'repeat(' + cols + ',minmax(0,1fr))';

    opps.forEach(function (p) {
      var isTarget = (p.id === targetId);
      var acting = (S.phase === 'anim' && S.players[S.turn] && S.players[S.turn].id === p.id);
      var el = document.createElement('div');
      el.className = 'opp' + (isTarget ? ' target' : '') + (p.escaped ? ' escaped' : '') + (acting ? ' acting' : '');
      el.dataset.id = p.id;

      var top = document.createElement('div');
      top.className = 'opp-top';
      var av = document.createElement('span'); av.className = 'opp-av'; av.textContent = p.avatar;
      var nm = document.createElement('span'); nm.className = 'opp-name'; nm.textContent = p.name;
      var ct = document.createElement('span'); ct.className = 'opp-cnt'; ct.textContent = p.hand.length;
      top.appendChild(av); top.appendChild(nm); top.appendChild(ct);
      el.appendChild(top);

      var hand = document.createElement('div');
      hand.className = 'opp-hand';
      if (p.escaped) {
        var badge = document.createElement('span');
        badge.className = 'escaped-badge';
        badge.textContent = '🎉 탈출';
        hand.appendChild(badge);
      } else {
        p.hand.forEach(function (c, i) {
          var mb = document.createElement('div');
          mb.className = 'mini-back';
          mb.style.zIndex = i;
          if (isTarget) {
            mb.setAttribute('role', 'button');
            mb.setAttribute('aria-label', '카드 뽑기');
            mb.addEventListener('click', function (ev) {
              ev.stopPropagation();
              onPick(p.id, i, mb);
            });
          }
          hand.appendChild(mb);
        });
      }
      el.appendChild(hand);

      if (isTarget) {
        var tag = document.createElement('span');
        tag.className = 'tap-tag';
        tag.textContent = '뽑기 👆';
        el.appendChild(tag);
      }
      box.appendChild(el);
    });

    $$('.opp-hand', box).forEach(layoutMini);
  }

  function layoutMini(handEl) {
    var cards = $$('.mini-back', handEl);
    var n = cards.length;
    if (!n) return;
    var W = handEl.clientWidth || 120;
    var cw = 20;
    var step = n > 1 ? Math.min(cw * 0.66, (W - cw) / (n - 1)) : 0;
    cards.forEach(function (c, i) {
      c.style.left = Math.max(0, Math.min(W - cw, i * step)) + 'px';
    });
  }

  function renderMyHand(viewId) {
    var me = S.players[viewId];
    if (!me) return;
    var box = D.myhand;
    box.innerHTML = '';
    if (!me.hand.length) {
      var e = document.createElement('div');
      e.className = 'hand-empty';
      e.textContent = me.escaped ? '🎉 카드 0장 — 탈출!' : '손에 카드가 없어요';
      box.appendChild(e);
      S.lastAddedUid = 0;
      return;
    }
    var W = box.clientWidth || 340;
    var n = me.hand.length;
    var cw = window.innerWidth <= 360 ? 52 : 58;
    var step = n > 1 ? Math.min(cw * 0.80, (W - cw - 4) / (n - 1)) : 0;
    var total = cw + (n - 1) * step;
    var startX = Math.max(2, (W - total) / 2);
    var mid = (n - 1) / 2;

    me.hand.forEach(function (c, i) {
      var el = cardEl(c);
      el.classList.add('hand-card');
      if (c.uid === S.lastAddedUid) el.classList.add('just-added');
      var t = i - mid;
      var rot = t * 2.4;
      var lift = Math.min(9, Math.abs(t) * Math.abs(t) * 0.55);
      el.style.left = (startX + i * step) + 'px';
      el.style.bottom = (5 + lift) + 'px';
      el.style.transform = 'rotate(' + rot + 'deg)';
      el.style.zIndex = i;
      box.appendChild(el);
    });
    S.lastAddedUid = 0;
  }

  /* ---------------------------------------------------------------- 턴 진행 */
  function startTurn() {
    if (S.over) return;
    var p = S.players[S.turn];
    if (!p) return;
    if (p.hand.length === 0) { advanceTurn(); return; }
    S.phase = 'start';
    renderBoard();
    if (S.mode === 'pass') {
      showCover(p, function () { beginTurnFor(p); });
    } else {
      beginTurnFor(p);
    }
  }

  function beginTurnFor(p) {
    if (S.over || S.phase === 'over') return;
    var t = targetIndexFor(p.id);
    if (t < 0) { if (checkOver()) finishGame(); return; }
    S.phase = 'pick';
    renderBoard();
    var target = S.players[t];
    if (p.ai) {
      setBanner(p.avatar + ' <em>' + esc(p.name) + '</em>의 차례 — ' + target.avatar + ' ' + esc(target.name) + '의 패에서 카드 뽑기');
      setHint('');
      aiAct(p, t);
    } else {
      setBanner(p.avatar + ' <em>' + esc(p.name) + '</em>의 차례 — ' + target.avatar + ' ' + esc(target.name) + '의 패에서 1장!');
      setHint('👆 ' + target.name + '의 카드 뒷면을 탭하세요');
    }
  }

  function showCover(p, cb) {
    D.coverAvatar.textContent = p.avatar;
    D.coverName.textContent = p.name;
    D.coverName2.textContent = p.name;
    D.cover.classList.remove('hidden');
    D.btnCover.onclick = function () {
      D.cover.classList.add('hidden');
      sfx.tap();
      D.btnCover.onclick = null;
      cb();
    };
  }

  function onPick(targetId, index, el) {
    if (S.phase !== 'pick') return;
    var drawer = S.players[S.turn];
    if (!drawer || drawer.ai) return;
    performDraw({ drawerId: drawer.id, targetId: targetId, index: index, srcEl: el, reveal: true });
  }

  async function aiAct(p, tIdx) {
    var target = S.players[tIdx];
    await sleep(620 + ri(300));
    if (S.over || S.phase !== 'pick') return;
    if (!target.hand.length) return;
    var index = ri(target.hand.length);
    var panel = $one('.opp[data-id="' + tIdx + '"]');
    var backs = panel ? $$('.mini-back', panel) : [];
    var src = backs[index] || panel;
    setBanner(p.avatar + ' ' + esc(p.name) + ' → ' + target.avatar + ' ' + esc(target.name) + ' 카드 1장 뽑는 중…');
    await sleep(230);
    if (S.over || S.phase !== 'pick') return;
    performDraw({ drawerId: p.id, targetId: tIdx, index: index, srcEl: src, reveal: false });
  }

  /* ---------------------------------------------------------------- 뽑기 처리 */
  async function performDraw(o) {
    if (S.phase !== 'pick') return;
    var drawer = S.players[o.drawerId];
    var target = S.players[o.targetId];
    if (!drawer || !target) return;
    var card = target.hand[o.index];
    if (!card) return;

    S.phase = 'anim';
    var from = o.srcEl ? rectOf(o.srcEl) : stageSlotRect();
    var to = stageSlotRect();
    renderBoard({ skipHand: true });
    setHint('');

    await flyGhost(from, to, { back: true, dur: 320 });
    sfx.draw();

    /* --- 규칙 판정 --- */
    var partner = null;
    for (var i = 0; i < drawer.hand.length; i++) {
      if (drawer.hand[i].key === card.key) { partner = drawer.hand[i]; break; }
    }
    target.hand.splice(o.index, 1);

    var paired = false;
    if (partner) {
      paired = true;
      drawer.hand = drawer.hand.filter(function (c) { return c !== partner; });
      drawer.pairs += 1;
      S.discards.push(card, partner);
    } else {
      drawer.hand.push(card);
      sortHand(drawer);
      S.lastAddedUid = card.uid;
    }

    var targetOut = target.hand.length === 0;
    if (targetOut) target.escaped = true;
    var drawerOut = drawer.hand.length === 0;
    if (drawerOut) drawer.escaped = true;

    renderBoard({ skipHand: true });

    /* --- 연출 --- */
    if (paired) {
      setBanner('짝! <em>' + card.emoji + ' ' + card.name + '</em> 2장을 버렸어요');
      sfx.pair();
      var pels = showStage([card, partner]);
      await sleep(680);
      await flyToDiscard(pels);
      clearStage();
      renderBoard();
    } else if (o.reveal) {
      setBanner(card.rabbit
        ? '😱 <em>토끼 도둑</em> 카드! 짝이 없어 손에 담았어요'
        : card.emoji + ' ' + card.name + ' — 짝이 없으니 손에 담아요');
      sfx.pop();
      var rels = showStage([card]);
      await sleep(600);
      var rr = rels[0].getBoundingClientRect();
      rels[0].remove();
      await flyGhost({ left: rr.left, top: rr.top, width: rr.width, height: rr.height }, handSlotRect(), { card: card, dur: 300, spin: -6 });
      clearStage();
      renderBoard();
    } else {
      setBanner('짝이 없어 ' + drawer.avatar + ' ' + esc(drawer.name) + '가 가져갔어요');
      var bels = showStage([null], true);
      await sleep(520);
      var br = bels[0].getBoundingClientRect();
      bels[0].remove();
      await flyGhost({ left: br.left, top: br.top, width: br.width, height: br.height }, panelRect(drawer.id), { back: true, dur: 300 });
      clearStage();
      renderBoard();
    }

    /* --- 탈출 안내 --- */
    if (targetOut) {
      setBanner('🎉 ' + target.avatar + ' <em>' + esc(target.name) + '</em> 탈출! 손에 카드가 없어요');
      sfx.escape();
      await sleep(880);
    }
    if (drawerOut) {
      setBanner('🎉 ' + drawer.avatar + ' <em>' + esc(drawer.name) + '</em> 탈출! 손에 카드가 없어요');
      sfx.escape();
      await sleep(880);
    }

    S.turnCount += 1;
    if (checkOver() || S.turnCount > 600) { finishGame(); return; }
    advanceTurn();
  }

  async function flyToDiscard(els) {
    var dr = D.discard.getBoundingClientRect();
    var target = { left: dr.left + dr.width / 2 - 15, top: dr.top + dr.height / 2 - 22, width: 30, height: 44 };
    els.forEach(function (el) { el.style.visibility = 'hidden'; });
    await Promise.all(els.map(function (el) {
      var r = el.getBoundingClientRect();
      var card = el._card;
      return flyGhost({ left: r.left, top: r.top, width: r.width, height: r.height }, target,
        { card: card, back: !card, dur: 300, spin: 16 });
    }));
    els.forEach(function (el) { el.remove(); });
    bumpDiscard();
  }

  function advanceTurn() {
    if (S.over) return;
    if (checkOver()) { finishGame(); return; }
    var next = targetIndexFor(S.turn);
    if (next < 0) { finishGame(); return; }
    S.turn = next;
    startTurn();
  }

  /* ---------------------------------------------------------------- 결과 */
  function finishGame() {
    if (S.phase === 'over') return;
    S.phase = 'over';
    S.over = true;

    var alive = alivePlayers();
    var loser = alive[0] || null;
    var iAmLoser = !!(loser && S.mode === 'ai' && loser.id === 0);

    if (!loser) {
      D.resEmoji.textContent = '🎉';
      D.resTitle.textContent = '전원 탈출!';
      D.resSub.textContent = '카드가 모두 사라졌어요.';
    } else if (S.mode === 'ai') {
      if (iAmLoser) {
        D.resEmoji.textContent = '😱';
        D.resTitle.textContent = '토끼를 잡혔어요!';
        D.resSub.textContent = loser.avatar + ' ' + loser.name + '이(가) 마지막 카드를 들고 남았어요. 다시 도전!';
      } else {
        D.resEmoji.textContent = '🎉';
        D.resTitle.textContent = '탈출 성공!';
        D.resSub.textContent = loser.avatar + ' ' + loser.name + '이(가) 토끼 도둑이 됐어요. 나는 무사히 탈출!';
      }
    } else {
      D.resEmoji.textContent = '🐰';
      D.resTitle.textContent = loser.avatar + ' ' + loser.name + '가 토끼를 잡았어요!';
      D.resSub.textContent = '마지막까지 카드를 들고 남은 사람이 패배 — 나머지 ' + (S.players.length - 1) + '명은 모두 승리!';
    }

    /* 빼둔 카드 + 마지막 남은 카드 공개 */
    D.revealExcluded.innerHTML = '';
    D.revealLeft.innerHTML = '';
    var eb = backEl();
    eb.style.width = '66px'; eb.style.height = '94px'; eb.style.fontSize = '29px';
    D.revealExcluded.appendChild(eb);

    if (loser) {
      loser.hand.forEach(function (c, i) {
        var el = cardEl(c);
        el.style.width = '66px'; el.style.height = '94px'; el.style.fontSize = '29px';
        if (i > 0) { el.style.marginLeft = '-48px'; el.style.transform = 'rotate(' + ((i - 1) * 6) + 'deg)'; }
        D.revealLeft.appendChild(el);
      });
    }

    var exclKey = S.excluded ? S.excluded.key : null;
    var matched = !!(loser && exclKey && loser.hand.some(function (c) { return c.key === exclKey; }));
    D.revealNote.textContent = matched
      ? '빼둔 카드와 같은 카드가 마지막에 남았어요 — 원래라면 함께 버렸을 짝!'
      : '빼둔 카드와 마지막에 남은 카드는 짝이 아니에요.';

    setTimeout(function () {
      D.revealExcluded.innerHTML = '';
      if (S.excluded) {
        var f = cardEl(S.excluded);
        f.classList.add('flip');
        f.style.width = '66px'; f.style.height = '94px'; f.style.fontSize = '29px';
        D.revealExcluded.appendChild(f);
        sfx.pop();
      }
    }, 700);

    /* 플레이어 결과 목록 */
    D.resultList.innerHTML = '';
    S.players.forEach(function (p) {
      var win = !(loser && p.id === loser.id);
      var row = document.createElement('div');
      row.className = 'res-row' + (S.mode === 'ai' && p.id === 0 ? ' me' : '');

      var av = document.createElement('span'); av.className = 'res-av'; av.textContent = p.avatar;
      var nm = document.createElement('span'); nm.className = 'res-name'; nm.textContent = p.name;
      var pr = document.createElement('span'); pr.className = 'res-pairs'; pr.textContent = p.pairs + '쌍 버림';
      var bd = document.createElement('span'); bd.className = 'res-badge ' + (win ? 'win' : 'lose');
      bd.textContent = win ? '탈출 · 승리' : '🐰 패배';

      row.appendChild(av); row.appendChild(nm); row.appendChild(pr); row.appendChild(bd);
      D.resultList.appendChild(row);
    });

    showScreen('result');
    renderDiscard();
    if (iAmLoser) sfx.lose(); else sfx.win();
  }

  /* ---------------------------------------------------------------- 부팅 */
  function boot() {
    cacheDom();
    try {
      if (localStorage.getItem('tokki-sound') === 'off') S.sound = false;
    } catch (e) {}
    updateSoundBtn();
    initStartScreen();
    renderNames();
    showScreen('start');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
