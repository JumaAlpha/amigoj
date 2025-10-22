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
let isDragging = false;
let startX = 0;
let currentX = 0;
let currentTranslate = 0;
let prevTranslate = 0;
let currentSectionIndex = 0;
let animationID;
let velocity = 0;
let lastX = 0;
let lastTime = 0;
let sectionsContainer;

// Check if mobile device
function isMobile() {
    return window.innerWidth <= 768;
}

// Initialize swiper-like functionality
function initSwiper() {
    sectionsContainer = document.querySelector('.sections-container');
    
    if (!sectionsContainer) return;

    // Add CSS for swiper-like transitions
    const style = document.createElement('style');
    style.textContent = `
        .sections-container {
            overflow: hidden;
            position: relative;
            width: 100%;
            height: 100vh;
            touch-action: pan-y;
        }
        
        .sections-wrapper {
            display: flex;
            height: 100%;
            transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            will-change: transform;
        }
        
        .section {
            flex: 0 0 100%;
            width: 100%;
            height: 100%;
            transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), 
                       opacity 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            will-change: transform, opacity;
        }
        
        .section.active {
            opacity: 1;
            transform: translateX(0) scale(1);
        }
        
        .section.prev {
            opacity: 0.6;
            transform: translateX(-10%) scale(0.95);
        }
        
        .section.next {
            opacity: 0.6;
            transform: translateX(10%) scale(0.95);
        }
        
        .section:not(.active):not(.prev):not(.next) {
            opacity: 0.3;
            transform: scale(0.9);
        }
        
        /* Swipe indicators */
        .swipe-indicator-left,
        .swipe-indicator-right {
            position: fixed;
            top: 50%;
            transform: translateY(-50%);
            z-index: 90;
            opacity: 0;
            transition: all 0.3s ease;
            background: rgba(15, 23, 42, 0.8);
            backdrop-filter: blur(10px);
            border-radius: 50%;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .swipe-indicator-left {
            left: 20px;
        }
        
        .swipe-indicator-right {
            right: 20px;
        }
        
        .swipe-indicator-left.show,
        .swipe-indicator-right.show {
            opacity: 1;
            transform: translateY(-50%) scale(1.1);
        }
        
        /* Progress indicator during drag */
        .swipe-progress {
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(90deg, #f59e0b, #8b5cf6);
            z-index: 1000;
            transition: width 0.1s ease;
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
        
        /* Navigation dots */
        .nav-dots {
            position: fixed;
            right: 20px;
            top: 50%;
            transform: translateY(-50%);
            z-index: 100;
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
        
        .nav-dot {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            border: 2px solid transparent;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        .nav-dot:hover {
            background: rgba(255, 255, 255, 0.5);
            transform: scale(1.2);
        }
        
        .nav-dot.active {
            background: #f59e0b;
            border-color: rgba(245, 158, 11, 0.5);
            transform: scale(1.3);
            box-shadow: 0 0 15px rgba(245, 158, 11, 0.5);
        }
        
        @media (max-width: 768px) {
            .nav-dots {
                display: none;
            }
            
            .swipe-indicator-left,
            .swipe-indicator-right {
                display: none;
            }
        }
    `;
    document.head.appendChild(style);

    // Create wrapper for sections
    const sectionsWrapper = document.createElement('div');
    sectionsWrapper.className = 'sections-wrapper';
    
    // Move all sections into wrapper
    sections.forEach(section => {
        sectionsWrapper.appendChild(section);
    });
    
    sectionsContainer.appendChild(sectionsWrapper);
    
    // Add progress indicator
    const progressBar = document.createElement('div');
    progressBar.className = 'swipe-progress';
    document.body.appendChild(progressBar);

    setupTouchEvents();
    setupSwipeIndicators();
    
    // Initialize sections
    initializeSections();
}

// Setup swipe indicators
function setupSwipeIndicators() {
    const leftIndicator = document.querySelector('.swipe-indicator-left');
    const rightIndicator = document.querySelector('.swipe-indicator-right');
    
    if (leftIndicator) {
        leftIndicator.addEventListener('click', () => {
            if (currentSectionIndex > 0) {
                slideToSection(currentSectionIndex - 1, 'left');
            }
        });
    }
    
    if (rightIndicator) {
        rightIndicator.addEventListener('click', () => {
            if (currentSectionIndex < sections.length - 1) {
                slideToSection(currentSectionIndex + 1, 'right');
            }
        });
    }
    
    updateSwipeIndicators();
}

// Update swipe indicators visibility
function updateSwipeIndicators() {
    const leftIndicator = document.querySelector('.swipe-indicator-left');
    const rightIndicator = document.querySelector('.swipe-indicator-right');
    
    if (leftIndicator) {
        if (currentSectionIndex > 0) {
            leftIndicator.classList.add('show');
        } else {
            leftIndicator.classList.remove('show');
        }
    }
    
    if (rightIndicator) {
        if (currentSectionIndex < sections.length - 1) {
            rightIndicator.classList.add('show');
        } else {
            rightIndicator.classList.remove('show');
        }
    }
}

// Setup touch events for swiper-like behavior
function setupTouchEvents() {
    if (!sectionsContainer) return;

    const sectionsWrapper = sectionsContainer.querySelector('.sections-wrapper');
    
    sectionsContainer.addEventListener('touchstart', handleTouchStart, { passive: false });
    sectionsContainer.addEventListener('touchmove', handleTouchMove, { passive: false });
    sectionsContainer.addEventListener('touchend', handleTouchEnd, { passive: true });
    
    // Mouse events for desktop testing
    sectionsContainer.addEventListener('mousedown', handleMouseDown);
    sectionsContainer.addEventListener('mousemove', handleMouseMove);
    sectionsContainer.addEventListener('mouseup', handleMouseUp);
    sectionsContainer.addEventListener('mouseleave', handleMouseUp);
}

// Touch start handler
function handleTouchStart(e) {
    if (!isMobile()) return;
    
    e.preventDefault();
    startDrag(e.touches[0].clientX);
}

// Touch move handler
function handleTouchMove(e) {
    if (!isMobile() || !isDragging) return;
    
    e.preventDefault();
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX;
    
    if (Math.abs(diff) > 10) { // Minimum drag threshold
        updateDrag(currentX);
    }
}

// Touch end handler
function handleTouchEnd() {
    if (!isMobile() || !isDragging) return;
    
    endDrag();
}

// Mouse down handler
function handleMouseDown(e) {
    if (!isMobile()) return;
    
    e.preventDefault();
    startDrag(e.clientX);
    
    // Add active state for visual feedback
    sectionsContainer.style.cursor = 'grabbing';
}

// Mouse move handler
function handleMouseMove(e) {
    if (!isMobile() || !isDragging) return;
    
    e.preventDefault();
    updateDrag(e.clientX);
}

// Mouse up handler
function handleMouseUp() {
    if (!isMobile() || !isDragging) return;
    
    endDrag();
    sectionsContainer.style.cursor = 'grab';
}

// Start drag
function startDrag(clientX) {
    isDragging = true;
    startX = clientX;
    currentX = clientX;
    lastX = clientX;
    lastTime = Date.now();
    velocity = 0;
    
    const sectionsWrapper = sectionsContainer.querySelector('.sections-wrapper');
    prevTranslate = currentTranslate;
    
    // Cancel any ongoing animation
    cancelAnimationFrame(animationID);
    
    // Show progress bar
    document.querySelector('.swipe-progress').style.width = '0%';
}

// Update drag position
function updateDrag(clientX) {
    if (!isDragging) return;
    
    currentX = clientX;
    const diff = currentX - startX;
    const maxDrag = window.innerWidth * 0.3; // Maximum drag distance
    
    // Calculate velocity
    const currentTime = Date.now();
    const deltaTime = currentTime - lastTime;
    const deltaX = currentX - lastX;
    
    if (deltaTime > 0) {
        velocity = deltaX / deltaTime;
    }
    
    lastX = currentX;
    lastTime = currentTime;
    
    // Apply resistance and boundaries
    let dragDistance = diff;
    if (Math.abs(diff) > maxDrag) {
        dragDistance = diff > 0 ? maxDrag : -maxDrag;
    }
    
    // Apply resistance when at boundaries
    if ((currentSectionIndex === 0 && diff > 0) || 
        (currentSectionIndex === sections.length - 1 && diff < 0)) {
        dragDistance *= 0.3; // Strong resistance at boundaries
    }
    
    currentTranslate = prevTranslate + dragDistance;
    
    // Update wrapper position
    const sectionsWrapper = sectionsContainer.querySelector('.sections-wrapper');
    sectionsWrapper.style.transform = `translateX(calc(-${currentSectionIndex * 100}% + ${dragDistance}px))`;
    
    // Update progress bar
    const progress = Math.min(Math.abs(diff) / (window.innerWidth * 0.5), 1);
    document.querySelector('.swipe-progress').style.width = `${progress * 100}%`;
    
    // Update section states during drag
    updateSectionStatesDuringDrag(diff);
}

// Update section states during drag
function updateSectionStatesDuringDrag(diff) {
    const progress = Math.min(Math.abs(diff) / (window.innerWidth * 0.5), 1);
    const direction = diff > 0 ? 'right' : 'left';
    
    sections.forEach((section, index) => {
        if (index === currentSectionIndex) {
            // Current section
            const opacity = 1 - progress * 0.4;
            const scale = 1 - progress * 0.05;
            section.style.opacity = opacity;
            section.style.transform = `scale(${scale})`;
        } else if (
            (direction === 'right' && index === currentSectionIndex - 1) ||
            (direction === 'left' && index === currentSectionIndex + 1)
        ) {
            // Adjacent section
            const opacity = 0.6 + progress * 0.4;
            const scale = 0.95 + progress * 0.05;
            section.style.opacity = opacity;
            section.style.transform = `scale(${scale})`;
        } else {
            // Other sections
            section.style.opacity = '0.3';
            section.style.transform = 'scale(0.9)';
        }
    });
}

// End drag and handle snap
function endDrag() {
    if (!isDragging) return;
    
    isDragging = false;
    const diff = currentX - startX;
    const threshold = window.innerWidth * 0.15; // 15% threshold for snap
    const absVelocity = Math.abs(velocity);
    
    let targetIndex = currentSectionIndex;
    
    // Determine target section based on drag and velocity
    if (Math.abs(diff) > threshold || absVelocity > 0.5) {
        if (diff > 0 && currentSectionIndex > 0) {
            // Swipe right - go to previous section
            targetIndex = currentSectionIndex - 1;
        } else if (diff < 0 && currentSectionIndex < sections.length - 1) {
            // Swipe left - go to next section
            targetIndex = currentSectionIndex + 1;
        }
    }
    
    // Apply momentum based on velocity
    if (absVelocity > 1.0) {
        if (velocity > 0 && currentSectionIndex > 0) {
            targetIndex = currentSectionIndex - 1;
        } else if (velocity < 0 && currentSectionIndex < sections.length - 1) {
            targetIndex = currentSectionIndex + 1;
        }
    }
    
    // Snap to target section
    slideToSection(targetIndex, diff > 0 ? 'right' : 'left');
    
    // Hide progress bar
    document.querySelector('.swipe-progress').style.width = '0%';
}

// Slide to specific section
function slideToSection(targetIndex, direction) {
    if (isScrolling || targetIndex < 0 || targetIndex >= sections.length) return;
    
    isScrolling = true;
    
    const sectionsWrapper = sectionsContainer.querySelector('.sections-wrapper');
    
    // Animate to target position
    sectionsWrapper.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    sectionsWrapper.style.transform = `translateX(-${targetIndex * 100}%)`;
    
    // Update current index and activate section
    currentSectionIndex = targetIndex;
    setActiveSection(sections[targetIndex].id);
    
    // Reset wrapper transition after animation
    setTimeout(() => {
        sectionsWrapper.style.transition = '';
        isScrolling = false;
    }, 600);
}

// Initialize sections
function initializeSections() {
    const sectionsWrapper = sectionsContainer.querySelector('.sections-wrapper');
    sectionsWrapper.style.transform = `translateX(-${currentSectionIndex * 100}%)`;
    
    setActiveSection(sections[currentSectionIndex].id);
}

// Set active section
function setActiveSection(sectionId) {
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

    // Update navigation
    updateNavDots(sectionId);
    updateSidebarLinks(sectionId);
    updateSwipeIndicators();

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
    
    // Animate cards in the target section
    animateCardsInSection(targetSection);
}

// Update navigation dots
function updateNavDots(sectionId) {
    navDots.forEach(dot => {
        const dotSection = dot.getAttribute('data-section');
        if (dotSection === sectionId) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

// Update sidebar links
function updateSidebarLinks(sectionId) {
    navLinks.forEach(link => {
        const linkSection = link.getAttribute('data-section');
        if (linkSection === sectionId) {
            link.classList.add('active-sidebar-link');
        } else {
            link.classList.remove('active-sidebar-link');
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
        }, index * 150);
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
    slideToSection(targetIndex, direction);

    // Close sidebar on mobile
    if (window.innerWidth < 1024) {
        closeSidebar();
    }
}

// Close sidebar function
function closeSidebar() {
    sidebar.style.right = '-420px';
    overlay.style.opacity = '0';
    overlay.style.visibility = 'hidden';
}

// Loading animation
window.addEventListener('load', function () {
    console.log('Page loaded, initializing...');

    let width = 1;
    const interval = setInterval(function () {
        if (width >= 100) {
            clearInterval(interval);
            loadingBar.style.opacity = '0';
            setTimeout(() => {
                loadingBar.style.display = 'none';
            }, 300);
        } else {
            width++;
            loadingBar.style.width = width + '%';
        }
    }, 10);

    // Initialize swiper functionality
    initSwiper();
});

// Rest of your existing code remains the same...
// [Keep all the existing code for navbar, sidebar, modals, mouse wheel, keyboard navigation, etc.]

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
        closeSidebar();
    });
}

// Scroll to top functionality
if (scrollTop) {
    scrollTop.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        slideToSection(0);
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
        slideToSection(currentSectionIndex + 1, 'right');
    } else if (!isScrollingDown && currentSectionIndex > 0) {
        slideToSection(currentSectionIndex - 1, 'left');
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
            slideToSection(currentSectionIndex + 1, 'right');
        }
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        if (currentSectionIndex > 0) {
            slideToSection(currentSectionIndex - 1, 'left');
        }
    } else if (e.key === 'Home') {
        e.preventDefault();
        slideToSection(0);
    } else if (e.key === 'End') {
        e.preventDefault();
        slideToSection(sections.length - 1);
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

// Navigation dots functionality
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
            closeSidebar();
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
});

// Close sidebar button
const closeSidebarBtn = document.querySelector('.close-sidebar');
if (closeSidebarBtn) {
    closeSidebarBtn.addEventListener('click', function () {
        closeSidebar();
    });
}

