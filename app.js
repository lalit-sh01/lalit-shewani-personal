// Sophisticated Personal Branding Website JavaScript
// Author: Lalit Shewani

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initializeNavigation();
    initializeScrollAnimations();
    initializeFormHandlers();
    initializeSmoothScrolling();
    initializeActiveNavigation();
    initializeLoadingAnimations();
});

// Navigation Functionality
function initializeNavigation() {
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    if (mobileMenu) {
        mobileMenu.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = 'auto';
            }
        });
    }

    // Close mobile menu when clicking on nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.nav-container') && navMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });

    // Navbar background on scroll
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.nav');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(26, 26, 31, 0.95)';
            navbar.style.backdropFilter = 'blur(20px)';
        } else {
            navbar.style.background = 'rgba(26, 26, 31, 0.9)';
            navbar.style.backdropFilter = 'blur(20px)';
        }
    });
}

// Smooth Scrolling for Navigation Links
function initializeSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerOffset = 80;
                const elementPosition = targetSection.offsetTop;
                const offsetPosition = elementPosition - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Active Navigation Highlighting
function initializeActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    function highlightNavigation() {
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', highlightNavigation);
}

// Scroll-triggered Animations using Intersection Observer
function initializeScrollAnimations() {
    const animatedElements = document.querySelectorAll('.glass-card, .timeline-item, .stat-card, .skill-category');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-on-scroll');
                setTimeout(() => {
                    entry.target.classList.add('animated');
                }, Math.random() * 300);
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });

    // Hero section animation on load
    setTimeout(() => {
        const heroElements = document.querySelectorAll('.hero-title, .hero-subtitle, .hero-cta, .profile-card');
        heroElements.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add('fade-in-up');
            }, index * 200);
        });
    }, 300);
}

// Form Handling
function initializeFormHandlers() {
    // Contact Form
    const contactForm = document.querySelector('.contact-form .form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactFormSubmit);
    }
    
    // Newsletter Signup
    const newsletterForm = document.querySelector('.newsletter-signup');
    if (newsletterForm) {
        const newsletterBtn = newsletterForm.querySelector('.btn-primary');
        const emailInput = newsletterForm.querySelector('.email-input');
        
        if (newsletterBtn && emailInput) {
            newsletterBtn.addEventListener('click', handleNewsletterSignup);
            emailInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    handleNewsletterSignup(e);
                }
            });
        }
    }
}

// Contact Form Submit Handler
function handleContactFormSubmit(e) {
    e.preventDefault();
    
    const submitButton = e.target.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    // Show loading state
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    submitButton.classList.add('loading');
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        // Show success message
        showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
        
        // Reset form
        e.target.reset();
        
        // Reset button
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        submitButton.classList.remove('loading');
    }, 2000);
}

// Newsletter Signup Handler
function handleNewsletterSignup(e) {
    e.preventDefault();
    
    const emailInput = document.querySelector('.newsletter-signup .email-input');
    const button = e.target.closest('.btn-primary') || e.target;
    const email = emailInput.value.trim();
    
    if (!email) {
        showNotification('Please enter your email address.', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address.', 'error');
        return;
    }
    
    const originalText = button.textContent;
    
    // Show loading state
    button.textContent = 'Subscribing...';
    button.disabled = true;
    button.classList.add('loading');
    
    // Simulate API call
    setTimeout(() => {
        showNotification('Successfully subscribed to newsletter!', 'success');
        emailInput.value = '';
        
        // Reset button
        button.textContent = originalText;
        button.disabled = false;
        button.classList.remove('loading');
    }, 1500);
}

// Email Validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // Add notification styles
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 100px;
            right: 20px;
            background: rgba(26, 26, 31, 0.95);
            backdrop-filter: blur(20px);
            border-radius: 12px;
            padding: 16px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            max-width: 400px;
            transform: translateX(450px);
            transition: transform 0.3s ease;
            border-left: 4px solid var(--accent-cyan);
        }
        
        .notification--success {
            border-left-color: #10B981;
        }
        
        .notification--error {
            border-left-color: #F59E0B;
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
        }
        
        .notification-message {
            color: #F8F9FA;
            font-size: 14px;
            line-height: 1.4;
        }
        
        .notification-close {
            background: none;
            border: none;
            color: #8B8B8B;
            font-size: 20px;
            cursor: pointer;
            padding: 0;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: all 0.2s ease;
        }
        
        .notification-close:hover {
            background: rgba(255, 255, 255, 0.1);
            color: #F8F9FA;
        }
    `;
    
    if (!document.querySelector('style[data-notification-styles]')) {
        style.setAttribute('data-notification-styles', 'true');
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.style.transform = 'translateX(450px)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
}

// Loading Animations for Interactive Elements
function initializeLoadingAnimations() {
    // Add hover effects to skill tags
    const skillTags = document.querySelectorAll('.skill-tag');
    skillTags.forEach(tag => {
        tag.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.05)';
        });
        
        tag.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Add click effects to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            // Create ripple effect
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = (event.clientX - rect.left - size / 2) + 'px';
            ripple.style.top = (event.clientY - rect.top - size / 2) + 'px';
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 1000);
        });
    });
    
    // Add ripple effect styles
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        .btn {
            position: relative;
            overflow: hidden;
        }
        
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
            pointer-events: none;
        }
        
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    
    if (!document.querySelector('style[data-ripple-styles]')) {
        rippleStyle.setAttribute('data-ripple-styles', 'true');
        document.head.appendChild(rippleStyle);
    }
}

// Parallax Effect for Hero Section
function initializeParallax() {
    const heroSection = document.querySelector('.hero');
    
    if (heroSection) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const parallaxElements = heroSection.querySelectorAll('.profile-card');
            
            parallaxElements.forEach((element, index) => {
                const speed = (index + 1) * 0.1;
                element.style.transform = `translateY(${scrolled * speed}px)`;
            });
        });
    }
}

// Typing Animation for Hero Title
function initializeTypingAnimation() {
    const titleElement = document.querySelector('.title-accent');
    if (!titleElement) return;
    
    const originalText = titleElement.textContent;
    const roles = [
        'Technical Product Manager',
        'Financial Technology Expert',
        'AI Innovation Leader',
        'Product Strategy Specialist'
    ];
    
    let currentRoleIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;
    
    function typeAnimation() {
        const currentRole = roles[currentRoleIndex];
        
        if (isDeleting) {
            titleElement.textContent = currentRole.substring(0, currentCharIndex - 1);
            currentCharIndex--;
        } else {
            titleElement.textContent = currentRole.substring(0, currentCharIndex + 1);
            currentCharIndex++;
        }
        
        let typeSpeed = isDeleting ? 100 : 150;
        
        if (!isDeleting && currentCharIndex === currentRole.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && currentCharIndex === 0) {
            isDeleting = false;
            currentRoleIndex = (currentRoleIndex + 1) % roles.length;
            typeSpeed = 500;
        }
        
        setTimeout(typeAnimation, typeSpeed);
    }
    
    // Start typing animation after page load
    setTimeout(() => {
        titleElement.textContent = '';
        typeAnimation();
    }, 2000);
}

// Performance Optimization
function optimizePerformance() {
    // Debounce scroll events
    let scrollTimeout;
    const originalScrollHandler = window.onscroll;
    
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        
        scrollTimeout = setTimeout(function() {
            if (originalScrollHandler) {
                originalScrollHandler();
            }
        }, 10);
    });
    
    // Lazy load images if any are added
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// Initialize additional features
document.addEventListener('DOMContentLoaded', function() {
    // initializeParallax(); // Uncomment if you want parallax effects
    // initializeTypingAnimation(); // Uncomment if you want typing animation
    optimizePerformance();
});

// Accessibility Enhancements
function initializeAccessibility() {
    // Add keyboard navigation for custom elements
    const interactiveElements = document.querySelectorAll('.skill-tag, .stat-card, .timeline-content');
    
    interactiveElements.forEach(element => {
        element.setAttribute('tabindex', '0');
        
        element.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
    
    // Focus management for mobile menu
    const mobileMenuToggle = document.getElementById('mobile-menu');
    const navMenu = document.getElementById('nav-menu');
    
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    }
}

// Error Handling
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    
    // Optional: Show user-friendly error message
    if (e.error && e.error.message) {
        showNotification('Something went wrong. Please refresh the page.', 'error');
    }
});

// Initialize accessibility features
document.addEventListener('DOMContentLoaded', initializeAccessibility);

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        isValidEmail,
        showNotification,
        initializeNavigation,
        initializeScrollAnimations,
        initializeFormHandlers
    };
}
