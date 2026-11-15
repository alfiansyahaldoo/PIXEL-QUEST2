"use strict";
// PIXEL QUEST UPGRADE 4 - dimuat SETELAH upgrade3.js dan SEBELUM responsive.js
// Isi: Pengaturan (audio + volume, arah layar, kontrol, fullscreen), musik tiap world,
//      modal logout sendiri, Misi Harian + Achievement (klaim sekali),
//      warna kulit/rambut terpisah untuk cowok & cewek.
(function () {

const FA = n => '<i class="fa-solid fa-' + n + '"></i>';
const COIN = FA("coins");
const app = $("app");
const worldIdx = () => Math.floor((Math.max(1, currentLevel) - 1) / 15);

function mk(tag, id, cls, html) {
    const e = document.createElement(tag);
    if (id) e.id = id;
    if (cls) e.className = cls;
    if (html) e.innerHTML = html;
    app.appendChild(e);
    return e;
}

// ==================================================
// CSS
// ==================================================
const css = document.createElement("style");
css.textContent = `
.toast{z-index:500}

.pq4-ov{position:absolute;inset:0;z-index:140;background:rgba(0,0,0,.75);display:grid;place-items:center;padding:10px;font-family:Nunito,Arial,sans-serif}
#pq4Logout{z-index:300}
.pq4-card{width:min(560px,94%);max-height:94%;overflow:auto;background:#1c2d47;border:3px solid #536a85;border-radius:12px;padding:0 20px 18px;color:#fff;text-align:left;animation:pq4In .25s ease}
.pq4-card.small{width:min(380px,92%);padding:20px;text-align:center}
.pq4-head{position:sticky;top:0;z-index:2;background:#1c2d47;display:flex;justify-content:space-between;align-items:center;gap:10px;padding:14px 0 10px;border-bottom:1px solid #3a5070}
.pq4-head h2{font-size:18px;color:#fff}
.pq4-x{padding:10px 16px;background:#34506f;border:2px solid #7f9bb8;border-radius:8px;color:#fff;font-weight:900;font-size:13px}
.pq4-card section{padding:14px 0 10px;border-bottom:1px solid #3a5070}
.pq4-card section:last-child{border-bottom:0}
.pq4-card h3{color:#ffdc59;font-size:16px;margin-bottom:12px}
.pq4-btns{display:flex;flex-wrap:wrap;gap:10px;justify-content:center}
.pq4-b{padding:14px 20px;background:#34506f;border:2px solid #7f9bb8;border-radius:8px;color:#fff;font-weight:900;font-size:14px}
.pq4-b.off{opacity:.55}
.pq4-b.main{background:#e87940;border-color:#fff0c5}
.pq4-b.on{background:#2fa35f;border-color:#8fe0b0}
.pq4-sl{display:grid;grid-template-columns:110px 1fr 46px;gap:12px;align-items:center;margin:14px 0 0;font-size:15px;font-weight:700}
.pq4-sl b{text-align:right}
.pq4-sl input{width:100%;accent-color:#1e90ff;height:24px}
.pq4-note{font-size:12px;color:#aabdd0;margin:0 0 10px}

.pq4-tabs{display:flex;gap:8px;padding:12px 0 4px}
.pq4-tab{position:relative;flex:1;padding:11px 8px;background:#34506f;border:2px solid #7f9bb8;border-radius:8px;color:#fff;font-weight:900;font-size:13px}
.pq4-tab.on{background:#e97940;border-color:#ffcf91}
.pq4-dot{position:absolute;top:-6px;right:-6px;width:16px;height:16px;border-radius:50%;background:#ff3b3b;border:2px solid #fff;animation:pq4Blink 1s infinite}
.pq4-list{display:flex;flex-direction:column;gap:10px;padding:10px 0}
.pq4-row{display:flex;align-items:center;gap:12px;padding:10px 12px;background:#23395a;border:2px solid #3a5070;border-radius:10px}
.pq4-row.ready{border-color:#ffdc59;background:#2c3f5c}
.pq4-row.done{opacity:.6}
.pq4-info{flex:1;min-width:0;display:flex;flex-direction:column;gap:4px}
.pq4-info b{font-size:14px}
.pq4-info small{font-size:12px;color:#b6c8dc}
.pq4-bar{height:6px;background:#0e1828;border-radius:3px;overflow:hidden}
.pq4-bar i{display:block;height:100%;background:linear-gradient(90deg,#ffdc59,#e97940)}
.pq4-claim{position:relative;min-width:104px;padding:12px 10px;border-radius:8px;font-weight:900;font-size:13px;border:2px solid #4a627f}
.pq4-claim.wait{background:#34495f;color:#7f93a8;cursor:not-allowed}
.pq4-claim.done{background:#27425a;color:#8fe0b0;border-color:#3d6a56;cursor:default}
.pq4-claim.ready{background:linear-gradient(#ffe97a,#ffc72e);color:#3a2a00;border-color:#fff3b0;animation:pq4Pulse 1.1s infinite ease-in-out}
.pq4-claim.ready::after{content:"";position:absolute;top:-7px;right:-7px;width:15px;height:15px;border-radius:50%;background:#ff3b3b;border:2px solid #fff;animation:pq4Blink 1s infinite}
.pq4-badge{position:absolute;top:-9px;right:-9px;min-width:22px;height:22px;padding:0 5px;border-radius:11px;background:#ff3b3b;border:2px solid #fff;color:#fff;font-size:11px;font-weight:900;display:grid;place-items:center;animation:pq4Blink 1s infinite}
.pq4-questbtn{position:relative;background:#c28a1f!important;border-color:#ffe08a!important}
.pq4-questbtn.pq4-alert{animation:pq4Pulse 1.3s infinite ease-in-out}
#settingsBtn{font-size:18px}
#ctrlBtn,#fsBtn{display:none!important}
.pq4-pop{position:absolute;z-index:160;width:210px;background:#1c2d47;border:3px solid #536a85;border-radius:10px;padding:12px;color:#fff;font-family:Nunito,Arial,sans-serif;box-shadow:0 8px 24px rgba(0,0,0,.5);animation:pq4In .2s ease}
.pq4-pop.hidden{display:none}

@keyframes pq4In{from{opacity:0;transform:translateY(10px) scale(.97)}to{opacity:1;transform:none}}
@keyframes pq4Pulse{0%,100%{transform:scale(1);box-shadow:0 0 0 0 rgba(255,220,89,.7)}50%{transform:scale(1.06);box-shadow:0 0 14px 4px rgba(255,220,89,.8)}}
@keyframes pq4Blink{0%,100%{opacity:1}50%{opacity:.45}}

@media (max-width:560px){
 .pq4-sl{grid-template-columns:84px 1fr 42px;gap:8px;font-size:13px}
 .pq4-claim{min-width:84px}
}
@media (orientation:landscape) and (max-height:540px){
 .pq4-card{padding:0 14px 10px}
 .pq4-head{padding:8px 0 6px}
 .pq4-head h2{font-size:14px}
 .pq4-x{padding:6px 12px;font-size:11px}
 .pq4-card section{padding:8px 0 6px}
 .pq4-card h3{font-size:13px;margin-bottom:8px}
 .pq4-b{padding:8px 14px;font-size:12px}
 .pq4-sl{margin-top:8px}
 .pq4-row{padding:6px 10px}
 .pq4-claim{padding:8px 8px;font-size:11px}
 .pq4-tab{padding:7px 6px;font-size:11px}
 .pq4-card.small{padding:14px}
}
@media (min-width:1600px){
 .pq4-card{width:min(820px,80%)}
 .pq4-card.small{width:min(560px,70%)}
 .pq4-head h2{font-size:26px}
 .pq4-x,.pq4-b,.pq4-tab,.pq4-claim{font-size:19px}
 .pq4-card h3{font-size:22px}
 .pq4-sl{font-size:20px;grid-template-columns:170px 1fr 70px}
 .pq4-info b{font-size:20px}
 .pq4-info small,.pq4-note{font-size:16px}
}
`;
document.head.appendChild(css);

// ==================================================
// 1) VOLUME + AUDIO (musik & efek terpisah)
// ==================================================
const VKEY = "pq_volume";
const VOL = { music: 70, sfx: 80 };

const clampV = n => (isFinite(n) ? Math.max(0, Math.min(100, Math.round(+n))) : null);

try {
    const v = JSON.parse(localStorage.getItem(VKEY));

    if (v) {
        if (clampV(v.music) !== null) VOL.music = clampV(v.music);
        if (clampV(v.sfx) !== null) VOL.sfx = clampV(v.sfx);
    }
} catch (e) { }

function saveVol() {
    try { localStorage.setItem(VKEY, JSON.stringify(VOL)); } catch (e) { }
}

// efek suara ikut slider volume efek
playTone = function (freq, duration) {
    if (duration === undefined) duration = 0.1;

    if (!save.sound || VOL.sfx <= 0) return;

    const a = getAudio();
    if (!a) return;

    const o = a.createOscillator();
    const g = a.createGain();

    o.type = "square";
    o.frequency.value = freq;

    g.gain.setValueAtTime(0.07 * VOL.sfx / 100, a.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, a.currentTime + duration);

    o.connect(g);
    g.connect(a.destination);

    o.start();
    o.stop(a.currentTime + duration);
};

// ---------- musik: tiap world punya nada, tempo, dan suara sendiri ----------
const MUS = [
    // World 1 - Green Forest: ceria, C mayor, cepat
    { tempo: 200, wave: "triangle", gain: 1,
      notes: [392, 523, 659, 784, 659, 523, 587, 659, 523, 659, 784, 880, 784, 659, 587, 523],
      bass: [131, 175, 196, 131] },
    // World 2 - Desert: skala Timur Tengah, sedang
    { tempo: 260, wave: "triangle", gain: 1,
      notes: [294, 311, 370, 311, 294, 392, 370, 311, 440, 466, 440, 392, 370, 311, 294, 294],
      bass: [147, 147, 196, 147] },
    // World 3 - Frozen: lambat, jarang, seperti lonceng
    { tempo: 340, wave: "sine", gain: 1.4,
      notes: [659, 0, 784, 0, 988, 0, 784, 0, 880, 0, 740, 0, 659, 0, 587, 0],
      bass: [165, 220, 185, 165] },
    // World 4 - Lava: cepat, agresif
    { tempo: 150, wave: "sawtooth", gain: 0.45,
      notes: [220, 220, 330, 220, 262, 220, 330, 392, 220, 220, 330, 220, 294, 262, 247, 220],
      bass: [110, 110, 147, 131] },
    // World 5 - Shadow: lambat, seram
    { tempo: 330, wave: "square", gain: 0.4,
      notes: [262, 0, 311, 0, 392, 0, 311, 0, 247, 0, 294, 0, 349, 0, 294, 0],
      bass: [131, 98, 104, 98] }
];

function musicNote(freq, wave, dur, gainMul) {
    if (!save.music || VOL.music <= 0) return;

    const a = getAudio();
    if (!a) return;

    const o = a.createOscillator();
    const g = a.createGain();

    o.type = wave;
    o.frequency.value = freq;

    g.gain.setValueAtTime(0.03 * gainMul * VOL.music / 100, a.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0005, a.currentTime + dur);

    o.connect(g);
    g.connect(a.destination);

    o.start();
    o.stop(a.currentTime + dur);
}

startMusic = function () {
    stopMusic();

    if (!save.music || paused || currentScreen !== "game") return;

    const m = MUS[worldIdx()] || MUS[0];
    let i = 0;

    musicTimer = setInterval(() => {
        if (paused || currentScreen !== "game") return;

        const f = m.notes[i % m.notes.length];

        if (f) musicNote(f, m.wave, m.tempo / 1000 * 1.6, m.gain);

        if (i % 4 === 0) {
            musicNote(m.bass[(i / 4 | 0) % m.bass.length], "sine", m.tempo / 1000 * 3, 0.9);
        }

        i++;
    }, m.tempo);
};

// ==================================================
// 2) PENGATURAN (tanpa grafis, tanpa misi harian)
// ==================================================
const setOv = mk("div", "pq4Set", "pq4-ov hidden",
    '<div class="pq4-card">' +
    '<div class="pq4-head"><h2>PENGATURAN</h2><button class="pq4-x" id="pq4SetClose">TUTUP</button></div>' +
    '<section><h3>AUDIO</h3>' +
    '<div class="pq4-btns"><button class="pq4-b" id="pq4Mus"></button><button class="pq4-b" id="pq4Sfx"></button></div>' +
    '<label class="pq4-sl"><span>Volume musik</span><input type="range" id="pq4VM" min="0" max="100" step="1"><b id="pq4VMv"></b></label>' +
    '<label class="pq4-sl"><span>Volume efek</span><input type="range" id="pq4VS" min="0" max="100" step="1"><b id="pq4VSv"></b></label>' +
    '</section>' +
    '<section><h3>ARAH LAYAR</h3>' +
    '<div class="pq4-btns"><button class="pq4-b" id="pq4OP">Vertikal</button><button class="pq4-b" id="pq4OL">Horizontal</button></div>' +
    '<p class="pq4-note" style="margin:10px 0 0;text-align:center">Horizontal = landscape (HP akan diminta Horizontalkan layar). Vertikal = portrait, tanpa peringatan.</p>' +
    '</section>' +
    '<section><h3>KONTROL &amp; LAYAR</h3>' +
    '<div class="pq4-btns"><button class="pq4-b" id="pq4Ctrl">GANTI MODE KONTROL</button><button class="pq4-b" id="pq4Fs">FULLSCREEN</button></div>' +
    '</section></div>');

// arah layar: "landscape" (miring) atau "portrait" (tegak). Key sama dengan responsive.js
const OKEY = "pq_orient";

function getOrient() {
    try { return localStorage.getItem(OKEY) === "portrait" ? "portrait" : "landscape"; }
    catch (e) { return "landscape"; }
}

function setOrient(m) {
    try { localStorage.setItem(OKEY, m); } catch (e) { }

    syncSet();
    showToast("Arah layar: " + (m === "portrait" ? "Tegak" : "Miring"));
    window.dispatchEvent(new Event("pq-orient"));
}

function syncSet() {
    $("pq4OP").classList.toggle("on", getOrient() === "portrait");
    $("pq4OL").classList.toggle("on", getOrient() === "landscape");

    $("pq4Mus").textContent = "MUSIK: " + (save.music ? "ON" : "OFF");
    $("pq4Mus").classList.toggle("off", !save.music);
    $("pq4Sfx").textContent = "EFEK SUARA: " + (save.sound ? "ON" : "OFF");
    $("pq4Sfx").classList.toggle("off", !save.sound);

    $("pq4VM").value = VOL.music;
    $("pq4VS").value = VOL.sfx;
    $("pq4VMv").textContent = VOL.music + "%";
    $("pq4VSv").textContent = VOL.sfx + "%";
}

function openSet() {
    if (currentScreen === "game" && typeof pauseGame === "function") pauseGame();

    syncSet();
    setOv.classList.remove("hidden");
}

function closeSet() {
    setOv.classList.add("hidden");
}

$("pq4SetClose").onclick = closeSet;

setOv.addEventListener("click", e => {
    if (e.target === setOv) closeSet();
});

$("pq4Mus").onclick = () => { toggleAudio("musicBtn"); syncSet(); };
$("pq4Sfx").onclick = () => { toggleAudio("soundBtn"); syncSet(); };
$("pq4OP").onclick = () => setOrient("portrait");
$("pq4OL").onclick = () => setOrient("landscape");
$("pq4Ctrl").onclick = () => $("ctrlBtn").click();
$("pq4Fs").onclick = () => $("fsBtn").click();

$("pq4VM").addEventListener("input", e => {
    VOL.music = clampV(e.target.value);
    $("pq4VMv").textContent = VOL.music + "%";
    saveVol();
});

$("pq4VS").addEventListener("input", e => {
    VOL.sfx = clampV(e.target.value);
    $("pq4VSv").textContent = VOL.sfx + "%";
    saveVol();
});

// bunyi contoh setelah slider efek dilepas
$("pq4VS").addEventListener("change", () => playTone(660, 0.08));

// tombol panah di slider tidak boleh menggerakkan karakter
["pq4VM", "pq4VS"].forEach(id => {
    $(id).addEventListener("keydown", e => e.stopPropagation());
    $(id).addEventListener("keyup", e => e.stopPropagation());
});

// tombol gear di dashboard & di dalam game
const gear = document.createElement("button");
gear.className = "sound-btn";
gear.id = "settingsBtn";
gear.title = "Pengaturan";
gear.innerHTML = FA("gear");
gear.onclick = openSet;
$("logoutBtn").parentNode.insertBefore(gear, $("logoutBtn"));

const gearGame = document.createElement("button");
gearGame.className = "game-button";
gearGame.id = "settingsGameBtn";
gearGame.title = "Pengaturan";
gearGame.innerHTML = FA("gear");
gearGame.onclick = openSet;
$("pauseBtn").parentNode.insertBefore(gearGame, $("pauseBtn"));
// ---------- popup volume di tombol musik & efek (dashboard) ----------
const pop = mk("div", "pq4Pop", "pq4-pop hidden",
    '<div id="pq4PopT" style="font-weight:900;color:#ffdc59;font-size:13px;margin-bottom:8px"></div>' +
    '<input type="range" id="pq4PopS" min="0" max="100" step="1" style="width:100%;accent-color:#1e90ff;height:24px">' +
    '<div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px">' +
    '<b id="pq4PopV"></b><button class="pq4-b" id="pq4PopOn" style="padding:8px 14px;font-size:12px"></button></div>');

let popKind = null;
let popBypass = false;

// ON/OFF memakai handler bawaan tombol (tanpa membuka popup)
function toggleAudio(id) {
    popBypass = true;

    try { $(id).click(); }
    finally { popBypass = false; }
}

function popSync() {
    const m = popKind === "music";
    const on = m ? save.music : save.sound;
    const v = m ? VOL.music : VOL.sfx;

    $("pq4PopT").textContent = m ? "VOLUME MUSIK" : "VOLUME EFEK SUARA";
    $("pq4PopS").value = v;
    $("pq4PopV").textContent = v + "%";
    $("pq4PopOn").textContent = on ? "ON" : "OFF";
    $("pq4PopOn").classList.toggle("off", !on);
}

function closePop() {
    pop.classList.add("hidden");
    popKind = null;
}

function openPop(kind, btn) {
    if (popKind === kind && !pop.classList.contains("hidden")) {
        closePop();
        return;
    }

    popKind = kind;
    popSync();
    pop.classList.remove("hidden");

    const a = app.getBoundingClientRect();
    const r = btn.getBoundingClientRect();
    const w = pop.offsetWidth;

    let left = r.left - a.left + r.width / 2 - w / 2;
    left = Math.max(6, Math.min(a.width - w - 6, left));

    pop.style.left = left + "px";
    pop.style.top = (r.bottom - a.top + 8) + "px";
}

[["musicBtn", "music"], ["soundBtn", "sfx"]].forEach(([id, kind]) => {
    $(id).addEventListener("click", e => {
        if (popBypass) return;

        e.stopImmediatePropagation();
        e.preventDefault();
        openPop(kind, $(id));
    }, true);
});

$("pq4PopS").addEventListener("input", e => {
    const v = clampV(e.target.value);

    if (popKind === "music") VOL.music = v;
    else VOL.sfx = v;

    saveVol();
    popSync();
    syncSet();
});

$("pq4PopS").addEventListener("change", () => {
    if (popKind === "sfx") playTone(660, 0.08);
});

$("pq4PopOn").onclick = () => {
    toggleAudio(popKind === "music" ? "musicBtn" : "soundBtn");
    popSync();
    syncSet();
};

["keydown", "keyup"].forEach(ev => $("pq4PopS").addEventListener(ev, e => e.stopPropagation()));

// klik di luar popup = tutup
document.addEventListener("pointerdown", e => {
    if (pop.classList.contains("hidden")) return;
    if (pop.contains(e.target) || (e.target.closest && e.target.closest("#musicBtn,#soundBtn"))) return;

    closePop();
}, true);

// ==================================================
// 3) LOGOUT dengan modal sendiri (confirm() tidak andal di WebView)
// ==================================================
const loOv = mk("div", "pq4Logout", "pq4-ov hidden",
    '<div class="pq4-card small">' +
    '<h2 style="color:#ffdc59;margin:0 0 10px">LOGOUT?</h2>' +
    '<p style="font-size:13px;line-height:1.5;color:#dbe7f3;margin-bottom:16px">Akun, koin, item, dan progres kamu <b>TIDAK</b> dihapus. Kamu bisa login lagi kapan saja.</p>' +
    '<div class="pq4-btns" style="flex-direction:column"><button class="pq4-b main" id="pq4LoOk">YA, LOGOUT</button><button class="pq4-b" id="pq4LoNo">BATAL</button></div>' +
    '</div>');

let logoutBypass = false;

function openLogout() {
    loOv.classList.remove("hidden");
}

function closeLogout() {
    loOv.classList.add("hidden");
}

$("pq4LoNo").onclick = closeLogout;

loOv.addEventListener("click", e => {
    if (e.target === loOv) closeLogout();
});

$("pq4LoOk").onclick = () => {
    closeLogout();
    closeSet();
    closeQuest();

    // memakai logout bawaan lewat panel profil
    logoutBypass = true;

    try {
        $("editName").click();

        const b = $("pqLog");
        if (b) b.click();
    } finally {
        logoutBypass = false;
    }
};

$("logoutBtn").onclick = openLogout;

// tombol LOGOUT di dalam panel profil juga lewat modal
$("pqProf").addEventListener("click", e => {
    if (logoutBypass) return;

    if (e.target.closest && e.target.closest("#pqLog")) {
        e.stopPropagation();
        e.preventDefault();
        openLogout();
    }
}, true);

// ==================================================
// 4) MISI HARIAN + ACHIEVEMENT
// ==================================================
const today = () => {
    const d = new Date();

    return d.getFullYear() + "-" +
        String(d.getMonth() + 1).padStart(2, "0") + "-" +
        String(d.getDate()).padStart(2, "0");
};

function Q() {
    const t = today();
    let q = save.quest;

    if (!q || typeof q !== "object" || q.day !== t) {
        q = save.quest = { day: t, p: {}, claimed: {} };
    }

    if (!q.p || typeof q.p !== "object") q.p = {};
    if (!q.claimed || typeof q.claimed !== "object") q.claimed = {};

    return q;
}

function St() {
    if (!save.stats || typeof save.stats !== "object") save.stats = {};
    return save.stats;
}

function Ac() {
    if (!save.ach || typeof save.ach !== "object") save.ach = {};
    if (!save.ach.claimed || typeof save.ach.claimed !== "object") save.ach.claimed = {};
    return save.ach;
}

const DAILY = [
    { id: "d_coins",   k: "coins",   g: 30, r: 30, t: "Kumpulkan koin" },
    { id: "d_levels",  k: "levels",  g: 2,  r: 35, t: "Selesaikan level" },
    { id: "d_enemies", k: "enemies", g: 5,  r: 30, t: "Kalahkan musuh" },
    { id: "d_jumps",   k: "jumps",   g: 40, r: 20, t: "Lompat" },
    { id: "d_three",   k: "three",   g: 1,  r: 50, t: "Raih 3 bintang di 1 stage" }
];

const ST = k => St()[k] || 0;
const starsTotal = () => Object.values(save.stars || {}).reduce((a, b) => a + (+b || 0), 0);
const threeStars = () => Object.values(save.stars || {}).filter(v => +v >= 3).length;
const doneIn = (a, b) => (save.completed || []).filter(i => i >= a && i <= b).length;
const ownedCount = () =>
    Math.max(0, (save.cosmetics.owned || []).length - 6) +
    ((save.fashion && Array.isArray(save.fashion.owned)) ? save.fashion.owned.length : 0);

const ACH = [
    { id: "a_s1",   t: "Langkah Pertama",  d: "Selesaikan 1 stage",       g: 1,    r: 50,  p: () => (save.completed || []).length },
    { id: "a_s10",  t: "Petualang",        d: "Selesaikan 10 stage",      g: 10,   r: 150, p: () => (save.completed || []).length },
    { id: "a_s25",  t: "Penjelajah",       d: "Selesaikan 25 stage",      g: 25,   r: 300, p: () => (save.completed || []).length },
    { id: "a_s50",  t: "Master Stage",     d: "Selesaikan 50 stage",      g: 50,   r: 500, p: () => (save.completed || []).length },
    { id: "a_w1",   t: "Raja Hutan",       d: "Tamatkan World 1",         g: 15,   r: 200, p: () => doneIn(1, 15) },
    { id: "a_c500", t: "Pengumpul Koin",   d: "Kumpulkan 500 koin di game", g: 500,  r: 100, p: () => ST("coins") },
    { id: "a_c3k",  t: "Kolektor Emas",    d: "Kumpulkan 3000 koin di game", g: 3000, r: 300, p: () => ST("coins") },
    { id: "a_e100", t: "Pemburu Musuh",    d: "Kalahkan 100 musuh",       g: 100,  r: 150, p: () => ST("enemies") },
    { id: "a_e500", t: "Penakluk",         d: "Kalahkan 500 musuh",       g: 500,  r: 400, p: () => ST("enemies") },
    { id: "a_st15", t: "Bintang Kecil",    d: "Kumpulkan 15 bintang",     g: 15,   r: 120, p: starsTotal },
    { id: "a_st45", t: "Bintang Terang",   d: "Kumpulkan 45 bintang",     g: 45,   r: 300, p: starsTotal },
    { id: "a_3s5",  t: "Perfeksionis",     d: "Raih 3 bintang di 5 stage", g: 5,    r: 200, p: threeStars },
    { id: "a_j1k",  t: "Pelompat Ulung",   d: "Lompat 1000 kali",         g: 1000, r: 100, p: () => ST("jumps") },
    { id: "a_own",  t: "Kolektor Fashion", d: "Miliki 10 item di Vault",  g: 10,   r: 150, p: ownedCount }
];

// ---------- pelacak (daily + total) ----------
let saveTimer = null;

function saveSoon() {
    if (saveTimer) return;

    saveTimer = setTimeout(() => {
        saveTimer = null;
        saveData();
    }, 1500);
}

function bump(k, n) {
    const q = Q();
    const before = q.p[k] || 0;

    q.p[k] = before + n;

    if (k === "coins" || k === "enemies" || k === "jumps") {
        const s = St();
        s[k] = (s[k] || 0) + n;
    }

    DAILY.forEach(d => {
        if (d.k === k && before < d.g && q.p[k] >= d.g) {
            showToast("Misi selesai: " + d.t + "! Klaim di menu MISI");
        }
    });

    saveSoon();
}

let lastCC = 0;
let lastDead = 0;

function track() {
    if (currentScreen !== "game") return;

    if (collectedCoins > lastCC) bump("coins", collectedCoins - lastCC);
    lastCC = collectedCoins;

    const dead = enemies.filter(e => e.dead).length;

    if (dead > lastDead) bump("enemies", dead - lastDead);
    lastDead = dead;
}

const prevUpdate = update;

update = function () {
    prevUpdate();
    track();
};

const prevJump = pressJump;

pressJump = function () {
    if (
        currentScreen === "game" && !paused && !gameOver && !levelDone &&
        !input.jump && (player.grounded || coyote > 0)
    ) {
        bump("jumps", 1);
    }

    return prevJump.apply(this, arguments);
};

const prevComplete = completeLevel;

completeLevel = function () {
    const was = levelDone;

    prevComplete.apply(this, arguments);

    if (levelDone && !was) {
        bump("levels", 1);

        const ratio = coins.length ? collectedCoins / coins.length : 1;
        if (ratio >= 0.75 && deaths === 0) bump("three", 1);

        saveData();
    }
};

window.addEventListener("pagehide", () => saveData());
document.addEventListener("visibilitychange", () => { if (document.hidden) saveData(); });

// ---------- klaim (hanya bisa sekali) ----------
function reward(n, label) {
    save.coins += n;

    saveData();
    updateDashboard();

    playTone(880, 0.12);
    setTimeout(() => playTone(1175, 0.15), 110);

    showToast("+" + n + " koin! " + label);
}

function claimDaily(d) {
    const q = Q();

    if (q.claimed[d.id] || (q.p[d.k] || 0) < d.g) return;

    q.claimed[d.id] = true; // tandai dulu supaya tidak bisa diklaim dobel
    reward(d.r, d.t);

    renderQuest();
    refreshBadge();
}

function claimAch(a) {
    const c = Ac().claimed;

    if (c[a.id] || a.p() < a.g) return;

    c[a.id] = true;
    reward(a.r, a.t);

    renderQuest();
    refreshBadge();
}

function claimables() {
    const q = Q();
    const c = Ac().claimed;

    return {
        d: DAILY.filter(x => !q.claimed[x.id] && (q.p[x.k] || 0) >= x.g).length,
        a: ACH.filter(x => !c[x.id] && x.p() >= x.g).length
    };
}

// ---------- tombol di dashboard ----------
const qBtn = document.createElement("button");
qBtn.className = "shop-open-btn pq4-questbtn";
qBtn.id = "openQuest";
qBtn.innerHTML = FA("trophy") + " MISI &amp; ACHIEVEMENT<span class='pq4-badge hidden'>0</span>";
$("openVault").after(qBtn);

// ---------- layar misi ----------
const qOv = mk("div", "pq4Quest", "pq4-ov hidden",
    '<div class="pq4-card">' +
    '<div class="pq4-head"><h2>MISI &amp; ACHIEVEMENT</h2><button class="pq4-x" id="pq4QClose">TUTUP</button></div>' +
    '<div class="pq4-tabs">' +
    '<button class="pq4-tab on" id="pq4TabD">' + FA("calendar-day") + ' HARIAN<i class="pq4-dot hidden"></i></button>' +
    '<button class="pq4-tab" id="pq4TabA">' + FA("trophy") + ' ACHIEVEMENT<i class="pq4-dot hidden"></i></button>' +
    '</div>' +
    '<p class="pq4-note" id="pq4QSub" style="margin-top:10px"></p>' +
    '<div class="pq4-list" id="pq4QList"></div></div>');

let qTab = "daily";

function refreshBadge() {
    const c = claimables();
    const n = c.d + c.a;
    const bd = qBtn.querySelector(".pq4-badge");

    bd.textContent = n;
    bd.classList.toggle("hidden", n === 0);
    qBtn.classList.toggle("pq4-alert", n > 0);

    $("pq4TabD").querySelector(".pq4-dot").classList.toggle("hidden", c.d === 0);
    $("pq4TabA").querySelector(".pq4-dot").classList.toggle("hidden", c.a === 0);
}

function questRow(title, desc, cur, goal, rew, claimed, onClaim) {
    const ready = !claimed && cur >= goal;
    const r = document.createElement("div");

    r.className = "pq4-row" + (ready ? " ready" : "") + (claimed ? " done" : "");
    r.innerHTML = '<div class="pq4-info"><b></b><small></small><div class="pq4-bar"><i></i></div></div>';

    r.querySelector("b").textContent = title;
    r.querySelector("small").innerHTML =
        (desc ? desc + " · " : "") + Math.min(cur, goal) + "/" + goal + " · " + COIN + " +" + rew;
    r.querySelector(".pq4-bar i").style.width = Math.min(100, cur / goal * 100) + "%";

    const b = document.createElement("button");

    b.className = "pq4-claim " + (claimed ? "done" : ready ? "ready" : "wait");
    b.innerHTML = claimed ? FA("check") + " DIKLAIM" : "KLAIM";
    b.disabled = !ready;

    if (ready) b.onclick = onClaim;

    r.appendChild(b);

    return { el: r, rank: ready ? 0 : claimed ? 2 : 1 };
}

function renderQuest() {
    const list = $("pq4QList");
    const q = Q();
    const ac = Ac().claimed;

    list.innerHTML = "";

    $("pq4TabD").classList.toggle("on", qTab === "daily");
    $("pq4TabA").classList.toggle("on", qTab === "ach");

    let rows;

    if (qTab === "daily") {
        $("pq4QSub").textContent = "Misi harian " + q.day + " - reset otomatis tiap ganti hari. Hadiah hanya bisa diklaim sekali.";

        rows = DAILY.map(d => questRow(
            d.t, "", q.p[d.k] || 0, d.g, d.r, !!q.claimed[d.id], () => claimDaily(d)
        ));
    } else {
        $("pq4QSub").textContent = "Achievement permanen - hadiah hanya bisa diklaim sekali.";

        rows = ACH.map(a => questRow(
            a.t, a.d, a.p(), a.g, a.r, !!ac[a.id], () => claimAch(a)
        ));
    }

    // yang siap diklaim di atas, yang sudah diklaim di bawah
    rows.sort((x, y) => x.rank - y.rank);
    rows.forEach(x => list.appendChild(x.el));

    refreshBadge();
}

function openQuest() {
    renderQuest();
    qOv.classList.remove("hidden");
}

function closeQuest() {
    qOv.classList.add("hidden");
    refreshBadge();
}

qBtn.onclick = openQuest;
$("pq4QClose").onclick = closeQuest;
$("pq4TabD").onclick = () => { qTab = "daily"; renderQuest(); };
$("pq4TabA").onclick = () => { qTab = "ach"; renderQuest(); };

qOv.addEventListener("click", e => {
    if (e.target === qOv) closeQuest();
});

window.addEventListener("keydown", e => {
    if (e.code !== "Escape") return;

    if (!loOv.classList.contains("hidden")) closeLogout();
    else if (!qOv.classList.contains("hidden")) closeQuest();
    else if (!setOv.classList.contains("hidden")) closeSet();
});

const prevUD = updateDashboard;

updateDashboard = function () {
    prevUD();
    refreshBadge();
};

// ==================================================
// 5) WARNA KULIT & RAMBUT TERPISAH (cowok / cewek)
// ==================================================
function colors() {
    if (!save.colors || typeof save.colors !== "object") save.colors = {};

    ["male", "female"].forEach(g => {
        const c = save.colors[g] || (save.colors[g] = {});

        if (!c.skin) c.skin = save.cosmetics.skinColor || "#f4bd8b";
        if (!c.hair) c.hair = save.cosmetics.hairColor || "#493020";
    });

    return save.colors;
}

const charKey = () => (save.char === "female" ? "female" : "male");

const prevDraw4 = drawCharacter;

drawCharacter = function (c, ox, oy, s, o) {
    const col = colors()[charKey()];

    prevDraw4(c, ox, oy, s, Object.assign({}, o, { skin: col.skin, hair: col.hair }));
};

function fixColors() {
    const g = charKey();
    const col = colors()[g];
    const label = g === "female" ? "FEMALE" : "MALE";

    [["colorList", SKIN_COLORS, "skin"], ["hairList", HAIR_COLORS, "hair"]].forEach(([id, list, key]) => {
        const box = $(id);

        if (!box) return;

        Array.from(box.children).forEach((b, i) => {
            const e = list[i];

            if (!e) return;

            b.classList.toggle("selected", col[key] === e.color);

            b.onclick = () => {
                colors()[g][key] = e.color;

                saveData();
                playTone(650);

                renderShop();
                updateDashboard();
            };
        });
    });

    document.querySelectorAll("#shopScreen .custom-section h3").forEach(h => {
        if (!h.dataset.pq4) {
            if (/SKIN/i.test(h.textContent)) h.dataset.pq4 = "WARNA KULIT";
            else if (/HAIR/i.test(h.textContent)) h.dataset.pq4 = "WARNA RAMBUT";
        }

        if (h.dataset.pq4) h.textContent = h.dataset.pq4 + " " + label;
    });
}

// thumbnail pilihan karakter: masing-masing memakai warna miliknya sendiri
function fixThumbs() {
    const btns = document.querySelectorAll("#pq2Chars .pq2-char");

    ["male", "female"].forEach((g, i) => {
        const b = btns[i];
        const cv = b && b.querySelector("canvas");

        if (!cv) return;

        const c = cv.getContext("2d");
        c.imageSmoothingEnabled = false;
        c.clearRect(0, 0, cv.width, cv.height);

        const oc = save.char;
        const os = currentScreen;

        save.char = g;
        currentScreen = "dashboard";

        try {
            drawCharacter(c, 8, 15, 3, buildOutfit(save.cosmetics.equipped, { facing: 1 }));
        } finally {
            save.char = oc;
            currentScreen = os;
        }
    });
}

const prevRS4 = renderShop;

renderShop = function () {
    prevRS4();

    if (currentScreen !== "shop") return;

    fixColors();
    fixThumbs();
};

// ==================================================
// START
// ==================================================
refreshBadge();
syncSet();

if (currentScreen === "shop") renderShop();

})();