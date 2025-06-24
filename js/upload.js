// Upload management
class UploadManager {
    constructor() {
        this.uploadedFiles = Utils.getFromStorage('uploadedFiles', []);
        this.isConverting = false;
    }
    
    initialize() {
        this.bindEvents();
        this.renderUploadedFiles();
    }
    
    bindEvents() {
        const dropzone = document.getElementById('dropzone');
        const fileInput = document.getElementById('file-input');
        const urlInput = document.getElementById('url-input');
        const convertBtn = document.getElementById('convert-btn');
        
        if (dropzone && fileInput) {
            // Dropzone events
            dropzone.addEventListener('click', () => fileInput.click());
            dropzone.addEventListener('dragover', this.handleDragOver.bind(this));
            dropzone.addEventListener('dragleave', this.handleDragLeave.bind(this));
            dropzone.addEventListener('drop', this.handleDrop.bind(this));
            
            // File input change
            fileInput.addEventListener('change', (e) => {
                this.handleFiles(Array.from(e.target.files));
            });
        }
        
        if (convertBtn) {
            convertBtn.addEventListener('click', () => this.convertUrl());
        }
        
        if (urlInput) {
            urlInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.convertUrl();
                }
            });
        }
    }
    
    handleDragOver(e) {
        e.preventDefault();
        e.stopPropagation();
        document.getElementById('dropzone').classList.add('dragover');
    }
    
    handleDragLeave(e) {
        e.preventDefault();
        e.stopPropagation();
        document.getElementById('dropzone').classList.remove('dragover');
    }
    
    handleDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        document.getElementById('dropzone').classList.remove('dragover');
        
        const files = Array.from(e.dataTransfer.files);
        this.handleFiles(files);
    }
    
    handleFiles(files) {
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
            validFiles.forEach(file => this.uploadFile(file));
            Utils.showToast(`${validFiles.length} file(s) uploaded successfully!`, 'success');
        }
    }
    
    uploadFile(file) {
        const uploadedFile = {
            id: Utils.generateId(),
            name: file.name,
            size: file.size,
            type: file.type,
            status: 'uploading',
            progress: 0,
            uploadedAt: new Date().toISOString(),
            thumbnail: this.getFileThumbnail(file.type)
        };
        
        this.uploadedFiles.unshift(uploadedFile);
        this.saveUploadedFiles();
        this.renderUploadedFiles();
        
        // Simulate upload progress
        this.simulateUpload(uploadedFile.id);
    }
    
    simulateUpload(fileId) {
        const interval = setInterval(() => {
            const fileIndex = this.uploadedFiles.findIndex(f => f.id === fileId);
            if (fileIndex === -1) {
                clearInterval(interval);
                return;
            }
            
            const file = this.uploadedFiles[fileIndex];
            const newProgress = file.progress + Math.random() * 20;
            
            if (newProgress >= 100) {
                clearInterval(interval);
                file.progress = 100;
                file.status = 'completed';
                file.url = `https://example.com/files/${file.name}`;
                file.convertedUrl = `https://example.com/converted/${file.name}`;
            } else {
                file.progress = newProgress;
            }
            
            this.saveUploadedFiles();
            this.renderUploadedFiles();
        }, 500);
    }
    
    async convertUrl() {
        const urlInput = document.getElementById('url-input');
        const convertBtn = document.getElementById('convert-btn');
        const url = urlInput.value.trim();
        
        if (!url) {
            Utils.showToast('Please enter a valid URL', 'error');
            return;
        }
        
        if (!Utils.isValidUrl(url)) {
            Utils.showToast('Please enter a valid URL', 'error');
            return;
        }
        
        this.isConverting = true;
        convertBtn.disabled = true;
        convertBtn.innerHTML = '<i class="fas fa-spinner animate-spin"></i> Converting...';
        
        try {
            // Simulate URL conversion
            await Utils.simulateDelay(3000);
            
            const convertedFile = {
                id: Utils.generateId(),
                name: `${new URL(url).hostname}.pdf`,
                size: Math.floor(Math.random() * 5000000) + 1000000, // Random size 1-5MB
                type: 'application/pdf',
                status: 'completed',
                progress: 100,
                url: url,
                convertedUrl: `https://example.com/converted/${new URL(url).hostname}.pdf`,
                uploadedAt: new Date().toISOString(),
                thumbnail: this.getFileThumbnail('application/pdf')
            };
            
            this.uploadedFiles.unshift(convertedFile);
            this.saveUploadedFiles();
            this.renderUploadedFiles();
            
            urlInput.value = '';
            Utils.showToast('URL converted to PDF successfully!', 'success');
            
        } catch (error) {
            Utils.showToast('Failed to convert URL. Please try again.', 'error');
        } finally {
            this.isConverting = false;
            convertBtn.disabled = false;
            convertBtn.innerHTML = 'Convert to PDF';
        }
    }
    
    getFileThumbnail(fileType) {
        const thumbnails = {
            'application/pdf': 'https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=400',
            'application/epub+zip': 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=400',
            'text/plain': 'https://images.pexels.com/photos/261763/pexels-photo-261763.jpeg?auto=compress&cs=tinysrgb&w=400',
            'application/msword': 'https://images.pexels.com/photos/261763/pexels-photo-261763.jpeg?auto=compress&cs=tinysrgb&w=400',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'https://images.pexels.com/photos/261763/pexels-photo-261763.jpeg?auto=compress&cs=tinysrgb&w=400'
        };
        
        return thumbnails[fileType] || 'https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=400';
    }
    
    renderUploadedFiles() {
        const container = document.getElementById('uploaded-files');
        if (!container) return;
        
        if (this.uploadedFiles.length === 0) {
            container.innerHTML = '';
            return;
        }
        
        container.innerHTML = `
            <div class="glass-card">
                <h2 class="mb-6">Recent Uploads (${this.uploadedFiles.length})</h2>
                <div class="space-y-4">
                    ${this.uploadedFiles.map(file => this.renderFileItem(file)).join('')}
                </div>
            </div>
        `;
    }
    
    renderFileItem(file) {
        const statusIcon = this.getStatusIcon(file.status);
        const progressBar = file.status === 'uploading' ? `
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${file.progress}%"></div>
            </div>
        ` : '';
        
        return `
            <div class="file-item">
                <img src="${file.thumbnail}" alt="${file.name}" class="file-thumbnail">
                
                <div class="file-info">
                    <div class="file-name">${file.name}</div>
                    <div class="file-meta">
                        <span>${Utils.formatFileSize(file.size)}</span>
                        <span>${file.status}</span>
                        <span>${Utils.formatTimeAgo(new Date(file.uploadedAt))}</span>
                    </div>
                    ${progressBar}
                </div>
                
                <div class="file-actions">
                    ${statusIcon}
                    ${file.status === 'completed' ? `
                        <button class="btn btn-icon" onclick="uploadManager.previewFile('${file.id}')" title="Preview">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-icon" onclick="uploadManager.downloadFile('${file.id}')" title="Download">
                            <i class="fas fa-download"></i>
                        </button>
                    ` : ''}
                    <button class="btn btn-icon" onclick="uploadManager.removeFile('${file.id}')" title="Remove" style="background: rgba(239, 68, 68, 0.2); color: #fca5a5;">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }
    
    getStatusIcon(status) {
        switch (status) {
            case 'uploading':
                return '<i class="fas fa-spinner animate-spin text-blue-400"></i>';
            case 'completed':
                return '<i class="fas fa-check-circle text-green-400"></i>';
            case 'error':
                return '<i class="fas fa-times-circle text-red-400"></i>';
            default:
                return '<i class="fas fa-file text-white/50"></i>';
        }
    }
    
    previewFile(fileId) {
        const file = this.uploadedFiles.find(f => f.id === fileId);
        if (file) {
            Utils.showToast(`Opening preview for ${file.name}...`, 'info');
            // In a real app, this would open a file preview modal
        }
    }
    
    downloadFile(fileId) {
        const file = this.uploadedFiles.find(f => f.id === fileId);
        if (file) {
            Utils.showToast(`Downloading ${file.name}...`, 'success');
            // In a real app, this would trigger the actual download
            // Utils.downloadFile(file.convertedUrl || file.url, file.name);
        }
    }
    
    removeFile(fileId) {
        this.uploadedFiles = this.uploadedFiles.filter(f => f.id !== fileId);
        this.saveUploadedFiles();
        this.renderUploadedFiles();
        Utils.showToast('File removed', 'info');
    }
    
    saveUploadedFiles() {
        Utils.saveToStorage('uploadedFiles', this.uploadedFiles);
    }
    
    getUploadedFiles() {
        return this.uploadedFiles;
    }
}

// Initialize upload manager
window.uploadManager = new UploadManager();