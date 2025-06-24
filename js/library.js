// Library management
class LibraryManager {
    constructor() {
        this.resources = [
            {
                id: 1,
                title: 'Advanced Algorithms & Data Structures',
                description: 'Comprehensive guide covering sorting, searching, and optimization algorithms',
                author: 'Dr. Sarah Johnson',
                department: 'computer-science',
                category: 'lectures',
                rating: 4.8,
                downloads: 1250,
                fileType: 'PDF',
                size: 12400000,
                thumbnail: 'https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=400',
                uploadedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
            },
            {
                id: 2,
                title: 'Quantum Mechanics Fundamentals',
                description: 'Introduction to quantum theory and its applications in modern physics',
                author: 'Prof. Michael Chen',
                department: 'physics',
                category: 'videos',
                rating: 4.9,
                downloads: 892,
                fileType: 'MP4',
                size: 245000000,
                thumbnail: 'https://images.pexels.com/photos/207529/pexels-photo-207529.jpeg?auto=compress&cs=tinysrgb&w=400',
                uploadedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
            },
            {
                id: 3,
                title: 'Organic Chemistry Reactions',
                description: 'Complete reference for organic synthesis and reaction mechanisms',
                author: 'Dr. Emily Rodriguez',
                department: 'chemistry',
                category: 'lectures',
                rating: 4.7,
                downloads: 756,
                fileType: 'PDF',
                size: 18700000,
                thumbnail: 'https://images.pexels.com/photos/2280549/pexels-photo-2280549.jpeg?auto=compress&cs=tinysrgb&w=400',
                uploadedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            },
            {
                id: 4,
                title: 'Machine Learning Foundations',
                description: 'Essential concepts in ML including supervised and unsupervised learning',
                author: 'Dr. Alex Kumar',
                department: 'computer-science',
                category: 'lectures',
                rating: 4.6,
                downloads: 1680,
                fileType: 'PDF',
                size: 25300000,
                thumbnail: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=400',
                uploadedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
            },
            {
                id: 5,
                title: 'Calculus III Video Series',
                description: 'Complete video course on multivariable calculus and vector analysis',
                author: 'Prof. Lisa Wang',
                department: 'mathematics',
                category: 'videos',
                rating: 4.9,
                downloads: 2100,
                fileType: 'MP4',
                size: 1200000000,
                thumbnail: 'https://images.pexels.com/photos/3729557/pexels-photo-3729557.jpeg?auto=compress&cs=tinysrgb&w=400',
                uploadedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000)
            },
            {
                id: 6,
                title: 'Cell Biology Illustrated',
                description: 'Visual guide to cellular structures and biological processes',
                author: 'Dr. Robert Smith',
                department: 'biology',
                category: 'lectures',
                rating: 4.5,
                downloads: 934,
                fileType: 'PDF',
                size: 45200000,
                thumbnail: 'https://images.pexels.com/photos/954929/pexels-photo-954929.jpeg?auto=compress&cs=tinysrgb&w=400',
                uploadedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
            }
        ];
        
        this.filteredResources = [...this.resources];
        this.currentFilters = {
            search: '',
            department: 'all',
            category: 'all'
        };
    }
    
    initialize() {
        this.bindEvents();
        this.renderResources();
    }
    
    bindEvents() {
        const searchInput = document.getElementById('library-search');
        const departmentFilter = document.getElementById('department-filter');
        const categoryButtons = document.querySelectorAll('#library-page .filter-btn');
        
        if (searchInput) {
            searchInput.addEventListener('input', Utils.debounce((e) => {
                this.currentFilters.search = e.target.value;
                this.applyFilters();
            }, 300));
        }
        
        if (departmentFilter) {
            departmentFilter.addEventListener('change', (e) => {
                this.currentFilters.department = e.target.value;
                this.applyFilters();
            });
        }
        
        categoryButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                // Update active state
                categoryButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                this.currentFilters.category = button.getAttribute('data-category');
                this.applyFilters();
            });
        });
    }
    
    applyFilters() {
        this.filteredResources = this.resources.filter(resource => {
            const matchesSearch = !this.currentFilters.search || 
                resource.title.toLowerCase().includes(this.currentFilters.search.toLowerCase()) ||
                resource.description.toLowerCase().includes(this.currentFilters.search.toLowerCase()) ||
                resource.author.toLowerCase().includes(this.currentFilters.search.toLowerCase());
            
            const matchesDepartment = this.currentFilters.department === 'all' || 
                resource.department === this.currentFilters.department;
            
            const matchesCategory = this.currentFilters.category === 'all' || 
                resource.category === this.currentFilters.category;
            
            return matchesSearch && matchesDepartment && matchesCategory;
        });
        
        this.renderResources();
    }
    
    renderResources() {
        const container = document.getElementById('resources-grid');
        if (!container) return;
        
        if (this.filteredResources.length === 0) {
            container.innerHTML = `
                <div class="col-span-full">
                    <div class="glass-card text-center py-12">
                        <i class="fas fa-book-open text-6xl text-white/50 mb-4"></i>
                        <h3 class="text-xl font-semibold text-white mb-2">No resources found</h3>
                        <p class="text-white/70">Try adjusting your search terms or filters to find what you're looking for.</p>
                    </div>
                </div>
            `;
            return;
        }
        
        container.innerHTML = this.filteredResources.map(resource => `
            <div class="resource-card glass-card animate-fadeIn">
                <img src="${resource.thumbnail}" alt="${resource.title}" class="resource-thumbnail">
                
                <div class="resource-meta">
                    <span class="resource-category">${this.getDepartmentName(resource.department)}</span>
                    <div class="resource-rating">
                        <i class="fas fa-star"></i>
                        <span>${resource.rating}</span>
                    </div>
                </div>
                
                <h3>${resource.title}</h3>
                <p class="resource-description">${resource.description}</p>
                <p class="resource-author">by ${resource.author}</p>
                
                <div class="resource-stats">
                    <span>${resource.downloads} downloads</span>
                    <span>${Utils.formatFileSize(resource.size)}</span>
                </div>
                
                <div class="resource-actions">
                    <button class="btn btn-primary" onclick="libraryManager.viewResource(${resource.id})">
                        <i class="fas fa-eye"></i>
                        View
                    </button>
                    <button class="btn btn-icon" onclick="libraryManager.downloadResource(${resource.id})">
                        <i class="fas fa-download"></i>
                    </button>
                    <button class="btn btn-icon" onclick="libraryManager.bookmarkResource(${resource.id})">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }
    
    getDepartmentName(department) {
        const departments = {
            'computer-science': 'Computer Science',
            'mathematics': 'Mathematics',
            'physics': 'Physics',
            'chemistry': 'Chemistry',
            'biology': 'Biology'
        };
        return departments[department] || department;
    }
    
    viewResource(id) {
        const resource = this.resources.find(r => r.id === id);
        if (resource) {
            Utils.showToast(`Opening ${resource.title}...`, 'info');
            // In a real app, this would open the resource viewer
        }
    }
    
    downloadResource(id) {
        const resource = this.resources.find(r => r.id === id);
        if (resource) {
            // Increment download count
            resource.downloads++;
            
            Utils.showToast(`Downloading ${resource.title}...`, 'success');
            
            // In a real app, this would trigger the actual download
            // Utils.downloadFile(resource.url, resource.title);
            
            // Update the display
            this.renderResources();
        }
    }
    
    bookmarkResource(id) {
        const resource = this.resources.find(r => r.id === id);
        if (resource) {
            // Get current bookmarks
            const bookmarks = Utils.getFromStorage('bookmarks', []);
            
            // Check if already bookmarked
            const isBookmarked = bookmarks.some(b => b.id === id);
            
            if (isBookmarked) {
                // Remove bookmark
                const updatedBookmarks = bookmarks.filter(b => b.id !== id);
                Utils.saveToStorage('bookmarks', updatedBookmarks);
                Utils.showToast('Removed from bookmarks', 'info');
            } else {
                // Add bookmark
                bookmarks.push({
                    id: resource.id,
                    title: resource.title,
                    author: resource.author,
                    category: this.getDepartmentName(resource.department),
                    rating: resource.rating,
                    bookmarkedAt: new Date().toISOString()
                });
                Utils.saveToStorage('bookmarks', bookmarks);
                Utils.showToast('Added to bookmarks!', 'success');
            }
        }
    }
    
    getBookmarkedResources() {
        return Utils.getFromStorage('bookmarks', []);
    }
}

// Initialize library manager
window.libraryManager = new LibraryManager();