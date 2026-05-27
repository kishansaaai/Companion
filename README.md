# Companion - Minimalist AI Chat Application

A modern, high-end, and minimalist AI conversational application built using React (Frontend) and Express (Backend), styled to match the warm eggshell and charcoal aesthetics of Claude.ai.

## 🚀 Features

- **Minimalist Aesthetic**: Visual experience inspired by Claude.ai (Lora serif headings, warm light eggshell & charcoal dark themes, custom spacing).
- **Collapsible Sidebar**: A desktop-responsive collapsible sidebar that toggles smoothly to open up screen real estate.
- **Suggestion Pills**: Quick-access horizontal pill prompts to start chats with code, learning, writing, or task templates.
- **Markdown & Syntax Highlighting**: Full React-Markdown support rendering tables, headers, lists, code blocks with custom syntax highlight schemes.
- **Thread Management**: Save, view, and delete chat history, backed by JSON database persistence.
- **Llama 3.3 Integration**: Integrates directly with the Llama 3.3 versatile model via the Groq API, with a local mock preview fallback if no key is configured.

## 🔧 Setup Instructions

### 1. Set Up Environment Variables

Create a `.env` file in the `Backend` directory:

```env
GROQ_API_KEY=your_groq_api_key_here
```

To get a Groq API key:
1. Go to the [Groq Console](https://console.groq.com/)
2. Create an API key and paste it into `Backend/.env`.

### 2. Install Dependencies

Install all dependencies for root, Backend, and Frontend concurrently:

```bash
npm run install:all
```

### 3. Run the Application

Start the development servers for both Frontend and Backend concurrently:

```bash
npm run dev
```

- **Frontend App**: http://localhost:5173
- **Backend API**: http://localhost:8080

## 📂 Project Structure

```
sais--gpt/
├── Backend/
│   ├── server.js          # Express API server
│   ├── routes/
│   │   └── chat.js        # API endpoints for chats and thread data
│   ├── utils/
│   │   ├── openai.js      # Groq Llama 3.3 response query integration
│   │   └── storage.js     # Thread storage management
│   └── package.json
├── Frontend/
│   ├── src/
│   │   ├── ChatWindow.jsx    # Main chat interface and user input
│   │   ├── temp.jsx          # Collapsible sidebar history thread viewer
│   │   ├── MyContext.jsx     # Shared React context and theme toggles
│   │   ├── App.css           # Global layout styles
│   │   ├── ChatWindow.css    # Message bubble and text editor styles
│   │   ├── Sidebar.css       # Sidebar drawer transition animations
│   │   └── markdown.css      # Rendered markdown structures
│   ├── index.html
│   └── package.json
└── README.md
```

## 📝 Available Scripts

At the root directory:
- `npm run install:all`: Installs all dependencies across directories.
- `npm run dev`: Runs Vite frontend and Express backend concurrently.
