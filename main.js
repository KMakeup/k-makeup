// Gestion du menu mobile
document.addEventListener('DOMContentLoaded', function() {
    const menuButton = document.querySelector('.menu-button');
    const nav = document.querySelector('.nav');
    
    menuButton.addEventListener('click', function() {
        this.classList.toggle('is-open');
        nav.classList.toggle('is-open');
    });
});
// Intersection Observer pour les animations au scroll
document.addEventListener('DOMContentLoaded', function() {
    // Animation des éléments au scroll
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // On n'observe plus une fois animé
            }
        });
    }, observerOptions);

    // Sélectionne tous les éléments à animer
    document.querySelectorAll('.service-card, .testimonial, .about-content, .instagram-item').forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    // Smooth scroll pour les ancres
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Lazy loading des images Instagram
    const lazyLoadImages = () => {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    };

    lazyLoadImages();

    // Gestion du hover sur les cartes de service
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Optimisation des performances
    let resizeTimer;
    window.addEventListener('resize', () => {
        // Throttle des événements de resize
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            // Ajustements responsive si nécessaire
        }, 250);
    });
});

// Gestion du chargement des polices
document.fonts.ready.then(() => {
    document.documentElement.classList.add('fonts-loaded');
});

// Pour la performance, on peut désactiver certaines animations sur mobile
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.classList.add('reduce-motion');
}
