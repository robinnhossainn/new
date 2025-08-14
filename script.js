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
    const originalTechFacts = [
        { text: "The first computer virus, called Creeper, was created in 1971 and displayed the message, \"I'm the creeper: catch me if you can!\"", source: "Norton" },
        { text: "The first webcam was invented at Cambridge University to monitor a coffee pot, not for security or calls!", source: "CNN, The Atlantic" },
        { text: "Cybercrime damages are projected to reach $10.5 trillion annually by 2025—making it more profitable than the global drug trade.", source: "Cybersecurity Ventures" },
        { text: "The world's first website is still online! It was created by Tim Berners-Lee in 1991 at CERN.", source: "CERN" },
        { text: "The Stuxnet worm, discovered in 2010, was so sophisticated it is believed to have been created by a nation-state to sabotage Iran's nuclear program.", source: "WIRED, The Guardian" },
        { text: "Quantum computing may soon break today's encryption algorithms. That's why scientists are racing to build quantum-resistant cryptography.", source: "NIST, MIT Technology Review" },
        { text: "IPv6 can provide 340 undecillion (that's 340 followed by 36 zeros) unique IP addresses—enough for every grain of sand on Earth!", source: "Cloudflare, Cisco" },
        { text: "In 2024, phishing attacks increased by 47%, especially those targeting remote workers and SaaS platforms.", source: "APWG (Anti-Phishing Working Group)" },
        { text: "The Internet of Things (IoT) is expected to connect over 30 billion devices by 2030—creating both convenience and new security risks.", source: "Statista, McKinsey" },
        { text: "Bluetooth was named after a 10th-century Viking king, Harald \"Bluetooth\" Gormsson, who united Denmark and Norway—just like the tech unifies devices.", source: "Bluetooth SIG, History.com" }
    ];
    
    // Shuffle function to randomize facts on each page load
    function shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
    
    // Create shuffled facts array
    const techFacts = shuffleArray(originalTechFacts);
    
    // Start with a random fact index to avoid showing the same fact on refresh
    let currentFactIndex = Math.floor(Math.random() * techFacts.length);
    let factInterval;
    let isFirstFact = true; // Flag to track if this is the first fact display
    
    // Function to trigger bar compression when dot reaches 5th bar
    let barCompressionTriggered = false;
    let lastTriggerTime = 0;
    
    function triggerBarCompression() {
        // Bar compression disabled - bars will not shrink when dot climbs
        return;
    }
    
    // Monitor dot position and trigger bar compression
    let currentBarIndex = -1; // Track which bar the dot is currently on
    let animationStartTime = Date.now();
    
    // Initialize bar colors to ensure consistency across environments
    function initializeBarColors() {
        const bars = document.querySelectorAll('.loader__bar');
        bars.forEach(bar => {
            bar.style.background = '#ffffff';
        });
        currentBarIndex = -1;
    }
    
    // Call initialization immediately
    initializeBarColors();
    
    function monitorDotPosition() {
        const ball = document.querySelector('.loader__ball');
        if (ball) {
            const bars = document.querySelectorAll('.loader__bar');
            const dotColor = '#b6f500'; // Dot color
            const whiteColor = '#ffffff'; // White color for bars
            
            // Calculate animation progress (2.5s cycle)
            const currentTime = Date.now();
            const elapsedTime = (currentTime - animationStartTime) % 2500; // 2.5s cycle
            const progress = (elapsedTime / 2500) * 100; // Progress as percentage
            
            // Determine which bar should be colored based on animation timing
            let newBarIndex = -1;
            
            // Map animation progress to bar positions with more precise timing
            if (progress >= 0 && progress < 16) {
                newBarIndex = 0; // Bar 1 (0% - 16%)
            } else if (progress >= 16 && progress < 34) {
                newBarIndex = 1; // Bar 2 (16% - 34%)
            } else if (progress >= 34 && progress < 52) {
                newBarIndex = 2; // Bar 3 (34% - 52%)
            } else if (progress >= 52 && progress < 70) {
                newBarIndex = 3; // Bar 4 (52% - 70%)
            } else if (progress >= 70 && progress < 100) {
                newBarIndex = 4; // Bar 5 (70% - 100%)
            }
            
            // Enhanced color synchronization for hosted environments
            if (newBarIndex !== -1 && newBarIndex !== currentBarIndex) {
                // Reset all bars to white first for consistency
                bars.forEach((bar, index) => {
                    if (index !== newBarIndex) {
                        bar.style.background = whiteColor;
                    }
                });
                
                // Color the active bar
                if (newBarIndex >= 0 && newBarIndex < bars.length) {
                    bars[newBarIndex].style.background = dotColor;
                }
                
                currentBarIndex = newBarIndex;
            }
            
            // Trigger bar compression at the end of the cycle
            if (progress >= 80 && progress < 85) {
                triggerBarCompression();
            }
        }
    }
    
    // Set up monitoring with higher frequency for better precision and consistency
    setInterval(monitorDotPosition, 30); // Increased frequency for better sync
    
    // Function to update fact
    function updateFact() {
        const factText = document.getElementById('factText');
        const factSource = document.getElementById('factSource');
        
        if (factText && factSource) {
            if (isFirstFact) {
                // Typewriter-style reveal for the first fact
                const fact = techFacts[currentFactIndex];
                factText.textContent = `"${fact.text}"`;
                factSource.textContent = `- ${fact.source}`;
                
                factText.style.transition = 'all 0.05s ease-out';
                
                // Start with typewriter effect
                factText.style.opacity = '0';
                factText.style.transform = 'translateX(-100%)';
                factSource.classList.remove('show');
                
                // ChatGPT-style typewriter effect for fact text
                const factTextFull = `"${fact.text}"`;
                factText.textContent = '';
                factSource.textContent = '';
                
                let charIndex = 0;
                const typewriterInterval = setInterval(() => {
                    if (charIndex < factTextFull.length) {
                        factText.textContent += factTextFull[charIndex];
                        factText.style.opacity = '1';
                        factText.style.transform = 'translateX(0%)';
                        charIndex++;
                    } else {
                        clearInterval(typewriterInterval);
                        // Show source after fact is complete
                        setTimeout(() => {
                            factSource.textContent = `- ${fact.source}`;
                            factSource.classList.add('show');
                        }, 200);
                    }
                }, 30);
                
                isFirstFact = false; // Mark that first fact has been shown
            } else {
                // Flip animation for subsequent facts
                factText.style.transition = 'all 0.3s ease-in';
                factSource.classList.remove('show');
                
                factText.style.opacity = '0';
                factText.style.transform = 'rotateX(-90deg)';
                
                setTimeout(() => {
                    const fact = techFacts[currentFactIndex];
                    factText.textContent = `"${fact.text}"`;
                    factSource.textContent = `- ${fact.source}`;
                    
                    // Flip in effect
                    factText.style.transition = 'all 0.3s ease-out';
                    factText.style.opacity = '1';
                    factText.style.transform = 'rotateX(0deg)';
                    
                    // Show source with CSS transition
                    setTimeout(() => {
                        factSource.classList.add('show');
                    });
                }, 300);
            }
            
            currentFactIndex = (currentFactIndex + 1) % techFacts.length;
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
                
                // Animate loading message text line by line
                const messagePart1 = loadingMessage.querySelector('.message-part-1');
                if (messagePart1) {
                    const textLines = messagePart1.querySelectorAll('.text-line');
                    textLines.forEach((line, index) => {
                        const delay = parseFloat(line.getAttribute('data-delay')) * 1000;
                        setTimeout(() => {
                            line.classList.add('show');
                        }, delay);
                    });
                }
                
                // Animate second message after 2 seconds delay
                setTimeout(() => {
                    const messagePart2 = loadingMessage.querySelector('.message-part-2');
                    if (messagePart2) {
                        const blurTextLines = messagePart2.querySelectorAll('.blur-text-line');
                        blurTextLines.forEach((line, index) => {
                            const delay = parseFloat(line.getAttribute('data-delay')) * 1000;
                            setTimeout(() => {
                                line.classList.add('show');
                            }, delay);
                        });
                    }
                }, 2000);
                
                console.log('Loading message shown after', elapsedTime, 'ms of loading');
            }
        }
        
        // Show "Did You Know?" section 5 seconds after second text line (10 seconds total)
        if (elapsedTime >= 10000 && !didYouKnowSection.classList.contains('show')) {
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
        
                        // Show facts section 1 second after "Did You Know?" (11 seconds total)
        if (elapsedTime >= 11000 && !factsSection.classList.contains('show')) {
            if (factsSection) {
                factsSection.classList.add('show');
                
                // Ensure we start with the random fact immediately
                setTimeout(() => {
                    updateFact(); // Show random fact
                    
                    // Start fact rotation with specific timing: first fact for 4s, others for 5s
                    // First fact stays visible for 4 seconds after typewriter effect, then rotates every 5 seconds
                    setTimeout(() => {
                        factInterval = setInterval(updateFact, 5000);
                    }, 4000); // Wait 4 seconds before starting rotation
                }, 100); // Small delay to ensure random index is set
                
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
            console.log('Starting comprehensive resource loading check...');
            
            // Enhanced image loading check for hosted environments
            const images = document.querySelectorAll('img');
            console.log(`Found ${images.length} images to load`);
            const imagePromises = Array.from(images).map(img => {
                return new Promise(resolve => {
                    const imgSrc = img.src || img.alt || 'unnamed';
                    
                    // Check if image is already loaded
                    if (img.complete && img.naturalHeight !== 0 && img.naturalWidth !== 0) {
                        console.log(`Image already loaded: ${imgSrc}`);
                        resolve();
                    } else {
                        console.log(`Waiting for image to load: ${imgSrc}`);
                        
                        // Multiple event listeners for better reliability
                        const imageLoaded = () => {
                            console.log(`Image loaded: ${imgSrc}`);
                            resolve();
                        };
                        
                        img.addEventListener('load', imageLoaded);
                        img.addEventListener('error', () => {
                            console.log(`Image failed to load: ${imgSrc}`);
                            resolve(); // Continue even if image fails
                        });
                        
                        // Force image loading if it hasn't started
                        if (!img.complete) {
                            img.src = img.src; // Trigger loading
                        }
                    }
                });
            });
            
            // Enhanced video loading check for hosted environments
            const videos = document.querySelectorAll('video');
            console.log(`Found ${videos.length} videos to load`);
            const videoPromises = Array.from(videos).map(video => {
                return new Promise(resolve => {
                    const videoSrc = video.querySelector('source')?.src || video.src || 'unnamed';
                    console.log(`Checking video: ${videoSrc}, readyState: ${video.readyState}`);
                    
                    // Enhanced video readiness check for hosted environments
                    const checkVideoReady = () => {
                        console.log(`Video ready: ${videoSrc}, readyState: ${video.readyState}`);
                        resolve();
                    };
                    
                    // Check if video is already loaded enough to play
                    if (video.readyState >= 4) { // HAVE_ENOUGH_DATA - fully loaded
                        console.log(`Video already fully ready: ${videoSrc}`);
                        resolve();
                    } else if (video.readyState >= 3) { // HAVE_FUTURE_DATA - enough data to play
                        console.log(`Video has enough data: ${videoSrc}`);
                        // Wait a bit more for better stability
                        setTimeout(() => {
                            console.log(`Video ready after delay: ${videoSrc}`);
                            resolve();
                        }, 500);
                    } else {
                        console.log(`Waiting for video to be ready: ${videoSrc}`);
                        
                        // Multiple event listeners for better reliability
                        video.addEventListener('canplay', checkVideoReady);
                        video.addEventListener('canplaythrough', checkVideoReady);
                        video.addEventListener('loadeddata', checkVideoReady);
                        video.addEventListener('loadedmetadata', checkVideoReady);
                        video.addEventListener('progress', () => {
                            if (video.readyState >= 3) {
                                console.log(`Video ready via progress: ${videoSrc}`);
                                resolve();
                            }
                        });
                        video.addEventListener('error', () => {
                            console.log(`Video failed to load: ${videoSrc}`);
                            resolve(); // Continue even if video fails
                        });
                        
                        // Force video to start loading if it hasn't already
                        if (video.readyState === 0) {
                            video.load();
                        }
                        
                        // Additional timeout for video loading
                        setTimeout(() => {
                            if (video.readyState >= 2) {
                                console.log(`Video ready via timeout: ${videoSrc}`);
                                resolve();
                            }
                        }, 5000);
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
            
            console.log(`Checking ${externalResources.length} external resources`);
            const resourcePromises = externalResources.map(url => {
                return new Promise(resolve => {
                    console.log(`Checking external resource: ${url}`);
                    const link = document.createElement('link');
                    link.rel = 'preload';
                    link.href = url;
                    link.onload = () => {
                        console.log(`External resource loaded: ${url}`);
                        resolve();
                    };
                    link.onerror = () => {
                        console.log(`External resource failed: ${url}`);
                        resolve(); // Continue even if resource fails
                    };
                    document.head.appendChild(link);
                });
            });
            
            // Check if all fonts are loaded
            const fontPromises = [];
            if (document.fonts && document.fonts.ready) {
                console.log('Checking font loading...');
                fontPromises.push(
                    document.fonts.ready.then(() => {
                        console.log('All fonts loaded');
                    })
                );
            } else {
                console.log('Font loading API not available, skipping font check');
            }
            
            // Additional checks for hosted environments
            const additionalChecks = [];
            
            // Check if all CSS is loaded
            const styleSheets = Array.from(document.styleSheets);
            console.log(`Found ${styleSheets.length} stylesheets`);
            styleSheets.forEach((sheet, index) => {
                additionalChecks.push(
                    new Promise(resolve => {
                        try {
                            // Try to access CSS rules to ensure stylesheet is loaded
                            const rules = sheet.cssRules || sheet.rules;
                            console.log(`Stylesheet ${index} loaded with ${rules?.length || 0} rules`);
                            resolve();
                        } catch (e) {
                            console.log(`Stylesheet ${index} failed to load, continuing...`);
                            resolve(); // Continue even if stylesheet fails
                        }
                    })
                );
            });
            
            // Check if critical JavaScript is loaded
            additionalChecks.push(
                new Promise(resolve => {
                    // Check if particles.js is loaded
                    if (typeof window.particlesJS !== 'undefined') {
                        console.log('Particles.js loaded');
                        resolve();
                    } else {
                        console.log('Waiting for particles.js...');
                        setTimeout(() => {
                            console.log('Particles.js check complete');
                            resolve();
                        }, 1000);
                    }
                })
            );
            
            // Wait for all resources to load
            Promise.all([...imagePromises, ...videoPromises, ...resourcePromises, ...fontPromises, ...additionalChecks])
                .then(() => {
                    console.log('All resources loaded, waiting additional time for stability...');
                    // Extended delay for hosted environments
                    setTimeout(() => {
                        console.log('Resource loading check complete');
                        resolve();
                    }, 2000);
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
    
    // Wait for both window load and resource loading
    Promise.all([
        new Promise(resolve => {
            if (document.readyState === 'complete') {
                console.log('Document already fully loaded');
                resolve();
            } else {
                console.log('Waiting for window load event...');
                window.addEventListener('load', () => {
                    console.log('Window load event fired');
                    resolve();
                });
            }
        }),
        checkAllResourcesLoaded()
    ]).then(() => {
        console.log('All resources and window load complete, completing preloader');
        completeLoading();
    });
    
    // Fallback: Complete loading after maximum 30 seconds for hosted environments
    setTimeout(() => {
        console.log('Fallback: Completing preloader after timeout');
        completeLoading();
    }, 30000);
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
    
    // Initialize footer circles
    initFooterCircles();
    
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
  initFooterCircles();
});

// Footer Circles Animation Function
function initFooterCircles() {
    const footer = document.querySelector('.footer');
    if (!footer) {
        console.log('Footer not found!');
        return;
    }
    
    const circles = footer.querySelectorAll('.footer-circle');
    console.log('Found circles:', circles.length, circles);
    
    if (circles.length === 0) {
        console.log('No circles found in footer!');
        return;
    }
    
    let isSpread = false;
    
    // Add click functionality to spread circles
    circles.forEach(circle => {
        // Add both click and mousedown events for better responsiveness
        circle.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent footer click event from firing
            console.log('Circle clicked!', this, 'Current state:', isSpread);
            handleCircleClick();
        });
        
        // Also add mousedown for immediate feedback
        circle.addEventListener('mousedown', function(e) {
            e.stopPropagation();
            this.style.transform = 'scale(0.95)';
        });
        
        // Add mouseup to reset transform
        circle.addEventListener('mouseup', function(e) {
            e.stopPropagation();
            this.style.transform = '';
        });
        
        // Add individual click-to-move functionality when spread
        circle.addEventListener('click', function(e) {
            if (isSpread && this.classList.contains('spread')) {
                e.stopPropagation();
                // Toggle movement for this circle - start if not moving, stop if already moving
                if (this.classList.contains('moving')) {
                    stopCircleMovement(this);
                    console.log('Stopped movement for circle');
                } else {
                    startIndividualMovement(this);
                }
            }
        });
    });
    
    // Function to handle circle click logic
    function handleCircleClick() {
        if (!isSpread) {
            // Spread out the circles to random positions
            circles.forEach((circle, index) => {
                circle.classList.add('spread');
                
                // Generate random position across the entire footer area with padding
                const footerRect = footer.getBoundingClientRect();
                const circleRect = circle.getBoundingClientRect();
                
                // Add padding from edges (10% of circle size)
                const padding = circleRect.width * 0.1;
                const maxLeft = footerRect.width - circleRect.width - padding;
                const maxTop = footerRect.height - circleRect.height - padding;
                
                // Ensure minimum position values across entire footer
                const minLeft = padding;
                const minTop = padding;
                
                // Create varied distribution across entire footer area
                const randomLeft = minLeft + (Math.random() * (maxLeft - minLeft));
                const randomTop = minTop + (Math.random() * (maxTop - minTop));
                
                // Apply random position
                circle.style.left = randomLeft + 'px';
                circle.style.top = randomTop + 'px';
                
                console.log('Added spread class to:', circle, 'at position:', randomLeft, randomTop);
            });
            isSpread = true;
            
            // Start automatic return to center after 15 seconds
            setTimeout(() => {
                if (isSpread) {
                    returnCirclesToCenter();
                }
            }, 15000);
        } else {
            // Bring circles back to center
            circles.forEach(circle => {
                circle.classList.remove('spread');
                
                // Reset to center position using the same calc method as CSS
                const circleWidth = circle.offsetWidth;
                const circleHeight = circle.offsetHeight;
                circle.style.left = `calc(50% - ${circleWidth / 2}px)`;
                circle.style.top = `calc(50% - ${circleHeight / 2}px)`;
                
                console.log('Removed spread class from:', circle);
            });
            isSpread = false;
            
            // Stop all movement when returning to center
            stopAllMovement();
        }
    }
    
    // Function to automatically return circles to center with slow animation
    function returnCirclesToCenter() {
        if (!isSpread) return; // Don't return if already centered
        
        circles.forEach(circle => {
            circle.classList.remove('spread');
            
            // Apply very slow transition back to center
            circle.style.transition = 'left 15s cubic-bezier(0.25, 0.46, 0.45, 0.94), top 15s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            
            // Reset to center position using the same calc method as CSS
            const circleWidth = circle.offsetWidth;
            const circleHeight = circle.offsetHeight;
            circle.style.left = `calc(50% - ${circleWidth / 2}px)`;
            circle.style.top = `calc(50% - ${circleHeight / 2}px)`;
            
            console.log('Returning circle to center with slow animation');
        });
        
        isSpread = false;
        
        // Stop all movement when returning to center
        stopAllMovement();
        
        // Remove transition after animation completes
        setTimeout(() => {
            circles.forEach(circle => {
                circle.style.transition = '';
            });
        }, 15000);
    }
    
    // Variables for individual movement tracking
    
    // Function to start individual movement for a specific circle
    function startIndividualMovement(circle) {
        // Only start movement if circle is spread and not already moving
        if (circle.classList.contains('spread') && !circle.classList.contains('moving')) {
            circle.classList.add('moving');
            // Start smooth sliding from current position to opposite side
            const index = Array.from(circles).indexOf(circle);
            startSmoothSliding(circle, index);
            console.log('Started individual movement for circle:', index);
        }
    }
    
    // Function to stop movement for a specific circle
    function stopCircleMovement(circle) {
        circle.classList.remove('moving');
    }
    
    // Function to stop all movement
    function stopAllMovement() {
        circles.forEach(circle => {
            circle.classList.remove('moving');
        });
    }
    
    // Function to start smooth movement toward the front (viewer's direction)
    function startSmoothSliding(circle, index) {
        const footerRect = footer.getBoundingClientRect();
        const circleRect = circle.getBoundingClientRect();
        
        // Get current position - use getBoundingClientRect for more accurate positioning
        const circleBounds = circle.getBoundingClientRect();
        const footerBounds = footer.getBoundingClientRect();
        
        // Calculate relative position within footer
        const currentLeft = circleBounds.left - footerBounds.left;
        const currentTop = circleBounds.top - footerBounds.top;
        
        // Calculate target position toward the front (center of footer)
        const targetLeft = (footerRect.width - circleRect.width) / 2;
        const targetTop = (footerRect.height - circleRect.height) / 2;
        
        // Apply smooth movement toward the front with CSS transition (very slow movement)
        // Use specific properties to avoid conflicts with parallax transforms
        circle.style.transition = 'left 5s cubic-bezier(0.25, 0.46, 0.45, 0.94), top 5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        circle.style.left = targetLeft + 'px';
        circle.style.top = targetTop + 'px';
        
        console.log(`Circle ${index} moving toward front from (${currentLeft}, ${currentTop}) to (${targetLeft}, ${targetTop})`);
        
        // After reaching the front, the circle stays there permanently
        setTimeout(() => {
            if (circle.classList.contains('moving')) {
                console.log(`Circle ${index} has reached the front and will stay there`);
                // Circle remains at the front position - no further movement
            }
        }, 5000); // Wait for 5s movement to complete
    }
    

    
    // Add parallax effect on scroll
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const footerRect = footer.getBoundingClientRect();
        
        // Only apply effect when footer is in view
        if (footerRect.top < window.innerHeight && footerRect.bottom > 0) {
            circles.forEach((circle, index) => {
                const speed = parseFloat(circle.getAttribute('data-speed')) || 0.5;
                const yPos = -(scrolled * speed * 0.1);
                const xPos = -(scrolled * speed * 0.05);
                
                // Apply parallax with current animation transform
                const currentTransform = circle.style.transform || '';
                const baseTransform = currentTransform.replace(/translate\([^)]+\)/, '');
                circle.style.transform = `${baseTransform} translate(${xPos}px, ${yPos}px)`;
            });
        }
    });
    
    // Add mouse interaction for circles
    footer.addEventListener('mousemove', function(e) {
        const rect = footer.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        circles.forEach((circle, index) => {
            const speed = parseFloat(circle.getAttribute('data-speed')) || 0.5;
            const moveX = (x - rect.width / 2) * speed * 0.02;
            const moveY = (y - rect.height / 2) * speed * 0.02;
            
            // Combine with existing animation transform
            const currentTransform = circle.style.transform || '';
            const baseTransform = currentTransform.replace(/translate\([^)]+\)/, '');
            circle.style.transform = `${baseTransform} translate(${moveX}px, ${moveY}px)`;
        });
    });
    
    // Add random subtle movement
    setInterval(() => {
        circles.forEach((circle, index) => {
            const randomX = (Math.random() - 0.5) * 8;
            const randomY = (Math.random() - 0.5) * 8;
            
            // Add subtle random movement to existing animation
            const currentTransform = circle.style.transform || '';
            const baseTransform = currentTransform.replace(/translate\([^)]+\)/, '');
            circle.style.transform = `${baseTransform} translate(${randomX}px, ${randomY}px)`;
        });
    }, 6000);
}



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







