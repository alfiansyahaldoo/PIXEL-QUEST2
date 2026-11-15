"use strict";
// PIXEL QUEST UPGRADE 2 - dimuat SETELAH game.js dan upgrade.js
// Isi: gender saat registrasi, karakter Male & Female, item fashion yang menyatu
// dengan tab CHARACTER SHOP lama, Preview/Beli, Vault (Equip/Unequip), ganti karakter,
// logout, dan penggantian emoji menjadi ikon Font Awesome.
(function () {

// ==================================================
// DATA ITEM FASHION  (g: "m" = male, "f" = female)
// cat: head -> tab Topi | top -> tab Baju | bottom -> tab Celana
//      shoes -> tab Sepatu | acc -> tab Aksesori
// ==================================================
const ITEMS = [];
const BY = {};

function I(g, cat, id, name, price, kind, c) {
    const it = { g, cat, id, name, price, kind, c: c || [] };
    ITEMS.push(it);
    BY[id] = it;
}

// ----- MALE -----
I("m", "head", "m_head_spike",  "Rambut Spike",         150, "spike",  []);
I("m", "head", "m_head_beanie", "Beanie Hitam",         180, "beanie", ["#2b2f3a", "#e94c38"]);
I("m", "head", "m_head_cap",    "Topi Baseball",        160, "cap",    ["#f2f2f2", "#3278d4"]);

I("m", "top", "m_top_tee",    "Kaos Putih",             80,  "tee",    ["#f2f4f7"]);
I("m", "top", "m_top_stripe", "Kaos Garis Merah",       120, "tee",    ["#c0392b", "#ffffff"]);
I("m", "top", "m_top_levis",  "Vest Levis Denim",       450, "vest",   ["#4d73a8", "#37578a"]);
I("m", "top", "m_top_hoodie", "Hoodie Abu",             300, "hoodie", ["#7c8594"]);
I("m", "top", "m_top_jacket", "Jaket Casual Bomber",    350, "jacket", ["#4b5d3a", "#e9a23b"]);

I("m", "bottom", "m_bot_shorts", "Celana Pendek",         120, "shorts", ["#c9a66b"]);
I("m", "bottom", "m_bot_jeans",  "Jeans Slim Hitam",      200, "jeans",  ["#2a2f3d"]);
I("m", "bottom", "m_bot_cargo",  "Celana Cargo",          250, "cargo",  ["#8a7a52"]);
I("m", "bottom", "m_bot_levis",  "Celana Levis Baggy", 400, "baggy",  ["#46699f"]);

I("m", "shoes", "m_shoe_sneak", "Sneakers Putih",    150, "sneaker", ["#f2f4f7", "#d3d8df", "#e94c38"]);
I("m", "shoes", "m_shoe_neon",  "Sneakers Neon",     220, "sneaker", ["#8cf23a", "#2b2f3a", "#ff2d95"]);
I("m", "shoes", "m_shoe_dm",    "Dr. Martens Boots", 380, "boots",   ["#1b1b1f"]);

I("m", "acc", "m_acc_glasses", "Kacamata Bulat", 140, "glasses",  ["#2b2f3a"]);
I("m", "acc", "m_acc_watch",   "Jam Tangan",     120, "watch",    ["#2b2f3a", "#9be0ff"]);
I("m", "acc", "m_acc_chain",   "Kalung Rantai",  260, "chain",    ["#f1c232", "#e94c38"]);
I("m", "acc", "m_acc_pack",    "Tas Ransel",     300, "backpack", ["#c0392b"]);

// ----- FEMALE -----
I("f", "head", "f_head_clip", "Jepit Rambut",   70,  "clip", ["#ffd24a", "#ff7ab8"]);
I("f", "head", "f_head_bow",  "Pita Merah",     90,  "bow",  ["#e94c6a"]);
I("f", "head", "f_head_band", "Bando Pink",     110, "band", ["#ff7ab8"]);
I("f", "head", "f_head_pony", "Kuncir Kuda",    160, "pony", ["#ff5a9a"]);
I("f", "head", "f_head_twin", "Kuncir Dua",     220, "twin", ["#7a5cff"]);
I("f", "head", "f_head_cat",  "Telinga Kucing", 260, "cat",  ["#ff9ec7", "#ffd0e6"]);

I("f", "top", "f_top_tee",     "Kaos Lavender",      100, "tee",    ["#c9a7ff"]);
I("f", "top", "f_top_stripe",  "Kaos Garis Navy",    120, "tee",    ["#f2f4f7", "#2b3f78"]);
I("f", "top", "f_top_blouse",  "Blouse Biru",        140, "tee",    ["#7fb8ff", "#ffffff"]);
I("f", "top", "f_top_crop",    "Atasan Crop Pink",   150, "crop",   ["#ff8fc2", "#ffffff"]);
I("f", "top", "f_top_sweater", "Sweater Krem",       280, "hoodie", ["#f1dcc0"]);
I("f", "top", "f_top_hoodie",  "Hoodie Mint",        320, "hoodie", ["#7fd6b8"]);
I("f", "top", "f_top_denim",   "Jaket Denim Cewek",  450, "cdenim", ["#4d73a8", "#f2f4f7"]);

I("f", "bottom", "f_bot_shorts", "Celana Pendek Denim",   130, "shorts", ["#4d73a8"]);
I("f", "bottom", "f_bot_skirt",  "Rok Plisse Pink",       200, "skirt",  ["#e94c8a", "#ff9ec7"]);
I("f", "bottom", "f_bot_jeans",  "Celana Jeans",          220, "jeans",  ["#3b5a8e"]);
I("f", "bottom", "f_bot_dskirt", "Rok Denim",             260, "skirt",  ["#4d73a8", "#6f93c7"]);
I("f", "bottom", "f_bot_cargo",  "Cargo Hijau",           280, "cargo",  ["#6f7d4a"]);
I("f", "bottom", "f_bot_lskirt", "Rok Panjang Ungu",      320, "lskirt", ["#8a4fd0", "#6a3c9a"]);
I("f", "bottom", "f_bot_baggy",  "Celana Baggy Denim", 380, "baggy",  ["#46699f"]);

I("f", "shoes", "f_shoe_flat",  "Flat Shoes Pink",  120, "flat",    ["#ff7ab8"]);
I("f", "shoes", "f_shoe_sneak", "Sneakers Putih",   150, "sneaker", ["#f2f4f7", "#d3d8df", "#ff7ab8"]);
I("f", "shoes", "f_shoe_heels", "Hak Tinggi Merah", 240, "heels",   ["#d6304f"]);
I("f", "shoes", "f_shoe_boots", "Sepatu Boots",     350, "boots",   ["#3a2a24"]);

I("f", "acc", "f_acc_bracelet", "Gelang Emas",      90,  "bracelet",   ["#ffd24a"]);
I("f", "acc", "f_acc_choker",   "Choker",           120, "choker",     ["#1b1b1f", "#e94c6a"]);
I("f", "acc", "f_acc_glasses",  "Kacamata Cat-eye", 150, "catglasses", ["#e94c8a"]);
I("f", "acc", "f_acc_scarf",    "Syal Merah",       180, "scarf",      ["#e94c6a"]);
I("f", "acc", "f_acc_bag",      "Tas Selempang",    280, "bag",        ["#8a4fd0", "#f1c232"]);

// Slot = satu tab di Character Shop. old = kategori item lama, fx = kategori item fashion.
const SLOTS = {
    shirt: { old: "shirt", fx: "top" },
    pants: { old: "pants", fx: "bottom" },
    hat:   { old: "hat",   fx: "head" },
    mask:  { old: "mask",  fx: null },
    shoes: { old: "shoes", fx: "shoes" },
    cape:  { old: "cape",  fx: null },
    acc:   { old: null,    fx: "acc" }
};

const SLOT_KEYS = Object.keys(SLOTS);
const FX_CATS = ["head", "top", "bottom", "shoes", "acc"];

const HAT_NONE = getShopItem("hat_none");

// Geometri badan (grid 16x24)
const GEO = {
    m: { tx: 3, tw: 10, aB: 1,  aF: 13, lB: 3, lw: 4, lF: 9, sB: 2, swB: 5, sF: 9, swF: 6 },
    f: { tx: 4, tw: 8,  aB: 2,  aF: 12, lB: 4, lw: 3, lF: 9, sB: 3, swB: 4, sF: 9, swF: 5 }
};

// ==================================================
// DATA AKUN / SAVE
// ==================================================
const accounts = () => {
    try { return JSON.parse(localStorage.getItem("pq_accounts")) || {}; }
    catch (e) { return {}; }
};

function ensure() {
    if (!save.gender) {
        const a = accounts()[localStorage.getItem("pq_session")];
        save.gender = a && a.gender === "female" ? "female" : "male";
    }

    if (save.char !== "male" && save.char !== "female") {
        save.char = save.gender;
    }

    let f = save.fashion;

    if (!f || typeof f !== "object") f = save.fashion = {};
    if (!Array.isArray(f.owned)) f.owned = [];
    if (!f.equipped || typeof f.equipped !== "object") f.equipped = {};

    ["male", "female"].forEach(k => {
        if (!f.equipped[k] || typeof f.equipped[k] !== "object") {
            f.equipped[k] = {};
        }
    });

    return f;
}

function sanitize() {
    const F = ensure();

    F.owned = [...new Set(F.owned.filter(id => BY[id]))];

    ["male", "female"].forEach(ch => {
        const e = F.equipped[ch];
        const gc = ch === "female" ? "f" : "m";

        Object.keys(e).forEach(k => {
            const it = BY[e[k]];

            if (!it || it.g !== gc || it.cat !== k || !F.owned.includes(it.id)) {
                delete e[k];
            }
        });
    });

    return F;
}

// Override tampilan (dipakai untuk thumbnail / pilihan karakter)
let PO = null;

function withPO(po, fn) {
    PO = po;
    try { fn(); } finally { PO = null; }
}

// Item fashion yang sedang DICOBA di shop (belum tentu dimiliki)
let fxTry = {};
let hubMode = "shop"; // "shop" atau "vault"

function state() {
    if (PO) return PO;

    ensure();

    const ch = save.char;
    const eq = currentScreen === "shop"
        ? fxTry
        : (save.fashion.equipped[ch] || {});

    return { char: ch, eq };
}

const eqOf = () => ensure().equipped[save.char];
const genderCode = () => (save.char === "female" ? "f" : "m");

// ==================================================
// GAMBAR KARAKTER: Male (sprite lama) + Female (sprite baru) + Fashion
// ==================================================
const prevDraw = drawCharacter;

function mkT(R, G, g) {
    // Untuk Female, bagian pinggang dipersempit supaya siluetnya beda.
    return (x, y, w, h, col) => {
        if (g !== "f") { R(x, y, w, h, col); return; }

        const a = Math.min(y + h, 14);
        if (a > y) R(x, y, w, a - y, col);

        const b = Math.max(y, 14);

        if (y + h > b) {
            const x0 = Math.max(x, G.tx + 1);
            const x1 = Math.min(x + w, G.tx + G.tw - 1);
            if (x1 > x0) R(x0, b, x1 - x0, y + h - b, col);
        }
    };
}

function headgear(R, o) {
    const mask = o.mask;
    const hat = o.hat;

    if (mask && mask.id !== "mask_none") {
        const mc = mask.color;
        const ms = mask.style;

        if (ms === "ninja") {
            R(3, 4, 10, 2, mc); R(3, 8, 10, 3, mc); R(3, 8, 10, 1, shade(mc, 25)); R(1, 4, 2, 2, mc);
        } else if (ms === "bandit") {
            R(3, 5, 10, 1, mc); R(3, 8, 10, 1, mc); R(3, 6, 6, 2, mc); R(12, 6, 1, 2, mc);
        } else if (ms === "shades") {
            R(3, 6, 5, 1, mc); R(8, 5, 5, 3, mc); R(9, 5, 1, 1, "#ffffff"); R(11, 6, 1, 1, "#5a6b86");
        } else if (ms === "stache") {
            R(8, 8, 5, 2, mc); R(7, 9, 2, 1, mc);
        } else if (ms === "skull") {
            R(3, 4, 10, 7, "#eee8d8"); R(9, 6, 3, 2, "#111"); R(4, 6, 2, 2, "#111");
            R(7, 8, 1, 1, "#555"); R(4, 9, 8, 2, "#fff");
            [6, 8, 10].forEach(x => R(x, 9, 1, 2, "#999"));
        } else if (ms === "visor") {
            R(3, 5, 10, 3, "#1b2a3d"); R(8, 5, 5, 3, "#2fe6ff"); R(9, 6, 3, 1, "#c8ffff");
        } else if (ms === "oni") {
            R(3, 4, 10, 7, "#c7302b"); R(4, 1, 2, 3, "#f4ecd0"); R(10, 1, 2, 3, "#f4ecd0");
            R(8, 5, 5, 1, "#5a0f0f"); R(9, 6, 3, 2, "#ffd84a"); R(10, 6, 1, 2, "#111");
            R(9, 10, 1, 2, "#fff"); R(12, 10, 1, 2, "#fff");
        } else if (ms === "spike4") {
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
    }

    if (hat && hat.id !== "hat_none") {
        const hc = hat.color;

        switch (hat.style) {
            case "cap":
                R(4, 0, 8, 2, hc); R(3, 1, 10, 3, hc); R(10, 3, 5, 1, shade(hc, -40)); R(5, 0, 3, 1, shade(hc, 40));
                break;
            case "crown":
                R(3, 1, 10, 3, hc); R(3, -2, 2, 3, hc); R(7, -2, 2, 3, hc); R(11, -2, 2, 3, hc);
                R(3, 3, 10, 1, shade(hc, -45)); R(7, 2, 2, 1, "#e94c38"); R(4, 1, 1, 1, "#fff2a8");
                break;
            case "wizard":
                R(1, 2, 14, 2, hc); R(4, -1, 8, 3, hc); R(6, -4, 4, 3, hc); R(9, -5, 3, 2, hc);
                R(4, 1, 8, 1, "#f5c842"); R(1, 3, 14, 1, shade(hc, -35));
                break;
            case "helmet":
                R(2, 0, 12, 4, hc); R(2, 4, 3, 4, hc); R(11, 3, 2, 4, shade(hc, -30));
                R(5, 1, 4, 1, shade(hc, 55)); R(2, 3, 12, 1, shade(hc, -40));
                break;
            case "band":
                R(3, 3, 10, 2, hc); R(1, 4, 2, 1, hc); R(0, 5, 3, 2, hc);
                break;
            case "hood":
                R(2, 0, 12, 4, hc); R(2, 4, 3, 7, hc); R(12, 4, 1, 4, hc); R(3, 3, 10, 1, shade(hc, 25));
                break;
            case "top":
                R(2, 2, 12, 1, hc); R(4, -4, 8, 6, hc); R(4, 0, 8, 1, "#e94c38"); R(5, -3, 1, 3, shade(hc, 45));
                break;
            case "horn":
                R(3, 1, 10, 3, "#8a8f99"); R(3, 3, 10, 1, "#555b66"); R(1, 0, 2, 2, "#f4ecd0"); R(0, -2, 2, 2, "#f4ecd0");
                R(13, 0, 2, 2, "#f4ecd0"); R(14, -2, 2, 2, "#f4ecd0");
                break;
            case "halo":
                R(5, -4, 6, 1, "#ffe98a"); R(5, -2, 6, 1, "#ffe98a"); R(4, -3, 1, 1, "#ffe98a"); R(11, -3, 1, 1, "#ffe98a");
                break;
        }
    }
}

// Sprite dasar FEMALE (bentuk sendiri: rambut panjang, pinggang ramping, wajah berbeda)
function drawFemale(R, o, opt, v) {
    const skin = o.skin, hair = o.hair;
    const sC = o.shirt.color, pC = o.pants.color, shC = o.shoes.color;
    const air = v.air, moving = v.moving, armY = v.armY, backH = v.backH, frontH = v.frontH;

    // jubah (di belakang)
    if (o.cape && o.cape.id !== "cape_none") {
        const cc = o.cape.color;
        const sw = air ? 3 : (moving ? 2 : 0);

        R(1 - sw, 11, 3 + sw, 10, cc);
        R(1 - sw, 19, 3 + sw, 2, shade(cc, -35));
        R(1 - sw, 11, 1, 10, shade(cc, -18));
    }

    // rambut panjang di belakang
    if (opt.longHair) {
        R(1, 4, 4, 12, hair);
        R(1, 14, 4, 3, shade(hair, -25));
        R(1, 5, 1, 9, shade(hair, -18));
        if (moving || air) R(0, 9, 1, 6, hair);
    }

    // lengan belakang
    R(2, armY, 2, 4, shade(sC, -35));
    R(2, armY + 4, 2, 2, shade(skin, -20));

    // kaki
    const lg = opt.skirt;

    R(4, 17, 3, backH, lg ? shade(skin, -20) : shade(pC, -20));
    R(9, 17, 3, frontH, lg ? skin : pC);
    R(4, 17, 8, 2, lg ? skin : pC);

    // sepatu bawaan
    if (!opt.noShoe) {
        const by = 17 + backH, fy = 17 + frontH;

        R(3, by, 4, 3, shade(shC, -25));
        R(3, by + 2, 4, 1, shade(shC, -60));
        R(9, fy, 5, 3, shC);
        R(9, fy + 2, 5, 1, shade(shC, -50));
        R(9, fy, 5, 1, shade(shC, 25));
    }

    // badan (dada lebar, pinggang sempit)
    R(4, 11, 8, 3, sC);
    R(5, 14, 6, 2, sC);
    R(9, 11, 3, 3, shade(sC, -20));
    R(9, 14, 2, 2, shade(sC, -20));
    R(4, 11, 8, 1, shade(sC, 28));

    const style = o.shirt.style;

    if (style === "stripe") {
        R(4, 13, 8, 1, "rgba(255,255,255,.6)");
        R(5, 15, 6, 1, "rgba(255,255,255,.6)");
    } else if (style === "trim") {
        R(4, 11, 8, 1, "#f5c842");
        R(7, 12, 2, 3, "#f5c842");
    } else if (style === "rainbow") {
        ["#e94c38", "#f19a38", "#f5d842", "#4cbf64", "#3d8be0"].forEach((col, i) => {
            const y = 12 + i;
            if (y < 14) R(4, y, 8, 1, col); else R(5, y, 6, 1, col);
        });
    } else if (style === "armor") {
        R(4, 11, 8, 5, "#9aa6b8"); R(4, 11, 8, 1, "#dfe6ef"); R(7, 12, 2, 3, "#5f6b7d");
        R(11, 10, 3, 3, "#c5cfdc"); R(2, 10, 3, 3, "#7d889a");
    } else if (style === "dragon") {
        R(4, 11, 8, 5, "#b82a2a");
        for (let i = 0; i < 3; i++) R(5 + i * 2, 12 + (i % 2) * 2, 2, 1, "#7a1818");
        R(4, 11, 8, 1, "#f5c842"); R(11, 9, 2, 2, "#f5c842"); R(3, 9, 2, 2, "#f5c842");
    }

    R(4, 16, 8, 1, shade(pC, -45));
    R(7, 16, 2, 1, "#f5c842");

    // lengan depan
    R(12, armY, 2, 4, sC);
    R(12, armY, 2, 1, shade(sC, 28));
    R(12, armY + 4, 2, 2, skin);

    // kepala
    R(3, 3, 10, 8, skin);
    R(3, 9, 10, 2, shade(skin, -12));

    // rambut atas + poni
    R(3, 2, 10, 3, hair);
    R(3, 4, 2, 7, hair);
    R(8, 4, 5, 1, hair);
    R(11, 5, 2, 1, hair);
    R(12, 4, 1, 4, hair);
    R(5, 2, 4, 1, shade(hair, 35));

    // mata + bulu mata
    R(9, 6, 3, 2, "#ffffff");
    R(10, 6, 2, 2, "#161616");
    R(10, 6, 1, 1, "#ffffff");
    R(9, 5, 3, 1, "#2a1b17");
    R(8, 6, 1, 1, "#2a1b17");

    // hidung, pipi, bibir
    R(12, 8, 1, 1, shade(skin, -25));
    R(8, 8, 2, 1, "rgba(255,110,140,.45)");
    R(9, 9, 3, 1, luminance(skin) < 70 ? "#ff9ec7" : "#d6456b");

    headgear(R, o);
}

// ---------- OVERLAY FASHION ----------
function drawTop(R, G, g, it, v) {
    const c0 = it.c[0], c1 = it.c[1], k = it.kind;
    const tx = G.tx, tw = G.tw, aB = G.aB, aF = G.aF, ay = v.armY;
    const sk = v.skin, skB = shade(sk, -20);
    const T = mkT(R, G, g);

    const arms = (n, cF, cB) => {
        R(aB, ay, 2, n, cB);
        R(aB, ay + n, 2, 6 - n, skB);
        R(aF, ay, 2, n, cF);
        R(aF, ay + n, 2, 6 - n, sk);
    };

    if (k === "tee") {
        T(tx, 11, tw, 6, c0);
        T(tx + tw - 3, 11, 3, 6, shade(c0, -20));
        T(tx, 11, tw, 1, shade(c0, 25));

        if (c1) {
            T(tx, 13, tw, 1, c1);
            T(tx, 15, tw, 1, c1);
        }

        R(tx + 3, 11, 3, 1, shade(c0, -40));
        arms(2, c0, shade(c0, -35));

    } else if (k === "crop") {
        T(tx, 11, tw, 4, c0);
        T(tx + tw - 3, 11, 3, 4, shade(c0, -18));
        T(tx, 11, tw, 1, shade(c0, 25));
        R(tx + 1, 15, tw - 2, 1, sk);
        R(tx + 3, 11, 3, 1, shade(c0, -40));
        if (c1) R(tx + tw - 4, 12, 2, 1, c1);
        arms(2, c0, shade(c0, -35));

    } else if (k === "vest") {
        const btn = "#d6dbe2";

        T(tx, 11, tw, 6, c0);
        T(tx, 11, tw, 1, shade(c0, 30));
        T(tx + tw - 3, 11, 3, 6, shade(c0, -18));
        R(tx + tw - 4, 11, 2, 2, "#eef1f5");
        R(tx + tw - 3, 13, 1, 1, btn);
        R(tx + tw - 3, 15, 1, 1, btn);
        T(tx + 2, 13, 3, 2, shade(c0, -28));
        T(tx + 2, 13, 3, 1, shade(c0, 18));
        R(tx + 3, 14, 1, 1, "#c8283c");
        T(tx + 1, 12, 1, 3, shade(c0, 22));
        T(tx, 16, tw, 1, shade(c0, 35));

        for (let i = 0; i < tw; i += 2) T(tx + i, 16, 1, 1, shade(c0, -12));

        R(tx + tw - 5, 10, 4, 1, shade(c0, 30));

        // tanpa lengan: lengan kulit, hanya bahu denim
        arms(0, c0, c0);
        R(aF, ay, 2, 1, c0);
        R(aB, ay, 2, 1, shade(c0, -30));

    } else if (k === "hoodie" || k === "jacket") {
        T(tx, 11, tw, 6, c0);
        T(tx + tw - 3, 11, 3, 6, shade(c0, -20));
        T(tx, 11, tw, 1, shade(c0, 25));

        if (k === "hoodie") {
            R(tx + 1, 10, tw - 3, 1, shade(c0, -15));
            R(tx + tw - 4, 12, 1, 3, "#eeeeee");
            R(tx + tw - 3, 12, 1, 2, "#dddddd");
            T(tx + 2, 14, tw - 5, 2, shade(c0, -22));
        } else {
            R(tx + tw - 3, 11, 1, 6, "#d9d9d9");
            R(tx + tw - 5, 10, 4, 1, shade(c0, -30));
            T(tx, 16, tw, 1, shade(c0, -40));
            if (c1) T(tx, 13, tw, 1, c1);
        }

        arms(5, c0, shade(c0, -35));
        R(aF, ay + 4, 2, 1, shade(c0, -30));

        if (k === "jacket" && c1) R(aF, ay + 1, 2, 1, c1);

    } else if (k === "cdenim") {
        T(tx, 11, tw, 4, c0);
        T(tx + tw - 3, 11, 3, 4, shade(c0, -18));
        T(tx, 11, tw, 1, shade(c0, 30));
        R(tx + tw - 4, 11, 2, 3, c1);
        R(tx + tw - 3, 12, 1, 1, "#d6dbe2");
        R(tx + tw - 3, 14, 1, 1, "#d6dbe2");
        R(tx + 2, 12, 2, 2, shade(c0, -25));
        T(tx, 14, tw, 1, shade(c0, 28));
        R(tx + 1, 15, tw - 2, 1, sk);

        arms(5, c0, shade(c0, -35));
        R(aF, ay + 4, 2, 1, shade(c0, 28));
        R(aB, ay + 4, 2, 1, shade(c0, -5));
    }
}

function drawBottom(R, G, it, v) {
    const c0 = it.c[0], c1 = it.c[1] || shade(c0, -25), k = it.kind;
    const tx = G.tx, tw = G.tw, lB = G.lB, lw = G.lw, lF = G.lF;
    const bh = v.backH, fh = v.frontH;
    const sk = v.skin, skB = shade(sk, -20);

    const hips = col => {
        R(tx, 16, tw, 1, shade(col, -45));
        R(tx, 17, tw, 2, col);
        R(tx + tw / 2 - 1, 16, 2, 1, "#f5c842");
    };

    if (k === "skirt") {
        R(lB, 17, lw, bh, skB);
        R(lF, 17, lw, fh, sk);

        R(tx, 16, tw, 1, shade(c0, -35));
        R(tx - 1, 17, tw + 2, 1, c0);
        R(tx - 2, 18, tw + 4, 1, c1);

        for (let x = tx - 1; x < tx + tw + 1; x += 2) R(x, 17, 1, 1, shade(c0, -22));
        for (let x = tx - 2; x < tx + tw + 2; x += 2) R(x, 18, 1, 1, shade(c1, -22));

    } else if (k === "lskirt") {
        R(lB, 17, lw, bh, skB);
        R(lF, 17, lw, fh, sk);

        R(tx, 16, tw, 1, shade(c0, -35));
        R(tx - 1, 17, tw + 2, 1, c0);
        R(tx - 1, 18, tw + 2, 2, c0);
        R(tx - 2, 20, tw + 4, 1, c1);

        for (let x = tx - 1; x < tx + tw + 1; x += 2) R(x, 18, 1, 2, shade(c0, -22));
        R(tx - 2, 20, tw + 4, 1, shade(c1, -10));

    } else if (k === "shorts") {
        hips(c0);
        R(lB, 17, lw, 2, shade(c0, -20));
        R(lF, 17, lw, 2, c0);
        R(lB, 19, lw, bh - 2, skB);
        R(lF, 19, lw, fh - 2, sk);

    } else if (k === "jeans") {
        hips(c0);
        R(lB, 17, lw, bh, shade(c0, -20));
        R(lF, 17, lw, fh, c0);
        R(lF + lw - 1, 17, 1, fh, shade(c0, -20));
        R(lF, 17, 1, fh, shade(c0, 14));

    } else if (k === "cargo") {
        hips(c0);
        R(lB - 1, 17, lw + 1, bh, shade(c0, -20));
        R(lF, 17, lw + 1, fh, c0);
        R(lF, 19, lw + 1, 2, shade(c0, -25));
        R(lF, 19, lw + 1, 1, shade(c0, 18));

    } else if (k === "baggy") {
        hips(c0);
        R(lB - 1, 17, lw + 2, bh + 1, shade(c0, -20));
        R(lF - 1, 17, lw + 2, fh + 1, c0);
        R(lF - 1, 18, 1, Math.max(1, fh - 1), shade(c0, -35));
        R(lF + 1, 19, 1, Math.max(1, fh - 2), shade(c0, -22));
        R(lB - 1, 17 + bh, lw + 2, 1, shade(c0, -35));
        R(lF - 1, 17 + fh, lw + 2, 1, shade(c0, -30));
    }
}

function drawShoes(R, G, it, v) {
    const c0 = it.c[0], c1 = it.c[1], c2 = it.c[2], k = it.kind;
    const by = 17 + v.backH, fy = 17 + v.frontH;
    const sk = v.skin, skB = shade(sk, -20);

    if (k === "sneaker") {
        R(G.sB, by, G.swB, 3, shade(c0, -25));
        R(G.sB, by + 2, G.swB, 1, shade(c1, -35));

        R(G.sF, fy, G.swF, 3, c0);
        R(G.sF, fy + 2, G.swF, 1, c1);
        R(G.sF + G.swF - 2, fy, 2, 2, shade(c0, -10));
        R(G.sF + 1, fy + 1, 3, 1, c2);
        R(G.sF + 1, fy, 2, 1, shade(c0, -30));

    } else if (k === "boots") {
        // Boots tinggi: jahitan kuning, sol tebal hitam
        R(G.lB, by - 2, G.lw, 2, shade(c0, -20));
        R(G.sB, by, G.swB, 3, shade(c0, -20));
        R(G.sB, by + 1, G.swB, 1, "#d9b13a");
        R(G.sB, by + 2, G.swB, 1, "#0b0b0d");

        R(G.lF, fy - 2, G.lw, 2, c0);
        R(G.sF, fy, G.swF, 3, c0);
        R(G.sF, fy + 1, G.swF, 1, "#e8c24a");
        R(G.sF, fy + 2, G.swF, 1, "#0b0b0d");
        R(G.sF + G.swF - 2, fy, 2, 1, shade(c0, 35));
        R(G.lF + 1, fy - 2, 2, 1, "#c9ccd1");
        R(G.lF, fy - 2, 1, 1, "#e8c24a");

    } else if (k === "flat") {
        R(G.lB, by, G.lw, 1, skB);
        R(G.sB, by + 1, G.swB, 2, shade(c0, -25));

        R(G.lF, fy, G.lw, 1, sk);
        R(G.sF, fy + 1, G.swF, 2, c0);
        R(G.sF + G.swF - 2, fy + 1, 1, 1, shade(c0, 45));

    } else if (k === "heels") {
        R(G.lB, by, G.lw, 1, skB);
        R(G.sB, by + 1, G.swB - 1, 2, shade(c0, -25));
        R(G.sB, by + 2, 1, 1, shade(c0, -60));

        R(G.lF, fy, G.lw, 1, sk);
        R(G.sF, fy + 1, G.swF - 1, 2, c0);
        R(G.sF, fy + 2, 1, 1, shade(c0, -60));
        R(G.sF + G.swF - 3, fy + 1, 1, 1, shade(c0, 50));
    }
}

function drawHead(R, it, v) {
    const c0 = it.c[0], c1 = it.c[1], k = it.kind, H = v.hair;
    const sw = (v.moving || v.air) ? 1 : 0;

    if (k === "spike") {
        R(3, 1, 10, 1, H);
        R(4, -1, 2, 2, H);
        R(7, -2, 2, 3, H);
        R(10, -1, 2, 2, H);
        R(5, -1, 1, 1, shade(H, 35));

    } else if (k === "beanie") {
        R(3, 1, 10, 3, c0);
        R(3, 3, 10, 1, shade(c0, -25));
        R(5, 1, 3, 1, shade(c0, 35));
        R(7, 0, 2, 1, c1);

    } else if (k === "cap") {
        R(3, 1, 10, 3, c0);
        R(3, 3, 10, 1, shade(c0, -15));
        R(10, 3, 5, 1, shade(c0, -40));
        R(6, 2, 3, 1, c1);

    } else if (k === "bow") {
        R(6, 0, 2, 3, c0);
        R(10, 0, 2, 3, c0);
        R(8, 1, 2, 2, shade(c0, -35));
        R(6, 0, 2, 1, shade(c0, 35));

    } else if (k === "clip") {
        R(4, 3, 4, 1, c0);
        R(5, 2, 2, 1, c1);

    } else if (k === "band") {
        R(3, 3, 10, 1, c0);
        R(2, 3, 2, 2, shade(c0, -25));

    } else if (k === "cat") {
        R(4, 0, 2, 2, c0);
        R(10, 0, 2, 2, c0);
        R(5, 1, 1, 1, c1);
        R(10, 1, 1, 1, c1);
        R(4, 2, 8, 1, shade(c0, -20));

    } else if (k === "pony") {
        R(2, 3, 2, 2, c0);
        R(1 - sw, 4, 2, 3, H);
        R(0 - sw, 7, 2, 7, H);
        R(0 - sw, 8, 1, 4, shade(H, 30));

    } else if (k === "twin") {
        R(2, 3, 2, 2, c0);
        R(1 - sw, 4, 2, 3, H);
        R(0 - sw, 7, 2, 6, H);

        R(13, 3, 2, 1, c0);
        R(13, 4, 2, 3, H);
        R(13, 7, 2, 6, H);
        R(14, 8, 1, 3, shade(H, 30));
    }
}

function drawAcc(R, G, it, v) {
    const c0 = it.c[0], c1 = it.c[1], k = it.kind;
    const tx = G.tx, tw = G.tw, aF = G.aF, ay = v.armY;

    if (k === "glasses") {
        R(8, 5, 5, 1, c0); R(8, 8, 5, 1, c0); R(8, 6, 1, 2, c0); R(12, 6, 1, 2, c0);
        R(9, 6, 3, 2, "rgba(170,215,255,.35)");
        R(4, 6, 4, 1, c0);

    } else if (k === "catglasses") {
        R(8, 5, 6, 1, c0); R(8, 8, 5, 1, c0); R(8, 6, 1, 2, c0); R(12, 6, 1, 2, c0); R(13, 4, 1, 1, c0);
        R(9, 6, 3, 2, "rgba(255,170,215,.3)");
        R(4, 6, 4, 1, c0);

    } else if (k === "watch") {
        R(aF, ay + 3, 2, 1, c0);
        R(aF, ay + 3, 1, 1, c1);

    } else if (k === "bracelet") {
        R(aF, ay + 3, 2, 1, c0);

    } else if (k === "chain") {
        R(tx + 1, 11, 1, 1, c0); R(tx + 2, 12, 1, 1, c0); R(tx + 3, 13, 3, 1, c0);
        R(tx + 6, 12, 1, 1, c0); R(tx + 7, 11, 1, 1, c0);
        R(tx + 4, 14, 2, 1, c1);

    } else if (k === "choker") {
        R(5, 10, 6, 1, c0);
        R(7, 11, 1, 1, c1);

    } else if (k === "scarf") {
        R(tx, 10, tw, 1, c0);
        R(tx, 11, tw, 1, shade(c0, -22));
        R(tx + tw - 3, 12, 2, 4, c0);
        R(tx + tw - 3, 15, 2, 1, shade(c0, -30));

    } else if (k === "backpack") {
        R(0, 11, 3, 9, c0);
        R(0, 11, 3, 1, shade(c0, 35));
        R(3, 11, 1, 6, shade(c0, -35));
        R(0, 16, 3, 3, shade(c0, -25));
        R(1, 17, 1, 1, "#e8c24a");

    } else if (k === "bag") {
        for (let i = 0; i < 5; i++) R(tx + i, 11 + i, 1, 1, shade(c0, -25));
        R(tx + tw - 3, 15, 4, 3, c0);
        R(tx + tw - 3, 15, 4, 1, shade(c0, -28));
        R(tx + tw - 1, 16, 1, 1, c1);
    }
}

function overlay(R, g, E, v) {
    const G = GEO[g];
    const tp = BY[E.top], bt = BY[E.bottom], sh = BY[E.shoes], hd = BY[E.head], ac = BY[E.acc];

    if (tp) drawTop(R, G, g, tp, v);
    if (bt && bt.kind !== "baggy") drawBottom(R, G, bt, v);
    if (sh) drawShoes(R, G, sh, v);
    if (bt && bt.kind === "baggy") drawBottom(R, G, bt, v);
    if (hd) drawHead(R, hd, v);
    if (ac) drawAcc(R, G, ac, v);
}

drawCharacter = function (c, ox, oy, s, o) {
    const st = state();
    const g = st.char === "female" ? "f" : "m";
    const eq = st.eq || {};

    // hanya item yang cocok dengan gender karakter yang dipakai
    const E = {};

    FX_CATS.forEach(k => {
        const it = BY[eq[k]];
        if (it && it.g === g && it.cat === k) E[k] = eq[k];
    });

    const hd = BY[E.head];
    const o2 = hd ? Object.assign({}, o, { hat: HAT_NONE }) : o;

    const dir = o.facing < 0 ? -1 : 1;

    const R = (x, y, w, h, col) => {
        c.fillStyle = col;
        c.fillRect(
            ox + (dir > 0 ? x : 16 - x - w) * s,
            oy + y * s,
            w * s,
            h * s
        );
    };

    const air = !!o.air;
    const step = o.step || 0;
    const moving = !!o.moving;

    const v = {
        skin: o.skin,
        hair: o.hair,
        armY: air ? 10 : 12,
        backH: (step === 1 || air) ? 3 : 4,
        frontH: step === 2 ? 3 : 4,
        air, step, moving
    };

    if (g === "f") {
        const bk = BY[E.bottom] ? BY[E.bottom].kind : "";

        drawFemale(R, o2, {
            longHair: !(hd && (hd.kind === "pony" || hd.kind === "twin")),
            noShoe: !!BY[E.shoes],
            skirt: bk === "skirt" || bk === "lskirt"
        }, v);
    } else {
        prevDraw(c, ox, oy, s, o2);
    }

    // animasi idle: berkedip
    const covered = o2.mask && ["shades", "visor", "skull", "oni", "spike4"].includes(o2.mask.style);

    if (!air && !moving && !step && !covered && frame % 160 < 7) {
        R(9, 6, 3, 2, o.skin);
        R(9, 7, 3, 1, "#2a1b17");
    }

    overlay(R, g, E, v);
};

// ==================================================
// CSS TAMBAHAN
// ==================================================
const css = document.createElement("style");

css.textContent = `
#pqLogo{display:none;max-width:min(320px,80%);max-height:90px;object-fit:contain;margin:6px auto;background:none}
i.fa-solid{pointer-events:none}
.fa-coins{color:#ffdc59}
.fa-lock{color:#fff}

.pq2-gbox{display:flex;flex-direction:column;gap:6px;text-align:center}
.pq2-gbox small{font-size:10px;letter-spacing:2px;color:#a9bed4}
.pq2-gw{display:grid;grid-template-columns:1fr 1fr;border-radius:8px;overflow:hidden;border:2px solid #8298ac}
.pq2-g{border:0;padding:10px 4px;color:#fff;font-weight:900;display:flex;flex-direction:column;align-items:center;gap:4px;font-size:12px;outline:3px solid transparent;outline-offset:-3px;opacity:.72}
.pq2-g svg{width:46px;height:46px}
.pq2-g em{font-style:normal;font-size:10px;opacity:.9}
.pq2-g.f{background:#ec4a9d}
.pq2-g.m{background:#12a5ff}
.pq2-g.sel{outline-color:#ffdc59;opacity:1}

.pq2-chars{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:10px}
.pq2-char{background:#304964;border:3px solid #607995;border-radius:8px;padding:6px 12px;color:#fff;display:flex;flex-direction:column;align-items:center;gap:4px;font-weight:900;font-size:11px}
.pq2-char canvas{width:48px;height:68px;image-rendering:pixelated}
.pq2-char.sel{border-color:#ffdc59;background:#3a5576}
.pq2-modes{display:flex;gap:8px}
.pq2-mode{background:#405a78;color:#fff;padding:9px 16px;border-radius:5px;font-size:11px;font-weight:900}
.pq2-mode.active{background:#e97940;outline:2px solid #ffcf91}
.pq2-tag{position:absolute;top:5px;right:5px;padding:2px 5px;font-size:8px;font-weight:900;border-radius:3px;color:#fff;z-index:1}
.pq2-row{display:flex;gap:6px}
.pq2-row button{flex:1}
.shop-item button:disabled{opacity:.85;cursor:default}
`;

document.head.appendChild(css);

// ==================================================
// REGISTRASI: PILIH GENDER (di dalam form lama)
// ==================================================
const SVG_F = '<svg viewBox="0 0 100 100" fill="none" stroke="#fff" stroke-width="10"><circle cx="50" cy="36" r="22"/><path d="M50 58V90M34 76H66"/></svg>';
const SVG_M = '<svg viewBox="0 0 100 100" fill="none" stroke="#fff" stroke-width="10"><circle cx="40" cy="60" r="22"/><path d="M56 44L84 16M62 16H84V38"/></svg>';

let regMode = false;
let pickedGender = null;

const gbox = document.createElement("div");

gbox.id = "pqGender";
gbox.className = "pq2-gbox hidden";

gbox.innerHTML =
    '<small>PILIH GENDER</small>' +
    '<div class="pq2-gw">' +
    '<button type="button" class="pq2-g f" data-g="female">' + SVG_F + '<span>FEMALE</span><em>Perempuan</em></button>' +
    '<button type="button" class="pq2-g m" data-g="male">' + SVG_M + '<span>MALE</span><em>Laki-laki</em></button>' +
    '</div>';

$("pqForm").insertBefore(gbox, $("pqErr"));

gbox.querySelectorAll(".pq2-g").forEach(b => {
    b.onclick = () => {
        pickedGender = b.dataset.g;

        gbox.querySelectorAll(".pq2-g").forEach(x => {
            x.classList.toggle("sel", x === b);
        });

        $("pqErr").textContent = "";
    };
});

function resetGenderPick() {
    pickedGender = null;
    gbox.querySelectorAll(".pq2-g").forEach(x => x.classList.remove("sel"));
}

$("pqGoCreate").addEventListener("click", () => {
    regMode = true;
    resetGenderPick();
    gbox.classList.remove("hidden");
});

$("pqGoLogin").addEventListener("click", () => {
    regMode = false;
    gbox.classList.add("hidden");
});

const origSubmit = $("pqSubmit").onclick;

$("pqSubmit").onclick = async function (ev) {
    if (!regMode) {
        await origSubmit.call(this, ev);
        return;
    }

    if (!pickedGender) {
        $("pqErr").textContent = "Pilih gender dulu: Male atau Female";
        return;
    }

    const key = $("pqUser").value.trim().toLowerCase();
    const existedBefore = !!accounts()[key];
    const gender = pickedGender;

    await origSubmit.call(this, ev);

    // registrasi sukses = akun baru tercatat & sesi aktif untuk akun itu
    if (!existedBefore && key && accounts()[key] && localStorage.getItem("pq_session") === key) {
        const acc = accounts();

        acc[key].gender = gender;
        localStorage.setItem("pq_accounts", JSON.stringify(acc));

        save.gender = gender;
        save.char = gender;

        ensure();
        saveData();
        updateDashboard();

        resetGenderPick();
    }
};

// Logo di halaman login (kalau logo.png ada)
const logoTest = new Image();

logoTest.onload = () => {
    document.querySelectorAll("#pqAuth h1").forEach(h => {
        const im = document.createElement("img");

        im.src = "logo.png";
        im.alt = "PIXEL QUEST";
        im.style.cssText = "max-width:100%;max-height:90px;object-fit:contain;margin:0 auto;display:block;background:none";

        h.replaceWith(im);
    });
};

logoTest.src = "logo.png";

// ==================================================
// CHARACTER SHOP TERPADU (item lama + item fashion dalam tab yang sama)
// ==================================================
const FA = n => '<i class="fa-solid fa-' + n + '"></i>';
const COIN = FA("coins");

// Panel pilih karakter + mode TOKO / VAULT di bagian atas area kanan shop
const panel = document.createElement("div");

panel.id = "pq2Panel";

panel.innerHTML =
    '<h3>KARAKTER</h3>' +
    '<p>Pilih karakter. Shop, Vault, dashboard, dan game ikut berubah.</p>' +
    '<div class="pq2-chars" id="pq2Chars"></div>' +
    '<div class="pq2-modes">' +
    '<button class="pq2-mode active" id="pq2ModeShop">' + FA("bag-shopping") + ' TOKO</button>' +
    '<button class="pq2-mode" id="pq2ModeVault">' + FA("vault") + ' VAULT</button>' +
    '</div>' +
    '<div class="shop-divider"></div>';

const customSection = document.querySelector("#shopScreen .custom-section");
customSection.insertBefore(panel, customSection.firstChild);

// ---------- helper item ----------
// entry = { item, fx (true kalau item fashion), k (kunci slot/tab) }
function mkEntry(item) {
    if (item.g) {
        return { item, fx: true, k: SLOT_KEYS.find(k => SLOTS[k].fx === item.cat) };
    }

    return {
        item,
        fx: false,
        k: SLOT_KEYS.find(k => SLOTS[k].old && SHOP_ITEMS[SLOTS[k].old].some(i => i.id === item.id))
    };
}

const ownedE = e => e.fx
    ? ensure().owned.includes(e.item.id)
    : save.cosmetics.owned.includes(e.item.id);

function wornE(e) {
    const s = SLOTS[e.k];

    if (e.fx) return eqOf()[s.fx] === e.item.id;

    const fxOn = s.fx && eqOf()[s.fx];
    return !fxOn && save.cosmetics.equipped[s.old] === e.item.id;
}

function effEquipped(k) {
    const s = SLOTS[k], f = eqOf();

    if (s.fx && f[s.fx] && BY[f[s.fx]]) return BY[f[s.fx]];

    return s.old ? getShopItem(save.cosmetics.equipped[s.old]) : null;
}

function effTry(k) {
    const s = SLOTS[k];

    if (s.fx && fxTry[s.fx] && BY[fxTry[s.fx]]) return BY[fxTry[s.fx]];

    return s.old ? getShopItem(tryOn[s.old]) : null;
}

function diffs() {
    return SLOT_KEYS
        .map(k => ({ k, it: effTry(k) }))
        .filter(d => d.it && d.it.id !== ((effEquipped(d.k) || {}).id || ""));
}

function resetTry() {
    tryOn = { ...save.cosmetics.equipped };
    fxTry = { ...eqOf() };
}

// ---------- aksi ----------
function tryE(e) {
    const s = SLOTS[e.k];

    if (e.fx) {
        fxTry[s.fx] = e.item.id;
    } else {
        tryOn[s.old] = e.item.id;
        if (s.fx) delete fxTry[s.fx];
    }

    playTone(600, 0.06);
    renderShop();
}

function addOwned(e) {
    if (e.fx) ensure().owned.push(e.item.id);
    else save.cosmetics.owned.push(e.item.id);
}

function applyEquip(e) {
    const s = SLOTS[e.k];

    if (e.fx) {
        eqOf()[s.fx] = e.item.id;
    } else {
        save.cosmetics.equipped[s.old] = e.item.id;
        if (s.fx) delete eqOf()[s.fx];
    }
}

function buyE(e) {
    if (ownedE(e)) return;

    if (save.coins < e.item.price) {
        showToast("Koin kurang! Harga " + e.item.price + ", koinmu " + save.coins);
        tryE(e);
        playTone(150);
        return;
    }

    save.coins -= e.item.price;
    addOwned(e);

    saveData();
    updateDashboard();

    playTone(850);
    showToast(e.item.name + " dibeli & masuk VAULT!");

    renderShop();
}

function equipE(e) {
    if (!ownedE(e)) return;

    applyEquip(e);
    resetTry();

    saveData();
    updateDashboard();

    playTone(700);
    renderShop();
}

function unequipE(e) {
    const s = SLOTS[e.k];

    if (e.fx) {
        delete eqOf()[s.fx];
    } else {
        save.cosmetics.equipped[s.old] = DEFAULT_EQUIPPED[s.old];
    }

    resetTry();

    saveData();
    updateDashboard();

    playTone(500);
    renderShop();
}

function wearAll() {
    const d = diffs();

    if (!d.length) return;

    let cost = 0;

    d.forEach(x => {
        const e = mkEntry(x.it);
        if (!ownedE(e)) cost += x.it.price;
    });

    if (cost > save.coins) {
        showToast("Koin kurang " + (cost - save.coins) + " untuk beli semua item coba");
        playTone(150);
        return;
    }

    d.forEach(x => {
        const e = mkEntry(x.it);

        if (!ownedE(e)) addOwned(e);
        applyEquip(e);
    });

    save.coins -= cost;
    resetTry();

    saveData();
    updateDashboard();

    playTone(850);
    showToast(cost > 0 ? "Semua item dibeli & dipakai! (-" + cost + " koin)" : "Semua item dipakai!");

    renderShop();
}

function switchChar(g) {
    if (save.char === g) return;

    save.char = g;

    saveData();
    resetTry();

    playTone(700);
    showToast("Karakter: " + g.toUpperCase());

    updateDashboard();
    renderShop();
}

function setMode(m) {
    hubMode = m;
    resetTry();

    playTone(650, 0.06);
    renderShop();
}

$("pq2ModeShop").onclick = () => setMode("shop");
$("pq2ModeVault").onclick = () => setMode("vault");

// ---------- tampilan ----------
function thumb(ids, fx) {
    const cv = document.createElement("canvas");

    cv.width = 64;
    cv.height = 90;

    const c = cv.getContext("2d");
    c.imageSmoothingEnabled = false;

    withPO({ char: save.char, eq: fx }, () => {
        drawCharacter(c, 8, 15, 3, buildOutfit(ids, { facing: 1 }));
    });

    return cv;
}

function renderChars(F) {
    const box = $("pq2Chars");

    box.innerHTML = "";

    ["male", "female"].forEach(g => {
        const b = document.createElement("button");

        b.className = "pq2-char" + (save.char === g ? " sel" : "");

        const cv = document.createElement("canvas");

        cv.width = 64;
        cv.height = 90;

        const c = cv.getContext("2d");
        c.imageSmoothingEnabled = false;

        withPO({ char: g, eq: F.equipped[g] }, () => {
            drawCharacter(c, 8, 15, 3, buildOutfit(save.cosmetics.equipped, { facing: 1 }));
        });

        const sp = document.createElement("span");
        sp.innerHTML = (g === "male" ? FA("mars") + " MALE" : FA("venus") + " FEMALE");

        b.append(cv, sp);
        b.onclick = () => switchChar(g);

        box.appendChild(b);
    });
}

function listFor(k) {
    const s = SLOTS[k], gc = genderCode();
    let list = [];

    if (s.old) {
        (SHOP_ITEMS[s.old] || []).forEach(it => list.push({ item: it, fx: false, k }));
    }

    if (s.fx) {
        ITEMS.filter(i => i.g === gc && i.cat === s.fx)
            .forEach(it => list.push({ item: it, fx: true, k }));
    }

    return list.sort((a, b) => a.item.price - b.item.price);
}

function renderGrid() {
    const grid = $("shopGrid");
    const vault = hubMode === "vault";
    const k = SLOTS[currentShopCategory] ? currentShopCategory : "shirt";

    grid.innerHTML = "";

    let list = listFor(k);

    if (vault) {
        list = list.filter(e => ownedE(e) && !/_none$/.test(e.item.id));
    }

    if (!list.length) {
        const p = document.createElement("p");

        p.style.gridColumn = "1 / -1";
        p.textContent = vault
            ? "Belum ada item di kategori ini. Beli dulu di mode TOKO."
            : "Tidak ada item.";

        grid.appendChild(p);
        return;
    }

    list.forEach(e => {
        const it = e.item;
        const s = SLOTS[k];
        const owned = ownedE(e);
        const worn = wornE(e);
        const tried = effTry(k);
        const trying = !vault && tried && tried.id === it.id && !worn;
        const isDefault = !e.fx && DEFAULT_EQUIPPED[s.old] === it.id;

        const card = document.createElement("div");

        card.className = "shop-item" + (worn ? " wearing" : "") + (trying ? " trying" : "");

        const tag = document.createElement("span");
        tag.className = "pq2-tag";

        if (worn) { tag.textContent = "EQUIPPED"; tag.style.background = "#318b58"; }
        else if (owned) { tag.textContent = "OWNED"; tag.style.background = "#526a84"; }
        else if (save.coins < it.price) { tag.innerHTML = FA("lock") + " LOCKED"; tag.style.background = "#8a3a3a"; }
        else { tag.textContent = "TERSEDIA"; tag.style.background = "#3d8fe0"; }

        card.appendChild(tag);

        if (trying) {
            const tt = document.createElement("span");
            tt.className = "try-tag";
            tt.textContent = "COBA";
            card.appendChild(tt);
        }

        // gambar thumbnail: karakter memakai item ini
        const base = vault
            ? { ids: save.cosmetics.equipped, fx: eqOf() }
            : { ids: tryOn, fx: fxTry };

        const ids = { ...base.ids };
        const fx = { ...base.fx };

        if (e.fx) {
            fx[s.fx] = it.id;
        } else {
            ids[s.old] = it.id;
            if (s.fx) delete fx[s.fx];
        }

        const tb = document.createElement("div");
        tb.className = "item-thumb";
        tb.appendChild(thumb(ids, fx));

        const h = document.createElement("h4");
        h.textContent = it.name;

        const p = document.createElement("p");
        p.innerHTML = owned ? "DIMILIKI" : (it.price === 0 ? "FREE" : COIN + " " + it.price);

        const row = document.createElement("div");
        row.className = "pq2-row";

        const actBtn = () => {
            const b = document.createElement("button");

            if (worn && isDefault) {
                b.textContent = "DIPAKAI";
                b.className = "equipped";
                b.disabled = true;
            } else if (worn) {
                b.textContent = "UNEQUIP";
                b.className = "owned";
                b.onclick = ev => { ev.stopPropagation(); unequipE(e); };
            } else if (owned) {
                b.textContent = "EQUIP";
                b.className = "owned";
                b.onclick = ev => { ev.stopPropagation(); equipE(e); };
            } else {
                b.textContent = "BELI";
                b.onclick = ev => { ev.stopPropagation(); buyE(e); };
            }

            return b;
        };

        if (!vault) {
            const pv = document.createElement("button");
            pv.className = "owned";
            pv.innerHTML = FA("eye") + " PREVIEW";
            pv.onclick = ev => { ev.stopPropagation(); tryE(e); };

            row.append(pv, actBtn());

            card.onclick = () => tryE(e);
        } else {
            row.appendChild(actBtn());
        }

        card.append(tb, h, p, row);
        grid.appendChild(card);
    });
}

// Pembungkus renderShop lama: render bawaan tetap jalan, lalu grid diganti versi terpadu
const prevShop = renderShop;

renderShop = function () {
    prevShop();

    if (currentScreen !== "shop") return;

    const F = ensure();
    const vault = hubMode === "vault";

    $("pq2ModeShop").classList.toggle("active", !vault);
    $("pq2ModeVault").classList.toggle("active", vault);

    const h2 = document.querySelector("#shopScreen .shop-header h2");
    if (h2) h2.textContent = vault ? "VAULT" : "CHARACTER SHOP";

    const sub = document.querySelector("#shopScreen .shop-header p");
    if (sub) {
        sub.textContent = vault
            ? "Koleksi " + save.char.toUpperCase() + " · EQUIP / UNEQUIP kapan saja"
            : "Karakter " + save.char.toUpperCase() + " · Klik item untuk COBA dulu, baru beli";
    }

    renderChars(F);
    renderGrid();

    // status & tombol preview
    const status = $("tryStatus");
    const d = vault ? [] : diffs();

    if (d.length) {
        let cost = 0;

        d.forEach(x => {
            const e = mkEntry(x.it);
            if (!ownedE(e)) cost += x.it.price;
        });

        status.innerHTML = FA("eye") + " MODE COBA - belum dipakai di game";
        status.classList.add("trying");

        toggleHidden("resetTryBtn", false);
        toggleHidden("wearAllBtn", false);

        $("wearAllBtn").innerHTML = cost > 0
            ? "BELI &amp; PAKAI SEMUA " + COIN + " " + cost
            : "PAKAI SEMUA";
    } else {
        if (vault) {
            const gc = genderCode();
            const n = SLOT_KEYS.reduce((a, k) => a + listFor(k).filter(e => ownedE(e) && !/_none$/.test(e.item.id)).length, 0);

            status.textContent = "VAULT · " + n + " ITEM";
        } else {
            status.textContent = "SEDANG DIPAKAI";
        }

        status.classList.remove("trying");

        toggleHidden("resetTryBtn", true);
        toggleHidden("wearAllBtn", true);
    }
};

$("resetTryBtn").onclick = () => {
    resetTry();
    renderShop();
};

$("wearAllBtn").onclick = wearAll;

// Buka Character Shop (mode toko)
const oldOpenShop = $("openShop").onclick;

$("openShop").onclick = () => {
    hubMode = "shop";
    sanitize();
    fxTry = { ...eqOf() };
    oldOpenShop();
};

// Pintasan VAULT di dashboard = Character Shop mode Vault
$("openVault").onclick = () => {
    hubMode = "vault";
    sanitize();

    currentShopCategory = "shirt";
    resetTry();

    showScreen("shop");
};

// ==================================================
// LOGOUT (tidak menghapus akun, koin, item, atau progres)
// ==================================================
$("logoutBtn").onclick = () => {
    if (!confirm("Logout dari akun ini? Akun, koin, item, dan progres TIDAK dihapus.")) return;

    // memakai fungsi logout bawaan lewat tombol di panel profil
    $("editName").click();

    const b = $("pqLog");
    if (b) b.click();
};

// ==================================================
// GANTI EMOJI -> IKON FONT AWESOME (seluruh halaman, termasuk teks dari game.js / upgrade.js)
// ==================================================
const EMO = {
    "\u{1FA99}": "coins",
    "\u{1F512}": "lock",
    "\u{1F381}": "gift",
    "\u{1F4E6}": "box",
    "\u{1F6CD}": "bag-shopping",
    "\u{1F5C4}": "vault",
    "\u{1F441}": "eye",
    "\u{1F6B6}": "person-walking",
    "\u{1F50A}": "volume-high",
    "\u{1F457}": "shirt",
    "\u2714": "check"
};

const EMO_SPLIT = /(\u{1FA99}|\u{1F512}|\u{1F381}|\u{1F4E6}|\u{1F6CD}|\u{1F5C4}|\u{1F441}|\u{1F6B6}|\u{1F50A}|\u{1F457}|\u2714)\uFE0F?/u;
const EMO_TEST = /[\u{1FA99}\u{1F512}\u{1F381}\u{1F4E6}\u{1F6CD}\u{1F5C4}\u{1F441}\u{1F6B6}\u{1F50A}\u{1F457}\u2714]/u;

function iconizeNode(root) {
    if (!root) return;

    if (root.nodeType === 3) {
        fixText(root);
        return;
    }

    if (root.nodeType !== 1) return;

    const tag = root.tagName;
    if (tag === "SCRIPT" || tag === "STYLE" || tag === "TEXTAREA" || tag === "INPUT") return;

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const list = [];

    while (walker.nextNode()) {
        const n = walker.currentNode;
        const pt = n.parentNode && n.parentNode.tagName;

        if (pt !== "SCRIPT" && pt !== "STYLE" && pt !== "TEXTAREA" && EMO_TEST.test(n.nodeValue)) {
            list.push(n);
        }
    }

    list.forEach(fixText);
}

function fixText(node) {
    const txt = node.nodeValue;

    if (!txt || !EMO_TEST.test(txt) || !node.parentNode) return;

    const parts = txt.split(EMO_SPLIT);
    const frag = document.createDocumentFragment();

    parts.forEach((p, i) => {
        if (i % 2 === 1) {
            const ic = document.createElement("i");
            ic.className = "fa-solid fa-" + (EMO[p] || "circle");
            frag.appendChild(ic);
        } else if (p) {
            frag.appendChild(document.createTextNode(p));
        }
    });

    node.parentNode.replaceChild(frag, node);
}

const emoObserver = new MutationObserver(muts => {
    muts.forEach(m => {
        if (m.type === "childList") {
            m.addedNodes.forEach(iconizeNode);
        } else if (m.type === "characterData") {
            fixText(m.target);
        }
    });

    // buang catatan perubahan yang dibuat oleh penggantian ini sendiri
    emoObserver.takeRecords();
});

emoObserver.observe(document.body, { childList: true, subtree: true, characterData: true });

iconizeNode(document.body);

// Tampilkan ulang shop dengan data yang sudah siap
if (currentScreen === "shop") renderShop();

})();