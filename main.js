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
    },

    smoothScroll: (target, offset = 100) => {
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
};

class SiteManager {
    constructor() {
        this.init();
    }
    
    init() {
        this.initMobileMenu();
        this.initAnimations();
        this.initForms();
        this.initGlobalEvents();
        this.initLazyLoading();
        this.initSmoothScroll();
        this.initServiceCards();
        this.initReduceMotion();
        this.initFontsLoading();
        
        // Initialisation conditionnelle selon la page
        if (utils.select('.prestation-hero')) {
            this.initPrestationPage();
        }
        if (utils.select('.price-category')) {
            this.initPricingPage();
        }
        if (utils.select('.value-card')) {
            this.initAboutPage();
        }
        if (utils.select('.testimonials-grid')) {
            this.initTestimonials();
        }
    }

    // [Code précédent maintenu pour initMobileMenu, initAnimations, initForms, initGlobalEvents...]

    initLazyLoading() {
        const lazyObserver = utils.createObserver(
            (entries, observer) => {
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
            },
            { rootMargin: '50px' }
        );

        utils.selectAll('img[data-src]').forEach(img => {
            lazyObserver.observe(img);
        });
    }

    initSmoothScroll() {
        utils.selectAll('a[href^="#"]').forEach(anchor => {
            utils.addEvent(anchor, 'click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href');
                
                if (targetId === '#') return;
                
                const target = utils.select(targetId);
                if (target) {
                    utils.smoothScroll(target);
                }
            });
        });
    }

    initServiceCards() {
        if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
            utils.selectAll('.service-card').forEach(card => {
                utils.addEvent(card, 'mouseenter', () => {
                    card.style.transform = 'translateY(-5px)';
                });
                
                utils.addEvent(card, 'mouseleave', () => {
                    card.style.transform = 'translateY(0)';
                });
            });
        }
    }

    initReduceMotion() {
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        document.documentElement.classList.toggle('reduce-motion', reduceMotion);

        // Événement pour changement de préférence
        window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', e => {
            document.documentElement.classList.toggle('reduce-motion', e.matches);
        });
    }

    initFontsLoading() {
        if ('fonts' in document) {
            document.fonts.ready.then(() => {
                document.documentElement.classList.add('fonts-loaded');
            });
        } else {
            document.documentElement.classList.add('fonts-loaded');
        }
    }

    initTestimonials() {
        const testimonialObserver = utils.createObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        setTimeout(() => {
                            entry.target.classList.add('animate-text');
                        }, 300);
                    }
                });
            }
        );

        utils.selectAll('.testimonial').forEach(testimonial => {
            testimonialObserver.observe(testimonial);
        });
    }

    trackAnalytics(eventName, eventData = {}) {
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, {
                ...eventData,
                timestamp: new Date().toISOString()
            });
        }
    }

    handleFormSubmission(form, submitCallback) {
        if (!form) return;

        utils.addEvent(form, 'submit', async (e) => {
            e.preventDefault();
            
            try {
                await submitCallback(form);
                this.trackAnalytics('form_submission', {
                    form_id: form.id,
                    status: 'success'
                });
            } catch (error) {
                console.error('Form submission error:', error);
                this.trackAnalytics('form_submission', {
                    form_id: form.id,
                    status: 'error',
                    error_message: error.message
                });
            }
        });
    }

    initErrorHandling() {
        window.addEventListener('error', (e) => {
            console.error('Global error:', e.error);
            this.trackAnalytics('js_error', {
                message: e.error.message,
                stack: e.error.stack
            });
        });

        window.addEventListener('unhandledrejection', (e) => {
            console.error('Unhandled promise rejection:', e.reason);
            this.trackAnalytics('promise_error', {
                message: e.reason.message,
                stack: e.reason.stack
            });
        });
    }
}

// Initialisation au chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
    try {
        const siteManager = new SiteManager();
        window.siteManager = siteManager; // Pour debug si nécessaire
    } catch (error) {
        console.error('Initialization error:', error);
    }
});
