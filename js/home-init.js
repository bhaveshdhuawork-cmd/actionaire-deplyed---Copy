/**
 * home-init.js
 * Home page specific initializations:
 * - Hero Swiper slider
 * - Smooth scroll (CSS scroll-behavior + scroll-snap polish)
 */

/* ── Hero Swiper ─────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function () {
    var heroSlider = document.querySelector('.swiper-container-full');
    if (!heroSlider) return;

    new Swiper('.swiper-container-full', {
        loop: true,
        speed: 800,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        effect: 'fade',
        fadeEffect: {
            crossFade: true,
        },
    });
});
