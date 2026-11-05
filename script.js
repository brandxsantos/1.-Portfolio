const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#primary-nav');
const themeToggle = document.querySelector('.theme-toggle');
const currentYear = document.querySelector('#current-year');
const contactForm = document.querySelector('#contact-form');
const formStatus = document.querySelector('#form-status');

currentYear.textContent = new Date().getFullYear();

contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const submitButton = contactForm.querySelector('.submit-button');
    submitButton.disabled = true;
    formStatus.classList.remove('is-error');
    formStatus.textContent = 'Sending your message...';

    try {
        const response = await fetch(contactForm.action, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify(Object.fromEntries(new FormData(contactForm)))
        });
        const result = await response.json();

        if (!response.ok || result.success !== true) {
            throw new Error(typeof result.message === 'string' ? result.message : 'Please try again in a moment.');
        }

        formStatus.textContent = 'Thanks—your message has been sent. I’ll get back to you soon.';
        contactForm.reset();
    } catch (error) {
        formStatus.classList.add('is-error');
        formStatus.textContent = error instanceof Error
            ? `Sorry, your message could not be sent. ${error.message}`
            : 'Sorry, your message could not be sent. Please try again.';
    } finally {
        submitButton.disabled = false;
    }
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
