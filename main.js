// Fonctions utilitaires
const utils = {
    select: (selector, parent = document) => parent.querySelector(selector),
    selectAll: (selector, parent = document) => Array.from(parent.querySelectorAll(selector)),
    
    addEvent: (element, event, handler) => {
        if (element) {
            element.addEventListener(event, handler);
        }
    },
    
    createObserver: (callback, options = {}) => {
        return new IntersectionObserver(callback, {
            root: null,
            rootMargin: '0px',
            threshold: 0.1,
            ...options
        });
    }
};

class SiteManager {
    constructor() {
        // Initialisation des propriétés de classe
        this.menuButton = utils.select('.menu-button');
        this.nav = utils.select('nav');
        this.menuOpen = false;
        
        this.init();
    }
    
    init() {
        // Fonctionnalités de base
        this.initMobileMenu();
        this.initAnimations();
        this.initGlobalEvents();
        this.updateCopyrightYear();
        
        // Fonctionnalités conditionnelles selon les éléments présents
        if (utils.select('#wf-form-contact')) {
            this.initForms();
        }
        
        if (utils.select('img[data-src]')) {
            this.initLazyLoading();
        }
        
        if (utils.select('a[href^="#"]')) {
            this.initSmoothScroll();
        }
        
        if (utils.select('.service-card')) {
            this.initServiceCards();
        }
        
        // Pages spécifiques
        if (utils.select('.prestation-hero')) {
            this.initPrestationPage();
        }
        
        if (utils.select('.price-category')) {
            this.initPricingPage();
        }
        
        if (utils.select('.testimonials-grid')) {
            this.initTestimonials();
        }
    }

    initMobileMenu() {
        if (!this.menuButton || !this.nav) return;

        utils.addEvent(this.menuButton, 'click', () => {
            this.menuOpen = !this.menuOpen;
            this.menuButton.classList.toggle('is-open', this.menuOpen);
            this.nav.classList.toggle('is-open', this.menuOpen);
            document.body.style.overflow = this.menuOpen ? 'hidden' : '';
        });

        // Fermeture sur clic des liens
        utils.selectAll('a', this.nav).forEach(link => {
            utils.addEvent(link, 'click', () => {
                if (this.menuOpen) {
                    this.menuButton.classList.remove('is-open');
                    this.nav.classList.remove('is-open');
                    this.menuOpen = false;
                    document.body.style.overflow = '';
                }
            });
        });
    }

    initAnimations() {
        const observer = utils.createObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        });

        utils.selectAll('.fade-in, .service-card, .testimonial, .about-content, .instagram-item')
            .forEach(el => observer.observe(el));
    }

    initGlobalEvents() {
        // Gestion du redimensionnement
        let resizeTimer;
        utils.addEvent(window, 'resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                if (window.innerWidth > 991 && this.menuOpen) {
                    this.menuButton?.classList.remove('is-open');
                    this.nav?.classList.remove('is-open');
                    this.menuOpen = false;
                    document.body.style.overflow = '';
                }
            }, 250);
        });
    }

    initForms() {
        const form = utils.select('#wf-form-contact');
        if (!form) return;

        utils.addEvent(form, 'submit', e => {
            e.preventDefault();
            
            // Validation basique
            const phone = utils.select('#phone')?.value;
            if (phone && !/^(?:(?:\+|00)33|0)[1-9](?:[\s.-]?\d{2}){4}$/.test(phone)) {
                alert('Veuillez entrer un numéro de téléphone valide');
                return;
            }

            form.submit();
        });
    }

    initLazyLoading() {
        const observer = utils.createObserver((entries, observer) => {
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
        });

        utils.selectAll('img[data-src]').forEach(img => observer.observe(img));
    }

    initServiceCards() {
        utils.selectAll('.service-card').forEach(card => {
            utils.addEvent(card, 'mouseenter', () => {
                if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                    card.style.transform = 'translateY(-5px)';
                }
            });
            
            utils.addEvent(card, 'mouseleave', () => {
                card.style.transform = 'translateY(0)';
            });
        });
    }

    initPrestationPage() {
        // FAQ Accordéon
        utils.selectAll('.faq-item').forEach(item => {
            utils.addEvent(item, 'click', e => {
                if (!e.target.closest('.faq-content')) {
                    utils.selectAll('.faq-item[open]').forEach(opened => {
                        if (opened !== item) opened.removeAttribute('open');
                    });
                }
            });
        });
    }

    initPricingPage() {
        utils.selectAll('.price-category').forEach(category => {
            category.style.opacity = '0';
            category.style.transform = 'translateY(20px)';
        });

        const observer = utils.createObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        });

        utils.selectAll('.price-category').forEach(category => observer.observe(category));
    }

    initTestimonials() {
        const observer = utils.createObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        });

        utils.selectAll('.testimonial').forEach(testimonial => observer.observe(testimonial));
    }

    updateCopyrightYear() {
        utils.selectAll('.current-year').forEach(el => {
            if (el) el.textContent = new Date().getFullYear();
        });
    }
}

// Initialisation au chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
    try {
        window.siteManager = new SiteManager();
    } catch (error) {
        console.error('Erreur d\'initialisation:', error);
    }
});
