/* ============ MARIO 2D — plateforme rétro avec mini-boss ============ */
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const W = canvas.width;
const H = canvas.height;
const TILE = 32;
const ROWS = 16;

/* ---------------- Générateur de niveaux ---------------- */
function buildLevel(def) {
  const width = def.width;
  const t = Array.from({ length: ROWS }, () => Array(width).fill('.'));
  const enemies = [];
  let flagX = width - 6;

  const set = (x, y, c) => {
    if (x >= 0 && x < width && y >= 0 && y < ROWS) t[y][x] = c;
  };
  const api = {
    gap(x, w) { for (let i = 0; i < w; i++) { set(x + i, 14, '.'); set(x + i, 15, '.'); } },
    block(x, y) { set(x, y, 'X'); },
    platform(x, y, w) { for (let i = 0; i < w; i++) set(x + i, y, 'X'); },
    brick(x, y, w = 1) { for (let i = 0; i < w; i++) set(x + i, y, 'B'); },
    q(x, y) { set(x, y, '?'); },
    coin(x, y) { set(x, y, 'o'); },
    coins(x, y, n) { for (let i = 0; i < n; i++) set(x + i, y, 'o'); },
    pipe(x, h) { for (let i = 0; i < h; i++) { set(x, 13 - i, 'P'); set(x + 1, 13 - i, 'P'); } },
    stairs(x, h) {
      for (let i = 0; i < h; i++) for (let j = 0; j <= i; j++) set(x + i, 13 - j, 'X');
    },
    stairsDown(x, h) {
      for (let i = 0; i < h; i++) for (let j = 0; j < h - i; j++) set(x + i, 13 - j, 'X');
    },
    enemy(x, type = 'goomba', y = 13) { enemies.push({ x, y, type }); },
    flag(x) { flagX = x; },
    start(x, y = 12) { start = { x, y }; },
  };
  let start = { x: 2, y: 12 };
  for (let x = 0; x < width; x++) { t[14][x] = 'X'; t[15][x] = 'X'; }
  def.build(api);
  return { name: def.name, sky: def.sky, width, tiles: t, enemies, flagX, start,
           boss: def.boss, arenaX: def.arenaX, bossName: def.bossName };
}

/* ---------------- Niveaux ---------------- */
const LEVEL_DEFS = [
  {
    name: 'Monde 1-1', sky: '#5c94fc', width: 134,
    boss: 'roi', bossName: 'ROI GOOMBA', arenaX: 108,
    build(a) {
      a.q(16, 10);
      a.brick(21, 10, 2); a.q(23, 10); a.brick(24, 10, 2);
      a.q(23, 6); a.coins(21, 6, 5);
      a.pipe(30, 2); a.pipe(40, 3);
      a.enemy(24); a.enemy(36); a.enemy(46); a.enemy(52, 'spiny');
      a.gap(56, 3);
      a.coins(56, 11, 3);
      a.brick(64, 10, 3); a.q(66, 6);
      a.pipe(72, 2);
      a.enemy(70); a.enemy(76, 'koopa');
      a.gap(82, 4);
      a.coins(82, 10, 4);
      a.brick(90, 10, 5); a.q(92, 10); a.enemy(93);
      a.coins(90, 6, 5);
      a.stairs(100, 4); a.stairsDown(104, 4);
      a.flag(128);
    },
  },
  {
    name: 'Monde 1-2', sky: '#7ec0ee', width: 150,
    boss: 'rex', bossName: 'REX LE KOOPA', arenaX: 124,
    build(a) {
      a.gap(20, 3); a.coins(20, 11, 3);
      a.enemy(16); a.enemy(26);
      a.platform(28, 10, 4); a.coins(29, 9, 2); a.enemy(30, 'goomba', 9);
      a.gap(36, 4);
      a.q(44, 10); a.brick(45, 10, 3); a.q(47, 6);
      a.enemy(48); a.enemy(54, 'koopa');
      a.pipe(58, 3); a.enemy(62, 'spiny'); a.gap(66, 4);
      a.platform(70, 9, 5); a.coins(70, 8, 5);
      a.platform(78, 7, 4); a.coins(78, 6, 4); a.enemy(79, 'goomba', 6);
      a.enemy(86); a.enemy(90); a.enemy(94, 'koopa');
      a.brick(98, 10, 4); a.q(100, 10);
      a.gap(104, 5); a.platform(104, 9, 2); a.platform(108, 7, 2);
      a.coins(104, 8, 2); a.coins(108, 6, 2);
      a.enemy(114); a.q(116, 10);
      a.stairs(118, 4);
      a.flag(142);
    },
  },
  {
    name: 'Monde 1-3', sky: '#2e2e5c', width: 162,
    boss: 'bowser', bossName: 'BOWSER', arenaX: 134,
    build(a) {
      a.enemy(14, 'koopa'); a.enemy(18);
      a.gap(22, 4); a.coins(22, 10, 4);
      a.platform(26, 8, 3); a.enemy(27, 'goomba', 7);
      a.gap(32, 4); a.platform(34, 7, 3); a.coins(34, 6, 3);
      a.brick(42, 10, 3); a.q(43, 10);
      a.enemy(48); a.enemy(52); a.enemy(56, 'spiny');
      a.gap(60, 5); a.platform(60, 10, 2); a.platform(64, 8, 2);
      a.coins(60, 9, 2); a.coins(64, 7, 2);
      a.pipe(72, 2); a.enemy(77); a.enemy(80);
      a.brick(84, 10, 2); a.q(86, 10); a.brick(88, 10, 2);
      a.coins(84, 6, 6); a.q(86, 6);
      a.gap(94, 3); a.gap(100, 3); a.gap(106, 4);
      a.platform(96, 9, 2); a.coins(96, 8, 2);
      a.enemy(112, 'koopa'); a.enemy(116); a.enemy(119, 'spiny');
      a.stairs(122, 5); a.stairsDown(128, 5);
      a.flag(152);
    },
  },
];

const BOSS_STYLE = {
  roi:    { body: '#8a4a20', body2: '#b06a2a', belly: '#d8a86a', crown: true,  horns: false, spikes: false, jump: -9,    spd: 1.4, fire: [130, 190], fbSpd: 3.8, waves: 0, spread: 1 },
  rex:    { body: '#1e8a2a', body2: '#37a344', belly: '#f5e0a0', crown: false, horns: true,  spikes: true,  jump: -11,   spd: 2.0, fire: [95, 150],  fbSpd: 4.6, waves: 1, spread: 2 },
  bowser: { body: '#d4620d', body2: '#f07f1e', belly: '#f5e0a0', crown: false, horns: true,  spikes: true,  jump: -12,   spd: 2.4, fire: [70, 115],  fbSpd: 5.4, waves: 2, spread: 3 },
};

/* ---------------- État ---------------- */
let state = 'menu'; // menu | help | quit | playing | paused | dead | flag | gameover | win
let levelIndex = 0;
let level = null;
let player, camX = 0, camY = 0;
let score = 0, coinCount = 0, lives = 3;
const MENU_ITEMS = ['JOUER', 'COMMANDES', 'QUITTER'];
const PAUSE_ITEMS = ['REPRENDRE', 'RECOMMENCER LE NIVEAU', 'MENU PRINCIPAL'];
let menuIndex = 0, pauseIndex = 0;
let particles = [];
let stateTimer = 0, frame = 0;
let persistent = { coins: new Set(), usedQ: new Set(), deadEnemies: new Set(), bossHp: null, checkpoint: null };
let boss = null, bossActive = false, bossDefeated = false;
let fireballs = [], waves = [];
let shakeT = 0, debugSkipBoss = false;

const keys = {};
addEventListener('keydown', (e) => {
  if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' '].includes(e.key)) e.preventDefault();
  const k = e.key;
  keys[k] = true;
  audioInit();
  if (state === 'menu') {
    if (k === 'ArrowUp') { menuIndex = (menuIndex + MENU_ITEMS.length - 1) % MENU_ITEMS.length; sfx.bump(); }
    else if (k === 'ArrowDown') { menuIndex = (menuIndex + 1) % MENU_ITEMS.length; sfx.bump(); }
    else if (k === 'Enter') menuSelect();
  } else if (state === 'help') {
    if (k === 'Enter' || k === 'Escape') state = 'menu';
  } else if (state === 'quit') {
    if (k === 'Enter') state = 'menu';
  } else if (state === 'playing') {
    if (k === 'Escape') { state = 'paused'; pauseIndex = 0; clearKeys(); }
  } else if (state === 'paused') {
    if (k === 'Escape') { clearKeys(); state = 'playing'; }
    else if (k === 'ArrowUp') { pauseIndex = (pauseIndex + PAUSE_ITEMS.length - 1) % PAUSE_ITEMS.length; sfx.bump(); }
    else if (k === 'ArrowDown') { pauseIndex = (pauseIndex + 1) % PAUSE_ITEMS.length; sfx.bump(); }
    else if (k === 'Enter') pauseSelect();
  } else if (state === 'gameover' || state === 'win') {
    if (k === 'Enter') { clearKeys(); state = 'menu'; }
  }
});
addEventListener('keyup', (e) => { keys[e.key] = false; });
addEventListener('blur', () => { for (const k in keys) keys[k] = false; });

function clearKeys() { for (const k in keys) keys[k] = false; }

function menuSelect() {
  if (menuIndex === 0) {
    score = 0; coinCount = 0; lives = 3;
    startLevel(0);
  } else if (menuIndex === 1) {
    state = 'help';
  } else {
    try { window.close(); } catch (err) { /* bloqué par le navigateur */ }
    state = 'quit';
  }
}

function pauseSelect() {
  if (pauseIndex === 0) {
    clearKeys();
    state = 'playing';
  } else if (pauseIndex === 1) {
    startLevel(levelIndex);
  } else {
    clearKeys();
    state = 'menu';
  }
}

function startLevel(i) {
  levelIndex = i;
  level = buildLevel(LEVEL_DEFS[i]);
  persistent = { coins: new Set(), usedQ: new Set(), deadEnemies: new Set(), bossHp: null, checkpoint: null };
  boss = null; bossActive = false; bossDefeated = false;
  fireballs = []; waves = [];
  spawnEntities();
  respawnPlayer();
  state = 'playing';
}

function spawnEntities() {
  level.enemies.forEach((e, idx) => {
    e.x = e.x * TILE; e.y = e.y * TILE + (TILE - 26);
    e.w = 26; e.h = 26; e.vx = 0; e.vy = 0; e.dead = false; e.squash = 0; e.idx = idx;
    e.dir = -1;
    e.speed = e.type === 'koopa' ? 2.0 : e.type === 'spiny' ? 0.9 : 1.1;
  });
}

function respawnPlayer() {
  const sx = persistent.checkpoint != null ? persistent.checkpoint : level.start.x;
  player = {
    x: sx * TILE, y: level.start.y * TILE,
    w: 22, h: 30, vx: 0, vy: 0, onGround: false,
    facing: 1, invul: 90, walkT: 0,
  };
}

/* ---------------- Audio rétro ---------------- */
let actx = null;
function audioInit() {
  if (!actx) {
    try { actx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { actx = null; }
  }
}
function beep(freq, dur = 0.1, type = 'square', vol = 0.15, slide = 0) {
  if (!actx) return;
  const o = actx.createOscillator();
  const g = actx.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, actx.currentTime);
  if (slide) o.frequency.linearRampToValueAtTime(Math.max(40, freq + slide), actx.currentTime + dur);
  g.gain.setValueAtTime(vol, actx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + dur);
  o.connect(g); g.connect(actx.destination);
  o.start(); o.stop(actx.currentTime + dur);
}
const sfx = {
  jump: () => beep(320, 0.14, 'square', 0.12, 260),
  coin: () => { beep(988, 0.07, 'square', 0.12); setTimeout(() => beep(1319, 0.18, 'square', 0.12), 70); },
  stomp: () => beep(180, 0.12, 'triangle', 0.2, -80),
  bump: () => beep(140, 0.08, 'square', 0.12),
  die: () => { beep(400, 0.15, 'square', 0.15, -150); setTimeout(() => beep(250, 0.25, 'square', 0.15, -100), 150); },
  flag: () => { [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => beep(f, 0.15, 'square', 0.12), i * 110)); },
  fire: () => beep(520, 0.16, 'sawtooth', 0.1, -320),
  bossHit: () => { beep(120, 0.2, 'square', 0.2, -60); setTimeout(() => beep(90, 0.15, 'triangle', 0.18), 90); },
  bossDie: () => { [784, 659, 523, 392, 262].forEach((f, i) => setTimeout(() => beep(f, 0.18, 'square', 0.15), i * 130)); },
  slam: () => beep(70, 0.3, 'triangle', 0.25, -30),
};

/* ---------------- Physique ---------------- */
const SOLIDS = 'XBP?U';
function solidAt(tx, ty) {
  if (ty < 0 || ty >= ROWS) return false;
  if (tx < 0 || tx >= level.width) return true;
  return SOLIDS.includes(level.tiles[ty][tx]);
}

function moveEntity(e) {
  let hitWall = false, landed = false, headHit = null;
  e.x += e.vx;
  const top = Math.floor(e.y / TILE), bot = Math.floor((e.y + e.h - 1) / TILE);
  if (e.vx > 0) {
    const tx = Math.floor((e.x + e.w - 1) / TILE);
    for (let ty = top; ty <= bot; ty++) if (solidAt(tx, ty)) { e.x = tx * TILE - e.w; e.vx = 0; hitWall = true; break; }
  } else if (e.vx < 0) {
    const tx = Math.floor(e.x / TILE);
    for (let ty = top; ty <= bot; ty++) if (solidAt(tx, ty)) { e.x = (tx + 1) * TILE; e.vx = 0; hitWall = true; break; }
  }
  e.y += e.vy;
  const left = Math.floor(e.x / TILE), right = Math.floor((e.x + e.w - 1) / TILE);
  if (e.vy > 0) {
    const ty = Math.floor((e.y + e.h - 1) / TILE);
    for (let tx = left; tx <= right; tx++) if (solidAt(tx, ty)) { e.y = ty * TILE - e.h; e.vy = 0; landed = true; break; }
  } else if (e.vy < 0) {
    const ty = Math.floor(e.y / TILE);
    for (let tx = left; tx <= right; tx++) if (solidAt(tx, ty)) { e.y = (ty + 1) * TILE; e.vy = 0; headHit = { tx, ty }; break; }
  }
  return { hitWall, landed, headHit };
}

function bumpQuestion(tx, ty) {
  const c = level.tiles[ty][tx];
  if (c !== '?') return;
  level.tiles[ty][tx] = 'U';
  persistent.usedQ.add(tx + ',' + ty);
  coinCount++; score += 100;
  sfx.coin();
  particles.push({ x: tx * TILE + TILE / 2, y: ty * TILE, vy: -3.2, life: 30, text: '+100' });
}

/* ---------------- Boss ---------------- */
function activateBoss() {
  const st = BOSS_STYLE[level.boss];
  const bw = 64, bh = 56;
  boss = {
    type: level.boss, name: level.bossName,
    x: (level.arenaX + 3) * TILE, y: 14 * TILE - bh,
    w: bw, h: bh, hp: persistent.bossHp != null ? persistent.bossHp : 5,
    maxHp: 5, dir: -1, vx: 0, vy: 0,
    spd: st.spd, onGround: false,
    fireT: 80, jumpT: 120, jumping: false, stun: 0, invul: 0, flashT: 0,
    dying: 0, rages: 0,
  };
  bossActive = true;
  if (persistent.checkpoint == null) persistent.checkpoint = level.arenaX - 1;
  sfx.bump();
  particles.push({ x: boss.x + bw / 2, y: boss.y - 10, vy: -1.5, life: 70, text: '⚠ ' + boss.name + ' !' });
}

function randInt(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }

function bossShoot() {
  const st = BOSS_STYLE[boss.type];
  const fx = boss.dir > 0 ? boss.x + boss.w : boss.x - 10;
  const fy = boss.y + 12;
  const n = st.spread;
  const vyList = n === 1 ? [0] : n === 2 ? [-1.6, 0] : [-3.4, 0, 3.4];
  for (let i = 0; i < n; i++) {
    fireballs.push({
      x: fx, y: fy + (n > 1 ? i * 4 - 4 : 0), w: 12, h: 12,
      vx: boss.dir * st.fbSpd + (n === 2 ? (i === 0 ? -0.6 : 0.6) : 0),
      vy: vyList[i], born: frame, dead: false,
    });
  }
  sfx.fire();
}

function bossLand() {
  const st = BOSS_STYLE[boss.type];
  if (st.waves <= 0) return;
  const gy = 14 * TILE;
  for (let i = 0; i < st.waves; i++) {
    const dir = st.waves === 1 ? (boss.dir > 0 ? 1 : -1) : (i === 0 ? -1 : 1);
    waves.push({ x: boss.x + boss.w / 2, y: gy - 20, w: 14, h: 20, vx: dir * (boss.type === 'bowser' ? 4.2 : 3.2), life: 400 });
  }
  sfx.slam();
  shakeT = 12;
}

function hitBoss() {
  boss.hp--;
  persistent.bossHp = Math.max(1, boss.hp);
  boss.invul = 55; boss.stun = 45; boss.flashT = 30;
  player.vy = -10.5;
  const st = BOSS_STYLE[boss.type];
  boss.rages++;
  boss.spd = st.spd + boss.rages * 0.16;
  score += 300;
  shakeT = 10;
  sfx.bossHit();
  particles.push({ x: boss.x + boss.w / 2, y: boss.y, vy: -2.5, life: 30, text: '+300' });
  if (boss.hp <= 0) defeatBoss();
}

function defeatBoss() {
  boss.dying = 90;
  boss.vy = -6;
  score += 2000;
  sfx.bossDie();
  for (let i = 0; i < 10; i++) {
    particles.push({
      x: boss.x + Math.random() * boss.w, y: boss.y + Math.random() * boss.h,
      vy: -2 - Math.random() * 3, life: 50 + randInt(0, 20),
      text: ['BOOM', '✦', '✧'][randInt(0, 2)],
    });
  }
}

function finishBoss() {
  boss = null;
  bossActive = false;
  bossDefeated = true;
  fireballs = [];
  waves = [];
}

function updateBoss() {
  if (!boss) return;
  if (boss.dying > 0) {
    boss.dying--;
    boss.vy += 0.4;
    boss.y += boss.vy;
    if (frame % 6 === 0) {
      particles.push({ x: boss.x + Math.random() * boss.w, y: boss.y + Math.random() * boss.h, vy: -2, life: 30, text: '✦' });
    }
    if (boss.dying <= 0) finishBoss();
    return;
  }
  const st = BOSS_STYLE[boss.type];
  const stunned = boss.stun > 0;
  if (stunned) boss.stun--;
  boss.invul = Math.max(0, boss.invul - 1);
  boss.flashT = Math.max(0, boss.flashT - 1);

  // poursuit le joueur
  if (!stunned) {
    boss.dir = player.x > boss.x ? 1 : -1;
    boss.vx = boss.dir * boss.spd;
    boss.jumpT--;
    if (boss.jumpT <= 0 && boss.onGround) {
      boss.vy = st.jump - boss.rages * 0.4;
      boss.jumping = true;
      boss.jumpT = Math.max(90, randInt(140, 240) - boss.rages * 15);
    }
    boss.fireT--;
    if (boss.fireT <= 0) {
      bossShoot();
      boss.fireT = Math.max(45, randInt(st.fire[0], st.fire[1]) * Math.pow(0.9, boss.rages));
    }
  } else {
    boss.vx = 0;
  }
  boss.vy = Math.min(boss.vy + 0.6, 14);
  const wasAir = !boss.onGround;
  const res = moveEntity(boss);
  boss.onGround = res.landed;
  if (res.landed && wasAir && boss.jumping) {
    boss.jumping = false;
    if (!stunned) bossLand();
  }
  if (res.hitWall) boss.dir *= -1;
  // reste dans l'arène
  const minX = (level.arenaX - 1) * TILE, maxX = (level.width - 3) * TILE - boss.w;
  if (boss.x < minX) { boss.x = minX; boss.vx = 0; }
  if (boss.x > maxX) { boss.x = maxX; boss.vx = 0; }
  // contact joueur
  if (state === 'playing' && boss.invul <= 0 && boss.stun <= 0) {
    if (rectHit(player, boss)) {
      if (player.vy > 1.5 && player.y + player.h - boss.y < 20) hitBoss();
      else if (player.invul <= 0) die();
    }
  }
  // les sauts remis après le stun
  if (stunned && boss.stun === 0) boss.jumpT = Math.max(boss.jumpT, 60);
}

function updateProjectiles() {
  for (const f of fireballs) {
    if (f.dead) continue;
    f.x += f.vx; f.y += f.vy;
    f.vy = Math.min(f.vy + 0.02, 4);
    const cx = Math.floor((f.x + f.w / 2) / TILE), cy = Math.floor((f.y + f.h / 2) / TILE);
    if (solidAt(cx, cy) || f.x < camX - 60 || f.x > camX + W + 60 || f.y > H) {
      f.dead = true;
      particles.push({ x: f.x + f.w / 2, y: f.y + f.h / 2, vy: -1, life: 15, text: '·' });
      continue;
    }
    if (state === 'playing' && player.invul <= 0 && rectHit(player, f)) {
      f.dead = true;
      die();
    }
  }
  fireballs = fireballs.filter((f) => !f.dead);
  for (const wv of waves) {
    wv.x += wv.vx;
    wv.life--;
    if (state === 'playing' && player.invul <= 0 && rectHit(player, wv)) die();
  }
  waves = waves.filter((w) => w.life > 0);
}

/* ---------------- Joueur ---------------- */
function flagTopY() { return 13 - 8; }

function die() {
  if (state !== 'playing') return;
  state = 'dead';
  stateTimer = 100;
  lives--;
  sfx.die();
}

function levelComplete() {
  if (state !== 'playing') return;
  state = 'flag';
  stateTimer = 90;
  score += 1000;
  if (bossDefeated) score += 500;
  sfx.flag();
}

function updatePlayer() {
  const accel = 0.55, maxSpd = 4.3, friction = 0.82, gravity = 0.6, jumpVel = -12.5;

  if (keys['ArrowLeft']) { player.vx -= accel; player.facing = -1; }
  if (keys['ArrowRight']) { player.vx += accel; player.facing = 1; }
  if (!keys['ArrowLeft'] && !keys['ArrowRight']) player.vx *= friction;
  player.vx = Math.max(-maxSpd, Math.min(maxSpd, player.vx));
  if (Math.abs(player.vx) < 0.05) player.vx = 0;

  if ((keys['ArrowUp'] || keys[' ']) && player.onGround) {
    player.vy = jumpVel;
    player.onGround = false;
    sfx.jump();
  }
  player.vy = Math.min(player.vy + gravity, 14);

  const res = moveEntity(player);
  if (res.landed) player.onGround = true;
  else if (player.vy !== 0) player.onGround = false;
  if (res.headHit) bumpQuestion(res.headHit.tx, res.headHit.ty);

  if (Math.abs(player.vx) > 0.3 && player.onGround) player.walkT += Math.abs(player.vx) * 0.06;
  player.invul = Math.max(0, player.invul - 1);

  const l = Math.floor(player.x / TILE), r = Math.floor((player.x + player.w - 1) / TILE);
  const tp = Math.floor(player.y / TILE), bt = Math.floor((player.y + player.h - 1) / TILE);
  for (let tx = l; tx <= r; tx++) {
    for (let ty = tp; ty <= bt; ty++) {
      if (ty < 0 || ty >= ROWS || tx < 0 || tx >= level.width) continue;
      const c = level.tiles[ty][tx];
      if (c === 'o') {
        const key = tx + ',' + ty;
        if (!persistent.coins.has(key)) {
          persistent.coins.add(key);
          level.tiles[ty][tx] = '.';
          coinCount++; score += 100; sfx.coin();
          particles.push({ x: tx * TILE + TILE / 2, y: ty * TILE, vy: -2.5, life: 25, text: '+100' });
        }
      } else if (tx >= level.flagX && tx <= level.flagX + 1 && ty >= flagTopY() && ty <= 13) {
        levelComplete();
        return;
      }
    }
  }
  if (player.x < 0) player.x = 0;
  if (player.y > H + 100) die();
}

/* ---------------- Ennemis ---------------- */
function updateEnemies() {
  for (const e of level.enemies) {
    if (persistent.deadEnemies.has(e.idx)) continue;
    if (e.dead) {
      e.squash++;
      if (e.squash > 40) persistent.deadEnemies.add(e.idx);
      continue;
    }
    if (Math.abs(e.x - player.x) > W) continue;
    e.vx = e.speed * e.dir;
    e.vy = Math.min(e.vy + 0.6, 14);
    const res = moveEntity(e);
    if (res.hitWall) e.dir *= -1;
    if (e.y > H + 100) { persistent.deadEnemies.add(e.idx); continue; }

    if (state !== 'playing') continue;
    if (rectHit(player, e)) {
      const canStomp = e.type !== 'spiny' && player.vy > 1.5 && player.y + player.h - e.y < 18;
      if (canStomp) {
        e.dead = true; e.squash = 0;
        player.vy = -8.5;
        score += 200; sfx.stomp();
        particles.push({ x: e.x + e.w / 2, y: e.y, vy: -2, life: 25, text: '+200' });
      } else if (player.invul <= 0) {
        die();
      }
    }
  }
}

function rectHit(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function updateParticles() {
  for (const p of particles) { p.y += p.vy; p.vy += 0.12; p.life--; }
  particles = particles.filter((p) => p.life > 0);
}

function update() {
  frame++;
  shakeT = Math.max(0, shakeT - 1);
  if (state === 'menu' || state === 'help' || state === 'quit' || state === 'paused') {
    return;
  }
  if (state === 'playing' || state === 'flag') {
    // verrou caméra pendant le boss
    const maxX = level.width * TILE - W;
    if (boss) {
      const target = Math.min(Math.max((level.arenaX - 6) * TILE, 0), maxX);
      camX += (target - camX) * 0.18;
    } else {
      camX = Math.max(0, Math.min(player.x - W / 2 + player.w / 2, maxX));
    }
  }
  if (state === 'playing') {
    if (!boss && !bossDefeated && level.boss && player.x > (level.arenaX + 1) * TILE) activateBoss();
    updatePlayer();
    updateEnemies();
    updateBoss();
    updateProjectiles();
  } else if (state === 'dead') {
    stateTimer--;
    if (stateTimer <= 0) {
      if (lives < 0) state = 'gameover';
      else { respawnPlayer(); state = 'playing'; }
    }
  } else if (state === 'flag') {
    stateTimer--;
    if (stateTimer <= 0) {
      if (levelIndex + 1 < LEVEL_DEFS.length) startLevel(levelIndex + 1);
      else state = 'win';
    }
  }
  updateParticles();
}

/* ---------------- Rendu personnages ---------------- */
function drawPlayer() {
  const px = player.x - camX, py = player.y - camY;
  if (player.invul > 0 && Math.floor(frame / 4) % 2 === 0) return;
  const f = player.facing;
  const run = player.onGround && Math.abs(player.vx) > 0.3;
  const air = !player.onGround;
  const swing = run ? Math.sin(player.walkT) : 0;
  const hx = f > 0 ? 1 : -1;

  // chaussures
  ctx.fillStyle = '#5a2d00';
  if (air) {
    ctx.fillRect(px + 1, py + 24, 9, 5);
    ctx.fillRect(px + 12, py + 26, 9, 4);
  } else {
    ctx.fillRect(px + 2 + swing * 4, py + 26, 9, 4);
    ctx.fillRect(px + 11 - swing * 4, py + 26, 9, 4);
  }
  // salopette
  ctx.fillStyle = '#2b3aa5';
  ctx.fillRect(px + 3, py + 13, 16, 11);
  // bretelles / torse
  ctx.fillStyle = '#e52521';
  ctx.fillRect(px + 3, py + 11, 16, 3);
  ctx.fillRect(px + 6, py + 13, 2, 4);
  ctx.fillRect(px + 14, py + 13, 2, 4);
  // bras
  ctx.fillStyle = '#e52521';
  const armLift = air ? -5 : -Math.round(Math.abs(swing) * 2);
  ctx.fillRect(px + (f > 0 ? 0 : 17), py + 12 + armLift, 5, 8);
  ctx.fillRect(px + (f > 0 ? 17 : 0), py + 13 - armLift, 5, 7);
  // gants
  ctx.fillStyle = '#fff';
  ctx.fillRect(px + (f > 0 ? 0 : 17), py + 18 + armLift, 5, 3);
  ctx.fillRect(px + (f > 0 ? 17 : 0), py + 18 - armLift, 5, 3);
  // boutons
  ctx.fillStyle = '#ffd700';
  ctx.fillRect(px + 7, py + 16, 2, 2);
  ctx.fillRect(px + 13, py + 16, 2, 2);
  // tête
  ctx.fillStyle = '#fbb77c';
  ctx.fillRect(px + 5 + (hx > 0 ? 1 : -1), py + 3, 14, 9);
  // oreille / cheveu
  ctx.fillStyle = '#5a2d00';
  ctx.fillRect(px + (f > 0 ? 4 : 17), py + 5, 2, 5);
  // nez
  ctx.fillStyle = '#e59d63';
  ctx.fillRect(px + (f > 0 ? 18 : 1), py + 8, 3, 3);
  // oeil
  ctx.fillStyle = '#fff';
  ctx.fillRect(px + (f > 0 ? 12 : 7), py + 5, 4, 4);
  ctx.fillStyle = '#1a3a8c';
  ctx.fillRect(px + (f > 0 ? 14 : 7), py + 6, 2, 3);
  // moustache
  ctx.fillStyle = '#5a2d00';
  ctx.fillRect(px + (f > 0 ? 11 : 4), py + 10, 8, 3);
  // casquette
  ctx.fillStyle = '#e52521';
  ctx.fillRect(px + 4, py, 16, 4);
  ctx.fillRect(px + (f > 0 ? 15 : 0), py + 2, 8, 3);
  // embleme "M"
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(px + 11, py + 2, 2.6, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#e52521';
  ctx.fillRect(px + 10, py + 1, 2, 2);
}

function raceColors(type) {
  return type === 'koopa'
    ? { shell: '#1e8a2a', shellD: '#0e6216', rim: '#f5e0a0', skin: '#ffd700' }
    : { shell: '#c03018', shellD: '#7a1610', rim: '#f5deb3', skin: '#e8a742' };
}

function drawEnemy(e) {
  if (persistent.deadEnemies.has(e.idx) && !e.dead) return;
  const px = e.x - camX, py = e.y - camY;
  if (px < -60 || px > W + 60) return;
  if (e.dead) {
    ctx.globalAlpha = Math.max(0.25, 1 - e.squash / 40);
    ctx.fillStyle = e.type === 'koopa' ? raceColors('koopa').shellD
      : e.type === 'spiny' ? raceColors('spiny').shellD : '#6a3a16';
    ctx.fillRect(px + 1, py + e.h - 7, e.w - 2, 7);
    ctx.globalAlpha = 1;
    return;
  }
  const wob = Math.sin(frame * 0.2 + e.idx) * 2;
  if (e.type === 'goomba') {
    // chapeau (tête géante)
    ctx.fillStyle = '#a05a20';
    ctx.beginPath();
    ctx.ellipse(px + e.w / 2, py + 11, 13, 11, 0, Math.PI, 0);
    ctx.fill();
    ctx.fillRect(px + 1, py + 11, e.w - 2, 8);
    ctx.fillStyle = '#7a3d10';
    ctx.fillRect(px + 1, py + 17, e.w - 2, 2);
    // reflet du chapeau
    ctx.fillStyle = '#c07a38';
    ctx.fillRect(px + 5, py + 4, 7, 3);
    // yeux furieux
    ctx.fillStyle = '#fff';
    ctx.fillRect(px + 5, py + 8, 6, 7);
    ctx.fillRect(px + 15, py + 8, 6, 7);
    ctx.fillStyle = '#000';
    ctx.fillRect(px + 8 + wob * 0.4, py + 10, 3, 4);
    ctx.fillRect(px + 15 + wob * 0.4, py + 10, 3, 4);
    // sourcils
    ctx.fillStyle = '#3a1c04';
    ctx.fillRect(px + 4, py + 6, 7, 2);
    ctx.fillRect(px + 15, py + 6, 7, 2);
    // pieds
    ctx.fillStyle = '#3a1c04';
    ctx.fillRect(px + 2 + wob, py + 19, 9, 7);
    ctx.fillRect(px + e.w - 11 - wob, py + 19, 9, 7);
  } else {
    const c = raceColors(e.type);
    // pieds
    ctx.fillStyle = c.skin;
    ctx.fillRect(px + 3 + wob, py + 20, 8, 6);
    ctx.fillRect(px + 15 - wob, py + 20, 8, 6);
    // carapace
    ctx.fillStyle = c.shell;
    ctx.beginPath();
    ctx.ellipse(px + e.w / 2, py + 15, 12, 11, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = c.rim;
    ctx.beginPath();
    ctx.ellipse(px + e.w / 2, py + 16, 8, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = c.shellD;
    for (let i = 0; i < 3; i++) {
      ctx.fillRect(px + 6 + i * 6, py + 10, 3, 3);
    }
    if (e.type === 'spiny') {
      // épées/pointes
      ctx.fillStyle = '#fff';
      for (let i = 0; i < 4; i++) {
        const sx = px + 4 + i * 5.5;
        ctx.beginPath();
        ctx.moveTo(sx, py + 8);
        ctx.lineTo(sx + 2.5, py + 1);
        ctx.lineTo(sx + 5, py + 8);
        ctx.closePath();
        ctx.fill();
      }
    }
    // tête
    ctx.fillStyle = c.skin;
    const hx = e.dir > 0 ? px + 17 : px + 0;
    ctx.fillRect(hx, py + 6, 9, 8);
    ctx.fillStyle = '#000';
    ctx.fillRect(hx + (e.dir > 0 ? 5 : 2), py + 8, 2, 3);
  }
}

/* ---------------- Rendu boss ---------------- */
function drawBoss() {
  if (!boss) return;
  const st = BOSS_STYLE[boss.type];
  const px = boss.x - camX, py = boss.y - camY;
  const f = boss.dir;
  ctx.save();
  if (boss.dying > 0) {
    ctx.globalAlpha = Math.max(0.15, boss.dying / 90);
    if (Math.floor(frame / 3) % 2 === 0) {
      ctx.globalAlpha = 0.9;
      ctx.fillStyle = '#fff';
    }
  } else if ((boss.invul > 0 || boss.stun > 0) && Math.floor(frame / 4) % 2 === 0) {
    ctx.globalAlpha = 0.45;
  }
  // pieds
  ctx.fillStyle = '#4a2410';
  ctx.fillRect(px + 4, py + boss.h - 10, 22, 10);
  ctx.fillRect(px + boss.w - 26, py + boss.h - 10, 22, 10);
  // corps
  ctx.fillStyle = st.body;
  ctx.beginPath();
  ctx.ellipse(px + boss.w / 2, py + 34, 30, 22, 0, 0, Math.PI * 2);
  ctx.fill();
  // ventre
  ctx.fillStyle = st.belly;
  ctx.beginPath();
  ctx.ellipse(px + boss.w / 2 + (f > 0 ? 6 : -6), py + 40, 16, 12, 0, 0, Math.PI * 2);
  ctx.fill();
  // carapace arrière avec pointes
  ctx.fillStyle = st.body2;
  ctx.beginPath();
  ctx.ellipse(px + boss.w / 2 - (f > 0 ? 14 : -14), py + 26, 14, 16, 0, 0, Math.PI * 2);
  ctx.fill();
  if (st.spikes) {
    ctx.fillStyle = '#fff';
    for (let i = 0; i < 3; i++) {
      const sx = px + boss.w / 2 - (f > 0 ? 24 : -6) + i * 6;
      ctx.beginPath();
      ctx.moveTo(sx, py + 16 - i * 2);
      ctx.lineTo(sx + 3, py + 6 - i * 3);
      ctx.lineTo(sx + 6, py + 16 - i * 2);
      ctx.closePath();
      ctx.fill();
    }
  }
  // tête
  ctx.fillStyle = st.body2;
  ctx.beginPath();
  ctx.ellipse(px + boss.w / 2 + (f > 0 ? 10 : -10), py + 10, 14, 11, 0, 0, Math.PI * 2);
  ctx.fill();
  // museau / gueule
  ctx.fillStyle = st.belly;
  ctx.fillRect(px + boss.w / 2 + (f > 0 ? 14 : -26), py + 12, 12, 7);
  // dents
  ctx.fillStyle = '#fff';
  ctx.fillRect(px + boss.w / 2 + (f > 0 ? 15 : -25), py + 12, 3, 3);
  ctx.fillRect(px + boss.w / 2 + (f > 0 ? 21 : -19), py + 12, 3, 3);
  // yeux furieux
  ctx.fillStyle = '#fff';
  ctx.fillRect(px + boss.w / 2 + (f > 0 ? 4 : -12), py + 2, 8, 6);
  ctx.fillStyle = '#c11515';
  ctx.fillRect(px + boss.w / 2 + (f > 0 ? 8 : -10), py + 3, 4, 4);
  // sourcil
  ctx.fillStyle = '#3a1c04';
  ctx.fillRect(px + boss.w / 2 + (f > 0 ? 3 : -13), py + 0, 10, 2);
  // cornes
  if (st.horns) {
    ctx.fillStyle = '#f5e0a0';
    for (const side of [-1, 1]) {
      const hx = px + boss.w / 2 + (f > 0 ? 4 : -2) + side * 9;
      ctx.beginPath();
      ctx.moveTo(hx, py + 4);
      ctx.lineTo(hx + 3, py - 8);
      ctx.lineTo(hx + 6, py + 4);
      ctx.closePath();
      ctx.fill();
    }
  }
  // couronne
  if (st.crown) {
    ctx.fillStyle = '#ffd700';
    const cx = px + boss.w / 2 - 12, cyc = py - 12;
    ctx.fillRect(cx, cyc, 24, 6);
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.moveTo(cx + i * 6, cyc);
      ctx.lineTo(cx + i * 6 + 3, cyc - 7);
      ctx.lineTo(cx + i * 6 + 6, cyc);
      ctx.closePath();
      ctx.fill();
    }
  }
  // flash blanc quand touché
  if (boss.flashT > 0) {
    ctx.globalAlpha = boss.flashT / 30 * 0.5;
    ctx.fillStyle = '#fff';
    ctx.fillRect(px - 4, py - 10, boss.w + 8, boss.h + 12);
  }
  ctx.restore();
}

function drawFireballs() {
  for (const fb of fireballs) {
    const px = fb.x - camX, py = fb.y - camY;
    ctx.fillStyle = 'rgba(255,110,0,0.35)';
    ctx.beginPath();
    ctx.arc(px + 6, py + 6, 8 + Math.sin(frame * 0.4) * 1.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ff5a00';
    ctx.beginPath();
    ctx.arc(px + 6, py + 6, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffd200';
    ctx.beginPath();
    ctx.arc(px + 6 - fb.vx * 0.8, py + 6, 3, 0, Math.PI * 2);
    ctx.fill();
  }
  for (const wv of waves) {
    const px = wv.x - camX, py = wv.y - camY;
    ctx.fillStyle = 'rgba(255,90,0,0.8)';
    for (let i = 0; i < 3; i++) {
      const fx = px + i * 5 - 5, h = 18 - i * 4 + Math.sin(frame * 0.5 + i) * 2;
      ctx.beginPath();
      ctx.moveTo(fx, py + 20);
      ctx.lineTo(fx + 2.5, py + 20 - h);
      ctx.lineTo(fx + 5, py + 20);
      ctx.closePath();
      ctx.fill();
    }
    ctx.fillStyle = '#ffd200';
    ctx.fillRect(px - 2, py + 16, 18, 4);
  }
}

function drawBossBar() {
  if (!boss || boss.dying > 0) return;
  const bw = 300, bx = (W - bw) / 2, by = 70;
  outlineText(boss.name, W / 2, by - 6, 18, '#ff8080');
  ctx.fillStyle = 'rgba(0,0,0,0.55)';
  ctx.fillRect(bx - 4, by, bw + 8, 18);
  for (let i = 0; i < boss.maxHp; i++) {
    ctx.fillStyle = i < boss.hp ? (boss.type === 'bowser' ? '#e52521' : '#eaa221') : '#4a3a2a';
    ctx.fillRect(bx + i * (bw / boss.maxHp) + 2, by + 3, bw / boss.maxHp - 4, 12);
  }
}

/* ---------------- Rendu monde ---------------- */
function drawBackground() {
  ctx.fillStyle = level ? level.sky : '#5c94fc';
  ctx.fillRect(0, 0, W, H);
  if (!level || state === 'menu') return;
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  for (let i = 0; i < 8; i++) {
    const cx = ((i * 260 - camX * 0.35) % (W + 300) + W + 300) % (W + 300) - 150;
    const cy = 50 + (i % 4) * 60;
    drawCloud(cx, cy);
  }
  ctx.fillStyle = 'rgba(0,120,60,0.5)';
  for (let i = 0; i < 6; i++) {
    const hx = ((i * 420 - camX * 0.5) % (W + 600) + W + 600) % (W + 600) - 250;
    ctx.beginPath();
    ctx.arc(hx, H - 20, 100, Math.PI, 0);
    ctx.fill();
  }
}

function drawCloud(x, y) {
  ctx.beginPath();
  ctx.arc(x, y, 22, 0, Math.PI * 2);
  ctx.arc(x + 24, y - 10, 26, 0, Math.PI * 2);
  ctx.arc(x + 52, y, 22, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(x - 20, y, 92, 20);
}

function drawTile(c, x, y, tx, ty) {
  const px = x - camX, py = y - camY;
  if (px < -TILE || px > W) return;
  const aboveSolid = ty > 0 && SOLIDS.includes(level.tiles[ty - 1][tx]);
  switch (c) {
    case 'X':
      ctx.fillStyle = '#8a4a20';
      ctx.fillRect(px, py, TILE, TILE);
      if (!aboveSolid) {
        ctx.fillStyle = '#3cb043';
        ctx.fillRect(px, py, TILE, 10);
        ctx.fillStyle = '#2e8b34';
        ctx.fillRect(px, py + 8, TILE, 3);
      }
      ctx.fillStyle = 'rgba(0,0,0,0.12)';
      ctx.fillRect(px, py + TILE - 3, TILE, 3);
      break;
    case 'B':
      ctx.fillStyle = '#c86428';
      ctx.fillRect(px, py, TILE, TILE);
      ctx.strokeStyle = '#7a3a10';
      ctx.lineWidth = 2;
      ctx.strokeRect(px + 1, py + 1, TILE - 2, TILE - 2);
      ctx.beginPath();
      ctx.moveTo(px, py + TILE / 2); ctx.lineTo(px + TILE, py + TILE / 2);
      ctx.moveTo(px + TILE / 2, py); ctx.lineTo(px + TILE / 2, py + TILE / 2);
      ctx.stroke();
      break;
    case '?': {
      const pulse = 0.5 + 0.5 * Math.sin(frame * 0.1);
      ctx.fillStyle = `rgb(240, ${Math.round(170 + pulse * 40)}, 30)`;
      ctx.fillRect(px, py, TILE, TILE);
      ctx.strokeStyle = '#a05000';
      ctx.lineWidth = 2;
      ctx.strokeRect(px + 1, py + 1, TILE - 2, TILE - 2);
      ctx.fillStyle = '#7a3a00';
      ctx.font = 'bold 20px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('?', px + TILE / 2, py + 23);
      break;
    }
    case 'U':
      ctx.fillStyle = '#9c5a1e';
      ctx.fillRect(px, py, TILE, TILE);
      ctx.strokeStyle = '#6a3a10';
      ctx.strokeRect(px + 1, py + 1, TILE - 2, TILE - 2);
      break;
    case 'P': {
      const isTop = ty === 0 || level.tiles[ty - 1][tx] !== 'P';
      ctx.fillStyle = '#1ea12e';
      ctx.fillRect(px, py, TILE, TILE);
      ctx.fillStyle = '#55d968';
      ctx.fillRect(px + 4, py, 6, TILE);
      if (isTop) {
        ctx.fillStyle = '#1e8a2a';
        ctx.fillRect(px - 3, py, TILE + 6, 10);
        ctx.fillStyle = '#55d968';
        ctx.fillRect(px - 3, py, TILE + 6, 4);
      }
      break;
    }
    case 'o': {
      const key = tx + ',' + ty;
      if (persistent.coins.has(key)) break;
      const sc = Math.abs(Math.cos(frame * 0.08 + tx));
      ctx.fillStyle = '#ffd700';
      ctx.beginPath();
      ctx.ellipse(px + TILE / 2, py + TILE / 2, 9 * sc + 2, 12, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#b8860b';
      ctx.beginPath();
      ctx.ellipse(px + TILE / 2, py + TILE / 2, 4 * sc + 1, 7, 0, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
  }
}

function drawFlag() {
  const px = level.flagX * TILE - camX;
  const topY = flagTopY() * TILE - camY;
  const poleH = (13 - flagTopY() + 1) * TILE;
  ctx.fillStyle = '#c0c0c0';
  ctx.fillRect(px + TILE / 2 - 3, topY, 6, poleH);
  ctx.fillStyle = '#1e90ff';
  ctx.beginPath();
  ctx.moveTo(px + TILE / 2 + 3, topY);
  ctx.lineTo(px + TILE / 2 + 34, topY + 14);
  ctx.lineTo(px + TILE / 2 + 3, topY + 28);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#ffd700';
  ctx.beginPath();
  ctx.arc(px + TILE / 2, topY - 4, 6, 0, Math.PI * 2);
  ctx.fill();
}

function drawTiles() {
  const c0 = Math.max(0, Math.floor(camX / TILE) - 1);
  const c1 = Math.min(level.width - 1, Math.ceil((camX + W) / TILE) + 1);
  for (let tx = c0; tx <= c1; tx++) {
    for (let ty = 0; ty < ROWS; ty++) {
      const c = level.tiles[ty][tx];
      if (c !== '.') drawTile(c, tx * TILE, ty * TILE, tx, ty);
    }
  }
  if (level.flagX >= c0 - 2 && level.flagX <= c1 + 2) drawFlag();
}

function drawHUD() {
  ctx.font = 'bold 18px monospace';
  ctx.textAlign = 'left';
  outlineText(`SCORE ${String(score).padStart(6, '0')}`, 20, 30);
  outlineText(`PIÈCES x${String(coinCount).padStart(2, '0')}`, 20, 56);
  ctx.textAlign = 'center';
  outlineText(level.name, W / 2, 30);
  ctx.textAlign = 'right';
  outlineText(`VIES ${'♥'.repeat(Math.max(0, lives))}`, W - 20, 30);
  drawBossBar();
}

function outlineText(txt, x, y, size = 18, color = '#fff') {
  ctx.font = `bold ${size}px monospace`;
  ctx.lineWidth = 4;
  ctx.strokeStyle = 'rgba(0,0,0,0.8)';
  ctx.strokeText(txt, x, y);
  ctx.fillStyle = color;
  ctx.fillText(txt, x, y);
}

function drawCenter(msg, sub, size = 42) {
  ctx.fillStyle = 'rgba(0,0,0,0.55)';
  ctx.fillRect(0, 0, W, H);
  outlineText(msg, W / 2, H / 2 - 20, size, '#ffd700');
  if (sub) outlineText(sub, W / 2, H / 2 + 30, 20, '#fff');
}

function drawArenaWarning() {
  if (bossActive && boss) {
    outlineText('SAUTE 5 FOIS SUR SA TÊTE !', W / 2, 104, 15, '#ffd700');
  }
}

function render() {
  ctx.save();
  if (shakeT > 0) {
    ctx.translate(Math.random() * 6 - 3, Math.random() * 6 - 3);
  }
  drawBackground();
  if (state === 'menu') {
    ctx.restore();
    drawMenuScreen();
    return;
  }
  if (state === 'help') {
    ctx.restore();
    drawHelpScreen();
    return;
  }
  if (state === 'quit') {
    ctx.restore();
    drawQuitScreen();
    return;
  }
  if (!level) { ctx.restore(); return; }
  drawTiles();
  for (const e of level.enemies) drawEnemy(e);
  drawBoss();
  drawFireballs();
  if (state !== 'flag' || Math.floor(frame / 6) % 2 === 0) drawPlayer();
  for (const p of particles) {
    ctx.globalAlpha = Math.min(1, p.life / 15);
    outlineText(p.text, p.x - camX, p.y - camY, 14, '#ffd700');
    ctx.globalAlpha = 1;
  }
  ctx.restore();
  drawHUD();
  drawArenaWarning();
  if (state === 'paused') drawPauseScreen();
  if (state === 'dead') outlineText('Aïe !', W / 2, H / 2, 36, '#ff5050');
  if (state === 'gameover') drawCenter('GAME OVER', 'Appuie sur ENTRÉE pour revenir au menu');
  if (state === 'win') drawCenter('FÉLICITATIONS !', `Score final : ${score} — ENTRÉE pour rejouer`);
  if (state === 'flag') drawCenter('NIVEAU TERMINÉ !', bossDefeated ? 'Boss vaincu ! +1500 points' : '+1000 points');
}

function drawMenuMascot(x, y, scale = 2) {
  const bob = Math.sin(frame * 0.08) * 6;
  ctx.save();
  ctx.translate(x, y + bob);
  ctx.scale(scale, scale);
  const fakeP = { x: 0, y: 0, w: 22, h: 30, facing: 1, invul: 0, walkT: frame * 0.1, onGround: true, vx: 1 };
  const savedP = player, savedLevel = level;
  player = fakeP;
  camX = 0; camY = 0;
  level = { width: 10, tiles: Array.from({ length: ROWS }, () => Array(10).fill('.')) };
  drawPlayer();
  level = savedLevel;
  player = savedP;
  ctx.restore();
}

function drawMenuList(items, index, midY, spacing = 44) {
  items.forEach((item, i) => {
    const y = midY + i * spacing;
    const sel = i === index;
    if (sel) {
      const pulse = 0.5 + 0.5 * Math.sin(frame * 0.15);
      ctx.fillStyle = `rgba(255,215,0,${0.12 + pulse * 0.12})`;
      ctx.fillRect(W / 2 - 190, y - 30, 380, 42);
      outlineText('▶', W / 2 - 160, y, 22, '#ffd700');
    }
    outlineText(item, W / 2 + 10, y, sel ? 26 : 22, sel ? '#ffd700' : '#fff');
  });
}

function drawMenuScreen() {
  ctx.fillStyle = '#5c94fc';
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#3cb043';
  ctx.fillRect(0, H - 64, W, 64);
  outlineText('MARIO 2D', W / 2, 110, 56, '#e52521');
  outlineText('3 niveaux — 3 mini-boss de plus en plus féroces', W / 2, 148, 18, '#fff');
  drawMenuMascot(120, H - 180);
  drawMenuMascot(W - 165, H - 180);
  drawMenuList(MENU_ITEMS, menuIndex, H / 2 + 20);
  if (Math.floor(frame / 30) % 2 === 0) {
    outlineText('↑ ↓ pour naviguer — ENTRÉE pour valider', W / 2, H - 30, 16);
  }
}

function drawHelpScreen() {
  ctx.fillStyle = '#1a1a2e';
  ctx.fillRect(0, 0, W, H);
  outlineText('COMMANDES', W / 2, 70, 34, '#ffd700');
  const lines = [
    ['← →   se déplacer', '#fff'],
    ['↑ / ESPACE   sauter (maintiens pour sauter plus haut)', '#fff'],
    ['ÉCHAP   pause en cours de jeu', '#fff'],
    ['', '#fff'],
    ['OBJECTIF', '#eaa221'],
    ['Prends les pièces et les blocs « ? », atteins le drapeau', '#fff'],
    ['Écrase Goombas et Koopas (+200 pts)...', '#fff'],
    ['MAIS NE TOUCHE JAMAIS LES SPINYS (rouges à pointes) !', '#ff8080'],
    ['', '#fff'],
    ['MINI-BOSS EN FIN DE NIVEAU', '#eaa221'],
    ['Saute 5 FOIS sur leur tête pour les vaincre', '#fff'],
    ['Le contact par le côté ou le dessous est mortel', '#fff'],
    ['Le dernier boss est EXTRA DUR : ondes de choc et rafales !', '#ff8080'],
  ];
  lines.forEach(([txt, col], i) => {
    outlineText(txt, W / 2, 120 + i * 30, txt === txt.toUpperCase() && txt ? 17 : 16, col);
  });
  if (Math.floor(frame / 30) % 2 === 0) {
    outlineText('— ENTRÉE pour revenir au menu —', W / 2, H - 40, 18);
  }
}

function drawQuitScreen() {
  ctx.fillStyle = '#101018';
  ctx.fillRect(0, 0, W, H);
  outlineText('MERCI D\'AVOIR JOUÉ !', W / 2, H / 2 - 60, 40, '#ffd700');
  if (score > 0) outlineText(`Score de la dernière partie : ${score}`, W / 2, H / 2, 20, '#fff');
  outlineText('Tu peux fermer cette fenêtre ou cet onglet.', W / 2, H / 2 + 50, 17, '#aaa');
  if (Math.floor(frame / 30) % 2 === 0) {
    outlineText('— ENTRÉE pour revenir au menu —', W / 2, H / 2 + 110, 18);
  }
}

function drawPauseScreen() {
  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  ctx.fillRect(0, 0, W, H);
  outlineText('PAUSE', W / 2, H / 2 - 110, 40, '#ffd700');
  ctx.fillStyle = 'rgba(20,20,40,0.85)';
  ctx.fillRect(W / 2 - 210, H / 2 - 80, 420, PAUSE_ITEMS.length * 44 + 40);
  ctx.strokeStyle = '#ffd700';
  ctx.lineWidth = 2;
  ctx.strokeRect(W / 2 - 210, H / 2 - 80, 420, PAUSE_ITEMS.length * 44 + 40);
  drawMenuList(PAUSE_ITEMS, pauseIndex, H / 2 - 30);
  outlineText('ÉCHAP pour reprendre', W / 2, H / 2 + PAUSE_ITEMS.length * 44 - 8, 15, '#aaa');
}

/* ---------------- Boucle ---------------- */
function loop() {
  update();
  render();
  requestAnimationFrame(loop);
}
loop();
