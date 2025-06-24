// Authentication management
class AuthManager {
    constructor() {
        this.currentUser = Utils.getFromStorage('currentUser', null);
        this.isLoggedIn = !!this.currentUser;
        this.initializeAuth();
    }
    
    initializeAuth() {
        this.updateUI();
        this.bindEvents();
    }
    
    bindEvents() {
        const loginBtn = document.getElementById('login-btn');
        const logoutBtn = document.getElementById('logout-btn');
        const authForm = document.getElementById('auth-form');
        const authToggle = document.getElementById('auth-toggle');
        const modalClose = document.getElementById('modal-close');
        const passwordToggle = document.getElementById('password-toggle');
        
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
        
        if (modalClose) {
            modalClose.addEventListener('click', () => this.hideLoginModal());
        }
        
        if (passwordToggle) {
            passwordToggle.addEventListener('click', () => this.togglePassword());
        }
        
        // Close modal on outside click
        const modal = document.getElementById('login-modal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideLoginModal();
                }
            });
        }
    }
    
    showLoginModal() {
        const modal = document.getElementById('login-modal');
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }
    
    hideLoginModal() {
        const modal = document.getElementById('login-modal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
    
    toggleAuthMode() {
        const isLogin = document.getElementById('modal-title').textContent === 'Welcome Back';
        const modalTitle = document.getElementById('modal-title');
        const modalSubtitle = document.getElementById('modal-subtitle');
        const nameGroup = document.getElementById('name-group');
        const confirmPasswordGroup = document.getElementById('confirm-password-group');
        const loginOptions = document.getElementById('login-options');
        const authSubmitText = document.getElementById('auth-submit-text');
        const toggleText = document.getElementById('toggle-text');
        const authToggle = document.getElementById('auth-toggle');
        
        if (isLogin) {
            // Switch to register mode
            modalTitle.textContent = 'Join BiTS Connect';
            modalSubtitle.textContent = 'Create your account to start your journey';
            nameGroup.classList.remove('hidden');
            confirmPasswordGroup.classList.remove('hidden');
            loginOptions.classList.add('hidden');
            authSubmitText.textContent = 'Create Account';
            toggleText.textContent = 'Already have an account?';
            authToggle.textContent = 'Sign in';
        } else {
            // Switch to login mode
            modalTitle.textContent = 'Welcome Back';
            modalSubtitle.textContent = 'Sign in to your account to continue learning';
            nameGroup.classList.add('hidden');
            confirmPasswordGroup.classList.add('hidden');
            loginOptions.classList.remove('hidden');
            authSubmitText.textContent = 'Sign In';
            toggleText.textContent = "Don't have an account?";
            authToggle.textContent = 'Sign up';
        }
    }
    
    togglePassword() {
        const passwordInput = document.getElementById('password-input');
        const passwordToggle = document.getElementById('password-toggle');
        const icon = passwordToggle.querySelector('i');
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            icon.className = 'fas fa-eye-slash';
        } else {
            passwordInput.type = 'password';
            icon.className = 'fas fa-eye';
        }
    }
    
    async handleAuth(e) {
        e.preventDefault();
        
        const isLogin = document.getElementById('modal-title').textContent === 'Welcome Back';
        const email = document.getElementById('email-input').value;
        const password = document.getElementById('password-input').value;
        const name = document.getElementById('name-input').value;
        const confirmPassword = document.getElementById('confirm-password-input').value;
        
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
            // Simulate API call
            await Utils.simulateDelay(1500);
            
            if (isLogin) {
                await this.login(email, password);
            } else {
                await this.register(name, email, password);
            }
        } catch (error) {
            Utils.showToast('Authentication failed. Please try again.', 'error');
        }
    }
    
    async login(email, password) {
        // Mock login - in real app, this would call your PHP API
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
        if (window.navigation) {
            window.navigation.showPage('dashboard');
        }
    }
    
    async register(name, email, password) {
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
        if (window.navigation) {
            window.navigation.showPage('dashboard');
        }
    }
    
    logout() {
        this.currentUser = null;
        this.isLoggedIn = false;
        
        localStorage.removeItem('currentUser');
        this.updateUI();
        
        Utils.showToast('Logged out successfully', 'info');
        
        // Navigate to home
        if (window.navigation) {
            window.navigation.showPage('home');
        }
    }
    
    updateUI() {
        const loginBtn = document.getElementById('login-btn');
        const userProfile = document.getElementById('user-profile');
        const userAvatar = userProfile?.querySelector('.user-avatar');
        const userName = userProfile?.querySelector('.user-name');
        
        if (this.isLoggedIn && this.currentUser) {
            if (loginBtn) loginBtn.classList.add('hidden');
            if (userProfile) userProfile.classList.remove('hidden');
            
            if (userAvatar) userAvatar.src = this.currentUser.avatar;
            if (userName) userName.textContent = this.currentUser.name;
        } else {
            if (loginBtn) loginBtn.classList.remove('hidden');
            if (userProfile) userProfile.classList.add('hidden');
        }
    }
    
    getCurrentUser() {
        return this.currentUser;
    }
    
    isAuthenticated() {
        return this.isLoggedIn;
    }
    
    requireAuth() {
        if (!this.isLoggedIn) {
            this.showLoginModal();
            return false;
        }
        return true;
    }
}

// Initialize auth manager
window.authManager = new AuthManager();