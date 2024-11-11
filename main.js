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
        this.nav = utils.select('nav');
        this.menuOpen = false;
        
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
        this.initPrestations(); // Ajout de l'initialisation des prestations
    }
    
    // Menu mobile
    initMobileMenu() {
        if (this.menuButton && this.nav) {
            this.menuButton.addEventListener('click', () => {
                this.menuOpen = !this.menuOpen;
                this.menuButton.classList.toggle('is-open');
                this.nav.classList.toggle('is-open');
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
        initPrestationPage() {
        this.initFaqAccordion();
        this.initScrollSpy();
        this.animatePricing();
        this.initBookingTracking();
    }

    initFaqAccordion() {
        const faqs = utils.selectAll('.faq-item');
        faqs.forEach(faq => {
            utils.addEvent(faq, 'click', (e) => {
                // Empêche la propagation si on clique sur le contenu
                if (e.target.closest('.faq-content')) {
                    e.stopPropagation();
                    return;
                }

                // Ferme les autres FAQ ouverts
                faqs.forEach(otherFaq => {
                    if (otherFaq !== faq && otherFaq.hasAttribute('open')) {
                        otherFaq.removeAttribute('open');
                    }
                });
            });
        });
    }

    initScrollSpy() {
        const sections = utils.selectAll('section[id]');
        const navLinks = utils.selectAll('.nav-link');

        const observerOptions = {
            rootMargin: '-100px 0px -80% 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    navLinks.forEach(link => {
                        if (link.getAttribute('href') === `#${entry.target.id}`) {
                            link.classList.add('active');
                        } else {
                            link.classList.remove('active');
                        }
                    });
                }
            });
        }, observerOptions);

        sections.forEach(section => observer.observe(section));
    }

    animatePricing() {
        const pricingCards = utils.selectAll('.pricing-card');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);

                    // Animation du prix
                    const priceElement = entry.target.querySelector('.price');
                    if (priceElement) {
                        const finalPrice = parseInt(priceElement.textContent);
                        let currentPrice = 0;
                        const duration = 1000; // 1 seconde
                        const increment = finalPrice / (duration / 16); // 60 FPS

                        const animatePrice = () => {
                            if (currentPrice < finalPrice) {
                                currentPrice += increment;
                                priceElement.textContent = `${Math.min(Math.round(currentPrice), finalPrice)}€`;
                                requestAnimationFrame(animatePrice);
                            }
                        };

                        animatePrice();
                    }
                }
            });
        }, {
            threshold: 0.1
        });

        pricingCards.forEach(card => observer.observe(card));
    }

    initBookingTracking() {
        // Suivi des clics sur les boutons de réservation
        utils.selectAll('.booking-buttons a').forEach(button => {
            utils.addEvent(button, 'click', (e) => {
                // Si vous avez Google Analytics ou un autre outil d'analytics
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'click', {
                        'event_category': 'Booking',
                        'event_label': button.getAttribute('href').includes('tel') ? 'Phone' : 'Email'
                    });
                }
            });
        });
    }
    }
    
    // Section prestations
    initPrestations() {
        const prestationCards = utils.selectAll('.prestation-card');
        if (!prestationCards.length) return;

        // Animation au scroll des cartes
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '50px'
            }
        );

        prestationCards.forEach(card => observer.observe(card));

        // Gestion des erreurs d'images
        utils.selectAll('.prestation-image').forEach(img => {
            utils.addEvent(img, 'error', function() {
                this.src = '/api/placeholder/400/300';
            });
        });
    }

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
    
    updateCopyrightYear() {
        const yearElements = utils.selectAll('.current-year');
        yearElements.forEach(element => {
            if (element) {
                element.textContent = new Date().getFullYear();
            }
        });
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    new SiteManager();

    // Gestion du bouton d'impression pour les pages légales
    const printButtons = document.querySelectorAll('.print-legal');
    printButtons.forEach(button => {
        button.addEventListener('click', () => {
            window.print();
        });
    });
    const siteManager = new SiteManager();
    siteManager.initPrestationPage();

    // Ajout d'un gestionnaire pour les ancres douces
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            const headerOffset = 100; // Ajuster selon la hauteur de votre header
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        });
    });
});
