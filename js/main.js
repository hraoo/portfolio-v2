/* ==========================================
   HAARD RAO PORTFOLIO - COMPLETE JAVASCRIPT
   Phase 2: 3D Graphics, Animations & Custom Cursor
   ========================================== */

// ==========================================
// CONFIGURATION
// ==========================================
const CONFIG = {
    colors: {
        primary: 0x00d9ff,
        secondary: 0x0066ff,
        tertiary: 0x00ffaa
    },
    animation: {
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out"
    }
};

// ==========================================
// GLOBAL VARIABLES
// ==========================================
let scene, camera, renderer, geometry, material, mesh;
let mouseX = 0, mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

// ==========================================
// CUSTOM CURSOR
// ==========================================
function initCustomCursor() {
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');
    
    if (!cursor || !cursorFollower) return;

    let cursorX = 0, cursorY = 0;
    let followerX = 0, followerY = 0;

    // Update cursor position on mouse move
    document.addEventListener('mousemove', (e) => {
        cursorX = e.clientX;
        cursorY = e.clientY;
    });

    // Animate cursor and follower with smooth following effect
    function animate() {
        // Main cursor follows mouse directly
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';

        // Follower has smooth delay (easing effect)
        followerX += (cursorX - followerX) * 0.1;
        followerY += (cursorY - followerY) * 0.1;
        
        cursorFollower.style.left = followerX + 'px';
        cursorFollower.style.top = followerY + 'px';

        requestAnimationFrame(animate);
    }
    animate();

    // Hover effects for interactive elements
    const interactiveElements = document.querySelectorAll(
        'a, button, .btn, .glass-card, .tag, .nav-link, input, textarea'
    );
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            document.body.classList.add('cursor-hover');
        });
        
        el.addEventListener('mouseleave', () => {
            document.body.classList.remove('cursor-hover');
        });
    });

    // Click effect
    document.addEventListener('mousedown', () => {
        document.body.classList.add('cursor-click');
    });

    document.addEventListener('mouseup', () => {
        document.body.classList.remove('cursor-click');
    });

    // Hide cursor when mouse leaves window
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
        cursorFollower.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
        cursorFollower.style.opacity = '1';
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

    // Create main geometry - Icosahedron (20-sided shape)
    geometry = new THREE.IcosahedronGeometry(2, 1);
    material = new THREE.MeshBasicMaterial({
        color: CONFIG.colors.primary,
        wireframe: true,
        transparent: true,
        opacity: 0.6
    });
    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Create inner geometry for depth effect
    const innerGeometry = new THREE.IcosahedronGeometry(1.5, 0);
    const innerMaterial = new THREE.MeshBasicMaterial({
        color: CONFIG.colors.tertiary,
        wireframe: true,
        transparent: true,
        opacity: 0.3
    });
    const innerMesh = new THREE.Mesh(innerGeometry, innerMaterial);
    scene.add(innerMesh);
    mesh.innerMesh = innerMesh;

    // Event listeners
    document.addEventListener('mousemove', onMouseMove, false);
    window.addEventListener('resize', onWindowResize, false);

    // Start animation loop
    animate3D();
}

function onMouseMove(event) {
    mouseX = (event.clientX - windowHalfX) / 100;
    mouseY = (event.clientY - windowHalfY) / 100;
}

function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

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

    // Glass cards animation with stagger
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
            delay: (index % 3) * 0.1,
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

    // Skill tags animation with bounce effect
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
            y: 30,
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

    // Check for success parameter in URL (after FormSubmit redirect)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
        showFormStatus('Message sent successfully! I\'ll get back to you within 24 hours.', 'success');
        form.reset();
        // Clean URL (remove query parameter)
        window.history.replaceState({}, document.title, window.location.pathname + '#contact');
    }

    form.addEventListener('submit', (e) => {
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;
        
        // Show loading state
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // FormSubmit handles the actual submission
        // Form will redirect to _next URL after successful submission
        // No need to prevent default - let the form submit normally
    });
}

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

    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
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
    });
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
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    });

    // Scroll to top on click
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ==========================================
// COUNTER ANIMATION FOR STATS
// ==========================================
function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number');

    counters.forEach(counter => {
        const target = counter.textContent;
        const isPercentage = target.includes('%');
        const isPlus = target.includes('+');
        const numericValue = parseInt(target.replace(/[^0-9]/g, ''));

        // Reset counter to 0
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
// TYPING ANIMATION (Optional)
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
// PARALLAX EFFECT ON HERO
// ==========================================
function initParallaxEffect() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallax = hero.querySelector('.hero-background');
        if (parallax) {
            parallax.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });
}

// ==========================================
// NAVBAR BACKGROUND ON SCROLL
// ==========================================
function initNavbarScroll() {
    const nav = document.querySelector('.nav');
    if (!nav) return;

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 100) {
            nav.style.background = 'rgba(10, 14, 39, 0.95)';
            nav.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.5)';
        } else {
            nav.style.background = 'rgba(20, 25, 53, 0.6)';
            nav.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.37)';
        }
    });
}

// ==========================================
// PERFORMANCE OPTIMIZATION
// ==========================================
function optimizePerformance() {
    // Debounce resize events
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            onWindowResize();
        }, 250);
    });

    // Throttle scroll events
    let scrollTimer;
    let lastScrollTime = 0;
    const scrollThrottle = 100; // ms

    window.addEventListener('scroll', () => {
        const now = Date.now();
        if (now - lastScrollTime >= scrollThrottle) {
            lastScrollTime = now;
            // Scroll-dependent functions are already called
        }
    });
}

// ==========================================
// INITIALIZE EVERYTHING
// ==========================================
function initAll() {
    console.log('🚀 Initializing Haard Rao Portfolio...');

    try {
        // Core features
        initCustomCursor();
        init3DScene();
        initScrollAnimations();
        initSmoothScroll();
        initMobileMenu();
        initContactForm();
        initActiveNavLinks();
        initScrollToTop();
        initCounterAnimation();
        initLazyAnimations();
        initNavbarScroll();
        optimizePerformance();

        // Optional features (uncomment to enable)
        // initTypingAnimation();
        // initParallaxEffect();

        console.log('✅ Portfolio initialized successfully!');
    } catch (error) {
        console.error('❌ Error initializing portfolio:', error);
    }
}

// ==========================================
// START INITIALIZATION
// ==========================================
function init() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAll);
    } else {
        initAll();
    }
}

// Start the app
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

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Smooth scroll to element
function scrollToElement(element, offset = 80) {
    if (!element) return;
    
    const targetPosition = element.offsetTop - offset;
    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
}

// ==========================================
// CONSOLE MESSAGE
// ==========================================
console.log('%c🚀 Haard Rao Portfolio', 'color: #00d9ff; font-size: 20px; font-weight: bold;');
console.log('%cBuilt with Three.js, GSAP, and vanilla JavaScript', 'color: #a8b2d1; font-size: 12px;');
console.log('%cInterested in the code? Check out the GitHub repo!', 'color: #00ffaa; font-size: 12px;');

// ==========================================
// END OF JAVASCRIPT
// ==========================================
