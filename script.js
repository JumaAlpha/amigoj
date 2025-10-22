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

// Swiper and scrolling variables
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
let isMobile = false;

// Initialize horizontal scrolling with Swiper for mobile only
function initHorizontalScroll() {
    sectionsContainer = document.querySelector('.sections-container');
    
    if (!sectionsContainer) return;

    // Check if mobile
    isMobile = window.innerWidth < 1024;

    if (isMobile) {
        initSwiperMobile();
    } else {
        initCustomDesktopScrolling();
    }
}

// Initialize Swiper for mobile devices
function initSwiperMobile() {
    console.log('Initializing Swiper for mobile');
    
    // Add Swiper CSS classes
    sectionsContainer.classList.add('swiper');
    
    // Wrap sections in swiper-wrapper if not already done
    const sectionElements = sectionsContainer.querySelectorAll('.section');
    if (!sectionsContainer.querySelector('.swiper-wrapper')) {
        const wrapper = document.createElement('div');
        wrapper.className = 'swiper-wrapper';
        
        sectionElements.forEach(section => {
            section.classList.add('swiper-slide');
            wrapper.appendChild(section);
        });
        
        sectionsContainer.innerHTML = '';
        sectionsContainer.appendChild(wrapper);
    }

    // Initialize Swiper
    const swiper = new Swiper('.sections-container', {
        direction: 'horizontal',
        slidesPerView: 1,
        speed: 800,
        mousewheel: {
            forceToAxis: true,
            sensitivity: 1,
        },
        keyboard: {
            enabled: true,
            onlyInViewport: true,
        },
        touchRatio: 1,
        threshold: 10,
        resistance: true,
        resistanceRatio: 0.85,
        followFinger: true,
        shortSwipes: true,
        longSwipes: true,
        slideToClickedSlide: false,
        freeMode: false,
        simulateTouch: true,
        
        on: {
            init: function () {
                setActiveSection('home');
                console.log('Swiper initialized successfully');
            },
            slideChange: function () {
                const activeIndex = this.activeIndex;
                const activeSlide = this.slides[activeIndex];
                if (activeSlide) {
                    const sectionId = activeSlide.id;
                    setActiveSection(sectionId);
                    currentSectionIndex = activeIndex;
                }
            },
            resize: function () {
                AOS.refresh();
            },
            transitionEnd: function () {
                // Refresh AOS after transition
                AOS.refresh();
            }
        }
    });

    // Store swiper instance globally
    window.sectionsSwiper = swiper;
}

// Initialize custom scrolling for desktop
function initCustomDesktopScrolling() {
    console.log('Initializing custom scrolling for desktop');
    
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

// Custom desktop scrolling functions
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

function handleTouchStart(e) {
    if (isMobile) return;
    e.preventDefault();
    startDrag(e.touches[0].clientX);
}

function handleTouchMove(e) {
    if (isMobile || !isDragging) return;
    e.preventDefault();
    updateDragPosition(e.touches[0].clientX);
}

function handleTouchEnd() {
    if (isMobile || !isDragging) return;
    endDrag();
}

function handleMouseDown(e) {
    if (isMobile) return;
    e.preventDefault();
    startDrag(e.clientX);
    sectionsContainer.style.cursor = 'grabbing';
}

function handleMouseMove(e) {
    if (isMobile || !isDragging) return;
    e.preventDefault();
    updateDragPosition(e.clientX);
}

function handleMouseUp() {
    if (isMobile || !isDragging) return;
    endDrag();
    sectionsContainer.style.cursor = 'grab';
}

function startDrag(clientX) {
    isDragging = true;
    startX = clientX;
    currentX = clientX;
    lastX = clientX;
    lastTime = Date.now();
    velocity = 0;
    
    cancelAnimationFrame(rafID);
    sectionsContainer.style.scrollBehavior = 'auto';
}

function updateDragPosition(clientX) {
    if (!isDragging) return;
    
    currentX = clientX;
    
    if (!rafID) {
        rafID = requestAnimationFrame(updateScrollPosition);
    }
}

function updateScrollPosition() {
    if (!isDragging) return;
    
    const diff = currentX - startX;
    const scrollLeft = sectionsContainer.scrollLeft;
    
    const currentTime = Date.now();
    const deltaTime = Math.max(currentTime - lastTime, 1);
    const deltaX = currentX - lastX;
    
    velocity = deltaX / deltaTime;
    lastX = currentX;
    lastTime = currentTime;
    
    sectionsContainer.scrollLeft = scrollLeft - diff * 0.8;
    
    rafID = requestAnimationFrame(updateScrollPosition);
}

function endDrag() {
    if (!isDragging) return;
    
    isDragging = false;
    cancelAnimationFrame(rafID);
    rafID = null;
    
    const diff = currentX - startX;
    const absVelocity = Math.abs(velocity);
    
    if (absVelocity > 0.5) {
        const momentum = velocity * 100;
        const currentScroll = sectionsContainer.scrollLeft;
        sectionsContainer.scrollLeft = currentScroll - momentum;
    }
    
    sectionsContainer.style.scrollBehavior = 'smooth';
    sectionsContainer.style.cursor = '';
    
    setTimeout(snapToNearestSection, 100);
}

function snapToNearestSection() {
    const scrollLeft = sectionsContainer.scrollLeft;
    const sectionWidth = window.innerWidth;
    const currentIndex = Math.round(scrollLeft / sectionWidth);
    
    if (currentIndex >= 0 && currentIndex < sections.length) {
        smoothScrollToIndex(currentIndex);
    }
}

function setupScrollEvents() {
    if (!sectionsContainer) return;

    sectionsContainer.addEventListener('scroll', handleScroll, { passive: true });
}

function handleScroll() {
    if (isDragging || isScrolling || isMobile) return;
    
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

// Universal functions that work with both systems
function smoothScrollToIndex(index) {
    if (isScrolling || index < 0 || index >= sections.length) return;
    
    if (window.sectionsSwiper && isMobile) {
        // Using Swiper (mobile)
        window.sectionsSwiper.slideTo(index);
    } else if (sectionsContainer) {
        // Using custom scrolling (desktop)
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
}

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
    
    cards.forEach((card, index) => {
        card.classList.remove('card-slide-in', 'card-slide-up');
        void card.offsetWidth;
        
        setTimeout(() => {
            card.classList.add(index % 2 === 0 ? 'card-slide-in' : 'card-slide-up');
        }, index * 100);
    });
    
    if (profile) {
        profile.classList.remove('profile-slide-in');
        void profile.offsetWidth;
        setTimeout(() => {
            profile.classList.add('profile-slide-in');
        }, 200);
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

// Mouse wheel navigation for desktop only
document.addEventListener('wheel', function (e) {
    // Only handle wheel events on desktop (when Swiper isn't active)
    if (isMobile) return;
    
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

// Enhanced keyboard navigation (works for both)
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

// Handle window resize and orientation changes
window.addEventListener('resize', function () {
    AOS.refresh();
    
    const newIsMobile = window.innerWidth < 1024;
    
    // Reinitialize if switching between mobile/desktop
    if (newIsMobile !== isMobile) {
        console.log('Device type changed, reinitializing scrolling...');
        
        // Cleanup
        if (window.sectionsSwiper) {
            window.sectionsSwiper.destroy(true, true);
            window.sectionsSwiper = null;
        }
        
        // Remove Swiper classes
        if (sectionsContainer) {
            sectionsContainer.classList.remove('swiper');
            const wrapper = sectionsContainer.querySelector('.swiper-wrapper');
            if (wrapper) {
                // Restore original structure
                const slides = wrapper.querySelectorAll('.swiper-slide');
                slides.forEach(slide => {
                    slide.classList.remove('swiper-slide');
                    sectionsContainer.appendChild(slide);
                });
                wrapper.remove();
            }
        }
        
        // Reinitialize
        initHorizontalScroll();
    } else if (sectionsContainer && !isMobile) {
        // Update scroll position on desktop resize
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