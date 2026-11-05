const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#primary-nav');
const currentYear = document.querySelector('#current-year');
const contactForm = document.querySelector('#contact-form');
const formStatus = document.querySelector('#form-status');
const matrixCanvas = document.querySelector('#matrix-rain');
const matrixContext = matrixCanvas.getContext('2d');
const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
const matrixCharacters = '01ABCDEFアイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホ';
const matrixColors = ['#00ff41', '#00d936', '#00b82e', '#008f27', '#39ff72'];
const matrixState = {
    columns: [],
    width: 0,
    height: 0,
    pixelRatio: 1,
    frameId: 0,
    lastFrame: 0,
    mouseX: -1,
    mouseY: -1
};

currentYear.textContent = new Date().getFullYear();

function resizeMatrixCanvas() {
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
    matrixState.width = window.innerWidth;
    matrixState.height = window.innerHeight;
    matrixState.pixelRatio = pixelRatio;
    matrixCanvas.width = Math.round(matrixState.width * pixelRatio);
    matrixCanvas.height = Math.round(matrixState.height * pixelRatio);
    matrixContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

    const columnGap = window.innerWidth < 600 ? 30 : 24;
    const columnCount = Math.ceil(matrixState.width / columnGap);
    matrixState.columns = Array.from({ length: columnCount }, (_, index) => {
        const fontSize = 12 + Math.random() * 8;
        return {
            x: index * columnGap + Math.random() * 8,
            y: Math.random() * matrixState.height,
            speed: 28 + Math.random() * 62,
            fontSize,
            tailLength: 5 + Math.floor(Math.random() * 9),
            color: matrixColors[Math.floor(Math.random() * matrixColors.length)],
            characterOffset: Math.floor(Math.random() * matrixCharacters.length)
        };
    });
}

function drawMatrixRain(timestamp) {
    if (document.hidden || reducedMotionQuery.matches) {
        matrixState.frameId = 0;
        return;
    }

    if (timestamp - matrixState.lastFrame < 33) {
        matrixState.frameId = window.requestAnimationFrame(drawMatrixRain);
        return;
    }

    const delta = Math.min((timestamp - (matrixState.lastFrame || timestamp)) / 1000, 0.05);
    matrixState.lastFrame = timestamp;
    matrixContext.clearRect(0, 0, matrixState.width, matrixState.height);

    if (matrixState.mouseX >= 0 && matrixState.mouseY >= 0) {
        const glow = matrixContext.createRadialGradient(
            matrixState.mouseX, matrixState.mouseY, 0,
            matrixState.mouseX, matrixState.mouseY, 180
        );
        glow.addColorStop(0, 'rgba(0, 255, 65, 0.035)');
        glow.addColorStop(1, 'rgba(0, 255, 65, 0)');
        matrixContext.fillStyle = glow;
        matrixContext.fillRect(0, 0, matrixState.width, matrixState.height);
    }

    matrixState.columns.forEach((column) => {
        matrixContext.font = `${column.fontSize}px monospace`;

        for (let index = 0; index < column.tailLength; index += 1) {
            const characterY = column.y - index * column.fontSize;
            if (characterY < 0 || characterY > matrixState.height) continue;

            const characterIndex = (
                column.characterOffset + Math.floor(column.y / column.fontSize) + index
            ) % matrixCharacters.length;
            const alpha = Math.max(0.06, 0.55 - index * (0.47 / column.tailLength));
            matrixContext.fillStyle = index === 0
                ? '#caffd5'
                : `${column.color}${Math.round(alpha * 255).toString(16).padStart(2, '0')}`;
            matrixContext.fillText(matrixCharacters[characterIndex], column.x, characterY);
        }

        column.y += column.speed * delta;
        if (column.y - column.tailLength * column.fontSize > matrixState.height) {
            column.y = -Math.random() * matrixState.height * 0.45;
            column.speed = 28 + Math.random() * 62;
            column.characterOffset = Math.floor(Math.random() * matrixCharacters.length);
        }
    });

    matrixState.frameId = window.requestAnimationFrame(drawMatrixRain);
}

function startMatrixRain() {
    if (matrixState.frameId || document.hidden || reducedMotionQuery.matches) return;
    matrixState.lastFrame = 0;
    matrixState.frameId = window.requestAnimationFrame(drawMatrixRain);
}

function stopMatrixRain() {
    if (!matrixState.frameId) return;
    window.cancelAnimationFrame(matrixState.frameId);
    matrixState.frameId = 0;
}

resizeMatrixCanvas();
startMatrixRain();
window.addEventListener('resize', resizeMatrixCanvas, { passive: true });
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        stopMatrixRain();
    } else {
        startMatrixRain();
    }
});
reducedMotionQuery.addEventListener('change', () => {
    if (reducedMotionQuery.matches) {
        stopMatrixRain();
        matrixContext.clearRect(0, 0, matrixState.width, matrixState.height);
    } else {
        startMatrixRain();
    }
});
window.addEventListener('pointermove', (event) => {
    if (event.pointerType !== 'mouse') return;
    matrixState.mouseX = event.clientX;
    matrixState.mouseY = event.clientY;
}, { passive: true });
window.addEventListener('pointerleave', () => {
    matrixState.mouseX = -1;
    matrixState.mouseY = -1;
}, { passive: true });

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
