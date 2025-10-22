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

    // Add CSS for desktop-like slide transitions
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
            transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), 
                       opacity 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            will-change: transform, opacity;
        }
        
        /* Desktop-like slide animations */
        .section.slide-out-left {
            animation: slideOutToLeft 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
        
        .section.slide-out-right {
            animation: slideOutToRight 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
        
        .section.slide-in-left {
            animation: slideInFromLeft 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
        
        .section.slide-in-right {
            animation: slideInFromRight 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
        
        /* Slide out animations */
        @keyframes slideOutToLeft {
            from {
                opacity: 1;
                transform: translateX(0);
            }
            to {
                opacity: 0.3;
                transform: translateX(-100%);
            }
        }
        
        @keyframes slideOutToRight {
            from {
                opacity: 1;
                transform: translateX(0);
            }
            to {
                opacity: 0.3;
                transform: translateX(100%);
            }
        }
        
        /* Slide in animations */
        @keyframes slideInFromLeft {
            from {
                opacity: 0.3;
                transform: translateX(-100%);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes slideInFromRight {
            from {
                opacity: 0.3;
                transform: translateX(100%);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        /* Card animations */
        .card-slide-in {
            animation: cardSlideIn 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
        
        .card-slide-up {
            animation: cardSlideUp 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
        
        @keyframes cardSlideIn {
            from {
                opacity: 0;
                transform: translateY(30px) scale(0.95);
            }
            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }
        
        @keyframes cardSlideUp {
            from {
                opacity: 0;
                transform: translateY(50px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        /* Swipe indicators */
        .swipe-indicator {
            transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        .swipe-active {
            transform: scale(1.3);
            color: #f59e0b;
            text-shadow: 0 0 10px rgba(245, 158, 11, 0.5);
        }
        
        /* Progress bar for section transition */
        .transition-progress {
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(90deg, #f59e0b, #8b5cf6);
            z-index: 1000;
            transition: width 0.3s ease;
        }
        
        /* Enhanced mobile profile animation */
        .mobile-profile {
            transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        .profile-slide-in {
            animation: profileSlideIn 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
        
        @keyframes profileSlideIn {
            from {
                opacity: 0;
                transform: translateX(100px) translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateX(0) translateY(0);
            }
        }
    `;
    document.head.appendChild(style);

    // Add transition progress bar
    const progressBar = document.createElement('div');
    progressBar.className = 'transition-progress';
    document.body.appendChild(progressBar);

    setupTouchEvents();
    setupScrollEvents();
    
    // Initialize sections with proper positioning
    initializeSections();
}

// Initialize sections with proper positioning
function initializeSections() {
    sections.forEach((section, index) => {
        if (isMobile()) {
            section.style.transform = 'translateX(0)';
            section.style.opacity = index === 0 ? '1' : '0.3';
        }
    });
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
    
    // Show swipe indicators
    document.querySelectorAll('.swipe-indicator').forEach(indicator => {
        indicator.classList.add('swipe-active');
    });
    
    // Start progress bar
    document.querySelector('.transition-progress').style.width = '0%';
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
    
    // Update progress bar
    const progress = Math.min(Math.abs(walk) / window.innerWidth, 1);
    document.querySelector('.transition-progress').style.width = `${progress * 100}%`;
    
    // Update section preview states
    updateSectionPreview(walk);
}

// Update section preview during drag
function updateSectionPreview(walk) {
    const direction = walk > 0 ? 'right' : 'left';
    const progress = Math.min(Math.abs(walk) / window.innerWidth, 1);
    
    sections.forEach((section, index) => {
        if (index === currentSectionIndex) {
            // Current section slides out
            section.style.transform = `translateX(${walk * 0.3}px)`;
            section.style.opacity = 1 - progress * 0.7;
        } else if (
            (direction === 'right' && index === currentSectionIndex - 1) ||
            (direction === 'left' && index === currentSectionIndex + 1)
        ) {
            // Next section slides in
            const targetSection = direction === 'right' ? sections[currentSectionIndex - 1] : sections[currentSectionIndex + 1];
            targetSection.style.opacity = 0.3 + progress * 0.7;
            targetSection.style.transform = `translateX(${walk - (direction === 'right' ? -window.innerWidth : window.innerWidth)}px)`;
        }
    });
}

// Touch end handler
function handleTouchEnd() {
    if (!isDragging || !isMobile()) return;
    
    isDragging = false;
    
    // Hide swipe indicators
    document.querySelectorAll('.swipe-indicator').forEach(indicator => {
        indicator.classList.remove('swipe-active');
    });
    
    // Complete progress bar
    document.querySelector('.transition-progress').style.width = '100%';
    
    // Apply momentum and snap to section
    applyMomentumAndSnap();
    
    // Hide progress bar after transition
    setTimeout(() => {
        document.querySelector('.transition-progress').style.width = '0%';
    }, 300);
}

// Apply momentum scrolling and snap to section
function applyMomentumAndSnap() {
    if (!isMobile()) return;
    
    const momentum = velocity * 150; // Adjust multiplier for sensitivity
    const currentScroll = sectionsContainer.scrollLeft;
    const sectionWidth = window.innerWidth;
    const targetScroll = currentScroll + momentum;
    
    let targetIndex = Math.round(targetScroll / sectionWidth);
    targetIndex = Math.max(0, Math.min(targetIndex, sections.length - 1));
    
    // Determine direction for slide animation
    const direction = targetIndex > currentSectionIndex ? 'right' : 'left';
    
    smoothScrollToIndex(targetIndex, direction);
}

// Smooth scroll to specific index with slide animation
function smoothScrollToIndex(index, direction = null) {
    if (isScrolling || index < 0 || index >= sections.length) return;
    
    isScrolling = true;
    
    // Auto-detect direction if not provided
    if (!direction) {
        direction = index > currentSectionIndex ? 'right' : 'left';
    }
    
    const currentSection = sections[currentSectionIndex];
    const targetSection = sections[index];
    
    if (isMobile()) {
        // Mobile: Apply slide animations
        applySlideAnimations(currentSection, targetSection, direction);
        
        // Scroll to position
        if (sectionsContainer) {
            sectionsContainer.scrollTo({
                left: index * window.innerWidth,
                behavior: 'smooth'
            });
        }
    } else {
        // Desktop: vertical scroll
        targetSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Update current index and activate section
    currentSectionIndex = index;
    setActiveSection(targetSection.id);
    
    // Animate cards in the target section
    animateCardsInSection(targetSection);
    
    setTimeout(() => {
        isScrolling = false;
        resetSectionTransforms();
    }, 600);
}

// Apply slide animations between sections
function applySlideAnimations(currentSection, targetSection, direction) {
    // Reset all animations first
    sections.forEach(section => {
        section.classList.remove('slide-out-left', 'slide-out-right', 'slide-in-left', 'slide-in-right');
        section.style.transform = '';
        section.style.opacity = '';
    });
    
    // Apply slide out to current section
    currentSection.classList.add(direction === 'right' ? 'slide-out-left' : 'slide-out-right');
    
    // Apply slide in to target section
    targetSection.classList.add(direction === 'right' ? 'slide-in-right' : 'slide-in-left');
    
    // Reset animations after they complete
    setTimeout(() => {
        currentSection.classList.remove('slide-out-left', 'slide-out-right');
        targetSection.classList.remove('slide-in-left', 'slide-in-right');
    }, 600);
}

// Reset section transforms after animation
function resetSectionTransforms() {
    sections.forEach((section, index) => {
        if (index === currentSectionIndex) {
            section.style.transform = 'translateX(0)';
            section.style.opacity = '1';
        } else {
            section.style.transform = 'translateX(0)';
            section.style.opacity = '0.3';
        }
    });
}

// Animate cards when entering a section
function animateCardsInSection(section) {
    const cards = section.querySelectorAll('.project-card, .package-card, .service-accordion');
    const profile = section.querySelector('.mobile-profile');
    
    // Animate cards with staggered delay
    cards.forEach((card, index) => {
        card.classList.remove('card-slide-in', 'card-slide-up');
        void card.offsetWidth; // Trigger reflow
        
        setTimeout(() => {
            card.classList.add(index % 2 === 0 ? 'card-slide-in' : 'card-slide-up');
        }, index * 150); // Stagger animation
    });
    
    // Animate mobile profile if exists
    if (profile) {
        profile.classList.remove('profile-slide-in');
        void profile.offsetWidth;
        setTimeout(() => {
            profile.classList.add('profile-slide-in');
        }, 300);
    }
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
            const direction = currentIndex > currentSectionIndex ? 'right' : 'left';
            smoothScrollToIndex(currentIndex, direction);
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
    const direction = targetIndex > currentSectionIndex ? 'right' : 'left';
    smoothScrollToIndex(targetIndex, direction);

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

// Rest of the code remains the same (navbar, sidebar, modals, etc.)
// ... [Keep all the existing code for navbar, sidebar, modals, etc.]

// Mouse wheel navigation for desktop
document.addEventListener('wheel', function (e) {
    if (isMobile()) return;

    e.preventDefault();

    if (isScrolling) return;
    isScrolling = true;

    const isScrollingDown = e.deltaY > 0;

    if (isScrollingDown && currentSectionIndex < sections.length - 1) {
        smoothScrollToIndex(currentSectionIndex + 1, 'right');
    } else if (!isScrollingDown && currentSectionIndex > 0) {
        smoothScrollToIndex(currentSectionIndex - 1, 'left');
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
            smoothScrollToIndex(currentSectionIndex + 1, 'right');
        }
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        if (currentSectionIndex > 0) {
            smoothScrollToIndex(currentSectionIndex - 1, 'left');
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

console.log('JavaScript loaded successfully with desktop-like slide transitions!');
