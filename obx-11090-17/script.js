// ===================================
// BORRACHARIA 40 - OBX 110/90/17
// Interactive Scripts
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    // --- Header Scroll Effect ---
    const header = document.getElementById('header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    }, { passive: true });

    // --- Mobile Navigation ---
    const navToggle = document.getElementById('nav-toggle');
    const navMobile = document.getElementById('nav-mobile');

    if (navToggle && navMobile) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMobile.classList.toggle('active');
            document.body.style.overflow = navMobile.classList.contains('active') ? 'hidden' : '';
        });

        // Close mobile menu on link click
        navMobile.querySelectorAll('.nav__mobile-link').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMobile.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // --- Hero Particles ---
    const particlesContainer = document.getElementById('hero-particles');
    if (particlesContainer) {
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'hero__particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 6 + 's';
            particle.style.animationDuration = (4 + Math.random() * 4) + 's';
            particle.style.width = (2 + Math.random() * 3) + 'px';
            particle.style.height = particle.style.width;
            particlesContainer.appendChild(particle);
        }
    }

    // --- Scroll Reveal Animations ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Add reveal classes to elements
    const revealElements = [
        { selector: '.feature-card', className: 'reveal', delayStep: 100 },
        { selector: '.showcase__spec', className: 'reveal', delayStep: 80 },
        { selector: '.compat-group', className: 'reveal', delayStep: 150 },
        { selector: '.location__card-item', className: 'reveal', delayStep: 100 }
    ];

    revealElements.forEach(({ selector, className, delayStep }) => {
        document.querySelectorAll(selector).forEach((el, index) => {
            el.classList.add(className);
            el.style.transitionDelay = `${index * delayStep}ms`;
            revealObserver.observe(el);
        });
    });

    // Reveal sections
    document.querySelectorAll('.section-header').forEach(el => {
        el.classList.add('reveal');
        revealObserver.observe(el);
    });

    // Reveal showcase image
    const showcaseImage = document.querySelector('.showcase__image');
    if (showcaseImage) {
        showcaseImage.classList.add('reveal-left');
        revealObserver.observe(showcaseImage);
    }

    const showcaseInfo = document.querySelector('.showcase__info');
    if (showcaseInfo) {
        showcaseInfo.classList.add('reveal-right');
        revealObserver.observe(showcaseInfo);
    }

    // Reveal CTA banner
    const ctaBanner = document.querySelector('.cta-banner__content');
    if (ctaBanner) {
        ctaBanner.classList.add('reveal');
        revealObserver.observe(ctaBanner);
    }

    // Reveal location content
    const locationCard = document.querySelector('.location__card');
    if (locationCard) {
        locationCard.classList.add('reveal-left');
        revealObserver.observe(locationCard);
    }

    const locationMap = document.querySelector('.location__map');
    if (locationMap) {
        locationMap.classList.add('reveal-right');
        revealObserver.observe(locationMap);
    }

    // --- Smooth scroll for anchor links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(targetId);
            if (target) {
                const headerHeight = header.offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Scroll indicator click ---
    const scrollIndicator = document.getElementById('hero-scroll');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            const produto = document.getElementById('produto');
            if (produto) {
                const headerHeight = header.offsetHeight;
                window.scrollTo({
                    top: produto.offsetTop - headerHeight - 20,
                    behavior: 'smooth'
                });
            }
        });
    }

    // --- Feature card hover interaction ---
    document.querySelectorAll('.feature-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
});
