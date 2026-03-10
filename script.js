document.addEventListener('DOMContentLoaded', () => {

    // ── Scroll-triggered section animations ──────────────
    const sections = document.querySelectorAll('section');
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.remove('section-hidden');
                entry.target.classList.add('section-visible');
                sectionObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08 });

    sections.forEach(section => {
        if (section.id !== 'hero') {
            section.classList.add('section-hidden');
        }
        sectionObserver.observe(section);
    });

    // ── Staggered card animations ────────────────────────
    const cards = document.querySelectorAll('.card');
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-visible');
                cardObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    cards.forEach((card, i) => {
        card.classList.add('animate-in');
        card.style.transitionDelay = `${(i % 4) * 0.1}s`;
        cardObserver.observe(card);
    });

    // ── Smooth scroll for nav links ──────────────────────
    document.querySelectorAll('header nav a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                document.querySelector('header nav ul')?.classList.remove('open');
            }
        });
    });

    // ── Active nav link on scroll ────────────────────────
    const navLinks = document.querySelectorAll('header nav ul li a');
    const navSections = document.querySelectorAll('section[id]');

    function updateActiveNav() {
        const scrollY = window.scrollY + 100;
        navSections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            const link = document.querySelector(`header nav ul li a[href="#${id}"]`);
            if (link) {
                if (scrollY >= top && scrollY < top + height) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav, { passive: true });
    updateActiveNav();

    // ── Mobile nav toggle ────────────────────────────────
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('header nav ul');
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('open');
        });
    }

    // ── Typing animation ─────────────────────────────────
    const subtitleText = "Computer Science Major @ UC Irvine";
    const el = document.getElementById('typing-subtitle');
    let i = 0;

    function type() {
        if (el && i < subtitleText.length) {
            el.textContent += subtitleText.charAt(i);
            i++;
            setTimeout(type, 80);
        }
    }

    setTimeout(type, 600);

    // ── Header background on scroll ──────────────────────
    const header = document.querySelector('header');
    function updateHeader() {
        if (window.scrollY > 10) {
            header.style.boxShadow = '0 1px 8px rgba(0,0,0,0.06)';
        } else {
            header.style.boxShadow = 'none';
        }
    }

    window.addEventListener('scroll', updateHeader, { passive: true });
    updateHeader();
});
