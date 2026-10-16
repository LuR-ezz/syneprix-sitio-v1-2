function initResponsiveNavigation() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (!menuToggle || !navLinks || menuToggle.dataset.ready === 'true') return;
    menuToggle.dataset.ready = 'true';

    const setOpen = (open) => {
        navLinks.classList.toggle('active', open);
        menuToggle.setAttribute('aria-expanded', String(open));
        menuToggle.setAttribute('aria-label', open ? 'Cerrar menú principal' : 'Abrir menú principal');
        menuToggle.textContent = open ? '×' : '☰';
    };

    menuToggle.addEventListener('click', () => setOpen(!navLinks.classList.contains('active')));
    navLinks.addEventListener('click', (event) => {
        if (event.target.closest('a')) setOpen(false);
    });

    // Cerrar el menú si se hace click fuera de él
    document.addEventListener('click', (e) => {
        if (navLinks.classList.contains('active') && !navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
            setOpen(false);
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && navLinks.classList.contains('active')) {
            setOpen(false);
            menuToggle.focus();
        }
    });
}

function initNavbarScroll() {
    if (document.documentElement.dataset.navScrollReady === 'true') return;
    document.documentElement.dataset.navScrollReady = 'true';
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        if (header) {
            header.classList.toggle('scrolled', window.scrollY > 50);
        }
    }, { passive: true });
}

document.addEventListener('DOMContentLoaded', () => {
    initResponsiveNavigation();
    initNavbarScroll();
});
document.addEventListener('componentsLoaded', initResponsiveNavigation);
