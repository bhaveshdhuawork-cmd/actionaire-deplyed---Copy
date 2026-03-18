/**
 * color-customization.js
 * Color swatch selector for the Color Customization page.
 * Updates the product preview image and WhatsApp enquiry link
 * when a color swatch button is clicked.
 */

document.addEventListener('DOMContentLoaded', function () {
    var btns    = document.querySelectorAll('.color-swatch-btn');
    var img     = document.getElementById('mainFanImg');
    var label   = document.getElementById('colorNameLabel');
    var waBtn   = document.getElementById('waCustomBtn');
    var waPhone = '8527614600';

    if (!btns.length || !img) return;

    function updateWhatsAppLink(colorText) {
        if (!waBtn) return;
        var text = 'Hi ActionAire, I am interested in a custom color fan in color: ' + colorText + '.';
        waBtn.href = 'https://wa.me/' + waPhone + '?text=' + encodeURIComponent(text);
        waBtn.setAttribute('target', '_blank');
    }

    btns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            btns.forEach(function (b) { b.classList.remove('active'); });
            this.classList.add('active');

            var colorFile = this.getAttribute('data-color');
            var colorDesc = this.getAttribute('title');

            if (label) label.textContent = colorDesc;

            img.style.opacity = '0.3';
            setTimeout(function () {
                img.src = 'images/product color/' + colorFile + ' front.png';
                img.onload = function () { img.style.opacity = '1'; };
            }, 200);

            updateWhatsAppLink(colorDesc);
        });
    });

    /* Initialise with default colour */
    updateWhatsAppLink('Black');
});
