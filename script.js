// ===================================
// BORRACHARIA 40 - SCRIPTS
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    // --- Mobile Navigation ---
    const navToggle = document.getElementById('nav-toggle');
    const navMobile = document.getElementById('nav-mobile');

    if (navToggle && navMobile) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMobile.classList.toggle('open');
        });

        // Close mobile menu on link click
        const mobileLinks = navMobile.querySelectorAll('.nav__mobile-link');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMobile.classList.remove('open');
            });
        });
    }

    // --- Header Scroll Effect ---
    const header = document.getElementById('header');
    let lastScrollY = 0;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;

        if (currentScrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScrollY = currentScrollY;
    });

    // --- Scroll Reveal Animations ---
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -80px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Add animation classes to elements
    const animateElements = () => {
        // Feature cards
        document.querySelectorAll('.feature-card').forEach((el, i) => {
            el.classList.add('fade-in');
            el.style.transitionDelay = `${i * 100}ms`;
            observer.observe(el);
        });

        // Showcase specs
        document.querySelectorAll('.showcase__spec').forEach((el, i) => {
            el.classList.add('fade-in');
            el.style.transitionDelay = `${i * 80}ms`;
            observer.observe(el);
        });

        // Showcase image
        const showcaseImage = document.querySelector('.showcase__image');
        if (showcaseImage) {
            showcaseImage.classList.add('fade-in-left');
            observer.observe(showcaseImage);
        }

        // Showcase info
        const showcaseInfo = document.querySelector('.showcase__info');
        if (showcaseInfo) {
            showcaseInfo.classList.add('fade-in-right');
            observer.observe(showcaseInfo);
        }

        // Compatibility groups
        document.querySelectorAll('.compat-group').forEach((el, i) => {
            el.classList.add('fade-in');
            el.style.transitionDelay = `${i * 150}ms`;
            observer.observe(el);
        });

        // Location card
        const locationCard = document.querySelector('.location__card');
        if (locationCard) {
            locationCard.classList.add('fade-in-left');
            observer.observe(locationCard);
        }

        // Location logo
        const locationLogo = document.querySelector('.location__logo');
        if (locationLogo) {
            locationLogo.classList.add('fade-in-right');
            observer.observe(locationLogo);
        }

        // CTA Banner
        const ctaBanner = document.querySelector('.cta-banner__content');
        if (ctaBanner) {
            ctaBanner.classList.add('fade-in');
            observer.observe(ctaBanner);
        }

        // Section headers
        document.querySelectorAll('.section-header').forEach(el => {
            el.classList.add('fade-in');
            observer.observe(el);
        });
    };

    animateElements();

    // --- Smooth Scroll for anchor links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // --- Hero Particles (subtle background effect) ---
    const particlesContainer = document.getElementById('hero-particles');
    if (particlesContainer) {
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 3 + 1}px;
                height: ${Math.random() * 3 + 1}px;
                background: rgba(230, 30, 42, ${Math.random() * 0.3 + 0.1});
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: particle-float ${Math.random() * 10 + 10}s ease-in-out infinite;
                animation-delay: ${Math.random() * -10}s;
            `;
            particlesContainer.appendChild(particle);
        }

        // Add particle animation to stylesheet
        const style = document.createElement('style');
        style.textContent = `
            @keyframes particle-float {
                0%, 100% {
                    transform: translate(0, 0) scale(1);
                    opacity: 0.3;
                }
                25% {
                    transform: translate(${Math.random() * 40 - 20}px, ${Math.random() * 40 - 20}px) scale(1.2);
                    opacity: 0.6;
                }
                50% {
                    transform: translate(${Math.random() * 60 - 30}px, ${Math.random() * 60 - 30}px) scale(0.8);
                    opacity: 0.2;
                }
                75% {
                    transform: translate(${Math.random() * 40 - 20}px, ${Math.random() * 40 - 20}px) scale(1.1);
                    opacity: 0.5;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // --- Counter Animation for Price ---
    const animatePrice = () => {
        const priceValue = document.querySelector('.hero__price-value');
        if (!priceValue) return;

        const targetValue = 19;
        let currentValue = 0;
        const duration = 1500;
        const startTime = performance.now();

        const updateValue = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function
            const easeOutExpo = 1 - Math.pow(2, -10 * progress);
            currentValue = Math.round(easeOutExpo * targetValue);

            priceValue.textContent = currentValue;

            if (progress < 1) {
                requestAnimationFrame(updateValue);
            }
        };

        // Only animate when visible
        const priceObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    requestAnimationFrame(updateValue);
                    priceObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        priceObserver.observe(priceValue);
    };

    animatePrice();

    // --- Active nav link on scroll ---
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav__link:not(.nav__cta)');

    const highlightNav = () => {
        const scrollY = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };

    window.addEventListener('scroll', highlightNav);
});
