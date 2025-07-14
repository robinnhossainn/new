// Global Variables
let particles = [];
let isMenuOpen = false;
let skillsAnimated = false;
let mouse = { x: 0, y: 0 };

// Preloader functionality
window.addEventListener('load', function() {
    const preloader = document.getElementById('preloader');
    
    // Hide preloader after page is fully loaded
    setTimeout(() => {
        preloader.classList.add('fade-out');
        
        // Remove preloader from DOM after animation completes
        setTimeout(() => {
            preloader.style.display = 'none';
            document.body.classList.add('loaded');
            
            // Trigger initial animations after preloader is hidden
            setTimeout(() => {
                document.querySelectorAll('.hero-content > *').forEach((el, index) => {
                    el.style.animationDelay = `${index * 0.2}s`;
                    el.classList.add('fade-in');
                });
            }, 100);
        }, 500);
    }, 1500); // Show preloader for 1.5 seconds minimum
});

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing features...');
    
    // Optimize for mobile performance
    if (window.innerWidth <= 768) {
        // Reduce particle count on mobile
        const particleCount = window.innerWidth <= 480 ? 30 : 50;
        initParticles(particleCount);
    } else {
        initParticles();
    }
    
    initParticles();
    initNavigation();
    initTypewriter();
    initScrollAnimations();
    initContactForm();
    initScrollToTop();

    initStickyHeader();
    initProfileImageTransition();
    console.log('All features initialized');
    
    // Start animation loops
    animateParticles();
    
    // Add smooth scrolling for all anchor links
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
});



// Scroll to Top Button
function initScrollToTop() {
    const scrollToTopBtn = document.getElementById('scrollToTop');
    
    if (!scrollToTopBtn) {
        console.log('Scroll to top button not found!');
        return;
    }
    
    console.log('Scroll to top button initialized');
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 200) {
            scrollToTopBtn.classList.add('show');
        } else {
            scrollToTopBtn.classList.remove('show');
        }
    });
    
    // Scroll to top when clicked
    scrollToTopBtn.addEventListener('click', () => {
        console.log('Scroll to top button clicked!');
        
        // Smooth scroll to top
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Sticky Header
function initStickyHeader() {
    const navbar = document.getElementById('navbar');
    const navLogo = document.querySelector('.nav-logo');
    
    if (!navbar || !navLogo) {
        console.log('Navbar or nav-logo not found');
        return;
    }
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 100) {
            navLogo.classList.add('wave-active');
            navbar.style.background = 'rgba(17, 24, 39, 0.98)';
            navbar.style.borderBottom = '2px solid var(--accent-purple)';
            console.log('Wave animation activated');
        } else {
            navLogo.classList.remove('wave-active');
            navbar.style.background = 'rgba(17, 24, 39, 0.9)';
            navbar.style.borderBottom = '1px solid var(--border-color)';
        }
    });
}

// Particle System
class Particle {
    constructor(canvas) {
        this.canvas = canvas;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.baseX = this.x;
        this.baseY = this.y;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 2 + 1;
        this.alpha = Math.random() * 0.5 + 0.2;
        this.density = (Math.random() * 30) + 1;
    }
    
    update() {
        // Calculate distance from mouse
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        let forceDirectionX = dx / distance;
        let forceDirectionY = dy / distance;
        let maxDistance = 100;
        let force = (maxDistance - distance) / maxDistance;
        let directionX = forceDirectionX * force * this.density;
        let directionY = forceDirectionY * force * this.density;
        
        if (distance < maxDistance) {
            this.x -= directionX;
            this.y -= directionY;
        } else {
            if (this.x !== this.baseX) {
                let dx = this.x - this.baseX;
                this.x -= dx / 10;
            }
            if (this.y !== this.baseY) {
                let dy = this.y - this.baseY;
                this.y -= dy / 10;
            }
        }
        
        // Original movement
        this.x += this.vx;
        this.y += this.vy;
        this.baseX += this.vx;
        this.baseY += this.vy;
        
        // Bounce off edges
        if (this.baseX < 0 || this.baseX > this.canvas.width) {
            this.vx *= -1;
        }
        if (this.baseY < 0 || this.baseY > this.canvas.height) {
            this.vy *= -1;
        }
        
        // Keep particles within bounds
        this.baseX = Math.max(0, Math.min(this.canvas.width, this.baseX));
        this.baseY = Math.max(0, Math.min(this.canvas.height, this.baseY));
    }
    
    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(147, 51, 234, ${this.alpha})`;
        ctx.fill();
    }
}

function initParticles(particleCount = 100) {
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');
    
    // Track mouse movement
    canvas.addEventListener('mousemove', function(event) {
        const rect = canvas.getBoundingClientRect();
        mouse.x = event.clientX - rect.left;
        mouse.y = event.clientY - rect.top;
    });
    
    // Reset mouse position when leaving canvas
    canvas.addEventListener('mouseleave', function() {
        mouse.x = -1000;
        mouse.y = -1000;
    });
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        // Recreate particles after resize
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle(canvas));
        }
    }
    
    // Initial setup
    resizeCanvas();
    
    // Handle window resize
    window.addEventListener('resize', debounce(resizeCanvas, 250));
}

function animateParticles() {
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    // Skip animation on very small screens or if reduced motion is preferred
    if (shouldReduceMotion()) {
        requestAnimationFrame(animateParticles);
        return;
    }
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update and draw particles
    particles.forEach((particle, index) => {
        particle.update();
        particle.draw(ctx);
        
        // Draw connections
        if (window.innerWidth > 768) {
            particles.slice(index + 1).forEach(otherParticle => {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    ctx.beginPath();
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(otherParticle.x, otherParticle.y);
                    ctx.strokeStyle = `rgba(147, 51, 234, ${0.1 * (1 - distance / 100)})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            });
        }
    });
    
    requestAnimationFrame(animateParticles);
}

// Navigation
function initNavigation() {
    const hamburger = document.querySelector('.nav-hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const navLinks = document.querySelectorAll('.nav-link, .mobile-link');
    
    // Hamburger menu toggle
    hamburger.addEventListener('click', () => {
        isMenuOpen = !isMenuOpen;
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.mobile-link').forEach(link => {
        link.addEventListener('click', () => {
            isMenuOpen = false;
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
        });
    });
    
    // Update active nav link on scroll
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
        
        // Update active class
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Typewriter Effect
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
    
    // Start typing after a short delay
    setTimeout(typeWriter, 1000);
}

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                
                // Animate skills bars when skills section is visible
                if (entry.target.id === 'skills' && !skillsAnimated) {
                    animateSkills();
                    skillsAnimated = true;
                }
            }
        });
    }, observerOptions);
    
    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
    
    // Observe individual elements for staggered animations
    document.querySelectorAll('.skill-card, .project-card, .stat-card, .achievements-card, .education-card, .timeline-item').forEach((el, index) => {
        el.style.animationDelay = `${index * 0.1}s`;
        observer.observe(el);
    });
}

// Skills Animation
function animateSkills() {
    const skillCards = document.querySelectorAll('.skill-card');
    
    skillCards.forEach((card, index) => {
        setTimeout(() => {
            const level = card.dataset.level;
            const progressBar = card.querySelector('.skill-progress');
            const skillLevel = card.querySelector('.skill-level');
            
            if (progressBar) {
                // Convert skill level to percentage for progress bar
                let percentage;
                switch(level) {
                    case 'basic':
                        percentage = 35;
                        break;
                    case 'intermediate':
                        percentage = 70;
                        break;
                    case 'advanced':
                        percentage = 95;
                        break;
                    default:
                        percentage = 50;
                }
                progressBar.style.width = `${percentage}%`;
            }
            
            // Animate the skill level badge
            if (skillLevel) {
                skillLevel.classList.add('animate');
            }
        }, index * 300);
    });
}

// Contact Form
function initContactForm() {
    const form = document.getElementById('contactForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(form);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message')
        };
        
        // Simulate form submission
        console.log('Form submitted:', data);
        
        // Show success toast
        showToast('Message sent successfully! I\'ll get back to you soon.');
        
        // Reset form
        form.reset();
    });
}

// Toast Notification
function showToast(message) {
    const toast = document.getElementById('toast');
    const messageElement = toast.querySelector('.toast-message');
    
    messageElement.textContent = message;
    toast.classList.add('show');
    
    // Hide toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Utility Functions
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Add smooth hover effects for cards
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

// Add parallax effect to hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroContent = document.querySelector('.hero-content');
    
    if (heroContent) {
        heroContent.style.transform = `translateY(${scrolled * 0.1}px)`;
    }
});

// Enhanced scroll effects
let ticking = false;

function updateScrollEffects() {
    const scrolled = window.pageYOffset;
    const navbar = document.getElementById('navbar');
    
    // Navbar transparency effect
    if (scrolled > 50) {
        navbar.style.background = 'rgba(17, 24, 39, 0.95)';
    } else {
        navbar.style.background = 'rgba(17, 24, 39, 0.9)';
    }
    
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(updateScrollEffects);
        ticking = true;
    }
});

// Add intersection observer for timeline animations
function initTimelineAnimations() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    timelineItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        timelineObserver.observe(item);
    });
}

// Initialize timeline animations after DOM is loaded
document.addEventListener('DOMContentLoaded', initTimelineAnimations);

// Professional Profile Image Transition Effect
function initProfileImageTransition() {
    const container = document.querySelector('.liquid-swipe-container');
    const formalImage = document.getElementById('profileImageCurrent');
    const informalImage = document.getElementById('profileImageInformal');
    
    if (!container || !formalImage || !informalImage) {
        console.log('Profile image elements not found');
        return;
    }
    
    let isTransitioning = false;
    let isFormal = true;
    

    
    container.addEventListener('click', function() {
        if (isTransitioning) return;
        
        isTransitioning = true;
        container.style.pointerEvents = 'none';
        container.style.animation = 'none';
        
        // Add transitioning class
        formalImage.classList.add('transitioning');
        informalImage.classList.add('transitioning');
        

        
        if (isFormal) {
            // Switch to informal with smooth crossfade
            formalImage.classList.add('fade-out');
            informalImage.classList.add('fade-in');
            
            setTimeout(() => {
                formalImage.classList.remove('current', 'fade-out');
                informalImage.classList.remove('next', 'fade-in');
                formalImage.classList.add('next');
                informalImage.classList.add('current');
                isFormal = false;
                
                // Remove transitioning class
                formalImage.classList.remove('transitioning');
                informalImage.classList.remove('transitioning');
                container.style.pointerEvents = 'auto';
                isTransitioning = false;
            }, 800);
        } else {
            // Switch to formal with smooth crossfade
            informalImage.classList.add('fade-out');
            formalImage.classList.add('fade-in');
            
            setTimeout(() => {
                informalImage.classList.remove('current', 'fade-out');
                formalImage.classList.remove('next', 'fade-in');
                informalImage.classList.add('next');
                formalImage.classList.add('current');
                isFormal = true;
                
                // Remove transitioning class
                formalImage.classList.remove('transitioning');
                informalImage.classList.remove('transitioning');
                container.style.pointerEvents = 'auto';
                isTransitioning = false;
            }, 800);
        }
    });
    
    console.log('Professional profile image transition initialized');
    
    // Auto-transition for demonstration (switches every 10 seconds)
    let autoTransitionInterval = setInterval(() => {
        if (!isTransitioning) {
            container.click();
        }
    }, 10000);
    
    // Stop auto-transition when user manually clicks
    container.addEventListener('click', function() {
        clearInterval(autoTransitionInterval);
    }, { once: true });
}

// Add smooth scrolling behavior for mobile
if ('scrollBehavior' in document.documentElement.style) {
    document.documentElement.style.scrollBehavior = 'smooth';
}

// Performance optimization: Throttle scroll events
function throttle(func, wait) {
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

// Debounce function for resize events
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

// Optimize animations for mobile
function shouldReduceMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches || 
           window.innerWidth <= 480;
}

// Apply throttling to scroll events
const throttledScrollHandler = throttle(() => {
    updateScrollEffects();
}, 16); // ~60fps

window.addEventListener('scroll', throttledScrollHandler);

// Lazy load images for better performance
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
document.addEventListener('DOMContentLoaded', lazyLoadImages);

// Sidebar Scroll Progress Indicator
window.addEventListener('scroll', function() {
    const scrollBar = document.querySelector('.scroll-bar-progress');
    const scrollLabel = document.getElementById('scrollBarLabel');
    const scrollBarContainer = document.querySelector('.scroll-bar');
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = window.scrollY;
    let percent = 0;
    if (docHeight > 0) {
        percent = Math.round((scrolled / docHeight) * 100);
        percent = Math.max(0, Math.min(percent, 100)); // Clamp between 0 and 100
    }
    if (scrollBar) {
        scrollBar.style.height = percent + '%';
    }
    if (scrollLabel && scrollBarContainer) {
        const barHeight = scrollBarContainer.offsetHeight;
        const labelHeight = scrollLabel.offsetHeight;
        let top = Math.round((barHeight - labelHeight) * percent / 100);
        top = Math.max(0, Math.min(top, barHeight - labelHeight));
        scrollLabel.style.top = `${top}px`;
        scrollLabel.textContent = percent + '%';
        console.log(`ScrollLabel: percent=${percent}, top=${top}, barHeight=${barHeight}, labelHeight=${labelHeight}`);
    }
});