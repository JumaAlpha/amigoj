// Initialize AOS
AOS.init({
    duration: 800,
    once: true,
    offset: 100
});

class PortfolioManager {
    constructor() {
        this.init();
    }

    init() {
        // DOM Elements
        this.hamburger = document.getElementById('hamburger');
        this.sidebar = document.getElementById('sidebar');
        this.overlay = document.getElementById('overlay');
        this.scrollTop = document.getElementById('scrollTop');
        this.navbar = document.getElementById('navbar');
        this.navContent = document.getElementById('navContent');
        this.loadingBar = document.getElementById('loadingBar');
        
        this.navLinks = document.querySelectorAll('.nav-link');
        this.sections = document.querySelectorAll('.section');
        this.navDots = document.querySelectorAll('.nav-dot');
        this.fadeTexts = document.querySelectorAll('.fade-text');
        this.skillProgresses = document.querySelectorAll('.skill-progress');
        
        // State
        this.currentSectionIndex = 0;
        this.isScrolling = false;
        this.scrollDelay = 150;
        this.scrollThreshold = 0.9;
        
        this.bindEvents();
        this.initLoading();
    }

    bindEvents() {
        // Navigation
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleNavClick(e));
        });

        this.navDots.forEach(dot => {
            dot.addEventListener('click', () => this.handleDotClick(dot));
        });

        // UI Interactions
        this.hamburger?.addEventListener('click', () => this.toggleSidebar(true));
        this.overlay?.addEventListener('click', () => this.toggleSidebar(false));
        this.scrollTop?.addEventListener('click', () => this.scrollToTop());

        // Scroll and touch events
        window.addEventListener('scroll', () => this.handleScroll());
        window.addEventListener('resize', () => this.handleResize());
        document.addEventListener('keydown', (e) => this.handleKeydown(e));
        document.addEventListener('wheel', (e) => this.handleWheel(e), { passive: false });

        // Touch events for mobile
        if (this.isMobile()) {
            this.bindTouchEvents();
        }

        // Contact form
        this.bindContactForm();
    }

    bindTouchEvents() {
        let touchStartX = 0;
        let touchStartY = 0;

        document.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        }, { passive: true });

        document.addEventListener('touchend', (e) => {
            if (!touchStartX) return;

            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            
            const diffX = touchStartX - touchEndX;
            const diffY = touchStartY - touchEndY;

            // Only handle horizontal swipes with minimal vertical movement
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                if (diffX > 0 && this.currentSectionIndex < this.sections.length - 1) {
                    // Swipe left - next section
                    this.setActiveSection(this.currentSectionIndex + 1);
                } else if (diffX < 0 && this.currentSectionIndex > 0) {
                    // Swipe right - previous section
                    this.setActiveSection(this.currentSectionIndex - 1);
                }
            }

            touchStartX = 0;
            touchStartY = 0;
        }, { passive: true });
    }

    bindContactForm() {
        const contactForm = document.querySelector('form');
        if (!contactForm) return;

        contactForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
    }

    initLoading() {
        window.addEventListener('load', () => {
            let width = 1;
            const interval = setInterval(() => {
                if (width >= 100) {
                    clearInterval(interval);
                    this.loadingBar.style.opacity = '0';
                    setTimeout(() => {
                        this.loadingBar.style.display = 'none';
                    }, 300);
                } else {
                    width++;
                    this.loadingBar.style.width = width + '%';
                }
            }, 10);

            // Initialize first section
            this.setActiveSection(0);
        });
    }

    handleNavClick(e) {
        e.preventDefault();
        const sectionId = e.target.getAttribute('data-section');
        this.scrollToSection(sectionId);
        
        if (this.isMobile()) {
            this.toggleSidebar(false);
        }
    }

    handleDotClick(dot) {
        const sectionId = dot.getAttribute('data-section');
        this.scrollToSection(sectionId);
    }

    scrollToSection(sectionId) {
        if (sectionId === 'portfolio') {
            this.openVideoModal();
            return;
        }

        const sectionIndex = Array.from(this.sections).findIndex(
            section => section.id === sectionId
        );
        
        if (sectionIndex !== -1) {
            this.setActiveSection(sectionIndex);
        }
    }

    setActiveSection(index) {
        if (this.isScrolling || index < 0 || index >= this.sections.length) return;

        this.isScrolling = true;
        this.currentSectionIndex = index;

        // Update sections
        this.sections.forEach((section, i) => {
            section.classList.toggle('active', i === index);
            section.classList.toggle('prev', i < index);
            section.classList.toggle('next', i > index);
        });

        // Update navigation
        this.navDots.forEach(dot => {
            const dotSection = dot.getAttribute('data-section');
            dot.classList.toggle('active', 
                this.sections[index].id === dotSection
            );
        });

        this.navLinks.forEach(link => {
            const linkSection = link.getAttribute('data-section');
            link.classList.toggle('active-sidebar-link',
                this.sections[index].id === linkSection
            );
        });

        // Handle section-specific logic
        this.handleSectionActivation(this.sections[index].id);

        // Scroll to section
        this.scrollToSectionElement(index);

        setTimeout(() => {
            this.isScrolling = false;
        }, this.scrollDelay);
    }

    handleSectionActivation(sectionId) {
        // Refresh animations
        AOS.refresh();

        // Animate skill bars in about section
        if (sectionId === 'about') {
            setTimeout(() => {
                this.skillProgresses.forEach(progress => {
                    const width = progress.getAttribute('data-width');
                    progress.style.width = width;
                });
            }, 500);
        }
    }

    scrollToSectionElement(index) {
        const targetSection = this.sections[index];
        if (!targetSection) return;

        targetSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }

    handleScroll() {
        // Navbar scroll effect
        if (window.pageYOffset > 50) {
            this.navbar?.classList.add('navbar-scrolled');
            this.navContent?.classList.remove('mt-6', 'mx-5');
        } else {
            this.navbar?.classList.remove('navbar-scrolled');
            this.navContent?.classList.add('mt-6', 'mx-5');
        }

        // Scroll to top button
        if (this.scrollTop) {
            if (window.pageYOffset > 300) {
                this.scrollTop.classList.add('active');
            } else {
                this.scrollTop.classList.remove('active');
            }
        }

        // Update active section based on scroll position
        this.updateActiveSectionOnScroll();
    }

    updateActiveSectionOnScroll() {
        if (this.isScrolling) return;

        const scrollPosition = window.pageYOffset + window.innerHeight / 3;
        
        this.sections.forEach((section, index) => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                if (index !== this.currentSectionIndex) {
                    this.setActiveSection(index);
                }
            }
        });
    }

    handleWheel(e) {
        if (this.isMobile() || this.isScrolling) return;

        e.preventDefault();

        if (e.deltaY > 50 && this.currentSectionIndex < this.sections.length - 1) {
            // Scroll down - next section
            this.setActiveSection(this.currentSectionIndex + 1);
        } else if (e.deltaY < -50 && this.currentSectionIndex > 0) {
            // Scroll up - previous section
            this.setActiveSection(this.currentSectionIndex - 1);
        }
    }

    handleKeydown(e) {
        switch(e.key) {
            case 'ArrowDown':
            case 'ArrowRight':
            case 'PageDown':
                e.preventDefault();
                if (this.currentSectionIndex < this.sections.length - 1) {
                    this.setActiveSection(this.currentSectionIndex + 1);
                }
                break;
                
            case 'ArrowUp':
            case 'ArrowLeft':
            case 'PageUp':
                e.preventDefault();
                if (this.currentSectionIndex > 0) {
                    this.setActiveSection(this.currentSectionIndex - 1);
                }
                break;
                
            case 'Home':
                e.preventDefault();
                this.setActiveSection(0);
                break;
                
            case 'End':
                e.preventDefault();
                this.setActiveSection(this.sections.length - 1);
                break;
                
            case 'Escape':
                this.closeVideoModal();
                this.toggleSidebar(false);
                break;
        }
    }

    handleResize() {
        AOS.refresh();
        
        // Re-initialize touch events if switching between mobile/desktop
        if (this.isMobile()) {
            this.bindTouchEvents();
        }
    }

    handleFormSubmit(e) {
        e.preventDefault();
        
        const button = e.target.querySelector('button');
        const originalHTML = button.innerHTML;

        button.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Sending...';
        button.disabled = true;

        // Simulate form submission
        setTimeout(() => {
            button.innerHTML = '<i class="fas fa-check mr-2"></i>Message Sent!';

            setTimeout(() => {
                button.innerHTML = originalHTML;
                button.disabled = false;
                e.target.reset();
            }, 2000);
        }, 1500);
    }

    toggleSidebar(show) {
        if (!this.sidebar || !this.overlay) return;

        if (show) {
            this.sidebar.style.right = '0';
            this.overlay.style.opacity = '1';
            this.overlay.style.visibility = 'visible';
        } else {
            this.sidebar.style.right = '-420px';
            this.overlay.style.opacity = '0';
            this.overlay.style.visibility = 'hidden';
        }
    }

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    openVideoModal() {
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

    closeVideoModal() {
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

    isMobile() {
        return window.innerWidth <= 768;
    }
}

// Text rotation animation
class TextRotator {
    constructor() {
        this.fadeTexts = document.querySelectorAll('.fade-text');
        this.currentIndex = 0;
        
        if (this.fadeTexts.length > 0) {
            this.init();
        }
    }

    init() {
        this.rotateText();
        setInterval(() => this.rotateText(), 3000);
    }

    rotateText() {
        this.fadeTexts.forEach(text => {
            text.classList.remove('active');
        });
        
        this.fadeTexts[this.currentIndex].classList.add('active');
        this.currentIndex = (this.currentIndex + 1) % this.fadeTexts.length;
    }
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioManager();
    new TextRotator();
    
    // Enhanced animations for elements
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('.project-card, .glass-effect').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

console.log('Enhanced Portfolio Manager loaded successfully!');