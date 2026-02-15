/* ==========================================
   HAARD RAO PORTFOLIO - MAIN JAVASCRIPT
   Phase 2: Interactivity, 3D Graphics, Custom Cursor & Animations
   ========================================== */

// ==========================================
// CONFIGURATION
// ==========================================
const CONFIG = {
    colors: {
        primary: 0x00d9ff,      // Cyan
        secondary: 0x0066ff,    // Blue
        tertiary: 0x00ffaa      // Mint
    },
    animation: {
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out"
    },
    scroll: {
        offset: 100,
        smooth: true
    }
};

// ==========================================
// GLOBAL VARIABLES
// ==========================================
let scene, camera, renderer, geometry, material, mesh;
let mouseX = 0, mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

// Custom cursor elements
let cursor, cursorFollower;
let cursorX = 0, cursorY = 0;
let followerX = 0, followerY = 0;

// ==========================================
// CUSTOM CURSOR FUNCTIONALITY
// ==========================================
function initCustomCursor() {
    // Only enable on desktop (not mobile/tablet)
    if (window.innerWidth <= 1024) return;

    cursor = document.querySelector('.cursor');
    cursorFollower = document.querySelector('.cursor-follower');

    if (!cursor || !cursorFollower) return;

    // Update cursor position on mouse move
    document.addEventListener('mousemove', (e) => {
        cursorX = e.clientX;
        cursorY = e.clientY;
    });

    // Smooth cursor animation
    function animateCursor() {
        // Main cursor follows mouse immediately
        if (cursor) {
            cursor.style.left = cursorX + 'px';
            cursor.style.top = cursorY + 'px';
        }

        // Follower has delay for smooth effect
        followerX += (cursorX - followerX) * 0.1;
        followerY += (cursorY - followerY) * 0.1;

        if (cursorFollower) {
            cursorFollower.style.left = followerX + 'px';
            cursorFollower.style.top = followerY + 'px';
        }

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Add hover effects to interactive elements
    const hoverElements = document.querySelectorAll('a, button, .btn, .glass-card, .tag, input, textarea, .nav-link');
    
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            document.body.classList.add('cursor-hover');
        });
        
        el.addEventListener('mouseleave', () => {
            document.body.classList.remove('cursor-hover');
        });
    });

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
        cursorFollower.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
        cursorFollower.style.opacity = '0.5';
    });
}

// ==========================================
// THREE.JS - 3D ROTATING GEOMETRIC SHAPE
// ==========================================
function init3DScene() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    // Scene setup
    scene = new THREE.Scene();
    
    // Camera setup
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.z = 5;

    // Renderer setup
    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Create geometry - Icosahedron (20-sided geometric shape)
    geometry = new THREE.IcosahedronGeometry(2, 1);
    
    // Create material with wireframe
    material = new THREE.MeshBasicMaterial({
        color: CONFIG.colors.primary,
        wireframe: true,
        transparent: true,
        opacity: 0.6
    });

    // Create mesh
    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Add second inner geometry for depth
    const innerGeometry = new THREE.IcosahedronGeometry(1.5, 0);
    const innerMaterial = new THREE.MeshBasicMaterial({
        color: CONFIG.colors.tertiary,
        wireframe: true,
        transparent: true,
        opacity: 0.3
    });
    const innerMesh = new THREE.Mesh(innerGeometry, innerMaterial);
    scene.add(innerMesh);

    // Store inner mesh for animation
    mesh.innerMesh = innerMesh;

    // Mouse move listener for interactive rotation
    document.addEventListener('mousemove', onMouseMove, false);
    
    // Window resize listener
    window.addEventListener('resize', onWindowResize, false);

    // Start animation loop
    animate3D();
}

// Mouse move handler for 3D scene
function onMouseMove(event) {
    mouseX = (event.clientX - windowHalfX) / 100;
    mouseY = (event.clientY - windowHalfY) / 100;
}

// Window resize handler
function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Animation loop for 3D scene
function animate3D() {
    requestAnimationFrame(animate3D);

    // Rotate meshes
    mesh.rotation.x += 0.005;
    mesh.rotation.y += 0.005;
    
    if (mesh.innerMesh) {
        mesh.innerMesh.rotation.x -= 0.003;
        mesh.innerMesh.rotation.y -= 0.003;
    }

    // Interactive rotation based on mouse position
    mesh.rotation.x += (mouseY - mesh.rotation.x) * 0.05;
    mesh.rotation.y += (mouseX - mesh.rotation.y) * 0.05;

    renderer.render(scene, camera);
}

// ==========================================
// GSAP SCROLL ANIMATIONS
// ==========================================
function initScrollAnimations() {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // Hero content fade in
    gsap.from('.hero-content', {
        opacity: 0,
        y: 50,
        duration: 1,
        delay: 0.5,
        ease: CONFIG.animation.ease
    });

    // Section titles animation
    gsap.utils.toArray('.section-title').forEach(title => {
        gsap.from(title, {
            scrollTrigger: {
                trigger: title,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            y: 50,
            duration: CONFIG.animation.duration,
            ease: CONFIG.animation.ease
        });
    });

    // Glass cards animation
    gsap.utils.toArray('.glass-card').forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            y: 50,
            duration: CONFIG.animation.duration,
            delay: (index % 3) * 0.1, // Stagger effect
            ease: CONFIG.animation.ease
        });
    });

    // About stats animation
    gsap.utils.toArray('.stat-item').forEach((stat, index) => {
        gsap.from(stat, {
            scrollTrigger: {
                trigger: stat,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            scale: 0.8,
            duration: CONFIG.animation.duration,
            delay: index * 0.1,
            ease: CONFIG.animation.ease
        });
    });

    // Timeline items animation
    gsap.utils.toArray('.timeline-item').forEach((item, index) => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            x: -50,
            duration: CONFIG.animation.duration,
            delay: index * 0.15,
            ease: CONFIG.animation.ease
        });
    });

    // Skill tags animation
    gsap.utils.toArray('.skill-category').forEach(category => {
        const tags = category.querySelectorAll('.tag');
        gsap.from(tags, {
            scrollTrigger: {
                trigger: category,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            scale: 0,
            duration: 0.4,
            stagger: 0.05,
            ease: "back.out(1.7)"
        });
    });

    // Project cards animation
    gsap.utils.toArray('.project-card').forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            y: 50,
            duration: CONFIG.animation.duration,
            delay: (index % 3) * 0.1,
            ease: CONFIG.animation.ease
        });
    });
}

// ==========================================
// SMOOTH SCROLL TO SECTIONS
// ==========================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const offset = 80; // Account for fixed nav
                const targetPosition = target.offsetTop - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                closeMobileMenu();
            }
        });
    });
}

// ==========================================
// MOBILE MENU TOGGLE
// ==========================================
function initMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (!navToggle || !navMenu) return;

    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
        
        // Animate hamburger icon
        const spans = navToggle.querySelectorAll('span');
        if (navToggle.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            closeMobileMenu();
        }
    });
}

function closeMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    const navToggle = document.querySelector('.nav-toggle');
    
    if (navMenu && navToggle) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        
        const spans = navToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
}

// ==========================================
// CONTACT FORM HANDLING
// ==========================================
function initContactForm() {
    const form = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (!form) return;

    // Check if returning from successful submission
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
        showFormStatus('Message sent successfully! I\'ll get back to you soon.', 'success');
        // Remove success parameter from URL
        window.history.replaceState({}, document.title, window.location.pathname + '#contact');
    }

    form.addEventListener('submit', (e) => {
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;
        
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        // FormSubmit will handle the actual submission
        // Form will redirect after successful submission
    });
}

// Show form status message
function showFormStatus(message, type) {
    const formStatus = document.getElementById('form-status');
    if (!formStatus) return;

    formStatus.textContent = message;
    formStatus.className = `form-status ${type}`;
    formStatus.style.display = 'block';

    // Hide after 5 seconds
    setTimeout(() => {
        formStatus.style.display = 'none';
    }, 5000);
}

// ==========================================
// ACTIVE NAV LINK ON SCROLL
// ==========================================
function initActiveNavLinks() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', throttle(() => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }, 100));
}

// ==========================================
// SCROLL TO TOP BUTTON
// ==========================================
function initScrollToTop() {
    // Create scroll to top button
    const scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = '↑';
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.setAttribute('aria-label', 'Scroll to top');
    document.body.appendChild(scrollBtn);

    // Show/hide button based on scroll position
    window.addEventListener('scroll', throttle(() => {
        if (window.pageYOffset > 500) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    }, 100));

    // Scroll to top on click
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ==========================================
// TYPING ANIMATION FOR HERO SUBTITLE (Optional)
// ==========================================
function initTypingAnimation() {
    const subtitle = document.querySelector('.hero-subtitle');
    if (!subtitle) return;

    const text = subtitle.textContent;
    subtitle.textContent = '';
    subtitle.style.opacity = '1';

    let index = 0;
    const speed = 100; // typing speed in ms

    function type() {
        if (index < text.length) {
            subtitle.textContent += text.charAt(index);
            index++;
            setTimeout(type, speed);
        }
    }

    // Start typing after hero content fades in
    setTimeout(type, 1500);
}

// ==========================================
// NUMBER COUNTER ANIMATION FOR STATS
// ==========================================
function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number');

    counters.forEach(counter => {
        const target = counter.textContent;
        const isPercentage = target.includes('%');
        const isPlus = target.includes('+');
        const numericValue = parseInt(target.replace(/[^0-9]/g, ''));

        // Reset counter
        counter.textContent = '0';

        // Create scroll trigger for counter
        ScrollTrigger.create({
            trigger: counter,
            start: 'top 85%',
            onEnter: () => animateCounter(counter, numericValue, isPercentage, isPlus)
        });
    });
}

function animateCounter(element, target, isPercentage, isPlus) {
    let current = 0;
    const increment = target / 50; // 50 steps
    const duration = 1500; // 1.5 seconds
    const stepTime = duration / 50;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        let displayValue = Math.floor(current);
        if (isPercentage) displayValue += '%';
        if (isPlus) displayValue += '+';
        
        element.textContent = displayValue;
    }, stepTime);
}

// ==========================================
// LAZY LOAD ANIMATIONS
// ==========================================
function initLazyAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all animatable elements
    document.querySelectorAll('.glass-card, .timeline-item, .stat-item').forEach(el => {
        observer.observe(el);
    });
}

// ==========================================
// PARTICLE BACKGROUND EFFECT (Optional - Subtle)
// ==========================================
function initParticleEffect() {
    // This creates a subtle particle effect in the background
    // Can be enabled/disabled based on preference
    
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    
    // Particle system would go here
    // Keeping it simple to avoid performance issues
}

// ==========================================
// INITIALIZE EVERYTHING
// ==========================================
function init() {
    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAll);
    } else {
        initAll();
    }
}

function initAll() {
    console.log('🚀 Initializing Haard Rao Portfolio...');

    // Initialize custom cursor
    initCustomCursor();

    // Initialize 3D scene
    init3DScene();

    // Initialize scroll animations (GSAP)
    initScrollAnimations();

    // Initialize smooth scrolling
    initSmoothScroll();

    // Initialize mobile menu
    initMobileMenu();

    // Initialize contact form
    initContactForm();

    // Initialize active nav links
    initActiveNavLinks();

    // Initialize scroll to top button
    initScrollToTop();

    // Initialize typing animation (optional - uncomment to enable)
    // initTypingAnimation();

    // Initialize counter animations
    initCounterAnimation();

    // Initialize lazy animations
    initLazyAnimations();

    console.log('✅ Portfolio initialized successfully!');
    console.log('💎 Custom cursor active (desktop only)');
    console.log('🎨 3D graphics rendering');
    console.log('✨ Scroll animations loaded');
}

// Start initialization
init();

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

// Debounce function for performance
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

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ==========================================
// PERFORMANCE OPTIMIZATION
// ==========================================

// Reduce animations on low-power devices
if (navigator.deviceMemory && navigator.deviceMemory < 4) {
    console.log('⚡ Low-power mode detected - reducing animations');
    // Disable some heavy animations
    CONFIG.animation.duration = 0.4;
}

// Pause animations when tab is not visible
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause heavy animations
        console.log('⏸️ Tab hidden - pausing animations');
    } else {
        // Resume animations
        console.log('▶️ Tab visible - resuming animations');
    }
});

// ==========================================
// EASTER EGGS (Optional - Fun Touch)
// ==========================================

// Konami Code Easter Egg (Up, Up, Down, Down, Left, Right, Left, Right, B, A)
let konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            activateEasterEgg();
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

function activateEasterEgg() {
    console.log('🎉 Easter Egg Activated!');
    // Add rainbow effect to cursor or other fun animation
    document.body.style.filter = 'hue-rotate(0deg)';
    let hue = 0;
    const interval = setInterval(() => {
        hue += 5;
        document.body.style.filter = `hue-rotate(${hue}deg)`;
        if (hue >= 360) {
            clearInterval(interval);
            document.body.style.filter = 'none';
        }
    }, 50);
}

// Console message for recruiters
console.log('%c👋 Hey there, curious developer!', 'color: #00d9ff; font-size: 20px; font-weight: bold;');
console.log('%cI see you\'re checking out the code. I like that! 🔍', 'color: #00ffaa; font-size: 14px;');
console.log('%cFeel free to reach out: haardrao23@gmail.com', 'color: #0066ff; font-size: 14px;');
console.log('%cBuilt with ❤️ using Three.js, GSAP, and vanilla JavaScript', 'color: #a0a0a0; font-size: 12px;');
