"use strict";
// PIXEL QUEST UPGRADE v2 - dimuat SETELAH game.js
(function () {
const wOf = n => Math.floor((n - 1) / 15) + 1, sOf = n => (n - 1) % 15 + 1;
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

// ---------- DATA WORLD ----------
const WD = [
 { name: "GREEN FOREST", sky: ["#4fb5e8", "#c9f0d6"], far: "#2f8a4a", g: ["#5cc24f", "#338b40", "#8a5a32", "#a8743f"], plat: ["#8b5a2b", "#5c3a1a"], rock: "#7d8794", pit: "#173325", haz: "#2f7d32" },
 { name: "DESERT KINGDOM", sky: ["#e9a24f", "#fbe3a1"], far: "#c98a4a", g: ["#f0cf7a", "#d9b25a", "#c9954a", "#e3b868"], plat: ["#d9b25a", "#a8793a"], rock: "#a58a63", pit: "#5a3d1c", haz: "#4b8a3c" },
 { name: "FROZEN LAND", sky: ["#8fc3e8", "#eaf6ff"], far: "#a9c9e6", g: ["#f4fbff", "#bfe4f5", "#7fa9c9", "#9cc4e0"], plat: ["#bfe8ff", "#7fc4e8"], rock: "#8fb4d0", pit: "#12304f", haz: "#9ee8ff" },
 { name: "LAVA KINGDOM", sky: ["#3a0d0d", "#d9561f"], far: "#5a1a14", g: ["#6a3a30", "#4a2620", "#33201c", "#e25a1a"], plat: ["#5a4a48", "#2d2220"], rock: "#4a3a38", pit: "#ff5a14", haz: "#ff9a1a" },
 { name: "SHADOW DIMENSION", sky: ["#150a2e", "#4a2a7a"], far: "#2a1650", g: ["#6a46a8", "#3d2a6e", "#231640", "#8a5ad8"], plat: ["#5a3d9a", "#2d1d5a"], rock: "#3b2d5e", pit: "#0a0518", haz: "#c06bff" }
];
const SN = [
 "Sunny Trail,Mushroom Hop,Stump Road,Thorn Path,Bouncy Grove,Leaf Bridge,Hollow Log,Wolf Den,Vine Maze,Deep Woods,Pad Panic,Spiky Glade,Rootwalk,Ancient Tree,Forest Guardian",
 "Dune Walk,Cactus Road,Quicksand,Ruin Gate,Scorpion Pit,Sand Steps,Tomb Run,Mirage,Sun Temple,Dust Storm,Pharaoh Path,Cursed Sand,Oasis Gap,Sphinx Way,Desert King",
 "Snow Start,Icicle Alley,Slippery Slope,Frost Gap,Crystal Cave,Blizzard Run,Ice Bridge,Cold Steps,Glacier,Frozen Lake,Yeti Pass,Shard Fall,Polar Peak,Ice Palace,Frozen Guardian",
 "Ember Road,Lava Leap,Geyser Gap,Magma Bridge,Hot Rocks,Fire Pit,Volcano Climb,Ash Valley,Burning Steps,Molten Run,Cinder Castle,Blaze Path,Inferno,Lava Throne,Fire Lord",
 "Dark Gate,Violet Mist,Blink Bridge,Crystal Maze,Shade Run,Void Steps,Ghost Walk,Nightfall,Phantom Pit,Dim Castle,Shadow Leap,Dread Hall,Eclipse,Final Stairs,Shadow Throne"
].map(s => s.split(","));
const stageName = n => SN[wOf(n) - 1][sOf(n) - 1];
const AVATARS = ["Forest Hero", "Desert Warrior", "Frozen Knight", "Lava Guardian", "Shadow King"];
const RAR = p => p <= 150 ? "COMMON" : p <= 350 ? "RARE" : p <= 900 ? "EPIC" : "LEGENDARY";
const RCOL = { COMMON: "#8896a6", RARE: "#3d8fe0", EPIC: "#a050e8", LEGENDARY: "#e8a020" };

// ---------- ITEM BARU ----------
SHOP_ITEMS.shirt.push({ id: "shirt_armor", name: "Knight Armor", color: "#9aa6b8", price: 700, style: "armor" }, { id: "shirt_dragon", name: "Dragon Armor", color: "#b82a2a", price: 1300, style: "dragon" });
SHOP_ITEMS.hat.push({ id: "hat_horn", name: "Viking Helm", color: "#8a8f99", price: 650, style: "horn" }, { id: "hat_halo", name: "Angel Halo", color: "#ffe98a", price: 1400, style: "halo" });
SHOP_ITEMS.mask.push(
 { id: "mask_skull", name: "Skull Mask", color: "#eee8d8", price: 260, style: "skull" },
 { id: "mask_visor", name: "Cyber Visor", color: "#2fe6ff", price: 300, style: "visor" },
 { id: "mask_oni", name: "Oni Demon", color: "#c7302b", price: 620, style: "oni" },
 { id: "mask_spike4", name: "Balaclava Dongker", color: "#b6f21d", price: 2500, style: "spike4", only: "m" });
Object.values(SHOP_ITEMS).forEach(a => a.sort((x, y) => x.price - y.price));

const _dc = drawCharacter;
drawCharacter = function (c, ox, oy, s, o) {
 _dc(c, ox, oy, s, o);
 const dir = o.facing < 0 ? -1 : 1;
 const R = (x, y, w, h, col) => { c.fillStyle = col; c.fillRect(ox + (dir > 0 ? x : 16 - x - w) * s, oy + y * s, w * s, h * s); };
 const sh = o.shirt && o.shirt.style, hs = o.hat && o.hat.style, ms = o.mask && o.mask.style;
 if (sh === "armor") { R(3, 11, 10, 6, "#9aa6b8"); R(3, 11, 10, 1, "#dfe6ef"); R(7, 12, 2, 4, "#5f6b7d"); R(12, 10, 3, 3, "#c5cfdc"); R(1, 10, 3, 3, "#7d889a"); }
 if (sh === "dragon") { R(3, 11, 10, 6, "#b82a2a"); for (let i = 0; i < 4; i++) R(4 + i * 2, 12 + (i % 2) * 2, 2, 1, "#7a1818"); R(3, 11, 10, 1, "#f5c842"); R(12, 9, 2, 2, "#f5c842"); R(2, 9, 2, 2, "#f5c842"); R(7, 16, 2, 1, "#f5c842"); }
 if (hs === "horn") { R(3, 1, 10, 3, "#8a8f99"); R(3, 3, 10, 1, "#555b66"); R(1, 0, 2, 2, "#f4ecd0"); R(0, -2, 2, 2, "#f4ecd0"); R(13, 0, 2, 2, "#f4ecd0"); R(14, -2, 2, 2, "#f4ecd0"); }
 if (hs === "halo") { R(5, -4, 6, 1, "#ffe98a"); R(5, -2, 6, 1, "#ffe98a"); R(4, -3, 1, 1, "#ffe98a"); R(11, -3, 1, 1, "#ffe98a"); }
 if (ms === "skull") { R(3, 4, 10, 7, "#eee8d8"); R(9, 6, 3, 2, "#111"); R(4, 6, 2, 2, "#111"); R(7, 8, 1, 1, "#555"); R(4, 9, 8, 2, "#fff"); [6, 8, 10].forEach(x => R(x, 9, 1, 2, "#999")); }
 if (ms === "visor") { R(3, 5, 10, 3, "#1b2a3d"); R(8, 5, 5, 3, "#2fe6ff"); R(9, 6, 3, 1, "#c8ffff"); }
 if (ms === "oni") { R(3, 4, 10, 7, "#c7302b"); R(4, 1, 2, 3, "#f4ecd0"); R(10, 1, 2, 3, "#f4ecd0"); R(8, 5, 5, 1, "#5a0f0f"); R(9, 6, 3, 2, "#ffd84a"); R(10, 6, 1, 2, "#111"); R(9, 10, 1, 2, "#fff"); R(12, 10, 1, 2, "#fff"); }
 if (ms === "spike4") {
  const L = "#b6f21d", P = "#ff1f8e", D = "#c4136a";
  R(3, 2, 10, 9, L); R(3, 8, 10, 3, P);
  [4, 6, 8, 10, 12].forEach(x => R(x, 8, 1, 1, L));
  R(9, 6, 3, 2, "#fff"); R(10, 6, 2, 2, "#111");
  R(9, 9, 3, 1, "#444"); R(11, 10, 1, 3, L);
  R(9, 1, 2, 1, P); R(9, -1, 2, 2, P); R(10, -3, 1, 2, D);
  R(6, 1, 3, 1, P); R(6, -2, 2, 3, P); R(5, -4, 1, 2, D); R(7, -3, 1, 2, P);
  R(3, 1, 3, 1, P); R(3, -1, 2, 2, P); R(1, -3, 2, 2, P); R(0, -5, 1, 2, D);
  R(2, 3, 2, 3, P); R(0, 4, 2, 2, P); R(-2, 4, 2, 1, D);
 }
};

// ---------- CSS ----------
const st = document.createElement("style");
st.textContent = `
#pqAuth,#pqProf,#pqChest{position:absolute;inset:0;display:grid;place-items:center;text-align:center;font-family:Nunito,Arial,sans-serif}
#pqAuth{z-index:100;background:radial-gradient(circle at 50% 30%,#2b4a74,#0e1828)}
#pqProf{z-index:9;background:rgba(0,0,0,.78)}
#pqChest{z-index:200;background:radial-gradient(circle,#2a1a4a,#05030c);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px}
.pq-card{width:min(360px,92%);max-height:94%;overflow:auto;padding:22px;display:flex;flex-direction:column;gap:10px;background:#263b56;border:3px solid #ffdc59;border-radius:10px;animation:pqIn .35s ease}
.pq-card.wide{width:min(520px,94%)}
.pq-card h1{font-family:'Press Start 2P',monospace;color:#ffdc59;font-size:20px;line-height:1.6;text-shadow:3px 3px #a74530}
.pq-card h2,.pq-card h3{color:#ffdc59}.pq-card input{padding:12px;background:#15243a;border:1px solid #7891a8;color:#fff;outline:none;border-radius:4px}
.pq-b{padding:12px;background:#405a78;color:#fff;font-weight:900;border-radius:5px;border:2px solid #8298ac}.pq-b.main{background:#e87940;border-color:#fff0c5}
#pqErr{color:#ff8a8a;font-size:12px;min-height:14px}
.pq-stats{display:grid;grid-template-columns:1fr 1fr;gap:6px;font-size:12px}.pq-stats div{background:#1b2c45;padding:7px;border-radius:5px}.pq-stats b{color:#ffdc59}
.pq-av{display:flex;flex-wrap:wrap;gap:8px;justify-content:center}.pq-av canvas{width:48px;height:48px;border:3px solid #536a85;border-radius:6px;image-rendering:pixelated;cursor:pointer}
.pq-av canvas.sel{border-color:#ffdc59}.pq-av canvas.lock{filter:grayscale(1) brightness(.35);cursor:default}
.pq-rar{position:absolute;top:5px;right:5px;padding:2px 5px;font-size:8px;font-weight:900;border-radius:3px;color:#fff}
.pq-leg{box-shadow:0 0 12px #e8a020;animation:pqGlow 1.4s infinite alternate}
#pqChest h1{font-family:'Press Start 2P',monospace;color:#ffdc59;font-size:clamp(14px,4vw,26px);opacity:0;transition:opacity .6s;text-shadow:3px 3px #a74530}
#pqChest p,#pqChest button{opacity:0;transition:opacity .6s;color:#fff;font-weight:900}#pqChest.show h1,#pqChest.show p,#pqChest.show button{opacity:1}
#pqChest button{padding:12px 26px;background:#e87940;border:2px solid #fff;border-radius:5px}
.level-grid.worlds{grid-template-columns:repeat(5,1fr);max-width:1000px;gap:16px}
.wcard{position:relative;overflow:hidden;border-radius:14px;border:3px solid #536a85;background:#1b2c45;color:#fff;padding:0;display:flex;flex-direction:column;animation:pqIn .5s both;transition:transform .2s,box-shadow .2s}
.wcard:hover:not(.wlock){transform:translateY(-8px) scale(1.02);box-shadow:0 12px 28px rgba(0,0,0,.5),0 0 0 3px var(--wc)}
.wcard canvas{width:100%;aspect-ratio:160/110;image-rendering:pixelated;display:block}
.winfo{padding:10px;text-align:left;display:flex;flex-direction:column;gap:6px}
.winfo h4{font-size:13px;color:#ffdc59}.winfo small{font-size:9px;color:#a9bed4;letter-spacing:2px}
.wbar{height:7px;background:#0e1828;border-radius:4px;overflow:hidden}.wbar i{display:block;height:100%;background:linear-gradient(90deg,#ffdc59,#e97940)}
.wrow{display:flex;justify-content:space-between;font-size:11px;font-weight:900}
.wlock{cursor:not-allowed}.wlock canvas{filter:grayscale(1) brightness(.4)}
.wlockov{position:absolute;top:0;left:0;right:0;aspect-ratio:160/110;display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:30px;gap:4px}
.wlockov small{font-size:10px;color:#fff;padding:0 8px}
.wdone{border-color:#ffdc59;box-shadow:0 0 14px rgba(255,220,89,.4)}
.level-grid.stages{max-width:900px;gap:12px}
.level-grid.stages .level-card{min-height:112px;animation:pqIn .4s both;text-shadow:0 1px 3px #000}
.level-grid.stages .level-card.unlocked:hover{transform:translateY(-5px)}
.level-card .sname{font-size:9px;opacity:.9;max-width:92%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.level-card.bosscard{border-color:#ffdc59;box-shadow:0 0 12px rgba(255,220,89,.5)}
@media(max-width:900px){.level-grid.worlds{grid-template-columns:repeat(2,1fr)}}
@media(max-width:700px){.level-grid.stages{grid-template-columns:repeat(3,1fr)}}
@keyframes pqIn{from{opacity:0;transform:translateY(14px) scale(.96)}to{opacity:1;transform:none}}
@keyframes pqGlow{to{box-shadow:0 0 22px #ffcf4a}}`;
document.head.appendChild(st);
function el(tag, id, html, cls) { const e = document.createElement(tag); if (id) e.id = id; if (cls) e.className = cls; if (html) e.innerHTML = html; $("app").appendChild(e); return e; }

// ---------- AVATAR ----------
function drawAvatar(c, i, x, y, S) {
 const u = S / 16, P = (a, b, w, h, col) => { c.fillStyle = col; c.fillRect(x + a * u, y + b * u, w * u, h * u); };
 P(0, 0, 16, 16, ["#9be0a5", "#f0cf7a", "#cfeeff", "#ff7a2a", "#3a2470"][i]);
 const face = () => { P(4, 5, 8, 8, "#f4bd8b"); P(5, 8, 2, 2, "#fff"); P(9, 8, 2, 2, "#fff"); P(6, 8, 1, 2, "#111"); P(10, 8, 1, 2, "#111"); P(7, 11, 2, 1, "#a0522d"); };
 if (i === 0) { face(); P(3, 3, 10, 3, "#2e8b3a"); P(3, 5, 2, 6, "#2e8b3a"); P(11, 5, 2, 6, "#2e8b3a"); P(8, 1, 3, 3, "#6fd46b"); P(2, 13, 12, 3, "#2e8b3a"); }
 if (i === 1) { face(); P(3, 2, 10, 4, "#e8d9b0"); P(3, 4, 10, 1, "#c0392b"); P(7, 3, 2, 2, "#2fb7a8"); P(4, 10, 8, 3, "#c0392b"); P(2, 13, 12, 3, "#e8b93a"); }
 if (i === 2) { P(3, 2, 10, 5, "#aab7c8"); P(3, 6, 2, 6, "#aab7c8"); P(11, 6, 2, 6, "#aab7c8"); P(5, 7, 6, 5, "#f4bd8b"); P(5, 8, 6, 1, "#223"); P(7, 0, 2, 3, "#6fd8ff"); P(2, 13, 12, 3, "#8896a8"); }
 if (i === 3) { P(2, 0, 2, 4, "#ff8a1a"); P(12, 0, 2, 4, "#ff8a1a"); P(3, 2, 10, 6, "#3a2a28"); P(3, 7, 10, 5, "#3a2a28"); P(4, 8, 8, 3, "#1a0f0e"); P(5, 8, 2, 2, "#ff6a14"); P(9, 8, 2, 2, "#ff6a14"); P(2, 13, 12, 3, "#55403c"); P(2, 13, 12, 1, "#ff6a14"); }
 if (i === 4) { P(2, 3, 12, 10, "#1d1236"); P(5, 6, 6, 6, "#0b0618"); P(6, 8, 1, 2, "#d46bff"); P(9, 8, 1, 2, "#d46bff"); P(4, 1, 8, 2, "#ffd24a"); P(4, 0, 1, 1, "#ffd24a"); P(7, 0, 2, 1, "#ffd24a"); P(11, 0, 1, 1, "#ffd24a"); P(2, 13, 12, 3, "#5a3d9a"); }
}
function avCanvas(i, size, px) { const c = document.createElement("canvas"); c.width = c.height = px; c.getContext("2d").imageSmoothingEnabled = false; drawAvatar(c.getContext("2d"), i, 0, 0, px); c.style.width = c.style.height = size + "px"; return c; }

// ---------- PETI ----------
const CH = [["#8b5a2b", "#e8b93a", "#a56b32", "#e94c38"], ["#c9a25c", "#f2d27a", "#dbb96e", "#2fb7a8"], ["#7fbfe6", "#e8f8ff", "#a8dcf5", "#7a5cff"], ["#3a2a28", "#ff8a1a", "#55403c", "#ff4a14"], ["#3a2470", "#ffd24a", "#52349a", "#d46bff"]];
function chestSprite(c, x, y, s, wi, open) {
 const [b, t, l, g] = CH[wi];
 c.save(); c.translate(x, y); c.scale(s, s);
 c.fillStyle = b; c.fillRect(0, -14, 24, 14); c.fillStyle = t; c.fillRect(0, -14, 24, 2); c.fillRect(0, -3, 24, 3); c.fillRect(10, -12, 4, 8);
 c.fillStyle = g; c.fillRect(11, -9, 2, 3);
 c.save(); c.translate(0, -14); c.rotate(-open * 1.15);
 c.fillStyle = l; c.fillRect(0, -8, 24, 8); c.fillStyle = t; c.fillRect(0, -8, 24, 2); c.fillRect(10, -6, 4, 6); c.fillStyle = g; c.fillRect(11, -4, 2, 2);
 c.restore(); c.restore();
}
function showChest(wi, done) {
 const ov = el("div", "pqChest", `<canvas id="pqCC" width="320" height="260" style="width:min(92vw,420px)"></canvas><h1>CONGRATULATIONS!</h1><p>${wi === 4 ? "LEGENDARY " : ""}AVATAR: ${AVATARS[wi]}</p><button id="pqCB">CONTINUE</button>`);
 const c = $("pqCC").getContext("2d"); c.imageSmoothingEnabled = false;
 let t = 0, alive = true, ps = [];
 const big = wi === 4;
 $("pqCB").onclick = () => { alive = false; ov.remove(); done(); };
 (function loop() {
  if (!alive) return;
  t++; c.clearRect(0, 0, 320, 260);
  const open = Math.max(0, Math.min(1, (t - 50) / 50)), sc = big ? 7 : 6;
  if (open > 0) {
   c.save(); c.globalCompositeOperation = "lighter"; c.translate(160, 170);
   for (let k = 0; k < 14; k++) { c.rotate(Math.PI * 2 / 14 + 0.002 * t); c.fillStyle = `rgba(255,220,120,${open * .22})`; c.beginPath(); c.moveTo(0, 0); c.lineTo(-14, -190 * open); c.lineTo(14, -190 * open); c.fill(); }
   c.restore();
   for (let k = 0; k < (big ? 5 : 2); k++) ps.push({ x: 160 + (Math.random() - .5) * 120, y: 170, vx: (Math.random() - .5) * 1.5, vy: -1 - Math.random() * 2.5, l: 60, col: [CH[wi][1], CH[wi][3], "#fff"][k % 3] });
  }
  ps.forEach(p => { p.x += p.vx; p.y += p.vy; p.l--; c.globalAlpha = Math.max(0, p.l / 60); c.fillStyle = p.col; c.fillRect(p.x, p.y, 4, 4); }); c.globalAlpha = 1; ps = ps.filter(p => p.l > 0);
  const shake = t < 50 ? Math.sin(t * 1.3) * 2 : 0;
  chestSprite(c, 160 - 12 * sc + shake, 230, sc, wi, open);
  if (t >= 70) { const a = Math.min(1, (t - 70) / 30), S = 96 * a; c.globalAlpha = a; drawAvatar(c, wi, 160 - S / 2, 150 - S - 24 * a, S); c.globalAlpha = 1; }
  if (t === 110) ov.classList.add("show");
  requestAnimationFrame(loop);
 })();
 playTone(523); setTimeout(() => playTone(784, .3), 900);
}

// ---------- GENERATOR 75 STAGE x 15 RINTANGAN (SEMUA BEDA) ----------
function rng(a) { return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const WPOOL = [
 ["enemy", "rock", "stumps", "pit", "spikes", "stairs", "pad", "swarm", "wall"],
 ["sand", "spikes", "pit", "enemy", "stairs", "small", "wall", "swarm", "combo"],
 ["icicle", "pit", "narrow", "stairs", "enemy", "spikes", "small", "wall", "combo"],
 ["geyser", "moving", "pit", "spikes", "combo", "small", "swarm", "narrow", "wall"],
 ["blink", "combo", "narrow", "small", "moving", "swarm", "wall", "spikes", "pad"]
];
const HARD = ["blink", "geyser", "narrow", "small", "moving", "combo"];
function genStage(n) {
 const w = wOf(n) - 1, s = sOf(n) - 1, d = (n - 1) / 74, R = rng(n * 7919 + 13), pool = WPOOL[w];
 const g = { pits: [], plats: [], moving: [], rocks: [], haz: [], en: [], pads: [], drops: [], gey: [], sands: [], blinks: [] };
 const A = pool[(s * 2 + w) % pool.length], B = pool[(s * 3 + 1 + w) % pool.length];
 let last = "";
 for (let i = 0; i < 15; i++) {
  const x = 240 + i * 148, r = R();
  let k = r < .38 ? A : r < .62 ? B : pool[Math.floor(R() * pool.length)];
  if (k === last) k = pool[Math.floor(R() * pool.length)];
  if (s < 2 && HARD.includes(k)) k = R() < .5 ? "enemy" : "rock";
  if (i === 0) k = "enemy";
  last = k;
  const pw = Math.round(58 + d * 38 + R() * 8);
  if (k === "pit") g.pits.push([x + 25, x + 25 + pw]);
  else if (k === "rock") { const h = 16 + Math.floor(R() * (10 + d * 14)); g.rocks.push({ x: x + 40, w: 22 + Math.floor(R() * 10), h }); if (d > .5) g.rocks.push({ x: x + 112, w: 20, h: h + 8 }); }
  else if (k === "spikes") g.haz.push({ x: x + 50, w: 24 + Math.round(d * 20) });
  else if (k === "enemy") g.en.push({ x: x + 70, r: Math.min(55, 34 + Math.round(R() * 14 + d * 14)) });
  else if (k === "stairs") { const v = Math.floor(R() * 3), ys = v === 0 ? [200, 165, 130] : v === 1 ? [190, 150, 190] : [210, 190, 170]; g.plats.push([x + 10, ys[0], 60], [x + 62, ys[1], 60], [x + 114, ys[2], 56]); if (d > .35) g.haz.push({ x: x + 58, w: 34 }); }
  else if (k === "moving") { g.pits.push([x + 5, x + 125]); g.moving.push({ x: x + 11, y: 204, w: 50, range: 58, sp: .025 + .015 * d, ph: R() * 6 }); }
  else if (k === "small") { const sw = Math.round(38 - d * 8); g.pits.push([x + 10, x + 120]); g.plats.push([x + 26, 212, sw], [x + 74, 196, sw]); }
  else if (k === "narrow") { const a = 40 + Math.round(d * 8), b = 38 + Math.round(d * 8); g.pits.push([x + 8, x + 8 + a], [x + 8 + a + 32, x + 8 + a + 32 + b]); }
  else if (k === "combo") { g.rocks.push({ x: x + 36, w: 24, h: 24 + Math.round(d * 8) }); g.haz.push({ x: x + 80, w: 30 }); if (d > .45) g.en.push({ x: x + 122, r: 12 }); }
  else if (k === "stumps") { g.rocks.push({ x: x + 30, w: 22, h: 14 }, { x: x + 62, w: 22, h: 28 }, { x: x + 94, w: 22, h: 14 }); }
  else if (k === "pad") { g.pads.push({ x: x + 20, w: 18 }); g.haz.push({ x: x + 62, w: 50 }); g.plats.push([x + 58, 150, 58]); }
  else if (k === "wall") { g.rocks.push({ x: x + 60, w: 18, h: Math.min(72, 50 + Math.round(d * 22)) }); }
  else if (k === "swarm") { g.en.push({ x: x + 28, r: 14 }, { x: x + 74, r: 14 }); if (d > .2) g.en.push({ x: x + 120, r: 12 }); }
  else if (k === "sand") { g.sands.push({ x: x + 25, w: 85 }); if (d > .3) g.rocks.push({ x: x + 118, w: 16, h: 20 }); }
  else if (k === "icicle") { g.drops.push({ x: x + 72, y: 40 }); if (d > .5) g.drops.push({ x: x + 112, y: 40 }); }
  else if (k === "geyser") { g.gey.push({ x: x + 60, ph: Math.floor(R() * 120) }); if (d > .5) g.gey.push({ x: x + 108, ph: Math.floor(R() * 120) }); }
  else if (k === "blink") { g.pits.push([x + 5, x + 125]); g.blinks.push({ x: x + 14, y: 212, w: 30, h: 10, type: "blink", off: 0 }, { x: x + 52, y: 200, w: 30, h: 10, type: "blink", off: 40 }, { x: x + 90, y: 212, w: 30, h: 10, type: "blink", off: 80 }); }
 }
 return g;
}

// ---------- BUILD / START LEVEL ----------
let hazards = [], rocksL = [], pads = [], sands = [], gey = [], drops = [], blinks = [], selWorld = null;
const blk = (x, p) => currentPits.some(q => x > q[0] - p && x < q[1] + p) || rocksL.some(r => x > r.x - p && x < r.x + r.w + p) || hazards.some(h => x > h.x - p && x < h.x + h.w + p) || gey.some(o => x > o.x - p && x < o.x + 14 + p);
safeX = function (x) { for (let i = 0; i < 60; i++) { if (!blk(x + 10, 24)) return Math.max(40, x); x -= 30; } return 40; };

buildLevel = function (n) {
 platforms = []; coins = []; enemies = []; particles = []; checkpoints = []; hazards = []; rocksL = []; pads = []; sands = []; gey = []; drops = []; blinks = [];
 const g = genStage(n), w = wOf(n) - 1, mk = (x, y) => ({ x, y, w: 10, h: 13, collected: false });
 worldWidth = 2600; finishX = 2500;
 currentPits = [...g.pits].sort((a, b) => a[0] - b[0]);
 let fs = 0;
 for (const p of currentPits) { if (p[0] > fs) platforms.push({ x: fs, y: 238, w: p[0] - fs, h: 50, type: "ground" }); fs = Math.max(fs, p[1]); }
 if (fs < worldWidth) platforms.push({ x: fs, y: 238, w: worldWidth - fs, h: 50, type: "ground" });
 g.plats.forEach(([x, y, pw]) => { platforms.push({ x, y, w: pw, h: 10, type: "floating" }); for (let i = 0; i < Math.max(1, Math.floor(pw / 35)); i++) coins.push(mk(x + 10 + i * 25, y - 18)); });
 g.moving.forEach(m => platforms.push({ x: m.x, y: m.y, w: m.w, h: 10, type: "moving", bx: m.x, range: m.range, sp: m.sp, ph: m.ph }));
 g.rocks.forEach(r => { const o = { x: r.x, y: 238 - r.h, w: r.w, h: r.h, type: "rock" }; platforms.push(o); rocksL.push(o); });
 pads = g.pads.map(p => ({ x: p.x, y: 232, w: p.w, h: 6, type: "pad" })); pads.forEach(p => platforms.push(p));
 hazards = g.haz.map(h => ({ x: h.x, y: 228, w: h.w, h: 10 }));
 sands = g.sands; gey = g.gey.map(o => ({ x: o.x, w: 14, ph: o.ph, h: 0 }));
 drops = g.drops.map(o => ({ x: o.x, y: o.y, sy: o.y, w: 8, h: 14, st: 0 }));
 blinks = g.blinks.map(b => ({ ...b, on: false }));
 currentPits.forEach(p => { const c = (p[0] + p[1]) / 2; coins.push(mk(c - 25, 178), mk(c, 168), mk(c + 25, 178)); });
 for (let x = 80; x < finishX - 30; x += 130) if (!blk(x, 14)) coins.push(mk(x, 218));
 g.en.forEach(e => enemies.push({ x: e.x, y: 219, by: 219, w: 16, h: 19, min: Math.max(20, e.x - e.r), max: Math.min(2570, e.x + e.r), speed: .5 + n * .012, direction: 1, dead: false, hop: w === 4 || (w === 3 && n % 2 === 0), elite: sOf(n) >= 8 }));
 for (let x = 350; x < finishX - 100; x += 350) { const sx = safeX(x); if (!checkpoints.some(c => c.x === sx)) checkpoints.push({ x: sx, hit: false }); }
 Object.assign(player, { x: 40, y: 180, vx: 0, vy: 0, grounded: false, facing: 1, invincible: 0 });
 previousPlayerBottom = player.y + player.h; previousPlayerVy = 0;
 cameraX = 0; checkpoint = 40; score = 0; lives = 3; deaths = 0; collectedCoins = 0; shake = 0; coyote = 0; jumpBuffer = 0;
 paused = false; gameOver = false; levelDone = false;
 input.left = input.right = input.jump = false;
 setText("gameLevel", "WORLD " + wOf(n) + " - STAGE " + sOf(n) + " · " + stageName(n));
 updateHUD();
};

startLevel = function (n) {
 if (n < 1 || n > 75 || n > save.unlocked) return;
 currentLevel = n; selWorld = wOf(n) - 1;
 buildLevel(n);
 toggleHidden("gameMessage", true); removeClass("resumeBtn", "hidden"); removeClass("restartBtn", "hidden");
 setText("messageMenuBtn", "DASHBOARD"); $("messageMenuBtn").onclick = () => showScreen("dashboard");
 showScreen("game"); startMusic();
};

const _up = updatePlayer;
updatePlayer = function () {
 for (const p of platforms) {
  if (p.type !== "moving") continue;
  const ox = p.x; p.x = p.bx + (Math.sin(frame * p.sp + p.ph) + 1) / 2 * p.range;
  if (player.grounded && player.x + player.w > ox && player.x < ox + p.w && Math.abs(player.y + player.h - p.y) < 3) player.x += p.x - ox;
 }
 for (const b of blinks) {
  const on = ((frame + b.off) % 140) < 90;
  if (on && !b.on) { platforms.push(b); b.on = true; }
  else if (!on && b.on) { const i = platforms.indexOf(b); if (i >= 0) platforms.splice(i, 1); b.on = false; }
 }
 for (const e of enemies) if (e.hop && !e.dead) e.y = e.by - Math.abs(Math.sin(frame * .07 + e.x)) * 16;
 const pv = player.vx, px0 = player.x; _up();
 if (wOf(currentLevel) === 3 && player.grounded && !input.left && !input.right && Math.abs(pv) > .1) player.vx = pv * .93 / .75;
 if (player.grounded && sands.some(z => player.x + player.w > z.x && player.x < z.x + z.w)) player.x -= (player.x - px0) * .5;
 if (player.grounded) for (const p of pads) if (player.x + player.w > p.x && player.x < p.x + p.w && Math.abs(player.y + player.h - p.y) < 2) { player.vy = -11; player.grounded = false; coyote = 0; spawnBurst(p.x + 9, p.y, "#ff8a8a", 8, 1.2); playTone(700, .12); break; }
 for (const o of gey) { const t = (frame + o.ph) % 120; o.h = t < 60 ? 0 : t < 70 ? (t - 60) * 5 : t < 100 ? 50 : Math.max(0, 50 - (t - 100) * 2.5); }
 for (const d of drops) {
  if (d.st === 0 && Math.abs(player.x + 8 - (d.x + 4)) < 48 && player.x < d.x + 40) d.st = 1;
  if (d.st === 1) { d.y += 4; if (d.y > 224) d.st = 2; }
  if (d.st === 2 && player.x < d.x - 140) { d.st = 0; d.y = d.sy; }
 }
 if (player.invincible <= 0 && !gameOver) {
  for (const h of hazards) if (collision(player, { x: h.x + 3, y: h.y + 2, w: h.w - 6, h: h.h - 2 })) { loseLife(); break; }
 }
 if (player.invincible <= 0 && !gameOver) for (const o of gey) if (o.h > 8 && collision(player, { x: o.x + 2, y: 238 - o.h, w: o.w - 4, h: o.h })) { loseLife(); break; }
 if (player.invincible <= 0 && !gameOver) for (const d of drops) if (d.st < 2 && collision(player, { x: d.x, y: d.y, w: d.w, h: d.h })) { loseLife(); break; }
};

const _sm = showMessage;
showMessage = (t, m) => _sm(t === "GAME OVER" ? "STAGE FAILED" : t, m);

// ---------- SELESAI STAGE ----------
completeLevel = function () {
 if (paused || gameOver || levelDone) return;
 levelDone = true; paused = true; stopMusic();
 const n = currentLevel, w = wOf(n) - 1, s = sOf(n);
 const ratio = coins.length ? collectedCoins / coins.length : 1;
 let stars = 1; if (ratio >= .75) stars++; if (deaths === 0) stars++;
 const earned = Math.floor(score / 10) + stars * 5, pass = stars >= 2;
 save.coins += earned; save.stars[n] = Math.max(Number(save.stars[n]) || 0, stars);
 if (pass) { if (!save.completed.includes(n)) save.completed.push(n); if (n < 75) save.unlocked = Math.max(save.unlocked, n + 1); }
 let chest = false;
 if (pass && s === 15 && !save.chests.includes(w)) {
  let all = true; for (let i = w * 15 + 1; i <= w * 15 + 15; i++) if (!save.completed.includes(i)) all = false;
  if (all) { chest = true; save.chests.push(w); if (!save.avatars.includes(w)) save.avatars.push(w); }
 }
 saveData(); updateDashboard();
 playTone(523); setTimeout(() => playTone(659), 150); setTimeout(() => playTone(784), 300);
 addClass("resumeBtn", "hidden"); pass ? addClass("restartBtn", "hidden") : removeClass("restartBtn", "hidden");
 const detail = starText(stars) + "  |  Koin: " + collectedCoins + "/" + coins.length + "  |  Mati: " + deaths;
 const finish = () => {
  const mb = () => $("messageMenuBtn");
  if (!pass) { showMessage("BELUM LULUS", "Baru " + stars + " bintang. Butuh minimal 2 bintang untuk membuka stage berikutnya. Ulangi!\n+" + earned + " koin\n" + detail); setText("messageMenuBtn", "STAGES"); mb().onclick = () => showScreen("levels"); }
  else if (n === 75) { showMessage("CHAMPION!", "Semua 5 World selesai! Kamu Shadow King!\n" + detail); setText("messageMenuBtn", "DASHBOARD"); mb().onclick = () => showScreen("dashboard"); }
  else { showMessage("STAGE COMPLETE!", "+" + earned + " koin! " + (s === 15 ? "World " + (w + 2) + " terbuka!" : "Stage " + (s + 1) + " terbuka!") + "\n" + detail); setText("messageMenuBtn", "NEXT STAGE"); mb().onclick = () => startLevel(n + 1); }
 };
 chest ? showChest(w, finish) : finish();
};

// ---------- WORLD / STAGE SELECT (BARU) ----------
function worldPreview(wi) {
 const cv = document.createElement("canvas"); cv.width = 160; cv.height = 110;
 const c = cv.getContext("2d"); c.imageSmoothingEnabled = false; const D = WD[wi];
 const gr = c.createLinearGradient(0, 0, 0, 110); gr.addColorStop(0, D.sky[0]); gr.addColorStop(1, D.sky[1]); c.fillStyle = gr; c.fillRect(0, 0, 160, 110);
 const R = (x, y, w, h, col) => { c.fillStyle = col; c.fillRect(x, y, w, h); };
 const tri = (x, y, w, h, col) => { c.fillStyle = col; c.beginPath(); c.moveTo(x, y); c.lineTo(x + w / 2, y - h); c.lineTo(x + w, y); c.fill(); };
 if (wi === 0) { R(125, 10, 14, 14, "#ffe66c"); [8, 48, 92, 128].forEach(x => { R(x + 5, 60, 4, 28, "#6b4423"); R(x - 3, 40, 20, 24, D.far); R(x, 30, 14, 14, "#3fb35a"); }); }
 else if (wi === 1) { R(120, 8, 18, 18, "#ffb84a"); tri(5, 88, 90, 55, "#c98a4a"); tri(60, 88, 70, 38, "#a8703a"); tri(110, 88, 60, 30, "#c98a4a"); }
 else if (wi === 2) { tri(-10, 88, 100, 64, "#8fb4d4"); tri(15, 46, 30, 20, "#fff"); tri(70, 88, 100, 48, "#a8c8e4"); for (let i = 0; i < 18; i++) R((i * 37) % 160, (i * 23) % 80, 2, 2, "#fff"); }
 else if (wi === 3) { tri(25, 88, 110, 72, "#3a1410"); R(68, 20, 24, 5, "#ff7a1a"); R(74, 10, 12, 10, "rgba(255,150,40,.6)"); for (let i = 0; i < 14; i++) R((i * 53) % 160, (i * 31) % 88, 2, 2, "#ffb02e"); }
 else { for (let i = 0; i < 16; i++) R((i * 47) % 160, (i * 29) % 60, 2, 2, "rgba(255,255,255,.85)"); c.fillStyle = "#e6d8ff"; c.beginPath(); c.arc(128, 24, 12, 0, 7); c.fill(); c.fillStyle = "#4a2a7a"; c.beginPath(); c.arc(133, 21, 11, 0, 7); c.fill(); R(14, 50, 56, 38, "#1d1040"); R(18, 36, 9, 16, "#1d1040"); R(56, 30, 9, 22, "#1d1040"); R(34, 62, 6, 12, "#c06bff"); tri(100, 88, 16, 34, "#b36bff"); tri(120, 88, 12, 22, "#8a4fd0"); }
 R(0, 88, 160, 22, D.g[2]); R(0, 88, 160, 4, D.g[0]); R(0, 92, 160, 3, D.g[1]);
 try { drawCharacter(c, 56, 40, 2, buildOutfit(save.cosmetics.equipped, { facing: 1 })); } catch (e) { }
 return cv;
}
renderLevels = function () {
 const grid = $("levelGrid"); grid.innerHTML = ""; setText("unlockedCount", save.unlocked + " / 75");
 const h = document.querySelector(".level-title h2"), p = document.querySelector(".level-title p");
 grid.className = "level-grid " + (selWorld === null ? "worlds" : "stages");
 if (selWorld === null) {
  $("levelScreen").style.background = "";
  h.textContent = "SELECT WORLD"; p.textContent = "Choose your adventure";
  WD.forEach((D, w) => {
   const open = save.unlocked > w * 15, ids = Array.from({ length: 15 }, (_, k) => w * 15 + k + 1);
   const done = ids.filter(i => save.completed.includes(i)).length, stars = ids.reduce((a, i) => a + (Number(save.stars[i]) || 0), 0);
   const b = document.createElement("button"); b.className = "wcard" + (open ? "" : " wlock") + (done === 15 ? " wdone" : "");
   b.style.animationDelay = (w * .08) + "s"; b.style.setProperty("--wc", D.sky[0]);
   b.appendChild(worldPreview(w));
   const info = document.createElement("div"); info.className = "winfo";
   info.innerHTML = `<small>WORLD ${w + 1}</small><h4>${D.name}</h4><div class="wbar"><i style="width:${done / 15 * 100}%"></i></div><div class="wrow"><span>${done}/15</span><span>★ ${stars}/45</span><span>${save.chests.includes(w) ? "🎁" : "📦"}</span></div>`;
   b.appendChild(info);
   if (!open) { const lk = document.createElement("div"); lk.className = "wlockov"; lk.innerHTML = `🔒<small>Selesaikan World ${w} (min ★★)</small>`; b.appendChild(lk); }
   else b.onclick = () => { selWorld = w; renderLevels(); };
   grid.appendChild(b);
  });
  return;
 }
 const D = WD[selWorld];
 $("levelScreen").style.background = `linear-gradient(rgba(12,22,36,.88),rgba(12,22,36,.96)),linear-gradient(${D.sky[0]},${D.sky[1]})`;
 h.textContent = "WORLD " + (selWorld + 1) + " - " + D.name; p.textContent = "Minimal 2 bintang untuk lanjut";
 for (let k = 1; k <= 15; k++) {
  const i = selWorld * 15 + k, un = i <= save.unlocked, cm = save.completed.includes(i), sr = Number(save.stars[i]) || 0;
  const b = document.createElement("button"); b.className = "level-card " + (un ? "unlocked" : "locked") + (cm ? " completed" : "") + (k === 15 ? " bosscard" : "");
  b.style.animationDelay = (k * .03) + "s";
  if (un && !cm) b.style.background = `linear-gradient(160deg,${D.sky[0]}cc,${D.far})`;
  b.innerHTML = `<span class="star">${cm ? "✔" : ""}</span><span class="level-number">${un ? String(k).padStart(2, "0") : "🔒"}</span><span class="level-stars">${sr ? starText(sr) : ""}</span><span class="sname">${k === 15 ? "🎁 " : ""}${esc(stageName(i))}</span><small>${cm ? "COMPLETED" : un ? "PLAY" : "LOCKED"}</small>`;
  if (un) b.onclick = () => startLevel(i);
  grid.appendChild(b);
 }
};
$("backDashboard").onclick = () => { if (selWorld !== null) { selWorld = null; renderLevels(); } else showScreen("dashboard"); };
$("playBtn").onclick = () => { selWorld = null; showScreen("levels"); };
const lf = document.querySelector(".level-footer"); if (lf) lf.textContent = "Selesaikan 15 stage dengan minimal ★★ untuk membuka World berikutnya. Bintang ★★★ = ambil banyak koin & tanpa mati!";

// ---------- BACKGROUND, PLATFORM, MUSUH, HUD ----------
drawBackground = function () {
 const wi = wOf(currentLevel) - 1, D = WD[wi], R = (x, y, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(x, y, w, h); };
 const gr = ctx.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, D.sky[0]); gr.addColorStop(1, D.sky[1]); ctx.fillStyle = gr; ctx.fillRect(0, 0, W, H);
 const sx = (i, sp, gap, mod) => ((i * gap - cameraX * sp) % mod + mod) % mod - 80;
 const tri = (x, y, w, h, c) => { ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + w / 2, y - h); ctx.lineTo(x + w, y); ctx.fill(); };
 if (wi === 0) {
  R(395, 25, 27, 27, "#ffe66c");
  for (let i = 0; i < 6; i++) { const x = sx(i, .2, 110, 660), y = 35 + (i % 3) * 22; R(x, y, 40, 9, "rgba(255,255,255,.95)"); R(x + 9, y - 7, 20, 14, "rgba(255,255,255,.95)"); }
  for (let i = 0; i < 9; i++) { const x = sx(i, .35, 90, 810); R(x + 12, 195, 7, 45, "#6b4423"); R(x - 2, 168, 36, 30, D.far); R(x + 4, 152, 24, 20, "#3fb35a"); }
 } else if (wi === 1) {
  R(380, 20, 40, 40, "#ffb84a"); R(386, 26, 28, 28, "#fff2a8");
  for (let i = 0; i < 4; i++) { const x = sx(i, .22, 260, 1040); tri(x, 238, 190, 95, "#c98a4a"); tri(x + 95, 238, 95, 95, "#a8703a"); }
  for (let i = 0; i < 6; i++) { const x = sx(i, .4, 130, 780); ctx.fillStyle = D.far; ctx.beginPath(); ctx.ellipse(x + 60, 245, 90, 28, 0, 0, 7); ctx.fill(); }
 } else if (wi === 2) {
  for (let i = 0; i < 4; i++) { const x = sx(i, .2, 200, 800); tri(x, 238, 230, 140, "#8fb4d4"); tri(x + 80, 238 - 98, 70, 42, "#fff"); }
  for (let i = 0; i < 6; i++) { const x = sx(i, .45, 120, 720); tri(x, 238, 80, 60, "#b8dcf2"); }
  for (let i = 0; i < 40; i++) R((i * 37 + frame * (.3 + i % 3 * .2)) % W, (i * 23 + frame * (.5 + i % 3 * .3)) % H, 2, 2, "#fff");
 } else if (wi === 3) {
  const x = 250 - cameraX * .15; tri(x - 60, 238, 320, 170, "#3a1410"); R(x + 76, 70, 48, 8, "#ff7a1a"); R(x + 90, 40 - (frame % 30) / 3, 20, 20, "rgba(255,150,40,.5)");
  for (let i = 0; i < 6; i++) tri(sx(i, .35, 140, 840), 238, 90, 60, "#4a1c16");
  for (let i = 0; i < 30; i++) R((i * 53) % W, H - (frame * (.4 + i % 3 * .2) + i * 40) % H, 2, 2, "#ffb02e");
 } else {
  for (let i = 0; i < 30; i++) if ((frame + i * 13) % 70 < 55) R((i * 97) % W, (i * 53) % 150, 2, 2, "rgba(255,255,255,.85)");
  ctx.fillStyle = "#e6d8ff"; ctx.beginPath(); ctx.arc(400, 50, 22, 0, 7); ctx.fill(); ctx.fillStyle = "#4a2a7a"; ctx.beginPath(); ctx.arc(408, 46, 20, 0, 7); ctx.fill();
  for (let i = 0; i < 3; i++) { const x = sx(i, .2, 330, 990); R(x, 150, 90, 90, "#1d1040"); R(x + 8, 120, 16, 30, "#1d1040"); R(x + 62, 110, 16, 40, "#1d1040"); R(x + 36, 135, 18, 15, "#1d1040"); R(x + 40, 170, 6, 10, "#c06bff"); }
  for (let i = 0; i < 7; i++) { const x = sx(i, .4, 100, 700), y = 60 + (i * 37) % 90 + Math.sin(frame * .04 + i) * 4; tri(x, y + 10, 14, 14, "#b36bff"); tri(x, y + 10, 14, -14, "#7a3fd0"); }
 }
};

drawPlatforms = function () {
 const wi = wOf(currentLevel) - 1, D = WD[wi], [gt, gm, gd, gx] = D.g, R = (x, y, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(x, y, w, h); };
 for (const p of currentPits) { const x = Math.round(p[0] - cameraX); if (x > W || x + p[1] - p[0] < 0) continue; R(x, 238, p[1] - p[0], H - 238, D.pit); if (wi === 3) for (let k = 0; k < p[1] - p[0]; k += 8) R(x + k, 242 + Math.round(Math.sin(frame * .1 + k) * 2), 6, 3, "#ffb02e"); }
 for (const b of blinks) { if (b.on) continue; const x = Math.round(b.x - cameraX); if (x + b.w < 0 || x > W) continue; ctx.strokeStyle = "rgba(200,140,255,.5)"; ctx.strokeRect(x + .5, b.y + .5, b.w - 1, b.h - 1); }
 for (const p of platforms) {
  const x = Math.round(p.x - cameraX); if (x + p.w < 0 || x > W) continue;
  if (p.type === "ground") { R(x, p.y, p.w, 5, gt); R(x, p.y + 5, p.w, 3, gm); R(x, p.y + 8, p.w, p.h - 8, gd); for (let j = 5; j < p.w; j += 20) { const sxj = x + j; if (sxj > -10 && sxj < W) R(sxj, p.y + 15, 8, 4, gx); } }
  else if (p.type === "rock") { R(x, p.y, p.w, p.h, D.rock); R(x, p.y, p.w, 3, "rgba(255,255,255,.28)"); R(x + p.w - 4, p.y, 4, p.h, "rgba(0,0,0,.28)"); R(x + 4, p.y + 7, 5, 2, "rgba(0,0,0,.25)"); }
  else if (p.type === "pad") { R(x, p.y, p.w, 6, "#e94c38"); R(x + 2, p.y, 3, 2, "#fff"); R(x + p.w - 6, p.y, 3, 2, "#fff"); R(x + 4, p.y + 6, p.w - 8, 2, "#8a6a3a"); }
  else { const bl = p.type === "blink"; R(x, p.y, p.w, 6, bl ? "#b36bff" : D.plat[0]); R(x, p.y + 6, p.w, 4, bl ? "#5a3d9a" : D.plat[1]); R(x, p.y, p.w, 1, "rgba(255,255,255,.35)"); if (p.type === "moving") { R(x + 3, p.y + 2, 3, 2, "#ffdc59"); R(x + p.w - 6, p.y + 2, 3, 2, "#ffdc59"); } }
 }
 for (const z of sands) { const x = Math.round(z.x - cameraX); if (x + z.w < 0 || x > W) continue; R(x, 238, z.w, 9, "#a8793a"); for (let k = 0; k < z.w; k += 9) R(x + k + (frame >> 3) % 4, 240 + (k / 9 | 0) % 3 * 2, 3, 2, "#e3b868"); }
 for (let wx = 100; wx < finishX; wx += 90) {
  const x = Math.round(wx - cameraX); if (x < -20 || x > W + 10 || blk(wx, 20) || (wx / 90 | 0) % 3 === 0) continue;
  const v = (wx / 90 | 0) % 2;
  if (wi === 0) { if (v) { R(x, 224, 3, 14, "#6b4423"); R(x - 4, 212, 11, 14, "#3fb35a"); } else { R(x, 232, 3, 6, "#f1e6c8"); R(x - 2, 228, 7, 4, "#e94c38"); R(x, 229, 1, 1, "#fff"); } }
  else if (wi === 1) { R(x, 224, 4, 14, "#4b8a3c"); R(x - 3, 228, 3, 2, "#4b8a3c"); R(x + 4, 226, 3, 2, "#4b8a3c"); if (v) R(x + 12, 230, 8, 8, "#a58a63"); }
  else if (wi === 2) { R(x, 228, 5, 10, "#bff0ff"); R(x + 1, 222, 3, 6, "#e8fbff"); if (v) R(x + 9, 232, 4, 6, "#9cdcf5"); }
  else if (wi === 3) { R(x, 230, 10, 8, "#2d1d1a"); R(x + 2, 233, 6, 1, "#ff6a14"); }
  else { R(x, 226, 4, 12, "#b36bff"); R(x + 5, 231, 3, 7, "#8a4fd0"); R(x + 1, 226, 1, 4, "#e6c8ff"); }
 }
 for (const h of hazards) {
  const x = Math.round(h.x - cameraX); if (x + h.w < 0 || x > W) continue;
  for (let k = 0; k < h.w; k += 8) { ctx.fillStyle = wi === 3 && (frame >> 2) % 2 ? "#ffd24a" : D.haz; ctx.beginPath(); ctx.moveTo(x + k, 238); ctx.lineTo(x + k + 4, 227 - (wi === 3 ? (frame + k) % 4 : 0)); ctx.lineTo(x + k + 8, 238); ctx.fill(); }
 }
 for (const o of gey) {
  const x = Math.round(o.x - cameraX); if (x < -20 || x > W + 20) continue; const t = (frame + o.ph) % 120;
  R(x, 235, 14, 4, "#2d1d1a"); if (t >= 45 && t < 60) R(x + 4, 231, 6, 4, "#ff6a14");
  if (o.h > 0) { R(x + 2, 238 - o.h, 10, o.h, "#ff8a1a"); R(x + 5, 238 - o.h, 4, o.h, "#ffd24a"); }
 }
 for (const d of drops) { if (d.st === 2) continue; const x = Math.round(d.x - cameraX); if (x < -20 || x > W + 20) continue; ctx.fillStyle = "#bff0ff"; ctx.beginPath(); ctx.moveTo(x, d.y); ctx.lineTo(x + 8, d.y); ctx.lineTo(x + 4, d.y + 14); ctx.fill(); R(x + 1, d.y, 2, 5, "#fff"); }
};

drawEnemies = function () {
 const wi = wOf(currentLevel) - 1;
 for (const e of enemies) {
  if (e.dead) continue; const x = Math.round(e.x - cameraX), y = Math.round(e.y); if (x < -30 || x > W + 30) continue;
  const f = Math.floor(frame / 8) % 2, L = e.direction > 0 ? 1 : 0, R = (a, b, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(x + a, y + b, w, h); };
  if (wi === 0) { R(2, 8, 12, 10, "#f1e6c8"); R(0, 1, 16, 9, e.elite ? "#8e2bc4" : "#e94c38"); R(3, 3, 3, 3, "#fff"); R(10, 2, 3, 3, "#fff"); R(6, 6, 3, 2, "#fff"); R(4 + L, 10, 2, 3, "#222"); R(10 + L, 10, 2, 3, "#222"); R(f ? 1 : 3, 16, 4, 3, "#8a6a3a"); R(f ? 11 : 9, 16, 4, 3, "#8a6a3a"); }
  else if (wi === 1) { R(1, 10, 13, 7, e.elite ? "#9a5a1a" : "#d9a441"); R(L ? 12 : 0, 7, 4, 4, "#b8791f"); R(L ? 0 : 12, 3, 3, 9, "#b8791f"); R(L ? 0 : 11, 1, 5, 3, "#b8791f"); R(L ? 0 : 13, 0, 2, 2, "#e33"); R(L ? 9 : 4, 11, 2, 2, "#111"); R(f ? 1 : 4, 16, 3, 3, "#7a4a10"); R(f ? 10 : 12, 16, 3, 3, "#7a4a10"); }
  else if (wi === 2) { R(0, 6, 16, 13, e.elite ? "#3a9ad8" : "#5fd4ff"); R(2, 3, 12, 5, "#8fe6ff"); R(4 + L, 8, 3, 4, "#fff"); R(9 + L, 8, 3, 4, "#fff"); R(5 + L, 9, 1, 2, "#123"); R(10 + L, 9, 1, 2, "#123"); if (e.elite) { R(3, 0, 2, 3, "#d7f6ff"); R(8, 0, 2, 3, "#d7f6ff"); R(12, 0, 2, 3, "#d7f6ff"); } }
  else if (wi === 3) { R(2, 6, 12, 12, "#ff6a14"); R(4, 2 - f, 8, 6, "#ff9a1a"); R(6, -2 - f, 4, 5, "#ffd24a"); R(5, 11, 6, 5, "#ffd24a"); R(4 + L, 8, 3, 3, "#fff"); R(9 + L, 8, 3, 3, "#fff"); R(5 + L, 9, 1, 2, "#400"); R(10 + L, 9, 1, 2, "#400"); if (e.elite) R(1, 4, 14, 2, "#a31010"); }
  else { ctx.globalAlpha = .88; R(1, 2, 14, 15, e.elite ? "#7a3fd0" : "#b58cff"); R(3, 0, 10, 3, e.elite ? "#7a3fd0" : "#b58cff"); R(1 + f, 17, 3, 2, "#b58cff"); R(6 - f, 17, 3, 2, "#b58cff"); R(11 + f, 17, 3, 2, "#b58cff"); ctx.globalAlpha = 1; R(3 + L, 6, 4, 4, "#fff"); R(9 + L, 6, 4, 4, "#fff"); R(4 + L, 7, 2, 3, "#ff2a6a"); R(10 + L, 7, 2, 3, "#ff2a6a"); R(6, 12, 4, 2, "#2a1650"); }
 }
};

const _df = drawFlag;
drawFlag = function () { _df(); if (sOf(currentLevel) === 15) chestSprite(ctx, Math.round(finishX - 40 - cameraX), 238, 1, wOf(currentLevel) - 1, 0); };

drawHUD = function () {
 const R = (x, y, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(x, y, w, h); };
 R(6, 6, 292, 20, "rgba(15,25,40,.8)");
 for (let i = 0; i < 3; i++) { const x = 14 + i * 17, c = i < lives ? "#ff3b4e" : "#4a2a35"; R(x + 1, 9, 3, 1, c); R(x + 6, 9, 3, 1, c); R(x, 10, 10, 3, c); R(x + 1, 13, 8, 1, c); R(x + 2, 14, 6, 1, c); R(x + 3, 15, 4, 1, c); R(x + 4, 16, 2, 1, c); if (i < lives) R(x + 1, 10, 2, 1, "#ffb0b8"); }
 R(66, 10, 1, 12, "rgba(255,255,255,.3)"); R(74, 11, 8, 10, "#ffe45c"); R(76, 13, 4, 6, "#c98516");
 ctx.fillStyle = "#fff"; ctx.font = "bold 10px monospace"; ctx.fillText(String(save.coins + Math.floor(score / 10)), 87, 20);
 R(130, 10, 1, 12, "rgba(255,255,255,.3)"); ctx.fillText("WORLD " + wOf(currentLevel) + " - STAGE " + sOf(currentLevel), 138, 20);
 const pr = Math.max(0, Math.min(1, player.x / finishX));
 R(W - 136, 8, 128, 14, "rgba(15,25,40,.8)"); R(W - 132, 13, 120, 4, "#3a4f68"); R(W - 132, 13, Math.round(120 * pr), 4, "#ffdc59"); R(W - 132 + Math.round(116 * pr), 10, 4, 10, "#e84e38");
};

// ---------- SHOP: rarity ----------
const _rs = renderShop;
renderShop = function () {
 _rs(); const items = SHOP_ITEMS[currentShopCategory] || [];
 document.querySelectorAll("#shopGrid .shop-item").forEach((c, i) => {
  const it = items[i]; if (!it) return; const r = RAR(it.price);
  const b = document.createElement("span"); b.className = "pq-rar"; b.textContent = r; b.style.background = RCOL[r]; c.appendChild(b);
  if (r === "LEGENDARY") c.classList.add("pq-leg");
 });
};

// ---------- AKUN ----------
const AK = "pq_accounts"; let curUser = null;
const getAcc = () => { try { return JSON.parse(localStorage.getItem(AK)) || {}; } catch (e) { return {}; } };
async function hashPw(pw, salt) {
 const enc = new TextEncoder();
 if (window.crypto && crypto.subtle) {
  const km = await crypto.subtle.importKey("raw", enc.encode(pw), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt: enc.encode(salt), iterations: 100000 }, km, 256);
  return Array.from(new Uint8Array(bits)).map(b => b.toString(16).padStart(2, "0")).join("");
 }
 let h = 5381; const s = salt + pw; for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0; return "f" + (h >>> 0).toString(16);
}
saveData = function () { if (!curUser) return; try { localStorage.setItem("pq_save_" + curUser, JSON.stringify(save)); } catch (e) { console.warn(e); } };
function loadAcc(u, disp) {
 const d = { name: disp, unlocked: 1, completed: [], stars: {}, coins: 0, music: true, sound: true, nameChanges: 0, nameHistory: [], avatars: [], avatar: null, chests: [], cosmetics: { skinColor: "#f4bd8b", hairColor: "#493020", owned: Object.values(DEFAULT_EQUIPPED), equipped: { ...DEFAULT_EQUIPPED } } };
 let r = null; try { r = JSON.parse(localStorage.getItem("pq_save_" + u)); } catch (e) { }
 if (!r) return d;
 const c = r.cosmetics || {}, cs = { ...d.cosmetics, ...c, owned: [...new Set([...(c.owned || []), ...d.cosmetics.owned])], equipped: { ...d.cosmetics.equipped, ...(c.equipped || {}) } };
 CATEGORIES.forEach(k => { const id = cs.equipped[k]; if (!getShopItem(id) || !cs.owned.includes(id)) cs.equipped[k] = DEFAULT_EQUIPPED[k]; });
 return { ...d, ...r, unlocked: Math.max(1, Math.min(75, +r.unlocked || 1)), coins: Math.max(0, +r.coins || 0), completed: Array.isArray(r.completed) ? r.completed : [], stars: r.stars && typeof r.stars === "object" ? r.stars : {}, avatars: Array.isArray(r.avatars) ? r.avatars : [], chests: Array.isArray(r.chests) ? r.chests : [], nameHistory: Array.isArray(r.nameHistory) ? r.nameHistory : [], cosmetics: cs };
}
const auth = el("div", "pqAuth", `<div class="pq-card"><h1>PIXEL QUEST</h1><p id="pqSub">Selamat datang!</p>
<div id="pqChoice" style="display:flex;flex-direction:column;gap:10px"><button class="pq-b main" id="pqGoCreate">BUAT AKUN</button><button class="pq-b" id="pqGoLogin">LOGIN</button></div>
<div id="pqForm" class="hidden" style="display:flex;flex-direction:column;gap:10px"><h3 id="pqFT"></h3><input id="pqUser" maxlength="16" placeholder="Username (3-16, huruf/angka/_)" autocomplete="off"><input id="pqPass" type="password" maxlength="32" placeholder="Password (min 4)"><p id="pqErr"></p><button class="pq-b main" id="pqSubmit">OK</button><button class="pq-b" id="pqBack">KEMBALI</button></div></div>`, "hidden");
let mode = "login";
function authView(form) { $("pqChoice").classList.toggle("hidden", form); $("pqForm").classList.toggle("hidden", !form); $("pqErr").textContent = ""; }
function showAuth() { auth.classList.remove("hidden"); authView(false); $("pqUser").value = $("pqPass").value = ""; }
$("pqGoCreate").onclick = () => { mode = "create"; $("pqFT").textContent = "BUAT AKUN"; $("pqSubmit").textContent = "BUAT AKUN"; authView(true); };
$("pqGoLogin").onclick = () => { mode = "login"; $("pqFT").textContent = "LOGIN"; $("pqSubmit").textContent = "LOGIN"; authView(true); };
$("pqBack").onclick = () => authView(false);
["pqUser", "pqPass"].forEach(id => { $(id).addEventListener("keydown", e => { e.stopPropagation(); if (e.key === "Enter") $("pqSubmit").click(); }); $(id).addEventListener("keyup", e => e.stopPropagation()); });
$("pqSubmit").onclick = async () => {
 const u = $("pqUser").value.trim(), pw = $("pqPass").value, key = u.toLowerCase(), acc = getAcc(), err = m => $("pqErr").textContent = m;
 if (!/^[A-Za-z0-9_]{3,16}$/.test(u)) return err("Username 3-16 karakter: huruf, angka, _");
 if (pw.length < 4) return err("Password minimal 4 karakter");
 if (mode === "create") {
  if (acc[key]) return err("Username sudah dipakai");
  const salt = Math.random().toString(36).slice(2) + Date.now().toString(36);
  acc[key] = { user: u, salt, hash: await hashPw(pw, salt) }; localStorage.setItem(AK, JSON.stringify(acc)); loginAs(key);
 } else {
  const a = acc[key]; if (!a || a.hash !== await hashPw(pw, a.salt)) return err("Username atau password salah");
  loginAs(key);
 }
};
function loginAs(key) {
 const a = getAcc()[key]; if (!a) return showAuth();
 curUser = key; localStorage.setItem("pq_session", key);
 save = loadAcc(key, a.user); tryOn = { ...save.cosmetics.equipped };
 auth.classList.add("hidden"); selWorld = null; paused = true;
 showScreen("dashboard"); renderShop(); updateDashboard();
}
function logout() { saveData(); localStorage.removeItem("pq_session"); curUser = null; paused = true; stopMusic(); prof.classList.add("hidden"); showScreen("dashboard"); showAuth(); }

// ---------- PROFIL ----------
const prof = el("div", "pqProf", "", "hidden");
function renderProfile() {
 const ts = Object.values(save.stars).reduce((a, b) => a + (+b || 0), 0), wd = [1, 2, 3, 4, 5].filter(w => save.completed.filter(i => wOf(i) === w).length === 15).length;
 prof.innerHTML = `<div class="pq-card wide"><div id="pqPA"></div><h2 id="pqPN"></h2><small>@${esc(curUser)}</small>
 <div class="pq-stats"><div>LEVEL <b>${1 + Math.floor(ts / 4)}</b></div><div>KOIN <b>🪙 ${save.coins}</b></div><div>TOTAL BINTANG <b>★ ${ts}</b></div><div>STAGE SELESAI <b>${save.completed.length}/75</b></div><div>WORLD SELESAI <b>${wd}/5</b></div><div>GANTI NAMA <b>${save.nameChanges === 0 ? "1x GRATIS" : "100 🪙"}</b></div></div>
 <h3>KOLEKSI AVATAR</h3><div class="pq-av" id="pqAvs"></div>
 <button class="pq-b main" id="pqRen">UBAH NAMA</button><button class="pq-b" id="pqLog">LOGOUT</button><button class="pq-b" id="pqClose">TUTUP</button></div>`;
 $("pqPN").textContent = save.name;
 const big = save.avatar !== null ? avCanvas(save.avatar, 72, 64) : Object.assign(document.createElement("div"), { textContent: save.name.charAt(0).toUpperCase(), style: "font-size:36px;font-weight:900" }); $("pqPA").appendChild(big);
 AVATARS.forEach((n, i) => {
  const c = avCanvas(i, 48, 48), has = save.avatars.includes(i); c.title = has ? n : "Selesaikan World " + (i + 1) + " & buka peti";
  c.className = (has ? "" : "lock ") + (save.avatar === i ? "sel" : ""); if (has) c.onclick = () => { save.avatar = i; saveData(); renderProfile(); updateDashboard(); }; $("pqAvs").appendChild(c);
 });
 $("pqRen").onclick = openNameModal; $("pqLog").onclick = logout; $("pqClose").onclick = () => prof.classList.add("hidden");
}
function openProfile() { renderProfile(); prof.classList.remove("hidden"); }
const hint = document.createElement("p"); hint.id = "pqHint"; hint.style.cssText = "font-size:12px;color:#ffdc59"; $("nameModal").querySelector(".modal-card").insertBefore(hint, $("nameInput"));
function openNameModal() { $("nameInput").value = save.name; hint.textContent = save.nameChanges === 0 ? "Ganti nama pertama GRATIS." : "Biaya ganti nama: 100 koin (koinmu: " + save.coins + ")."; $("nameModal").classList.remove("hidden"); }
$("saveName").onclick = () => {
 const nm = $("nameInput").value.trim().slice(0, 16); if (nm.length < 2) return showToast("Nama minimal 2 karakter!");
 if (nm === save.name) return showToast("Nama sama dengan sebelumnya");
 const cost = save.nameChanges === 0 ? 0 : 100;
 if (save.coins < cost) { playTone(150); return showToast("Koin kurang! Butuh 100 koin untuk ganti nama."); }
 save.coins -= cost; save.nameHistory.push({ from: save.name, to: nm, cost, at: Date.now() }); save.nameChanges++; save.name = nm;
 saveData(); toggleHidden("nameModal", true); updateDashboard(); if (!prof.classList.contains("hidden")) renderProfile();
};
$("editName").textContent = "PROFIL"; $("editName").onclick = openProfile; $("avatar").style.cursor = "pointer"; $("avatar").onclick = openProfile;

// ---------- DASHBOARD ----------
const _ud = updateDashboard;
updateDashboard = function () {
 _ud();
 setText("highestLevel", String(save.unlocked).padStart(2, "0") + " / 75");
 const n = save.completed.length; setText("playerRank", n >= 75 ? "SHADOW KING" : n >= 40 ? "LEGEND ADVENTURER" : n >= 15 ? "MASTER ADVENTURER" : n >= 5 ? "PRO ADVENTURER" : "BEGINNER ADVENTURER");
 const av = $("avatar"); if (av && save.avatar !== null) { av.textContent = ""; av.appendChild(avCanvas(save.avatar, 37, 48)); }
};
document.querySelector(".top-stats .stat small").textContent = "STAGE";
const ft = document.querySelectorAll(".dashboard-footer span")[1]; if (ft) ft.textContent = "5 WORLDS • 75 STAGES • 3 LIVES";

// ---------- START ----------
const sess = localStorage.getItem("pq_session");
if (sess && getAcc()[sess]) loginAs(sess); else showAuth();
})();