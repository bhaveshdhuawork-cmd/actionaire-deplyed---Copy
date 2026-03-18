/**
 * fan-showcase.js
 * Scroll-driven canvas frame animation for the Fan Engineering Showcase section.
 * Used only on home.html.
 */

(function () {
    'use strict';

    /* ── Element references ─────────────────────────────────────────── */
    var section      = document.getElementById('fanShowcase');
    var canvas       = document.getElementById('fanShowcaseCanvas');
    var textsWrap    = document.getElementById('fanShowcaseTexts');
    var scrollHint   = document.getElementById('fanScrollHint');
    if (!section || !canvas) return;

    var ctx          = canvas.getContext('2d');
    var textBlocks   = textsWrap ? Array.from(textsWrap.querySelectorAll('.fan-showcase__text')) : [];
    var dots         = Array.from(section.querySelectorAll('.fan-showcase__dot'));
    var counterCurrent = section.querySelector('.fan-showcase__counter-current');

    /* ── Config ─────────────────────────────────────────────────────── */
    var CONFIG = {
        folder:      'images/scroll-seq',
        startFrame:  10160,
        frameCount:  151,   /* frames 10160 – 10310 */
        animPortion: 0.8,   /* animation completes over 80 % of scroll  */
    };

    /* ── State ──────────────────────────────────────────────────────── */
    var images      = new Array(CONFIG.frameCount);
    var lastGood    = 0;
    var ticking     = false;
    var hintHidden  = false;
    var targetFrame = 0;

    /* ── Helpers ────────────────────────────────────────────────────── */
    function clamp(v, min, max) { return Math.min(max, Math.max(min, v)); }

    function frameSrc(i) {
        return CONFIG.folder + '/f2q' + (CONFIG.startFrame + i) + '.png';
    }

    /* ── Canvas sizing ──────────────────────────────────────────────── */
    function resizeCanvas() {
        var dpr  = Math.max(1, window.devicePixelRatio || 1);
        var rect = canvas.getBoundingClientRect();
        canvas.width  = Math.floor(rect.width  * dpr);
        canvas.height = Math.floor(rect.height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    /* ── Image crop preset ──────────────────────────────────────────── */
    function getCropPreset() {
        var isMobile = window.matchMedia('(max-width: 768px)').matches;
        return isMobile
            ? { mode: 'contain', zoom: 0.95, panX: 0.50, panY: 0.35 }
            : { mode: 'contain', zoom: 0.85, panX: 0.50, panY: 0.50 };
    }

    /* ── Draw a single frame ────────────────────────────────────────── */
    function drawFrame(index) {
        index = clamp(index, 0, CONFIG.frameCount - 1);

        var img         = images[index];
        var isReady     = img && img.complete && img.naturalWidth > 0;
        var fallback    = images[lastGood];
        var hasFallback = fallback && fallback.complete && fallback.naturalWidth > 0;
        var src         = isReady ? img : hasFallback ? fallback : null;

        if (!src) return;
        if (isReady) lastGood = index;

        var cw = canvas.clientWidth;
        var ch = canvas.clientHeight;
        var iw = src.naturalWidth;
        var ih = src.naturalHeight;

        var preset = getCropPreset();
        var base   = preset.mode === 'contain'
            ? Math.min(cw / iw, ch / ih)
            : Math.max(cw / iw, ch / ih);

        var scale = base * preset.zoom;
        var w     = iw * scale;
        var h     = ih * scale;

        ctx.clearRect(0, 0, cw, ch);
        ctx.drawImage(src, (cw - w) * preset.panX, (ch - h) * preset.panY, w, h);
    }

    /* ── Scroll progress 0 → 1 ──────────────────────────────────────── */
    function getScrollProgress() {
        var rect    = section.getBoundingClientRect();
        var vh      = window.innerHeight;
        if (rect.top >= vh) return 0;
        if (rect.bottom <= 0) return 1;
        var total   = section.offsetHeight - vh;
        var scrolled = clamp(-rect.top, 0, total);
        return total > 0 ? scrolled / total : 0;
    }

    /* ── Map progress to step 0 / 1 / 2 ────────────────────────────── */
    function stepFromProgress(p) {
        if (p < 0.34) return 0;
        if (p < 0.67) return 1;
        return 2;
    }

    /* ── Activate the correct step ──────────────────────────────────── */
    function setActiveStep(step) {
        textBlocks.forEach(function (el, i) { el.classList.toggle('is-active', i === step); });
        dots.forEach(function (d, i) { d.classList.toggle('is-active', i === step); });
        if (counterCurrent) {
            counterCurrent.textContent = String(step + 1).padStart(2, '0');
        }
    }

    /* ── Hide scroll hint after first scroll ────────────────────────── */
    function hideScrollHint() {
        if (hintHidden || !scrollHint) return;
        hintHidden = true;
        scrollHint.classList.add('hidden');
    }

    /* ── Master update on every scroll tick ─────────────────────────── */
    function update() {
        var p     = getScrollProgress();
        var animP = clamp(p / CONFIG.animPortion, 0, 1);

        targetFrame = Math.round(animP * (CONFIG.frameCount - 1));
        drawFrame(targetFrame);
        setActiveStep(stepFromProgress(p));

        if (p > 0.02) hideScrollHint();
    }

    /* ── Batched preload ─────────────────────────────────────────────
     * Loads frames in small batches using requestIdleCallback (or
     * setTimeout fallback) so the browser is never overwhelmed with
     * 151 simultaneous network requests, which caused the page lag.
     * Strategy:
     *   1. Load frame 0 immediately so the canvas shows right away.
     *   2. Load the next ~10 frames (near-future scroll range).
     *   3. Load remaining frames lazily during browser idle time.
     * ──────────────────────────────────────────────────────────────── */
    var BATCH_SIZE   = 8;     /* frames per idle batch */
    var preloadNext  = 1;     /* next frame index to preload */

    function loadFrame(idx, onFirstLoad) {
        if (images[idx]) return;          /* already queued */
        var im = new Image();
        images[idx] = im;
        if (onFirstLoad) {
            im.onload = onFirstLoad;
        }
        im.src = frameSrc(idx);
    }

    function loadBatch() {
        var end = Math.min(preloadNext + BATCH_SIZE, CONFIG.frameCount);
        for (var i = preloadNext; i < end; i++) {
            loadFrame(i, null);
        }
        preloadNext = end;
        if (preloadNext < CONFIG.frameCount) {
            scheduleBatch();
        }
    }

    function scheduleBatch() {
        if (typeof requestIdleCallback === 'function') {
            requestIdleCallback(loadBatch, { timeout: 400 });
        } else {
            setTimeout(loadBatch, 100);
        }
    }

    function preload() {
        /* Frame 0 — load immediately, draw canvas as soon as it arrives */
        loadFrame(0, function () {
            resizeCanvas();
            drawFrame(0);
            update();
        });
        /* Frames 1-15 — load soon for smooth early scrolling */
        for (var i = 1; i <= Math.min(15, CONFIG.frameCount - 1); i++) {
            loadFrame(i, null);
        }
        preloadNext = 16;
        /* Remaining frames — load lazily during idle time */
        scheduleBatch();
    }

    /* ── Event listeners ────────────────────────────────────────────── */
    window.addEventListener('scroll', function () {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(function () {
            update();
            ticking = false;
        });
    }, { passive: true });

    window.addEventListener('resize', function () {
        resizeCanvas();
        update();
    });

    /* ── Init ───────────────────────────────────────────────────────── */
    resizeCanvas();
    preload();
    setActiveStep(0);

}());
