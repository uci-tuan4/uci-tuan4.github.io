document.addEventListener('DOMContentLoaded', () => {
    requestAnimationFrame(() => document.body.classList.remove('loading'));
    const themeToggle = document.querySelector('.theme-toggle');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let savedTheme;
    try { savedTheme = localStorage.getItem('theme'); } catch { /* Storage may be unavailable. */ }
    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        themeToggle?.setAttribute('aria-label', theme === 'dark' ? 'Switch to daytime colors' : 'Switch to nighttime colors');
        themeToggle?.setAttribute('aria-pressed', String(theme === 'dark'));
    }
    setTheme(savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light');
    themeToggle?.addEventListener('click', () => {
        const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        setTheme(next);
        try { localStorage.setItem('theme', next); } catch { /* Keep the theme for this visit. */ }
    });
    function closeMenu() {
        navMenu?.classList.remove('open');
        navToggle?.setAttribute('aria-expanded', 'false');
    }
    navToggle?.addEventListener('click', () => {
        const open = navMenu?.classList.toggle('open');
        navToggle.setAttribute('aria-expanded', String(Boolean(open)));
    });
    document.querySelectorAll('header nav a[href^="#"]').forEach(link => {
        link.addEventListener('click', event => {
            const target = document.querySelector(link.getAttribute('href'));
            if (!target) return;
            event.preventDefault();
            target.scrollIntoView({ behavior: reducedMotion.matches ? 'instant' : 'smooth', block: 'start' });
            try { history.replaceState(null, '', link.getAttribute('href')); } catch { /* Local previews may restrict history. */ }
            closeMenu();
        });
    });
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && navMenu?.classList.contains('open')) {
            closeMenu();
            navToggle?.focus();
        }
    });
    window.matchMedia('(min-width: 769px)').addEventListener('change', event => {
        if (event.matches) closeMenu();
    });
    const navLinks = document.querySelectorAll('header nav ul a[href^="#"]');
    const sections = document.querySelectorAll('main section[id]');
    function updateActiveNav() {
        let current = 'hero';
        sections.forEach(section => {
            if (section.getBoundingClientRect().top <= 150) current = section.id;
        });
        navLinks.forEach(link => {
            const active = link.getAttribute('href') === `#${current}`;
            link.classList.toggle('active', active);
            if (active) link.setAttribute('aria-current', 'location');
            else link.removeAttribute('aria-current');
        });
    }
    let scrollPending = false;
    window.addEventListener('scroll', () => {
        if (scrollPending) return;
        scrollPending = true;
        requestAnimationFrame(() => { updateActiveNav(); scrollPending = false; });
    }, { passive: true });
    updateActiveNav();

    const portfolioStyles = document.getElementById('portfolio-styles');
    const robloxStyles = document.getElementById('roblox-styles');
    const amazonStyles = document.getElementById('amazon-styles');
    const modes = [
        { name: 'roblox', label: 'Retro Roblox', trigger: document.querySelector('.roblox-trigger'), entry: document.querySelector('.roblox-experience'), hint: '.roblox-hint', offHint: 'Try retro mode ↗', onHint: 'Exit retro mode ↗' },
        { name: 'amazon', label: 'Amazon', trigger: document.querySelector('.amazon-trigger'), entry: document.querySelector('.amazon-experience'), hint: '.amazon-hint', offHint: 'Try Amazon mode ↗', onHint: 'Exit Amazon mode ↗' }
    ];
    let activeMode = 'original';
    const announcement = document.getElementById('theme-announcement');
    const contentChanges = [
        ['.nav-logo', '<img class="brand-header-logo brand-header-roblox" src="assets/logos/roblox-wordmark-white.svg" alt="Roblox" width="142" height="25"><small>TU NGUYEN / PORTFOLIO</small>', '<img class="brand-header-logo brand-header-amazon" src="assets/logos/amazon-wordmark-white.svg" alt="Amazon" width="100" height="33"><small>TU NGUYEN / PORTFOLIO</small>'],
        ['.hero-greeting', 'Hello there, fellow builder!'],
        ['.hero-actions .btn-primary', '<span aria-hidden="true">▶</span> Explore My Builds'],
        ['.hero-actions .btn-outline', 'Send a Message'],
        ['#skills h2', 'My Toolbox'],
        ['#projects h2', 'My Builds'],
        ['footer p', 'Built brick by brick by Tu Nguyen']
    ].map(([selector, retro, amazon]) => {
        const element = document.querySelector(selector);
        return { element, original: element.innerHTML, retro, amazon: amazon ?? element.innerHTML };
    });
    const primaryAction = document.querySelector('.hero-actions .btn-primary');
    const secondaryAction = document.querySelector('.hero-actions .btn-outline');
    const originalPrimaryHref = primaryAction.getAttribute('href');
    const originalSecondaryHref = secondaryAction.getAttribute('href');

    function setExperienceTheme(mode, anchor) {
        const anchorTop = anchor.getBoundingClientRect().top;
        activeMode = mode;
        const retro = mode === 'roblox';
        document.documentElement.toggleAttribute('data-roblox', retro);
        document.documentElement.toggleAttribute('data-amazon', mode === 'amazon');
        portfolioStyles.disabled = retro;
        robloxStyles.media = retro ? 'all' : 'not all';
        amazonStyles.media = mode === 'amazon' ? 'all' : 'not all';
        contentChanges.forEach(change => {
            change.element.innerHTML = retro ? change.retro : mode === 'amazon' ? change.amazon : change.original;
        });
        primaryAction.setAttribute('href', retro ? '#projects' : originalPrimaryHref);
        secondaryAction.setAttribute('href', retro ? '#contact' : originalSecondaryHref);
        modes.forEach(item => {
            const enabled = mode === item.name;
            item.trigger.setAttribute('aria-pressed', String(enabled));
            item.trigger.setAttribute('aria-label', enabled ? 'Restore original portfolio theme' : `Switch portfolio to ${item.label} theme`);
            item.trigger.querySelector(item.hint).textContent = enabled ? item.onHint : item.offHint;
        });
        announcement.textContent = mode === 'original' ? 'Original portfolio theme restored.' : `${modes.find(item => item.name === mode).label} theme enabled.`;
        closeMenu();
        requestAnimationFrame(() => {
            window.scrollBy({ top: anchor.getBoundingClientRect().top - anchorTop, behavior: 'instant' });
            updateActiveNav();
        });
    }
    modes.forEach(item => {
        item.trigger.addEventListener('click', () => {
            setExperienceTheme(activeMode === item.name ? 'original' : item.name, item.trigger);
        });
        item.entry.addEventListener('click', event => {
            if (event.target.closest('a, button') || window.getSelection()?.toString()) return;
            item.trigger.click();
        });
    });
    document.querySelectorAll('.retro-exit, .amazon-exit').forEach(button => {
        button.addEventListener('click', () => {
            const trigger = modes.find(item => item.name === activeMode)?.trigger;
            if (!trigger) return;
            setExperienceTheme('original', trigger);
            trigger.focus({ preventScroll: true });
        });
    });

    const subtitle = document.getElementById('typing-subtitle');
    const subtitleText = 'Computer Science Major @ UC Irvine';
    if (reducedMotion.matches) subtitle.textContent = subtitleText;
    else {
        let index = 0;
        function typeSubtitle() {
            subtitle.textContent = subtitleText.slice(0, ++index);
            if (index < subtitleText.length) setTimeout(typeSubtitle, 80);
        }
        setTimeout(typeSubtitle, 600);
    }
});
