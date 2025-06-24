// Main application initialization
document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme
    initializeTheme();
    
    // Initialize all managers
    console.log('BiTS Connect initialized successfully');
});

function initializeTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const savedTheme = Utils.getFromStorage('theme', 'dark');
    
    // Apply saved theme
    applyTheme(savedTheme);
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            applyTheme(newTheme);
            Utils.saveToStorage('theme', newTheme);
        });
    }
}

function applyTheme(theme) {
    const themeToggle = document.getElementById('theme-toggle');
    const icon = themeToggle?.querySelector('i');
    
    if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        if (icon) {
            icon.className = 'fas fa-sun';
        }
    } else {
        document.documentElement.classList.remove('dark');
        if (icon) {
            icon.className = 'fas fa-moon';
        }
    }
}

// Global error handler
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
    Utils.showToast('An unexpected error occurred', 'error');
});

// Global unhandled promise rejection handler
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
    Utils.showToast('An unexpected error occurred', 'error');
    e.preventDefault();
});

// Smooth scrolling for anchor links
document.addEventListener('click', function(e) {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});

// Add loading states to buttons
document.addEventListener('click', function(e) {
    if (e.target.matches('button[type="submit"]') || e.target.closest('button[type="submit"]')) {
        const button = e.target.matches('button') ? e.target : e.target.closest('button');
        if (button && !button.disabled) {
            const originalText = button.innerHTML;
            button.innerHTML = '<i class="fas fa-spinner animate-spin"></i> Loading...';
            button.disabled = true;
            
            // Reset after 3 seconds (in case form doesn't handle it)
            setTimeout(() => {
                button.innerHTML = originalText;
                button.disabled = false;
            }, 3000);
        }
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + K for search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('input[type="text"][placeholder*="search" i], input[type="search"]');
        if (searchInput) {
            searchInput.focus();
        }
    }
    
    // Escape to close modals
    if (e.key === 'Escape') {
        const activeModal = document.querySelector('.modal.active');
        if (activeModal) {
            activeModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
});

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', function() {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
        }, 0);
    });
}

// Service worker registration (for future PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Uncomment when service worker is implemented
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registered:', registration))
        //     .catch(error => console.log('SW registration failed:', error));
    });
}

// Export for global access
window.BiTSConnect = {
    version: '1.0.0',
    initialized: true,
    utils: Utils,
    auth: () => window.authManager,
    navigation: () => window.navigation,
    library: () => window.libraryManager,
    upload: () => window.uploadManager,
    gpa: () => window.gpaManager,
    chat: () => window.chatManager,
    blog: () => window.blogManager,
    dashboard: () => window.dashboardManager
};