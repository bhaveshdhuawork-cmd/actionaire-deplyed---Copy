/**
 * contact-form.js
 * Contact page form handler.
 * Opens the user's email client pre-populated with the form data.
 */

function submitContactForm(e) {
    if (e) e.preventDefault();

    var name    = document.getElementById('name');
    var email   = document.getElementById('email');
    var phone   = document.getElementById('phone');
    var message = document.getElementById('message');

    if (!name || !email || !phone || !message) return;

    if (!name.value.trim() || !email.value.trim()
        || !phone.value.trim() || !message.value.trim()) {
        alert('Please fill all fields');
        return;
    }

    var body = 'New Website Contact Enquiry:%0D%0A%0D%0A'
        + 'Name: '    + encodeURIComponent(name.value.trim())    + '%0D%0A'
        + 'Email: '   + encodeURIComponent(email.value.trim())   + '%0D%0A'
        + 'Phone: '   + encodeURIComponent(phone.value.trim())   + '%0D%0A'
        + 'Message: ' + encodeURIComponent(message.value.trim());

    var mailURL = 'mailto:info@actionaire.co'
        + '?subject=Website Contact Enquiry'
        + '&body=' + body;

    window.location.href = mailURL;

    alert('Thank you! Your email client has been opened to send your message.');

    var form = document.getElementById('contact_form');
    if (form) form.reset();
}
