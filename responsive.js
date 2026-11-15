"use strict";
// ==================================================
// PIXEL QUEST - UNIVERSAL RESPONSIVE, AUTO LANDSCAPE & SMART CONTROL
// Dimuat SETELAH game.js, upgrade.js, upgrade2.js
// Tidak mengubah save / localStorage lama. Mode kontrol disimpan
// di key terpisah: "pq_control_mode".
// ==================================================
(function () {

    const MODE_KEY = "pq_control_mode";
    const body = document.body;
    const KEYS = ["left", "right", "jump"];
    const BTN = { leftBtn: "left", rightBtn: "right", jumpBtn: "jump" };

    // tombol virtual yang sedang ditekan (untuk pengaman input)
    const virt = { left: false, right: false, jump: false };

    const mq = q => {
        try { return !!(window.matchMedia && window.matchMedia(q).matches); }
        catch (e) { return false; }
    };

    const isPortrait = () => window.innerHeight > window.innerWidth;

    // ==================================================
    // DETEKSI PERANGKAT & MODE KONTROL
    // ==================================================

    // true = perangkat yang memang utamanya layar sentuh (HP, tablet, IFP).
    // Laptop touchscreen yang punya mouse/trackpad TIDAK dianggap perangkat sentuh.
    function realTouchDevice() {
        const pts = navigator.maxTouchPoints || 0;

        if (pts <= 0 && !("ontouchstart" in window)) return false;
        if (mq("(pointer: coarse)")) return true;
        if (mq("(pointer: fine)") || mq("(any-pointer: fine)")) return false;

        return pts > 0;
    }

    // true = HP saja (sisi pendek layar < 600px). Tablet, TV interaktif, laptop, dan PC
    // TIDAK dianggap HP, jadi tidak pernah dapat peringatan "putar layar".
    function isPhone() {
        if (!realTouchDevice()) return false;

        const sw = (window.screen && screen.width) || window.innerWidth;
        const sh = (window.screen && screen.height) || window.innerHeight;

        return Math.min(sw, sh) < 600;
    }

    function getMode() {
        try {
            const m = localStorage.getItem(MODE_KEY);
            return m === "keyboard" || m === "touch" ? m : "auto";
        } catch (e) {
            return "auto";
        }
    }

    function storeMode(m) {
        try { localStorage.setItem(MODE_KEY, m); } catch (e) { }
    }

    function effectiveTouch() {
        const m = getMode();

        if (m === "touch") return true;
        if (m === "keyboard") return false;

        return realTouchDevice();
    }

    // ==================================================
    // INPUT: bersihkan & pengaman
    // ==================================================

    function clearVirtualUI() {
        Object.keys(BTN).forEach(id => {
            const b = $(id);
            if (b) b.classList.remove("pressed");
        });

        KEYS.forEach(k => { virt[k] = false; });
    }

    // Lepas hanya input yang berasal dari tombol virtual
    function releaseVirtual() {
        KEYS.forEach(k => { if (virt[k]) input[k] = false; });
        clearVirtualUI();
    }

    // Lepas SEMUA input (keyboard + virtual)
    function clearInput() {
        input.left = false;
        input.right = false;
        input.jump = false;

        clearVirtualUI();
    }

    // Pelacak tombol virtual (tambahan, tidak menggandakan listener game.js)
    Object.keys(BTN).forEach(id => {
        const b = $(id);
        const k = BTN[id];

        if (!b) return;

        const down = () => {
            virt[k] = true;
            b.classList.add("pressed");
        };

        const up = () => {
            virt[k] = false;
            b.classList.remove("pressed");
        };

        b.addEventListener("pointerdown", down);
        b.addEventListener("pointerup", up);
        b.addEventListener("pointercancel", up);
        b.addEventListener("lostpointercapture", up);
        b.addEventListener("contextmenu", e => e.preventDefault());
        b.addEventListener("dragstart", e => e.preventDefault());
    });

    // Semua jari terangkat -> pastikan tombol virtual terlepas
    const touchNet = e => {
        if (e.touches && e.touches.length === 0) releaseVirtual();
    };

    window.addEventListener("touchend", touchNet, { passive: true });
    window.addEventListener("touchcancel", touchNet, { passive: true });

    document.addEventListener("visibilitychange", () => {
        clearInput();

        if (
            document.hidden &&
            typeof pauseGame === "function" &&
            currentScreen === "game"
        ) {
            pauseGame();
        }
    });

    window.addEventListener("pagehide", clearInput);

    // ==================================================
    // UKURAN GAME
    // Area pandang dilebarkan mengikuti bentuk layar (tanpa gepeng),
    // jadi layar lebar terisi penuh. Tinggi dunia tetap 270.
    // ==================================================

    let fitQueued = false;

    function scheduleFit() {
        if (fitQueued) return;

        fitQueued = true;

        requestAnimationFrame(() => {
            fitQueued = false;
            fitGame();
        });
    }

    function fitGame() {
        const gs = $("gameScreen");
        const wr = document.querySelector(".game-wrapper");
        const tb = document.querySelector(".game-topbar");

        if (!gs || !wr || !tb || gs.classList.contains("hidden")) return;

        const cs = getComputedStyle(gs);
        const tbs = getComputedStyle(tb);

        const padX = (parseFloat(cs.paddingLeft) || 0) + (parseFloat(cs.paddingRight) || 0);
        const padY = (parseFloat(cs.paddingTop) || 0) + (parseFloat(cs.paddingBottom) || 0);

        const B = 3; // border wrapper

        const aw = gs.clientWidth - padX - B * 2;
        const ah = gs.clientHeight - padY - tb.offsetHeight - (parseFloat(tbs.marginBottom) || 0) - B * 2;

        if (aw <= 20 || ah <= 20) return;

        const BASE_W = 480;
        const BASE_H = 270;
        const MAX_W = 720; // batas pelebaran (layar ultrawide)

        // Lebarkan area pandang sesuai bentuk layar (minimal 16:9)
        let cw = Math.round(BASE_H * aw / ah);
        cw = Math.max(BASE_W, Math.min(MAX_W, cw));
        if (cw % 2) cw++;

        if (canvas.width !== cw) {
            canvas.width = cw;
            ctx.imageSmoothingEnabled = false;
            W = cw;
        }

        // Skala seragam: piksel tidak melar
        const scale = Math.min(ah / BASE_H, aw / cw);
        const iw = Math.floor(cw * scale);
        const ih = Math.floor(BASE_H * scale);

        wr.style.width = (iw + B * 2) + "px";
        wr.style.height = (ih + B * 2) + "px";
        tb.style.width = (iw + B * 2) + "px";
    }

    // ==================================================
    // FULLSCREEN
    // ==================================================

    const fsElement = () =>
        document.fullscreenElement || document.webkitFullscreenElement || null;

    function canFullscreen() {
        const el = document.documentElement;

        return !!(el.requestFullscreen || el.webkitRequestFullscreen) &&
            document.fullscreenEnabled !== false;
    }

    function enterFullscreen() {
        const el = document.documentElement;

        try {
            const fn = el.requestFullscreen || el.webkitRequestFullscreen;
            const p = fn.call(el);

            return p && p.then ? p : Promise.resolve();
        } catch (e) {
            return Promise.reject(e);
        }
    }

    function exitFullscreen() {
        try {
            const fn = document.exitFullscreen || document.webkitExitFullscreen;
            const p = fn.call(document);

            return p && p.then ? p : Promise.resolve();
        } catch (e) {
            return Promise.reject(e);
        }
    }

    // ==================================================
    // KUNCI ARAH LAYAR (MIRING / TEGAK, dipilih di Pengaturan)
    // ==================================================

    function lockLandscape() {
        const so = window.screen && screen.orientation;

        if (!so || !so.lock) return Promise.resolve(false);

        return so.lock("landscape").then(() => true).catch(() => false);
    }

    function getOrient() {
        try { return localStorage.getItem("pq_orient") === "portrait" ? "portrait" : "landscape"; }
        catch (e) { return "landscape"; }
    }

    function lockPortrait() {
        const so = window.screen && screen.orientation;

        if (!so || !so.lock) return Promise.resolve(false);

        return so.lock("portrait").then(() => true).catch(() => false);
    }

    // kunci sesuai pilihan pemain di Pengaturan
    function lockPref() {
        return getOrient() === "portrait" ? lockPortrait() : lockLandscape();
    }

    function toggleFullscreen() {
        if (!canFullscreen()) {
            showToast("Browser ini tidak mendukung fullscreen. Di iPhone: Share > Add to Home Screen.");
            return;
        }

        if (fsElement()) {
            exitFullscreen().catch(() => { });
            return;
        }

        enterFullscreen()
            .then(() => { if (isPhone()) lockPref(); })
            .catch(() => showToast("Fullscreen ditolak browser"));
    }

    function updateFsIcons() {
        const on = !!fsElement();

        ["fsBtn", "fsGameBtn"].forEach(id => {
            const b = $(id);
            const i = b && b.querySelector("i");

            if (i) {
                i.className = "fa-solid " + (on ? "fa-compress" : "fa-expand");
            }
        });
    }

    // Percobaan kunci landscape pertama setelah interaksi pengguna (portrait)
    let autoTried = false;

    window.addEventListener("pointerup", e => {
        if (autoTried || !isPortrait() || !isPhone() || getOrient() !== "landscape") return;
        if (e.target && e.target.closest && e.target.closest("#pqRotate")) return;

        autoTried = true;

        lockLandscape().then(ok => {
            if (ok || !isPortrait() || !canFullscreen() || fsElement()) return;

            enterFullscreen().then(lockLandscape).catch(() => { });
        });
    }, true);

    // ==================================================
    // NOTIFIKASI PUTAR LANDSCAPE
    // ==================================================

    let skipRotate = false;

    function checkRotate() {
        const box = $("pqRotate");

        if (!box) return;

        if (!isPortrait()) skipRotate = false;

        const show = isPhone() && isPortrait() && !skipRotate && getOrient() === "landscape";

        box.classList.toggle("hidden", !show);

        // game otomatis dijeda saat layar portrait, progres tidak berubah
        if (show && typeof pauseGame === "function" && currentScreen === "game") {
            clearInput();
            pauseGame();
        }
    }

    $("rotLock").onclick = () => {
        const done = () => {
            if (!isPortrait()) return;

            showToast("Kunci otomatis tidak didukung. Aktifkan Auto-rotate lalu Horizontal layar.");
        };

        if (fsElement()) {
            lockLandscape().then(done);
            return;
        }

        if (!canFullscreen()) {
            lockLandscape().then(ok => { if (!ok) done(); });
            return;
        }

        enterFullscreen()
            .then(() => lockLandscape())
            .then(() => setTimeout(() => { checkRotate(); done(); }, 400))
            .catch(() => lockLandscape().then(ok => { if (!ok) done(); }));
    };

    $("rotSkip").onclick = () => {
        skipRotate = true;
        checkRotate();
    };

    // ==================================================
    // APPLY MODE KONTROL
    // ==================================================

    function applyMode() {
        const touch = effectiveTouch();
        const big = touch && Math.max(window.innerWidth, window.innerHeight) >= 1500;

        body.classList.toggle("pq-touch", touch);
        body.classList.toggle("pq-keys", !touch);
        body.classList.toggle("pq-tv", big);

        if (!touch) releaseVirtual();

        updateCtrlUI();
        scheduleFit();
    }

    function updateCtrlUI() {
        const m = getMode();

        document.querySelectorAll(".ctrl-opt").forEach(b => {
            b.classList.toggle("active", b.dataset.mode === m);
        });

        const info = $("ctrlInfo");

        if (info) {
            info.textContent =
                "Terdeteksi: " +
                (realTouchDevice()
                    ? "layar sentuh (HP / Tablet / TV interaktif)"
                    : "keyboard & mouse (Laptop / PC)") +
                ". Kontrol aktif sekarang: " +
                (effectiveTouch() ? "TOUCH" : "KEYBOARD") + ".";
        }
    }

    function openCtrl() {
        if (typeof pauseGame === "function" && currentScreen === "game") {
            pauseGame();
        }

        updateCtrlUI();
        $("ctrlModal").classList.remove("hidden");
    }

    function closeCtrl() {
        $("ctrlModal").classList.add("hidden");
    }

    document.querySelectorAll(".ctrl-opt").forEach(b => {
        b.onclick = () => {
            storeMode(b.dataset.mode);
            applyMode();

            const label = { auto: "AUTO", keyboard: "KEYBOARD", touch: "TOUCH" }[b.dataset.mode];

            showToast("Mode kontrol: " + label);
        };
    });

    $("ctrlClose").onclick = closeCtrl;

    $("ctrlModal").addEventListener("click", e => {
        if (e.target === $("ctrlModal")) closeCtrl();
    });

    $("ctrlBtn").onclick = openCtrl;
    $("ctrlGameBtn").onclick = openCtrl;
    $("fsBtn").onclick = toggleFullscreen;
    $("fsGameBtn").onclick = toggleFullscreen;

    // ==================================================
    // PERPINDAHAN HALAMAN: bersihkan input
    // ==================================================

    const baseShowScreen = showScreen;

    showScreen = function () {
        clearInput();

        const r = baseShowScreen.apply(this, arguments);

        scheduleFit();
        checkRotate();

        return r;
    };

    // ==================================================
    // EVENT UKURAN / ORIENTASI / FULLSCREEN
    // ==================================================

    let viewQueued = false;

    function onViewport() {
        if (viewQueued) return;

        viewQueued = true;

        requestAnimationFrame(() => {
            viewQueued = false;

            applyMode();
            checkRotate();
            scheduleFit();
        });
    }

    window.addEventListener("resize", onViewport);

    window.addEventListener("orientationchange", () => {
        clearInput();

        onViewport();
        setTimeout(onViewport, 300);
    });

    if (window.screen && screen.orientation && screen.orientation.addEventListener) {
        screen.orientation.addEventListener("change", () => {
            onViewport();
            setTimeout(onViewport, 300);
        });
    }

    const onFsChange = () => {
        updateFsIcons();
        clearInput();

        onViewport();
        setTimeout(onViewport, 250);
    };

    document.addEventListener("fullscreenchange", onFsChange);
    document.addEventListener("webkitfullscreenchange", onFsChange);

    if (window.ResizeObserver) {
        const ro = new ResizeObserver(scheduleFit);

        ro.observe($("app"));

        if ($("gameScreen")) ro.observe($("gameScreen"));
    }

    // Perubahan kemampuan input (mouse dicabut/dipasang, dll.)
    ["(pointer: coarse)", "(pointer: fine)", "(any-pointer: fine)"].forEach(q => {
        try {
            const m = window.matchMedia(q);

            if (m.addEventListener) m.addEventListener("change", applyMode);
        } catch (e) { }
    });

    // Pemain mengganti arah layar di Pengaturan (TEGAK / MIRING)
    window.addEventListener("pq-orient", () => {
        skipRotate = false;
        autoTried = false;

        if (isPhone()) {
            lockPref().then(() => setTimeout(onViewport, 300));
        }

        onViewport();
    });

    // ==================================================
    // START
    // ==================================================

    applyMode();
    updateFsIcons();
    checkRotate();
    scheduleFit();

})();