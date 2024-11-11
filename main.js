// Fonctions utilitaires
const utils = {
    // Sélecteur d'éléments optimisé
    select: (selector, parent = document) => parent.querySelector(selector),
    selectAll: (selector, parent = document) => parent.querySelectorAll(selector),
    
    // Ajout d'événements avec vérification
    addEvent: (element, event, handler) => {
        if (element) {
            element.addEventListener(event, handler);
        }
    },
    
    // Gestion des classes avec vérification
    toggleClass: (element, className) => {
        if (element) {
            element.classList.toggle(className);
        }
    }
};

// Gestionnaire principal
class SiteManager {
    constructor() {
        // Éléments du menu mobile
        this.menuButton = utils.select('.menu-button');
        this.nav = utils.select('.nav');
        
        // Options pour l'Intersection Observer
        this.observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };
        
        this.init();
    }
    
    init() {
        this.initMobileMenu();
        this.initScrollAnimations();
        this.initSmoothScroll();
        this.initLazyLoading();
        this.initServiceCards();
        this.initResizeHandler();
        this.initFontsLoading();
        this.checkReduceMotion();
    }
    
    // Menu mobile
    initMobileMenu() {
        utils.addEvent(this.menuButton, 'click', () => {
            utils.toggleClass(this.menuButton, 'is-open');
            utils.toggleClass(this.nav, 'is-open');
        });
    }
    
    // Animations au scroll
    initScrollAnimations() {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, this.observerOptions);

        utils.selectAll('.service-card, .testimonial, .about-content, .instagram-item')
            .forEach(el => {
                el.classList.add('fade-in');
                observer.observe(el);
            });
    }
    
    // Smooth scroll
    initSmoothScroll() {
        utils.selectAll('a[href^="#"]').forEach(anchor => {
            utils.addEvent(anchor, 'click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href');
                
                if (targetId === '#') return;
                
                const target = utils.select(targetId);
                target?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            });
        });
    }
    
    // Lazy loading images
    initLazyLoading() {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                }
            });
        }, this.observerOptions);

        utils.selectAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // Animation des cartes services
    initServiceCards() {
        utils.selectAll('.service-card').forEach(card => {
            utils.addEvent(card, 'mouseenter', () => {
                card.style.transform = 'translateY(-5px)';
            });
            
            utils.addEvent(card, 'mouseleave', () => {
                card.style.transform = 'translateY(0)';
            });
        });
    }
    
    // Gestion du redimensionnement
    initResizeHandler() {
        let resizeTimer;
        utils.addEvent(window, 'resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                // Ajoutez ici les ajustements nécessaires
            }, 250);
        });
    }
    
    // Chargement des polices
    initFontsLoading() {
        document.fonts.ready.then(() => {
            document.documentElement.classList.add('fonts-loaded');
        });
    }
    
    // Vérification des préférences de mouvement
    checkReduceMotion() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.documentElement.classList.add('reduce-motion');
        }
    }
}

// Initialisation après chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
    new SiteManager();
});
