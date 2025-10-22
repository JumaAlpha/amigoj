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

// Simplified variables for better performance
let isScrolling = false;
let currentSectionIndex = 0;
let sectionsContainer;
let touchStartX = 0;
let isAnimating = false;

// Check if mobile device
function isMobile() {
    return window.innerWidth <= 768;
}

// Initialize swiper-like functionality
function initSwiper() {
    sectionsContainer = document.querySelector('.sections-container');
    
    if (!sectionsContainer) return;

    // Add minimal CSS for performance
    const style = document.createElement('style');
    style.textContent = `
        .sections-container {
            scroll-behavior: smooth;
            -webkit-overflow-scrolling: touch;
            overflow-x: auto;
            overflow-y: hidden;
            scroll-snap-type: x mandatory;
            scrollbar-width: none;
            -ms-overflow-style: none;
        }
        
        .sections-container::-webkit-scrollbar {
            display: none;
        }
        
        .section {
            scroll-snap-align: start;
        }
        
        /* Simple fade transition */
        .section {
            transition: opacity 0.3s ease;
        }
        
        .section:not(.active) {
            opacity: 0.3;
        }
        
        .section.active {
            opacity: 1;
        }
        
        /* Simple card animations */
        .card-fade-in {
            animation: cardFadeIn 0.5s ease forwards;
        }
        
        @keyframes cardFadeIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);

    setupTouchEvents();
    setupScrollEvents();
}

// Setup touch events - SIMPLIFIED
function setupTouchEvents() {
    if (!sectionsContainer) return;

    // Use passive: true for better performance
    sectionsContainer.addEventListener('touchstart', handleTouchStart, { passive: true });
    sectionsContainer.addEventListener('touchend', handleTouchEnd, { passive: true });
}

// Setup scroll events
function setupScrollEvents() {
    if (!sectionsContainer) return;

    sectionsContainer.addEventListener('scroll', handleScroll, { passive: true });
}

// Simple touch start handler
function handleTouchStart(e) {
    if (!isMobile() || isAnimating) return;
    touchStartX = e.touches[0].clientX;
}

// Simple touch end handler
function handleTouchEnd(e) {
    if (!isMobile() || isAnimating) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const swipeDistance = touchEndX - touchStartX;
    const swipeThreshold = 50; // Minimum swipe distance

    if (Math.abs(swipeDistance) > swipeThreshold) {
        if (swipeDistance < 0 && currentSectionIndex < sections.length - 1) {
            // Swipe left - next section
            goToSection(currentSectionIndex + 1);
        } else if (swipeDistance > 0 && currentSectionIndex > 0) {
            // Swipe right - previous section
            goToSection(currentSectionIndex - 1);
        }
    }
}

// Simple section navigation
function goToSection(index) {
    if (isAnimating || index < 0 || index >= sections.length) return;
    
    isAnimating = true;
    currentSectionIndex = index;
    
    if (sectionsContainer) {
        sectionsContainer.scrollTo({
            left: index * window.innerWidth,
            behavior: 'smooth'
        });
    }
    
    setActiveSection(sections[index].id);
    
    setTimeout(() => {
        isAnimating = false;
    }, 300);
}

// Scroll event handler
function handleScroll() {
    if (isAnimating) return;
    
    clearTimeout(window.scrollTimeout);
    window.scrollTimeout = setTimeout(() => {
        const scrollLeft = sectionsContainer.scrollLeft;
        const sectionWidth = window.innerWidth;
        const currentIndex = Math.round(scrollLeft / sectionWidth);
        
        if (currentIndex >= 0 && currentIndex < sections.length && currentIndex !== currentSectionIndex) {
            currentSectionIndex = currentIndex;
            setActiveSection(sections[currentIndex].id);
        }
    }, 100);
}

// Set active section - SIMPLIFIED
function setActiveSection(sectionId) {
    // Remove active class from all sections
    sections.forEach(section => {
        section.classList.remove('active');
    });

    // Add active class to target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        currentSectionIndex = Array.from(sections).indexOf(targetSection);
        
        // Simple card animation
        animateCardsInSection(targetSection);
    }

    // Update navigation dots
    navLinks.forEach(link => {
        link.classList.toggle('active-sidebar-link', link.getAttribute('data-section') === sectionId);
    });

    navDots.forEach(dot => {
        dot.classList.toggle('active', dot.getAttribute('data-section') === sectionId);
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

// Simple card animation
function animateCardsInSection(section) {
    const cards = section.querySelectorAll('.project-card, .package-card, .service-accordion');
    
    cards.forEach((card, index) => {
        card.classList.remove('card-fade-in');
        void card.offsetWidth; // Trigger reflow
        
        setTimeout(() => {
            card.classList.add('card-fade-in');
        }, index * 100);
    });
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
    goToSection(targetIndex);

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
        goToSection(0);
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
        goToSection(currentSectionIndex + 1);
    } else if (!isScrollingDown && currentSectionIndex > 0) {
        goToSection(currentSectionIndex - 1);
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
            goToSection(currentSectionIndex + 1);
        }
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        if (currentSectionIndex > 0) {
            goToSection(currentSectionIndex - 1);
        }
    } else if (e.key === 'Home') {
        e.preventDefault();
        goToSection(0);
    } else if (e.key === 'End') {
        e.preventDefault();
        goToSection(sections.length - 1);
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

