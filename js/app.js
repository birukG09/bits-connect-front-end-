// BiTS Connect - Pure Bootstrap JavaScript Application

// Utility functions
const Utils = {
    // Show toast notification
    showToast: function(message, type = 'info', duration = 3000) {
        const container = document.getElementById('toastContainer');
        const toastId = 'toast-' + Math.random().toString(36).substr(2, 9);
        
        const toastHTML = `
            <div class="toast" role="alert" id="${toastId}">
                <div class="toast-header">
                    <div class="rounded me-2 ${this.getToastIconClass(type)}">
                        <i class="bi ${this.getToastIcon(type)}"></i>
                    </div>
                    <strong class="me-auto">${this.getToastTitle(type)}</strong>
                    <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
                </div>
                <div class="toast-body">
                    ${message}
                </div>
            </div>
        `;
        
        container.insertAdjacentHTML('beforeend', toastHTML);
        
        const toastElement = document.getElementById(toastId);
        const toast = new bootstrap.Toast(toastElement, { delay: duration });
        toast.show();
        
        // Remove toast element after it's hidden
        toastElement.addEventListener('hidden.bs.toast', function() {
            toastElement.remove();
        });
    },
    
    getToastIcon: function(type) {
        const icons = {
            'success': 'bi-check-circle-fill',
            'error': 'bi-x-circle-fill',
            'warning': 'bi-exclamation-triangle-fill',
            'info': 'bi-info-circle-fill'
        };
        return icons[type] || icons.info;
    },
    
    getToastIconClass: function(type) {
        const classes = {
            'success': 'bg-success text-white',
            'error': 'bg-danger text-white',
            'warning': 'bg-warning text-white',
            'info': 'bg-info text-white'
        };
        return classes[type] || classes.info;
    },
    
    getToastTitle: function(type) {
        const titles = {
            'success': 'Success',
            'error': 'Error',
            'warning': 'Warning',
            'info': 'Info'
        };
        return titles[type] || titles.info;
    },
    
    // Format file size
    formatFileSize: function(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },
    
    // Generate random ID
    generateId: function() {
        return Math.random().toString(36).substr(2, 9);
    },
    
    // Debounce function
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction() {
            const later = function() {
                clearTimeout(timeout);
                func.apply(this, arguments);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Local storage helpers
    getFromStorage: function(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return defaultValue;
        }
    },
    
    saveToStorage: function(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    },
    
    // Validate email
    isValidEmail: function(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },
    
    // Validate URL
    isValidUrl: function(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    },
    
    // Simulate API delay
    simulateDelay: function(ms = 1000) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
};

// Navigation Manager
const Navigation = {
    currentPage: 'home',
    pages: ['home', 'library', 'upload', 'gpa', 'chat', 'blog', 'dashboard'],
    
    init: function() {
        this.bindEvents();
        this.handleInitialRoute();
    },
    
    bindEvents: function() {
        // Navigation links
        document.querySelectorAll('[data-page]').forEach(element => {
            element.addEventListener('click', (e) => {
                e.preventDefault();
                const page = element.getAttribute('data-page');
                this.showPage(page);
            });
        });
        
        // Handle browser back/forward
        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.page) {
                this.showPage(e.state.page, false);
            }
        });
        
        // Close mobile menu when clicking nav links
        document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
            link.addEventListener('click', () => {
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse.classList.contains('show')) {
                    const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                    bsCollapse.hide();
                }
            });
        });
    },
    
    handleInitialRoute: function() {
        const hash = window.location.hash.slice(1);
        if (hash && this.pages.includes(hash)) {
            this.showPage(hash, false);
        } else {
            this.showPage('home', false);
        }
    },
    
    showPage: function(pageName, updateHistory = true) {
        // Check if page requires authentication
        const protectedPages = ['dashboard', 'upload'];
        if (protectedPages.includes(pageName) && !Auth.isAuthenticated()) {
            Auth.showLoginModal();
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
            
            // Update navbar styling based on page
            this.updateNavbarStyling(pageName);
            
            // Initialize page-specific functionality
            this.initializePage(pageName);
        }
    },
    
    updateNavigation: function(activePage) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-page') === activePage) {
                link.classList.add('active');
            }
        });
    },
    
    updatePageTitle: function(pageName) {
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
    },
    
    updateNavbarStyling: function(pageName) {
        if (pageName === 'home') {
            document.body.classList.add('home-active');
        } else {
            document.body.classList.remove('home-active');
        }
    },
    
    initializePage: function(pageName) {
        switch (pageName) {
            case 'library':
                Library.init();
                break;
            case 'upload':
                Upload.init();
                break;
            case 'gpa':
                GPA.init();
                break;
            case 'chat':
                Chat.init();
                break;
            case 'blog':
                Blog.init();
                break;
            case 'dashboard':
                Dashboard.init();
                break;
        }
    }
};

// Authentication Manager
const Auth = {
    currentUser: null,
    isLoggedIn: false,
    
    init: function() {
        this.currentUser = Utils.getFromStorage('currentUser', null);
        this.isLoggedIn = !!this.currentUser;
        this.updateUI();
        this.bindEvents();
    },
    
    bindEvents: function() {
        const loginBtn = document.getElementById('loginBtn');
        const logoutBtn = document.getElementById('logoutBtn');
        const authForm = document.getElementById('authForm');
        const authToggle = document.getElementById('authToggle');
        const passwordToggle = document.getElementById('passwordToggle');
        
        if (loginBtn) {
            loginBtn.addEventListener('click', () => this.showLoginModal());
        }
        
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }
        
        if (authForm) {
            authForm.addEventListener('submit', (e) => this.handleAuth(e));
        }
        
        if (authToggle) {
            authToggle.addEventListener('click', () => this.toggleAuthMode());
        }
        
        if (passwordToggle) {
            passwordToggle.addEventListener('click', () => this.togglePassword());
        }
    },
    
    showLoginModal: function() {
        const modal = new bootstrap.Modal(document.getElementById('loginModal'));
        modal.show();
    },
    
    hideLoginModal: function() {
        const modal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
        if (modal) {
            modal.hide();
        }
    },
    
    toggleAuthMode: function() {
        const isLogin = document.getElementById('modalTitle').textContent === 'Welcome Back';
        const modalTitle = document.getElementById('modalTitle');
        const modalSubtitle = document.getElementById('modalSubtitle');
        const nameGroup = document.getElementById('nameGroup');
        const confirmPasswordGroup = document.getElementById('confirmPasswordGroup');
        const loginOptions = document.getElementById('loginOptions');
        const authSubmitText = document.getElementById('authSubmitText');
        const toggleText = document.getElementById('toggleText');
        const authToggle = document.getElementById('authToggle');
        
        if (isLogin) {
            // Switch to register mode
            modalTitle.textContent = 'Join BiTS Connect';
            modalSubtitle.textContent = 'Create your account to start your journey';
            nameGroup.classList.remove('d-none');
            confirmPasswordGroup.classList.remove('d-none');
            loginOptions.classList.add('d-none');
            authSubmitText.textContent = 'Create Account';
            toggleText.textContent = 'Already have an account?';
            authToggle.textContent = 'Sign in';
        } else {
            // Switch to login mode
            modalTitle.textContent = 'Welcome Back';
            modalSubtitle.textContent = 'Sign in to your account to continue learning';
            nameGroup.classList.add('d-none');
            confirmPasswordGroup.classList.add('d-none');
            loginOptions.classList.remove('d-none');
            authSubmitText.textContent = 'Sign In';
            toggleText.textContent = "Don't have an account?";
            authToggle.textContent = 'Sign up';
        }
    },
    
    togglePassword: function() {
        const passwordInput = document.getElementById('passwordInput');
        const passwordToggle = document.getElementById('passwordToggle');
        const icon = passwordToggle.querySelector('i');
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            icon.className = 'bi bi-eye-slash';
        } else {
            passwordInput.type = 'password';
            icon.className = 'bi bi-eye';
        }
    },
    
    handleAuth: async function(e) {
        e.preventDefault();
        
        const isLogin = document.getElementById('modalTitle').textContent === 'Welcome Back';
        const email = document.getElementById('emailInput').value;
        const password = document.getElementById('passwordInput').value;
        const name = document.getElementById('nameInput').value;
        const confirmPassword = document.getElementById('confirmPasswordInput').value;
        
        // Basic validation
        if (!Utils.isValidEmail(email)) {
            Utils.showToast('Please enter a valid email address', 'error');
            return;
        }
        
        if (password.length < 6) {
            Utils.showToast('Password must be at least 6 characters', 'error');
            return;
        }
        
        if (!isLogin) {
            if (!name.trim()) {
                Utils.showToast('Please enter your full name', 'error');
                return;
            }
            
            if (password !== confirmPassword) {
                Utils.showToast('Passwords do not match', 'error');
                return;
            }
        }
        
        try {
            // Show loading state
            const submitBtn = document.getElementById('authSubmit');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Loading...';
            submitBtn.disabled = true;
            
            // Simulate API call
            await Utils.simulateDelay(1500);
            
            if (isLogin) {
                await this.login(email, password);
            } else {
                await this.register(name, email, password);
            }
            
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        } catch (error) {
            Utils.showToast('Authentication failed. Please try again.', 'error');
            
            // Reset button
            const submitBtn = document.getElementById('authSubmit');
            submitBtn.innerHTML = 'Sign In';
            submitBtn.disabled = false;
        }
    },
    
    login: async function(email, password) {
        // Mock login
        const mockUser = {
            id: Utils.generateId(),
            email: email,
            name: email.split('@')[0],
            role: email.includes('admin') ? 'admin' : 'student',
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
            joinedAt: new Date().toISOString()
        };
        
        this.currentUser = mockUser;
        this.isLoggedIn = true;
        
        Utils.saveToStorage('currentUser', mockUser);
        this.updateUI();
        this.hideLoginModal();
        
        Utils.showToast('Welcome back!', 'success');
        
        // Navigate to dashboard
        Navigation.showPage('dashboard');
    },
    
    register: async function(name, email, password) {
        // Mock registration
        const mockUser = {
            id: Utils.generateId(),
            email: email,
            name: name,
            role: 'student',
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
            joinedAt: new Date().toISOString()
        };
        
        this.currentUser = mockUser;
        this.isLoggedIn = true;
        
        Utils.saveToStorage('currentUser', mockUser);
        this.updateUI();
        this.hideLoginModal();
        
        Utils.showToast('Account created successfully!', 'success');
        
        // Navigate to dashboard
        Navigation.showPage('dashboard');
    },
    
    logout: function() {
        this.currentUser = null;
        this.isLoggedIn = false;
        
        localStorage.removeItem('currentUser');
        this.updateUI();
        
        Utils.showToast('Logged out successfully', 'info');
        
        // Navigate to home
        Navigation.showPage('home');
    },
    
    updateUI: function() {
        const loginBtn = document.getElementById('loginBtn');
        const userProfile = document.getElementById('userProfile');
        const userAvatar = userProfile?.querySelector('img');
        const userName = document.getElementById('userName');
        
        if (this.isLoggedIn && this.currentUser) {
            if (loginBtn) loginBtn.classList.add('d-none');
            if (userProfile) {
                userProfile.classList.remove('d-none');
                userProfile.classList.add('d-flex');
            }
            
            if (userAvatar) userAvatar.src = this.currentUser.avatar;
            if (userName) userName.textContent = this.currentUser.name;
        } else {
            if (loginBtn) loginBtn.classList.remove('d-none');
            if (userProfile) {
                userProfile.classList.add('d-none');
                userProfile.classList.remove('d-flex');
            }
        }
    },
    
    isAuthenticated: function() {
        return this.isLoggedIn;
    }
};

// Library Manager
const Library = {
    init: function() {
        this.bindEvents();
    },
    
    bindEvents: function() {
        const searchInput = document.getElementById('librarySearch');
        const departmentFilter = document.getElementById('departmentFilter');
        const categoryButtons = document.querySelectorAll('#library-page .btn[data-category]');
        
        if (searchInput) {
            searchInput.addEventListener('input', Utils.debounce((e) => {
                console.log('Library search:', e.target.value);
            }, 300));
        }
        
        if (departmentFilter) {
            departmentFilter.addEventListener('change', (e) => {
                console.log('Department filter:', e.target.value);
            });
        }
        
        categoryButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                categoryButtons.forEach(btn => {
                    btn.classList.remove('btn-success');
                    btn.classList.add('btn-outline-success');
                });
                button.classList.remove('btn-outline-success');
                button.classList.add('btn-success');
                
                console.log('Category filter:', button.getAttribute('data-category'));
            });
        });
    }
};

// Upload Manager
const Upload = {
    init: function() {
        this.bindEvents();
    },
    
    bindEvents: function() {
        const dropzone = document.getElementById('dropzone');
        const fileInput = document.getElementById('fileInput');
        const urlInput = document.getElementById('urlInput');
        const convertBtn = document.getElementById('convertBtn');
        
        if (dropzone && fileInput) {
            dropzone.addEventListener('click', () => fileInput.click());
            
            dropzone.addEventListener('dragover', (e) => {
                e.preventDefault();
                dropzone.classList.add('dragover');
            });
            
            dropzone.addEventListener('dragleave', () => {
                dropzone.classList.remove('dragover');
            });
            
            dropzone.addEventListener('drop', (e) => {
                e.preventDefault();
                dropzone.classList.remove('dragover');
                const files = Array.from(e.dataTransfer.files);
                this.handleFiles(files);
            });
            
            fileInput.addEventListener('change', (e) => {
                this.handleFiles(Array.from(e.target.files));
            });
        }
        
        if (convertBtn) {
            convertBtn.addEventListener('click', () => {
                const url = urlInput.value.trim();
                if (url && Utils.isValidUrl(url)) {
                    Utils.showToast('Converting URL to PDF...', 'info');
                    // Simulate conversion
                    setTimeout(() => {
                        Utils.showToast('URL converted successfully!', 'success');
                        urlInput.value = '';
                    }, 2000);
                } else {
                    Utils.showToast('Please enter a valid URL', 'error');
                }
            });
        }
    },
    
    handleFiles: function(files) {
        const allowedTypes = [
            'application/pdf',
            'application/epub+zip',
            'text/plain',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];
        
        const validFiles = files.filter(file => {
            if (!allowedTypes.includes(file.type)) {
                Utils.showToast(`${file.name} is not a supported file type`, 'error');
                return false;
            }
            
            if (file.size > 100 * 1024 * 1024) { // 100MB limit
                Utils.showToast(`${file.name} is too large (max 100MB)`, 'error');
                return false;
            }
            
            return true;
        });
        
        if (validFiles.length > 0) {
            Utils.showToast(`${validFiles.length} file(s) uploaded successfully!`, 'success');
        }
    }
};

// GPA Manager
const GPA = {
    init: function() {
        this.bindEvents();
    },
    
    bindEvents: function() {
        const addCourseBtn = document.getElementById('addCourseBtn');
        const saveSemesterBtn = document.getElementById('saveSemesterBtn');
        
        if (addCourseBtn) {
            addCourseBtn.addEventListener('click', () => {
                this.addCourse();
            });
        }
        
        if (saveSemesterBtn) {
            saveSemesterBtn.addEventListener('click', () => {
                Utils.showToast('Semester saved successfully!', 'success');
            });
        }
    },
    
    addCourse: function() {
        const coursesList = document.getElementById('coursesList');
        const courseId = Utils.generateId();
        
        const courseHTML = `
            <div class="course-item mb-3" id="course-${courseId}">
                <div class="row g-2 align-items-center">
                    <div class="col-md-4">
                        <input type="text" class="form-control" placeholder="Course name">
                    </div>
                    <div class="col-md-2">
                        <input type="number" class="form-control" value="3" min="1" max="6" placeholder="Credits">
                    </div>
                    <div class="col-md-2">
                        <select class="form-select">
                            <option value="A">A</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B">B</option>
                            <option value="B-">B-</option>
                            <option value="C+">C+</option>
                            <option value="C">C</option>
                            <option value="C-">C-</option>
                            <option value="D+">D+</option>
                            <option value="D">D</option>
                            <option value="F">F</option>
                        </select>
                    </div>
                    <div class="col-md-2">
                        <span class="text-muted">4.0</span>
                    </div>
                    <div class="col-md-2">
                        <button type="button" class="btn btn-outline-danger btn-sm" onclick="this.closest('.course-item').remove()">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        coursesList.insertAdjacentHTML('beforeend', courseHTML);
    }
};

// Chat Manager
const Chat = {
    init: function() {
        console.log('Chat initialized');
    }
};

// Blog Manager
const Blog = {
    init: function() {
        this.bindEvents();
    },
    
    bindEvents: function() {
        const searchInput = document.getElementById('blogSearch');
        const categoryButtons = document.querySelectorAll('#blog-page .btn[data-category]');
        
        if (searchInput) {
            searchInput.addEventListener('input', Utils.debounce((e) => {
                console.log('Blog search:', e.target.value);
            }, 300));
        }
        
        categoryButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                categoryButtons.forEach(btn => {
                    btn.classList.remove('btn-success');
                    btn.classList.add('btn-outline-success');
                });
                button.classList.remove('btn-outline-success');
                button.classList.add('btn-success');
                
                console.log('Blog category:', button.getAttribute('data-category'));
            });
        });
    }
};

// Dashboard Manager
const Dashboard = {
    init: function() {
        const user = Auth.currentUser;
        if (user) {
            const greeting = document.querySelector('#dashboard-page .display-4');
            if (greeting) {
                greeting.textContent = `Welcome back, ${user.name}! 👋`;
            }
        }
    }
};

// Theme Manager
const Theme = {
    init: function() {
        const themeToggle = document.getElementById('themeToggle');
        const savedTheme = Utils.getFromStorage('theme', 'light');
        
        // Apply saved theme
        this.applyTheme(savedTheme);
        
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                const currentTheme = document.documentElement.getAttribute('data-bs-theme') || 'light';
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                
                this.applyTheme(newTheme);
                Utils.saveToStorage('theme', newTheme);
            });
        }
    },
    
    applyTheme: function(theme) {
        const themeToggle = document.getElementById('themeToggle');
        const icon = themeToggle?.querySelector('i');
        
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-bs-theme', 'dark');
            if (icon) {
                icon.className = 'bi bi-sun';
            }
        } else {
            document.documentElement.setAttribute('data-bs-theme', 'light');
            if (icon) {
                icon.className = 'bi bi-moon';
            }
        }
    }
};

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    Navigation.init();
    Auth.init();
    Theme.init();
    
    console.log('BiTS Connect Bootstrap frontend initialized successfully');
});

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