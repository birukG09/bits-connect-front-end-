// Dashboard management
class DashboardManager {
    constructor() {
        this.recentFiles = [
            {
                id: '1',
                name: 'Advanced Algorithms Notes',
                type: 'PDF',
                size: 2400000,
                uploadedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
                thumbnail: 'https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=100'
            },
            {
                id: '2',
                name: 'Quantum Physics Lecture',
                type: 'MP4',
                size: 145000000,
                uploadedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
                thumbnail: 'https://images.pexels.com/photos/207529/pexels-photo-207529.jpeg?auto=compress&cs=tinysrgb&w=100'
            },
            {
                id: '3',
                name: 'Chemistry Lab Report',
                type: 'DOCX',
                size: 1800000,
                uploadedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
                thumbnail: 'https://images.pexels.com/photos/2280549/pexels-photo-2280549.jpeg?auto=compress&cs=tinysrgb&w=100'
            }
        ];
    }
    
    initialize() {
        this.updateUserGreeting();
        this.renderRecentFiles();
        this.renderBookmarkedResources();
        this.renderRecentChats();
    }
    
    updateUserGreeting() {
        const user = window.authManager?.getCurrentUser();
        const greeting = document.querySelector('.page-header h1');
        
        if (greeting && user) {
            greeting.textContent = `Welcome back, ${user.name}! 👋`;
        }
    }
    
    renderRecentFiles() {
        const container = document.getElementById('recent-files');
        if (!container) return;
        
        container.innerHTML = this.recentFiles.map(file => `
            <div class="recent-file-item">
                <div class="file-icon">
                    <i class="fas fa-file-${this.getFileIcon(file.type)}"></i>
                </div>
                <div class="flex-1 min-w-0">
                    <h3 class="text-white font-medium truncate">${file.name}</h3>
                    <div class="flex items-center space-x-2 text-sm text-white/60">
                        <span>${file.type}</span>
                        <span>•</span>
                        <span>${Utils.formatFileSize(file.size)}</span>
                        <span>•</span>
                        <span>${Utils.formatTimeAgo(file.uploadedAt)}</span>
                    </div>
                </div>
                <div class="flex space-x-2">
                    <button class="btn btn-icon" onclick="dashboardManager.downloadFile('${file.id}')">
                        <i class="fas fa-download"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }
    
    renderBookmarkedResources() {
        const container = document.querySelector('.bookmarked-resources');
        if (!container) return;
        
        const bookmarks = window.libraryManager?.getBookmarkedResources() || [];
        const recentBookmarks = bookmarks.slice(0, 3);
        
        if (recentBookmarks.length === 0) {
            container.innerHTML = `
                <div class="text-center py-8 text-white/50">
                    <i class="fas fa-heart text-4xl mb-2"></i>
                    <p class="text-sm">No bookmarked resources yet</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = recentBookmarks.map(resource => `
            <div class="bookmarked-item">
                <h3 class="bookmarked-title">${resource.title}</h3>
                <p class="bookmarked-author">by ${resource.author}</p>
                <div class="bookmarked-footer">
                    <span class="bookmarked-category">${resource.category}</span>
                    <div class="bookmarked-rating">
                        <i class="fas fa-star"></i>
                        <span>${resource.rating}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    renderRecentChats() {
        const container = document.querySelector('.dashboard-sidebar .glass-card:last-child .recent-files');
        if (!container) return;
        
        const recentChats = window.chatManager?.getRecentChats() || [];
        
        if (recentChats.length === 0) {
            container.innerHTML = `
                <div class="text-center py-8 text-white/50">
                    <i class="fas fa-comments text-4xl mb-2"></i>
                    <p class="text-sm">No recent chats</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = recentChats.map(chat => `
            <div class="recent-file-item cursor-pointer" onclick="navigation.showPage('chat')">
                <img src="${chat.avatar}" alt="${chat.name}" class="w-10 h-10 rounded-full">
                <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between">
                        <h3 class="text-white font-medium text-sm truncate">${chat.name}</h3>
                        <span class="text-white/50 text-xs">${chat.time}</span>
                    </div>
                    <p class="text-white/70 text-xs truncate">${chat.lastMessage}</p>
                </div>
                ${chat.unread > 0 ? `
                    <span class="px-2 py-1 bg-green-500 text-white text-xs rounded-full">
                        ${chat.unread}
                    </span>
                ` : ''}
            </div>
        `).join('');
    }
    
    getFileIcon(fileType) {
        const icons = {
            'PDF': 'pdf',
            'MP4': 'video',
            'DOCX': 'word',
            'DOC': 'word',
            'TXT': 'text',
            'EPUB': 'book'
        };
        return icons[fileType] || 'file';
    }
    
    downloadFile(fileId) {
        const file = this.recentFiles.find(f => f.id === fileId);
        if (file) {
            Utils.showToast(`Downloading ${file.name}...`, 'success');
            // In a real app, this would trigger the actual download
        }
    }
    
    getRecentFiles() {
        return this.recentFiles;
    }
}

// Initialize dashboard manager
window.dashboardManager = new DashboardManager();