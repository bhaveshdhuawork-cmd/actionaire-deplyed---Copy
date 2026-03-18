/**
 * accordion.js
 * Accessible accordion component.
 * Used on bldc.html, air-circulators.html, and exhaust-blower.html.
 *
 * Markup requirements:
 *   <div class="js-ac-accordion">
 *     <button class="js-ac-toggle" aria-expanded="false">...</button>
 *     <div class="js-ac-body">
 *       <div class="ac-cat-body-inner">...</div>
 *     </div>
 *   </div>
 */

(function () {
    'use strict';

    var accordions = document.querySelectorAll('.js-ac-accordion');
    if (!accordions.length) return;

    function closeAll(except) {
        accordions.forEach(function (acc) {
            if (acc === except) return;
            acc.classList.remove('is-open');
            var btn  = acc.querySelector('.js-ac-toggle');
            var body = acc.querySelector('.js-ac-body');
            if (btn)  btn.setAttribute('aria-expanded', 'false');
            if (body) body.style.maxHeight = '0px';
        });
    }

    function openAccordion(acc) {
        var btn   = acc.querySelector('.js-ac-toggle');
        var body  = acc.querySelector('.js-ac-body');
        var inner = body ? body.querySelector('.ac-cat-body-inner') : null;
        acc.classList.add('is-open');
        if (btn)  btn.setAttribute('aria-expanded', 'true');
        if (body) body.style.maxHeight = (inner ? inner.scrollHeight : body.scrollHeight) + 'px';
    }

    function toggleAccordion(acc) {
        if (acc.classList.contains('is-open')) {
            acc.classList.remove('is-open');
            var btn  = acc.querySelector('.js-ac-toggle');
            var body = acc.querySelector('.js-ac-body');
            if (btn)  btn.setAttribute('aria-expanded', 'false');
            if (body) body.style.maxHeight = '0px';
            return;
        }
        closeAll(acc);
        openAccordion(acc);
    }

    /* ── Init ───────────────────────────────────────────────────────── */
    accordions.forEach(function (acc) {
        var btn  = acc.querySelector('.js-ac-toggle');
        var body = acc.querySelector('.js-ac-body');

        if (acc.classList.contains('is-open')) {
            openAccordion(acc);
        } else if (body) {
            body.style.maxHeight = '0px';
        }

        if (btn) {
            btn.addEventListener('click', function () { toggleAccordion(acc); });
        }
    });

    /* ── Recalculate heights on resize ──────────────────────────────── */
    window.addEventListener('resize', function () {
        var open = document.querySelector('.js-ac-accordion.is-open');
        if (!open) return;
        var body  = open.querySelector('.js-ac-body');
        var inner = open.querySelector('.ac-cat-body-inner');
        if (body && inner) body.style.maxHeight = inner.scrollHeight + 'px';
    });
}());
