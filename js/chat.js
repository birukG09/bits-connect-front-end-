// Chat management
class ChatManager {
    constructor() {
        this.chats = [
            {
                id: '1',
                name: 'CS Study Group',
                type: 'group',
                avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=cs-group',
                lastMessage: 'Hey everyone, ready for the exam?',
                lastMessageTime: new Date(Date.now() - 5 * 60 * 1000),
                unreadCount: 3,
                isOnline: true,
                members: 12
            },
            {
                id: '2',
                name: 'Sarah Johnson',
                type: 'direct',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
                lastMessage: 'Thanks for sharing those notes!',
                lastMessageTime: new Date(Date.now() - 15 * 60 * 1000),
                unreadCount: 1,
                isOnline: true
            },
            {
                id: '3',
                name: 'Math Tutoring',
                type: 'group',
                avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=math-group',
                lastMessage: 'Can someone help with problem 15?',
                lastMessageTime: new Date(Date.now() - 30 * 60 * 1000),
                unreadCount: 0,
                isOnline: false,
                members: 8
            },
            {
                id: '4',
                name: 'Alex Kumar',
                type: 'direct',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
                lastMessage: 'See you in the library tomorrow',
                lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
                unreadCount: 0,
                isOnline: false
            }
        ];
        
        this.messages = {
            '1': [
                {
                    id: '1',
                    senderId: 'sarah',
                    senderName: 'Sarah Johnson',
                    senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
                    content: 'Hey everyone! I just uploaded the lecture notes from today\'s class. Check them out in the library section.',
                    timestamp: new Date(Date.now() - 60 * 60 * 1000),
                    type: 'text'
                },
                {
                    id: '2',
                    senderId: 'alex',
                    senderName: 'Alex Kumar',
                    senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
                    content: 'Thanks Sarah! That\'s really helpful. I was struggling with the recursion examples.',
                    timestamp: new Date(Date.now() - 58 * 60 * 1000),
                    type: 'text'
                },
                {
                    id: '3',
                    senderId: 'current',
                    senderName: 'You',
                    senderAvatar: window.authManager?.getCurrentUser()?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=current',
                    content: 'Same here! The binary tree traversal part was confusing. Can we schedule a study session?',
                    timestamp: new Date(Date.now() - 55 * 60 * 1000),
                    type: 'text'
                }
            ]
        };
        
        this.selectedChatId = null;
    }
    
    initialize() {
        this.bindEvents();
        this.renderChatList();
    }
    
    bindEvents() {
        const chatSearch = document.getElementById('chat-search');
        const messageInput = document.getElementById('message-input');
        const sendBtn = document.getElementById('send-message-btn');
        
        if (chatSearch) {
            chatSearch.addEventListener('input', Utils.debounce((e) => {
                this.filterChats(e.target.value);
            }, 300));
        }
        
        if (messageInput) {
            messageInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
        }
        
        if (sendBtn) {
            sendBtn.addEventListener('click', () => this.sendMessage());
        }
    }
    
    filterChats(searchTerm) {
        const filteredChats = this.chats.filter(chat =>
            chat.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        this.renderChatList(filteredChats);
    }
    
    renderChatList(chatsToRender = this.chats) {
        const container = document.getElementById('chat-list');
        if (!container) return;
        
        container.innerHTML = chatsToRender.map(chat => `
            <div class="chat-item ${this.selectedChatId === chat.id ? 'active' : ''}" onclick="chatManager.selectChat('${chat.id}')">
                <div class="chat-avatar ${chat.isOnline ? 'online' : ''}">
                    <img src="${chat.avatar}" alt="${chat.name}">
                </div>
                <div class="chat-info">
                    <div class="chat-name">
                        ${chat.type === 'group' ? '<i class="fas fa-hashtag"></i>' : ''}
                        ${chat.name}
                    </div>
                    <div class="chat-last-message">${chat.lastMessage}</div>
                    ${chat.type === 'group' ? `<div class="text-xs text-white/50 mt-1"><i class="fas fa-users"></i> ${chat.members} members</div>` : ''}
                </div>
                <div class="chat-meta">
                    <div class="text-xs">${Utils.formatTimeAgo(chat.lastMessageTime)}</div>
                    ${chat.unreadCount > 0 ? `<div class="chat-unread">${chat.unreadCount}</div>` : ''}
                </div>
            </div>
        `).join('');
    }
    
    selectChat(chatId) {
        this.selectedChatId = chatId;
        const chat = this.chats.find(c => c.id === chatId);
        
        if (chat) {
            // Mark as read
            chat.unreadCount = 0;
            
            // Update UI
            this.renderChatList();
            this.showChatWindow(chat);
            this.renderMessages(chatId);
        }
    }
    
    showChatWindow(chat) {
        const welcome = document.getElementById('chat-welcome');
        const chatWindow = document.getElementById('chat-window');
        
        if (welcome) welcome.classList.add('hidden');
        if (chatWindow) chatWindow.classList.remove('hidden');
        
        // Update chat header
        const chatAvatar = chatWindow.querySelector('.chat-avatar img');
        const chatName = chatWindow.querySelector('.chat-name');
        const chatStatus = chatWindow.querySelector('.chat-status');
        
        if (chatAvatar) chatAvatar.src = chat.avatar;
        if (chatName) {
            chatName.innerHTML = `
                ${chat.type === 'group' ? '<i class="fas fa-hashtag"></i>' : ''}
                ${chat.name}
            `;
        }
        if (chatStatus) {
            chatStatus.textContent = chat.type === 'group' 
                ? `${chat.members} members`
                : chat.isOnline ? 'Online' : 'Last seen recently';
        }
    }
    
    renderMessages(chatId) {
        const container = document.getElementById('chat-messages');
        if (!container) return;
        
        const messages = this.messages[chatId] || [];
        const currentUser = window.authManager?.getCurrentUser();
        
        container.innerHTML = messages.map(message => {
            const isOwnMessage = message.senderId === 'current' || 
                (currentUser && message.senderId === currentUser.id);
            
            return `
                <div class="message ${isOwnMessage ? 'own' : ''}">
                    <img src="${message.senderAvatar}" alt="${message.senderName}" class="message-avatar">
                    <div class="message-content">
                        <div class="message-header">
                            <span class="message-sender">${message.senderName}</span>
                            <span class="message-time">${message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <div class="message-bubble">
                            ${message.content}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        
        // Scroll to bottom
        container.scrollTop = container.scrollHeight;
    }
    
    sendMessage() {
        const messageInput = document.getElementById('message-input');
        if (!messageInput || !this.selectedChatId) return;
        
        const content = messageInput.value.trim();
        if (!content) return;
        
        const currentUser = window.authManager?.getCurrentUser();
        if (!currentUser) {
            Utils.showToast('Please log in to send messages', 'error');
            return;
        }
        
        const newMessage = {
            id: Utils.generateId(),
            senderId: 'current',
            senderName: 'You',
            senderAvatar: currentUser.avatar,
            content: content,
            timestamp: new Date(),
            type: 'text'
        };
        
        // Add message to chat
        if (!this.messages[this.selectedChatId]) {
            this.messages[this.selectedChatId] = [];
        }
        this.messages[this.selectedChatId].push(newMessage);
        
        // Update chat last message
        const chat = this.chats.find(c => c.id === this.selectedChatId);
        if (chat) {
            chat.lastMessage = content;
            chat.lastMessageTime = new Date();
        }
        
        // Clear input and update UI
        messageInput.value = '';
        this.renderChatList();
        this.renderMessages(this.selectedChatId);
    }
    
    getRecentChats() {
        return this.chats.slice(0, 3).map(chat => ({
            id: chat.id,
            name: chat.name,
            lastMessage: chat.lastMessage,
            time: Utils.formatTimeAgo(chat.lastMessageTime),
            unread: chat.unreadCount,
            avatar: chat.avatar
        }));
    }
}

// Initialize chat manager
window.chatManager = new ChatManager();