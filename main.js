// Utilitaires
const utils = {
    select: (selector, parent = document) => parent.querySelector(selector),
    selectAll: (selector, parent = document) => Array.from(parent.querySelectorAll(selector) || []),
    
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
        this.menuButton = utils.select('.menu-button');
        this.nav = utils.select('nav');
        this.isMenuOpen = false;
        
        this.init();
    }
    
    init() {
        // Navigation mobile
        if (this.menuButton && this.nav) {
            this.initMobileMenu();
        }

        // Cartes de prestations
        if (utils.selectAll('.prestation-card').length) {
            this.initPrestationCards();
        }

        // Cartes des étapes
        if (utils.selectAll('.step-card').length) {
            this.initStepCards();
        }

        // Cartes de tarifs
        if (utils.selectAll('.pricing-card').length) {
            this.initPricingCards();
        }

        // FAQ
        if (utils.selectAll('.faq-item').length) {
            this.initFaq();
        }

        // Témoignages
        if (utils.selectAll('.testimonial').length) {
            this.initTestimonials();
        }

        // Smooth scroll
        this.initSmoothScroll();

        // Footer
        this.updateCopyrightYear();

        // Formulaire de contact
        if (utils.select('#wf-form-contact')) {
            this.initContactForm();
        }
    }

    initMobileMenu() {
        utils.addEvent(this.menuButton, 'click', () => {
            this.isMenuOpen = !this.isMenuOpen;
            this.menuButton.classList.toggle('is-open', this.isMenuOpen);
            this.nav.classList.toggle('is-open', this.isMenuOpen);
            document.body.style.overflow = this.isMenuOpen ? 'hidden' : '';
        });

        // Fermeture sur clic des liens
        utils.selectAll('a', this.nav).forEach(link => {
            utils.addEvent(link, 'click', () => {
                if (this.isMenuOpen) {
                    this.menuButton.classList.remove('is-open');
                    this.nav.classList.remove('is-open');
                    document.body.style.overflow = '';
                    this.isMenuOpen = false;
                }
            });
        });

        // Fermeture sur resize
        utils.addEvent(window, 'resize', () => {
            if (window.innerWidth > 991 && this.isMenuOpen) {
                this.menuButton.classList.remove('is-open');
                this.nav.classList.remove('is-open');
                document.body.style.overflow = '';
                this.isMenuOpen = false;
            }
        });
    }

    initPrestationCards() {
        const observer = utils.createObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        });

        utils.selectAll('.prestation-card').forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            observer.observe(card);
        });
    }

    initStepCards() {
        const observer = utils.createObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        });

        utils.selectAll('.step-card').forEach(card => observer.observe(card));
    }

    initPricingCards() {
        const observer = utils.createObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);

                    // Animation du prix
                    const priceElement = entry.target.querySelector('.price');
                    if (priceElement) {
                        const finalPrice = parseInt(priceElement.textContent);
                        this.animateNumber(priceElement, finalPrice);
                    }
                }
            });
        });

        utils.selectAll('.pricing-card').forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            observer.observe(card);
        });
    }

    animateNumber(element, final, duration = 1000) {
        let start = 0;
        const increment = final / (duration / 16);
        
        const update = () => {
            start = Math.min(start + increment, final);
            element.textContent = `${Math.round(start)}€`;
            
            if (start < final) {
                requestAnimationFrame(update);
            }
        };
        
        update();
    }

    initFaq() {
        utils.selectAll('.faq-item').forEach(item => {
            utils.addEvent(item, 'click', (e) => {
                if (!e.target.closest('.faq-content')) {
                    utils.selectAll('.faq-item[open]').forEach(openItem => {
                        if (openItem !== item) {
                            openItem.removeAttribute('open');
                        }
                    });
                }
            });
        });
    }

    initTestimonials() {
        const observer = utils.createObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    setTimeout(() => {
                        entry.target.classList.add('animate-text');
                    }, 300);
                    observer.unobserve(entry.target);
                }
            });
        });

        utils.selectAll('.testimonial').forEach(testimonial => observer.observe(testimonial));
    }

    initSmoothScroll() {
        utils.selectAll('a[href^="#"]').forEach(anchor => {
            utils.addEvent(anchor, 'click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href');
                
                if (targetId === '#') return;
                
                const target = utils.select(targetId);
                if (target) {
                    const headerOffset = 100;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    initContactForm() {
        const form = utils.select('#wf-form-contact');
        
        utils.addEvent(form, 'submit', (e) => {
            e.preventDefault();
            
            const phone = utils.select('#phone')?.value;
            if (phone && !/^(?:(?:\+|00)33|0)[1-9](?:[\s.-]?\d{2}){4}$/.test(phone)) {
                alert('Veuillez entrer un numéro de téléphone valide');
                return;
            }

            form.submit();
        });

        // Animation des champs
        utils.selectAll('.form-input, .form-select, .form-textarea').forEach(input => {
            ['focus', 'blur'].forEach(eventType => {
                utils.addEvent(input, eventType, () => {
                    input.style.transform = eventType === 'focus' ? 'translateY(-2px)' : 'translateY(0)';
                });
            });
        });
    }

    updateCopyrightYear() {
        utils.selectAll('.current-year').forEach(el => {
            if (el) {
                el.textContent = new Date().getFullYear();
            }
        });
    }
}

// Initialisation sécurisée
document.addEventListener('DOMContentLoaded', () => {
    try {
        window.siteManager = new SiteManager();
    } catch (error) {
        console.error('Erreur d\'initialisation:', error);
    }
});
