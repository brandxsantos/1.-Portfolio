const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#primary-nav');
const themeToggle = document.querySelector('.theme-toggle');
const currentYear = document.querySelector('#current-year');
const contactForm = document.querySelector('#contact-form');
const formStatus = document.querySelector('#form-status');

currentYear.textContent = new Date().getFullYear();

if (new URLSearchParams(window.location.search).get('contact') === 'sent') {
    formStatus.textContent = 'Thanks—your message has been sent. I’ll get back to you soon.';
}

contactForm.addEventListener('submit', () => {
    const submitButton = contactForm.querySelector('.submit-button');
    submitButton.disabled = true;
    formStatus.classList.remove('is-error');
    formStatus.textContent = 'Sending your message...';
});

menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
    navigation.classList.toggle('is-open', !isOpen);
});

navigation.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
        navigation.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Open navigation');
    });
});

themeToggle.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark-theme');
    themeToggle.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
});
