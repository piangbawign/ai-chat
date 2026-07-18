// AI Chat Application - Groq Version
class AIChat {
    constructor() {
        this.conversations = {};
        this.currentConversationId = null;
        this.settings = this.loadSettings();
        this.abortController = null;
        this.isGenerating = false;
        this.uploadedFiles = [];
        
        this.initElements();
        this.initEventListeners();
        this.initTheme();
        this.loadConversations();
        this.updateConnectionStatus();
    }
    
    initElements() {
        // Main elements
        this.sidebar = document.getElementById('sidebar');
        this.chatHistory = document.getElementById('chatHistory');
        this.messagesContainer = document.getElementById('messages');
        this.chatContainer = document.getElementById('chatContainer');
        this.chatInput = document.getElementById('chatInput');
        this.sendBtn = document.getElementById('sendBtn');
        this.stopBtn = document.getElementById('stopBtn');
        this.modelSelect = document.getElementById('modelSelect');
        this.modelSelectMobile = document.getElementById('modelSelectMobile');
        this.welcomeScreen = document.getElementById('welcomeScreen');
        this.connectionStatus = document.getElementById('connectionStatus');
        this.uploadedFilesContainer = document.getElementById('uploadedFiles');
        
        // Buttons
        this.newChatBtn = document.getElementById('newChatBtn');
        this.settingsBtn = document.getElementById('settingsBtn');
        this.mobileSettingsBtn = document.getElementById('mobileSettingsBtn');
        this.themeToggle = document.getElementById('themeToggle');
        this.refreshModels = document.getElementById('refreshModels');
        this.attachBtn = document.getElementById('attachBtn');
        this.fileInput = document.getElementById('fileInput');
        this.menuBtn = document.getElementById('menuBtn');
        
        // Modal elements
        this.settingsModal = document.getElementById('settingsModal');
        this.modalBackdrop = document.getElementById('modalBackdrop');
        this.closeModal = document.getElementById('closeModal');
        this.cancelSettings = document.getElementById('cancelSettings');
        this.saveSettingsBtn = document.getElementById('saveSettings');
        
        // Settings inputs
        this.apiKeyInput = document.getElementById('apiKey');
        this.systemPromptInput = document.getElementById('systemPrompt');
        this.temperatureInput = document.getElementById('temperature');
        this.tempValue = document.getElementById('tempValue');
        this.maxTokensInput = document.getElementById('maxTokens');
        this.streamResponsesInput = document.getElementById('streamResponses');
        this.saveHistoryInput = document.getElementById('saveHistory');
        
        // Populate model select
        this.populateModels();
    }
    
    populateModels() {
        const models = [
            { id: 'llama-3.3-70b-versatile', name: 'Llama 3.3 70B (Best)' },
            { id: 'llama-3.1-8b-instant', name: 'Llama 3.1 8B (Fast)' },
            { id: 'openai/gpt-oss-120b', name: 'GPT-OSS 120B' },
            { id: 'openai/gpt-oss-20b', name: 'GPT-OSS 20B (Fastest)' }
        ];
        
        const options = models.map(m => 
            `<option value="${m.id}">${m.name}</option>`
        ).join('');
        
        this.modelSelect.innerHTML = options;
        this.modelSelectMobile.innerHTML = options;
        
        if (this.settings.model) {
            this.modelSelect.value = this.settings.model;
            this.modelSelectMobile.value = this.settings.model;
        }
    }
    
    initEventListeners() {
        // Chat input
        this.chatInput.addEventListener('input', () => this.autoResizeTextarea());
        this.chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        // Buttons
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        this.stopBtn.addEventListener('click', () => this.stopGeneration());
        this.newChatBtn.addEventListener('click', () => this.newConversation());
        this.settingsBtn.addEventListener('click', () => this.openSettings());
        this.mobileSettingsBtn.addEventListener('click', () => this.openSettings());
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
        this.refreshModels.addEventListener('click', () => this.populateModels());
        this.attachBtn.addEventListener('click', () => this.fileInput.click());
        this.fileInput.addEventListener('change', (e) => this.handleFileUpload(e));
        this.menuBtn.addEventListener('click', () => this.toggleSidebar());
        
        // Model selection
        this.modelSelect.addEventListener('change', (e) => {
            this.settings.model = e.target.value;
            this.modelSelectMobile.value = e.target.value;
            this.saveSettings();
        });
        this.modelSelectMobile.addEventListener('change', (e) => {
            this.settings.model = e.target.value;
            this.modelSelect.value = e.target.value;
            this.saveSettings();
        });
        
        // Modal
        this.closeModal.addEventListener('click', () => this.closeSettings());
        this.cancelSettings.addEventListener('click', () => this.closeSettings());
        this.modalBackdrop.addEventListener('click', () => this.closeSettings());
        this.saveSettingsBtn.addEventListener('click', () => this.saveSettingsFromModal());
        
        // Settings inputs
        this.temperatureInput.addEventListener('input', (e) => {
            this.tempValue.textContent = e.target.value;
        });
        
        // Close sidebar on overlay click
        document.addEventListener('click', (e) => {
            if (this.sidebar.classList.contains('open') && 
                !this.sidebar.contains(e.target) && 
                e.target !== this.menuBtn) {
                this.toggleSidebar();
            }
        });
    }
    
    // Theme Management
    initTheme() {
        const savedTheme = localStorage.getItem('chatTheme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
    }
    
    toggleTheme() {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('chatTheme', next);
    }
    
    // Settings Management
    loadSettings() {
        const defaults = {
            apiKey: '',
            model: 'llama-3.3-70b-versatile',
            systemPrompt: 'You are a helpful AI assistant. You help with coding, reasoning, and general questions.',
            temperature: 0.7,
            maxTokens: 2048,
            streamResponses: true,
            saveHistory: true
        };
        
        const saved = localStorage.getItem('chatSettings');
        return saved ? { ...defaults, ...JSON.parse(saved) } : defaults;
    }
    
    saveSettings() {
        localStorage.setItem('chatSettings', JSON.stringify(this.settings));
    }
    
    openSettings() {
        this.apiKeyInput.value = this.settings.apiKey;
        this.systemPromptInput.value = this.settings.systemPrompt;
        this.temperatureInput.value = this.settings.temperature;
        this.tempValue.textContent = this.settings.temperature;
        this.maxTokensInput.value = this.settings.maxTokens;
        this.streamResponsesInput.checked = this.settings.streamResponses;
        this.saveHistoryInput.checked = this.settings.saveHistory;
        this.settingsModal.classList.remove('hidden');
    }
    
    closeSettings() {
        this.settingsModal.classList.add('hidden');
    }
    
    saveSettingsFromModal() {
        this.settings.apiKey = this.apiKeyInput.value.trim();
        this.settings.systemPrompt = this.systemPromptInput.value;
        this.settings.temperature = parseFloat(this.temperatureInput.value);
        this.settings.maxTokens = parseInt(this.maxTokensInput.value);
        this.settings.streamResponses = this.streamResponsesInput.checked;
        this.settings.saveHistory = this.saveHistoryInput.checked;
        this.saveSettings();
        this.closeSettings();
        this.updateConnectionStatus();
    }
    
    updateConnectionStatus() {
        if (this.settings.apiKey) {
            this.connectionStatus.classList.add('connected');
            this.connectionStatus.querySelector('.status-text').textContent = 'Connected';
        } else {
            this.connectionStatus.classList.remove('connected');
            this.connectionStatus.querySelector('.status-text').textContent = 'No API Key';
        }
    }
    
    // Sidebar
    toggleSidebar() {
        this.sidebar.classList.toggle('open');
        
        // Create/remove overlay
        let overlay = document.querySelector('.sidebar-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'sidebar-overlay';
            overlay.addEventListener('click', () => this.toggleSidebar());
            document.body.appendChild(overlay);
        }
        overlay.classList.toggle('active', this.sidebar.classList.contains('open'));
    }
    
    // Conversation Management
    newConversation() {
        const id = Date.now().toString();
        this.conversations[id] = {
            id,
            title: 'New Chat',
            messages: [],
            createdAt: new Date().toISOString()
        };
        this.currentConversationId = id;
        this.renderChatHistory();
        this.renderMessages();
        this.saveConversations();
        this.chatInput.focus();
        
        // Close sidebar on mobile
        if (window.innerWidth <= 768) {
            this.toggleSidebar();
        }
    }
    
    loadConversations() {
        const saved = localStorage.getItem('chatConversations');
        if (saved) {
            this.conversations = JSON.parse(saved);
            
            // Get the last active conversation
            const lastId = localStorage.getItem('lastConversationId');
            if (lastId && this.conversations[lastId]) {
                this.currentConversationId = lastId;
            } else {
                const ids = Object.keys(this.conversations);
                this.currentConversationId = ids.length > 0 ? ids[ids.length - 1] : null;
            }
        }
        
        this.renderChatHistory();
        this.renderMessages();
    }
    
    saveConversations() {
        if (!this.settings.saveHistory) return;
        localStorage.setItem('chatConversations', JSON.stringify(this.conversations));
        localStorage.setItem('lastConversationId', this.currentConversationId);
    }
    
    renderChatHistory() {
        const sorted = Object.values(this.conversations)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        if (sorted.length === 0) {
            this.chatHistory.innerHTML = '<p class="empty-state">No conversations yet</p>';
            return;
        }
        
        this.chatHistory.innerHTML = sorted.map(conv => `
            <div class="chat-history-item ${conv.id === this.currentConversationId ? 'active' : ''}" 
                 data-id="${conv.id}">
                <span class="chat-title">${this.escapeHtml(conv.title)}</span>
                <button class="delete-chat" data-id="${conv.id}" title="Delete">×</button>
            </div>
        `).join('');
        
        // Add event listeners
        this.chatHistory.querySelectorAll('.chat-history-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (!e.target.classList.contains('delete-chat')) {
                    this.selectConversation(item.dataset.id);
                }
            });
        });
        
        this.chatHistory.querySelectorAll('.delete-chat').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteConversation(btn.dataset.id);
            });
        });
    }
    
    selectConversation(id) {
        this.currentConversationId = id;
        this.renderChatHistory();
        this.renderMessages();
        
        // Close sidebar on mobile
        if (window.innerWidth <= 768) {
            this.toggleSidebar();
        }
    }
    
    deleteConversation(id) {
        if (!confirm('Delete this conversation?')) return;
        delete this.conversations[id];
        
        if (this.currentConversationId === id) {
            const ids = Object.keys(this.conversations);
            this.currentConversationId = ids.length > 0 ? ids[ids.length - 1] : null;
        }
        
        this.saveConversations();
        this.renderChatHistory();
        this.renderMessages();
    }
    
    // Messages
    renderMessages() {
        if (!this.currentConversationId || !this.conversations[this.currentConversationId]) {
            this.welcomeScreen.classList.remove('hidden');
            this.messagesContainer.innerHTML = '';
            return;
        }
        
        const conv = this.conversations[this.currentConversationId];
        
        if (conv.messages.length === 0) {
            this.welcomeScreen.classList.remove('hidden');
            this.messagesContainer.innerHTML = '';
            return;
        }
        
        this.welcomeScreen.classList.add('hidden');
        this.messagesContainer.innerHTML = conv.messages.map(msg => this.renderMessage(msg)).join('');
        this.scrollToBottom();
        
        // Initialize syntax highlighting
        this.messagesContainer.querySelectorAll('pre code').forEach(block => {
            hljs.highlightElement(block);
        });
    }
    
    renderMessage(msg) {
        const isUser = msg.role === 'user';
        const avatar = isUser ? '👤' : '🤖';
        const time = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        let content = msg.content;
        if (!isUser) {
            content = this.formatMessage(content);
        }
        
        return `
            <div class="message ${msg.role}">
                <div class="message-avatar">${avatar}</div>
                <div class="message-content">
                    <div class="message-header">
                        <span class="message-role">${isUser ? 'You' : 'AI'}</span>
                        <span class="message-time">${time}</span>
                    </div>
                    <div class="message-body">${isUser ? this.escapeHtml(content).replace(/\n/g, '<br>') : content}</div>
                </div>
            </div>
        `;
    }
    
    formatMessage(text) {
        // Configure marked
        marked.setOptions({
            highlight: function(code, lang) {
                if (lang && hljs.getLanguage(lang)) {
                    return hljs.highlight(code, { language: lang }).value;
                }
                return hljs.highlightAuto(code).value;
            },
            breaks: true,
            gfm: true
        });
        
        // Custom renderer for code blocks with copy button
        const renderer = new marked.Renderer();
        renderer.code = function(code, language) {
            const lang = language || 'plaintext';
            const highlighted = hljs.getLanguage(lang) 
                ? hljs.highlight(code, { language: lang }).value 
                : hljs.highlightAuto(code).value;
            
            return `<pre><div class="code-header"><span>${lang}</span><button class="copy-code-btn" onclick="app.copyCode(this)">📋 Copy</button></div><code class="hljs language-${lang}">${highlighted}</code></pre>`;
        };
        
        return marked.parse(text, { renderer });
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    scrollToBottom() {
        this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
    }
    
    // Send Message
    async sendMessage() {
        const content = this.chatInput.value.trim();
        if (!content && this.uploadedFiles.length === 0) return;
        if (this.isGenerating) return;
        
        if (!this.settings.apiKey) {
            alert('Please add your Groq API key in Settings');
            this.openSettings();
            return;
        }
        
        // Create conversation if needed
        if (!this.currentConversationId) {
            this.newConversation();
        }
        
        const conv = this.conversations[this.currentConversationId];
        
        // Build user message
        let userMessage = content;
        if (this.uploadedFiles.length > 0) {
            const fileContents = await Promise.all(
                this.uploadedFiles.map(async (file) => {
                    const text = await this.readFileContent(file);
                    return `\n\n[File: ${file.name}]\n\`\`\`\n${text}\n\`\`\``;
                })
            );
            userMessage = content + fileContents.join('');
        }
        
        // Add user message
        conv.messages.push({
            role: 'user',
            content: userMessage,
            timestamp: new Date().toISOString()
        });
        
        // Update title from first message
        if (conv.messages.length === 1) {
            conv.title = content.substring(0, 50) || 'New Chat';
            this.renderChatHistory();
        }
        
        // Clear input
        this.chatInput.value = '';
        this.autoResizeTextarea();
        this.clearUploadedFiles();
        
        // Render messages
        this.renderMessages();
        
        // Generate AI response
        await this.generateResponse(conv);
    }
    
    async generateResponse(conv) {
        this.isGenerating = true;
        this.sendBtn.classList.add('hidden');
        this.stopBtn.classList.remove('hidden');
        
        // Add thinking indicator
        const thinkingDiv = document.createElement('div');
        thinkingDiv.className = 'message assistant';
        thinkingDiv.innerHTML = `
            <div class="message-avatar">🤖</div>
            <div class="message-content">
                <div class="message-header">
                    <span class="message-role">AI</span>
                </div>
                <div class="message-body">
                    <div class="thinking-indicator">
                        <div class="thinking-dots">
                            <span></span><span></span><span></span>
                        </div>
                        <span>Thinking...</span>
                    </div>
                </div>
            </div>
        `;
        this.messagesContainer.appendChild(thinkingDiv);
        this.scrollToBottom();
        
        // Prepare messages for Groq API (OpenAI compatible)
        const messages = [];
        
        // Add system instruction if present
        if (this.settings.systemPrompt) {
            messages.push({
                role: 'system',
                content: this.settings.systemPrompt
            });
        }
        
        // Add conversation messages
        for (const msg of conv.messages) {
            messages.push({
                role: msg.role,
                content: msg.content
            });
        }
        
        this.abortController = new AbortController();
        
        try {
            const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.settings.apiKey}`
                },
                body: JSON.stringify({
                    model: this.settings.model,
                    messages: messages,
                    temperature: this.settings.temperature,
                    max_tokens: this.settings.maxTokens,
                    stream: this.settings.streamResponses
                }),
                signal: this.abortController.signal
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || `HTTP error ${response.status}`);
            }
            
            if (this.settings.streamResponses) {
                await this.handleStreamResponse(response, conv, thinkingDiv);
            } else {
                const data = await response.json();
                const aiResponse = data.choices[0].message.content;
                
                // Update thinking div with response
                thinkingDiv.querySelector('.message-body').innerHTML = this.formatMessage(aiResponse);
                
                // Add to conversation
                conv.messages.push({
                    role: 'assistant',
                    content: aiResponse,
                    timestamp: new Date().toISOString()
                });
            }
        } catch (error) {
            if (error.name === 'AbortError') {
                thinkingDiv.querySelector('.message-body').innerHTML = '<em>Generation stopped</em>';
            } else {
                thinkingDiv.querySelector('.message-body').innerHTML = `
                    <div class="error-message">
                        Error: ${error.message}
                    </div>
                `;
            }
        } finally {
            this.isGenerating = false;
            this.sendBtn.classList.remove('hidden');
            this.stopBtn.classList.add('hidden');
            this.abortController = null;
            this.saveConversations();
        }
    }
    
    async handleStreamResponse(response, conv, thinkingDiv) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullResponse = '';
        const messageBody = thinkingDiv.querySelector('.message-body');
        
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            const chunk = decoder.decode(value);
            const lines = chunk.split('\n').filter(line => line.trim() && line.trim() !== 'data: [DONE]');
            
            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    try {
                        const data = JSON.parse(line.slice(6));
                        if (data.choices && data.choices[0] && data.choices[0].delta && data.choices[0].delta.content) {
                            fullResponse += data.choices[0].delta.content;
                            messageBody.innerHTML = this.formatMessage(fullResponse);
                            this.scrollToBottom();
                        }
                    } catch (e) {
                        // Skip invalid JSON
                    }
                }
            }
        }
        
        // Add to conversation
        conv.messages.push({
            role: 'assistant',
            content: fullResponse,
            timestamp: new Date().toISOString()
        });
    }
    
    stopGeneration() {
        if (this.abortController) {
            this.abortController.abort();
        }
    }
    
    // File Handling
    handleFileUpload(e) {
        const files = Array.from(e.target.files);
        this.uploadedFiles = [...this.uploadedFiles, ...files];
        this.renderUploadedFiles();
        this.fileInput.value = '';
    }
    
    renderUploadedFiles() {
        this.uploadedFilesContainer.innerHTML = this.uploadedFiles.map((file, i) => `
            <div class="file-chip">
                <span>📄 ${this.escapeHtml(file.name)}</span>
                <button class="remove-file" data-index="${i}">×</button>
            </div>
        `).join('');
        
        this.uploadedFilesContainer.querySelectorAll('.remove-file').forEach(btn => {
            btn.addEventListener('click', () => {
                this.uploadedFiles.splice(parseInt(btn.dataset.index), 1);
                this.renderUploadedFiles();
            });
        });
    }
    
    clearUploadedFiles() {
        this.uploadedFiles = [];
        this.uploadedFilesContainer.innerHTML = '';
    }
    
    readFileContent(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            
            if (file.size > 1024 * 1024) { // 1MB limit
                resolve(`[File too large to read: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)]`);
            } else {
                reader.readAsText(file);
            }
        });
    }
    
    // Copy code
    copyCode(btn) {
        const code = btn.closest('pre').querySelector('code').textContent;
        navigator.clipboard.writeText(code).then(() => {
            btn.textContent = '✓ Copied!';
            btn.classList.add('copied');
            setTimeout(() => {
                btn.textContent = '📋 Copy';
                btn.classList.remove('copied');
            }, 2000);
        });
    }
    
    // Textarea auto-resize
    autoResizeTextarea() {
        this.chatInput.style.height = 'auto';
        this.chatInput.style.height = Math.min(this.chatInput.scrollHeight, 200) + 'px';
        this.sendBtn.disabled = !this.chatInput.value.trim() && this.uploadedFiles.length === 0;
    }
}

// Initialize app
const app = new AIChat();