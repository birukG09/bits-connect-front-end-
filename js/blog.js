// Blog management
class BlogManager {
    constructor() {
        this.blogPosts = [
            {
                id: '1',
                title: 'The Future of Artificial Intelligence in Education',
                excerpt: 'Exploring how AI is revolutionizing the way we learn and teach, from personalized learning paths to intelligent tutoring systems.',
                author: 'Dr. Sarah Chen',
                publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                category: 'ai',
                readTime: 8,
                imageUrl: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800',
                externalUrl: 'https://techcrunch.com/ai-education',
                source: 'TechCrunch'
            },
            {
                id: '2',
                title: 'React 18: What\'s New and Why It Matters',
                excerpt: 'A comprehensive look at React 18\'s new features including Concurrent Features, Suspense improvements, and automatic batching.',
                author: 'Alex Thompson',
                publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
                category: 'webdev',
                readTime: 12,
                imageUrl: 'https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg?auto=compress&cs=tinysrgb&w=800',
                externalUrl: 'https://blog.react.dev',
                source: 'React Blog'
            },
            {
                id: '3',
                title: 'Top 10 VS Code Extensions for Developers in 2024',
                excerpt: 'Boost your productivity with these essential Visual Studio Code extensions that every developer should know about.',
                author: 'Maria Rodriguez',
                publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
                category: 'tools',
                readTime: 6,
                imageUrl: 'https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=800',
                externalUrl: 'https://freecodecamp.org/vscode-extensions',
                source: 'FreeCodeCamp'
            },
            {
                id: '4',
                title: 'Breaking into Tech: A Complete Roadmap for 2024',
                excerpt: 'Everything you need to know about starting a career in technology, from choosing the right path to landing your first job.',
                author: 'David Kim',
                publishedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
                category: 'careers',
                readTime: 15,
                imageUrl: 'https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg?auto=compress&cs=tinysrgb&w=800',
                externalUrl: 'https://hackernoon.com/tech-careers-2024',
                source: 'Hacker Noon'
            },
            {
                id: '5',
                title: 'Machine Learning for Beginners: A Practical Guide',
                excerpt: 'Start your machine learning journey with this comprehensive guide covering the fundamentals and practical applications.',
                author: 'Prof. Robert Singh',
                publishedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
                category: 'ai',
                readTime: 20,
                imageUrl: 'https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=800',
                externalUrl: 'https://towardsdatascience.com/ml-beginners',
                source: 'Towards Data Science'
            },
            {
                id: '6',
                title: 'CSS Grid vs Flexbox: When to Use Which',
                excerpt: 'A detailed comparison of CSS Grid and Flexbox, helping you choose the right layout method for your projects.',
                author: 'Emma Johnson',
                publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                category: 'webdev',
                readTime: 8,
                imageUrl: 'https://images.pexels.com/photos/196645/pexels-photo-196645.jpeg?auto=compress&cs=tinysrgb&w=800',
                externalUrl: 'https://css-tricks.com/grid-vs-flexbox',
                source: 'CSS-Tricks'
            }
        ];
        
        this.filteredPosts = [...this.blogPosts];
        this.currentFilters = {
            search: '',
            category: 'all'
        };
    }
    
    initialize() {
        this.bindEvents();
        this.renderBlogPosts();
    }
    
    bindEvents() {
        const searchInput = document.getElementById('blog-search');
        const categoryButtons = document.querySelectorAll('#blog-page .filter-btn');
        
        if (searchInput) {
            searchInput.addEventListener('input', Utils.debounce((e) => {
                this.currentFilters.search = e.target.value;
                this.applyFilters();
            }, 300));
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
        this.filteredPosts = this.blogPosts.filter(post => {
            const matchesSearch = !this.currentFilters.search || 
                post.title.toLowerCase().includes(this.currentFilters.search.toLowerCase()) ||
                post.excerpt.toLowerCase().includes(this.currentFilters.search.toLowerCase()) ||
                post.author.toLowerCase().includes(this.currentFilters.search.toLowerCase());
            
            const matchesCategory = this.currentFilters.category === 'all' || 
                post.category === this.currentFilters.category;
            
            return matchesSearch && matchesCategory;
        });
        
        this.renderBlogPosts();
    }
    
    renderBlogPosts() {
        const container = document.getElementById('blog-grid');
        if (!container) return;
        
        if (this.filteredPosts.length === 0) {
            container.innerHTML = `
                <div class="col-span-full">
                    <div class="glass-card text-center py-12">
                        <i class="fas fa-search text-6xl text-white/50 mb-4"></i>
                        <h3 class="text-xl font-semibold text-white mb-2">No articles found</h3>
                        <p class="text-white/70">Try adjusting your search terms or selecting a different category.</p>
                    </div>
                </div>
            `;
            return;
        }
        
        container.innerHTML = this.filteredPosts.map(post => `
            <div class="blog-card glass-card animate-fadeIn">
                <a href="${post.externalUrl}" target="_blank" rel="noopener noreferrer">
                    <img src="${post.imageUrl}" alt="${post.title}" class="blog-thumbnail">
                    
                    <div class="blog-meta">
                        <span class="blog-category">${this.getCategoryName(post.category)}</span>
                        <span class="blog-date">${Utils.formatTimeAgo(post.publishedAt)}</span>
                    </div>
                    
                    <h3 class="blog-title">${post.title}</h3>
                    <p class="blog-excerpt">${post.excerpt}</p>
                    
                    <div class="blog-footer">
                        <div class="blog-author">
                            <i class="fas fa-user"></i>
                            <span>${post.author}</span>
                        </div>
                        <div class="blog-read-time">${post.readTime} min read</div>
                    </div>
                    
                    <div class="absolute top-4 right-4">
                        <div class="bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                            ${post.source}
                        </div>
                    </div>
                    
                    <div class="absolute top-4 left-4">
                        <div class="bg-black/50 p-2 rounded-full">
                            <i class="fas fa-external-link-alt text-white text-xs"></i>
                        </div>
                    </div>
                </a>
            </div>
        `).join('');
    }
    
    getCategoryName(category) {
        const categories = {
            'all': 'All Articles',
            'ai': 'AI & ML',
            'webdev': 'Web Dev',
            'tools': 'Dev Tools',
            'careers': 'Tech Careers'
        };
        return categories[category] || category;
    }
    
    getBlogPosts() {
        return this.blogPosts;
    }
    
    getFilteredPosts() {
        return this.filteredPosts;
    }
}

// Initialize blog manager
window.blogManager = new BlogManager();