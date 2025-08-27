// ================================================
// CONFIGURATION ET VARIABLES GLOBALES
// ================================================

const CONFIG = {
    animations: {
        scrollOffset: 150,
        staggerDelay: 100,
        parallaxSpeed: 0.3,
        rotationSpeed: 0.1
    },
    navbar: {
        scrollThreshold: 50,
        blurAmount: {
            normal: 20,
            scrolled: 25
        }
    }
};

let currentLanguage = 'fr';

// ================================================
// SYSTÈME DE TRADUCTION MULTILINGUE
// ================================================

const LanguageManager = {
    translations: {
        fr: {
            // Déjà défini par défaut dans le HTML
        },
        en: {
            // Toutes les traductions sont gérées via les attributs data-lang
        }
    },

    changeLanguage(lang) {
        currentLanguage = lang;
        
        // Mise à jour du bouton actif
        this.updateActiveButton();
        
        // Traduction de tous les éléments
        this.translateElements(lang);
        
        // Mise à jour du titre et de l'attribut lang
        this.updateDocumentMeta(lang);
    },

    updateActiveButton() {
        document.querySelectorAll('.language-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.classList.add('active');
    },

    translateElements(lang) {
        document.querySelectorAll(`[data-lang-${lang}]`).forEach(element => {
            const translation = element.getAttribute(`data-lang-${lang}`);
            if (translation) {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = translation;
                } else {
                    element.textContent = translation;
                }
            }
        });
    },

    updateDocumentMeta(lang) {
        // Mise à jour du titre
        const titleElement = document.querySelector('title');
        const titleTranslation = titleElement.getAttribute(`data-lang-${lang}`);
        if (titleTranslation) {
            titleElement.textContent = titleTranslation;
        }
        
        // Mise à jour de l'attribut lang
        document.documentElement.lang = lang;
    }
};

// ================================================
// SYSTÈME D'ANIMATIONS
// ================================================

const AnimationManager = {
    // Animations au scroll
    animateOnScroll() {
        const elements = document.querySelectorAll('.animate-on-scroll, .animate-slide-left, .animate-slide-right, .animate-scale');
        
        elements.forEach((element, index) => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = CONFIG.animations.scrollOffset;
            
            if (elementTop < window.innerHeight - elementVisible) {
                // Animation échelonnée
                setTimeout(() => {
                    element.classList.add('animated');
                }, index * CONFIG.animations.staggerDelay);
            }
        });
    },

    // Effet parallaxe pour la section hero
    parallaxEffect() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        const heroGraphic = document.querySelector('.hero-graphic');
        
        if (hero && heroGraphic && scrolled < hero.offsetHeight) {
            const translateY = scrolled * CONFIG.animations.parallaxSpeed;
            const rotate = scrolled * CONFIG.animations.rotationSpeed;
            heroGraphic.style.transform = `translateY(${translateY}px) rotate(${rotate}deg)`;
        }
    },

    // Animation des statistiques avec compteur
    initStatsAnimation() {
        const observerOptions = {
            threshold: 0.7,
            rootMargin: '0px 0px -100px 0px'
        };

        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateStatNumber(entry.target);
                }
            });
        }, observerOptions);

        document.querySelectorAll('.stat-item').forEach(stat => {
            statsObserver.observe(stat);
        });
    },

    animateStatNumber(statItem) {
        const statNumber = statItem.querySelector('.stat-number');
        const finalNumber = statNumber.textContent;
        const isPercentage = finalNumber.includes('%');
        const isTwentyFour = finalNumber.includes('24');
        
        let currentNumber = 0;
        const increment = isPercentage ? 2 : isTwentyFour ? 1 : 5;
        const target = parseInt(finalNumber);
        
        const timer = setInterval(() => {
            currentNumber += increment;
            if (currentNumber >= target) {
                statNumber.textContent = finalNumber;
                clearInterval(timer);
            } else {
                statNumber.textContent = currentNumber + (isPercentage ? '%' : isTwentyFour ? '/7' : '+');
            }
        }, 50);
    }
};

// ================================================
// EFFETS VISUELS ET INTERACTIONS
// ================================================

const VisualEffects = {
    // Effet navbar au scroll
    initNavbarEffects() {
        window.addEventListener('scroll', () => {
            const navbar = document.querySelector('.navbar');
            const scrolled = window.scrollY;
            
            if (scrolled > CONFIG.navbar.scrollThreshold) {
                navbar.style.background = 'rgba(245, 241, 237, 0.98)';
                navbar.style.backdropFilter = `blur(${CONFIG.navbar.blurAmount.scrolled}px)`;
                navbar.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
            } else {
                navbar.style.background = 'rgba(245, 241, 237, 0.95)';
                navbar.style.backdropFilter = `blur(${CONFIG.navbar.blurAmount.normal}px)`;
                navbar.style.boxShadow = 'none';
            }
        });
    },

    // Effets interactifs pour les cartes de service
    initServiceCardEffects() {
        document.querySelectorAll('.service-card').forEach((card, index) => {
            card.addEventListener('mouseenter', function() {
                this.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(248,249,250,0.9))';
                this.style.zIndex = '10';
                this.style.boxShadow = '0 30px 80px rgba(196, 69, 69, 0.25), 0 0 0 1px rgba(196, 69, 69, 0.1)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.background = 'white';
                this.style.zIndex = '1';
                this.style.boxShadow = '0 15px 50px rgba(0,0,0,0.08)';
            });

            // Animation initiale échelonnée
            card.style.animationDelay = `${index * 0.1}s`;
        });
    },

    // Effets pour les cartes de projet
    initProjectCardEffects() {
        document.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('mouseenter', function() {
                const image = this.querySelector('.project-image');
                if (image) {
                    image.style.transform = 'scale(1.05)';
                    image.style.filter = 'brightness(1.1)';
                }
            });
            
            card.addEventListener('mouseleave', function() {
                const image = this.querySelector('.project-image');
                if (image) {
                    image.style.transform = 'scale(1)';
                    image.style.filter = 'brightness(1)';
                }
            });
        });
    },

    // Effets pour les cartes d'équipe
    initTeamCardEffects() {
        document.querySelectorAll('.team-card').forEach(card => {
            card.addEventListener('mouseenter', function() {
                const avatar = this.querySelector('.team-avatar');
                if (avatar) {
                    avatar.style.transform = 'scale(1.1) rotate(5deg)';
                }
            });
            
            card.addEventListener('mouseleave', function() {
                const avatar = this.querySelector('.team-avatar');
                if (avatar) {
                    avatar.style.transform = 'scale(1) rotate(0deg)';
                }
            });
        });
    },

    // Effet de chargement de la page
    initPageLoadEffect() {
        window.addEventListener('load', function() {
            document.body.style.opacity = '0';
            document.body.style.transition = 'opacity 0.5s ease';
            
            setTimeout(() => {
                document.body.style.opacity = '1';
            }, 100);
        });
    }
};

// ================================================
// NAVIGATION ET SCROLL
// ================================================

const NavigationManager = {
    initSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
};

// ================================================
// GESTION DES FORMULAIRES
// ================================================

const FormManager = {
    initContactForm() {
        const form = document.querySelector('.contact-form');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmission(form);
        });
    },

    handleFormSubmission(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Validation simple
        if (!this.validateForm(data)) {
            return;
        }
        
        // Animation de soumission
        this.animateSubmission(form);
    },
validateForm(data) {
    if (!data.user_name || !data.user_email || !data.message) {
        alert(currentLanguage === 'fr' 
            ? 'Veuillez remplir tous les champs obligatoires.' 
            : 'Please fill in all required fields.');
        return false;
    }
    return true;
},


    animateSubmission(form) {
        const button = form.querySelector('.cta-button');
        const originalText = button.textContent;
        
        // Animation de chargement
        button.innerHTML = '<span style="animation: spin 1s linear infinite;">⟳</span> ' + 
            (currentLanguage === 'fr' ? 'Envoi en cours...' : 'Sending...');
        button.style.background = 'linear-gradient(135deg, #28a745, #20c997)';
        button.style.transform = 'scale(0.98)';
        
        setTimeout(() => {
            // Animation de succès
            button.innerHTML = '✓ ' + (currentLanguage === 'fr' ? 'Message envoyé !' : 'Message sent!');
            button.style.background = 'linear-gradient(135deg, #28a745, #20c997)';
            button.style.transform = 'scale(1)';
            button.style.animation = 'pulse 0.6s ease';
            
            setTimeout(() => {
                // Réinitialisation
                button.textContent = originalText;
                button.style.background = '';
                button.style.animation = '';
                form.reset();
                
                // Effet de fade
                form.style.opacity = '0.7';
                setTimeout(() => {
                    form.style.opacity = '1';
                }, 300);
            }, 3000);
        }, 2000);
    }
};

// ================================================
// GESTIONNAIRE PRINCIPAL D'ÉVÉNEMENTS
// ================================================

const EventManager = {
    init() {
        this.bindScrollEvents();
        this.bindLanguageEvents();
        this.bindLoadEvents();
    },

    bindScrollEvents() {
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    AnimationManager.animateOnScroll();
                    AnimationManager.parallaxEffect();
                    ticking = false;
                });
                ticking = true;
            }
        });
    },

    bindLanguageEvents() {
        // Les événements de changement de langue sont gérés directement dans le HTML
        // via onclick="changeLanguage('fr')" et onclick="changeLanguage('en')"
        window.changeLanguage = LanguageManager.changeLanguage.bind(LanguageManager);
    },

    bindLoadEvents() {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(AnimationManager.animateOnScroll.bind(AnimationManager), 100);
        });

        window.addEventListener('load', () => {
            AnimationManager.animateOnScroll();
        });
    }
};

// ================================================
// INITIALISATION DE L'APPLICATION
// ================================================

class CliqueWebApp {
    constructor() {
        this.init();
    }

    init() {
        // Initialisation de tous les modules
        EventManager.init();
        NavigationManager.initSmoothScrolling();
        FormManager.initContactForm();
        
        // Effets visuels
        VisualEffects.initNavbarEffects();
        VisualEffects.initServiceCardEffects();
        VisualEffects.initProjectCardEffects();
        VisualEffects.initTeamCardEffects();
        VisualEffects.initPageLoadEffect();
        
        // Animations des statistiques
        AnimationManager.initStatsAnimation();

        console.log('🚀 Clique Web - Site initialisé avec succès!');
    }
}

// ================================================
// DÉMARRAGE DE L'APPLICATION
// ================================================

// Initialisation quand le DOM est prêt
document.addEventListener('DOMContentLoaded', () => {
    new CliqueWebApp();
});

// Styles CSS pour les animations manquantes
const additionalStyles = `
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
`;

// Injection des styles additionnels
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);