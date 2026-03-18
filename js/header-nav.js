/**
 * Header Scroll Effect & Mobile Navigation
 * Shared across all pages
 */

// Header scroll effect
document.addEventListener("DOMContentLoaded", function () {
    const header = document.querySelector(".aa-header");
    if (!header) return;

    window.addEventListener("scroll", function () {
        if (window.scrollY > 60) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    });
});

// Mobile navigation
document.addEventListener("DOMContentLoaded", function () {
    const burger = document.querySelector(".aa-burger");
    const mobile = document.getElementById("aaMobileNav");
    const closeBtn = document.querySelector(".aa-mobile__close");

    if (!burger || !mobile) return;

    function openMenu() {
        mobile.classList.add("is-open");
        mobile.setAttribute("aria-hidden", "false");
        burger.setAttribute("aria-expanded", "true");
        document.body.style.overflow = "hidden";
    }

    function closeMenu() {
        mobile.classList.remove("is-open");
        mobile.setAttribute("aria-hidden", "true");
        burger.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
    }

    burger.addEventListener("click", openMenu);
    if (closeBtn) closeBtn.addEventListener("click", closeMenu);

    mobile.addEventListener("click", function (e) {
        if (e.target === mobile) closeMenu();
    });

    // Mobile dropdowns
    document.querySelectorAll(".aa-mobile__drop").forEach(function (wrap) {
        var btn = wrap.querySelector(".aa-mobile__dropbtn");
        if (!btn) return;

        btn.addEventListener("click", function () {
            var isOpen = wrap.classList.toggle("is-open");
            btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
        });
    });
});
