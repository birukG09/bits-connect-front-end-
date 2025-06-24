// Navigation management
class NavigationManager {
    constructor() {
        this.currentPage = 'home';
        this.pages = ['home', 'library', 'upload', 'gpa', 'chat', 'blog', 'dashboard'];
        this.initialize();
    }
    
    initialize() {
        this.bindEvents();
        this.handleInitialRoute();
    }
    
    bindEvents() {
        // Navigation links
        document.querySelectorAll('[data-page]').forEach(element => {
            element.addEventListener('click', (e) => {
                e.preventDefault();
                const page = element.getAttribute('data-page');
                this.showPage(page);
            });
        });
        
        // Mobile menu toggle
        const mobileToggle = document.getElementById('mobile-toggle');
        const navMenu = document.getElementById('nav-menu');
        
        if (mobileToggle && navMenu) {
            mobileToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                const icon = mobileToggle.querySelector('i');
                if (navMenu.classList.contains('active')) {
                    icon.className = 'fas fa-times';
                } else {
                    icon.className = 'fas fa-bars';
                }
            });
        }
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (navMenu && !navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
                navMenu.classList.remove('active');
                const icon = mobileToggle.querySelector('i');
                icon.className = 'fas fa-bars';
            }
        });
        
        // Handle browser back/forward
        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.page) {
                this.showPage(e.state.page, false);
            }
        });
    }
    
    handleInitialRoute() {
        const hash = window.location.hash.slice(1);
        if (hash && this.pages.includes(hash)) {
            this.showPage(hash, false);
        } else {
            this.showPage('home', false);
        }
    }
    
    showPage(pageName, updateHistory = true) {
        // Check if page requires authentication
        const protectedPages = ['dashboard', 'upload'];
        if (protectedPages.includes(pageName) && !window.authManager.requireAuth()) {
            return;
        }
        
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        // Show target page
        const targetPage = document.getElementById(`${pageName}-page`);
        if (targetPage) {
            targetPage.classList.add('active');
            this.currentPage = pageName;
            
            // Update navigation active state
            this.updateNavigation(pageName);
            
            // Update URL
            if (updateHistory) {
                window.history.pushState({ page: pageName }, '', `#${pageName}`);
            }
            
            // Update page title
            this.updatePageTitle(pageName);
            
            // Initialize page-specific functionality
            this.initializePage(pageName);
            
            // Close mobile menu
            const navMenu = document.getElementById('nav-menu');
            const mobileToggle = document.getElementById('mobile-toggle');
            if (navMenu) {
                navMenu.classList.remove('active');
                const icon = mobileToggle?.querySelector('i');
                if (icon) icon.className = 'fas fa-bars';
            }
        }
    }
    
    updateNavigation(activePage) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-page') === activePage) {
                link.classList.add('active');
            }
        });
    }
    
    updatePageTitle(pageName) {
        const titles = {
            home: 'BiTS Connect - Educational Platform',
            library: 'Digital Library - BiTS Connect',
            upload: 'Upload & Convert - BiTS Connect',
            gpa: 'GPA Calculator - BiTS Connect',
            chat: 'Student Chat - BiTS Connect',
            blog: 'Tech Blog - BiTS Connect',
            dashboard: 'Dashboard - BiTS Connect'
        };
        
        document.title = titles[pageName] || 'BiTS Connect';
    }
    
    initializePage(pageName) {
        switch (pageName) {
            case 'library':
                if (window.libraryManager) {
                    window.libraryManager.initialize();
                }
                break;
            case 'upload':
                if (window.uploadManager) {
                    window.uploadManager.initialize();
                }
                break;
            case 'gpa':
                if (window.gpaManager) {
                    window.gpaManager.initialize();
                }
                break;
            case 'chat':
                if (window.chatManager) {
                    window.chatManager.initialize();
                }
                break;
            case 'blog':
                if (window.blogManager) {
                    window.blogManager.initialize();
                }
                break;
            case 'dashboard':
                if (window.dashboardManager) {
                    window.dashboardManager.initialize();
                }
                break;
        }
    }
    
    getCurrentPage() {
        return this.currentPage;
    }
    
    goBack() {
        window.history.back();
    }
    
    goForward() {
        window.history.forward();
    }
}

// Initialize navigation
window.navigation = new NavigationManager();