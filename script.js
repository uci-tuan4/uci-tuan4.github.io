// JavaScript for interactive elements will go here!

console.log("Portfolio script loaded!");

document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section');

    const observerOptions = {
        root: null, // relative to document viewport 
        rootMargin: '0px',
        threshold: 0.1 // visible amount of item shown in viewport
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.remove('section-hidden');
                entry.target.classList.add('section-visible');
                observer.unobserve(entry.target); // Stop observing once visible
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        // Initially hide all sections that are not the hero section
        if (section.id !== 'hero') { 
            section.classList.add('section-hidden');
        }
        observer.observe(section);
    });

    // Smooth scroll for navigation links
    const navLinks = document.querySelectorAll('header nav ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Typing animation for hero subtitle
    const subtitleText = "Computer Science Major @ UC Irvine";
    const subtitleElement = document.getElementById('typing-subtitle');
    let charIndex = 0;

    function typeSubtitle() {
        if (subtitleElement && charIndex < subtitleText.length) {
            subtitleElement.textContent += subtitleText.charAt(charIndex);
            charIndex++;
            setTimeout(typeSubtitle, 100); // Adjust typing speed here (milliseconds)
        }
    }

    // Start typing animation after a short delay
    setTimeout(typeSubtitle, 500);

    // Rainbow cursor trail
    const rainbowColors = [
        '#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#8b00ff'
    ];
    let colorIndex = 0;

    document.addEventListener('mousemove', function(e) {
        let trailDot = document.createElement('div');
        trailDot.className = 'cursor-trail-dot';
        document.body.appendChild(trailDot);

        trailDot.style.left = (e.pageX - 5) + 'px'; // Adjust -5 to center the dot
        trailDot.style.top = (e.pageY - 5) + 'px';
        trailDot.style.backgroundColor = rainbowColors[colorIndex];

        colorIndex = (colorIndex + 1) % rainbowColors.length;

        setTimeout(() => {
            trailDot.style.opacity = '0';
            trailDot.style.transform = 'scale(0.5)';
        }, 100); // Start fade out almost immediately

        setTimeout(() => {
            document.body.removeChild(trailDot);
        }, 500); // Remove after animation (500ms matches CSS transition)
    });

}); 