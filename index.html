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
let sectionsContainer;
let rafID;
let velocity = 0;
let lastX = 0;
let lastTime = 0;

// Initialize horizontal scrolling
function initHorizontalScroll() {
    sectionsContainer = document.querySelector('.sections-container');
    
    if (!sectionsContainer) return;

    // Add CSS for horizontal scrolling
    const style = document.createElement('style');
    style.textContent = `
        .sections-container {
            overflow-x: auto;
            overflow-y: hidden;
            scroll-snap-type: x mandatory;
            scroll-behavior: smooth;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
            -ms-overflow-style: none;
            width: 100%;
            height: 100vh;
            position: relative;
        }
        
        .sections-container::-webkit-scrollbar {
            display: none;
        }
        
        .section {
            scroll-snap-align: start;
            scroll-snap-stop: always;
            min-width: 100vw;
            width: 100vw;
            height: 100vh;
            overflow-y: auto;
        }
        
        /* Smooth transitions for section changes */
        .section {
            transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        /* Hide scrollbars but keep functionality */
        .section::-webkit-scrollbar {
            width: 0px;
            background: transparent;
        }
        
        /* Active section styling */
        .section.active {
            transform: scale(1);
        }
        
        .section:not(.active) {
            transform: scale(0.98);
        }
    `;
    document.head.appendChild(style);

    setupTouchEvents();
    setupScrollEvents();
    
    // Initialize first section
    setActiveSection('home');
}

// Setup touch events for smooth horizontal scrolling
function setupTouchEvents() {
    if (!sectionsContainer) return;
    
    sectionsContainer.addEventListener('touchstart', handleTouchStart, { passive: false });
    sectionsContainer.addEventListener('touchmove', handleTouchMove, { passive: false });
    sectionsContainer.addEventListener('touchend', handleTouchEnd, { passive: true });
    
    // Mouse events for desktop
    sectionsContainer.addEventListener('mousedown', handleMouseDown);
    sectionsContainer.addEventListener('mousemove', handleMouseMove);
    sectionsContainer.addEventListener('mouseup', handleMouseUp);
    sectionsContainer.addEventListener('mouseleave', handleMouseUp);
}

// Touch start handler
function handleTouchStart(e) {
    e.preventDefault();
    startDrag(e.touches[0].clientX);
}

// Touch move handler
function handleTouchMove(e) {
    if (!isDragging) return;
    e.preventDefault();
    updateDragPosition(e.touches[0].clientX);
}

// Touch end handler
function handleTouchEnd() {
    if (!isDragging) return;
    endDrag();
}

// Mouse down handler
function handleMouseDown(e) {
    e.preventDefault();
    startDrag(e.clientX);
    sectionsContainer.style.cursor = 'grabbing';
}

// Mouse move handler
function handleMouseMove(e) {
    if (!isDragging) return;
    e.preventDefault();
    updateDragPosition(e.clientX);
}

// Mouse up handler
function handleMouseUp() {
    if (!isDragging) return;
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
    
    // Cancel any ongoing animation
    cancelAnimationFrame(rafID);
    
    // Disable smooth scroll during drag
    sectionsContainer.style.scrollBehavior = 'auto';
}

// Update drag position with smooth animation
function updateDragPosition(clientX) {
    if (!isDragging) return;
    
    currentX = clientX;
    
    if (!rafID) {
        rafID = requestAnimationFrame(updateScrollPosition);
    }
}

// Smooth scroll position update
function updateScrollPosition() {
    if (!isDragging) return;
    
    const diff = currentX - startX;
    const scrollLeft = sectionsContainer.scrollLeft;
    
    // Calculate velocity
    const currentTime = Date.now();
    const deltaTime = Math.max(currentTime - lastTime, 1);
    const deltaX = currentX - lastX;
    
    velocity = deltaX / deltaTime;
    lastX = currentX;
    lastTime = currentTime;
    
    // Update scroll position with resistance
    sectionsContainer.scrollLeft = scrollLeft - diff * 0.8;
    
    // Continue animation
    rafID = requestAnimationFrame(updateScrollPosition);
}

// End drag with momentum
function endDrag() {
    if (!isDragging) return;
    
    isDragging = false;
    cancelAnimationFrame(rafID);
    rafID = null;
    
    const diff = currentX - startX;
    const absVelocity = Math.abs(velocity);
    
    // Apply momentum
    if (absVelocity > 0.5) {
        const momentum = velocity * 100;
        const currentScroll = sectionsContainer.scrollLeft;
        sectionsContainer.scrollLeft = currentScroll - momentum;
    }
    
    // Re-enable smooth scroll
    sectionsContainer.style.scrollBehavior = 'smooth';
    sectionsContainer.style.cursor = '';
    
    // Snap to nearest section after a short delay
    setTimeout(snapToNearestSection, 100);
}

// Snap to nearest section
function snapToNearestSection() {
    const scrollLeft = sectionsContainer.scrollLeft;
    const sectionWidth = window.innerWidth;
    const currentIndex = Math.round(scrollLeft / sectionWidth);
    
    if (currentIndex >= 0 && currentIndex < sections.length) {
        smoothScrollToIndex(currentIndex);
    }
}

// Setup scroll events
function setupScrollEvents() {
    if (!sectionsContainer) return;

    sectionsContainer.addEventListener('scroll', handleScroll, { passive: true });
}

// Handle scroll events
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
        }
    }, 100);
}

// Smooth scroll to specific index
function smoothScrollToIndex(index) {
    if (isScrolling || index < 0 || index >= sections.length) return;
    
    isScrolling = true;
    currentSectionIndex = index;
    
    sectionsContainer.scrollTo({
        left: index * window.innerWidth,
        behavior: 'smooth'
    });
    
    setActiveSection(sections[index].id);
    
    setTimeout(() => {
        isScrolling = false;
    }, 500);
}

// Set active section
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
    }

    // Update navigation dots
    updateNavDots(sectionId);

    // Update sidebar links
    updateSidebarLinks(sectionId);

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
        }, index * 100);
    });
    
    // Animate mobile profile if exists
    if (profile) {
        profile.classList.remove('profile-slide-in');
        void profile.offsetWidth;
        setTimeout(() => {
            profile.classList.add('profile-slide-in');
        }, 200);
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

    // Initialize horizontal scrolling
    initHorizontalScroll();
});

// Rest of your existing functionality...

// Navbar scroll effect
window.addEventListener('scroll', function () {
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

// Mouse wheel navigation for horizontal scrolling
document.addEventListener('wheel', function (e) {
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
    }, 600);
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
    
    // Update scroll position on resize
    if (sectionsContainer) {
        sectionsContainer.scrollLeft = currentSectionIndex * window.innerWidth;
    }
});

// Close sidebar button
const closeSidebarBtn = document.querySelector('.close-sidebar');
if (closeSidebarBtn) {
    closeSidebarBtn.addEventListener('click', function () {
        closeSidebar();
    });
}

