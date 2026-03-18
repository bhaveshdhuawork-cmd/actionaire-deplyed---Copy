/**
 * product-detail.js
 * Shared utilities for all product detail pages.
 *
 * Functions:
 *  - changeImage()       – thumbnail gallery switcher
 *  - selectSize()        – size button selector + message auto-fill
 *  - updateMessage()     – builds the WhatsApp enquiry message dynamically
 *  - sendWhatsApp()      – opens WhatsApp with the enquiry message
 *  - sendProductEnquiry()– legacy enquiry sender (older product pages)
 *
 * For pages that use a hardcoded product name, add a data-product attribute
 * to the <form id="enquiry_form"> element, e.g.:
 *   <form id="enquiry_form" data-product="Heavy Duty Wall Fan" ...>
 */

/* ── Thumbnail gallery ──────────────────────────────────────────── */
function changeImage(element) {
    var mainImage = document.getElementById('main-image');
    var mainLink  = document.getElementById('main-image-link');

    if (mainImage) mainImage.src = element.src;
    if (mainLink)  mainLink.href = element.src;

    document.querySelectorAll('.product-thumb').forEach(function (thumb) {
        thumb.classList.remove('active');
    });
    element.classList.add('active');
}

/* ── Size selector ──────────────────────────────────────────────── */
function selectSize(size) {
    document.querySelectorAll('.size-btn').forEach(function (btn) {
        if (btn.innerText.includes(size)) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    var sizeDisplay = document.getElementById('selected-size-display');
    var sizeField   = document.getElementById('f_size');

    if (sizeDisplay) sizeDisplay.innerText = size + ' inch';
    if (sizeField)   sizeField.value       = size + ' inch';

    updateMessage();
}

/* ── Build enquiry message ──────────────────────────────────────── */
function updateMessage() {
    var size   = document.getElementById('f_size')     ? document.getElementById('f_size').value     : '';
    var qty    = document.getElementById('f_qty')      ? document.getElementById('f_qty').value      : '';
    var type   = document.getElementById('f_type')     ? document.getElementById('f_type').value     : '';
    var cat    = document.getElementById('f_category') ? document.getElementById('f_category').value : '';
    var family = document.getElementById('f_family')   ? document.getElementById('f_family').value   : '';

    var form    = document.getElementById('enquiry_form');
    var product = (form && form.getAttribute('data-product')) || 'your product';

    var msg;
    if (family && cat && type) {
        msg = 'Hello, I want ' + family + ' ' + cat + ' ' + type
            + ', Size: ' + size + ', Quantity: ' + qty
            + '. Please share price and delivery timeline.';
    } else if (type) {
        msg = 'Hello, I want ' + type
            + ', Size: ' + size + ', Quantity: ' + qty
            + '. Please share price.';
    } else {
        msg = 'Hello, I want ' + product
            + ', Size: ' + size + ', Quantity: ' + qty
            + '. Please share price and delivery timeline.';
    }

    var msgField = document.getElementById('f_message');
    if (msgField) msgField.value = msg;
}

/* ── Send WhatsApp enquiry ──────────────────────────────────────── */
function sendWhatsApp() {
    updateMessage();
    var msgField = document.getElementById('f_message');
    if (!msgField) return;
    var whatsappURL = 'https://wa.me/918527614600?text=' + encodeURIComponent(msgField.value);
    window.open(whatsappURL, '_blank');
}

/* ── Legacy enquiry sender (commercial-air-circulator pages) ────── */
function sendProductEnquiry() {
    var nameEl    = document.getElementById('p_name');
    var emailEl   = document.getElementById('p_email');
    var messageEl = document.getElementById('p_message');

    if (!nameEl || !emailEl || !messageEl) return;

    var form    = document.getElementById('enquiry_form');
    var product = (form && form.getAttribute('data-product')) || 'Product';

    var text = 'Product Enquiry: ' + product + '%0A%0A'
        + 'Name: '    + encodeURIComponent(nameEl.value.trim())    + '%0A'
        + 'Email: '   + encodeURIComponent(emailEl.value.trim())   + '%0A'
        + 'Message: ' + encodeURIComponent(messageEl.value.trim());

    var whatsappURL = 'https://wa.me/918527614600?text=' + text;
    window.open(whatsappURL, '_blank');
}

/* ── Auto-init: select default size on page load ────────────────── */
document.addEventListener('DOMContentLoaded', function () {
    var sizeButtons = document.querySelectorAll('.size-btn');
    if (sizeButtons.length) {
        selectSize('18');
    }
});
