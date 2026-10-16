(() => {
    'use strict';

    const body = document.body;
    if (!body.classList.contains('home-refresh')) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const revealGroups = [
        ['.hero .hero-text, .hero .hero-3d-wrapper', 110],
        ['.estadisticas .poster-stat', 70],
        ['.bento-grid-industries .industry-card', 45],
        ['.escuelas .escuela-card', 70],
        ['.nosotros-grid > *', 90],
        ['.diferenciacion .glass-panel', 70],
        ['.certificaciones .anatomy-grid > *', 90],
        ['#testi-carousel > .glass-panel', 55],
        ['.contacto .container > div > *', 90]
    ];

    const revealElements = [];
    revealGroups.forEach(([selector, step]) => {
        document.querySelectorAll(selector).forEach((element, index) => {
            element.dataset.homeReveal = index % 2 && selector.includes('> *') ? 'right' : 'up';
            element.style.setProperty('--home-delay', `${Math.min(index * step, 240)}ms`);
            revealElements.push(element);
        });
    });

    document.querySelectorAll('section:not(.hero) .section-title, .bento-section .container > div:first-of-type').forEach((element) => {
        if (!element.dataset.homeReveal) {
            element.dataset.homeReveal = 'up';
            revealElements.push(element);
        }
    });

    document.querySelectorAll('#testi-carousel > .glass-panel').forEach((card) => {
        card.classList.add('home-testimonial-card');
        card.removeAttribute('onmouseover');
        card.removeAttribute('onmouseout');
    });

    document.querySelectorAll('#testi-prev, #testi-next, .contacto [onmouseover]').forEach((element) => {
        element.removeAttribute('onmouseover');
        element.removeAttribute('onmouseout');
        element.removeAttribute('onmousedown');
        element.removeAttribute('onmouseup');
    });

    const showAll = () => revealElements.forEach((element) => element.classList.add('is-visible'));

    if (reducedMotion || !('IntersectionObserver' in window)) {
        showAll();
    } else {
        body.classList.add('motion-enabled');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            });
        }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

        revealElements.forEach((element) => observer.observe(element));
    }

    const counters = document.querySelectorAll('.stat-counter[data-target]');
    const animateCounter = (counter) => {
        const target = Number(counter.dataset.target || 0);
        const suffix = counter.dataset.suffix || '';
        const start = performance.now();
        const duration = 1050;

        const tick = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            counter.textContent = `${Math.round(target * eased)}${suffix}`;
            if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    };

    if (reducedMotion || !('IntersectionObserver' in window)) {
        counters.forEach((counter) => {
            counter.textContent = `${counter.dataset.target}${counter.dataset.suffix || ''}`;
        });
    } else {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            });
        }, { threshold: 0.55 });
        counters.forEach((counter) => counterObserver.observe(counter));
    }
})();
