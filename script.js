// Global Variables
let isMenuOpen = false;
let skillsAnimated = false;
let mouse = { x: 0, y: 0 };

// --- HERO PARTICLE SYSTEM ---
let heroParticles = [];

// --- BACKGROUND PARTICLE SYSTEM ---
let backgroundParticles = [];
let backgroundCanvas, backgroundCtx;
let mousePos = { x: null, y: null };

// Preloader functionality
window.addEventListener('load', function() {
    const preloader = document.getElementById('preloader');
    setTimeout(() => {
        preloader.classList.add('fade-out');
        setTimeout(() => {
            preloader.style.display = 'none';
            document.body.classList.add('loaded');
            setTimeout(() => {
                document.querySelectorAll('.hero-content > *').forEach((el, index) => {
                    el.style.animationDelay = `${index * 0.2}s`;
                    el.classList.add('fade-in');
                });
            }, 100);
        }, 500);
    }, 1500);
});

document.addEventListener('DOMContentLoaded', function() {
    console.log('particles.js test:', typeof window.particlesJS);
    // Remove the following lines to eliminate the background particle effect only:
    // const networkParticles = new NetworkParticles('networkCanvas');
    // window.networkParticles = networkParticles;
    
    // Optimize for mobile performance
    if (window.innerWidth <= 768) {
        const particleCount = window.innerWidth <= 480 ? 30 : 50;
        initHeroParticles(particleCount);
    } else {
        initHeroParticles();
    }
    
    // Initialize background particles
    initBackgroundParticles();
    
    initNavigation();
    initTypewriter();
    initScrollAnimations();
    initContactForm();
    initStickyHeader();
    initProfileImageTransition();
    initScrollToTopButton();
    animateHeroParticles();
    animateBackgroundParticles();
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Scroll indicator show/hide logic
    const scrollIndicator = document.querySelector('.scroll-indicator');
    const heroSection = document.querySelector('.hero-section');
    function toggleScrollIndicator() {
        if (!scrollIndicator || !heroSection) return;
        const heroBottom = heroSection.getBoundingClientRect().bottom;
        if (heroBottom <= 0) {
            scrollIndicator.classList.add('scroll-indicator--visible');
        } else {
            scrollIndicator.classList.remove('scroll-indicator--visible');
        }
    }
    window.addEventListener('scroll', toggleScrollIndicator);
    toggleScrollIndicator(); // Initial check
});

function initStickyHeader() {
    const navbar = document.getElementById('navbar');
    const navLogo = document.querySelector('.nav-logo');
    if (!navbar || !navLogo) return;
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 100) {
            navLogo.classList.add('wave-active');
            navbar.style.background = 'rgba(17, 24, 39, 0.98)';
            navbar.style.borderBottom = '2px solid var(--accent-purple)';
        } else {
            navLogo.classList.remove('wave-active');
            navbar.style.background = 'rgba(17, 24, 39, 0.9)';
            navbar.style.borderBottom = '1px solid var(--border-color)';
        }
    });
}

// Hero Particle Class
class Particle {
    constructor(canvas) {
        this.canvas = canvas;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 1;
        this.vy = (Math.random() - 0.5) * 1;
        this.size = Math.random() * 3 + 1;
        this.opacity = Math.random() * 0.8 + 0.2;
    }
    
    update() {
        this.x += this.vx;
        this.y += this.vy;
        
        // Bounce off edges
        if (this.x <= 0 || this.x >= this.canvas.width) this.vx *= -1;
        if (this.y <= 0 || this.y >= this.canvas.height) this.vy *= -1;
    }
    
    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = '#8b5cf6';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

function initHeroParticles(particleCount = 30) {
    const canvas = document.getElementById('heroParticleCanvas');
    const heroContent = document.querySelector('.hero-content');
    if (!canvas || !heroContent) return;
    function resizeCanvas() {
        canvas.width = heroContent.clientWidth;
        canvas.height = heroContent.clientHeight;
        heroParticles = [];
        for (let i = 0; i < particleCount; i++) {
            heroParticles.push(new Particle(canvas));
        }
    }
    resizeCanvas();
    window.addEventListener('resize', debounce(resizeCanvas, 250));
}

function animateHeroParticles() {
    const canvas = document.getElementById('heroParticleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    // Draw connecting lines
    for (let i = 0; i < heroParticles.length; i++) {
        for (let j = i + 1; j < heroParticles.length; j++) {
            const dx = heroParticles[i].x - heroParticles[j].x;
            const dy = heroParticles[i].y - heroParticles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 100) {
                ctx.save();
                ctx.globalAlpha = 0.22 * (1 - distance / 100);
                ctx.beginPath();
                ctx.moveTo(heroParticles[i].x, heroParticles[i].y);
                ctx.lineTo(heroParticles[j].x, heroParticles[j].y);
                ctx.strokeStyle = '#8b5cf6';
                ctx.lineWidth = 1.1;
                ctx.stroke();
                ctx.restore();
            }
        }
    }
    for (let i = 0; i < heroParticles.length; i++) {
        heroParticles[i].update();
        heroParticles[i].draw(ctx);
    }
    requestAnimationFrame(animateHeroParticles);
}

// Background Particle System
function initBackgroundParticles() {
    backgroundCanvas = document.getElementById('particleBackground');
    if (!backgroundCanvas) return;
    
    backgroundCtx = backgroundCanvas.getContext('2d');
    if (!backgroundCtx) return;
    
    function resizeBackgroundCanvas() {
        backgroundCanvas.width = window.innerWidth;
        backgroundCanvas.height = window.innerHeight;
        
        // Clear existing particles
        backgroundParticles = [];
        
        // Create particles based on screen size
        const particleCount = Math.min(60, Math.floor((window.innerWidth * window.innerHeight) / 18000));
        
        for (let i = 0; i < particleCount; i++) {
            backgroundParticles.push(new BackgroundParticle(backgroundCanvas));
        }
    }
    
    resizeBackgroundCanvas();
    window.addEventListener('resize', debounce(resizeBackgroundCanvas, 250));
}

function animateBackgroundParticles() {
    if (!backgroundCanvas || !backgroundCtx) return;
    const w = backgroundCanvas.width;
    const h = backgroundCanvas.height;
    backgroundCtx.clearRect(0, 0, w, h);
    // No background particles or animation drawn
    requestAnimationFrame(animateBackgroundParticles);
}

// Background Particle Class
class BackgroundParticle {
    constructor(canvas) {
        this.canvas = canvas;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        // Always have a base velocity for natural movement
        this.baseVx = (Math.random() - 0.5) * 0.3;
        this.baseVy = (Math.random() - 0.5) * 0.3;
        this.vx = this.baseVx;
        this.vy = this.baseVy;
        this.size = Math.random() * 1.5 + 0.7;
        this.opacity = Math.random() * 0.3 + 0.1;
    }
    update() {
        // Only natural movement
        this.vx += (this.baseVx - this.vx) * 0.01;
        this.vy += (this.baseVy - this.vy) * 0.01;
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= 0.98;
        this.vy *= 0.98;
        if (this.x < 0) this.x = this.canvas.width;
        if (this.x > this.canvas.width) this.x = 0;
        if (this.y < 0) this.y = this.canvas.height;
        if (this.y > this.canvas.height) this.y = 0;
    }
    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = '#8b5cf6';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

function initNavigation() {
    const hamburger = document.querySelector('.nav-hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const navLinks = document.querySelectorAll('.nav-link, .mobile-link');
    hamburger.addEventListener('click', () => {
        isMenuOpen = !isMenuOpen;
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
    });
    document.querySelectorAll('.mobile-link').forEach(link => {
        link.addEventListener('click', () => {
            isMenuOpen = false;
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
        });
    });
    window.addEventListener('scroll', () => {
        const sections = ['home', 'about', 'experience', 'education', 'skills', 'projects', 'achievements', 'contact'];
        let current = '';
        sections.forEach(section => {
            const element = document.getElementById(section);
            if (element) {
                const rect = element.getBoundingClientRect();
                if (rect.top <= 100 && rect.bottom >= 100) {
                    current = section;
                }
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

function initTypewriter() {
    const typewriterElement = document.getElementById('typewriter');
    const texts = ['Junior Officer', 'IT Support Specialist', 'Cybersecurity Enthusiast', 'IoT-savvy', 'Problem Solver'];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeDelay = 100;
    function typeWriter() {
        const currentText = texts[textIndex];
        if (isDeleting) {
            typewriterElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            typeDelay = 50;
        } else {
            typewriterElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            typeDelay = 100;
        }
        if (!isDeleting && charIndex === currentText.length) {
            typeDelay = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typeDelay = 500;
        }
        setTimeout(typeWriter, typeDelay);
    }
    setTimeout(typeWriter, 1000);
}

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                if (entry.target.id === 'skills' && !skillsAnimated) {
                    animateSkills();
                    skillsAnimated = true;
                }
            }
        });
    }, observerOptions);
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
    document.querySelectorAll('.skill-card, .project-card, .stat-card, .achievements-card, .education-card, .timeline-item').forEach((el, index) => {
        el.style.animationDelay = `${index * 0.1}s`;
        observer.observe(el);
    });
}

function animateSkills() {
    const skillCards = document.querySelectorAll('.skill-card');
    skillCards.forEach((card, index) => {
        setTimeout(() => {
            const level = card.dataset.level;
            const progressBar = card.querySelector('.skill-progress');
            const skillLevel = card.querySelector('.skill-level');
            if (progressBar) {
                let percentage;
                switch(level) {
                    case 'basic': percentage = 35; break;
                    case 'intermediate': percentage = 70; break;
                    case 'advanced': percentage = 95; break;
                    default: percentage = 50;
                }
                progressBar.style.width = `${percentage}%`;
            }
            if (skillLevel) {
                skillLevel.classList.add('animate');
            }
        }, index * 300);
    });
}

function initContactForm() {
    const form = document.getElementById('contactForm');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(form);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message')
        };
        showToast('Message sent successfully! I\'ll get back to you soon.');
        form.reset();
    });
}

function showToast(message) {
    const toast = document.getElementById('toast');
    const messageElement = toast.querySelector('.toast-message');
    messageElement.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.project-card, .achievements-card, .education-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.02) translateY(-5px)';
        });
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) translateY(0)';
        });
    });
});

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.transform = `translateY(${scrolled * 0.1}px)`;
    }
});

// Utility: Debounce
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Utility: Should Reduce Motion
function shouldReduceMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches || 
           window.innerWidth <= 480;
}

// Profile Image Transition (stub for compatibility)
function initScrollToTopButton() {
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    if (!scrollToTopBtn) return;
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.classList.add('show');
        } else {
            scrollToTopBtn.classList.remove('show');
        }
    });
    
    // Smooth scroll to top when button is clicked
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

function initProfileImageTransition() {}

// Hamburger menu toggle for mobile
// (Add at the end of script.js)
document.addEventListener('DOMContentLoaded', function () {
    const hamburger = document.querySelector('.nav-hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    hamburger.addEventListener('click', function () {
        hamburger.classList.toggle('open');
        mobileMenu.classList.toggle('open');
        document.body.classList.toggle('no-scroll');
    });

    // Close mobile menu when a link is clicked
    mobileLinks.forEach(link => {
        link.addEventListener('click', function () {
            hamburger.classList.remove('open');
            mobileMenu.classList.remove('open');
            document.body.classList.remove('no-scroll');
        });
    });
});

// Flip Card Animation Logic
(function() {
  const flipCard = document.querySelector('.flip-card');
  if (!flipCard) return;
  let isFlipped = false;
  let flipInterval;
  let hoverPaused = false;

  function flip() {
    if (!hoverPaused) {
      isFlipped = !isFlipped;
      flipCard.classList.toggle('flipping', isFlipped);
    }
  }

  function startFlipping() {
    flipInterval = setInterval(flip, 15000);
  }

  function stopFlipping() {
    clearInterval(flipInterval);
  }

  // Start flipping automatically
  startFlipping();

  // Pause on hover
  flipCard.addEventListener('mouseenter', function() {
    hoverPaused = true;
    stopFlipping();
  });
  flipCard.addEventListener('mouseleave', function() {
    hoverPaused = false;
    startFlipping();
  });

  // Ensure the card flips back to front after 10s
  setInterval(function() {
    if (!hoverPaused && isFlipped) {
      isFlipped = false;
      flipCard.classList.remove('flipping');
    }
  }, 20000);
})();

// Ensure particles.js is loaded and initialize as soon as possible
function initParticlesNetwork() {
    if (typeof window.particlesJS !== 'function') {
        console.error('particles.js is not loaded!');
        return;
    }
    particlesJS('particles-js', {
        particles: {
            number: { value: 90, density: { enable: true, value_area: 900 } },
            color: { value: '#a78bfa' },
            shape: { type: 'circle' },
            opacity: { value: 0.11, random: false },
            size: { value: 3.5, random: false },
            line_linked: {
                enable: true,
                distance: 100,
                color: '#a78bfa',
                opacity: 0.45,
                width: 2.2
            },
            move: {
                enable: true,
                speed: 0.4,
                direction: 'none',
                random: true,
                straight: false,
                out_mode: 'out',
                bounce: false
            }
        },
        interactivity: {
            detect_on: 'window',
            events: {
                onhover: { enable: true, mode: 'repulse' },
                onclick: { enable: false },
                resize: true
            },
            modes: {
                repulse: { distance: 70, duration: 1.2 }
            }
        },
        retina_detect: true
    });
}

// Try to initialize particles.js as soon as the script is loaded
if (document.getElementById('particles-js')) {
    if (typeof window.particlesJS === 'function') {
        initParticlesNetwork();
    } else {
        // Wait for the CDN to load if not yet available
        let tries = 0;
        const tryInit = setInterval(() => {
            if (typeof window.particlesJS === 'function') {
                clearInterval(tryInit);
                initParticlesNetwork();
            } else if (++tries > 20) {
                clearInterval(tryInit);
                console.error('particles.js failed to load after waiting.');
            }
        }, 200);
    }
}


