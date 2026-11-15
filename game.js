"use strict";

// ==================================================
// PIXEL QUEST - FULL FIX 15 LEVEL + CHARACTER SHOP v2
// ==================================================

const $ = id => document.getElementById(id);

const canvas = $("gameCanvas");

if (!canvas) {
    throw new Error("Elemen gameCanvas tidak ditemukan di index.html");
}

const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

let W = canvas.width;
const H = canvas.height;

// ==================================================
// GAME VARIABLES
// ==================================================

let currentScreen = "dashboard";
let currentLevel = 1;

let worldWidth = 2600;
let finishX = 2500;
let cameraX = 0;

let score = 0;
let lives = 3;
let frame = 0;

let paused = false;
let gameOver = false;
let levelDone = false;

let platforms = [];
let coins = [];
let enemies = [];
let currentPits = [];
let checkpoints = [];
let particles = [];

let checkpoint = 40;
let deaths = 0;
let collectedCoins = 0;
let shake = 0;

let audio = null;
let musicTimer = null;

let previousPlayerBottom = 0;
let previousPlayerVy = 0;

let coyote = 0;
let jumpBuffer = 0;

const GRAVITY = 0.34;
const MAX_FALL_SPEED = 8;

const player = {
    x: 40,
    y: 180,
    w: 16,
    h: 23,
    vx: 0,
    vy: 0,
    speed: 2.6,
    jump: -8.2,
    grounded: false,
    facing: 1,
    invincible: 0
};

const input = {
    left: false,
    right: false,
    jump: false
};

function pressJump() {
    if (!input.jump) jumpBuffer = 8;
    input.jump = true;
}

// ==================================================
// CHARACTER SHOP DATA
// ==================================================

const SKIN_COLORS = [
    { color: "#ffd9b8", name: "Cerah" },
    { color: "#f4bd8b", name: "Normal" },
    { color: "#e8a875", name: "Sawo Muda" },
    { color: "#c98758", name: "Sawo" },
    { color: "#a96d48", name: "Coklat" },
    { color: "#8f583d", name: "Coklat Tua" },
    { color: "#6b4230", name: "Gelap" },
    { color: "#4a2e22", name: "Sangat Gelap" },
    { color: "#2b1d17", name: "Hitam" },
    { color: "#141414", name: "Hitam Pekat" },
    { color: "#7ed957", name: "Zombie" },
    { color: "#6ec6ff", name: "Biru" },
    { color: "#c9a7ff", name: "Ungu" },
    { color: "#ff9ec7", name: "Pink" }
];

const HAIR_COLORS = [
    { color: "#493020", name: "Coklat" },
    { color: "#1b1b1b", name: "Hitam" },
    { color: "#e8c15c", name: "Pirang" },
    { color: "#d94343", name: "Merah" },
    { color: "#f2f2f2", name: "Putih" },
    { color: "#3278d4", name: "Biru" },
    { color: "#8952c7", name: "Ungu" },
    { color: "#29965c", name: "Hijau" },
    { color: "#e97940", name: "Oranye" }
];

const CATEGORIES = ["shirt", "pants", "hat", "mask", "shoes", "cape"];

const DEFAULT_EQUIPPED = {
    shirt: "shirt_blue",
    pants: "pants_blue",
    hat: "hat_none",
    mask: "mask_none",
    shoes: "shoe_brown",
    cape: "cape_none"
};

const SHOP_ITEMS = {
    shirt: [
        { id: "shirt_blue",    name: "Classic Blue",  color: "#2864ba", price: 0,   style: "plain" },
        { id: "shirt_red",     name: "Red Warrior",   color: "#d94343", price: 100, style: "stripe" },
        { id: "shirt_green",   name: "Forest Hero",   color: "#29965c", price: 150, style: "plain" },
        { id: "shirt_white",   name: "Snow Tee",      color: "#e8eef5", price: 150, style: "plain" },
        { id: "shirt_purple",  name: "Purple Knight", color: "#8952c7", price: 200, style: "trim" },
        { id: "shirt_black",   name: "Dark Shadow",   color: "#292d38", price: 250, style: "plain" },
        { id: "shirt_gold",    name: "Golden Hero",   color: "#e8ad32", price: 350, style: "trim" },
        { id: "shirt_rainbow", name: "Rainbow Tee",   color: "#f2f2f2", price: 500, style: "rainbow" }
    ],

    pants: [
        { id: "pants_blue",   name: "Classic Pants", color: "#293d72", price: 0 },
        { id: "pants_black",  name: "Black Pants",   color: "#252525", price: 100 },
        { id: "pants_red",    name: "Red Pants",     color: "#a83232", price: 150 },
        { id: "pants_white",  name: "Snow Pants",    color: "#d7dde6", price: 150 },
        { id: "pants_purple", name: "Purple Pants",  color: "#6a3c9a", price: 180 },
        { id: "pants_green",  name: "Green Pants",   color: "#28784b", price: 200 },
        { id: "pants_gold",   name: "Gold Pants",    color: "#d6a52e", price: 250 }
    ],

    hat: [
        { id: "hat_none",   name: "No Hat",       color: "transparent", price: 0,   style: "none" },
        { id: "hat_band",   name: "Red Headband", color: "#d94343",     price: 100, style: "band" },
        { id: "hat_red",    name: "Red Cap",      color: "#e94c38",     price: 100, style: "cap" },
        { id: "hat_blue",   name: "Blue Cap",     color: "#3278d4",     price: 150, style: "cap" },
        { id: "hat_black",  name: "Dark Hood",    color: "#292d38",     price: 250, style: "hood" },
        { id: "hat_top",    name: "Top Hat",      color: "#1f2230",     price: 280, style: "top" },
        { id: "hat_gold",   name: "Golden Crown", color: "#f5c842",     price: 300, style: "crown" },
        { id: "hat_helmet", name: "Knight Helm",  color: "#aab4c3",     price: 350, style: "helmet" },
        { id: "hat_wizard", name: "Wizard Hat",   color: "#5a3fa6",     price: 400, style: "wizard" }
    ],

    mask: [
        { id: "mask_none",   name: "No Mask",      color: "transparent", price: 0,   style: "none" },
        { id: "mask_red",    name: "Red Bandit",   color: "#d94343",     price: 100, style: "bandit" },
        { id: "mask_shades", name: "Cool Shades",  color: "#111111",     price: 150, style: "shades" },
        { id: "mask_stache", name: "Mustache",     color: "#3a2a1a",     price: 180, style: "stache" },
        { id: "mask_black",  name: "Ninja Mask",   color: "#252525",     price: 200, style: "ninja" },
        { id: "mask_blue",   name: "Blue Ninja",   color: "#3278d4",     price: 200, style: "ninja" },
        { id: "mask_gold",   name: "Gold Bandit",  color: "#e8ad32",     price: 300, style: "bandit" }
    ],

    shoes: [
        { id: "shoe_brown", name: "Brown Boots",   color: "#5a3a24", price: 0 },
        { id: "shoe_white", name: "White Sneaker", color: "#eef2f7", price: 100 },
        { id: "shoe_red",   name: "Red Sneaker",   color: "#d94343", price: 150 },
        { id: "shoe_blue",  name: "Blue Sneaker",  color: "#3278d4", price: 150 },
        { id: "shoe_black", name: "Black Boots",   color: "#202020", price: 150 },
        { id: "shoe_gold",  name: "Gold Boots",    color: "#e8ad32", price: 300 }
    ],

    cape: [
        { id: "cape_none",   name: "No Cape",     color: "transparent", price: 0 },
        { id: "cape_red",    name: "Hero Red",    color: "#d94343",     price: 200 },
        { id: "cape_blue",   name: "Royal Blue",  color: "#3278d4",     price: 200 },
        { id: "cape_purple", name: "Mystic",      color: "#8952c7",     price: 250 },
        { id: "cape_black",  name: "Night Cape",  color: "#252a36",     price: 250 },
        { id: "cape_gold",   name: "Golden Cape", color: "#e8ad32",     price: 400 }
    ]
};

let currentShopCategory = "shirt";

// ==================================================
// SAVE SYSTEM
// ==================================================

function getShopItem(id) {
    for (const category of Object.keys(SHOP_ITEMS)) {
        const item = SHOP_ITEMS[category].find(i => i.id === id);
        if (item) return item;
    }
    return null;
}

function loadSave() {
    const defaults = {
        name: "Player One",
        unlocked: 1,
        completed: [],
        stars: {},
        coins: 0,
        music: true,
        sound: true,

        cosmetics: {
            skinColor: "#f4bd8b",
            hairColor: "#493020",

            owned: Object.values(DEFAULT_EQUIPPED),

            equipped: { ...DEFAULT_EQUIPPED }
        }
    };

    try {
        const data = JSON.parse(
            localStorage.getItem("pixelQuestSave")
        );

        if (!data) return defaults;

        const oldCosmetics = data.cosmetics || {};

        const cosmetics = {
            ...defaults.cosmetics,
            ...oldCosmetics,

            owned: Array.isArray(oldCosmetics.owned)
                ? [...oldCosmetics.owned]
                : [...defaults.cosmetics.owned],

            equipped: {
                ...defaults.cosmetics.equipped,
                ...(oldCosmetics.equipped || {})
            }
        };

        // Item bawaan selalu dimiliki.
        Object.values(DEFAULT_EQUIPPED).forEach(id => {
            if (!cosmetics.owned.includes(id)) {
                cosmetics.owned.push(id);
            }
        });

        // Validasi item yang dipakai.
        CATEGORIES.forEach(cat => {
            const id = cosmetics.equipped[cat];

            if (
                !getShopItem(id) ||
                !cosmetics.owned.includes(id)
            ) {
                cosmetics.equipped[cat] = DEFAULT_EQUIPPED[cat];
            }
        });

        return {
            ...defaults,
            ...data,

            unlocked: Math.max(
                1,
                Math.min(15, Number(data.unlocked) || 1)
            ),

            coins: Math.max(0, Number(data.coins) || 0),

            completed: Array.isArray(data.completed)
                ? data.completed
                : [],

            stars: (data.stars && typeof data.stars === "object")
                ? data.stars
                : {},

            cosmetics
        };

    } catch (error) {
        console.warn("Save tidak dapat dibaca:", error);
        return defaults;
    }
}

let save = loadSave();

function saveData() {
    try {
        localStorage.setItem(
            "pixelQuestSave",
            JSON.stringify(save)
        );
    } catch (error) {
        console.warn("Save tidak dapat disimpan:", error);
    }
}

// Item yang sedang DICOBA di shop (belum tentu dimiliki).
let tryOn = { ...save.cosmetics.equipped };

let previewFacing = 1;
let previewWalk = false;

// ==================================================
// HELPER DOM
// ==================================================

function setText(id, value) {
    const element = $(id);
    if (element) element.textContent = value;
}

function addClass(id, className) {
    const element = $(id);
    if (element) element.classList.add(className);
}

function removeClass(id, className) {
    const element = $(id);
    if (element) element.classList.remove(className);
}

function toggleHidden(id, hidden) {
    const element = $(id);
    if (element) element.classList.toggle("hidden", hidden);
}

let toastTimer = null;

function showToast(message) {
    const toast = $("toast");

    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2200);
}

// ==================================================
// CHARACTER SPRITE (DIPAKAI GAME, DASHBOARD, SHOP)
// Semua tampilan karakter pakai fungsi yang sama,
// jadi preview == tampilan asli di game.
// ==================================================

function shade(hex, amount) {
    if (
        typeof hex !== "string" ||
        hex[0] !== "#" ||
        hex.length !== 7
    ) {
        return hex;
    }

    const n = parseInt(hex.slice(1), 16);

    const r = Math.max(0, Math.min(255, ((n >> 16) & 255) + amount));
    const g = Math.max(0, Math.min(255, ((n >> 8) & 255) + amount));
    const b = Math.max(0, Math.min(255, (n & 255) + amount));

    return "rgb(" + r + "," + g + "," + b + ")";
}

function luminance(hex) {
    if (
        typeof hex !== "string" ||
        hex[0] !== "#" ||
        hex.length !== 7
    ) {
        return 128;
    }

    const n = parseInt(hex.slice(1), 16);

    return (
        0.299 * ((n >> 16) & 255) +
        0.587 * ((n >> 8) & 255) +
        0.114 * (n & 255)
    );
}

function buildOutfit(ids, extra) {
    const cs = save.cosmetics;

    const outfit = {
        skin: cs.skinColor || "#f4bd8b",
        hair: cs.hairColor || "#493020",
        facing: 1,
        step: 0,
        air: false,
        moving: false
    };

    CATEGORIES.forEach(cat => {
        outfit[cat] =
            getShopItem(ids[cat]) ||
            getShopItem(DEFAULT_EQUIPPED[cat]);
    });

    return Object.assign(outfit, extra || {});
}

// Sprite 16 x 24 grid. (ox, oy) = pojok kiri atas, s = skala.
function drawCharacter(c, ox, oy, s, o) {
    const dir = o.facing < 0 ? -1 : 1;

    const R = (x, y, w, h, color) => {
        const px = dir > 0 ? x : 16 - x - w;

        c.fillStyle = color;

        c.fillRect(
            ox + px * s,
            oy + y * s,
            w * s,
            h * s
        );
    };

    const skin = o.skin;
    const hair = o.hair;

    const shirtC = o.shirt.color;
    const pantsC = o.pants.color;
    const shoeC = o.shoes.color;

    const air = !!o.air;
    const step = o.step || 0;
    const moving = !!o.moving;

    // ---------- JUBAH (di belakang badan) ----------
    if (o.cape && o.cape.id !== "cape_none") {
        const cc = o.cape.color;
        const sw = air ? 3 : (moving ? 2 : 0);

        R(1 - sw, 11, 3 + sw, 10, cc);
        R(1 - sw, 19, 3 + sw, 2, shade(cc, -35));
        R(1 - sw, 11, 1, 10, shade(cc, -18));
    }

    // ---------- LENGAN BELAKANG ----------
    const armY = air ? 10 : 12;

    R(1, armY, 2, 4, shade(shirtC, -35));
    R(1, armY + 4, 2, 2, shade(skin, -20));

    // ---------- KAKI + SEPATU ----------
    const backH = (step === 1 || air) ? 3 : 4;
    const frontH = step === 2 ? 3 : 4;

    R(3, 17, 4, backH, shade(pantsC, -20));
    R(9, 17, 4, frontH, pantsC);
    R(3, 17, 10, 2, pantsC);

    const backShoeY = 17 + backH;
    const frontShoeY = 17 + frontH;

    R(2, backShoeY, 5, 3, shade(shoeC, -25));
    R(2, backShoeY + 2, 5, 1, shade(shoeC, -60));

    R(9, frontShoeY, 6, 3, shoeC);
    R(9, frontShoeY + 2, 6, 1, shade(shoeC, -50));
    R(9, frontShoeY, 6, 1, shade(shoeC, 25));

    // ---------- BADAN ----------
    R(3, 11, 10, 6, shirtC);
    R(10, 11, 3, 6, shade(shirtC, -20));
    R(3, 11, 10, 1, shade(shirtC, 28));

    const style = o.shirt.style;

    if (style === "stripe") {
        R(3, 13, 10, 1, "rgba(255,255,255,.6)");
        R(3, 15, 10, 1, "rgba(255,255,255,.6)");
    } else if (style === "trim") {
        R(3, 11, 10, 1, "#f5c842");
        R(7, 12, 2, 4, "#f5c842");
    } else if (style === "rainbow") {
        const rainbow = [
            "#e94c38", "#f19a38", "#f5d842",
            "#4cbf64", "#3d8be0"
        ];

        rainbow.forEach((col, i) => {
            R(3, 12 + i, 10, 1, col);
        });
    }

    // sabuk
    R(3, 16, 10, 1, shade(pantsC, -45));
    R(7, 16, 2, 1, "#f5c842");

    // ---------- LENGAN DEPAN ----------
    R(13, armY, 2, 4, shirtC);
    R(13, armY, 2, 1, shade(shirtC, 28));
    R(13, armY + 4, 2, 2, skin);

    // ---------- KEPALA ----------
    R(3, 3, 10, 8, skin);
    R(3, 9, 10, 2, shade(skin, -12));

    // rambut
    R(3, 2, 10, 3, hair);
    R(3, 4, 2, 4, hair);
    R(11, 4, 2, 1, hair);
    R(5, 2, 4, 1, shade(hair, 35));

    // mata
    R(9, 6, 3, 2, "#ffffff");
    R(10, 6, 2, 2, "#161616");
    R(10, 6, 1, 1, "#ffffff");

    // alis
    R(9, 5, 3, 1, shade(hair, -10));

    // hidung & mulut
    R(12, 8, 1, 1, shade(skin, -25));

    const mouthColor =
        luminance(skin) < 70
            ? shade(skin, 60)
            : shade(skin, -50);

    R(9, 9, 3, 1, mouthColor);

    // ---------- TOPENG ----------
    const mask = o.mask;

    if (mask && mask.id !== "mask_none") {
        const mc = mask.color;

        if (mask.style === "ninja") {
            R(3, 4, 10, 2, mc);
            R(3, 8, 10, 3, mc);
            R(3, 8, 10, 1, shade(mc, 25));
            R(1, 4, 2, 2, mc);
        } else if (mask.style === "bandit") {
            R(3, 5, 10, 1, mc);
            R(3, 8, 10, 1, mc);
            R(3, 6, 6, 2, mc);
            R(12, 6, 1, 2, mc);
        } else if (mask.style === "shades") {
            R(3, 6, 5, 1, mc);
            R(8, 5, 5, 3, mc);
            R(9, 5, 1, 1, "#ffffff");
            R(11, 6, 1, 1, "#5a6b86");
        } else if (mask.style === "stache") {
            R(8, 8, 5, 2, mc);
            R(7, 9, 2, 1, mc);
        }
    }

    // ---------- TOPI ----------
    const hat = o.hat;

    if (hat && hat.id !== "hat_none") {
        const hc = hat.color;

        switch (hat.style) {
            case "cap":
                R(4, 0, 8, 2, hc);
                R(3, 1, 10, 3, hc);
                R(10, 3, 5, 1, shade(hc, -40));
                R(5, 0, 3, 1, shade(hc, 40));
                break;

            case "crown":
                R(3, 1, 10, 3, hc);
                R(3, -2, 2, 3, hc);
                R(7, -2, 2, 3, hc);
                R(11, -2, 2, 3, hc);
                R(3, 3, 10, 1, shade(hc, -45));
                R(7, 2, 2, 1, "#e94c38");
                R(4, 1, 1, 1, "#fff2a8");
                break;

            case "wizard":
                R(1, 2, 14, 2, hc);
                R(4, -1, 8, 3, hc);
                R(6, -4, 4, 3, hc);
                R(9, -5, 3, 2, hc);
                R(4, 1, 8, 1, "#f5c842");
                R(1, 3, 14, 1, shade(hc, -35));
                break;

            case "helmet":
                R(2, 0, 12, 4, hc);
                R(2, 4, 3, 4, hc);
                R(11, 3, 2, 4, shade(hc, -30));
                R(5, 1, 4, 1, shade(hc, 55));
                R(2, 3, 12, 1, shade(hc, -40));
                break;

            case "band":
                R(3, 3, 10, 2, hc);
                R(1, 4, 2, 1, hc);
                R(0, 5, 3, 2, hc);
                break;

            case "hood":
                R(2, 0, 12, 4, hc);
                R(2, 4, 3, 7, hc);
                R(12, 4, 1, 4, hc);
                R(3, 3, 10, 1, shade(hc, 25));
                break;

            case "top":
                R(2, 2, 12, 1, hc);
                R(4, -4, 8, 6, hc);
                R(4, 0, 8, 1, "#e94c38");
                R(5, -3, 1, 3, shade(hc, 45));
                break;
        }
    }
}

function drawThumb(cv, ids) {
    const c = cv.getContext("2d");

    c.imageSmoothingEnabled = false;
    c.clearRect(0, 0, cv.width, cv.height);

    drawCharacter(
        c, 8, 15, 3,
        buildOutfit(ids, { facing: 1 })
    );
}

// ==================================================
// SHOP
// ==================================================

function getEquippedItem(category) {
    return getShopItem(save.cosmetics.equipped[category]);
}

function isOwned(id) {
    return save.cosmetics.owned.includes(id);
}

function updateShopBalance() {
    setText("shopCoins", save.coins.toLocaleString("id-ID"));
    setText("totalCoins", save.coins.toLocaleString("id-ID"));
}

function renderColorList(containerId, list, key) {
    const container = $(containerId);

    if (!container) return;

    container.innerHTML = "";

    list.forEach(entry => {
        const button = document.createElement("button");

        button.className = "color-choice";

        if (save.cosmetics[key] === entry.color) {
            button.classList.add("selected");
        }

        button.style.background = entry.color;
        button.title = entry.name;

        button.onclick = () => {
            save.cosmetics[key] = entry.color;

            saveData();

            renderColorList(containerId, list, key);
            renderShop();

            playTone(650);
        };

        container.appendChild(button);
    });
}

function renderSkinColors() {
    renderColorList("colorList", SKIN_COLORS, "skinColor");
}

function renderHairColors() {
    renderColorList("hairList", HAIR_COLORS, "hairColor");
}

function getTryDifferences() {
    return CATEGORIES.filter(
        cat => tryOn[cat] !== save.cosmetics.equipped[cat]
    );
}

function updateTryUI() {
    const diff = getTryDifferences();
    const status = $("tryStatus");

    if (!status) return;

    if (diff.length === 0) {
        status.textContent = "SEDANG DIPAKAI";
        status.classList.remove("trying");

        toggleHidden("resetTryBtn", true);
        toggleHidden("wearAllBtn", true);

        return;
    }

    status.textContent = "👁 MODE COBA - belum dipakai di game";
    status.classList.add("trying");

    toggleHidden("resetTryBtn", false);
    toggleHidden("wearAllBtn", false);

    let cost = 0;

    diff.forEach(cat => {
        const item = getShopItem(tryOn[cat]);

        if (item && !isOwned(item.id)) cost += item.price;
    });

    const btn = $("wearAllBtn");

    if (btn) {
        btn.textContent = cost > 0
            ? "BELI & PAKAI SEMUA 🪙 " + cost
            : "PAKAI SEMUA";
    }
}

function renderShop() {
    updateShopBalance();
    renderSkinColors();
    renderHairColors();
    updateTryUI();

    const grid = $("shopGrid");

    if (!grid) return;

    grid.innerHTML = "";

    const items = SHOP_ITEMS[currentShopCategory] || [];

    document.querySelectorAll(".shop-tab").forEach(tab => {
        tab.classList.toggle(
            "active",
            tab.dataset.category === currentShopCategory
        );
    });

    items.forEach(item => {
        const owned = isOwned(item.id);

        const equipped =
            save.cosmetics.equipped[currentShopCategory] === item.id;

        const trying =
            tryOn[currentShopCategory] === item.id && !equipped;

        const card = document.createElement("div");

        card.className = "shop-item";

        if (equipped) card.classList.add("wearing");
        if (trying) card.classList.add("trying");

        if (trying) {
            const tag = document.createElement("span");
            tag.className = "try-tag";
            tag.textContent = "COBA";
            card.appendChild(tag);
        }

        const thumbBox = document.createElement("div");
        thumbBox.className = "item-thumb";

        const thumb = document.createElement("canvas");
        thumb.width = 64;
        thumb.height = 90;

        thumbBox.appendChild(thumb);

        drawThumb(thumb, {
            ...tryOn,
            [currentShopCategory]: item.id
        });

        const name = document.createElement("h4");
        name.textContent = item.name;

        const price = document.createElement("p");

        price.textContent = item.price === 0
            ? "FREE"
            : (owned ? "DIMILIKI" : "🪙 " + item.price);

        const button = document.createElement("button");

        if (equipped) {
            button.textContent = "EQUIPPED";
            button.classList.add("equipped");
            button.disabled = true;

        } else if (owned) {
            button.textContent = "EQUIP";
            button.classList.add("owned");

        } else {
            button.textContent = "BUY";
        }

        button.onclick = e => {
            e.stopPropagation();
            buyOrEquipItem(item);
        };

        // Klik kartu = COBA dulu tanpa beli
        card.onclick = () => {
            tryOn[currentShopCategory] = item.id;

            playTone(600, 0.06);
            renderShop();
        };

        card.append(thumbBox, name, price, button);

        grid.appendChild(card);
    });
}

function buyOrEquipItem(item) {
    if (!item) return;

    const category = CATEGORIES.find(
        cat => SHOP_ITEMS[cat].some(i => i.id === item.id)
    );

    if (!category) return;

    if (!isOwned(item.id)) {
        if (save.coins < item.price) {
            showToast(
                "Koin belum cukup! Harga " + item.price +
                ", koinmu " + save.coins
            );

            tryOn[category] = item.id;

            playTone(150);
            renderShop();

            return;
        }

        save.coins -= item.price;
        save.cosmetics.owned.push(item.id);

        showToast("Berhasil beli " + item.name + "!");

        playTone(850);

    } else {
        playTone(700);
    }

    save.cosmetics.equipped[category] = item.id;
    tryOn[category] = item.id;

    saveData();

    renderShop();
    updateDashboard();
}

function wearAllTrying() {
    const diff = getTryDifferences();

    if (diff.length === 0) return;

    let cost = 0;

    diff.forEach(cat => {
        const item = getShopItem(tryOn[cat]);

        if (item && !isOwned(item.id)) cost += item.price;
    });

    if (cost > save.coins) {
        showToast(
            "Koin kurang " + (cost - save.coins) +
            " untuk beli semua item coba"
        );

        playTone(150);
        return;
    }

    diff.forEach(cat => {
        const item = getShopItem(tryOn[cat]);

        if (!item) return;

        if (!isOwned(item.id)) {
            save.cosmetics.owned.push(item.id);
        }

        save.cosmetics.equipped[cat] = item.id;
    });

    save.coins -= cost;

    saveData();

    playTone(850);

    showToast(
        cost > 0
            ? "Semua item dibeli & dipakai! (-" + cost + " koin)"
            : "Semua item dipakai!"
    );

    renderShop();
    updateDashboard();
}

function openCharacterShop() {
    currentShopCategory = "shirt";

    tryOn = { ...save.cosmetics.equipped };

    showScreen("shop");
}

if ($("openShop")) {
    $("openShop").onclick = openCharacterShop;
}

if ($("shopBack")) {
    $("shopBack").onclick = () => {
        showScreen("dashboard");
    };
}

if ($("rotateBtn")) {
    $("rotateBtn").onclick = () => {
        previewFacing *= -1;
    };
}

if ($("walkBtn")) {
    $("walkBtn").onclick = () => {
        previewWalk = !previewWalk;

        $("walkBtn").classList.toggle("active", previewWalk);
    };
}

if ($("resetTryBtn")) {
    $("resetTryBtn").onclick = () => {
        tryOn = { ...save.cosmetics.equipped };

        renderShop();
    };
}

if ($("wearAllBtn")) {
    $("wearAllBtn").onclick = wearAllTrying;
}

document.querySelectorAll(".shop-tab").forEach(tab => {
    tab.addEventListener("click", () => {
        currentShopCategory = tab.dataset.category;

        renderShop();
    });
});

// ==================================================
// PREVIEW CANVAS (SHOP + DASHBOARD HERO)
// ==================================================

const previewCanvas = $("previewCanvas");
const heroCanvas = $("heroCanvas");

const pctx = previewCanvas ? previewCanvas.getContext("2d") : null;
const hctx = heroCanvas ? heroCanvas.getContext("2d") : null;

if (pctx) pctx.imageSmoothingEnabled = false;
if (hctx) hctx.imageSmoothingEnabled = false;

function renderPreviews() {
    if (currentScreen === "shop" && pctx) {
        pctx.clearRect(0, 0, 160, 220);

        pctx.fillStyle = "rgba(0,0,0,.3)";
        pctx.beginPath();
        pctx.ellipse(80, 214, 38, 6, 0, 0, Math.PI * 2);
        pctx.fill();

        const step = previewWalk
            ? (Math.floor(frame / 8) % 2) + 1
            : 0;

        const bob = previewWalk
            ? 0
            : Math.round(Math.sin(frame * 0.08) * 2);

        drawCharacter(
            pctx, 24, 44 + bob, 7,
            buildOutfit(tryOn, {
                facing: previewFacing,
                step,
                moving: previewWalk
            })
        );
    }

    if (currentScreen === "dashboard" && hctx) {
        hctx.clearRect(0, 0, 72, 100);

        hctx.fillStyle = "rgba(0,0,0,.25)";
        hctx.beginPath();
        hctx.ellipse(36, 93, 20, 4, 0, 0, Math.PI * 2);
        hctx.fill();

        drawCharacter(
            hctx, 12, 16, 3,
            buildOutfit(save.cosmetics.equipped, { facing: 1 })
        );
    }
}

// ==================================================
// SCREEN SYSTEM
// ==================================================

function showScreen(name) {
    currentScreen = name;

    toggleHidden("dashboard", name !== "dashboard");
    toggleHidden("levelScreen", name !== "levels");
    toggleHidden("shopScreen", name !== "shop");
    toggleHidden("gameScreen", name !== "game");

    if (name !== "game") {
        stopMusic();
    }

    if (name === "dashboard") {
        updateDashboard();
    }

    if (name === "levels") {
        renderLevels();
    }

    if (name === "shop") {
        renderShop();
    }
}

// ==================================================
// DASHBOARD
// ==================================================

function updateDashboard() {
    setText("playerName", save.name);

    setText(
        "avatar",
        save.name.charAt(0).toUpperCase()
    );

    setText(
        "highestLevel",
        String(save.unlocked).padStart(2, "0") + " / 15"
    );

    setText(
        "totalCoins",
        save.coins.toLocaleString("id-ID")
    );

    let rank = "BEGINNER ADVENTURER";

    if (save.completed.length >= 15) {
        rank = "LEGEND ADVENTURER";
    } else if (save.completed.length >= 10) {
        rank = "MASTER ADVENTURER";
    } else if (save.completed.length >= 5) {
        rank = "PRO ADVENTURER";
    }

    setText("playerRank", rank);

    const musicBtn = $("musicBtn");
    const soundBtn = $("soundBtn");

    if (musicBtn) {
        musicBtn.classList.toggle("off", !save.music);
    }

    if (soundBtn) {
        soundBtn.classList.toggle("off", !save.sound);
    }
}

if ($("playBtn")) {
    $("playBtn").onclick = () => {
        showScreen("levels");
    };
}

if ($("continueBtn")) {
    $("continueBtn").onclick = () => {
        startLevel(save.unlocked);
    };
}

if ($("backDashboard")) {
    $("backDashboard").onclick = () => {
        showScreen("dashboard");
    };
}

// ==================================================
// PROFILE
// ==================================================

if ($("editName")) {
    $("editName").onclick = () => {
        if (!$("nameInput") || !$("nameModal")) return;

        $("nameInput").value = save.name;
        $("nameModal").classList.remove("hidden");
    };
}

if ($("saveName")) {
    $("saveName").onclick = () => {
        if (!$("nameInput")) return;

        const name = $("nameInput").value.trim();

        if (name.length < 2) {
            showToast("Nama minimal 2 karakter!");
            return;
        }

        save.name = name.slice(0, 16);

        saveData();

        toggleHidden("nameModal", true);
        updateDashboard();
    };
}

if ($("cancelName")) {
    $("cancelName").onclick = () => {
        toggleHidden("nameModal", true);
    };
}

if ($("nameInput")) {
    $("nameInput").addEventListener("keydown", e => {
        e.stopPropagation();

        if (e.key === "Enter" && $("saveName")) {
            $("saveName").click();
        }
    });

    $("nameInput").addEventListener("keyup", e => {
        e.stopPropagation();
    });
}

// ==================================================
// AUDIO SYSTEM
// ==================================================

function getAudio() {
    if (!audio) {
        const AudioContext =
            window.AudioContext ||
            window.webkitAudioContext;

        if (!AudioContext) return null;

        audio = new AudioContext();
    }

    if (audio.state === "suspended") {
        audio.resume();
    }

    return audio;
}

function playTone(freq, duration = 0.1) {
    if (!save.sound) return;

    const a = getAudio();
    if (!a) return;

    const oscillator = a.createOscillator();
    const gain = a.createGain();

    oscillator.type = "square";
    oscillator.frequency.value = freq;

    gain.gain.setValueAtTime(0.05, a.currentTime);

    gain.gain.exponentialRampToValueAtTime(
        0.001,
        a.currentTime + duration
    );

    oscillator.connect(gain);
    gain.connect(a.destination);

    oscillator.start();
    oscillator.stop(a.currentTime + duration);
}

function playMusicTone(freq) {
    if (!save.music) return;

    const a = getAudio();
    if (!a) return;

    const oscillator = a.createOscillator();
    const gain = a.createGain();

    oscillator.type = "triangle";
    oscillator.frequency.value = freq;

    gain.gain.setValueAtTime(0.018, a.currentTime);

    gain.gain.exponentialRampToValueAtTime(
        0.001,
        a.currentTime + 0.18
    );

    oscillator.connect(gain);
    gain.connect(a.destination);

    oscillator.start();
    oscillator.stop(a.currentTime + 0.18);
}

function stopMusic() {
    if (musicTimer) {
        clearInterval(musicTimer);
        musicTimer = null;
    }
}

function startMusic() {
    stopMusic();

    if (!save.music || paused || currentScreen !== "game") {
        return;
    }

    const notes = [
        523, 659, 784, 659,
        587, 698, 880, 698
    ];

    let index = 0;

    musicTimer = setInterval(() => {
        if (paused || currentScreen !== "game") return;

        playMusicTone(notes[index % notes.length]);
        index++;
    }, 250);
}

if ($("musicBtn")) {
    $("musicBtn").onclick = () => {
        save.music = !save.music;

        saveData();
        updateDashboard();

        if (currentScreen === "game") {
            save.music ? startMusic() : stopMusic();
        }
    };
}

if ($("soundBtn")) {
    $("soundBtn").onclick = () => {
        save.sound = !save.sound;

        saveData();
        updateDashboard();

        if (save.sound) playTone(700);
    };
}

// ==================================================
// 15 LEVEL MAP DATA
// ==================================================

const LEVEL_MAPS = [

    {
        name: "GREEN LAND",
        theme: 0,
        pits: [[650, 710], [1350, 1410]],
        platforms: [
            [250, 195, 100],
            [470, 170, 100],
            [850, 195, 110],
            [1100, 165, 100],
            [1550, 190, 110],
            [1850, 165, 100]
        ],
        enemies: [400, 950, 1750]
    },

    {
        name: "LONG JUMP",
        theme: 1,
        pits: [[400, 470], [1050, 1130], [1800, 1880]],
        platforms: [
            [260, 185, 100],
            [500, 165, 90],
            [750, 195, 110],
            [1200, 170, 100],
            [1500, 145, 100],
            [1950, 185, 110],
            [2200, 155, 100]
        ],
        enemies: [600, 1300, 2100]
    },

    {
        name: "HIGH STEPS",
        theme: 2,
        pits: [[800, 870], [1600, 1670]],
        platforms: [
            [180, 205, 100],
            [350, 175, 100],
            [520, 145, 100],
            [900, 190, 100],
            [1080, 155, 100],
            [1260, 120, 100],
            [1750, 190, 100],
            [1950, 155, 100],
            [2150, 125, 100]
        ],
        enemies: [650, 1150, 2050]
    },

    {
        name: "BROKEN GROUND",
        theme: 3,
        pits: [
            [300, 365],
            [620, 690],
            [1000, 1070],
            [1450, 1520],
            [1900, 1970]
        ],
        platforms: [
            [365, 190, 100],
            [690, 170, 100],
            [1070, 190, 100],
            [1520, 165, 100],
            [1970, 185, 100],
            [2150, 150, 100]
        ],
        enemies: [500, 850, 1250, 1750, 2150]
    },

    {
        name: "SKY BRIDGE",
        theme: 4,
        pits: [[700, 780], [1450, 1530]],
        platforms: [
            [200, 190, 90],
            [370, 155, 90],
            [540, 120, 90],
            [820, 190, 90],
            [1000, 150, 90],
            [1180, 115, 90],
            [1580, 185, 90],
            [1760, 145, 90],
            [1940, 110, 90],
            [2150, 170, 100]
        ],
        enemies: [600, 1100, 1700, 2200]
    },

    {
        name: "ZIG ZAG",
        theme: 5,
        pits: [[500, 570], [1200, 1270], [1900, 1970]],
        platforms: [
            [250, 180, 90],
            [430, 130, 90],
            [650, 180, 90],
            [850, 130, 90],
            [1050, 180, 90],
            [1360, 130, 90],
            [1580, 180, 90],
            [1750, 130, 90],
            [2050, 180, 90],
            [2220, 140, 90]
        ],
        enemies: [350, 950, 1500, 2150]
    },

    {
        name: "ENEMY ZONE",
        theme: 6,
        pits: [[850, 920], [1700, 1770]],
        platforms: [
            [300, 185, 100],
            [550, 150, 100],
            [950, 185, 100],
            [1200, 150, 100],
            [1450, 115, 100],
            [1800, 185, 100],
            [2050, 150, 100],
            [2250, 115, 100]
        ],
        enemies: [
            350, 550, 750, 1100,
            1350, 1550, 1950, 2200
        ]
    },

    {
        name: "CAVE RUN",
        theme: 7,
        pits: [
            [350, 420],
            [750, 830],
            [1300, 1380],
            [1900, 1980]
        ],
        platforms: [
            [420, 170, 100],
            [600, 130, 100],
            [830, 190, 100],
            [1050, 145, 100],
            [1380, 180, 100],
            [1600, 130, 100],
            [1980, 180, 100],
            [2180, 140, 100]
        ],
        enemies: [550, 1100, 1650, 2250]
    },

    {
        name: "DEEP VALLEY",
        theme: 8,
        pits: [
            [450, 535],
            [900, 985],
            [1400, 1485],
            [1900, 1985]
        ],
        platforms: [
            [280, 170, 100],
            [535, 150, 100],
            [985, 165, 100],
            [1485, 150, 100],
            [1985, 165, 100],
            [2200, 130, 100]
        ],
        enemies: [700, 1200, 1750, 2300]
    },

    {
        name: "SMALL PLATFORM",
        theme: 9,
        pits: [[600, 675], [1200, 1275], [1800, 1875]],
        platforms: [
            [200, 190, 65],
            [330, 155, 65],
            [460, 120, 65],
            [720, 180, 65],
            [850, 140, 65],
            [980, 105, 65],
            [1300, 180, 65],
            [1430, 140, 65],
            [1560, 100, 65],
            [1900, 180, 65],
            [2030, 140, 65],
            [2160, 100, 65]
        ],
        enemies: [400, 1050, 1500, 2150, 2350]
    },

    {
        name: "QUICK STEPS",
        theme: 10,
        pits: [
            [280, 345],
            [470, 535],
            [680, 750],
            [950, 1020],
            [1300, 1370],
            [1650, 1720],
            [2050, 2120]
        ],
        platforms: [
            [345, 180, 100],
            [535, 150, 100],
            [750, 180, 100],
            [1020, 145, 100],
            [1370, 180, 100],
            [1720, 145, 100],
            [2120, 175, 100],
            [2300, 140, 100]
        ],
        enemies: [400, 850, 1150, 1500, 1850, 2250]
    },

    {
        name: "SKY DANGER",
        theme: 11,
        pits: [[700, 780], [1500, 1580]],
        platforms: [
            [200, 190, 85],
            [360, 150, 85],
            [520, 110, 85],
            [780, 185, 85],
            [950, 145, 85],
            [1120, 105, 85],
            [1300, 165, 85],
            [1580, 185, 85],
            [1750, 145, 85],
            [1920, 105, 85],
            [2120, 170, 85],
            [2300, 130, 85]
        ],
        enemies: [350, 550, 950, 1200, 1750, 2050, 2300]
    },

    {
        name: "DARK CASTLE",
        theme: 12,
        pits: [
            [350, 430],
            [800, 880],
            [1300, 1380],
            [1800, 1880],
            [2200, 2280]
        ],
        platforms: [
            [430, 150, 85],
            [600, 110, 85],
            [880, 160, 85],
            [1080, 115, 85],
            [1380, 160, 85],
            [1580, 110, 85],
            [1880, 160, 85],
            [2080, 115, 85],
            [2280, 160, 85],
            [2400, 125, 85]
        ],
        enemies: [550, 1150, 1650, 2150, 2400]
    },

    {
        name: "EXTREME JUMP",
        theme: 13,
        pits: [
            [250, 320],
            [520, 590],
            [820, 890],
            [1120, 1190],
            [1450, 1520],
            [1780, 1850],
            [2100, 2170]
        ],
        platforms: [
            [320, 170, 65],
            [590, 140, 65],
            [890, 170, 65],
            [1190, 135, 65],
            [1520, 170, 65],
            [1850, 135, 65],
            [2170, 165, 65],
            [2350, 125, 65]
        ],
        enemies: [420, 1000, 1630, 2280]
    },

    {
        name: "FINAL CHALLENGE",
        theme: 14,
        pits: [
            [350, 430],
            [700, 780],
            [1100, 1180],
            [1500, 1580],
            [1900, 1980],
            [2250, 2330]
        ],
        platforms: [
            [430, 160, 80],
            [580, 115, 80],
            [780, 165, 80],
            [950, 120, 80],
            [1180, 165, 80],
            [1350, 115, 80],
            [1580, 165, 80],
            [1750, 115, 80],
            [1980, 165, 80],
            [2150, 115, 80],
            [2330, 160, 80]
        ],
        enemies: [550, 900, 1450, 1800, 2100, 2420]
    }
];

// ==================================================
// LEVEL SELECT
// ==================================================

function starText(count) {
    return "★".repeat(count) + "☆".repeat(3 - count);
}

function renderLevels() {
    const grid = $("levelGrid");
    if (!grid) return;

    grid.innerHTML = "";

    setText("unlockedCount", save.unlocked + " / 15");

    for (let i = 1; i <= 15; i++) {
        const unlocked = i <= save.unlocked;
        const completed = save.completed.includes(i);

        const card = document.createElement("button");

        card.className = "level-card";

        if (unlocked) card.classList.add("unlocked");
        if (completed) card.classList.add("completed");
        if (!unlocked) card.classList.add("locked");

        const star = document.createElement("span");
        star.className = "star";
        star.textContent = completed ? "✔" : "";

        const number = document.createElement("span");
        number.className = "level-number";

        number.textContent = unlocked
            ? String(i).padStart(2, "0")
            : "🔒";

        const rating = document.createElement("span");
        rating.className = "level-stars";

        rating.textContent = completed
            ? starText(Math.max(1, Math.min(3, Number(save.stars[i]) || 1)))
            : "";

        const label = document.createElement("small");

        label.textContent = completed
            ? "COMPLETED"
            : unlocked
                ? "PLAY LEVEL"
                : "LOCKED";

        card.append(star, number, rating, label);

        if (unlocked) {
            card.onclick = () => startLevel(i);
        }

        grid.appendChild(card);
    }
}

// ==================================================
// BUILD LEVEL
// ==================================================

function inPit(x, w) {
    return currentPits.some(
        pit => x + w > pit[0] && x < pit[1]
    );
}

// Cari posisi aman (bukan di atas lubang) untuk respawn / checkpoint.
function safeX(x) {
    for (let i = 0; i < 80; i++) {
        const pit = currentPits.find(
            p => x + 24 > p[0] && x - 8 < p[1]
        );

        if (!pit) return Math.max(40, x);

        x = pit[0] - 40;
    }

    return 40;
}

function buildLevel(level) {
    platforms = [];
    coins = [];
    enemies = [];
    particles = [];
    checkpoints = [];

    const map = LEVEL_MAPS[level - 1];

    if (!map) {
        console.error("Level tidak ditemukan:", level);
        return;
    }

    worldWidth = 2600;
    finishX = 2500;

    let floorStart = 0;

    const sortedPits = [...map.pits].sort(
        (a, b) => a[0] - b[0]
    );

    currentPits = sortedPits;

    for (const pit of sortedPits) {
        const pitStart = Math.max(0, pit[0]);
        const pitEnd = Math.min(worldWidth, pit[1]);

        if (pitStart > floorStart) {
            platforms.push({
                x: floorStart,
                y: 238,
                w: pitStart - floorStart,
                h: 50,
                type: "ground"
            });
        }

        floorStart = Math.max(floorStart, pitEnd);
    }

    if (floorStart < worldWidth) {
        platforms.push({
            x: floorStart,
            y: 238,
            w: worldWidth - floorStart,
            h: 50,
            type: "ground"
        });
    }

    for (const data of map.platforms) {
        const [x, y, w] = data;

        platforms.push({
            x,
            y,
            w,
            h: 10,
            type: "floating"
        });

        const amount = Math.max(
            1,
            Math.floor(w / 35)
        );

        for (let i = 0; i < amount; i++) {
            coins.push({
                x: x + 10 + i * 25,
                y: y - 18,
                w: 10,
                h: 13,
                collected: false
            });
        }
    }

    for (let x = 80; x < finishX - 30; x += 130) {
        if (!inPit(x, 10)) {
            coins.push({
                x,
                y: 218,
                w: 10,
                h: 13,
                collected: false
            });
        }
    }

    for (const x of map.enemies) {
        if (inPit(x, 16)) continue;

        enemies.push({
            x,
            y: 219,
            w: 16,
            h: 19,
            min: Math.max(20, x - 35),
            max: Math.min(worldWidth - 30, x + 35),
            speed: 0.45 + level * 0.035,
            direction: 1,
            dead: false
        });
    }

    // Checkpoint tiap ±350px, selalu di tanah yang aman.
    for (let x = 350; x < finishX - 100; x += 350) {
        const sx = safeX(x);

        if (!checkpoints.some(cp => cp.x === sx)) {
            checkpoints.push({ x: sx, hit: false });
        }
    }

    player.x = 40;
    player.y = 180;

    player.vx = 0;
    player.vy = 0;

    player.grounded = false;
    player.facing = 1;
    player.invincible = 0;

    previousPlayerBottom = player.y + player.h;
    previousPlayerVy = 0;

    cameraX = 0;
    checkpoint = 40;

    score = 0;
    lives = 3;
    deaths = 0;
    collectedCoins = 0;
    shake = 0;

    coyote = 0;
    jumpBuffer = 0;

    paused = false;
    gameOver = false;
    levelDone = false;

    input.left = false;
    input.right = false;
    input.jump = false;

    setText("gameLevel", "WORLD " + level + " - " + map.name);

    updateHUD();
}

// ==================================================
// START LEVEL
// ==================================================

function startLevel(level) {
    if (level < 1 || level > 15) return;
    if (level > save.unlocked) return;

    currentLevel = level;

    buildLevel(level);

    toggleHidden("gameMessage", true);

    removeClass("resumeBtn", "hidden");
    removeClass("restartBtn", "hidden");

    setText("messageMenuBtn", "DASHBOARD");

    if ($("messageMenuBtn")) {
        $("messageMenuBtn").onclick = () => {
            showScreen("dashboard");
        };
    }

    showScreen("game");
    startMusic();
}

// ==================================================
// PARTICLES
// ==================================================

function spawnBurst(x, y, color, count, power) {
    for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = (0.4 + Math.random()) * power;

        particles.push({
            x,
            y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 0.6,
            life: 20 + Math.random() * 14,
            maxLife: 34,
            size: 1 + Math.floor(Math.random() * 2),
            color,
            text: null
        });
    }
}

function spawnText(x, y, text, color) {
    particles.push({
        x,
        y,
        vx: 0,
        vy: -0.5,
        life: 38,
        maxLife: 38,
        size: 0,
        color,
        text
    });
}

function updateParticles() {
    for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        if (!p.text) p.vy += 0.07;

        p.life--;
    }

    particles = particles.filter(p => p.life > 0);
}

function drawParticles() {
    for (const p of particles) {
        const alpha = Math.max(0, Math.min(1, p.life / p.maxLife));

        ctx.globalAlpha = alpha;

        if (p.text) {
            ctx.fillStyle = p.color;
            ctx.font = "bold 8px monospace";

            ctx.fillText(
                p.text,
                Math.round(p.x - cameraX),
                Math.round(p.y)
            );
        } else {
            ctx.fillStyle = p.color;

            ctx.fillRect(
                Math.round(p.x - cameraX),
                Math.round(p.y),
                p.size,
                p.size
            );
        }
    }

    ctx.globalAlpha = 1;
}

// ==================================================
// COLLISION
// ==================================================

function collision(a, b) {
    return (
        a.x < b.x + b.w &&
        a.x + a.w > b.x &&
        a.y < b.y + b.h &&
        a.y + a.h > b.y
    );
}

// ==================================================
// PLAYER MOVEMENT
// ==================================================

function updatePlayer() {
    if (input.left) {
        player.vx = -player.speed;
        player.facing = -1;

    } else if (input.right) {
        player.vx = player.speed;
        player.facing = 1;

    } else {
        player.vx *= 0.75;
    }

    if (Math.abs(player.vx) < 0.05) {
        player.vx = 0;
    }

    // Coyote time & jump buffer (lompat terasa lebih enak)
    if (player.grounded) {
        coyote = 6;
    } else if (coyote > 0) {
        coyote--;
    }

    if (jumpBuffer > 0) jumpBuffer--;

    if (jumpBuffer > 0 && coyote > 0) {
        player.vy = player.jump;
        player.grounded = false;

        coyote = 0;
        jumpBuffer = 0;

        spawnBurst(
            player.x + player.w / 2,
            player.y + player.h,
            "#e8e2d0", 5, 0.8
        );

        playTone(420);
    }

    // Lompat variabel: lepas tombol = lompat lebih pendek
    if (!input.jump && player.vy < -2.5) {
        player.vy += 0.5;
    }

    player.x += player.vx;

    for (const p of platforms) {
        if (!collision(player, p)) continue;

        if (player.vx > 0) {
            player.x = p.x - player.w;

        } else if (player.vx < 0) {
            player.x = p.x + p.w;
        }
    }

    previousPlayerBottom = player.y + player.h;

    const wasGrounded = player.grounded;

    player.vy = Math.min(
        player.vy + GRAVITY,
        MAX_FALL_SPEED
    );

    previousPlayerVy = player.vy;

    player.y += player.vy;
    player.grounded = false;

    for (const p of platforms) {
        if (!collision(player, p)) continue;

        if (
            player.vy >= 0 &&
            previousPlayerBottom <= p.y + 5
        ) {
            player.y = p.y - player.h;

            if (!wasGrounded && player.vy > 3.5) {
                spawnBurst(
                    player.x + player.w / 2,
                    player.y + player.h,
                    "#e8e2d0", 5, 0.8
                );
            }

            player.vy = 0;
            player.grounded = true;
        }

        else if (player.vy < 0) {
            player.y = p.y + p.h;
            player.vy = 0;
        }
    }

    player.x = Math.max(
        0,
        Math.min(finishX + 30, player.x)
    );

    if (player.invincible > 0) {
        player.invincible--;
    }

    // Checkpoint
    for (const cp of checkpoints) {
        if (!cp.hit && player.x >= cp.x) {
            cp.hit = true;
            checkpoint = cp.x;

            spawnText(cp.x, 195, "CHECKPOINT!", "#8fe0b0");
            spawnBurst(cp.x + 5, 215, "#8fe0b0", 8, 1);

            playTone(600, 0.1);
        }
    }

    // Jatuh ke lubang (selalu kehilangan nyawa, meski sedang kebal)
    if (player.y > H + 60) {
        loseLife(true);
    }
}

// ==================================================
// COIN SYSTEM
// ==================================================

function updateCoins() {
    const playerBox = {
        x: player.x - 7,
        y: player.y - 8,
        w: player.w + 14,
        h: player.h + 16
    };

    for (const coin of coins) {
        if (coin.collected) continue;

        const coinBox = {
            x: coin.x - 3,
            y: coin.y - 3,
            w: coin.w + 6,
            h: coin.h + 6
        };

        if (collision(playerBox, coinBox)) {
            coin.collected = true;
            collectedCoins++;
            score += 10;

            spawnBurst(coin.x + 5, coin.y + 6, "#ffe45c", 6, 1.1);
            spawnText(coin.x, coin.y - 4, "+10", "#fff4a8");

            playTone(950, 0.09);
            updateHUD();
        }
    }
}

// ==================================================
// ENEMY SYSTEM
// ==================================================

function updateEnemies() {
    for (const enemy of enemies) {
        if (enemy.dead) continue;

        enemy.x += enemy.direction * enemy.speed;

        if (enemy.x <= enemy.min) {
            enemy.x = enemy.min;
            enemy.direction = 1;
        }

        if (enemy.x >= enemy.max) {
            enemy.x = enemy.max;
            enemy.direction = -1;
        }

        const enemyBox = {
            x: enemy.x,
            y: enemy.y,
            w: enemy.w,
            h: enemy.h
        };

        if (!collision(player, enemyBox)) continue;

        const currentBottom = player.y + player.h;
        const falling = player.vy > 0;

        const crossedTop =
            previousPlayerBottom <= enemy.y + 9 &&
            currentBottom >= enemy.y;

        const aboveEnemy =
            player.x + player.w > enemy.x + 2 &&
            player.x < enemy.x + enemy.w - 2;

        if (falling && crossedTop && aboveEnemy) {
            enemy.dead = true;

            player.y = enemy.y - player.h;
            player.vy = -5.8;
            player.grounded = false;

            score += 100;

            spawnBurst(
                enemy.x + 8, enemy.y + 12,
                "#d97945", 12, 1.6
            );

            spawnText(enemy.x, enemy.y - 4, "+100", "#ffffff");

            playTone(760, 0.15);
            updateHUD();

            continue;
        }

        if (player.invincible <= 0) {
            loseLife();
        }
    }
}

// ==================================================
// LIFE SYSTEM
// ==================================================

function loseLife(force = false) {
    if ((player.invincible > 0 && !force) || gameOver) return;

    lives--;
    deaths++;
    shake = 12;

    updateHUD();
    playTone(150, 0.25);

    spawnBurst(
        player.x + 8,
        Math.min(player.y + 10, H - 10),
        "#ff6b5a", 14, 1.8
    );

    if (lives <= 0) {
        lives = 0;
        gameOver = true;
        paused = true;

        stopMusic();

        showMessage(
            "GAME OVER",
            "Semua nyawa habis. Coba lagi!"
        );

        addClass("resumeBtn", "hidden");
        removeClass("restartBtn", "hidden");

        return;
    }

    player.x = safeX(Math.min(checkpoint, finishX - 100));
    player.y = 170;

    player.vx = 0;
    player.vy = 0;
    player.grounded = false;

    player.invincible = 100;

    previousPlayerBottom = player.y + player.h;
    previousPlayerVy = 0;

    cameraX = Math.max(
        0,
        player.x - W * 0.38
    );

    updateHUD();
}

// ==================================================
// COMPLETE LEVEL
// ==================================================

function completeLevel() {
    if (paused || gameOver || levelDone) return;

    levelDone = true;
    paused = true;

    stopMusic();

    // Rating bintang
    const ratio = coins.length > 0
        ? collectedCoins / coins.length
        : 1;

    let stars = 1;

    if (ratio >= 0.75) stars++;
    if (deaths === 0) stars++;

    const earnedCoins = Math.floor(score / 10) + stars * 5;

    save.coins += earnedCoins;

    if (!save.completed.includes(currentLevel)) {
        save.completed.push(currentLevel);
    }

    save.stars[currentLevel] = Math.max(
        Number(save.stars[currentLevel]) || 0,
        stars
    );

    if (currentLevel < 15) {
        save.unlocked = Math.max(
            save.unlocked,
            currentLevel + 1
        );
    }

    saveData();
    updateDashboard();

    playTone(523);

    setTimeout(() => playTone(659), 150);
    setTimeout(() => playTone(784), 300);

    addClass("resumeBtn", "hidden");
    addClass("restartBtn", "hidden");

    const detail =
        starText(stars) + "  |  Koin diambil: " +
        collectedCoins + "/" + coins.length +
        "  |  Mati: " + deaths;

    if (currentLevel < 15) {
        showMessage(
            "LEVEL COMPLETE!",
            "Kamu mendapatkan " + earnedCoins +
            " koin! Level " + (currentLevel + 1) +
            " berhasil dibuka!\n" + detail
        );

        setText("messageMenuBtn", "NEXT LEVEL");

        if ($("messageMenuBtn")) {
            $("messageMenuBtn").onclick = () => {
                startLevel(currentLevel + 1);
            };
        }

    } else {
        showMessage(
            "CHAMPION!",
            "Semua 15 level berhasil diselesaikan!\n" + detail
        );

        setText("messageMenuBtn", "DASHBOARD");

        if ($("messageMenuBtn")) {
            $("messageMenuBtn").onclick = () => {
                showScreen("dashboard");
            };
        }
    }
}

// ==================================================
// CAMERA
// ==================================================

function updateCamera() {
    const target = player.x - W * 0.38;

    cameraX += (target - cameraX) * 0.12;

    cameraX = Math.max(
        0,
        Math.min(worldWidth - W, cameraX)
    );
}

// ==================================================
// BACKGROUND THEMES
// ==================================================

const THEMES = [
    ["#52b8e5", "#c1e9d5", "#79bd75"],
    ["#e9a85e", "#f3d99a", "#c48a4a"],
    ["#5a91ba", "#b7d7e8", "#6a9a88"],
    ["#8d80bb", "#d7b8df", "#78639d"],
    ["#da7955", "#f1c08a", "#b76a4a"],
    ["#5aa7a5", "#b5e2d5", "#4c9382"],
    ["#d17a65", "#f2c5a1", "#a9574b"],
    ["#404d70", "#9aa7c9", "#4a5d75"],
    ["#d19b5b", "#f4d6a0", "#b77b44"],
    ["#6d8da7", "#c3d8e7", "#66819b"],
    ["#a96f9b", "#e5c2db", "#80577e"],
    ["#537b9d", "#a8c7dc", "#466b87"],
    ["#453d68", "#a58dbb", "#57476f"],
    ["#6e647b", "#c6b7d1", "#796a89"],
    ["#342e50", "#87729e", "#453b64"]
];

function drawBackground() {
    const theme = THEMES[currentLevel - 1] || THEMES[0];

    const gradient = ctx.createLinearGradient(
        0, 0, 0, H
    );

    gradient.addColorStop(0, theme[0]);
    gradient.addColorStop(1, theme[1]);

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, W, H);

    // Bintang berkelip di level gelap
    if (currentLevel === 8 || currentLevel >= 13) {
        for (let i = 0; i < 28; i++) {
            const sx = (i * 97) % W;
            const sy = (i * 53) % 130;

            if ((frame + i * 13) % 70 < 55) {
                ctx.fillStyle = "rgba(255,255,255,.8)";
                ctx.fillRect(sx, sy, 2, 2);
            }
        }
    }

    ctx.fillStyle = "#ffe66c";
    ctx.fillRect(395, 25, 27, 27);

    for (let i = 0; i < 7; i++) {
        const x = (
            (i * 110 - cameraX * 0.2 - frame * 0.08) % 600 + 600
        ) % 600 - 60;

        const y = 35 + (i % 3) * 25;

        ctx.fillStyle = "rgba(255,255,255,.95)";
        ctx.fillRect(x, y, 40, 9);
        ctx.fillRect(x + 9, y - 8, 20, 17);
        ctx.fillRect(x + 28, y + 1, 19, 8);
    }

    for (let i = 0; i < 8; i++) {
        const x = (
            (i * 100 - cameraX * 0.4) % 650 + 650
        ) % 650 - 50;

        ctx.fillStyle = theme[2];

        ctx.fillRect(x, 190, 65, 80);
        ctx.fillRect(x + 12, 175, 40, 95);
    }
}

// ==================================================
// DRAW PLATFORMS
// ==================================================

function drawPlatforms() {
    const theme = THEMES[currentLevel - 1] || THEMES[0];

    for (const p of platforms) {
        const x = Math.round(p.x - cameraX);

        if (x + p.w < 0 || x > W) continue;

        if (p.type === "ground") {
            ctx.fillStyle = theme[2];
            ctx.fillRect(x, p.y, p.w, 5);

            ctx.fillStyle = "#338b40";
            ctx.fillRect(x, p.y + 5, p.w, 3);

            ctx.fillStyle = "#a65e34";
            ctx.fillRect(x, p.y + 8, p.w, p.h - 8);

            ctx.fillStyle = "#c07b43";

            for (let j = 5; j < p.w; j += 20) {
                ctx.fillRect(x + j, p.y + 15, 8, 4);
            }

        } else {
            ctx.fillStyle = theme[2];
            ctx.fillRect(x, p.y, p.w, 5);

            ctx.fillStyle = "#338b40";
            ctx.fillRect(x, p.y + 5, p.w, 3);

            ctx.fillStyle = "#a65e34";
            ctx.fillRect(x, p.y + 8, p.w, 2);
        }
    }
}

// ==================================================
// DRAW COINS
// ==================================================

function drawCoins() {
    for (const coin of coins) {
        if (coin.collected) continue;

        const x = Math.round(coin.x - cameraX);

        if (x < -20 || x > W + 20) continue;

        const y = Math.round(
            coin.y + Math.sin(frame * 0.1 + coin.x) * 2
        );

        ctx.fillStyle = "#c98516";
        ctx.fillRect(x + 1, y, 9, 13);

        ctx.fillStyle = "#ffe45c";
        ctx.fillRect(x + 3, y + 1, 5, 10);

        ctx.fillStyle = "#fff4a8";
        ctx.fillRect(x + 3, y + 2, 2, 5);
    }
}

// ==================================================
// DRAW CHECKPOINTS
// ==================================================

function drawCheckpoints() {
    for (const cp of checkpoints) {
        const x = Math.round(cp.x - cameraX);

        if (x < -20 || x > W + 20) continue;

        ctx.fillStyle = "#dfe6ee";
        ctx.fillRect(x, 216, 2, 22);

        ctx.fillStyle = cp.hit ? "#4cbf64" : "#8896a8";
        ctx.fillRect(x + 2, 216, 9, 6);
    }
}

// ==================================================
// DRAW PLAYER - MEMAKAI SPRITE YANG SAMA DENGAN SHOP
// ==================================================

function drawPlayer() {
    if (
        player.invincible > 0 &&
        frame % 8 < 4
    ) {
        return;
    }

    const x = Math.round(player.x - cameraX);
    const y = Math.round(player.y);

    const moving = Math.abs(player.vx) > 0.3;
    const air = !player.grounded;

    const step = (moving && !air)
        ? (Math.floor(frame / 6) % 2) + 1
        : 0;

    // sprite setinggi 24 baris, kaki tepat di dasar hitbox
    drawCharacter(
        ctx, x, y - 1, 1,
        buildOutfit(save.cosmetics.equipped, {
            facing: player.facing,
            step,
            air,
            moving
        })
    );
}

// ==================================================
// DRAW ENEMIES
// ==================================================

function drawEnemies() {
    for (const enemy of enemies) {
        if (enemy.dead) continue;

        const x = Math.round(enemy.x - cameraX);
        const y = enemy.y;

        if (x < -30 || x > W + 30) continue;

        const walk = Math.floor(frame / 8) % 2;

        ctx.fillStyle = "#91442e";
        ctx.fillRect(x + 2, y + 5, 12, 12);

        ctx.fillStyle = "#d97945";
        ctx.fillRect(x + 3, y, 10, 9);

        ctx.fillStyle = "#fff";
        ctx.fillRect(x + 4, y + 3, 3, 3);
        ctx.fillRect(x + 10, y + 3, 3, 3);

        const look = enemy.direction > 0 ? 1 : 0;

        ctx.fillStyle = "#222";
        ctx.fillRect(x + 4 + look, y + 4, 2, 2);
        ctx.fillRect(x + 10 + look, y + 4, 2, 2);

        // alis marah
        ctx.fillStyle = "#482b22";
        ctx.fillRect(x + 4, y + 2, 3, 1);
        ctx.fillRect(x + 10, y + 2, 3, 1);

        // kaki berjalan
        ctx.fillStyle = "#482b22";

        if (walk) {
            ctx.fillRect(x, y + 16, 6, 3);
            ctx.fillRect(x + 10, y + 15, 6, 3);
        } else {
            ctx.fillRect(x, y + 15, 6, 3);
            ctx.fillRect(x + 10, y + 16, 6, 3);
        }
    }
}

// ==================================================
// DRAW FINISH FLAG
// ==================================================

function drawFlag() {
    const x = Math.round(finishX - cameraX);

    const wave = Math.round(Math.sin(frame * 0.12) * 2);

    ctx.fillStyle = "#eee";
    ctx.fillRect(x, 135, 3, 103);

    ctx.fillStyle = "#f3d13d";
    ctx.fillRect(x + 3, 136, 30 + wave, 15);

    ctx.fillStyle = "#e84e38";
    ctx.fillRect(x + 3, 151, 25 + wave, 10);
}

// ==================================================
// HUD
// ==================================================

function updateHUD() {
    setText("gameScore", "COINS: " + score);
    setText("gameLives", "♥ ".repeat(Math.max(0, lives)));
}

function drawHUD() {
    ctx.fillStyle = "rgba(20,35,50,.75)";
    ctx.fillRect(8, 8, 175, 24);

    ctx.fillStyle = "#fff";
    ctx.font = "10px monospace";

    ctx.fillText(
        "WORLD " + currentLevel,
        15,
        19
    );

    ctx.fillText(
        "SCORE " + score,
        15,
        28
    );

    // Progress bar menuju finish
    const progress = Math.max(
        0,
        Math.min(1, player.x / finishX)
    );

    ctx.fillStyle = "rgba(20,35,50,.75)";
    ctx.fillRect(W - 136, 8, 128, 14);

    ctx.fillStyle = "#3a4f68";
    ctx.fillRect(W - 132, 13, 120, 4);

    ctx.fillStyle = "#ffdc59";
    ctx.fillRect(W - 132, 13, Math.round(120 * progress), 4);

    ctx.fillStyle = "#e84e38";
    ctx.fillRect(W - 132 + Math.round(116 * progress), 10, 4, 10);
}

// ==================================================
// DRAW GAME
// ==================================================

function draw() {
    ctx.clearRect(0, 0, W, H);

    ctx.save();

    if (shake > 0) {
        ctx.translate(
            Math.round((Math.random() - 0.5) * shake * 0.6),
            Math.round((Math.random() - 0.5) * shake * 0.6)
        );
    }

    drawBackground();
    drawPlatforms();
    drawCheckpoints();
    drawCoins();
    drawEnemies();
    drawFlag();
    drawPlayer();
    drawParticles();

    ctx.restore();

    drawHUD();
}

// ==================================================
// MESSAGE
// ==================================================

function showMessage(title, message) {
    paused = true;
    stopMusic();

    setText("messageTitle", title);
    setText("messageText", message);

    const text = $("messageText");

    if (text) text.style.whiteSpace = "pre-line";

    removeClass("gameMessage", "hidden");
}

// ==================================================
// PAUSE SYSTEM
// ==================================================

function pauseGame() {
    if (
        currentScreen !== "game" ||
        paused ||
        gameOver ||
        levelDone
    ) return;

    showMessage(
        "PAUSED",
        "Game sedang dijeda."
    );

    removeClass("resumeBtn", "hidden");
    removeClass("restartBtn", "hidden");

    setText("messageMenuBtn", "DASHBOARD");

    if ($("messageMenuBtn")) {
        $("messageMenuBtn").onclick = () => {
            showScreen("dashboard");
        };
    }
}

function resumeGame() {
    if (gameOver || levelDone) return;
    if (currentScreen !== "game") return;

    paused = false;

    toggleHidden("gameMessage", true);

    startMusic();
}

if ($("pauseBtn")) {
    $("pauseBtn").onclick = pauseGame;
}

if ($("resumeBtn")) {
    $("resumeBtn").onclick = resumeGame;
}

if ($("restartBtn")) {
    $("restartBtn").onclick = () => {
        startLevel(currentLevel);
    };
}

if ($("exitGame")) {
    $("exitGame").onclick = () => {
        paused = true;
        showScreen("dashboard");
    };
}

if ($("messageMenuBtn")) {
    $("messageMenuBtn").onclick = () => {
        showScreen("dashboard");
    };
}

// ==================================================
// TOUCH CONTROL
// ==================================================

function bindControl(id, key) {
    const button = $(id);

    if (!button) return;

    button.addEventListener("pointerdown", e => {
        e.preventDefault();

        if (key === "jump") {
            pressJump();
        } else {
            input[key] = true;
        }

        if (button.setPointerCapture) {
            button.setPointerCapture(e.pointerId);
        }
    });

    const release = e => {
        e.preventDefault();
        input[key] = false;
    };

    button.addEventListener("pointerup", release);
    button.addEventListener("pointercancel", release);

    button.addEventListener("lostpointercapture", () => {
        input[key] = false;
    });
}

bindControl("leftBtn", "left");
bindControl("rightBtn", "right");
bindControl("jumpBtn", "jump");

// ==================================================
// KEYBOARD
// ==================================================

window.addEventListener("keydown", e => {
    if (
        ["ArrowLeft", "ArrowRight", "ArrowUp", "Space"].includes(e.code) &&
        currentScreen === "game"
    ) {
        e.preventDefault();
    }

    if (e.code === "ArrowLeft" || e.code === "KeyA") {
        input.left = true;
    }

    if (e.code === "ArrowRight" || e.code === "KeyD") {
        input.right = true;
    }

    if (
        e.code === "Space" ||
        e.code === "ArrowUp" ||
        e.code === "KeyW"
    ) {
        pressJump();
    }

    if (e.code === "Escape") {
        if (currentScreen !== "game") return;

        if (!paused) {
            pauseGame();
        } else if (!gameOver && !levelDone) {
            resumeGame();
        }
    }
});

window.addEventListener("keyup", e => {
    if (e.code === "ArrowLeft" || e.code === "KeyA") {
        input.left = false;
    }

    if (e.code === "ArrowRight" || e.code === "KeyD") {
        input.right = false;
    }

    if (
        e.code === "Space" ||
        e.code === "ArrowUp" ||
        e.code === "KeyW"
    ) {
        input.jump = false;
    }
});

window.addEventListener("blur", () => {
    input.left = false;
    input.right = false;
    input.jump = false;

    if (
        currentScreen === "game" &&
        !paused &&
        !gameOver
    ) {
        pauseGame();
    }
});

// ==================================================
// UPDATE GAME
// ==================================================

function update() {
    if (shake > 0) shake--;

    if (currentScreen !== "game" || paused) return;

    updatePlayer();

    if (gameOver) return;

    updateCoins();
    updateEnemies();
    updateParticles();

    if (gameOver) return;

    if (player.x >= finishX) {
        completeLevel();
        return;
    }

    updateCamera();
}

// ==================================================
// MAIN GAME LOOP
// ==================================================

function gameLoop() {
    frame++;

    update();

    if (currentScreen === "game") {
        draw();
    } else {
        renderPreviews();
    }

    requestAnimationFrame(gameLoop);
}

// ==================================================
// INITIALIZE
// ==================================================

updateDashboard();
showScreen("dashboard");
renderShop();

gameLoop();