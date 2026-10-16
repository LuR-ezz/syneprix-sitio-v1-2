document.addEventListener('DOMContentLoaded', () => {
    // 1. Configuración general del Observer para el scroll (aparición/desaparición)
    const observerOptions = {
        root: null,
        rootMargin: '200px 0px 0px 0px',
        threshold: 0.15
    };

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                // Rebobinar la animación al salir de pantalla
                entry.target.classList.remove('visible');
            }
        });
    }, observerOptions);

    const animateElements = document.querySelectorAll('.animate-on-scroll');
    animateElements.forEach((el) => {
        // No forzamos slide-up-stagger si ya tiene una animación específica (como shoji-left)
        if (!el.classList.contains('slide-up-stagger') && !el.classList.contains('shoji-left') && !el.classList.contains('shoji-right')) {
            el.classList.add('slide-up-stagger');
        }
        scrollObserver.observe(el);
    });

    // 2. Efecto Ola (text-wave-word)
    document.querySelectorAll('section h1, section h2, section h3, section h4, section p').forEach(el => {
        // Evitar aplicar en botones, estadísticas, tooltips, o elementos ya procesados
        if (!el.classList.contains('efecto-ola') && !el.closest('.stat-counter') && !el.closest('.hero-btns') && !el.closest('.btn') && !el.closest('.map-tooltip') && !el.closest('.testimonios')) {
            el.classList.add('efecto-ola');
        }
    });

    const waveObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                entry.target.classList.remove('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.efecto-ola').forEach(el => {
        let delayIndex = 0;
        function traverse(node) {
            if (node.nodeType === 3) {
                const text = node.nodeValue;
                if (text.trim().length > 0) {
                    const words = text.split(/(\s+)/);
                    const fragment = document.createDocumentFragment();
                    words.forEach((word) => {
                        if (word.trim().length > 0) {
                            const span = document.createElement('span');
                            span.innerText = word;
                            span.className = 'text-wave-word';
                            span.style.transitionDelay = `${Math.min(delayIndex * 0.03, 1.2)}s`;
                            delayIndex++;
                            fragment.appendChild(span);
                        } else {
                            fragment.appendChild(document.createTextNode(word));
                        }
                    });
                    node.parentNode.replaceChild(fragment, node);
                }
            } else if (node.nodeType === 1 && !node.classList.contains('text-wave-word')) {
                if (node.classList.contains('text-gradient')) {
                    node.classList.add('text-wave-word');
                    node.style.transitionDelay = `${Math.min(delayIndex * 0.03, 1.2)}s`;
                    delayIndex++;
                } else {
                    Array.from(node.childNodes).forEach(traverse);
                }
            }
        }
        
        if (!el.querySelector('.text-wave-word')) {
            Array.from(el.childNodes).forEach(traverse);
        }
        waveObserver.observe(el);
    });

    // 3. Efecto Parallax para orbes
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        document.querySelectorAll('.hero-orb, .parallax-bg').forEach(orb => {
            const speed = orb.getAttribute('data-speed') || 0.5;
            if (speed) {
                orb.style.transform = `translate(-50%, ${scrolled * speed}px)`;
            }
        });
    });

    // 4. Counter Animation (Repetir siempre)
    const animateCounters = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = +(counter.getAttribute('data-target') || counter.getAttribute('data-count'));
                const suffix = counter.getAttribute('data-suffix') || '';
                if (!target) return;
                
                const duration = 1200;
                const updateInterval = 20; 
                const step = target / (duration / updateInterval);
                let current = 0;

                const updateCounter = () => {
                    current += step;
                    if (current < target) {
                        counter.innerText = Math.ceil(current) + suffix;
                        setTimeout(updateCounter, updateInterval);
                    } else {
                        counter.innerText = target + suffix;
                    }
                };
                updateCounter();
            } else {
                // Reset counter so it animates again when scrolling back
                entry.target.innerText = "0" + (entry.target.getAttribute('data-suffix') || '');
            }
        });
    };

    const counterObserver = new IntersectionObserver(animateCounters, { threshold: 0.5 });
    document.querySelectorAll('.stat-counter, .metric-value.num').forEach(el => counterObserver.observe(el));
});
