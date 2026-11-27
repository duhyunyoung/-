/* 엘리의 간식 마을 - 마을 지도, 친구들, 부탁(미션), 상점 */
window.World = (function () {
  'use strict';
  var A = window.Art;

  var TILE = 40;
  var MAP_W = 30, MAP_H = 32;
  var WORLD_W = MAP_W * TILE, WORLD_H = MAP_H * TILE;
  var GRASS = 0, PATH = 1, PLAZA = 2, POND = 3;

  var terrain = [];
  var y, x, i;
  for (y = 0; y < MAP_H; y++) {
    var row = [];
    for (x = 0; x < MAP_W; x++) row.push(GRASS);
    terrain.push(row);
  }
  // 마시멜로 광장
  for (y = 11; y <= 13; y++) for (x = 8; x <= 21; x++) terrain[y][x] = PLAZA;
  // 초콜릿 길 (가로)
  for (y = 14; y <= 15; y++) for (x = 2; x <= 27; x++) terrain[y][x] = PATH;
  // 초콜릿 길 (세로)
  for (y = 16; y <= 30; y++) for (x = 14; x <= 15; x++) terrain[y][x] = PATH;
  // 연못으로 가는 길
  for (y = 16; y <= 17; y++) for (x = 16; x <= 20; x++) terrain[y][x] = PATH;

  var pond = { cx: 24.5, cy: 19.5, rx: 4.8, ry: 3.8 };
  var pondCells = [];
  for (y = 0; y < MAP_H; y++) {
    for (x = 0; x < MAP_W; x++) {
      var dx = x + 0.5 - pond.cx, dy = y + 0.5 - pond.cy;
      if ((dx * dx) / (pond.rx * pond.rx) + (dy * dy) / (pond.ry * pond.ry) < 1) {
        terrain[y][x] = POND;
        pondCells.push({ x: x, y: y });
      }
    }
  }

  var houseRect = { x0: 9.55, y0: 3.3, x1: 21.45, y1: 11 };
  var houseAnchor = { x: 15.5 * TILE, y: 11 * TILE };

  /* ---------- 마을에 심어 둔 간식 나무와 덤불 ---------- */

  var props = [
    // 롤리팝 나무 (딸기 사탕)
    { kind: 'lollipop', item: 'candy', v: 0, x: 3, y: 5 },
    { kind: 'lollipop', item: 'candy', v: 1, x: 6, y: 9 },
    { kind: 'lollipop', item: 'candy', v: 2, x: 26, y: 7 },
    { kind: 'lollipop', item: 'candy', v: 3, x: 12, y: 23 },
    { kind: 'lollipop', item: 'candy', v: 1, x: 17.5, y: 22.5 },
    // 초콜릿 나무 (초코칩)
    { kind: 'cocoa', item: 'choco', v: 0, x: 2, y: 20 },
    { kind: 'cocoa', item: 'choco', v: 1, x: 5, y: 23 },
    { kind: 'cocoa', item: 'choco', v: 2, x: 28, y: 24 },
    // 솜사탕 덤불 (솜사탕)
    { kind: 'cotton', item: 'cotton', v: 0, x: 4, y: 10 },
    { kind: 'cotton', item: 'cotton', v: 1, x: 8, y: 3 },
    { kind: 'cotton', item: 'cotton', v: 2, x: 22, y: 3 },
    { kind: 'cotton', item: 'cotton', v: 0, x: 25, y: 12 },
    { kind: 'cotton', item: 'cotton', v: 1, x: 9, y: 17 },
    { kind: 'cotton', item: 'cotton', v: 2, x: 18, y: 19 },
    // 마시멜로 덤불 (마시멜로)
    { kind: 'marshmallow', item: 'marshmallow', v: 0, x: 5, y: 16 },
    { kind: 'marshmallow', item: 'marshmallow', v: 1, x: 28, y: 12 },
    { kind: 'marshmallow', item: 'marshmallow', v: 2, x: 10, y: 24 },
    { kind: 'marshmallow', item: 'marshmallow', v: 0, x: 20, y: 23 },
    // 맨 아래 동산
    { kind: 'lollipop', item: 'candy', v: 3, x: 4, y: 27 },
    { kind: 'lollipop', item: 'candy', v: 0, x: 26, y: 28 },
    { kind: 'cocoa', item: 'choco', v: 1, x: 21, y: 29 },
    { kind: 'cotton', item: 'cotton', v: 2, x: 9, y: 29 },
    { kind: 'marshmallow', item: 'marshmallow', v: 1, x: 24, y: 25 },
    { kind: 'cotton', item: 'cotton', v: 0, x: 6, y: 30 },
    // 마시멜로 벤치
    { kind: 'bench', x: 10, y: 13 },
    { kind: 'bench', x: 19, y: 13 }
  ];

  /* ---------- 동물 친구들 ---------- */

  var npcs = [
    { id: 'somsom', kind: 'rabbit', name: '솜솜', role: '토끼', x: 11, y: 15.4, face: 'right', wander: 0 },
    { id: 'koko', kind: 'bear', name: '코코', role: '곰돌이', x: 18, y: 12.2, face: 'left', wander: 0 },
    { id: 'jelly', kind: 'cat', name: '젤리', role: '고양이', x: 19.6, y: 14.3, face: 'right', wander: 0 },
    { id: 'ppiak', kind: 'chick', name: '삐약', role: '병아리', x: 6, y: 15.4, face: 'right', wander: 2.4 },
    // 엘리 같은 꼬마 사람 친구들 (마을 밖)
    { id: 'luna', kind: 'kid', kid: 'luna', name: '루나', role: '꼬마 친구', x: 12.4, y: 12.4, face: 'right', wander: 0 },
    { id: 'haru', kind: 'kid', kid: 'haru', name: '하루', role: '꼬마 친구', x: 20.2, y: 12.5, face: 'left', wander: 0 },
    { id: 'bora', kind: 'kid', kid: 'bora', name: '보라', role: '꼬마 친구', x: 22.4, y: 15.2, face: 'left', wander: 0 }
  ];
  var npcById = {};
  function prepNpc(n) {
    n.home = { x: n.x, y: n.y };
    n.tx = n.x;
    n.ty = n.y;
    n.wait = Math.random() * 2;
    if (!n.where) n.where = 'out';
    npcById[n.id] = n;
    return n;
  }
  for (i = 0; i < npcs.length; i++) prepNpc(npcs[i]);

  /* ---------- 부탁(미션) ---------- */

  var quests = [
    {
      giver: 'somsom', kind: 'collect', item: 'candy', need: 3, coins: 6,
      title: '달콤한 딸기 사탕',
      ask: '엘리야, 안녕! 나는 토끼 솜솜이야. 우리 친구들이랑 먹을 딸기 사탕이 3개 필요한데, 롤리팝 나무에서 따다 줄래?',
      busy: '딸기 사탕은 롤리팝 나무에 달려 있어! 나무 가까이 가서 커다란 버튼을 톡 눌러 봐.',
      done: '우와, 딸기 사탕 3개! 정말 고마워. 이건 내 마음을 담은 별 코인이야!',
      hud: '딸기 사탕 3개를 모아 솜솜에게 가져가기'
    },
    {
      giver: 'koko', kind: 'deliver', item: 'marshmallow', need: 2, to: 'jelly', coins: 7,
      title: '젤리에게 마시멜로',
      ask: '안녕, 엘리! 나는 곰돌이 코코야. 하얀 마시멜로 2개를 고양이 젤리에게 전해 줄래? 젤리가 마시멜로를 아주 좋아하거든.',
      busy: '마시멜로는 하얀 마시멜로 덤불에서 폴폴 주울 수 있어. 덤불 가까이 가 봐!',
      done: '와, 고마워! 젤리가 정말 기뻐할 거야.',
      recv: '와, 마시멜로다! 코코가 보내 준 거구나. 엘리, 정말 고마워!',
      hud: '마시멜로 2개를 모아 젤리에게 전해 주기'
    },
    {
      giver: 'jelly', kind: 'collect', item: 'gummy', need: 2, coins: 8,
      title: '연못에서 구미베어',
      ask: '엘리야, 나는 고양이 젤리야. 젤리 연못에서 통통한 구미베어 2마리를 낚아 줄래? 연못 가까이 가서 낚시를 해 봐!',
      busy: '연못 가까이 가면 커다란 버튼이 낚시로 바뀌어! 그때 톡 눌러 봐.',
      done: '앗, 구미베어다! 통통해서 너무 귀여워. 고마워!',
      hud: '구미베어 2마리를 낚아서 젤리에게 가져가기'
    },
    {
      giver: 'ppiak', kind: 'deliver', item: 'starjelly', need: 1, to: 'koko', coins: 9,
      title: '반짝이는 별젤리',
      ask: '삐약! 나는 병아리 삐약이야. 반짝반짝 별젤리 1개를 곰돌이 코코에게 전해 줄래?',
      busy: '별젤리는 젤리 연못에서 가끔 낚여. 연못에서 낚시를 해 봐!',
      done: '삐약! 별젤리야! 반짝반짝해서 너무 예뻐!',
      recv: '우와, 반짝반짝 별젤리다! 삐약이가 보내 준 거구나. 고마워, 엘리!',
      hud: '별젤리 1개를 낚아 코코에게 전해 주기'
    },
    {
      giver: 'somsom', kind: 'collect', item: 'cotton', need: 3, coins: 10,
      title: '폭신폭신 솜사탕',
      ask: '엘리야, 또 왔구나! 이번엔 폭신폭신 솜사탕이 3개 필요해. 솜사탕 덤불에서 주워 줄래?',
      busy: '솜사탕 덤불은 폭신폭신 분홍색이야. 가까이 가서 톡 눌러 봐!',
      done: '폭신폭신 솜사탕이다! 고마워, 엘리!',
      hud: '솜사탕 3개를 모아 솜솜에게 가져가기'
    },
    {
      giver: 'koko', kind: 'deliver', item: 'choco', need: 2, to: 'ppiak', coins: 11,
      title: '삐약이의 초코칩',
      ask: '엘리, 초코칩 2개를 병아리 삐약이에게 전해 줄래? 삐약이가 초코칩을 모으고 있대.',
      busy: '초코칩은 갈색 초콜릿 나무에 달려 있어! 갈색 나무를 찾아봐.',
      done: '고마워! 삐약이가 아주 좋아할 거야.',
      recv: '삐약! 초코칩이다! 코코가 보내 줬어. 고마워, 엘리!',
      hud: '초코칩 2개를 모아 삐약에게 전해 주기'
    },
    {
      giver: 'jelly', kind: 'place', item: 'lamppost', need: 1, coins: 12,
      title: '반짝이는 가로등',
      ask: '엘리야, 우리 마을이 조금 캄캄해졌어. 상점에서 롤리팝 가로등을 사서 마을에 예쁘게 놓아 줄래? 꾸미기 버튼을 누르면 놓을 수 있어!',
      busy: '상점에서 롤리팝 가로등을 사고, 꾸미기 버튼을 눌러 빈 땅을 톡 누르면 돼!',
      done: '와아, 마을이 반짝반짝 밝아졌어! 정말 고마워!',
      hud: '롤리팝 가로등을 사서 마을에 놓기'
    },
    /* ---- 2차 업그레이드: 꼬마 친구들과 과자집 안 부탁 ---- */
    {
      giver: 'haru', kind: 'collect', item: 'cookie', need: 2, coins: 13,
      title: '따뜻한 쿠키 두 개',
      ask: '엘리야, 나는 하루야! 과자집 안 쿠키 오븐에서 따뜻한 쿠키 두 개를 구워 줄래? 과자집 문 앞에서 커다란 버튼을 누르면 집 안에 들어갈 수 있어!',
      busy: '과자집 문 앞으로 가서 \'들어가기\'를 눌러 봐! 안에 쿠키 오븐이 있어. 오븐 앞에서 \'쿠키 굽기\'를 누르고, 조금 기다렸다가 \'꺼내기\'를 누르면 따뜻한 쿠키를 꺼낼 수 있어!',
      done: '와! 따뜻한 쿠키야! 냄새가 너무 좋아. 엘리 최고!',
      hud: '과자집 안 오븐에서 쿠키 2개를 구워 하루에게 가져가기'
    },
    {
      giver: 'momo', kind: 'collect', item: 'cotton', need: 3, coins: 14,
      title: '폭신폭신 솜사탕 이불',
      ask: '엘리야! 나는 모모야. 이 침대 이불에 폭신한 솜사탕을 올리고 싶어. 마을 솜사탕 덤불에서 3개만 주워 줄래?',
      busy: '솜사탕은 마을의 분홍 덤불에서 폴폴 주울 수 있어. 과자집 밖으로 나가서 모아 와!',
      done: '우와, 폭신폭신! 이불이 구름 같아! 고마워, 엘리!',
      hud: '솜사탕 3개를 모아 과자집 안 모모에게 가져가기'
    },
    {
      giver: 'luna', kind: 'place', item: 'heartchair', room: true, need: 1, coins: 15,
      title: '과자집 하트 의자',
      ask: '엘리, 나는 루나야! 과자집 안에 하트 마카롱 의자를 놓으면 정말 예쁠 것 같아. 상점에서 사서 과자집 안에 놓아 줄래?',
      busy: '상점에서 하트 마카롱 의자를 사고, 과자집 안에 들어가서 꾸미기 버튼을 눌러 봐!',
      done: '와아, 하트 의자다! 과자집이 더 예뻐졌어!',
      hud: '하트 마카롱 의자를 사서 과자집 안에 놓기'
    },
    {
      giver: 'bora', kind: 'place', item: 'rainbowarch', need: 1, coins: 16,
      title: '무지개 사탕 아치',
      ask: '엘리야, 나는 보라야! 마을 길에 무지개 사탕 아치를 세우면 멋질 거야. 상점에서 사서 빈 땅에 놓아 줄래?',
      busy: '상점에서 무지개 사탕 아치를 사고, 꾸미기를 눌러 마을 빈 땅을 톡 눌러 봐!',
      done: '우와, 무지개가 생겼어! 정말 예뻐! 고마워!',
      hud: '무지개 사탕 아치를 사서 마을에 놓기'
    },
    {
      giver: 'momo', kind: 'deliver', item: 'cookie', need: 1, to: 'haru', coins: 17,
      title: '하루에게 쿠키',
      ask: '엘리야, 밖에 있는 하루가 쿠키를 아주 좋아해. 오븐에서 따뜻한 쿠키 하나를 구워서 하루에게 전해 줄래?',
      busy: '쿠키 오븐 앞에서 쿠키를 구워 봐! 그다음 과자집 밖으로 나가 하루에게 가면 돼.',
      done: '고마워! 하루가 정말 기뻐할 거야.',
      recv: '와, 따뜻한 쿠키다! 모모가 보내 준 거구나. 고마워, 엘리!',
      hud: '따뜻한 쿠키 1개를 구워 하루에게 전해 주기'
    }
  ];

  var loopPool = [
    { kind: 'collect', item: 'candy', need: 3 },
    { kind: 'collect', item: 'marshmallow', need: 2 },
    { kind: 'collect', item: 'cotton', need: 3 },
    { kind: 'collect', item: 'choco', need: 2 },
    { kind: 'collect', item: 'gummy', need: 2 },
    { kind: 'collect', item: 'starjelly', need: 1 },
    { kind: 'collect', item: 'cookie', need: 1 }
  ];
  var loopGivers = ['somsom', 'koko', 'jelly', 'ppiak', 'momo', 'luna', 'haru', 'bora'];
  var loopAsks = [
    '엘리야, 오늘도 와 줬구나! 맛있는 간식이 조금 더 필요해. 모아다 줄래?',
    '엘리, 마을 친구들이 간식을 기다리고 있어! 하나씩 모아 주면 정말 좋겠어.',
    '와, 엘리다! 오늘은 어떤 간식을 모아 볼까? 모아서 가져다주면 별 코인을 줄게!',
    '엘리야, 안녕! 폴폴 달콤한 기운이 부족해. 간식을 모아다 줄래?'
  ];

  function loopQuest(n) {
    var base = loopPool[n % loopPool.length];
    var giver = loopGivers[n % loopGivers.length];
    var names = {
      candy: '딸기 사탕', marshmallow: '마시멜로', cotton: '솜사탕',
      choco: '초코칩', gummy: '구미베어', starjelly: '별젤리', cookie: '따뜻한 쿠키'
    };
    var place = {
      candy: '롤리팝 나무', marshmallow: '마시멜로 덤불', cotton: '솜사탕 덤불',
      choco: '초콜릿 나무', gummy: '젤리 연못', starjelly: '젤리 연못', cookie: '과자집 안 쿠키 오븐'
    };
    return {
      giver: giver,
      kind: 'collect',
      item: base.item,
      need: base.need,
      coins: 8 + Math.min(12, Math.floor(n / 2)),
      title: '달콤한 부탁',
      ask: loopAsks[n % loopAsks.length],
      busy: base.item === 'cookie'
        ? '따뜻한 쿠키는 과자집 안 오븐에서 구울 수 있어! 과자집 문 앞에서 \'들어가기\'를 눌러 봐.'
        : place[base.item] + '에서 ' + names[base.item] + '을(를) 모을 수 있어! 가까이 가서 톡 눌러 봐.',
      done: '와, 고맙다! 역시 엘리는 최고야!',
      hud: names[base.item] + ' ' + base.need + '개를 모아 ' + npcById[giver].name + '에게 가져가기'
    };
  }

  /* ---------- 간식 상점 ---------- */

  var shop = [
    { id: 'fence', name: '과자 울타리', price: 4, desc: '마을 길을 예쁘게 나눠요' },
    { id: 'plant', name: '젤리 화분', price: 5, desc: '알록달록 젤리 꽃이 피어요' },
    { id: 'lamppost', name: '롤리팝 가로등', price: 6, desc: '반짝반짝 불이 켜져요' },
    { id: 'macaron', name: '마카롱 테이블', price: 8, desc: '달콤한 간식이 놓여 있어요' },
    { id: 'sofa', name: '솜사탕 소파', price: 9, desc: '폭신폭신 앉고 싶어요' },
    { id: 'fountain', name: '초코 분수', price: 12, desc: '초콜릿이 졸졸 흘러요' },
    { id: 'gummylamp', name: '곰젤리 램프', price: 7, desc: '말랑곰이 환하게 비춰요', where: 'both' },
    { id: 'cakefountain', name: '딸기 케이크 분수', price: 13, desc: '딸기 시럽이 졸졸 흘러요', where: 'out' },
    { id: 'heartchair', name: '하트 마카롱 의자', price: 8, desc: '하트 모양 폭신 의자', where: 'in' },
    { id: 'starbed', name: '별빛 솜사탕 침대', price: 14, desc: '별이 반짝이는 침대', where: 'in' },
    { id: 'ovenbrick', name: '쿠키 오븐 장식', price: 10, desc: '작은 오븐이 따뜻해요', where: 'in' },
    { id: 'rainbowarch', name: '무지개 사탕 아치', price: 16, desc: '무지개 사탕 문이 생겨요', where: 'out' }
  ];

  /* ---------- 과자집 안 (실내 맵) ---------- */

  var ROOM_W = 11, ROOM_H = 9;
  var ROOM_WORLD_W = ROOM_W * TILE, ROOM_WORLD_H = ROOM_H * TILE;

  var room = {
    door: { x: 5.5, y: 8.25 },
    enter: { x: 5.5, y: 6.6 },
    oven: { x: 2.1, y: 3.15 },
    cake: { x: 4.3, y: 3.5 },
    bed: { x: 8.6, y: 3.4 },
    fire: { x: 6.85, y: 2.8 }
  };
  var doorOut = { x: 15.5, y: 11.5 };

  var roomNpcs = [
    { id: 'momo', kind: 'kid', kid: 'momo', name: '모모', role: '꼬마 친구', x: 6.6, y: 4.8, face: 'left', wander: 0, where: 'in' }
  ];
  for (i = 0; i < roomNpcs.length; i++) prepNpc(roomNpcs[i]);

  var roomBlockers = [
    { x: 2.1, y: 3.0, r: 0.9 },
    { x: 4.3, y: 3.5, r: 0.92 },
    { x: 8.6, y: 3.35, r: 0.98 },
    { x: 6.85, y: 2.8, r: 0.86 }
  ];

  function roomCanStand(px, py) {
    if (px < 1.15 || px > ROOM_W - 1.15 || py < 2.3 || py > ROOM_H - 0.9) return false;
    for (var k = 0; k < roomBlockers.length; k++) {
      var b = roomBlockers[k];
      var dx = px - b.x, dy = py - b.y;
      if (dx * dx + dy * dy < b.r * b.r) return false;
    }
    for (var n = 0; n < roomNpcs.length; n++) {
      var ndx = px - roomNpcs[n].x, ndy = py - roomNpcs[n].y;
      if (ndx * ndx + ndy * ndy < 0.44) return false;
    }
    return true;
  }

  function roomPlaceable(tx, ty) {
    if (tx < 1 || tx > ROOM_W - 2 || ty < 2 || ty > ROOM_H - 2) return false;
    if (ty === ROOM_H - 2 && Math.abs(tx - 5) <= 1) return false;
    var px = tx + 0.5, py = ty + 0.5;
    for (var k = 0; k < roomBlockers.length; k++) {
      var b = roomBlockers[k];
      if (Math.abs(px - b.x) < b.r + 0.32 && Math.abs(py - b.y) < b.r + 0.32) return false;
    }
    for (var n = 0; n < roomNpcs.length; n++) {
      if (Math.abs(px - roomNpcs[n].x) < 1.15 && Math.abs(py - roomNpcs[n].y) < 1.15) return false;
    }
    return true;
  }

  function buildRoomCanvas() {
    var cv = document.createElement('canvas');
    cv.width = ROOM_WORLD_W;
    cv.height = ROOM_WORLD_H;
    var g = cv.getContext('2d');
    var wallH = 2.1 * TILE;
    var floorTop = wallH;

    // 벽
    var wg = g.createLinearGradient(0, 0, 0, wallH);
    wg.addColorStop(0, '#fff2f8');
    wg.addColorStop(1, '#ffdcec');
    g.fillStyle = wg;
    g.fillRect(0, 0, ROOM_WORLD_W, wallH);

    // 벽지 줄무늬
    g.fillStyle = 'rgba(255,255,255,.45)';
    for (var sx = 0; sx < ROOM_WORLD_W; sx += 32) g.fillRect(sx + 4, 0, 13, wallH);

    // 벽지 하트
    for (var hy = 22; hy < wallH - 14; hy += 30) {
      for (var hx = 22; hx < ROOM_WORLD_W; hx += 62) {
        g.fillStyle = 'rgba(255,168,200,.32)';
        A.heartPath(g, hx + (hy % 60 ? 16 : 0), hy, 3.6);
        g.fill();
      }
    }

    // 바닥 (체크)
    var pal = ['#fff4e8', '#ffe8f0'];
    for (var fy = 0; fy < ROOM_H; fy++) {
      for (var fx = 0; fx < ROOM_W; fx++) {
        var px = fx * TILE, py = floorTop + fy * TILE;
        g.fillStyle = pal[(fx + fy) % 2];
        g.fillRect(px, py, TILE, TILE);
        g.strokeStyle = 'rgba(255,208,224,.5)';
        g.lineWidth = 1;
        g.strokeRect(px + 0.5, py + 0.5, TILE - 1, TILE - 1);
        if ((fx * 7 + fy * 3) % 5 === 0) {
          g.fillStyle = 'rgba(255,188,214,.45)';
          A.circ(g, px + 11 + ((fx + fy) % 3) * 7, py + 13, 1.6);
          g.fill();
          A.circ(g, px + 27, py + 27, 1.2);
          g.fill();
        }
      }
    }

    // 가운데 러그
    var rugY = floorTop + TILE * 3.5;
    A.ell(g, ROOM_WORLD_W / 2, rugY, 140, 72);
    g.fillStyle = 'rgba(255,198,220,.5)';
    g.fill();
    A.ell(g, ROOM_WORLD_W / 2, rugY, 122, 59);
    g.fillStyle = 'rgba(255,243,249,.88)';
    g.fill();
    g.save();
    g.setLineDash([8, 8]);
    g.strokeStyle = 'rgba(255,166,198,.5)';
    g.lineWidth = 3;
    A.ell(g, ROOM_WORLD_W / 2, rugY, 131, 65);
    g.stroke();
    g.restore();

    // 걸레받이
    g.fillStyle = '#ffd2e3';
    g.fillRect(0, wallH - 9, ROOM_WORLD_W, 9);
    g.fillStyle = 'rgba(255,255,255,.65)';
    g.fillRect(0, wallH - 11, ROOM_WORLD_W, 3);

    // 벽지 원석이 창
    function jellyWindow(wx) {
      var wy = 44, ww = 60, wh = 48;
      g.fillStyle = '#fffaf4';
      A.rr(g, wx - ww / 2 - 6, wy - wh / 2 - 6, ww + 12, wh + 12, 13);
      g.fill();
      var jg = g.createLinearGradient(wx - ww / 2, wy - wh / 2, wx + ww / 2, wy + wh / 2);
      jg.addColorStop(0, '#ffe0ef');
      jg.addColorStop(0.5, '#d9f0ff');
      jg.addColorStop(1, '#ffd3e6');
      A.rr(g, wx - ww / 2, wy - wh / 2, ww, wh, 8);
      g.fillStyle = jg;
      g.fill();
      g.strokeStyle = '#fff';
      g.lineWidth = 4;
      g.beginPath();
      g.moveTo(wx, wy - wh / 2);
      g.lineTo(wx, wy + wh / 2);
      g.moveTo(wx - ww / 2, wy);
      g.lineTo(wx + ww / 2, wy);
      g.stroke();
      g.fillStyle = 'rgba(255,255,255,.85)';
      g.beginPath();
      g.moveTo(wx - 17, wy - 15);
      g.lineTo(wx - 4, wy - 2);
      g.lineTo(wx - 19, wy + 3);
      g.closePath();
      g.fill();
      // 예쁜 커튼
      g.fillStyle = 'rgba(255,175,206,.8)';
      for (var c = 0; c < 2; c++) {
        var cx2 = wx + (c ? 1 : -1) * (ww / 2 + 9);
        g.beginPath();
        g.moveTo(cx2 - 9, wy - wh / 2 - 6);
        g.quadraticCurveTo(cx2 + 9, wy, cx2 - 9, wy + wh / 2 + 6);
        g.closePath();
        g.fill();
      }
    }
    jellyWindow(2.6 * TILE);
    jellyWindow(8.4 * TILE);

    // 작은 벽시계
    A.circ(g, 5.5 * TILE, 30, 12);
    g.fillStyle = '#fffaf4';
    g.fill();
    g.strokeStyle = '#ffb7d3';
    g.lineWidth = 3;
    g.stroke();
    g.strokeStyle = '#c984a4';
    g.lineWidth = 1.6;
    g.lineCap = 'round';
    g.beginPath();
    g.moveTo(5.5 * TILE, 30);
    g.lineTo(5.5 * TILE + 4, 25);
    g.moveTo(5.5 * TILE, 30);
    g.lineTo(5.5 * TILE - 4, 33);
    g.stroke();

    // 좌우 벽
    g.fillStyle = '#ffe2ef';
    g.fillRect(0, 0, TILE, ROOM_WORLD_H);
    g.fillRect(ROOM_WORLD_W - TILE, 0, TILE, ROOM_WORLD_H);
    g.fillStyle = 'rgba(214,150,180,.22)';
    g.fillRect(TILE - 6, 0, 6, ROOM_WORLD_H);
    g.fillRect(ROOM_WORLD_W - TILE, 0, 6, ROOM_WORLD_H);

    // 아래 벽 + 문
    var by = (ROOM_H - 1) * TILE;
    g.fillStyle = '#ffe2ef';
    g.fillRect(TILE, by, ROOM_WORLD_W - TILE * 2, ROOM_WORLD_H - by);
    g.fillStyle = 'rgba(214,150,180,.22)';
    g.fillRect(TILE, by, ROOM_WORLD_W - TILE * 2, 5);

    var dCx = room.door.x * TILE, dW = 80;
    var dg2 = g.createLinearGradient(0, by - 90, 0, ROOM_WORLD_H);
    dg2.addColorStop(0, '#fff9e4');
    dg2.addColorStop(1, '#ffe3ae');
    g.beginPath();
    g.moveTo(dCx - dW / 2, ROOM_WORLD_H);
    g.lineTo(dCx - dW / 2, by - 30);
    g.quadraticCurveTo(dCx, by - 92, dCx + dW / 2, by - 30);
    g.lineTo(dCx + dW / 2, ROOM_WORLD_H);
    g.closePath();
    g.fillStyle = dg2;
    g.fill();
    g.strokeStyle = '#ffb7d3';
    g.lineWidth = 7;
    g.stroke();
    g.strokeStyle = 'rgba(255,255,255,.75)';
    g.lineWidth = 2.4;
    g.stroke();
    // 문 밖 초록 (마을)
    g.fillStyle = '#cfeab8';
    g.fillRect(dCx - dW / 2 + 6, ROOM_WORLD_H - 18, dW - 12, 18);
    g.fillStyle = '#b6dfa0';
    for (var gg = 0; gg < 5; gg++) {
      A.circ(g, dCx - dW / 2 + 12 + gg * 14, ROOM_WORLD_H - 18, 5);
      g.fill();
    }
    // 문가 매트
    A.ell(g, dCx, by - 10, 34, 11);
    g.fillStyle = '#ffd9e8';
    g.fill();
    A.ell(g, dCx, by - 10, 27, 8);
    g.fillStyle = '#fff6fb';
    g.fill();
    g.fillStyle = '#d68fae';
    g.font = 'bold 11px "Apple SD Gothic Neo","Malgun Gothic",system-ui,sans-serif';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText('마을로', dCx, by - 10);

    // 따뜻한 빛
    var warm = g.createRadialGradient(ROOM_WORLD_W / 2, wallH + 60, 20, ROOM_WORLD_W / 2, wallH + 60, 260);
    warm.addColorStop(0, 'rgba(255,240,200,.22)');
    warm.addColorStop(1, 'rgba(255,240,200,0)');
    g.fillStyle = warm;
    g.fillRect(0, 0, ROOM_WORLD_W, ROOM_WORLD_H);

    return cv;
  }

  /* ---------- 지도 그리기 (한 번만 그려 두고 재사용) ---------- */

  function hash(xx, yy, s) {
    var h = Math.imul(xx + 31, 374761393) ^ Math.imul(yy + 17, 668265263) ^ Math.imul(s + 7, 1442695041);
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
  }

  function drawGrassTile(g, px, py, tx, ty) {
    var n = hash(tx, ty, 3);
    var palette = ['#caeab9', '#c8e8b7', '#cdebbd'];
    g.fillStyle = palette[Math.floor(n * 3) % 3];
    g.fillRect(px, py, TILE, TILE);
    // 풀결
    g.fillStyle = 'rgba(150,205,130,.28)';
    for (var k = 0; k < 3; k++) {
      var hx = hash(tx, ty, k + 1), hy = hash(tx, ty, k + 9);
      A.ell(g, px + 5 + hx * 30, py + 5 + hy * 30, 2.6, 1.6);
      g.fill();
    }
    // 꽃
    if (n > 0.72) {
      var fx = px + 10 + hash(tx, ty, 21) * 20;
      var fy = py + 10 + hash(tx, ty, 22) * 20;
      var petal = ['#fff6fa', '#ffd6e8', '#fff3b0', '#e6e2ff'][Math.floor(hash(tx, ty, 23) * 4)];
      g.fillStyle = petal;
      for (var p = 0; p < 4; p++) {
        var a = (p / 4) * Math.PI * 2 + 0.4;
        A.circ(g, fx + Math.cos(a) * 2.6, fy + Math.sin(a) * 2.6, 1.9);
        g.fill();
      }
      g.fillStyle = '#ffd75e';
      A.circ(g, fx, fy, 1.5);
      g.fill();
    }
    // 스프링클
    if (n > 0.9) {
      A.sprinkle(g, px + 8 + hash(tx, ty, 31) * 24, py + 8 + hash(tx, ty, 32) * 24, 2.4,
        ['#ff9ec4', '#ffe08a', '#9fd8ff'][Math.floor(hash(tx, ty, 33) * 3)], hash(tx, ty, 34) * 3);
    }
  }

  function drawPathTile(g, px, py, tx, ty) {
    var n = hash(tx, ty, 5);
    g.fillStyle = '#a9734f';
    g.fillRect(px, py, TILE, TILE);
    var shades = ['#c08a63', '#b98259', '#c69169'];
    g.fillStyle = shades[Math.floor(n * 3) % 3];
    A.rr(g, px + 1.2, py + 1.2, TILE - 2.4, TILE - 2.4, 7);
    g.fill();
    g.fillStyle = 'rgba(255,225,195,.22)';
    A.rr(g, px + 3, py + 3, TILE - 6, TILE * 0.28, 5);
    g.fill();
    g.fillStyle = 'rgba(90,55,35,.22)';
    A.circ(g, px + 8 + hash(tx, ty, 12) * 22, py + 12 + hash(tx, ty, 13) * 20, 1.7);
    g.fill();
    A.circ(g, px + 8 + hash(tx, ty, 14) * 22, py + 12 + hash(tx, ty, 15) * 20, 1.3);
    g.fill();
  }

  function drawPlazaTile(g, px, py, tx, ty) {
    var n = hash(tx, ty, 7);
    g.fillStyle = '#f8cfe0';
    g.fillRect(px, py, TILE, TILE);
    g.fillStyle = n > 0.5 ? '#ffeaf3' : '#ffe5ef';
    A.rr(g, px + 1, py + 1, TILE - 2, TILE - 2, 10);
    g.fill();
    g.fillStyle = 'rgba(255,255,255,.4)';
    A.rr(g, px + 4, py + 4, TILE - 8, TILE * 0.26, 7);
    g.fill();
    if (n > 0.62) {
      g.fillStyle = 'rgba(255,214,232,.9)';
      A.circ(g, px + 12 + hash(tx, ty, 41) * 16, py + 22 + hash(tx, ty, 42) * 10, 1.5);
      g.fill();
    }
  }

  function buildTerrainCanvas() {
    var cv = document.createElement('canvas');
    cv.width = WORLD_W;
    cv.height = WORLD_H;
    var g = cv.getContext('2d');
    for (var ty = 0; ty < MAP_H; ty++) {
      for (var tx = 0; tx < MAP_W; tx++) {
        var px = tx * TILE, py = ty * TILE;
        var t = terrain[ty][tx];
        if (t === GRASS) drawGrassTile(g, px, py, tx, ty);
        else if (t === PATH) drawPathTile(g, px, py, tx, ty);
        else if (t === PLAZA) drawPlazaTile(g, px, py, tx, ty);
      }
    }
    // 연못
    var cx = pond.cx * TILE, cy = pond.cy * TILE, rx = pond.rx * TILE, ry = pond.ry * TILE;
    g.save();
    g.fillStyle = '#f7e7c6';
    A.ell(g, cx, cy, rx + 26, ry + 24);
    g.fill();
    g.fillStyle = '#fff6e6';
    A.ell(g, cx, cy, rx + 13, ry + 12);
    g.fill();
    g.restore();

    var wg = g.createRadialGradient(cx - rx * 0.3, cy - ry * 0.4, 12, cx, cy, rx * 1.02);
    wg.addColorStop(0, '#e2f7ff');
    wg.addColorStop(0.42, '#b0e5f8');
    wg.addColorStop(1, '#7fc9ec');
    A.ell(g, cx, cy, rx, ry);
    g.fillStyle = wg;
    g.fill();
    g.strokeStyle = 'rgba(255,255,255,.85)';
    g.lineWidth = 6;
    g.stroke();
    g.strokeStyle = 'rgba(160,215,240,.55)';
    g.lineWidth = 2;
    A.ell(g, cx, cy, rx - 12, ry - 10);
    g.stroke();

    // 젤리 같은 물결
    g.save();
    A.ell(g, cx, cy, rx, ry);
    g.clip();
    // 아래쪽에 젤리 빛
    var jg = g.createRadialGradient(cx - rx * 0.1, cy + ry * 0.5, 12, cx, cy + ry * 0.35, rx * 0.9);
    jg.addColorStop(0, 'rgba(198,166,255,.5)');
    jg.addColorStop(0.6, 'rgba(198,166,255,.18)');
    jg.addColorStop(1, 'rgba(198,166,255,0)');
    g.fillStyle = jg;
    g.fillRect(cx - rx, cy - ry, rx * 2, ry * 2);
    g.strokeStyle = 'rgba(255,255,255,.34)';
    g.lineWidth = 3;
    for (var w = 0; w < 5; w++) {
      var wy = cy - ry * 0.6 + w * (ry * 0.3) + 6;
      g.beginPath();
      g.moveTo(cx - rx + 10, wy);
      for (var s = 0; s <= 8; s++) {
        g.quadraticCurveTo(cx - rx + 10 + ((s * 2 + 1) * (rx * 2 - 20)) / 16, wy - 8,
          cx - rx + 10 + ((s * 2 + 2) * (rx * 2 - 20)) / 16, wy);
      }
      g.stroke();
    }
    // 떠 있는 젤리 조각
    var jellyDots = [
      { x: -0.45, y: 0.25, c: '#ffb1cf', r: 11 },
      { x: 0.36, y: -0.32, c: '#ffe08a', r: 9 },
      { x: 0.08, y: 0.46, c: '#c9b2ff', r: 10 },
      { x: -0.18, y: -0.46, c: '#a7e8c4', r: 8 },
      { x: 0.62, y: 0.12, c: '#ffc9dd', r: 7 }
    ];
    for (var j = 0; j < jellyDots.length; j++) {
      var jd = jellyDots[j];
      g.fillStyle = 'rgba(120,160,200,.18)';
      A.rr(g, cx + jd.x * rx - jd.r + 2, cy + jd.y * ry - jd.r * 0.7 + 3, jd.r * 2, jd.r * 1.4, jd.r * 0.5);
      g.fill();
      g.fillStyle = jd.c;
      g.globalAlpha = 0.8;
      A.rr(g, cx + jd.x * rx - jd.r, cy + jd.y * ry - jd.r * 0.7, jd.r * 2, jd.r * 1.4, jd.r * 0.5);
      g.fill();
      g.globalAlpha = 0.75;
      g.fillStyle = '#ffffff';
      A.rr(g, cx + jd.x * rx - jd.r * 0.6, cy + jd.y * ry - jd.r * 0.55, jd.r * 0.9, jd.r * 0.35, jd.r * 0.2);
      g.fill();
      g.globalAlpha = 1;
    }
    // 수련잎
    g.fillStyle = '#a8e6b8';
    A.ell(g, cx + rx * 0.52, cy + ry * 0.42, 18, 12);
    g.fill();
    g.fillStyle = '#8ed7a2';
    g.beginPath();
    g.moveTo(cx + rx * 0.52, cy + ry * 0.42);
    g.lineTo(cx + rx * 0.52 + 16, cy + ry * 0.42 + 3);
    g.lineTo(cx + rx * 0.52 + 15, cy + ry * 0.42 + 10);
    g.closePath();
    g.fill();
    g.fillStyle = '#ffc6dd';
    A.circ(g, cx + rx * 0.52, cy + ry * 0.42 - 6, 5);
    g.fill();
    g.fillStyle = '#fff6fa';
    A.circ(g, cx + rx * 0.52, cy + ry * 0.42 - 6, 2);
    g.fill();
    g.restore();

    return cv;
  }

  /* ---------- 이동 가능 여부 ---------- */

  var blockers = [];
  for (i = 0; i < props.length; i++) {
    var p = props[i];
    blockers.push({
      x: p.x + 0.5, y: p.y + 0.55,
      r: p.kind === 'bench' ? 0.62 : p.kind === 'lollipop' || p.kind === 'cocoa' ? 0.5 : 0.48
    });
  }

  function terrainAt(tx, ty) {
    if (tx < 0 || ty < 0 || tx >= MAP_W || ty >= MAP_H) return -1;
    return terrain[ty][tx];
  }

  function inHouse(px, py) {
    return px > houseRect.x0 && px < houseRect.x1 && py > houseRect.y0 && py < houseRect.y1;
  }

  function canStand(px, py) {
    if (px < 0.65 || py < 0.65 || px > MAP_W - 0.65 || py > MAP_H - 0.65) return false;
    if (inHouse(px, py)) return false;
    var tx = Math.floor(px), ty = Math.floor(py);
    if (terrainAt(tx, ty) === POND) return false;
    for (var k = 0; k < blockers.length; k++) {
      var b = blockers[k];
      var dx = px - b.x, dy = py - b.y;
      if (dx * dx + dy * dy < b.r * b.r) return false;
    }
    return true;
  }

  function distToPond(px, py) {
    var best = 999;
    for (var k = 0; k < pondCells.length; k++) {
      var c = pondCells[k];
      var dx = px - (c.x + 0.5), dy = py - (c.y + 0.5);
      var d = Math.sqrt(dx * dx + dy * dy);
      if (d < best) best = d;
    }
    return best;
  }

  function placeable(tx, ty) {
    if (tx < 0 || ty < 0 || tx >= MAP_W || ty >= MAP_H) return false;
    if (terrain[ty][tx] === POND) return false;
    if (inHouse(tx + 0.5, ty + 0.5)) return false;
    for (var k = 0; k < props.length; k++) {
      var p = props[k];
      if (Math.abs(p.x + 0.5 - (tx + 0.5)) < 0.95 && Math.abs(p.y + 0.55 - (ty + 0.5)) < 0.95) return false;
    }
    for (var n = 0; n < npcs.length; n++) {
      if (Math.abs(npcs[n].x - (tx + 0.5)) < 1.1 && Math.abs(npcs[n].y - (ty + 0.5)) < 1.1) return false;
    }
    return true;
  }

  return {
    TILE: TILE, MAP_W: MAP_W, MAP_H: MAP_H, WORLD_W: WORLD_W, WORLD_H: WORLD_H,
    GRASS: GRASS, PATH: PATH, PLAZA: PLAZA, POND: POND,
    terrain: terrain, pond: pond, pondCells: pondCells,
    houseRect: houseRect, houseAnchor: houseAnchor,
    props: props, npcs: npcs, npcById: npcById,
    quests: quests, loopQuest: loopQuest, shop: shop,
    buildTerrainCanvas: buildTerrainCanvas,
    terrainAt: terrainAt, inHouse: inHouse, canStand: canStand,
    distToPond: distToPond, placeable: placeable,
    ROOM_W: ROOM_W, ROOM_H: ROOM_H, ROOM_WORLD_W: ROOM_WORLD_W, ROOM_WORLD_H: ROOM_WORLD_H,
    room: room, roomNpcs: roomNpcs, roomBlockers: roomBlockers,
    roomCanStand: roomCanStand, roomPlaceable: roomPlaceable, buildRoomCanvas: buildRoomCanvas,
    doorOut: doorOut
  };
})();
