"use strict";
// PIXEL QUEST UPGRADE 3 - dimuat SETELAH upgrade2.js
// Isi: bundle (Shop + Vault), tab Rambut 100 koin, daster, Balaclava 950,
//      topeng & topi rajut baru, ikon tab.
(function () {

const FA = n => '<i class="fa-solid fa-' + n + '"></i>';
const COIN = FA("coins");
const SENT = "#7b3f9e"; // warna penanda rambut asli (diganti saat digambar)
const tmp = document.createElement("canvas").getContext("2d");
const norm = v => { tmp.fillStyle = "#000"; tmp.fillStyle = v; return tmp.fillStyle; };

// ==================================================
// 1) HARGA BALACLAVA + ITEM BARU
// ==================================================
const bal = SHOP_ITEMS.mask.find(i => i.id === "mask_spike4");
if (bal) bal.price = 950;

// only: "f" = khusus cewek, "m" = khusus cowok
SHOP_ITEMS.shirt.push({ id: "shirt_daster", name: "Daster Batik", color: "#b5523a", ac: "#f2c14e", price: 150, style: "daster", only: "f" });

SHOP_ITEMS.mask.push(
    { id: "mask_spikebal",   name: "Balaclava Spike Biru",    color: "#1f6f9e", ac: "#e83fa0", price: 850, style: "spikebal", only: "f" },
    { id: "mask_bunny_blue", name: "Balaclava Kelinci Biru",  color: "#1b3ce0", ac: "#0d0d12", price: 950, style: "bunny_m",  only: "m" },
    { id: "mask_bunny_red",  name: "Balaclava Kelinci Merah", color: "#d41c3c", ac: "#3a3a42", price: 850, style: "bunny_f",  only: "f" }
);

SHOP_ITEMS.hat.push(
    { id: "hat_bucket_spike", name: "Topi Bucket Spike", color: "#9bd91f", ac: "#e0107a", price: 700, style: "bucketspike", only: "f" }
);

Object.values(SHOP_ITEMS).forEach(a => a.sort((x, y) => x.price - y.price));

// Item khusus bundle (tidak muncul di tab biasa, hanya lewat bundle)
const BI = [];
const B = (id, name, cat, color, style, ac) =>
    BI.push({ id, name, cat, color, ac, price: 0, style: style || "plain" });

B("bn_hunter_m", "Hunter Harness",  "shirt", "#6b5a3a", "harness", "#d6b04a");
B("bn_hunter_f", "Hunter Harness F","shirt", "#5c6b4a", "harness", "#d6b04a");
B("bn_pants_olive", "Olive Pants",  "pants", "#4f5a3a");
B("bn_boots_dk", "Dark Boots",      "shoes", "#2a211c");
B("bn_boots_br", "Brown Boots",     "shoes", "#5a3a24");
B("bn_cloak_gray", "Gray Cloak",    "cape",  "#7d8794");
B("bn_mask_giant", "Stone Mask",    "mask",  "#8f9aa8", "giant");

B("bn_nj_m", "Ninja Gi",            "shirt", "#232c4f", "kimono", "#c0392b");
B("bn_nj_f", "Ninja Gi F",          "shirt", "#7a3d6e", "kimono", "#f0b4c8");
B("bn_pants_navy", "Navy Pants",    "pants", "#1c2240");
B("bn_pants_plum", "Plum Pants",    "pants", "#4a2a56");
B("bn_band_m", "Bandana",           "hat",   "#1d2540", "bandana", "#9aa6d8");
B("bn_band_f", "Bandana F",         "hat",   "#5a3d7a", "bandana", "#f0b4c8");
B("bn_mask_nj", "Shadow Mask",      "mask",  "#1d2540", "ninja");

B("bn_kim_m", "Night Kimono",       "shirt", "#27324f", "kimono", "#d8d8e8");
B("bn_kim_f", "Pale Kimono",        "shirt", "#d9d9e6", "kimono", "#3d4a8a");
B("bn_hakama_m", "Black Hakama",    "pants", "#1c1c24", "hakama", "#8a8aa0");
B("bn_hakama_f", "Red Hakama",      "pants", "#8a2a3a", "hakama", "#f2d0d8");
B("bn_mask_oni", "Night Mask",      "mask",  "#6a2a2a", "oni");
B("bn_geta", "Wood Sandals",        "shoes", "#8a6a44");

B("bn_pir_m", "Raider Shirt",       "shirt", "#eee8d8", "pirate", "#8a2a2a");
B("bn_pir_f", "Raider Shirt F",     "shirt", "#f2f2f8", "pirate", "#2a7a8a");
B("bn_pants_pm", "Raider Pants",    "pants", "#2a2d40");
B("bn_pants_pf", "Raider Pants F",  "pants", "#2a4a6a");
B("bn_tri_m", "Tricorn",            "hat",   "#1c1c24", "tricorn", "#e8ad32");
B("bn_tri_f", "Tricorn F",          "hat",   "#274a6a", "tricorn", "#e8ad32");

B("bn_kaos", "Kaos Kampung",        "shirt", "#f2f2f2", "kaos_k", "#d94343");
B("bn_short", "Celana Pendek",      "pants", "#3a4a8a");
B("bn_peci", "Peci Hitam",          "hat",   "#1b1b1f", "peci");
B("bn_sandal_red", "Sepatu Merah",  "shoes", "#d94343");
B("bn_kebaya", "Kebaya",            "shirt", "#e8a0b8", "kebaya", "#fff2a8");
B("bn_batik", "Kain Batik",         "pants", "#7a4a2a", "batik", "#d6a22e");

SHOP_ITEMS.__bundle = BI; // getShopItem() ikut mengenali, tapi tidak masuk tab

const BUNDLES = [
    { id: "b_hunter", name: "Giant Hunter Set", price: 800,
      m: { shirt: "bn_hunter_m", pants: "bn_pants_olive", shoes: "bn_boots_dk", cape: "bn_cloak_gray", mask: "bn_mask_giant" },
      f: { shirt: "bn_hunter_f", pants: "bn_pants_olive", shoes: "bn_boots_dk", cape: "bn_cloak_gray" } },

    { id: "b_ninja", name: "Shadow Ninja Set", price: 900,
      m: { shirt: "bn_nj_m", pants: "bn_pants_navy", hat: "bn_band_m", mask: "bn_mask_nj", shoes: "bn_boots_dk" },
      f: { shirt: "bn_nj_f", pants: "bn_pants_plum", hat: "bn_band_f", shoes: "bn_boots_dk" } },

    { id: "b_night", name: "Night Blade Set", price: 850,
      m: { shirt: "bn_kim_m", pants: "bn_hakama_m", mask: "bn_mask_oni", shoes: "bn_geta" },
      f: { shirt: "bn_kim_f", pants: "bn_hakama_f", shoes: "bn_geta" } },

    { id: "b_pirate", name: "Sea Raider Set", price: 1000,
      m: { shirt: "bn_pir_m", pants: "bn_pants_pm", hat: "bn_tri_m", shoes: "bn_boots_br" },
      f: { shirt: "bn_pir_f", pants: "bn_pants_pf", hat: "bn_tri_f", shoes: "bn_boots_br" } },

    { id: "b_kampung", name: "Anak Kampung Set", price: 700,
      m: { shirt: "bn_kaos", pants: "bn_short", hat: "bn_peci", shoes: "bn_sandal_red" },
      f: { shirt: "bn_kebaya", pants: "bn_batik", shoes: "bn_sandal_red" } }
];

const bundleIds = (b, g) => Object.assign({}, DEFAULT_EQUIPPED, b[g]);

// ==================================================
// 2) MODEL RAMBUT
// ==================================================
const STY = {};
function S(id, g, name, draw) { STY[id] = { id, g, name, draw, def: !draw }; }

// draw(H, warna, terang, gelap, kulit)  H(x,y,w,h,warna) pakai grid 16x24
S("m_asli",   "m", "Rambut Asli", null);
S("m_cepak",  "m", "Cepak", (H, h, lt) => { H(3, 2, 10, 2, h); H(3, 4, 1, 2, h); H(5, 2, 4, 1, lt); });
S("m_mohawk", "m", "Mohawk", (H, h, lt, dk) => { H(6, -2, 4, 5, h); H(6, -3, 2, 1, h); H(7, -2, 1, 2, lt); H(6, 2, 4, 1, dk); });
S("m_mullet", "m", "Mullet", (H, h, lt, dk) => { H(3, 2, 10, 2, h); H(3, 4, 2, 3, h); H(11, 4, 2, 1, h); H(5, 2, 4, 1, lt); H(1, 5, 3, 4, h); H(1, 9, 2, 4, h); H(1, 12, 2, 2, dk); });
S("m_gondrong","m", "Gondrong", (H, h, lt, dk) => { H(3, 2, 10, 3, h); H(3, 4, 2, 6, h); H(11, 4, 2, 1, h); H(0, 3, 4, 16, h); H(0, 17, 4, 3, dk); H(12, 11, 2, 5, h); H(12, 15, 2, 1, dk); H(5, 2, 4, 1, lt); H(7, 3, 1, 1, dk); });
S("m_kribo",  "m", "Kribo", (H, h, lt, dk) => { H(3, 2, 10, 3, h); H(2, -2, 12, 5, h); H(1, 0, 3, 9, h); H(13, -1, 2, 7, h); H(4, -2, 3, 1, lt); H(1, 8, 3, 1, dk); H(13, 5, 2, 1, dk); });
S("m_botak",  "m", "Botak", (H) => { H(5, 3, 3, 1, "rgba(255,255,255,.35)"); });
S("m_punk",   "m", "Punk", (H, h, lt, dk) => { H(3, 2, 10, 2, h); H(3, 4, 2, 3, h); H(3, -1, 2, 3, h); H(6, -3, 2, 5, h); H(9, -2, 2, 4, h); H(12, -1, 1, 3, h); H(6, -3, 2, 1, lt); H(3, -1, 2, 1, lt); H(9, -2, 2, 1, lt); H(3, 3, 10, 1, dk); });

S("f_panjang","f", "Panjang", null);
S("f_bondol", "f", "Bondol", (H, h, lt) => { H(3, 2, 10, 2, h); H(3, 4, 2, 2, h); H(11, 4, 2, 1, h); H(5, 2, 4, 1, lt); });
S("f_botak",  "f", "Botak", (H) => { H(5, 3, 3, 1, "rgba(255,255,255,.35)"); });
S("f_bob",    "f", "Bob", (H, h, lt, dk) => { H(3, 2, 10, 3, h); H(2, 3, 3, 9, h); H(2, 10, 3, 2, dk); H(8, 4, 5, 1, h); H(5, 2, 4, 1, lt); });
S("f_pixie",  "f", "Pixie", (H, h, lt) => { H(3, 2, 10, 3, h); H(3, 4, 2, 3, h); H(8, 4, 5, 1, h); H(10, 3, 3, 2, h); H(5, 2, 4, 1, lt); });
S("f_kuncir", "f", "Kuncir Kuda", (H, h, lt) => { H(3, 2, 10, 3, h); H(3, 4, 2, 4, h); H(8, 4, 5, 1, h); H(1, 3, 2, 2, "#ff5a9a"); H(0, 4, 2, 3, h); H(-1, 7, 2, 8, h); H(-1, 8, 1, 5, lt); });
S("f_cepol",  "f", "Cepol", (H, h, lt) => { H(3, 2, 10, 3, h); H(3, 4, 2, 4, h); H(8, 4, 5, 1, h); H(4, -1, 3, 3, h); H(9, -1, 3, 3, h); H(5, -1, 1, 1, lt); H(10, -1, 1, 1, lt); });
S("f_afro",   "f", "Kribo", (H, h, lt, dk) => { H(3, 2, 10, 3, h); H(2, -3, 12, 6, h); H(0, 0, 4, 10, h); H(13, -1, 3, 8, h); H(4, -3, 3, 1, lt); H(0, 9, 4, 1, dk); H(13, 6, 3, 1, dk); });

function hs() {
    if (!save.hairStyle || typeof save.hairStyle !== "object") save.hairStyle = {};
    if (!STY[save.hairStyle.m] || STY[save.hairStyle.m].g !== "m") save.hairStyle.m = "m_asli";
    if (!STY[save.hairStyle.f] || STY[save.hairStyle.f].g !== "f") save.hairStyle.f = "f_panjang";
    if (!Array.isArray(save.hairOwned)) save.hairOwned = [];
    if (!Array.isArray(save.bundles)) save.bundles = [];
    return save.hairStyle;
}

let tryHair = {};
let forceHair = null;
let bpv = null; // bundle yang sedang di-preview

function styleFor(g) {
    if (forceHair && STY[forceHair] && STY[forceHair].g === g) return forceHair;
    if (currentScreen === "shop" && tryHair[g] && STY[tryHair[g]]) return tryHair[g];
    return save.hairStyle[g];
}

function fxOn(cat) {
    try {
        const e = save.fashion.equipped[save.char];
        return !!(e && e[cat]);
    } catch (x) { return false; }
}

// ==================================================
// 3) GAMBAR: rambut custom + overlay item baru
// ==================================================
function overlay(c, ox, oy, s, o, isF) {
    const dir = o.facing < 0 ? -1 : 1;
    const R = (x, y, w, h, col) => {
        c.fillStyle = col;
        c.fillRect(ox + (dir > 0 ? x : 16 - x - w) * s, oy + y * s, w * s, h * s);
    };

    const gch = isF ? "f" : "m";
    const okG = it => !it.only || it.only === gch;

    const tx = isF ? 4 : 3, tw = isF ? 8 : 10, cx = tx + tw / 2;
    const aF = isF ? 12 : 13, aB = isF ? 2 : 1;
    const armY = o.air ? 10 : 12;
    const bh = (o.step === 1 || o.air) ? 3 : 4;
    const fh = o.step === 2 ? 3 : 4;

    // ---- BAJU ----
    const sh = o.shirt;
    if (sh && !fxOn("top") && okG(sh)) {
        const st = sh.style, col = sh.color, ac = sh.ac || "#e8c15c";

        if (st === "harness") {
            const b = "#2d2014";
            for (let i = 0; i < 4; i++) { R(tx + 1 + i, 11 + i, 1, 1, b); R(tx + tw - 2 - i, 11 + i, 1, 1, b); }
            R(tx, 15, tw, 1, b); R(cx - 1, 15, 2, 1, ac);

        } else if (st === "kimono") {
            for (let i = 0; i < 4; i++) { R(tx + 1 + i, 11 + i, 1, 1, "#f2f2f2"); R(tx + tw - 2 - i, 11 + i, 1, 1, "#f2f2f2"); }
            R(tx, 15, tw, 2, ac);

        } else if (st === "pirate") {
            R(tx, 11, 2, 5, ac); R(tx + tw - 2, 11, 2, 5, ac);
            R(tx, 15, tw, 1, "#c0392b"); R(cx - 1, 11, 1, 3, "#d8d8d8");

        } else if (st === "kaos_k") {
            R(tx, 13, tw, 1, ac); R(cx - 2, 11, 4, 1, ac);

        } else if (st === "kebaya") {
            R(tx, 11, tw, 1, ac); R(tx, 11, 1, 5, ac); R(tx + tw - 1, 11, 1, 5, ac); R(cx, 12, 1, 1, "#ffd24a");

        } else if (st === "daster") {
            R(tx, 16, tw, 1, col);
            R(tx - 1, 17, tw + 2, 2, col);
            R(tx - 2, 19, tw + 4, 2, shade(col, -15));
            [[tx + 1, 12], [tx + 4, 14], [tx + 2, 17], [tx + 5, 18], [tx + 7, 19], [tx - 1, 20], [tx + 3, 20], [tx + 8, 17]]
                .forEach(p => R(p[0], p[1], 1, 1, ac));
            R(tx - 2, 20, tw + 4, 1, ac);
            R(aF, armY, 2, 2, col);
            R(aB, armY, 2, 2, shade(col, -30));
        }
    }

    // ---- CELANA ----
    const pn = o.pants;
    if (pn && !fxOn("bottom") && okG(pn)) {
        const st = pn.style, col = pn.color, ac = pn.ac || "#e8c15c";

        if (st === "batik") {
            R(5, 18, 1, 1, ac); R(10, 19, 1, 1, ac); R(11, 18, 1, 1, ac); R(4, 19, 1, 1, ac);
        } else if (st === "hakama") {
            R(2, 17, 5, bh, shade(col, -20));
            R(9, 17, 6, fh, col);
            R(4, 18, 1, Math.max(1, bh - 1), shade(col, -35));
            R(11, 18, 1, Math.max(1, fh - 1), shade(col, -35));
            R(tx, 16, tw, 1, ac);
        }
    }

    // ---- TOPI ----
    const ht = o.hat;
    if (ht && ht.id !== "hat_none" && !fxOn("head") && okG(ht)) {
        const st = ht.style, col = ht.color, ac = ht.ac || "#e8c15c";

        if (st === "bandana") {
            R(3, 3, 10, 2, col); R(1, 3, 2, 2, col); R(0, 5, 2, 2, shade(col, -25));
            R(5, 3, 1, 1, ac); R(9, 3, 1, 1, ac);
        } else if (st === "tricorn") {
            R(1, 2, 14, 2, col); R(4, -1, 8, 3, col); R(0, 1, 2, 1, col); R(14, 1, 2, 1, col);
            R(1, 3, 14, 1, ac); R(7, 0, 2, 1, "#f2f2f2");
        } else if (st === "peci") {
            R(4, 0, 8, 3, col); R(3, 3, 10, 1, shade(col, -30)); R(4, 0, 8, 1, shade(col, 25));
        } else if (st === "caping") {
            R(0, 3, 16, 1, col); R(2, 2, 12, 1, col); R(4, 1, 8, 1, col); R(6, 0, 4, 1, col);
        } else if (st === "bucketspike") {
            // duri pink di atas
            R(4, 0, 2, 2, ac); R(4, -2, 2, 2, ac); R(5, -4, 1, 2, ac);
            R(7, -1, 2, 2, ac); R(7, -3, 2, 2, ac); R(8, -5, 1, 2, ac);
            R(10, 0, 2, 2, ac); R(10, -2, 2, 2, ac); R(11, -4, 1, 2, ac);
            // mahkota + pinggiran topi
            R(4, 1, 8, 3, col);
            R(5, 1, 2, 1, shade(col, 30));
            R(1, 3, 14, 1, col);
            R(1, 4, 14, 1, ac);
            R(0, 3, 1, 2, ac); R(15, 3, 1, 2, ac);
            R(2, 5, 1, 1, ac); R(6, 5, 1, 1, ac); R(14, 5, 1, 1, ac);
        }
    }

    // ---- TOPENG ----
    const mk = o.mask;
    if (mk && okG(mk)) {
        const col = mk.color, ac = mk.ac, st = mk.style;

        if (mk.id === "bn_mask_giant") {
            R(3, 3, 10, 8, col); R(3, 3, 10, 1, shade(col, 25));
            R(9, 6, 3, 2, "#222"); R(4, 6, 2, 2, "#222"); R(8, 5, 5, 1, "#555");
            R(5, 10, 6, 1, "#555"); R(7, 9, 1, 2, "#555");

        } else if (st === "spikebal") {
            // duri pink di belakang kepala
            R(8, 0, 2, 2, ac); R(8, -2, 2, 2, ac); R(9, -4, 1, 2, ac);
            R(5, 0, 2, 2, ac); R(4, -2, 2, 2, ac); R(3, -4, 1, 2, ac);
            R(2, 3, 2, 3, ac); R(0, 4, 2, 2, ac); R(-2, 4, 2, 1, ac);
            R(2, 7, 2, 2, ac); R(0, 8, 2, 2, ac); R(-2, 9, 2, 1, ac);
            R(8, -2, 1, 2, shade(ac, 40)); R(4, -2, 1, 2, shade(ac, 40));
            // badan balaclava biru
            R(3, 2, 10, 3, col);
            R(3, 5, 5, 4, col);
            R(12, 5, 1, 4, col);
            R(3, 9, 10, 2, col);
            // bagian bawah pink zigzag
            for (let i = 0; i < 5; i++) { R(3 + i * 2, 11, 1, 1, col); R(4 + i * 2, 11, 1, 1, ac); }
            R(3, 12, 10, 1, ac);
            R(3, 13, 10, 1, shade(ac, -30));
            // lubang mata
            R(8, 4, 4, 1, shade(col, -40)); R(7, 5, 1, 4, shade(col, -30)); R(8, 9, 4, 1, shade(col, -40));
            R(5, 3, 1, 1, shade(col, 25)); R(9, 3, 1, 1, shade(col, 25));

        } else if (st === "bunny_m" || st === "bunny_f") {
            const male = st === "bunny_m";
            // telinga belakang
            R(0, 1, 4, 16, col);
            R(1, 2, 2, 14, ac);
            R(2, 0, 4, 2, col);
            // telinga depan
            R(11, 0, 3, 2, col);
            R(13, 2, 3, 13, col);
            R(14, 3, 1, 11, ac);
            // badan balaclava
            R(3, 2, 10, 3, col);
            R(3, 5, 5, 4, col);
            R(12, 5, 1, 4, col);
            R(3, 9, 10, 3, col);
            R(3, 12, 10, 1, shade(col, -30));
            R(5, 3, 1, 1, shade(col, 30)); R(9, 3, 1, 1, shade(col, 30));
            // trim lubang mata
            R(8, 4, 4, 1, ac); R(7, 5, 1, 4, ac); R(8, 9, 4, 1, ac);

            if (male) {
                // ritsleting + rantai
                R(8, 10, 4, 1, "#cfd3da");
                R(8, 10, 1, 1, "#8a8f99");
                R(11, 11, 1, 2, "#cfd3da");
                R(11, 13, 1, 1, "#e8e8ee");
            } else {
                // bunga pink di ujung telinga
                R(0, 13, 3, 3, "#ff6fb5"); R(1, 14, 1, 1, "#ffd24a");
                R(13, 11, 3, 3, "#ff6fb5"); R(14, 12, 1, 1, "#ffd24a");
            }
        }
    }
}

const prevDraw3 = drawCharacter;

drawCharacter = function (c, ox, oy, s, o) {
    hs();

    const real = o.hair, skin = o.skin;
    const dir = o.facing < 0 ? -1 : 1;

    // proxy: kumpulkan semua kotak dulu, baru digambar (supaya rambut bisa diganti)
    const buf = [];
    let cur = "#000";
    const proxy = {
        set fillStyle(v) { cur = norm(v); },
        get fillStyle() { return cur; },
        fillRect(x, y, w, h) { buf.push([cur, x, y, w, h]); }
    };

    prevDraw3(proxy, ox, oy, s, Object.assign({}, o, { hair: SENT }));

    const map = {};
    [0, 35, -10, -25, -18, 30].forEach(d => {
        map[norm(d ? shade(SENT, d) : SENT)] = d ? shade(real, d) : real;
    });

    const sentN = norm(SENT);
    const isF = buf.some(r => r[3] === 8 * s && r[4] === 3 * s && r[2] === oy + 11 * s);
    const g = isF ? "f" : "m";
    const st = STY[styleFor(g)];
    const custom = st && !st.def;

    const H = (x, y, w, h, col) => {
        c.fillStyle = col;
        c.fillRect(ox + (dir > 0 ? x : 16 - x - w) * s, oy + y * s, w * s, h * s);
    };

    let done = false;

    for (const r of buf) {
        const m = map[r[0]];

        if (m !== undefined) {
            if (!custom) {
                c.fillStyle = m;
                c.fillRect(r[1], r[2], r[3], r[4]);
            } else if (!done && r[0] === sentN && r[2] === oy + 2 * s && r[3] === 10 * s && r[4] === 3 * s) {
                done = true;
                st.draw(H, real, shade(real, 35), shade(real, -30), skin);
                if (!isF) H(9, 5, 3, 1, shade(real, -10));
            }
        } else {
            c.fillStyle = r[0];
            c.fillRect(r[1], r[2], r[3], r[4]);
        }
    }

    overlay(c, ox, oy, s, o, isF);
};

// ==================================================
// 4) HELPER UMUM
// ==================================================
const gk = () => (save.char === "female" ? "f" : "m");

const isVault = () => {
    const h = document.querySelector("#shopScreen .shop-header h2");
    return !!h && h.textContent === "VAULT";
};

function mkThumb(fn) {
    const cv = document.createElement("canvas");
    cv.width = 64; cv.height = 90;
    const c = cv.getContext("2d");
    c.imageSmoothingEnabled = false;
    fn(c);
    return cv;
}

// jalankan gambar tanpa item fashion & tanpa mode coba (untuk thumbnail bundle)
function plain(fn) {
    const F = save.fashion;

    if (!F || !F.equipped) { fn(); return; }

    const g = save.char, old = F.equipped[g], scr = currentScreen;

    F.equipped[g] = {};
    currentScreen = "dashboard";

    try { fn(); }
    finally { F.equipped[g] = old; currentScreen = scr; }
}

// ==================================================
// 5) TAB RAMBUT (di kiri tab Baju) + TAB BUNDLE (paling kanan) + IKON SEMUA TAB
// ==================================================
const tabs = document.querySelector(".shop-tabs");

const hTab = document.createElement("button");
hTab.className = "shop-tab";
hTab.dataset.category = "hair";
hTab.innerHTML = FA("scissors") + " Rambut";
hTab.onclick = () => { currentShopCategory = "hair"; renderShop(); };
tabs.insertBefore(hTab, tabs.firstChild);

const bTab = document.createElement("button");
bTab.className = "shop-tab";
bTab.dataset.category = "bundle";
bTab.innerHTML = FA("gift") + " Bundle";
bTab.onclick = () => { currentShopCategory = "bundle"; renderShop(); };
tabs.appendChild(bTab);

const TAB_ICON = { shirt: "shirt", pants: "person", hat: "hat-wizard", mask: "mask", shoes: "shoe-prints", cape: "flag", acc: "gem" };

document.querySelectorAll(".shop-tab").forEach(t => {
    const ic = TAB_ICON[t.dataset.category];
    if (ic && !t.querySelector("i")) t.innerHTML = FA(ic) + " " + t.textContent.trim();
});

function buyHair(st) {
    if (save.coins < 100) {
        showToast("Koin kurang! Ganti rambut 100 koin, koinmu " + save.coins);
        playTone(150);
        return;
    }

    save.coins -= 100;
    save.hairOwned.push(st.id);
    save.hairStyle[st.g] = st.id;
    tryHair[st.g] = null;

    saveData();
    updateDashboard();

    playTone(850);
    showToast("Rambut " + st.name + " dibeli & dipakai!");
    renderShop();
}

function wearHair(st) {
    save.hairStyle[st.g] = st.id;
    tryHair[st.g] = null;

    saveData();
    playTone(700);
    renderShop();
}

function renderHairGrid() {
    const g = gk();
    const grid = $("shopGrid");
    const vault = isVault();

    hs();
    grid.innerHTML = "";

    Object.values(STY).filter(s => s.g === g).forEach(st => {
        const owned = st.def || save.hairOwned.includes(st.id);

        if (vault && !owned) return;

        const worn = save.hairStyle[g] === st.id;
        const tried = tryHair[g] === st.id && !worn;

        const card = document.createElement("div");
        card.className = "shop-item" + (worn ? " wearing" : "") + (tried ? " trying" : "");

        if (tried) {
            const tt = document.createElement("span");
            tt.className = "try-tag";
            tt.textContent = "COBA";
            card.appendChild(tt);
        }

        const tb = document.createElement("div");
        tb.className = "item-thumb";
        tb.appendChild(mkThumb(c => {
            forceHair = st.id;
            try { drawCharacter(c, 8, 15, 3, buildOutfit(tryOn, { facing: 1 })); }
            finally { forceHair = null; }
        }));

        const h = document.createElement("h4");
        h.textContent = st.name;

        const p = document.createElement("p");
        p.innerHTML = st.def ? "FREE" : (owned ? "DIMILIKI" : COIN + " 100");

        const b = document.createElement("button");

        if (worn) {
            b.textContent = "DIPAKAI";
            b.className = "equipped";
            b.disabled = true;
        } else if (owned) {
            b.textContent = "PAKAI";
            b.className = "owned";
            b.onclick = ev => { ev.stopPropagation(); wearHair(st); };
        } else {
            b.textContent = "BELI";
            b.onclick = ev => { ev.stopPropagation(); buyHair(st); };
        }

        card.onclick = () => {
            tryHair[g] = st.id;
            playTone(600, 0.06);
            renderShop();
        };

        card.append(tb, h, p, b);
        grid.appendChild(card);
    });
}

// ==================================================
// 6) BUNDLE (Shop + Vault)
// ==================================================
const ownedB = b => save.bundles.includes(b.id);

function eqB(b) {
    const set = bundleIds(b, gk());
    const fe = (save.fashion && save.fashion.equipped[save.char]) || {};

    return CATEGORIES.every(k => save.cosmetics.equipped[k] === set[k]) &&
        !["top", "bottom", "head", "shoes"].some(k => fe[k]);
}

function buyBundle(b) {
    if (ownedB(b)) return;

    if (save.coins < b.price) {
        showToast("Koin kurang! Harga " + b.price + ", koinmu " + save.coins);
        playTone(150);
        return;
    }

    save.coins -= b.price;
    save.bundles.push(b.id);

    ["m", "f"].forEach(k => {
        Object.values(b[k]).forEach(id => {
            if (!save.cosmetics.owned.includes(id)) save.cosmetics.owned.push(id);
        });
    });

    saveData();
    updateDashboard();

    playTone(850);
    showToast(b.name + " dibeli & masuk VAULT!");
    renderShop();
}

function equipBundle(b) {
    if (!ownedB(b)) return;

    const set = bundleIds(b, gk());

    CATEGORIES.forEach(k => { save.cosmetics.equipped[k] = set[k]; });

    const fe = save.fashion && save.fashion.equipped[save.char];
    if (fe) ["top", "bottom", "head", "shoes"].forEach(k => delete fe[k]);

    bpv = null;

    saveData();
    updateDashboard();

    playTone(700);
    $("resetTryBtn").onclick();
}

function unequipBundle(b) {
    CATEGORIES.forEach(k => { save.cosmetics.equipped[k] = DEFAULT_EQUIPPED[k]; });

    bpv = null;

    saveData();
    updateDashboard();

    playTone(500);
    $("resetTryBtn").onclick();
}

function renderBundleGrid() {
    const grid = $("shopGrid");
    const vault = isVault();
    const g = gk();

    grid.innerHTML = "";

    const list = BUNDLES.filter(b => !vault || ownedB(b));

    if (!list.length) {
        const p = document.createElement("p");
        p.style.gridColumn = "1 / -1";
        p.textContent = vault ? "Belum ada bundle. Beli dulu di mode TOKO." : "Tidak ada bundle.";
        grid.appendChild(p);
        return;
    }

    list.forEach(b => {
        const owned = ownedB(b);
        const worn = owned && eqB(b);
        const trying = bpv === b.id && !worn;

        const card = document.createElement("div");
        card.className = "shop-item" + (worn ? " wearing" : "") + (trying ? " trying" : "");

        const tag = document.createElement("span");
        tag.className = "pq2-tag";

        if (worn) { tag.textContent = "EQUIPPED"; tag.style.background = "#318b58"; }
        else if (owned) { tag.textContent = "OWNED"; tag.style.background = "#526a84"; }
        else if (save.coins < b.price) { tag.innerHTML = FA("lock") + " LOCKED"; tag.style.background = "#8a3a3a"; }
        else { tag.textContent = "BUNDLE"; tag.style.background = "#3d8fe0"; }

        card.appendChild(tag);

        if (trying) {
            const tt = document.createElement("span");
            tt.className = "try-tag";
            tt.textContent = "COBA";
            card.appendChild(tt);
        }

        const tb = document.createElement("div");
        tb.className = "item-thumb";
        tb.appendChild(mkThumb(c => {
            plain(() => drawCharacter(c, 8, 15, 3, buildOutfit(bundleIds(b, g), { facing: 1 })));
        }));

        const h = document.createElement("h4");
        h.textContent = b.name;

        const p = document.createElement("p");
        p.innerHTML = owned ? "DIMILIKI" : COIN + " " + b.price;

        const row = document.createElement("div");
        row.className = "pq2-row";

        const act = document.createElement("button");

        if (!owned) {
            act.textContent = "BELI";
            act.onclick = ev => { ev.stopPropagation(); buyBundle(b); };
        } else if (worn) {
            act.textContent = "UNEQUIP";
            act.className = "owned";
            act.onclick = ev => { ev.stopPropagation(); unequipBundle(b); };
        } else {
            act.textContent = "EQUIP";
            act.className = "owned";
            act.onclick = ev => { ev.stopPropagation(); equipBundle(b); };
        }

        const preview = () => {
            bpv = b.id;
            playTone(600, 0.06);
            renderShop();
        };

        if (!vault) {
            const pv = document.createElement("button");
            pv.className = "owned";
            pv.innerHTML = FA("eye") + " PREVIEW";
            pv.onclick = ev => { ev.stopPropagation(); preview(); };
            row.append(pv, act);
        } else {
            row.appendChild(act);
        }

        card.onclick = preview;

        card.append(tb, h, p, row);
        grid.appendChild(card);
    });
}

// Item khusus satu gender disembunyikan saat karakter aktif beda gender
const ONLY_BY_NAME = {};
Object.values(SHOP_ITEMS).forEach(list => {
    list.forEach(it => { if (it.only) ONLY_BY_NAME[it.name] = it.only; });
});

function trimGender() {
    const g = gk();

    document.querySelectorAll("#shopGrid .shop-item").forEach(card => {
        const h = card.querySelector("h4");
        if (!h) return;

        const only = ONLY_BY_NAME[h.textContent];
        if (only && only !== g) card.remove();
    });
}

// Pembungkus renderShop (render lama tetap jalan dulu)
const prevRS = renderShop;

renderShop = function () {
    prevRS();

    if (currentScreen !== "shop") return;

    hs();

    const cat = currentShopCategory;

    if (cat !== "bundle") bpv = null;

    if (cat === "bundle") {
        renderBundleGrid();

        if (bpv) {
            const st = $("tryStatus");
            st.innerHTML = FA("eye") + " PREVIEW BUNDLE - belum dipakai";
            st.classList.add("trying");
        }
    } else if (cat === "hair") {
        renderHairGrid();
    } else {
        trimGender();
    }
};

// Preview karakter besar untuk bundle
const prevRP = renderPreviews;

renderPreviews = function () {
    if (currentScreen === "shop" && bpv && pctx) {
        const b = BUNDLES.find(x => x.id === bpv);

        if (b) {
            pctx.clearRect(0, 0, 160, 220);

            pctx.fillStyle = "rgba(0,0,0,.3)";
            pctx.beginPath();
            pctx.ellipse(80, 214, 38, 6, 0, 0, Math.PI * 2);
            pctx.fill();

            const step = previewWalk ? (Math.floor(frame / 8) % 2) + 1 : 0;
            const bob = previewWalk ? 0 : Math.round(Math.sin(frame * 0.08) * 2);

            plain(() => {
                drawCharacter(
                    pctx, 24, 44 + bob, 7,
                    buildOutfit(bundleIds(b, gk()), { facing: previewFacing, step, moving: previewWalk })
                );
            });

            return;
        }
    }

    prevRP();
};

// bersihkan mode coba rambut / bundle saat tombol batal atau buka shop
$("resetTryBtn").addEventListener("click", () => { tryHair = {}; bpv = null; });
$("openShop").addEventListener("click", () => { tryHair = {}; bpv = null; });
$("openVault").addEventListener("click", () => { tryHair = {}; bpv = null; });

// ==================================================
// 7) PULIHKAN ITEM BARU YANG DIPAKAI SAAT AUTO-LOGIN
// (upgrade.js login sebelum item ini terdaftar, jadi dipulihkan di sini)
// ==================================================
(function restore() {
    const u = localStorage.getItem("pq_session");
    if (!u) return;

    let raw = null;
    try { raw = JSON.parse(localStorage.getItem("pq_save_" + u)); } catch (e) { }

    if (!raw || !raw.cosmetics || !raw.cosmetics.equipped) return;

    CATEGORIES.forEach(k => {
        const id = raw.cosmetics.equipped[k];

        if (id && getShopItem(id) && save.cosmetics.owned.includes(id)) {
            save.cosmetics.equipped[k] = id;
        }
    });

    tryOn = { ...save.cosmetics.equipped };

    hs();
    updateDashboard();
})();

if (currentScreen === "shop") renderShop();

})();