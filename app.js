// JavaScript for Lalit Shewani's Personal Website

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initializeNavigation();
    initializeThemeToggle();
    initializeScrollToTop();
    initializeFormHandlers();
    initializeAnimations();
});

// Navigation functionality
function initializeNavigation() {
    const nav = document.getElementById('nav');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const navHeight = nav.offsetHeight;
                const targetPosition = targetSection.offsetTop - navHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update active state immediately
                navLinks.forEach(navLink => navLink.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });

    // Intersection Observer for active navigation highlighting
    const observerOptions = {
        root: null,
        rootMargin: `-${nav.offsetHeight + 50}px 0px -50% 0px`,
        threshold: 0.1
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Remove active class from all nav links
                navLinks.forEach(link => link.classList.remove('active'));
                
                // Add active class to current section nav link
                const activeLink = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }, observerOptions);

    // Observe all sections
    sections.forEach(section => {
        observer.observe(section);
    });

    // Navigation background opacity on scroll
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(function() {
                if (window.scrollY > 100) {
                    nav.style.background = 'rgba(var(--color-surface-rgb, 252, 252, 249), 0.95)';
                    nav.style.backdropFilter = 'blur(10px)';
                } else {
                    nav.style.background = 'rgba(var(--color-bg-1), 0.95)';
                    nav.style.backdropFilter = 'blur(10px)';
                }
                ticking = false;
            });
            ticking = true;
        }
    });
}

// Theme toggle functionality
function initializeThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('.theme-toggle-icon');
    
    // Check for saved theme preference or default to system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const currentTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    
    // Apply initial theme
    applyTheme(currentTheme);
    updateThemeIcon(currentTheme);

    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-color-scheme') || 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        applyTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
        
        // Add a subtle animation to the toggle
        this.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            this.style.transform = 'rotate(0deg)';
        }, 300);
    });

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-color-scheme', theme);
        
        // Force update of CSS custom properties for immediate effect
        if (theme === 'dark') {
            document.documentElement.style.setProperty('--color-background', 'var(--color-charcoal-700)');
            document.documentElement.style.setProperty('--color-surface', 'var(--color-charcoal-800)');
            document.documentElement.style.setProperty('--color-text', 'var(--color-gray-200)');
            document.documentElement.style.setProperty('--color-primary', 'var(--color-teal-300)');
        } else {
            document.documentElement.style.setProperty('--color-background', 'var(--color-cream-50)');
            document.documentElement.style.setProperty('--color-surface', 'var(--color-cream-100)');
            document.documentElement.style.setProperty('--color-text', 'var(--color-slate-900)');
            document.documentElement.style.setProperty('--color-primary', 'var(--color-teal-500)');
        }
    }

    function updateThemeIcon(theme) {
        themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
        if (!localStorage.getItem('theme')) {
            const newTheme = e.matches ? 'dark' : 'light';
            applyTheme(newTheme);
            updateThemeIcon(newTheme);
        }
    });
}

// Scroll to top button functionality
function initializeScrollToTop() {
    const scrollToTopBtn = document.getElementById('scroll-to-top');
    
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(function() {
                if (window.scrollY > 300) {
                    scrollToTopBtn.classList.add('visible');
                } else {
                    scrollToTopBtn.classList.remove('visible');
                }
                ticking = false;
            });
            ticking = true;
        }
    });

    scrollToTopBtn.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Form handlers
function initializeFormHandlers() {
    // Contact form handler
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleContactFormSubmission(this);
        });
    }

    // Newsletter signup handler
    const newsletterForm = document.querySelector('.signup-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleNewsletterSignup(this);
        });
    }
}

function handleContactFormSubmission(form) {
    const formData = new FormData(form);
    const name = formData.get('name') || '';
    const email = formData.get('email') || '';
    const subject = formData.get('subject') || '';
    const message = formData.get('message') || '';
    
    // Validate required fields
    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
        showNotification('Please fill in all required fields.', 'error');
        return;
    }

    // Create mailto link with proper encoding
    const emailBody = `Name: ${name}%0D%0AEmail: ${email}%0D%0A%0D%0AMessage:%0D%0A${message}`;
    const mailtoLink = `mailto:lalit.shewani01@gmail.com?subject=${encodeURIComponent(subject)}&body=${emailBody}`;
    
    try {
        // Open email client
        window.open(mailtoLink, '_self');
        
        // Show success message
        showNotification('Thank you for your message! Your email client should open shortly.', 'success');
        
        // Reset form after a short delay
        setTimeout(() => {
            form.reset();
        }, 1000);
    } catch (error) {
        showNotification('Unable to open email client. Please send an email directly to lalit.shewani01@gmail.com', 'error');
    }
}

function handleNewsletterSignup(form) {
    const emailInput = form.querySelector('input[type="email"]');
    const email = emailInput ? emailInput.value.trim() : '';
    
    if (!email) {
        showNotification('Please enter a valid email address.', 'error');
        return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('Please enter a valid email address.', 'error');
        return;
    }
    
    try {
        // Create mailto link for newsletter signup
        const subject = 'Newsletter Subscription Request';
        const body = `Please subscribe ${email} to the Technology in Investment Banking newsletter.%0D%0A%0D%0AThank you!`;
        const mailtoLink = `mailto:lalit.shewani01@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;
        
        // Open email client
        window.open(mailtoLink, '_self');
        
        // Show success message
        showNotification('Thank you for subscribing! We\'ll be in touch soon.', 'success');
        
        // Reset form after a short delay
        setTimeout(() => {
            form.reset();
        }, 1000);
    } catch (error) {
        showNotification('Unable to open email client. Please send a subscription request to lalit.shewani01@gmail.com', 'error');
    }
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    
    // Create notification content
    const content = document.createElement('div');
    content.className = 'notification-content';
    content.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
    `;
    
    const messageSpan = document.createElement('span');
    messageSpan.className = 'notification-message';
    messageSpan.textContent = message;
    messageSpan.style.cssText = `
        color: var(--color-text);
        font-size: var(--font-size-sm);
        line-height: 1.4;
    `;
    
    const closeButton = document.createElement('button');
    closeButton.className = 'notification-close';
    closeButton.innerHTML = '&times;';
    closeButton.setAttribute('aria-label', 'Close notification');
    closeButton.style.cssText = `
        background: none;
        border: none;
        font-size: 18px;
        cursor: pointer;
        padding: 0;
        color: var(--color-text-secondary);
        line-height: 1;
    `;
    
    content.appendChild(messageSpan);
    content.appendChild(closeButton);
    notification.appendChild(content);

    // Add base styles for notification
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-lg);
        padding: 16px;
        box-shadow: var(--shadow-lg);
        z-index: 1001;
        max-width: 400px;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;

    // Type-specific styling
    if (type === 'success') {
        notification.style.borderColor = 'var(--color-success)';
        notification.style.backgroundColor = 'rgba(var(--color-success-rgb), 0.1)';
    } else if (type === 'error') {
        notification.style.borderColor = 'var(--color-error)';
        notification.style.backgroundColor = 'rgba(var(--color-error-rgb), 0.1)';
    }

    // Add to DOM
    document.body.appendChild(notification);

    // Show notification with animation
    requestAnimationFrame(() => {
        notification.style.transform = 'translateX(0)';
    });

    // Close button handler
    closeButton.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    });

    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
}

// Animation and interaction enhancements
function initializeAnimations() {
    // Animate elements on scroll
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.1
    };

    const animateOnScrollObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Elements to animate
    const elementsToAnimate = document.querySelectorAll('.card, .timeline-item, .project-card, .stat-card, .education-card, .post-card');
    
    elementsToAnimate.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        animateOnScrollObserver.observe(element);
    });

    // Add hover effects to skill items
    const skillItems = document.querySelectorAll('.skill-item');
    skillItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px) scale(1.02)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Add click effects to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.3);
                transform: scale(0);
                animation: ripple 0.6s linear;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                pointer-events: none;
            `;
            
            // Add ripple animation keyframes if not exists
            if (!document.querySelector('#ripple-animation')) {
                const style = document.createElement('style');
                style.id = 'ripple-animation';
                style.textContent = `
                    @keyframes ripple {
                        to {
                            transform: scale(2);
                            opacity: 0;
                        }
                    }
                `;
                document.head.appendChild(style);
            }
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                if (ripple.parentNode) {
                    ripple.remove();
                }
            }, 600);
        });
    });
}

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
    // Press 'T' to toggle theme
    if ((e.key === 't' || e.key === 'T') && !e.ctrlKey && !e.metaKey && !isTyping()) {
        document.getElementById('theme-toggle').click();
    }
    
    // Press 'H' to go to home
    if ((e.key === 'h' || e.key === 'H') && !e.ctrlKey && !e.metaKey && !isTyping()) {
        document.querySelector('.nav-link[href="#hero"]').click();
    }
    
    // Press 'C' to go to contact
    if ((e.key === 'c' || e.key === 'C') && !e.ctrlKey && !e.metaKey && !isTyping()) {
        document.querySelector('.nav-link[href="#contact"]').click();
    }
});

function isTyping() {
    const activeElement = document.activeElement;
    return activeElement && (
        activeElement.tagName === 'INPUT' ||
        activeElement.tagName === 'TEXTAREA' ||
        activeElement.contentEditable === 'true'
    );
}

// Accessibility improvements
function initializeAccessibility() {
    // Skip to content link
    const skipLink = document.createElement('a');
    skipLink.href = '#hero';
    skipLink.textContent = 'Skip to main content';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--color-primary);
        color: var(--color-btn-primary-text);
        padding: 8px 12px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 1000;
        transition: top 0.3s;
        font-size: 14px;
    `;
    
    skipLink.addEventListener('focus', function() {
        this.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
    });
    
    skipLink.addEventListener('click', function(e) {
        e.preventDefault();
        document.getElementById('hero').focus();
        document.getElementById('hero').scrollIntoView({ behavior: 'smooth' });
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);

    // Make sections focusable for skip link
    document.querySelectorAll('section[id]').forEach(section => {
        section.setAttribute('tabindex', '-1');
    });
}

// Initialize accessibility features
initializeAccessibility();

// Console easter egg
console.log(`
🚀 Welcome to Lalit Shewani's Portfolio!
💼 Technical Product Manager | JP Morgan Chase
🎯 Building the future of financial technology

Keyboard shortcuts:
• Press 'T' to toggle dark/light mode
• Press 'H' to go to home section
• Press 'C' to go to contact section

Connect with me: lalit.shewani01@gmail.com
LinkedIn: www.linkedin.com/in/lalit-shewani
`);

// Export functions for potential external use
window.PortfolioAPI = {
    toggleTheme: () => document.getElementById('theme-toggle').click(),
    scrollToSection: (sectionId) => {
        const link = document.querySelector(`.nav-link[href="#${sectionId}"]`);
        if (link) {
            link.click();
        }
    },
    showNotification: showNotification
};