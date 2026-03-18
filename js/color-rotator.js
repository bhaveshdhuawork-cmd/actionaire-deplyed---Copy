/**
 * color-rotator.js
 * Automatically cycles through fan color images in the home page
 * Color Customization promo section.
 */

document.addEventListener('DOMContentLoaded', function () {
    var promoImg = document.getElementById('promoFanImg');
    if (!promoImg) return;

    var colors = ['RED', 'GREEN', 'ORANGE', 'SKY BLUE', 'YELLOW'];
    var idx    = 0;

    setInterval(function () {
        idx = (idx + 1) % colors.length;

        promoImg.style.opacity = '0.7';

        setTimeout(function () {
            promoImg.src           = 'images/product color/' + colors[idx] + ' front.png';
            promoImg.style.opacity = '1';
        }, 300);
    }, 4000);
});
