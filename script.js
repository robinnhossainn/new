console.log('script.js loaded');

// Hide scrollbar immediately when script loads
if (document.body) {
    document.body.classList.add('preloader-active');
} else {
    document.addEventListener('DOMContentLoaded', function() {
        document.body.classList.add('preloader-active');
    });
}

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

// Smart Preloader System
const techFacts = [
    {
        text: "The first computer virus was created in 1986 by two Pakistani brothers to protect their software from piracy.",
        source: "Computer History Museum",
        icon: "fas fa-shield-alt"
    },
    {
        text: "The term 'bug' in programming was coined by Grace Hopper when an actual bug was found in a computer in 1947.",
        source: "Harvard University",
        icon: "fas fa-bug"
    },
    {
        text: "The first website went live on August 6, 1991, created by Tim Berners-Lee at CERN.",
        source: "CERN",
        icon: "fas fa-globe"
    },
    {
        text: "The average person spends 6 hours and 42 minutes online every day.",
        source: "Digital 2023 Report",
        icon: "fas fa-clock"
    },
    {
        text: "Cybersecurity spending is expected to reach $188 billion by 2024.",
        source: "Gartner",
        icon: "fas fa-lock"
    },
    {
        text: "The first email was sent in 1971 by Ray Tomlinson, who also introduced the @ symbol.",
        source: "MIT",
        icon: "fas fa-envelope"
    },
    {
        text: "There are over 1.8 billion websites on the internet today.",
        source: "Internet Live Stats",
        icon: "fas fa-server"
    },
    {
        text: "The first smartphone was created by IBM in 1994, called the Simon Personal Communicator.",
        source: "IBM",
        icon: "fas fa-mobile-alt"
    },
    {
        text: "The average cost of a data breach in 2023 was $4.45 million.",
        source: "IBM Security",
        icon: "fas fa-exclamation-triangle"
    },
    {
        text: "The first domain name ever registered was symbolics.com on March 15, 1985.",
        source: "Network Solutions",
        icon: "fas fa-link"
    }
];

let currentFactIndex = 0;
let factInterval;
let progressInterval;
let skipButtonTimeout;

function initSmartPreloader() {
    const preloader = document.getElementById('preloader');
    const factsSection = document.getElementById('factsSection');
    const skipButton = document.getElementById('skipButton');
    const progressBar = document.getElementById('progressBar');
    
    if (!preloader) return;
    
    // Add preloader-active class to hide scrollbar
    document.body.classList.add('preloader-active');
    
    // Show facts after 5 seconds
    setTimeout(() => {
        if (preloader.classList.contains('fade-out')) return;
        
        factsSection.classList.add('show');
        startFactRotation();
        startProgressBar();
    }, 5000);
    
    // Show skip button after 10 seconds
    setTimeout(() => {
        if (preloader.classList.contains('fade-out')) return;
        
        skipButton.classList.add('show');
        skipButtonTimeout = setTimeout(() => {
            skipButton.style.opacity = '0.7';
        }, 5000);
    }, 10000);
    
    // Skip button functionality
    skipButton.addEventListener('click', () => {
        hidePreloader();
    });
    
    // Auto-hide preloader after 30 seconds (fallback)
    setTimeout(() => {
        if (!preloader.classList.contains('fade-out')) {
            hidePreloader();
        }
    }, 30000);
}

function startFactRotation() {
    factInterval = setInterval(() => {
        if (document.getElementById('preloader').classList.contains('fade-out')) {
            clearInterval(factInterval);
            return;
        }
        
        const factText = document.getElementById('factText');
        const factSource = document.getElementById('factSource');
        const factIcon = document.querySelector('.fact-icon');
        
        // Fade out
        factText.style.opacity = '0';
        factSource.style.opacity = '0';
        
        setTimeout(() => {
            // Update content
            currentFactIndex = (currentFactIndex + 1) % techFacts.length;
            const fact = techFacts[currentFactIndex];
            
            factText.textContent = fact.text;
            factSource.textContent = `— ${fact.source}`;
            factIcon.className = `${fact.icon} fact-icon`;
            
            // Fade in
            factText.style.opacity = '1';
            factSource.style.opacity = '1';
        }, 300);
    }, 10000);
}

function startProgressBar() {
    let progress = 0;
    progressInterval = setInterval(() => {
        if (document.getElementById('preloader').classList.contains('fade-out')) {
            clearInterval(progressInterval);
            return;
        }
        
        progress += Math.random() * 15;
        if (progress > 90) progress = 90;
        
        document.getElementById('progressBar').style.width = `${progress}%`;
    }, 2000);
}

function hidePreloader() {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;
    
    // Clear intervals
    if (factInterval) clearInterval(factInterval);
    if (progressInterval) clearInterval(progressInterval);
    if (skipButtonTimeout) clearTimeout(skipButtonTimeout);
    
    // Complete progress bar
    document.getElementById('progressBar').style.width = '100%';
    
    // Fade out preloader
    setTimeout(() => {
        preloader.classList.add('fade-out');
        setTimeout(() => {
            preloader.style.display = 'none';
            document.body.classList.add('loaded');
            
            // Remove preloader-active class to show scrollbar
            document.body.classList.remove('preloader-active');
            
            // Only scroll to top if it's a fresh page load (not a refresh)
            if (performance.navigation.type === 0) { // 0 = fresh page load
                window.scrollTo(0, 0);
            }
            
            setTimeout(() => {
                document.querySelectorAll('.hero-content > *').forEach((el, index) => {
                    el.style.animationDelay = `${index * 0.2}s`;
                    el.classList.add('fade-in');
                });
            }, 100);
        }, 500);
    }, 500);
}

// Initialize smart preloader
document.addEventListener('DOMContentLoaded', function() {
    initSmartPreloader();
});

// Fallback preloader functionality
window.addEventListener('load', function() {
    const preloader = document.getElementById('preloader');
    if (preloader && !preloader.classList.contains('fade-out')) {
        setTimeout(() => {
            hidePreloader();
        }, 1000);
    }
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

    // Quote Rotator for Favorite Quote section
    const quotes = [
        {
            text: `Every one of us is, in the cosmic perspective, precious. If a human disagrees with you, let him live. In a hundred billion galaxies, you will not find another.`,
            author: 'Carl Sagan'
        },
        {
            text: `If you're brave enough to say goodbye, life will reward you with a new hello.`,
            author: 'Paulo Coelho'
        },
        {
            text: `Nothing is impossible. Because 'impossible' says that "I-m-possible.`,
            author: 'Audrey Hepburn'
        },
        {
            text: `Every little thing that happens helps you grow, even if you can't see it!`,
            author: 'Unknown'
        }
    ];
    const quoteText = document.querySelector('.quote-text');
    const authorName = document.querySelector('.author-name');
    let quoteIndex = 0;
    function showQuote(index) {
        if (!quoteText || !authorName) return;
        // Fade out
        quoteText.style.transition = 'opacity 0.7s';
        authorName.style.transition = 'opacity 0.7s';
        quoteText.style.opacity = 0;
        authorName.style.opacity = 0;
        setTimeout(() => {
            quoteText.textContent = '"' + quotes[index].text + '"';
            authorName.textContent = quotes[index].author;
            // Fade in
            quoteText.style.opacity = 1;
            authorName.style.opacity = 1;
        }, 700);
    }
    setInterval(() => {
        quoteIndex = (quoteIndex + 1) % quotes.length;
        showQuote(quoteIndex);
    }, 10000);
    // Initialize with the first quote (which matches the HTML)
    showQuote(0);

    // Sticky navbar scroll effect
    const navbar = document.getElementById('navbar');
    function handleNavbarScroll() {
        if (!navbar) return;
        if (window.scrollY > 0) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    window.addEventListener('scroll', handleNavbarScroll);
    handleNavbarScroll(); // Initial check

      
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
    
    // Check if we're in footer section and hide particles if so
    const footer = document.querySelector('.footer');
    if (footer) {
        const footerTop = footer.offsetTop;
        const footerBottom = footerTop + footer.offsetHeight;
        const scrollPosition = window.scrollY;
        const windowHeight = window.innerHeight;
        const windowMiddle = scrollPosition + (windowHeight / 2);
        
        // If in footer section, hide the entire canvas element
        if (windowMiddle >= footerTop && windowMiddle <= footerBottom) {
            backgroundCanvas.style.opacity = '0';
            backgroundCanvas.style.visibility = 'hidden';
            requestAnimationFrame(animateBackgroundParticles);
            return;
        } else {
            // Show the canvas when not in footer
            backgroundCanvas.style.opacity = '1';
            backgroundCanvas.style.visibility = 'visible';
        }
    }
    
    const w = backgroundCanvas.width;
    const h = backgroundCanvas.height;
    backgroundCtx.clearRect(0, 0, w, h);
    // Draw connecting lines between particles
    for (let i = 0; i < backgroundParticles.length; i++) {
        for (let j = i + 1; j < backgroundParticles.length; j++) {
            const dx = backgroundParticles[i].x - backgroundParticles[j].x;
            const dy = backgroundParticles[i].y - backgroundParticles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 90) {
                backgroundCtx.save();
                backgroundCtx.globalAlpha = 0.13 * (1 - distance / 90);
                backgroundCtx.beginPath();
                backgroundCtx.moveTo(backgroundParticles[i].x, backgroundParticles[i].y);
                backgroundCtx.lineTo(backgroundParticles[j].x, backgroundParticles[j].y);
                backgroundCtx.strokeStyle = '#8b5cf6';
                backgroundCtx.lineWidth = 1.1;
                backgroundCtx.stroke();
                backgroundCtx.restore();
            }
        }
    }
    // Draw lines to mouse on hover
    if (mousePos.x !== null && mousePos.y !== null) {
        for (let i = 0; i < backgroundParticles.length; i++) {
            const dx = backgroundParticles[i].x - mousePos.x;
            const dy = backgroundParticles[i].y - mousePos.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 120) {
                backgroundCtx.save();
                backgroundCtx.globalAlpha = 0.18 * (1 - distance / 120);
                backgroundCtx.beginPath();
                backgroundCtx.moveTo(backgroundParticles[i].x, backgroundParticles[i].y);
                backgroundCtx.lineTo(mousePos.x, mousePos.y);
                backgroundCtx.strokeStyle = '#8b5cf6';
                backgroundCtx.lineWidth = 1.2;
                backgroundCtx.stroke();
                backgroundCtx.restore();
            }
        }
    }
    // Draw particles
    for (let i = 0; i < backgroundParticles.length; i++) {
        backgroundParticles[i].update();
        backgroundParticles[i].draw(backgroundCtx);
    }
    requestAnimationFrame(animateBackgroundParticles);
}

// Mouse tracking for background canvas
if (typeof window !== 'undefined') {
    window.addEventListener('mousemove', function(e) {
        if (!backgroundCanvas) return;
        const rect = backgroundCanvas.getBoundingClientRect();
        mousePos.x = e.clientX - rect.left;
        mousePos.y = e.clientY - rect.top;
    });
    window.addEventListener('mouseleave', function() {
        mousePos.x = null;
        mousePos.y = null;
    });
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
    const texts = ['Junior IT Officer', 'IT Support Specialist', 'Cybersecurity Enthusiast', 'IoT-savvy', 'Problem Solver'];
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
        console.log('Contact form submitted');
        emailjs.sendForm('service_ufqaqrp', 'template_dd14uz8', this)
            .then(function() {
                console.log('EmailJS: Success');
                showToast('Message sent successfully!');
        form.reset();
            }, function(error) {
                console.log('EmailJS: Failed', error);
                showToast('Failed to send message. Please try again.');
            });
    });
}

function showToast(message) {
    const toast = document.getElementById('toast');
    const messageElement = toast.querySelector('.toast-message');
    messageElement.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 5000);
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

document.getElementById('contactForm').addEventListener('submit', function(e) {
  e.preventDefault();
  console.log('Manual handler: Contact form submitted');
});

// Navigation indicator functionality
function updateNavIndicator() {
    // Skip if scroll updates are temporarily disabled (after click)
    if (window.scrollUpdateDisabled) return;
    
    const sections = ['home', 'about', 'experience', 'education', 'skills', 'projects', 'achievements', 'contact'];
    const navLinks = document.querySelectorAll('.nav-link');
    const navIndicator = document.querySelector('.nav-indicator');
    
    if (!navIndicator) return;
    
    let currentSection = null;
    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;
    const windowMiddle = scrollPosition + (windowHeight / 2);
    
    // Find which section is currently in the center of the viewport
    sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionBottom = sectionTop + sectionHeight;
            const sectionMiddle = sectionTop + (sectionHeight / 2);
            
            // Check if section middle is in the viewport middle
            if (windowMiddle >= sectionTop && windowMiddle <= sectionBottom) {
                currentSection = sectionId;
            }
        }
    });
    
    // If no section is detected, find the closest one
    if (!currentSection) {
        let closestSection = 'home';
        let closestDistance = Infinity;
        
        sections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionMiddle = sectionTop + (sectionHeight / 2);
                const distance = Math.abs(windowMiddle - sectionMiddle);
                
                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestSection = sectionId;
                }
            }
        });
        currentSection = closestSection;
    }
    
    // Update active nav link and move indicator
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
            
            // Move indicator to active link
            navIndicator.style.width = `${link.offsetWidth}px`;
            navIndicator.style.left = `${link.offsetLeft}px`;
        }
    });
    
    // Debug logging (only when section changes)
    if (window.lastSection !== currentSection) {
        console.log('Section changed to:', currentSection, 'Scroll position:', scrollPosition);
        window.lastSection = currentSection;
    }
}

// Progressive Scroll Sidebar (Bar Expands Top to Bottom)
window.addEventListener('scroll', function() {
  const scrollBarBg = document.querySelector('.scroll-bar-bg');
  const scrollBarProgress = document.getElementById('scrollBarProgress');
  const navbarScrollPercent = document.getElementById('navbarScrollPercent');
  if (!scrollBarBg || !scrollBarProgress || !navbarScrollPercent) return;
  
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  
  // Calculate hero section percentage
  const heroSection = document.querySelector('.hero-section');
  const heroHeight = heroSection ? heroSection.offsetHeight : 0;
  const totalPageHeight = document.documentElement.scrollHeight;
  const heroPercentage = Math.round((heroHeight / totalPageHeight) * 100);
  
  // Log hero section percentage (temporary for user to see)
  if (scrollTop === 0) {
    console.log(`Hero section height: ${heroHeight}px`);
    console.log(`Total page height: ${totalPageHeight}px`);
    console.log(`Hero section percentage: ${heroPercentage}%`);
  }
  
  const percent = docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0;
  const finalPercent = Math.max(4, percent);
  
  navbarScrollPercent.textContent = finalPercent + '%';
  // Set progress bar height (from top down)
  const barHeight = scrollBarBg.offsetHeight;
  const progressHeight = Math.max(0, Math.min(100, finalPercent)) * barHeight / 100;
  scrollBarProgress.style.height = progressHeight + 'px';
  scrollBarProgress.style.top = '0';

  // Move percentage indicator to the edge of the moving side of the scroll bar
  const barRect = scrollBarBg.getBoundingClientRect();
  const labelHeight = navbarScrollPercent.offsetHeight;
  let labelTop = barRect.top + (finalPercent / 100) * barHeight - (labelHeight / 2);
  
  // Prevent the indicator from going too low (clipping with taskbar)
  const minTopPosition = 80; // Minimum distance from bottom
  const maxTopPosition = barRect.top + barHeight - labelHeight - 20; // Maximum position with some padding
  
  labelTop = Math.max(minTopPosition, Math.min(labelTop, maxTopPosition));
  navbarScrollPercent.style.top = labelTop + 'px';
  navbarScrollPercent.style.right = '16px';

  // Add/remove scrolling class for visibility
  const scrollSidebar = document.getElementById('scrollSidebar');
  const scrollBarLabel = document.querySelector('.scroll-bar-label');
  
  if (scrollTop > 50) {
    scrollSidebar.classList.add('scrolling');
    scrollBarLabel.classList.add('scrolling');
  } else {
    scrollSidebar.classList.remove('scrolling');
    scrollBarLabel.classList.remove('scrolling');
  }
  
  // Update navigation indicator
  updateNavIndicator();
});

// Add a separate scroll listener specifically for navigation indicator
window.addEventListener('scroll', function() {
  // Throttle the scroll event for better performance
  if (window.scrollTimeout) return;
  
  window.scrollTimeout = setTimeout(() => {
    updateNavIndicator();
    window.scrollTimeout = null;
  }, 10); // 10ms throttle
});

// Initialize navigation indicator on page load
document.addEventListener('DOMContentLoaded', function() {
  updateNavIndicator();
  
  // Add click event listeners to nav links
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      // Temporarily disable scroll-based updates for a short time
      window.scrollUpdateDisabled = true;
      setTimeout(() => {
        window.scrollUpdateDisabled = false;
      }, 1000); // Re-enable after 1 second
      
      // Remove active class from all links
      navLinks.forEach(l => l.classList.remove('active'));
      
      // Add active class to clicked link
      this.classList.add('active');
      
      // Move indicator to clicked link
      const navIndicator = document.querySelector('.nav-indicator');
      if (navIndicator) {
        navIndicator.style.width = `${this.offsetWidth}px`;
        navIndicator.style.left = `${this.offsetLeft}px`;
      }
    });
  });
  
  
  
  

});





// Download icon click handler
document.addEventListener('DOMContentLoaded', function() {
  const downloadIcon = document.querySelector('.contact-section .contact-item:nth-child(4) .contact-icon');
  
  if (downloadIcon) {
    downloadIcon.addEventListener('click', function() {
      const iconElement = this.querySelector('i');
      if (iconElement) {
        this.classList.add('clicked');
        
        // Remove the clicked class after animation completes
        setTimeout(() => {
          this.classList.remove('clicked');
        }, 800);
      }
    });
  }
});



