/**
 * common.js
 * Shared utilities loaded on every page.
 * - Preloader: shows the loading spinner on internal link navigation
 * - Overlay panel (#extra-wrap) open / close logic
 * - Reveal animation via IntersectionObserver (.js-reveal elements)
 */

/* ── Preloader on internal navigation ─────────────────────────────── */
document.addEventListener('DOMContentLoaded', function () {
    var loader = document.getElementById('de-loader');
    if (!loader) return;

    document.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function (e) {
            var href   = this.getAttribute('href');
            var target = this.getAttribute('target');

            var isInternal = href
                && href.indexOf('#') !== 0
                && href.indexOf('javascript') === -1
                && target !== '_blank'
                && !e.ctrlKey
                && !e.metaKey;

            if (isInternal) {
                loader.style.display = 'flex';
            }
        });
    });
});

/* ── Overlay panel (#extra-wrap) ──────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function () {
    var extraWrap = document.getElementById('extra-wrap');
    var btnClose  = document.getElementById('btn-close');
    if (!extraWrap || !btnClose) return;

    btnClose.addEventListener('click', function () {
        extraWrap.classList.remove('open');
    });

    extraWrap.addEventListener('click', function (e) {
        if (e.target === extraWrap) {
            extraWrap.classList.remove('open');
        }
    });
});

/* ── Reveal animation (IntersectionObserver) ─────────────────────── */
(function () {
    var items = document.querySelectorAll('.js-reveal');
    if (!items.length) return;

    if (!('IntersectionObserver' in window)) {
        items.forEach(function (el) { el.classList.add('is-visible'); });
        return;
    }

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    items.forEach(function (el) { observer.observe(el); });
}());
