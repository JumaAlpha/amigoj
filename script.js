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
let touchEndX = 0;
let currentSectionIndex = 0;
let sectionsContainer;

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
        
        /* Navigation dots styles */
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
            position: relative;
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
        
        .nav-dot::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: transparent;
            transition: all 0.3s ease;
        }
        
        .nav-dot.active::after {
            background: rgba(245, 158, 11, 0.2);
        }
        
        /* Mobile profile animation */
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
        
        /* Loading bar */
        .loading-bar {
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(90deg, #f59e0b, #8b5cf6);
            z-index: 9999;
            transition: width 0.3s ease;
        }
        
        /* Scroll to top button */
        .scroll-top {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            background: rgba(15, 23, 42, 0.8);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #f59e0b;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transform: translateY(20px);
            transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            z-index: 99;
        }
        
        .scroll-top.active {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
        }
        
        .scroll-top:hover {
            background: #f59e0b;
            color: #0f172a;
            transform: translateY(-5px);
        }
        
        /* Sidebar styles */
        .sidebar-glass {
            background: rgba(15, 23, 42, 0.95);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border-left: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .sidebar-link {
            transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        .sidebar-link:hover {
            background: rgba(255, 255, 255, 0.1);
            transform: translateX(5px);
        }
        
        .active-sidebar-link {
            background: rgba(245, 158, 11, 0.2);
            border-left: 3px solid #f59e0b;
        }
        
        /* Mobile responsive */
        @media (max-width: 768px) {
            .nav-dots {
                display: none;
            }
            
            .scroll-top {
                bottom: 20px;
                right: 20px;
                width: 45px;
                height: 45px;
            }
        }
    `;
    document.head.appendChild(style);

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

    // Use passive: true for better performance
    sectionsContainer.addEventListener('touchstart', handleTouchStart, { passive: true });
    sectionsContainer.addEventListener('touchmove', handleTouchMove, { passive: true });
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
    
    touchStartX = e.touches[0].clientX;
}

// Touch move handler - Lightweight
function handleTouchMove(e) {
    if (!isMobile()) return;
    // Let the native scroll handle the movement for better performance
}

// Touch end handler
function handleTouchEnd(e) {
    if (!isMobile()) return;
    
    touchEndX = e.changedTouches[0].clientX;
    handleSwipe();
}

// Handle swipe gesture
function handleSwipe() {
    const swipeThreshold = 50;
    const swipeDistance = touchEndX - touchStartX;

    if (Math.abs(swipeDistance) > swipeThreshold && !isScrolling) {
        if (swipeDistance < 0 && currentSectionIndex < sections.length - 1) {
            // Swipe left - next section
            smoothScrollToIndex(currentSectionIndex + 1, 'right');
        } else if (swipeDistance > 0 && currentSectionIndex > 0) {
            // Swipe right - previous section
            smoothScrollToIndex(currentSectionIndex - 1, 'left');
        }
    }
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
    if (isScrolling) return;
    
    clearTimeout(window.scrollTimeout);
    window.scrollTimeout = setTimeout(() => {
        const scrollLeft = sectionsContainer.scrollLeft;
        const sectionWidth = window.innerWidth;
        const currentIndex = Math.round(scrollLeft / sectionWidth);
        
        if (currentIndex >= 0 && currentIndex < sections.length && currentIndex !== currentSectionIndex) {
            const direction = currentIndex > currentSectionIndex ? 'right' : 'left';
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

// Package Modal Functions
function openPackageModal(packageType) {
    selectedPackage = packageType;
    const modal = document.getElementById('packageModal');

    // Set package details based on type
    setPackageDetails(packageType);

    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
    document.body.style.overflow = 'hidden';
}

function closePackageModal() {
    const modal = document.getElementById('packageModal');
    modal.classList.remove('show');
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
    document.body.style.overflow = 'auto';
    selectedPackage = '';
}

function proceedWithPackage() {
    closePackageModal();

    // Scroll to contact section after a brief delay
    setTimeout(() => {
        scrollToSection('contact');

        // Pre-fill the contact form
        setTimeout(() => {
            const projectTypeField = document.querySelector('input[placeholder="Project Type"]');
            if (projectTypeField) {
                const packageName = document.getElementById('packageName').textContent;
                projectTypeField.value = `${packageName} - Live Recording`;
            }

            // Show success message
            const successMessage = document.createElement('div');
            successMessage.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in';
            successMessage.innerHTML = `<i class="fas fa-check-circle mr-2"></i> ${packageName} selected! Please complete the form below.`;
            document.body.appendChild(successMessage);

            setTimeout(() => {
                successMessage.remove();
            }, 5000);
        }, 500);
    }, 300);
}

// Close modal with Escape key
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        closeVideoModal();
        closePackageModal();
    }
});

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
    if (isMobile() && sectionsContainer) {
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

// Service accordion functionality
document.addEventListener('DOMContentLoaded', function () {
    const accordionHeaders = document.querySelectorAll('.service-accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', function () {
            // Toggle active class on header
            this.classList.toggle('active');
            
            // Get the content element
            const content = this.nextElementSibling;
            
            // Toggle content visibility with animation
            if (content.classList.contains('show')) {
                content.classList.remove('show');
                setTimeout(() => {
                    content.style.display = 'none';
                }, 300);
            } else {
                content.style.display = 'block';
                // Trigger reflow
                content.offsetHeight;
                content.classList.add('show');
            }
            
            // Close other accordions when one opens
            accordionHeaders.forEach(otherHeader => {
                if (otherHeader !== this && otherHeader.classList.contains('active')) {
                    otherHeader.classList.remove('active');
                    const otherContent = otherHeader.nextElementSibling;
                    otherContent.classList.remove('show');
                    setTimeout(() => {
                        otherContent.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
    
    // Initialize all accordion content as hidden
    document.querySelectorAll('.service-accordion-content').forEach(content => {
        content.style.display = 'none';
    });
});

console.log('JavaScript loaded successfully with all features!');
