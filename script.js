console.log('script.js loaded');

// Track preloader start time from when script loads
const preloaderStartTime = Date.now();
console.log('Preloader tracking started at:', preloaderStartTime);

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

// Interactive Preloader functionality
function initPreloader() {
    const preloader = document.getElementById('preloader');
    const loadingMessage = document.getElementById('loadingMessage');
    const didYouKnowSection = document.getElementById('didYouKnowSection');
    const factsSection = document.getElementById('factsSection');
    const progressBar = document.getElementById('progressBar');
    
    // Add preloader-active class to hide scrollbar
    document.body.classList.add('preloader-active');
    
    // Tech facts and quotes array
    const techFacts = [
        { text: "Cybersecurity is not a product, but a process.", source: "Bruce Schneier" },
        { text: "The best error message is the one that never appears.", source: "Jesse James Garrett" },
        { text: "Technology is best when it brings people together.", source: "Matt Mullenweg" },
        { text: "The computer was born to solve problems that did not exist before.", source: "Bill Gates" },
        { text: "Software is eating the world.", source: "Marc Andreessen" },
        { text: "The future belongs to those who believe in the beauty of their dreams.", source: "Eleanor Roosevelt" },
        { text: "Innovation distinguishes between a leader and a follower.", source: "Steve Jobs" },
        { text: "The only way to do great work is to love what you do.", source: "Steve Jobs" },
        { text: "Code is like humor. When you have to explain it, it's bad.", source: "Cory House" },
        { text: "The best way to predict the future is to invent it.", source: "Alan Kay" },
        { text: "Programming isn't about what you know; it's about what you can figure out.", source: "Chris Pine" },
        { text: "The most damaging phrase in the language is 'We've always done it this way.'", source: "Grace Hopper" },
        { text: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.", source: "Martin Fowler" },
        { text: "The best error message is the one that never appears.", source: "Jesse James Garrett" },
        { text: "First, solve the problem. Then, write the code.", source: "John Johnson" }
    ];
    
    let currentFactIndex = 0;
    let factInterval;
    
    // Function to update fact
    function updateFact() {
        const factText = document.getElementById('factText');
        const factSource = document.getElementById('factSource');
        
        if (factText && factSource) {
            // Modern fade out with scale and blur effect
            factText.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            factSource.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            
            factText.style.opacity = '0';
            factText.style.transform = 'translateY(-20px) scale(0.95)';
            factText.style.filter = 'blur(2px)';
            
            factSource.style.opacity = '0';
            factSource.style.transform = 'translateY(-15px) scale(0.95)';
            factSource.style.filter = 'blur(2px)';
            
            setTimeout(() => {
                const fact = techFacts[currentFactIndex];
                factText.textContent = `"${fact.text}"`;
                factSource.textContent = `- ${fact.source}`;
                
                // Modern fade in with bounce effect
                factText.style.opacity = '1';
                factText.style.transform = 'translateY(0) scale(1)';
                factText.style.filter = 'blur(0)';
                
                factSource.style.opacity = '1';
                factSource.style.transform = 'translateY(0) scale(1)';
                factSource.style.filter = 'blur(0)';
                
                // Add subtle bounce animation
                setTimeout(() => {
                    factText.style.transform = 'translateY(-2px) scale(1.02)';
                    factSource.style.transform = 'translateY(-1px) scale(1.01)';
                    
                    setTimeout(() => {
                        factText.style.transform = 'translateY(0) scale(1)';
                        factSource.style.transform = 'translateY(0) scale(1)';
                    }, 150);
                }, 100);
                
                currentFactIndex = (currentFactIndex + 1) % techFacts.length;
            }, 400);
        }
    }
    
    // Loading time-based text reveal system
    function showTextBasedOnLoadingTime() {
        const currentTime = Date.now();
        const elapsedTime = currentTime - preloaderStartTime;
        
        // Show loading message after 3 seconds of actual loading
        if (elapsedTime >= 3000 && !loadingMessage.classList.contains('show')) {
            if (loadingMessage) {
                loadingMessage.classList.add('show');
                console.log('Loading message shown after', elapsedTime, 'ms of loading');
            }
        }
        
        // Show "Did You Know?" section 2 seconds after loading message (5 seconds total)
        if (elapsedTime >= 5000 && !didYouKnowSection.classList.contains('show')) {
            if (didYouKnowSection) {
                didYouKnowSection.classList.add('show');
                
                // Animate "Did You Know?" text line by line
                const didYouKnowText = document.getElementById('didYouKnowText');
                if (didYouKnowText) {
                    // First show the text container
                    didYouKnowText.classList.add('show');
                    
                    const textLines = didYouKnowText.querySelectorAll('.text-line');
                    textLines.forEach((line, index) => {
                        const delay = parseFloat(line.getAttribute('data-delay')) * 1000;
                        setTimeout(() => {
                            line.classList.add('show');
                        }, delay);
                    });
                }
                
                console.log('Did You Know section shown after', elapsedTime, 'ms of loading');
            }
        }
        
        // Show facts section 1 second after "Did You Know?" (6 seconds total)
        if (elapsedTime >= 6000 && !factsSection.classList.contains('show')) {
            if (factsSection) {
                factsSection.classList.add('show');
                updateFact(); // Show first fact
                
                // Start fact rotation every 5 seconds
                factInterval = setInterval(updateFact, 5000);
                console.log('Facts section shown after', elapsedTime, 'ms of loading');
            }
        }
        

    }
    
    // Check loading time every 100ms
    const loadingTimeInterval = setInterval(showTextBasedOnLoadingTime, 100);
    

    
    // Progress bar animation
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 90) progress = 90; // Don't complete until ready
        
        if (progressBar) {
            progressBar.style.width = progress + '%';
        }
    }, 200);
    
    // Function to check if all resources are loaded
    function checkAllResourcesLoaded() {
        return new Promise((resolve) => {
            // Check if all images are loaded
            const images = document.querySelectorAll('img');
            const imagePromises = Array.from(images).map(img => {
                if (img.complete) {
                    return Promise.resolve();
                } else {
                    return new Promise(resolve => {
                        img.addEventListener('load', resolve);
                        img.addEventListener('error', resolve); // Continue even if image fails
                    });
                }
            });
            
            // Check if all videos are loaded
            const videos = document.querySelectorAll('video');
            const videoPromises = Array.from(videos).map(video => {
                return new Promise(resolve => {
                    if (video.readyState >= 2) { // HAVE_CURRENT_DATA
                        resolve();
                    } else {
                        video.addEventListener('canplay', resolve);
                        video.addEventListener('error', resolve); // Continue even if video fails
                    }
                });
            });
            
            // Check if all external resources are loaded
            const externalResources = [
                'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
                'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700&display=swap',
                'https://fonts.googleapis.com/css2?family=Fuzzy+Bubbles:wght@700&display=swap',
                'https://fonts.googleapis.com/css2?family=La+Belle+Aurore&display=swap',
                'https://cdn.jsdelivr.net/npm/particles.js@2.0.0/particles.min.js'
            ];
            
            const resourcePromises = externalResources.map(url => {
                return new Promise(resolve => {
                    const link = document.createElement('link');
                    link.rel = 'preload';
                    link.href = url;
                    link.onload = resolve;
                    link.onerror = resolve; // Continue even if resource fails
                    document.head.appendChild(link);
                });
            });
            
            // Wait for all resources to load
            Promise.all([...imagePromises, ...videoPromises, ...resourcePromises])
                .then(() => {
                    // Additional delay to ensure everything is ready
                    setTimeout(resolve, 1000);
                });
        });
    }
    
    // Function to complete loading and hide preloader
    function completeLoading() {
        clearInterval(progressInterval);
        if (progressBar) {
            progressBar.style.width = '100%';
        }
        
        // Clear fact interval
        if (factInterval) {
            clearInterval(factInterval);
        }
        
        // Hide preloader
        setTimeout(() => {
            preloader.classList.add('fade-out');
            setTimeout(() => {
                preloader.style.display = 'none';
                document.body.classList.add('loaded');
                document.body.classList.remove('preloader-active');
                
                // Scroll to top if fresh page load
                if (performance.navigation.type === 0) {
                    window.scrollTo(0, 0);
                }
                
                // Animate hero content
                setTimeout(() => {
                    document.querySelectorAll('.hero-content > *').forEach((el, index) => {
                        el.style.animationDelay = `${index * 0.2}s`;
                        el.classList.add('fade-in');
                    });
                }, 100);
            }, 500);
        }, 1000);
    }
    
    // Check for resource loading and complete when ready
    checkAllResourcesLoaded().then(() => {
        console.log('All resources loaded, completing preloader');
        completeLoading();
    });
    
    // Fallback: Complete loading after maximum 15 seconds if resources don't load
    setTimeout(() => {
        console.log('Fallback: Completing preloader after timeout');
        completeLoading();
    }, 15000);
}

// Initialize preloader when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initPreloader();
    
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
  
  // Initialize footer floating shapes

  

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



