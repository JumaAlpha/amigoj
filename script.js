// Initialize AOS
AOS.init({
    duration: 800,
    once: true,
    offset: 100
});

// DOM Elements
const hamburger = document.getElementById('hamburger');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
const scrollTop = document.getElementById('scrollTop');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');
const navDots = document.querySelectorAll('.nav-dot');
const fadeTexts = document.querySelectorAll('.fade-text');
const skillProgresses = document.querySelectorAll('.skill-progress');
const navbar = document.getElementById('navbar');
const navContent = document.getElementById('navContent');
const loadingBar = document.getElementById('loadingBar');

// Swiper-like variables
let isScrolling = false;
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;
let currentSectionIndex = 0;
let sectionsContainer;
let isDragging = false;
let startX = 0;
let scrollLeft = 0;
let velocity = 0;
let lastX = 0;
let lastTime = 0;

// Check if mobile device
function isMobile() {
    return window.innerWidth <= 768;
}

// Initialize swiper-like functionality
function initSwiper() {
    sectionsContainer = document.querySelector('.sections-container');
    
    if (!sectionsContainer) return;

    // Add CSS for smooth transitions
    const style = document.createElement('style');
    style.textContent = `
        .sections-container {
            scroll-behavior: smooth;
            -webkit-overflow-scrolling: touch;
        }
        
        .section {
            transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), 
                       opacity 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        .section.prev {
            opacity: 0.6;
            transform: translateX(-10px);
        }
        
        .section.next {
            opacity: 0.6;
            transform: translateX(10px);
        }
        
        .section.active {
            opacity: 1;
            transform: translateX(0);
        }
        
        .card-transition {
            transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        .card-slide-in {
            animation: slideInFromRight 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
        
        .card-slide-out {
            animation: slideOutToLeft 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
        
        @keyframes slideInFromRight {
            from {
                opacity: 0;
                transform: translateX(50px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes slideOutToLeft {
            from {
                opacity: 1;
                transform: translateX(0);
            }
            to {
                opacity: 0;
                transform: translateX(-50px);
            }
        }
        
        .swipe-indicator {
            transition: all 0.3s ease;
        }
        
        .swipe-active {
            transform: scale(1.2);
            color: #f59e0b;
        }
    `;
    document.head.appendChild(style);

    setupTouchEvents();
    setupScrollEvents();
}

// Setup touch events for swiper-like behavior
function setupTouchEvents() {
    if (!sectionsContainer) return;

    sectionsContainer.addEventListener('touchstart', handleTouchStart, { passive: true });
    sectionsContainer.addEventListener('touchmove', handleTouchMove, { passive: false });
    sectionsContainer.addEventListener('touchend', handleTouchEnd, { passive: true });
}

// Setup scroll events
function setupScrollEvents() {
    if (!sectionsContainer) return;

    sectionsContainer.addEventListener('scroll', handleScroll, { passive: true });
}

// Touch start handler
function handleTouchStart(e) {
    if (!isMobile()) return;
    
    isDragging = true;
    startX = e.touches[0].pageX;
    scrollLeft = sectionsContainer.scrollLeft;
    lastX = startX;
    lastTime = Date.now();
    velocity = 0;
    
    // Add active state to swipe indicators
    document.querySelectorAll('.swipe-indicator').forEach(indicator => {
        indicator.classList.add('swipe-active');
    });
}

// Touch move handler
function handleTouchMove(e) {
    if (!isDragging || !isMobile()) return;
    
    e.preventDefault();
    
    const x = e.touches[0].pageX;
    const walk = (x - startX);
    sectionsContainer.scrollLeft = scrollLeft - walk;
    
    // Calculate velocity for momentum scrolling
    const currentTime = Date.now();
    const deltaTime = currentTime - lastTime;
    const deltaX = x - lastX;
    
    if (deltaTime > 0) {
        velocity = deltaX / deltaTime;
    }
    
    lastX = x;
    lastTime = currentTime;
    
    // Update section preview states
    updateSectionPreview();
}

// Touch end handler
function handleTouchEnd() {
    if (!isDragging || !isMobile()) return;
    
    isDragging = false;
    
    // Remove active state from swipe indicators
    document.querySelectorAll('.swipe-indicator').forEach(indicator => {
        indicator.classList.remove('swipe-active');
    });
    
    // Apply momentum and snap to section
    applyMomentumAndSnap();
}

// Apply momentum scrolling and snap to section
function applyMomentumAndSnap() {
    if (!isMobile()) return;
    
    const momentum = velocity * 100; // Adjust multiplier for sensitivity
    const currentScroll = sectionsContainer.scrollLeft;
    const sectionWidth = window.innerWidth;
    const targetScroll = currentScroll + momentum;
    
    let targetIndex = Math.round(targetScroll / sectionWidth);
    targetIndex = Math.max(0, Math.min(targetIndex, sections.length - 1));
    
    smoothScrollToIndex(targetIndex);
}

// Update section preview states during drag
function updateSectionPreview() {
    const scrollLeft = sectionsContainer.scrollLeft;
    const sectionWidth = window.innerWidth;
    const currentIndex = Math.floor(scrollLeft / sectionWidth);
    const progress = (scrollLeft % sectionWidth) / sectionWidth;
    
    sections.forEach((section, index) => {
        section.classList.remove('active', 'prev', 'next');
        
        if (index === currentIndex) {
            section.classList.add('active');
            section.style.opacity = 1 - progress * 0.4;
            section.style.transform = `translateX(${-progress * 20}px)`;
        } else if (index === currentIndex + 1) {
            section.classList.add('next');
            section.style.opacity = 0.6 + progress * 0.4;
            section.style.transform = `translateX(${(1 - progress) * 20}px)`;
        } else if (index === currentIndex - 1) {
            section.classList.add('prev');
        } else {
            section.style.opacity = '0.3';
            section.style.transform = 'translateX(0)';
        }
    });
}

// Smooth scroll to specific index
function smoothScrollToIndex(index) {
    if (isScrolling || index < 0 || index >= sections.length) return;
    
    isScrolling = true;
    currentSectionIndex = index;
    
    const targetSection = sections[index];
    const sectionWidth = window.innerWidth;
    
    if (isMobile() && sectionsContainer) {
        // Mobile: horizontal scroll with smooth behavior
        sectionsContainer.scrollTo({
            left: index * sectionWidth,
            behavior: 'smooth'
        });
        
        // Animate cards in the target section
        animateCardsInSection(targetSection);
    } else {
        // Desktop: vertical scroll
        targetSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    setActiveSection(targetSection.id);
    
    setTimeout(() => {
        isScrolling = false;
    }, 600);
}

// Animate cards when entering a section
function animateCardsInSection(section) {
    const cards = section.querySelectorAll('.project-card, .package-card, .service-accordion');
    
    cards.forEach((card, index) => {
        card.classList.remove('card-slide-in');
        void card.offsetWidth; // Trigger reflow
        
        setTimeout(() => {
            card.classList.add('card-slide-in');
        }, index * 100); // Stagger animation
    });
}

// Scroll event handler
function handleScroll() {
    if (isDragging || isScrolling) return;
    
    clearTimeout(window.scrollTimeout);
    window.scrollTimeout = setTimeout(() => {
        const scrollLeft = sectionsContainer.scrollLeft;
        const sectionWidth = window.innerWidth;
        const currentIndex = Math.round(scrollLeft / sectionWidth);
        
        if (currentIndex >= 0 && currentIndex < sections.length && currentIndex !== currentSectionIndex) {
            currentSectionIndex = currentIndex;
            setActiveSection(sections[currentIndex].id);
            animateCardsInSection(sections[currentIndex]);
        }
    }, 100);
}

// Set active section with enhanced animations
function setActiveSection(sectionId) {
    console.log('Activating section:', sectionId);

    // Remove active class from all sections
    sections.forEach(section => {
        section.classList.remove('active', 'prev', 'next');
    });

    // Add active class to target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        currentSectionIndex = Array.from(sections).indexOf(targetSection);
        
        // Update adjacent sections
        if (currentSectionIndex > 0) {
            sections[currentSectionIndex - 1].classList.add('prev');
        }
        if (currentSectionIndex < sections.length - 1) {
            sections[currentSectionIndex + 1].classList.add('next');
        }
    }

    // Update navigation dots
    navDots.forEach(dot => {
        dot.classList.toggle('active', dot.getAttribute('data-section') === sectionId);
    });

    // Update sidebar links
    navLinks.forEach(link => {
        link.classList.toggle('active-sidebar-link', link.getAttribute('data-section') === sectionId);
    });

    // Refresh AOS animations
    AOS.refresh();

    // Animate skill bars when about section is active
    if (sectionId === 'about') {
        setTimeout(() => {
            skillProgresses.forEach(progress => {
                const width = progress.getAttribute('data-width');
                progress.style.width = width;
            });
        }, 500);
    }
}

// Scroll to section function
function scrollToSection(sectionId) {
    if (sectionId === 'portfolio') {
        openVideoModal();
        return;
    }
    
    const targetSection = document.getElementById(sectionId);
    if (!targetSection) return;
    
    const targetIndex = Array.from(sections).indexOf(targetSection);
    smoothScrollToIndex(targetIndex);

    // Close sidebar on mobile
    if (window.innerWidth < 1024) {
        sidebar.style.right = '-420px';
        overlay.style.opacity = '0';
        overlay.style.visibility = 'hidden';
    }
}

// Loading animation
window.addEventListener('load', function () {
    console.log('Page loaded, initializing...');

    let width = 1;
    const interval = setInterval(function () {
        if (width >= 100) {
            clearInterval(interval);
            loadingBar.style.opacity = '0';
            setTimeout(() => loadingBar.style.display = 'none', 300);
        } else {
            width++;
            loadingBar.style.width = width + '%';
        }
    }, 10);

    // Initialize swiper functionality
    initSwiper();

    // Initialize first section
    setActiveSection('home');
    
    // Animate cards in home section
    setTimeout(() => {
        animateCardsInSection(document.getElementById('home'));
    }, 1000);
});

// Navbar scroll effect (desktop only)
window.addEventListener('scroll', function () {
    if (isMobile()) return;
    
    if (window.pageYOffset > 50) {
        navbar.classList.add('navbar-scrolled');
        navContent.classList.remove('mt-6');
        navContent.classList.remove('mx-5');
    } else {
        navbar.classList.remove('navbar-scrolled');
        navContent.classList.add('mt-6');
        navContent.classList.add('mx-5');
    }

    // Scroll to top button
    if (window.pageYOffset > 300) {
        scrollTop.classList.add('active');
    } else {
        scrollTop.classList.remove('active');
    }
});

// Sidebar toggle
if (hamburger) {
    hamburger.addEventListener('click', function () {
        sidebar.style.right = '0';
        overlay.style.opacity = '1';
        overlay.style.visibility = 'visible';
    });
}

if (overlay) {
    overlay.addEventListener('click', function () {
        sidebar.style.right = '-420px';
        overlay.style.opacity = '0';
        overlay.style.visibility = 'hidden';
    });
}

// Scroll to top functionality
if (scrollTop) {
    scrollTop.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        smoothScrollToIndex(0);
    });
}

// Text rotation animation
let currentTextIndex = 0;

function rotateText() {
    if (fadeTexts.length > 0) {
        fadeTexts.forEach(text => {
            text.classList.remove('active');
        });
        fadeTexts[currentTextIndex].classList.add('active');
        currentTextIndex = (currentTextIndex + 1) % fadeTexts.length;
    }
}

// Initialize text rotation
if (fadeTexts.length > 0) {
    setInterval(rotateText, 3000);
}

// Mouse wheel navigation for desktop
document.addEventListener('wheel', function (e) {
    if (isMobile()) return;

    e.preventDefault();

    if (isScrolling) return;
    isScrolling = true;

    const isScrollingDown = e.deltaY > 0;

    if (isScrollingDown && currentSectionIndex < sections.length - 1) {
        smoothScrollToIndex(currentSectionIndex + 1);
    } else if (!isScrollingDown && currentSectionIndex > 0) {
        smoothScrollToIndex(currentSectionIndex - 1);
    }

    setTimeout(() => {
        isScrolling = false;
    }, 800);
}, { passive: false });

// Enhanced keyboard navigation
document.addEventListener('keydown', function (e) {
    if (isScrolling) return;
    
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === 'PageDown') {
        e.preventDefault();
        if (currentSectionIndex < sections.length - 1) {
            smoothScrollToIndex(currentSectionIndex + 1);
        }
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        if (currentSectionIndex > 0) {
            smoothScrollToIndex(currentSectionIndex - 1);
        }
    } else if (e.key === 'Home') {
        e.preventDefault();
        smoothScrollToIndex(0);
    } else if (e.key === 'End') {
        e.preventDefault();
        smoothScrollToIndex(sections.length - 1);
    }
});

// Video Modal Functions
function openVideoModal() {
    const modal = document.getElementById('videoModal');
    const video = document.getElementById('showreelVideo');

    if (modal) {
        modal.classList.remove('hidden');
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);

        if (video) {
            setTimeout(() => {
                video.play().catch(e => {
                    console.log('Autoplay prevented:', e);
                });
            }, 500);
        }

        document.body.style.overflow = 'hidden';
    }
}

function closeVideoModal() {
    const modal = document.getElementById('videoModal');
    const video = document.getElementById('showreelVideo');

    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.classList.add('hidden');
        }, 300);
    }

    if (video) {
        video.pause();
        video.currentTime = 0;
    }

    document.body.style.overflow = '';
}

// Close modal with Escape key
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        closeVideoModal();
    }
});

// Navigation dots
navDots.forEach(dot => {
    dot.addEventListener('click', function () {
        const sectionId = this.getAttribute('data-section');
        scrollToSection(sectionId);
    });
});

// Sidebar navigation
navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        const sectionId = this.getAttribute('data-section');
        scrollToSection(sectionId);

        // Close sidebar on mobile
        if (window.innerWidth < 1024) {
            sidebar.style.right = '-420px';
            overlay.style.opacity = '0';
            overlay.style.visibility = 'hidden';
        }
    });
});

// Contact form handling
const contactForm = document.querySelector('form');
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const button = this.querySelector('button');
        const originalHTML = button.innerHTML;

        button.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Sending...';
        button.disabled = true;

        setTimeout(() => {
            button.innerHTML = '<i class="fas fa-check mr-2"></i>Message Sent!';

            setTimeout(() => {
                button.innerHTML = originalHTML;
                button.disabled = false;
                this.reset();
            }, 2000);
        }, 1500);
    });
}

// Handle window resize
window.addEventListener('resize', function () {
    AOS.refresh();
    
    // Update scroll position on resize
    if (isMobile() && sectionsContainer) {
        sectionsContainer.scrollLeft = currentSectionIndex * window.innerWidth;
    }
});

// Close sidebar button
const closeSidebar = document.querySelector('.close-sidebar');
if (closeSidebar) {
    closeSidebar.addEventListener('click', function () {
        sidebar.style.right = '-100%';
        overlay.style.opacity = '0';
        overlay.style.visibility = 'hidden';
    });
}

// Initialize animations for elements
window.addEventListener('load', function () {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.project-card, .glass-effect').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

console.log('JavaScript loaded successfully with Swiper-like transitions!');
