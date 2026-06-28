/* ========================================
   AKASHWORLDWIDE PREMIUM DASHBOARD
   JavaScript Functionality
   ======================================== */

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Smooth scroll to element
 */
const smoothScroll = (target) => {
    if (typeof target === 'string') {
        target = document.querySelector(target);
    }
    if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
};

/**
 * Add/Remove classes
 */
const toggleClass = (element, className) => {
    if (typeof element === 'string') {
        element = document.querySelector(element);
    }
    if (element) {
        element.classList.toggle(className);
    }
};

/**
 * Format numbers with animation
 */
const animateCounter = (element, target, duration = 2000) => {
    if (typeof element === 'string') {
        element = document.querySelector(element);
    }
    if (!element) return;

    const start = 0;
    const startTime = Date.now();
    const isPercentage = target.toString().includes('.');

    const updateCounter = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        let current;
        if (isPercentage) {
            current = (start + (target - start) * progress).toFixed(1);
        } else {
            current = Math.floor(start + (target - start) * progress);
        }

        element.textContent = current.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (isPercentage ? '%' : '+');

        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    };

    updateCounter();
};

// ========================================
// INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('[v0] Dashboard initialized');
    
    // Initialize components
    initNavigation();
    initSidebar();
    initScrollEffects();
    initCounterAnimation();
    initEventListeners();
    initThemeToggle();
});

// ========================================
// NAVIGATION
// ========================================

const initNavigation = () => {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }

    // Close menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            if (menuToggle) {
                menuToggle.classList.remove('active');
            }
        });
    });

    // Set active nav link based on scroll
    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav();
};

const updateActiveNav = () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
};

// ========================================
// SIDEBAR
// ========================================

const initSidebar = () => {
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    const sidebarItems = document.querySelectorAll('.sidebar-item');

    // Set first item as active
    if (sidebarItems.length > 0) {
        sidebarItems[0].classList.add('active');
    }

    // Handle sidebar link clicks
    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all items
            sidebarItems.forEach(item => {
                item.classList.remove('active');
            });

            // Add active class to clicked item
            link.closest('.sidebar-item').classList.add('active');

            // Scroll to target
            const href = link.getAttribute('href');
            if (href !== '#') {
                smoothScroll(href);
            }
        });
    });
};

// ========================================
// SCROLL EFFECTS
// ========================================

const initScrollEffects = () => {
    // Fade in elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all cards
    const cards = document.querySelectorAll(
        '.service-card, .blog-card, .stat-card, .partner-logo'
    );
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.6s ease-in-out';
        observer.observe(card);
    });

    // Parallax effect on hero
    const hero = document.querySelector('.hero-illustration');
    if (hero) {
        window.addEventListener('mousemove', (e) => {
            const rect = hero.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;

            const cards = hero.querySelectorAll('.floating-card');
            cards.forEach((card, index) => {
                const offset = (index + 1) * 10;
                card.style.transform = `translate(${(x - 0.5) * offset}px, ${(y - 0.5) * offset}px)`;
            });
        });
    }
};

// ========================================
// COUNTER ANIMATION
// ========================================

const initCounterAnimation = () => {
    const statCards = document.querySelectorAll('.stat-card');

    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumber = entry.target.querySelector('.stat-number');
                if (statNumber && !statNumber.dataset.animated) {
                    const target = parseFloat(statNumber.dataset.target);
                    animateCounter(statNumber, target);
                    statNumber.dataset.animated = 'true';
                }
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    statCards.forEach(card => observer.observe(card));
};

// ========================================
// EVENT LISTENERS
// ========================================

const initEventListeners = () => {
    // Search functionality
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.btn-search');

    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            const query = searchInput ? searchInput.value : '';
            if (query.trim()) {
                console.log('[v0] Search query:', query);
                // In a real app, this would perform a search
                alert(`Searching for: ${query}`);
            }
        });
    }

    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchBtn?.click();
            }
        });
    }

    // Service card clicks
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('click', () => {
            const serviceName = card.querySelector('.service-name').textContent;
            console.log('[v0] Service selected:', serviceName);
            // In a real app, this would navigate to service details
        });
    });

    // Blog card clicks
    const blogCards = document.querySelectorAll('.blog-card');
    blogCards.forEach(card => {
        card.addEventListener('click', () => {
            const blogTitle = card.querySelector('.blog-title').textContent;
            console.log('[v0] Blog selected:', blogTitle);
            // In a real app, this would navigate to blog post
        });
    });

    // Button handlers
    const buttons = document.querySelectorAll('.btn-partner, .btn-support, .btn-login, .btn-signup');
    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const text = btn.textContent;
            console.log('[v0] Button clicked:', text);
            // In a real app, this would trigger appropriate actions
        });
    });

    // Chat widget
    const chatBtn = document.getElementById('chatBtn');
    if (chatBtn) {
        chatBtn.addEventListener('click', () => {
            console.log('[v0] Chat widget opened');
            alert('Chat support feature would open here');
        });
    }
};

// ========================================
// THEME TOGGLE
// ========================================

const initThemeToggle = () => {
    const themeToggle = document.getElementById('themeToggle');
    
    if (themeToggle) {
        // Check for saved theme preference
        const savedTheme = localStorage.getItem('theme') || 'dark';
        applyTheme(savedTheme);

        themeToggle.addEventListener('click', () => {
            const currentTheme = localStorage.getItem('theme') || 'dark';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            applyTheme(newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }
};

const applyTheme = (theme) => {
    const root = document.documentElement;
    
    if (theme === 'light') {
        root.style.setProperty('--bg-primary', '#F5F5F7');
        root.style.setProperty('--bg-secondary', '#FFFFFF');
        root.style.setProperty('--bg-tertiary', '#F9FAFB');
        root.style.setProperty('--border-color', 'rgba(0, 0, 0, 0.08)');
        root.style.setProperty('--text-white', '#1A1A1A');
        root.style.setProperty('--text-muted', '#6B7280');
        root.style.setProperty('--text-light', '#4B5563');
        document.body.classList.add('light-mode');
    } else {
        root.style.setProperty('--bg-primary', '#08080D');
        root.style.setProperty('--bg-secondary', '#11111B');
        root.style.setProperty('--bg-tertiary', '#1A1A2E');
        root.style.setProperty('--border-color', 'rgba(255, 255, 255, 0.08)');
        root.style.setProperty('--text-white', '#FFFFFF');
        root.style.setProperty('--text-muted', '#A1A1AA');
        root.style.setProperty('--text-light', '#D4D4D8');
        document.body.classList.remove('light-mode');
    }
};

// ========================================
// UTILITY: Ripple Effect on Buttons
// ========================================

const initRippleEffect = () => {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');

            this.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    });
};

// ========================================
// PERFORMANCE: Lazy Loading
// ========================================

const initLazyLoading = () => {
    if ('IntersectionObserver' in window) {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }
};

// ========================================
// ACCESSIBILITY: Keyboard Navigation
// ========================================

const initKeyboardNavigation = () => {
    document.addEventListener('keydown', (e) => {
        // Skip to main content (Alt + M)
        if (e.altKey && e.key === 'm') {
            document.querySelector('.main-content')?.focus();
        }

        // Search (Ctrl + K or Cmd + K)
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            document.querySelector('.search-input')?.focus();
        }
    });
};

// ========================================
// PERFORMANCE MONITORING
// ========================================

const initPerformanceMonitoring = () => {
    // Log when page is fully loaded
    window.addEventListener('load', () => {
        const perfData = performance.getEntriesByType('navigation')[0];
        if (perfData) {
            console.log('[v0] Page Load Metrics:', {
                'DNS Lookup': perfData.domainLookupEnd - perfData.domainLookupStart,
                'TCP Connection': perfData.connectEnd - perfData.connectStart,
                'Request Time': perfData.responseStart - perfData.requestStart,
                'Response Time': perfData.responseEnd - perfData.responseStart,
                'DOM Processing': perfData.domInteractive - perfData.domLoading,
                'Total Load Time': perfData.loadEventEnd - perfData.fetchStart
            });
        }
    });

    // Report Core Web Vitals
    if ('web-vital' in window) {
        window.addEventListener('web-vital', (metric) => {
            console.log('[v0] Web Vital:', metric.name, metric.value);
        });
    }
};

// ========================================
// ADVANCED: Smooth Page Transitions
// ========================================

const initPageTransitions = () => {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                smoothScroll(href);
            }
        });
    });
};

// ========================================
// ADVANCED: Form Validation
// ========================================

const initFormValidation = () => {
    const inputs = document.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
    });
};

const validateField = (field) => {
    if (field.value.trim() === '') {
        field.classList.add('error');
    } else {
        field.classList.remove('error');
    }
};

// ========================================
// RESPONSIVE: Mobile Navigation
// ========================================

const initMobileNav = () => {
    // Close mobile menu on outside click
    document.addEventListener('click', (e) => {
        const navMenu = document.getElementById('navMenu');
        const menuToggle = document.getElementById('menuToggle');
        
        if (navMenu && menuToggle) {
            if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        }
    });
};

// ========================================
// UTILITY: Service Worker Registration
// ========================================

const initServiceWorker = () => {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('[v0] Service Worker registered'))
            .catch(err => console.log('[v0] Service Worker registration failed:', err));
    }
};

// ========================================
// INITIALIZE ON LOAD
// ========================================

// Initialize all features
window.addEventListener('load', () => {
    initRippleEffect();
    initLazyLoading();
    initKeyboardNavigation();
    initPerformanceMonitoring();
    initPageTransitions();
    initFormValidation();
    initMobileNav();
    // initServiceWorker(); // Uncomment when SW is available
    
    console.log('[v0] All features initialized');
});

// ========================================
// ERROR HANDLING
// ========================================

window.addEventListener('error', (e) => {
    console.error('[v0] Error:', e.message);
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('[v0] Unhandled rejection:', e.reason);
});

// ========================================
// CLEANUP
// ========================================

window.addEventListener('beforeunload', () => {
    // Clean up resources if needed
    console.log('[v0] Page unloading');
});
