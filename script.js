const contactForm = document.querySelector('#contact-form');
const formStatus = document.querySelector('#form-status');
const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#primary-nav');
const themeToggle = document.querySelector('.theme-toggle');
const currentYear = document.querySelector('#current-year');
const storageKey = 'yourNamePortfolioMessages';

currentYear.textContent = new Date().getFullYear();

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

contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    formStatus.textContent = '';
    formStatus.classList.remove('is-error');

    const formData = new FormData(contactForm);
    const newMessage = {
        name: formData.get('name').trim(),
        email: formData.get('email').trim(),
        message: formData.get('message').trim(),
        createdAt: new Date().toISOString()
    };

    try {
        const savedMessages = localStorage.getItem(storageKey);
        const messages = savedMessages === null ? [] : JSON.parse(savedMessages);

        if (!Array.isArray(messages)) {
            throw new Error('Saved contact data is not in the expected format.');
        }

        messages.push(newMessage);
        localStorage.setItem(storageKey, JSON.stringify(messages));
        contactForm.reset();
        formStatus.textContent = 'Your message has been saved in this browser.';
    } catch (error) {
        console.error('Unable to save the contact message:', error);
        formStatus.textContent = 'Could not save your message. Check browser storage settings and try again.';
        formStatus.classList.add('is-error');
    }
});
