# AI Chat - Personal Assistant

A personal AI chat interface using Google Gemini API (free tier). Works on any device with a browser.

## Features

- 💬 Chat with Gemini AI models
- 🌙 Dark/Light theme toggle
- 💻 Code syntax highlighting
- 📎 File upload support
- 💾 Chat history saved in browser
- 📱 Mobile-responsive design
- 🔒 Private - your data stays in your browser
- ✨ Free to use (Gemini free tier)

## Prerequisites

1. **Google Gemini API Key** (free)
   - Go to: https://aistudio.google.com/apikey
   - Sign in with Google account
   - Click "Create API Key"
   - Copy the key

## Setup

### Option 1: Simple HTTP Server

```bash
# Navigate to the project folder
cd ai-chat

# Start a simple HTTP server
# Python 3
python -m http.server 8080

# Or Python 2
python -m SimpleHTTPServer 8080

# Or Node.js (if you have it)
npx serve .
```

Then open http://localhost:8080 in your browser.

### Option 2: Direct File Access

Simply open `index.html` in your browser.

### Option 3: Use with VS Code Live Server

1. Install "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"

## Usage

1. **First Launch**
   - Click the Settings button (⚙️)
   - Enter your Gemini API key
   - Select a model (Gemini 2.0 Flash recommended)
   - Save settings

2. **Start Chatting**
   - Type your message in the input box
   - Press Enter to send
   - The AI will respond

3. **Upload Files**
   - Click the attachment icon (📎)
   - Select a file to upload
   - The file content will be included in your message

4. **Theme Toggle**
   - Click the sun/moon icon to switch themes

5. **Chat History**
   - All conversations are saved automatically
   - Click any chat in the sidebar to load it
   - Click the × button to delete a chat

## Models Available

| Model | Best For |
|-------|----------|
| Gemini 2.0 Flash | Fast responses, general use |
| Gemini 2.0 Flash Lite | Lighter, faster |
| Gemini 1.5 Flash | Balanced performance |
| Gemini 1.5 Pro | Advanced reasoning |

## Free Tier Limits

- 15 requests per minute
- 1 million tokens per day
- No credit card required

## Configuration

### Settings Options

| Setting | Description | Default |
|---------|-------------|---------|
| Gemini API Key | Your API key | (required) |
| Model | Which Gemini model to use | gemini-2.0-flash |
| System Prompt | Instructions for the AI | You are a helpful assistant... |
| Temperature | Randomness (0-2) | 0.7 |
| Max Tokens | Maximum response length | 2048 |
| Stream Responses | Show tokens as generated | Enabled |
| Save History | Store chats in browser | Enabled |

## Mobile Usage

1. Open the app in your mobile browser
2. Add to home screen for app-like experience
3. Works offline after first load (PWA)

## Troubleshooting

### "No API Key" Status

1. Click Settings
2. Enter your Gemini API key
3. Save settings

### API Errors

1. Check your API key is correct
2. Ensure you haven't exceeded free tier limits
3. Try a different model

### CORS Errors

The Gemini API should work from any origin. If you see CORS errors:
1. Make sure you're using HTTPS or localhost
2. Check your API key is valid

## Project Structure

```
ai-chat/
├── index.html          # Main HTML file
├── style.css          # Styles with dark/light theme
├── app.js             # Main application logic
├── manifest.json      # PWA manifest
├── sw.js             # Service worker for offline
└── README.md         # This file
```

## Technologies

- HTML5 / CSS3 / JavaScript (ES6+)
- Marked.js - Markdown parsing
- Highlight.js - Code syntax highlighting
- Google Gemini API - AI models
- Service Worker - Offline support

## License

Free to use for personal projects.