# Sai's GPT - AI Chat Application

A modern, feature-rich ChatGPT clone with beautiful UI, markdown formatting, and persistent chat history.

## 🚀 Features

- **Modern UI**: Beautiful gradient design with glass morphism effects
- **Markdown Formatting**: Rich text support with bold, italic, code, tables, and more
- **Chat History**: Persistent conversations across sessions
- **Thread Management**: Create, switch, and delete chat threads
- **AI Integration**: Powered by Llama 3.3 model via Groq API
- **Responsive Design**: Works perfectly on desktop and mobile
- **Real-time Status**: Live online indicators and typing animations

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Groq API Key (for AI responses)

## 🔧 Setup Instructions

### 1. Clone/Download the Project

```bash
# If you have it in a folder, navigate to it
cd c:\Users\saiki\OneDrive\Documents\Desktop\chatgpt
```

### 2. Install Backend Dependencies

```bash
cd Backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../Frontend
npm install
```

### 4. Set Up Environment Variables

Create a `.env` file in the `Backend` folder:

```env
GROQ_API_KEY=your_groq_api_key_here
```

To get a Groq API key:
1. Go to [Groq Console](https://console.groq.com/)
2. Sign up/login
3. Go to API Keys section
4. Create a new API key
5. Copy and paste it into your `.env` file

## 🏃‍♂️ Running the Application

### Method 1: Run Both Servers Separately

**Terminal 1 - Backend Server:**
```bash
cd Backend
node server.js
```

**Terminal 2 - Frontend Server:**
```bash
cd Frontend
npm run dev
```

### Method 2: Quick Start (PowerShell)

```powershell
# Start Backend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd Backend; node server.js"

# Start Frontend  
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd Frontend; npm run dev"
```

## 🌐 Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080

## 📱 Usage

1. **Open your browser** and go to http://localhost:5173
2. **Click "New Chat"** to start a conversation
3. **Type your message** and press Enter
4. **Use suggested prompts** to explore features
5. **Switch between threads** using the sidebar
6. **Enjoy rich formatting** in responses

## 🎨 Features Showcase

### Markdown Formatting
- **Bold text**: `**text**` → **text**
- **Italic text**: `*text*` → *text*
- **Code**: `` `code` `` → `code`
- **Lists**: `- item` → • item
- **Tables**: Full markdown table support

### Thread Management
- Create new chat threads
- Switch between conversations
- Delete unwanted threads
- Persistent chat history

### UI Features
- Gradient backgrounds
- Smooth animations
- Hover effects
- Responsive design
- Status indicators

## 🛠️ Development

### Project Structure
```
chatgpt/
├── Backend/
│   ├── server.js          # Main server file
│   ├── routes/
│   │   └── chat.js        # API routes
│   ├── utils/
│   │   └── openai.js      # AI integration
│   └── package.json
├── Frontend/
│   ├── src/
│   │   ├── ChatWindow.jsx    # Chat interface
│   │   ├── temp.jsx          # Sidebar component
│   │   ├── MyContext.jsx     # State management
│   │   ├── App.css           # Global styles
│   │   ├── ChatWindow.css    # Chat styles
│   │   ├── Sidebar.css       # Sidebar styles
│   │   └── markdown.css      # Markdown styles
│   ├── index.html
│   └── package.json
└── README.md
```

### Available Scripts

**Backend:**
```bash
node server.js        # Start backend server
```

**Frontend:**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
```

## 🔧 Troubleshooting

### Common Issues

1. **"Failed to fetch" errors**
   - Make sure backend server is running on port 8080
   - Check that both servers are running simultaneously

2. **CORS errors**
   - Backend CORS is already configured
   - Ensure frontend is running on localhost:5173

3. **AI not responding**
   - Check your GROQ_API_KEY in the .env file
   - Verify the API key is valid and has credits

4. **Port conflicts**
   - Backend: Change PORT in server.js
   - Frontend: Vite will automatically find available port

5. **Dependencies not found**
   - Run `npm install` in both Backend and Frontend folders
   - Delete node_modules and package-lock.json, then reinstall

### Server Status Check

**Check Backend:**
```bash
curl http://localhost:8080/
# Should return: {"message":"Server is running!"}
```

**Check API:**
```bash
curl http://localhost:8080/api/thread
# Should return: []
```

## 📝 Environment Variables

Create `.env` file in Backend folder:

```env
GROQ_API_KEY=gsk_your_api_key_here
MONGODB_URI=mongodb://localhost:27017/chatgpt  # Optional (uses in-memory storage)
```

## 🎯 Tips

1. **First Time**: Start with suggested prompts to see formatting
2. **Chat History**: Your conversations are saved automatically
3. **Multiple Threads**: Create separate conversations for different topics
4. **Markdown**: Use markdown formatting in your messages for better responses
5. **Mobile**: Works great on mobile devices too!

## 🚀 Production Deployment

For production deployment:

1. **Build Frontend:**
   ```bash
   cd Frontend
   npm run build
   ```

2. **Serve Static Files:**
   - Use nginx, Apache, or any static file server
   - Point to the `dist` folder

3. **Backend Deployment:**
   - Set NODE_ENV=production
   - Use process manager like PM2
   - Configure reverse proxy for API routes

## 📞 Support

If you encounter any issues:

1. Check both servers are running
2. Verify API key is correct
3. Check browser console for errors
4. Ensure all dependencies are installed

Enjoy your Sai's GPT application! 🎉
