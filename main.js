// Fonctions utilitaires
const utils = {
    select: (selector, parent = document) => parent.querySelector(selector),
    selectAll: (selector, parent = document) => parent.querySelectorAll(selector),
    
    addEvent: (element, event, handler) => {
        if (element) {
            element.addEventListener(event, handler);
        }
    },
    
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
        this.nav = utils.select('nav');  // Changé pour sélectionner directement le nav
        this.menuOpen = false;  // État du menu
        
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
        this.updateCopyrightYear();
    }
    
    // Menu mobile
    initMobileMenu() {
        if (this.menuButton && this.nav) {
            this.menuButton.addEventListener('click', () => {
                this.menuOpen = !this.menuOpen;
                this.menuButton.classList.toggle('is-open');
                this.nav.classList.toggle('is-open');
                
                // Optionnel : empêcher le défilement du body quand le menu est ouvert
                document.body.style.overflow = this.menuOpen ? 'hidden' : '';
            });

            // Fermer le menu en cliquant sur un lien
            const menuLinks = this.nav.querySelectorAll('a');
            menuLinks.forEach(link => {
                link.addEventListener('click', () => {
                    if (this.menuOpen) {
                        this.menuButton.classList.remove('is-open');
                        this.nav.classList.remove('is-open');
                        this.menuOpen = false;
                        document.body.style.overflow = '';
                    }
                });
            });
        }
    }

    // Mise à jour de l'année dans le copyright
    updateCopyrightYear() {
        const yearElement = utils.select('.current-year');
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }
    }
    
    // [Le reste des méthodes reste inchangé...]
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
    
    initResizeHandler() {
        let resizeTimer;
        utils.addEvent(window, 'resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                // Réinitialiser l'état du menu si nécessaire sur desktop
                if (window.innerWidth > 991 && this.menuOpen) {
                    this.menuButton.classList.remove('is-open');
                    this.nav.classList.remove('is-open');
                    this.menuOpen = false;
                    document.body.style.overflow = '';
                }
            }, 250);
        });
    }
    
    initFontsLoading() {
        document.fonts.ready.then(() => {
            document.documentElement.classList.add('fonts-loaded');
        });
    }
    
    checkReduceMotion() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.documentElement.classList.add('reduce-motion');
        }
    }
}

// Une seule initialisation
document.addEventListener('DOMContentLoaded', () => {
    new SiteManager();
});
