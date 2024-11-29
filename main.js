// Fonctions utilitaires
const utils = {
    select: (selector, parent = document) => parent.querySelector(selector),
    selectAll: (selector, parent = document) => Array.from(parent.querySelectorAll(selector) || []),
    
    addEvent: (element, event, handler) => {
        if (element) {
            element.addEventListener(event, handler);
        }
    }
};

class SiteManager {
    constructor() {
        // Initialisation des propriétés de base
        this.menuButton = utils.select('.menu-button');
        this.nav = utils.select('nav');
        this.init();
    }
    
    init() {
        // Menu mobile
        if (this.menuButton && this.nav) {
            this.initMobileMenu();
        }

        // Recherche et initialisation des éléments de prestation
        const prestationCards = utils.selectAll('.prestation-card');
        if (prestationCards.length > 0) {
            prestationCards.forEach(card => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
            });
            this.initPrestationCards();
        }

        // Recherche et initialisation des étapes
        const stepCards = utils.selectAll('.step-card');
        if (stepCards.length > 0) {
            this.initStepCards();
        }

        // Mise à jour de l'année dans le footer
        this.updateCopyrightYear();
    }

    initMobileMenu() {
        let isMenuOpen = false;

        utils.addEvent(this.menuButton, 'click', () => {
            isMenuOpen = !isMenuOpen;
            this.menuButton.classList.toggle('is-open', isMenuOpen);
            this.nav.classList.toggle('is-open', isMenuOpen);
            document.body.style.overflow = isMenuOpen ? 'hidden' : '';
        });

        // Fermeture du menu sur clic des liens
        utils.selectAll('a', this.nav).forEach(link => {
            utils.addEvent(link, 'click', () => {
                if (isMenuOpen) {
                    this.menuButton.classList.remove('is-open');
                    this.nav.classList.remove('is-open');
                    document.body.style.overflow = '';
                    isMenuOpen = false;
                }
            });
        });
    }

    initPrestationCards() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        utils.selectAll('.prestation-card').forEach(card => {
            observer.observe(card);
        });
    }

    initStepCards() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        utils.selectAll('.step-card').forEach(card => {
            observer.observe(card);
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
        new SiteManager();
    } catch (error) {
        console.error('Erreur d\'initialisation:', error);
    }
});
