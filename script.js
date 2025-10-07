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

// Enhanced scroll variables
let wheelTimeout;
let isScrolling = false;
let touchStartX = 0;
let touchEndX = 0;
let touchStartY = 0;
let touchEndY = 0;
let scrollStartX = 0;
let isHorizontalScroll = false;
let currentScrollLeft = 0;
const SCROLL_THRESHOLD = 0.9; // 90% threshold

// Check if mobile device
function isMobile() {
    return window.innerWidth <= 768;
}

// Enhanced section management with smooth transitions
function setActiveSection(sectionId) {
    console.log('Activating section:', sectionId);

    // Remove active class from all sections
    sections.forEach(section => {
        section.classList.remove('active');
    });

    // Add active class to target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
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

    // Enhanced scroll to section with smooth behavior
    const targetIndex = Array.from(sections).indexOf(targetSection);
    const sectionsContainer = document.querySelector('.sections-container');
    if (sectionsContainer && targetIndex >= 0) {
        const scrollPosition = targetIndex * window.innerWidth;
        
        sectionsContainer.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
        });
        
        // Update current scroll position
        currentScrollLeft = scrollPosition;
    }
    
    updateSectionPositions();
}

// Enhanced section position updates
function updateSectionPositions() {
    const allSections = Array.from(sections);
    const activeSection = document.querySelector('.section.active');
    const activeIndex = allSections.indexOf(activeSection);

    allSections.forEach((section, index) => {
        section.classList.remove('prev', 'next');
        if (index < activeIndex) {
            section.classList.add('prev');
        } else if (index > activeIndex) {
            section.classList.add('next');
        }
    });
}

// Enhanced scroll to section function
function scrollToSection(sectionId) {
    if (sectionId === 'portfolio') {
        openVideoModal();
        return;
    }
    setActiveSection(sectionId);

    // Close sidebar on mobile
    if (window.innerWidth < 1024) {
        sidebar.style.right = '-420px';
        overlay.style.opacity = '0';
        overlay.style.visibility = 'hidden';
    }
}

// Enhanced loading animation
window.addEventListener('load', function () {
    console.log('Page loaded, initializing enhanced scroll...');

    let width = 1;
    const interval = setInterval(function () {
        if (width >= 100) {
            clearInterval(interval);
            loadingBar.style.opacity = '0';
            setTimeout(() => loadingBar.style.display = 'none', 300);
            
            // Initialize enhanced scroll container
            initializeEnhancedScroll();
        } else {
            width++;
            loadingBar.style.width = width + '%';
        }
    }, 10);

    // Initialize first section
    const allSections = Array.from(sections);
    allSections.forEach((section, index) => {
        section.classList.remove('active', 'prev', 'next');
        if (index === 0) {
            section.classList.add('active');
        }
    });

    // Specifically activate home section
    setActiveSection('home');
});

// Enhanced scroll container initialization
function initializeEnhancedScroll() {
    const sectionsContainer = document.querySelector('.sections-container');
    if (!sectionsContainer) return;

    // Set initial scroll position
    sectionsContainer.scrollLeft = 0;
    currentScrollLeft = 0;

    // Enhanced scroll event with threshold detection
    sectionsContainer.addEventListener('scroll', function() {
        clearTimeout(wheelTimeout);
        
        const scrollLeft = sectionsContainer.scrollLeft;
        const sectionWidth = window.innerWidth;
        const currentIndex = Math.floor(scrollLeft / sectionWidth);
        const scrollProgress = (scrollLeft % sectionWidth) / sectionWidth;
        
        // Determine scroll direction
        const isScrollingRight = scrollLeft > currentScrollLeft;
        currentScrollLeft = scrollLeft;
        
        // Check if we've passed the 90% threshold
        if (isScrollingRight && scrollProgress > SCROLL_THRESHOLD) {
            // Moving to next section
            if (currentIndex < sections.length - 1) {
                setActiveSection(sections[currentIndex + 1].id);
            }
        } else if (!isScrollingRight && scrollProgress < (1 - SCROLL_THRESHOLD)) {
            // Moving to previous section
            if (currentIndex > 0) {
                setActiveSection(sections[currentIndex - 1].id);
            }
        }
        
        wheelTimeout = setTimeout(function() {
            // Snap to nearest section after scrolling stops
            const nearestIndex = Math.round(scrollLeft / sectionWidth);
            if (nearestIndex >= 0 && nearestIndex < sections.length) {
                setActiveSection(sections[nearestIndex].id);
            }
        }, 150);
    });
}

// Enhanced touch handling for horizontal scroll
document.addEventListener('touchstart', function (e) {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
    scrollStartX = currentScrollLeft;
    isHorizontalScroll = false;
});

document.addEventListener('touchmove', function (e) {
    if (!isMobile()) return;

    const touchX = e.changedTouches[0].screenX;
    const touchY = e.changedTouches[0].screenY;
    
    // Determine if this is primarily a horizontal scroll
    const deltaX = Math.abs(touchX - touchStartX);
    const deltaY = Math.abs(touchY - touchStartY);
    
    if (deltaX > deltaY && !isHorizontalScroll) {
        isHorizontalScroll = true;
    }
    
    if (isHorizontalScroll) {
        e.preventDefault();
        
        const sectionsContainer = document.querySelector('.sections-container');
        if (sectionsContainer) {
            const scrollDelta = touchStartX - touchX;
            sectionsContainer.scrollLeft = scrollStartX + scrollDelta;
        }
    }
}, { passive: false });

document.addEventListener('touchend', function (e) {
    if (!isMobile() || !isHorizontalScroll) return;

    touchEndX = e.changedTouches[0].screenX;
    const swipeDistance = touchStartX - touchEndX;
    const sectionWidth = window.innerWidth;
    const threshold = sectionWidth * 0.3; // 30% of screen width

    if (Math.abs(swipeDistance) > threshold) {
        const currentSection = document.querySelector('.section.active');
        const currentIndex = Array.from(sections).indexOf(currentSection);

        if (swipeDistance > 0 && currentIndex < sections.length - 1) {
            // Swipe left - next section
            setActiveSection(sections[currentIndex + 1].id);
        } else if (swipeDistance < 0 && currentIndex > 0) {
            // Swipe right - previous section
            setActiveSection(sections[currentIndex - 1].id);
        } else {
            // Return to current section
            setActiveSection(sections[currentIndex].id);
        }
    } else {
        // Return to current section if swipe wasn't significant
        const currentSection = document.querySelector('.section.active');
        const currentIndex = Array.from(sections).indexOf(currentSection);
        setActiveSection(sections[currentIndex].id);
    }
    
    isHorizontalScroll = false;
});

// Enhanced mouse wheel navigation for desktop
document.addEventListener('wheel', function (e) {
    if (isMobile()) return;

    e.preventDefault();

    if (isScrolling) return;
    isScrolling = true;

    const sectionsContainer = document.querySelector('.sections-container');
    if (sectionsContainer) {
        const delta = e.deltaY;
        const currentScroll = sectionsContainer.scrollLeft;
        const sectionWidth = window.innerWidth;
        
        // Smooth scroll with momentum
        sectionsContainer.scrollBy({
            left: delta * 2,
            behavior: 'smooth'
        });
    }

    setTimeout(() => {
        isScrolling = false;
    }, 800);
}, { passive: false });

// Enhanced navbar scroll effect
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
        sidebar.style.right = '-420px';
        overlay.style.opacity = '0';
        overlay.style.visibility = 'hidden';
    });
}

// Scroll to top functionality
if (scrollTop) {
    scrollTop.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
        setActiveSection(sectionId);
    });
});

// Sidebar navigation
navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        const sectionId = this.getAttribute('data-section');
        setActiveSection(sectionId);

        // Close sidebar on mobile
        if (window.innerWidth < 1024) {
            sidebar.style.right = '-420px';
            overlay.style.opacity = '0';
            overlay.style.visibility = 'hidden';
        }
    });
});

// Enhanced keyboard navigation
document.addEventListener('keydown', function (e) {
    const currentSection = document.querySelector('.section.active');
    const currentIndex = Array.from(sections).indexOf(currentSection);

    if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === 'PageDown') {
        e.preventDefault();
        if (currentIndex < sections.length - 1) {
            setActiveSection(sections[currentIndex + 1].id);
        }
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        if (currentIndex > 0) {
            setActiveSection(sections[currentIndex - 1].id);
        }
    } else if (e.key === 'Home') {
        e.preventDefault();
        setActiveSection('home');
    } else if (e.key === 'End') {
        e.preventDefault();
        setActiveSection('contact');
    }
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
    // Reset scroll positions on resize
    const activeSection = document.querySelector('.section.active');
    if (activeSection) {
        setActiveSection(activeSection.id);
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

// Enhanced animations for elements
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

// Enhanced debug function
function debugSections() {
    console.log('=== ENHANCED SECTION STATES ===');
    sections.forEach((section, index) => {
        console.log(`Section ${index} (${section.id}):`, {
            active: section.classList.contains('active'),
            prev: section.classList.contains('prev'),
            next: section.classList.contains('next'),
            visible: section.getBoundingClientRect().width > 0
        });
    });
    
    const sectionsContainer = document.querySelector('.sections-container');
    if (sectionsContainer) {
        console.log('Scroll position:', sectionsContainer.scrollLeft);
        console.log('Current scroll left:', currentScrollLeft);
    }
    console.log('===============================');
}

console.log('Enhanced JavaScript loaded successfully!');