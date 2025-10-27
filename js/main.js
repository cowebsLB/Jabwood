// Jabwood Website - Main JavaScript

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize mobile menu
    initMobileMenu();
    
    // Initialize animations
    initAnimations();
    
    // Initialize lazy loading for images
    initLazyLoading();
    
    // Initialize statistics counter animation
    initStatCounters();
    
    // Initialize timeline animations
    initTimelineAnimations();
});

// Smooth scroll to next section
function scrollToNext() {
    const nextSection = document.getElementById('company-overview');
    
    if (nextSection) {
        nextSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Make scrollToNext globally available
window.scrollToNext = scrollToNext;

// Mobile Menu Modal Functionality
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileNavModal = document.getElementById('mobile-nav-modal');
    const mobileNavClose = document.getElementById('mobile-nav-close');
    
    if (mobileMenuBtn && mobileNavModal) {
        // Open modal
        mobileMenuBtn.addEventListener('click', function(e) {
            e.preventDefault();
            openMobileNav();
        });
        
        // Close modal with close button
        if (mobileNavClose) {
            mobileNavClose.addEventListener('click', function() {
                closeMobileNav();
            });
        }
        
        // Close modal when clicking on overlay
        mobileNavModal.addEventListener('click', function(e) {
            if (e.target === mobileNavModal) {
                closeMobileNav();
            }
        });
        
        // Close modal when clicking on navigation links
        const mobileNavLinks = mobileNavModal.querySelectorAll('.mobile-nav-menu a');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', function() {
                closeMobileNav();
            });
        });
        
        // Close modal with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && mobileNavModal.classList.contains('active')) {
                closeMobileNav();
            }
        });
    }
}

// Open mobile navigation modal
function openMobileNav() {
    const mobileNavModal = document.getElementById('mobile-nav-modal');
    const body = document.body;
    
    if (mobileNavModal) {
        mobileNavModal.classList.add('active');
        body.classList.add('modal-open');
        
        // Prevent scroll on body
        body.style.overflow = 'hidden';
    }
}

// Close mobile navigation modal
function closeMobileNav() {
    const mobileNavModal = document.getElementById('mobile-nav-modal');
    const body = document.body;
    
    if (mobileNavModal) {
        mobileNavModal.classList.remove('active');
        body.classList.remove('modal-open');
        
        // Restore scroll on body
        body.style.overflow = '';
    }
}

// Animation on Scroll
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all elements with animation classes
    const animatedElements = document.querySelectorAll('.fade-in, .fade-in-delay, .fade-in-delay-2, .fade-in-delay-3, .slide-in-left, .slide-in-right');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// Lazy Loading for Images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Smooth scroll to anchor links
document.addEventListener('click', function(e) {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});

// Add hover effects to product cards
document.addEventListener('DOMContentLoaded', function() {
    const productCards = document.querySelectorAll('.product-card, .card');
    
    productCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});

// Form validation (if contact forms are added later)
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.classList.add('border-red-500');
            isValid = false;
        } else {
            input.classList.remove('border-red-500');
        }
    });
    
    return isValid;
}

// Utility function to debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add scroll-based header background change
const debouncedScrollHandler = debounce(function() {
    const header = document.querySelector('header');
    if (window.scrollY > 100) {
        header.classList.add('bg-opacity-95', 'backdrop-blur-sm');
    } else {
        header.classList.remove('bg-opacity-95', 'backdrop-blur-sm');
    }
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);

// Statistics Counter Animation
function initStatCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    if (statNumbers.length === 0) return;
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };
    
    const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const targetValue = parseInt(target.getAttribute('data-target'));
                const suffix = target.textContent.replace(/[0-9]/g, '');
                
                animateCounter(target, 0, targetValue, 2000, suffix);
                counterObserver.unobserve(target);
            }
        });
    }, observerOptions);
    
    statNumbers.forEach(stat => counterObserver.observe(stat));
}

function animateCounter(element, start, end, duration, suffix = '') {
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(start + (end - start) * easeOutQuart);
        
        element.textContent = current + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = end + suffix;
        }
    }
    
    requestAnimationFrame(update);
}

// Timeline Animations
function initTimelineAnimations() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    if (timelineItems.length === 0) return;
    
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const timelineObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                timelineObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    timelineItems.forEach(item => timelineObserver.observe(item));
}

// Enhanced Scroll Reveal for Premium Cards
function initPremiumCardAnimations() {
    const premiumCards = document.querySelectorAll('.premium-card, .product-card');
    
    if (premiumCards.length === 0) return;
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const cardObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    premiumCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        cardObserver.observe(card);
    });
}

// Initialize premium card animations
document.addEventListener('DOMContentLoaded', function() {
    initPremiumCardAnimations();
});