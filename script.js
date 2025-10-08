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

// Scroll navigation variables
let wheelTimeout;
let isScrolling = false;
let touchStartX = 0;
let touchEndX = 0;

// Check if mobile device
function isMobile() {
    return window.innerWidth <= 768;
}

// SIMPLE SECTION MANAGEMENT - This will fix the visibility issue
// FIXED SECTION MANAGEMENT
// FIXED SECTION MANAGEMENT
// SIMPLIFIED SECTION MANAGEMENT
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

    // Scroll to section (for both desktop and mobile)
    const targetIndex = Array.from(sections).indexOf(targetSection);
    const sectionsContainer = document.querySelector('.sections-container');
    if (sectionsContainer && targetIndex >= 0) {
        sectionsContainer.scrollTo({
            left: targetIndex * window.innerWidth,
            behavior: 'smooth'
        });
    }
}// Helper function to update section positions
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
// Scroll to section function
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

    // Initialize first section and set up all section positions
    const allSections = Array.from(sections);
    allSections.forEach((section, index) => {
        section.classList.remove('active', 'prev', 'next');
        if (index === 0) {
            section.classList.add('active');
        } else if (index < 0) {
            section.classList.add('prev');
        } else {
            section.classList.add('next');
        }
    });

    // Specifically activate home section
    setActiveSection('home');
});

// Update positions on resize
window.addEventListener('resize', function () {
    AOS.refresh();
    updateSectionPositions();
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
        sidebar.style.right = '-420px';
        overlay.style.opacity = '0';
        overlay.style.visibility = 'hidden';
    });
}

// Debug function to check section states
function debugSections() {
    console.log('=== SECTION STATES ===');
    sections.forEach((section, index) => {
        console.log(`Section ${index} (${section.id}):`, {
            active: section.classList.contains('active'),
            prev: section.classList.contains('prev'),
            next: section.classList.contains('next'),
            transform: section.style.transform
        });
    });
    console.log('======================');
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

// Mouse wheel navigation for desktop
document.addEventListener('wheel', function (e) {
    if (isMobile()) return;

    e.preventDefault();

    if (isScrolling) return;
    isScrolling = true;

    const currentSection = document.querySelector('.section.active');
    const currentIndex = Array.from(sections).indexOf(currentSection);
    const isScrollingDown = e.deltaY > 0;

    if (isScrollingDown && currentIndex < sections.length - 1) {
        setActiveSection(sections[currentIndex + 1].id);
    } else if (!isScrollingDown && currentIndex > 0) {
        setActiveSection(sections[currentIndex - 1].id);
    }

    setTimeout(() => {
        isScrolling = false;
    }, 800);
}, { passive: false });

// Touch navigation for mobile
document.addEventListener('touchstart', function (e) {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', function (e) {
    if (!isMobile()) return;

    touchEndX = e.changedTouches[0].screenX;
    const swipeThreshold = 50;
    const swipeDistance = touchEndX - touchStartX;

    if (Math.abs(swipeDistance) > swipeThreshold) {
        const currentSection = document.querySelector('.section.active');
        const currentIndex = Array.from(sections).indexOf(currentSection);

        if (swipeDistance < 0 && currentIndex < sections.length - 1) {
            // Swipe left - next section
            setActiveSection(sections[currentIndex + 1].id);
        } else if (swipeDistance > 0 && currentIndex > 0) {
            // Swipe right - previous section
            setActiveSection(sections[currentIndex - 1].id);
        }
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

// Keyboard navigation
document.addEventListener('keydown', function (e) {
    const currentSection = document.querySelector('.section.active');
    const currentIndex = Array.from(sections).indexOf(currentSection);

    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        if (currentIndex < sections.length - 1) {
            setActiveSection(sections[currentIndex + 1].id);
        }
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
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

// Mobile scroll handling
if (isMobile()) {
    const sectionsContainer = document.querySelector('.sections-container');
    if (sectionsContainer) {
        sectionsContainer.addEventListener('scroll', function () {
            clearTimeout(wheelTimeout);
            wheelTimeout = setTimeout(function () {
                const scrollLeft = sectionsContainer.scrollLeft;
                const sectionWidth = window.innerWidth;
                const currentIndex = Math.round(scrollLeft / sectionWidth);

                if (currentIndex >= 0 && currentIndex < sections.length) {
                    setActiveSection(sections[currentIndex].id);
                }
            }, 100);
        });
    }
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

// Add this to your existing JavaScript
class ServicesCarousel {
    constructor() {
        this.track = document.querySelector('.services-carousel-track');
        this.dots = document.querySelectorAll('.service-dot');
        this.cards = document.querySelectorAll('.services-carousel-track .project-card');
        this.currentIndex = 0;
        
        if (this.track) {
            this.init();
        }
    }

    init() {
        this.bindEvents();
        this.updateDots();
    }

    bindEvents() {
        // Dot navigation
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.scrollToIndex(index);
            });
        });

        // Scroll event to update dots
        this.track.addEventListener('scroll', () => {
            this.updateActiveDot();
        });

        // Touch/swipe support
        let startX = 0;
        let scrollLeft = 0;

        this.track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].pageX;
            scrollLeft = this.track.scrollLeft;
        }, { passive: true });

        this.track.addEventListener('touchmove', (e) => {
            if (!startX) return;
            const x = e.touches[0].pageX;
            const walk = (x - startX) * 2;
            this.track.scrollLeft = scrollLeft - walk;
        }, { passive: true });
    }

    scrollToIndex(index) {
        if (index < 0 || index >= this.cards.length) return;
        
        const card = this.cards[index];
        const container = this.track.getBoundingClientRect();
        const cardRect = card.getBoundingClientRect();
        
        this.track.scrollTo({
            left: this.track.scrollLeft + (cardRect.left - container.left) - (container.width - cardRect.width) / 2,
            behavior: 'smooth'
        });
        
        this.currentIndex = index;
        this.updateDots();
    }

    updateActiveDot() {
        const container = this.track.getBoundingClientRect();
        let closestIndex = 0;
        let closestDistance = Infinity;

        this.cards.forEach((card, index) => {
            const cardRect = card.getBoundingClientRect();
            const distance = Math.abs(cardRect.left - container.left);
            
            if (distance < closestDistance) {
                closestDistance = distance;
                closestIndex = index;
            }
        });

        this.currentIndex = closestIndex;
        this.updateDots();
    }

    updateDots() {
        this.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });
    }
}

// Initialize the carousel
document.addEventListener('DOMContentLoaded', () => {
    new ServicesCarousel();
});

console.log('JavaScript loaded successfully!');