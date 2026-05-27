# ✦ Companion — Premium Minimalist AI Chat Application

Companion is a state-of-the-art, feature-complete conversational web application built with **React** (Frontend) and **Express** (Backend). The application is meticulously styled to match the warm eggshell (light mode) and charcoal (dark mode) aesthetics of Claude.ai, presenting a distraction-free, elegant layout focused on visual and interactive excellence.

---

## 📖 Table of Contents
1. [Overview & Design Philosophy](#-overview--design-philosophy)
2. [Key Features](#-key-features)
3. [Technology Stack](#-technology-stack)
4. [Project Architecture](#-project-architecture)
5. [API Reference Endpoints](#-api-reference-endpoints)
6. [Detailed Setup & Installation](#-detailed-setup--installation)
7. [Running the Application](#-running-the-application)
8. [Troubleshooting Guide](#-troubleshooting-guide)
9. [Git & Deployment Notes](#-git--deployment-notes)

---

## 🎨 Overview & Design Philosophy

The primary objective of **Companion** is to move away from cluttered, generic, and placeholder-filled chat templates, moving instead towards a premium, polished user interface. 

### Design Choices:
- **Typography**: Inter (sans-serif) for structured elements, sidebar navigation, and inputs; paired with Lora (serif) for time-of-day greetings and header brands.
- **Eggshell & Warm Charcoal**: Tailored CSS variables that avoid harsh standard whites and pitch blacks, mimicking organic papers and warm warm-grey charcoal plates.
- **Micro-Animations**: Linear rotations on accent elements (like the welcome page asterisk/flower), transition fades on message entry, and sliding sidebar transforms.

---

## 🚀 Key Features

### 1. Claude-Matching Welcome Screen
- **Time-Based Welcome Greetings**: Determines local hour to serve `"Morning, Sai Kishan A"`, `"Afternoon, Sai Kishan A"`, or `"Evening, Sai Kishan A"`.
- **Animated Accent Asterisk**: A spinning flower symbol next to the main header utilizing keyframe rotations.
- **Suggested Prompts**: 5 pre-styled horizontal pills (`Code`, `Learn`, `Write`, `Life stuff`, and `Companion's choice`) to automatically populate the input text area.
- **Dynamic Transition**: Sending the first message automatically fades out the welcome card, slides the input area to the bottom, and mounts the scrolling conversation timeline.

### 2. Desktop Collapsible Sidebar
- **Smooth Panel Transition**: A collapsible left sidebar that slides out of view on both desktop and mobile layouts.
- **Fluid Layout Shift**: The main chat window has a flex layout that automatically expands to occupy 100% of the screen width when the sidebar collapses.
- **Stateful Reopen Toggle**: A collapse chevron (`<`) inside the sidebar hides the panel, while an expand chevron (`>`) appears in the header to expand the panel back into view.

### 3. Rich Markdown & Syntax Highlighting
- **Advanced Code Blocks**: Uses `rehype-highlight` and `remark-gfm` inside `react-markdown` to render complex programming blocks.
- **Formatting Elements**: Displays bolding, italics, blockquotes, lists, dividers, tables, and hyperlinks correctly.
- **Typing Indicator**: Features a custom CSS dot-flashing loader animation during assistant generation.

### 4. File-Based Persistence
- **JSON Database**: Thread data is stored locally in `Backend/data/threads.json` (no MongoDB setup required for developers).
- **Auto-Sync Sidebar**: Sending the first message in a new thread automatically saves it, generates a prompt-based title, and pushes the new thread to the sidebar list without requiring page reloads.
- **Thread Deletion**: Features a clean trash bin icon next to recent threads. Clicking it deletes the thread from the local database and clears active screens.

---

## 💻 Technology Stack

### Frontend:
- **React 19 (Vite SPA)**: Client-side single-page framework.
- **React Markdown (v10)**: Custom parser with structured HTML overrides to prevent nested layout hydration bugs (e.g., nesting `<pre>` inside `<p>`).
- **FontAwesome**: Loaded via CDN in `index.html` for clean, vector-based symbols.

### Backend:
- **Express.js (Node.js)**: Middleware-driven API server.
- **Dotenv**: Manages secret credentials (such as API keys) locally.

---

## 📂 Project Architecture

```
companion/
├── Backend/
│   ├── data/
│   │   └── threads.json   # Flat JSON database for saving chat history
│   ├── routes/
│   │   └── chat.js        # API routers for CRUD operations on chats
│   ├── utils/
│   │   ├── openai.js      # Groq Llama 3.3 connector and mock preview fallback
│   │   └── storage.js     # File reading/writing utilities for threads.json
│   ├── .env               # Secrets configuration (API Key)
│   ├── server.js          # Express server initialization
│   └── package.json       # Backend configurations
├── Frontend/
│   ├── src/
│   │   ├── assets/        # Media assets
│   │   ├── App.css        # Main window sizing and structural flex systems
│   │   ├── App.jsx        # Root Layout Router
│   │   ├── ChatWindow.css # CSS classes for input boxes, suggestions, and icons
│   │   ├── ChatWindow.jsx # Primary chat feed and query submission controls
│   │   ├── Sidebar.css    # Sidebar slide-out animation transitions
│   │   ├── temp.jsx       # Sidebar recent thread selector
│   │   ├── MyContext.jsx  # Global React Context provider for state sharing
│   │   └── main.jsx       # Virtual DOM entry point
│   ├── index.html         # HTML entry script
│   └── package.json       # Frontend scripts and loaders
├── package.json           # Root package defining concurrently dev scripts
└── README.md              # In-depth project documentation
```

---

## 🔌 API Reference Endpoints

The Express server exposes the following routes under the `/api` namespace:

### 1. Get Config Status
- **Endpoint**: `GET /api/config`
- **Response**:
  ```json
  { "isConfigured": true }
  ```
  *Note: Checks if a valid `GROQ_API_KEY` is present in the `.env` configuration file.*

### 2. List Threads
- **Endpoint**: `GET /api/thread`
- **Response**: Array of threads sorted by their last updated timestamp.
  ```json
  [
    {
      "threadId": "UUID-v1",
      "title": "Title of conversation...",
      "updatedAt": "2026-05-27T12:00:00Z"
    }
  ]
  ```

### 3. Fetch Thread Messages
- **Endpoint**: `GET /api/thread/:threadId`
- **Response**: Array of role-content messages inside the specific thread.
  ```json
  [
    { "role": "user", "content": "Hello", "timestamp": "..." },
    { "role": "assistant", "content": "Hello, how can I help you?", "timestamp": "..." }
  ]
  ```

### 4. Create or Append Chat Response
- **Endpoint**: `POST /api/chat`
- **Body**:
  ```json
  { "threadId": "UUID-v1", "message": "User query text" }
  ```
- **Response**:
  ```json
  { "reply": "Assistant generated markdown response" }
  ```

### 5. Delete Chat Thread
- **Endpoint**: `DELETE /api/thread/:threadId`
- **Response**:
  ```json
  { "success": "thread deleted successfully" }
  ```

---

## 🔧 Detailed Setup & Installation

### 1. Set Up Environment variables
Inside the `Backend` directory, create a file named `.env`:

```env
GROQ_API_KEY=gsk_your_actual_key_here
```

> [!TIP]
> **API Key Creation**: You can acquire a free API key instantly by logging into the [Groq Console](https://console.groq.com/) and clicking **API Keys**.

### 2. Install Project Dependencies
At the root directory of the project, execute:

```bash
npm run install:all
```
*Note: This script will automatically navigate inside both the `Backend` and `Frontend` directories to run their corresponding `npm install` routines.*

---

## 🏃‍♂️ Running the Application

To launch both the frontend Vite development server and the backend Express server concurrently, run the following command at the root directory:

```bash
npm run dev
```

- **Vite Web Dashboard**: http://localhost:5173
- **Express Server Port**: http://localhost:8080

---

## 🔧 Troubleshooting Guide

### 1. Failed to Fetch / CORS Errors
- **Symptom**: Message submit button shows spinner indefinitely or browser console displays `CORS policy blocked...`.
- **Solution**: Ensure your Express server is running on port `8080`. You can inspect the logs to check if the port is already bound by another process.

### 2. Warning: Hydration Error (nested `<pre>` in `<p>`)
- **Symptom**: React outputs warning messages in the developer console regarding invalid HTML hierarchies inside markdown components.
- **Solution**: Handled. React-Markdown code renderer logic has been configured to check formatting tags, avoiding double code block wrappers.

### 3. API Key Not Detected (Preview Mode Banner)
- **Symptom**: Top banner warns that `GROQ_API_KEY` is not loaded, and replies default to mock responses.
- **Solution**: Confirm that your `.env` file is named exactly `.env` and is located in the root of the `Backend/` directory (not inside `Backend/utils/` or the root workspace).

---

## 🚀 Git & Deployment Notes

If you are committing this project to a public or private GitHub repository, ensure you do not commit your `Backend/.env` file. It is already added to `.gitignore`.

For developers pushing changes with GitHub Email Privacy enabled:
```bash
# Set your git email to your GitHub noreply address
git config user.email "your-github-id+username@users.noreply.github.com"
git commit --amend --reset-author --no-edit
git push origin main
```
