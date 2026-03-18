/**
 * gallery-lightbox.js
 * Bootstrap modal lightbox initialisation for the Gallery page.
 * Populates the lightbox image src from the clicked gallery card's
 * data-img attribute when the modal is shown.
 */

document.addEventListener('DOMContentLoaded', function () {
    var modal = document.getElementById('lightboxModal');
    var img   = document.getElementById('lightboxImg');

    if (!modal || !img) return;

    modal.addEventListener('show.bs.modal', function (event) {
        var btn  = event.relatedTarget;
        var card = btn ? btn.closest('.gallery-card') : null;
        var src  = card ? card.getAttribute('data-img') : '';
        img.src  = src || '';
    });
});
