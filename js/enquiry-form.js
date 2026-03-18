/**
 * enquiry-form.js
 * Home page quick enquiry form handler.
 * Sends form data via WhatsApp and opens the user's email client.
 */

function sendEnquiry() {
    var name    = document.getElementById('name');
    var email   = document.getElementById('email');
    var message = document.getElementById('message');

    if (!name || !email || !message) return;

    if (!name.value.trim() || !email.value.trim() || !message.value.trim()) {
        alert('Please fill all fields');
        return;
    }

    var text = 'New Fan Customization Enquiry:%0A%0A'
        + 'Name: '        + encodeURIComponent(name.value.trim())    + '%0A'
        + 'Email: '       + encodeURIComponent(email.value.trim())   + '%0A'
        + 'Requirement: ' + encodeURIComponent(message.value.trim());

    var whatsappURL = 'https://wa.me/918527614600?text=' + text;
    var mailURL     = 'mailto:info@actionaire.co'
        + '?subject=Fan Customization Enquiry'
        + '&body=' + text;

    window.open(whatsappURL, '_blank');
    window.location.href = mailURL;
}
