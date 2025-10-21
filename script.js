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
let isScrolling = false;
let touchStartX = 0;
let touchEndX = 0;
let scrollTimeout;

// Check if mobile device
function isMobile() {
    return window.innerWidth <= 768;
}

// Smooth scroll to section
function smoothScrollToSection(sectionId) {
    if (isScrolling) return;
    
    const targetSection = document.getElementById(sectionId);
    if (!targetSection) return;

    isScrolling = true;

    if (isMobile()) {
        // Mobile: Use horizontal scroll with smooth behavior
        const sectionsContainer = document.querySelector('.sections-container');
        const sectionIndex = Array.from(sections).indexOf(targetSection);
        
        if (sectionsContainer && sectionIndex >= 0) {
            sectionsContainer.scrollTo({
                left: sectionIndex * window.innerWidth,
                behavior: 'smooth'
            });
        }
        
        // Set active section after scroll
        setTimeout(() => {
            setActiveSection(sectionId);
            isScrolling = false;
        }, 300);
    } else {
        // Desktop: Use vertical scroll
        targetSection.scrollIntoView({ behavior: 'smooth' });
        setActiveSection(sectionId);
        setTimeout(() => {
            isScrolling = false;
        }, 800);
    }
}

// Set active section
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
}

// Scroll to section function
function scrollToSection(sectionId) {
    if (sectionId === 'portfolio') {
        openVideoModal();
        return;
    }
    smoothScrollToSection(sectionId);

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

    // Initialize first section
    sections.forEach((section, index) => {
        section.classList.remove('active');
        if (index === 0) {
            section.classList.add('active');
        }
    });

    // Specifically activate home section
    setActiveSection('home');
});

// Navbar scroll effect
window.addEventListener('scroll', function () {
    if (isMobile()) return; // Don't affect navbar on mobile horizontal scroll
    
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
        smoothScrollToSection(sections[currentIndex + 1].id);
    } else if (!isScrollingDown && currentIndex > 0) {
        smoothScrollToSection(sections[currentIndex - 1].id);
    }

    setTimeout(() => {
        isScrolling = false;
    }, 800);
}, { passive: false });

// Enhanced Touch navigation for mobile with smooth scrolling
document.addEventListener('touchstart', function (e) {
    if (!isMobile()) return;
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', function (e) {
    if (!isMobile()) return;

    touchEndX = e.changedTouches[0].screenX;
    const swipeThreshold = 50;
    const swipeDistance = touchEndX - touchStartX;

    if (Math.abs(swipeDistance) > swipeThreshold && !isScrolling) {
        const currentSection = document.querySelector('.section.active');
        const currentIndex = Array.from(sections).indexOf(currentSection);

        if (swipeDistance < 0 && currentIndex < sections.length - 1) {
            // Swipe left - next section
            smoothScrollToSection(sections[currentIndex + 1].id);
        } else if (swipeDistance > 0 && currentIndex > 0) {
            // Swipe right - previous section
            smoothScrollToSection(sections[currentIndex - 1].id);
        }
    }
});

// Mobile scroll detection for updating active section
if (isMobile()) {
    const sectionsContainer = document.querySelector('.sections-container');
    if (sectionsContainer) {
        sectionsContainer.addEventListener('scroll', function () {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(function () {
                const scrollLeft = sectionsContainer.scrollLeft;
                const sectionWidth = window.innerWidth;
                const currentIndex = Math.round(scrollLeft / sectionWidth);

                if (currentIndex >= 0 && currentIndex < sections.length && !isScrolling) {
                    setActiveSection(sections[currentIndex].id);
                }
            }, 100);
        });
    }
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
        smoothScrollToSection(sectionId);
    });
});

// Sidebar navigation
navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        const sectionId = this.getAttribute('data-section');
        smoothScrollToSection(sectionId);

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
    if (isScrolling) return;
    
    const currentSection = document.querySelector('.section.active');
    const currentIndex = Array.from(sections).indexOf(currentSection);

    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        if (currentIndex < sections.length - 1) {
            smoothScrollToSection(sections[currentIndex + 1].id);
        }
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        if (currentIndex > 0) {
            smoothScrollToSection(sections[currentIndex - 1].id);
        }
    } else if (e.key === 'Home') {
        e.preventDefault();
        smoothScrollToSection('home');
    } else if (e.key === 'End') {
        e.preventDefault();
        smoothScrollToSection('contact');
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

// Enhanced mobile scrolling with momentum
if (isMobile()) {
    const sectionsContainer = document.querySelector('.sections-container');
    if (sectionsContainer) {
        let startX = 0;
        let scrollLeft = 0;
        let isDragging = false;

        sectionsContainer.addEventListener('touchstart', (e) => {
            isDragging = true;
            startX = e.touches[0].pageX;
            scrollLeft = sectionsContainer.scrollLeft;
        }, { passive: true });

        sectionsContainer.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.touches[0].pageX;
            const walk = (x - startX);
            sectionsContainer.scrollLeft = scrollLeft - walk;
        }, { passive: false });

        sectionsContainer.addEventListener('touchend', () => {
            isDragging = false;
            
            // Snap to nearest section
            const scrollLeft = sectionsContainer.scrollLeft;
            const sectionWidth = window.innerWidth;
            const currentIndex = Math.round(scrollLeft / sectionWidth);
            
            if (currentIndex >= 0 && currentIndex < sections.length) {
                smoothScrollToSection(sections[currentIndex].id);
            }
        });
    }
}

console.log('JavaScript loaded successfully with enhanced mobile scrolling!');
