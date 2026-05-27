import "dotenv/config";

const getMockAPIResponse = (message) => {
    const msg = message.toLowerCase();
    
    if (msg.includes("markdown") || msg.includes("bold") || msg.includes("format") || msg.includes("formatting")) {
        return `### 📝 Markdown Formatting Guide

Here is a showcase of how Companion renders different markdown elements:

1. **Bold Text** using \`**bold**\`
2. *Italic Text* using \`*italic*\`
3. Monospace \`inline code\` using backticks
4. Code Blocks with language syntax highlighting:
\`\`\`javascript
// Example JavaScript code
function greet(name) {
    console.log("Hello, " + name + "!");
}
greet("World");
\`\`\`

5. Lists:
   - Bullet point one
   - Bullet point two
     - Subpoint A
     - Subpoint B

6. Blockquotes:
> "The only way to do great work is to love what you do." — Steve Jobs

7. Tables:

| Feature | Support | Performance |
| :--- | :---: | :---: |
| Markdown Rendering | ✅ Full | Fast |
| Thread History | ✅ Saved | Local |
| AI Generation | ⚠️ Preview | Instant |

***

*Note: This is a preview response. To enable full Llama 3.3 replies, please set up a \`GROQ_API_KEY\` in your \`.env\` file in the Backend folder.*`;
    }

    if (msg.includes("web development") || msg.includes("learn web") || msg.includes("educational")) {
        return `### 📚 Web Development Learning Roadmap

Here is a step-by-step guide for beginners to learn modern web development:

#### Phase 1: Front-end Basics
- **HTML5**: Learn the structure and semantic elements of web pages.
- **CSS3**: Focus on layout designs (Flexbox, Grid), media queries for responsive design, and basic transitions.
- **JavaScript (ES6+)**: Understand DOM manipulation, variables, functions, promises, and fetching APIs.

#### Phase 2: Front-end Frameworks
- **React.js**: Learn components, state management (hooks), context, and routers.
- **Build Tools**: Understand npm, Vite, and simple project builds.

#### Phase 3: Back-end Foundations
- **Node.js & Express**: Set up servers, define RESTful APIs, and handle requests.
- **Databases**: Learn SQL (PostgreSQL) or NoSQL (MongoDB).

***

*This guide is generated in preview mode. Set your \`GROQ_API_KEY\` in the Backend folder's \`.env\` file to ask custom programming questions.*`;
    }

    if (msg.includes("artificial intelligence") || msg.includes("ai ") || msg.includes(" deep dive")) {
        return `### 🧠 Artificial Intelligence (AI) Overview

Artificial Intelligence (AI) is the simulation of human intelligence processes by machines, especially computer systems.

#### Key Subfields of AI:
- **Machine Learning (ML)**: Algorithms that learn from data and improve over time.
- **Deep Learning**: A subset of ML utilizing neural networks with many layers (e.g., used for computer vision and NLP).
- **Natural Language Processing (NLP)**: Enables computers to understand, interpret, and generate human language.

#### Current Applications:
1. **Generative AI**: Large Language Models (LLMs) like Llama 3.3, GPT-4, and Claude.
2. **Autonomous Systems**: Self-driving cars (Tesla, Waymo).
3. **Recommendation Engines**: Netflix, YouTube, Spotify algorithms.

***

*Preview Mode Active. Set your \`GROQ_API_KEY\` in the Backend folder to explore advanced AI architectures.*`;
    }

    if (msg.includes("brainstorm") || msg.includes("creative") || msg.includes("ideas")) {
        return `### 🚀 Project Brainstorming Session

Here are three creative project ideas you can build next:

1. **Local Markdown Knowledge Base**:
   - *Description*: A desktop app that parses your local markdown files into a searchable wiki.
   - *Tech*: Electron + React + Fuse.js.
   - *Pros*: Very useful, works offline.
   - *Cons*: Desktop distribution is slightly harder.

2. **AI-Powered Code Assistant**:
   - *Description*: Integrate local LLMs to debug and explain code snippets.
   - *Tech*: Node.js + Ollama/Groq + VSCode Extension.
   - *Pros*: High educational value, direct utility.
   - *Cons*: Needs API credits or local GPU power.

3. **Gamified Task Manager**:
   - *Description*: A classic todo app but with XP and levels for completing tasks.
   - *Tech*: React Native + Supabase.
   - *Pros*: Great for portfolio, fun to design.
   - *Cons*: Keeping users engaged requires good game design.

***

*Set up your \`GROQ_API_KEY\` in the Backend folder's \`.env\` file to generate unlimited custom brainstorm ideas!*`;
    }

    if (msg.includes("python") || msg.includes("javascript") || msg.includes("comparison") || msg.includes("table")) {
        return `### 📊 Python vs. JavaScript: Technical Comparison

| Criteria | Python | JavaScript |
| :--- | :--- | :--- |
| **Primary Use Cases** | Data Science, AI/ML, Backend | Web Development (Front & Back) |
| **Typing** | Dynamic, Strong | Dynamic, Weak |
| **Execution Env** | Python Interpreter | Web Browser, Node.js runtime |
| **Syntax** | Clean, Indentation-based | Curly braces, C-style |
| **Asynchronous Programming** | Supported (asyncio) | First-class citizen (Event loop) |

#### Conclusion:
- Choose **Python** if your focus is data analysis, AI, machine learning, or quick automation.
- Choose **JavaScript** if you want to build websites, mobile apps, or full-stack web products.

***

*To get complex, custom code analysis comparing other languages, configure your \`GROQ_API_KEY\`.*`;
    }

    // Default conversational responses
    return `Hello! I am **Companion**, your local conversational companion.

Currently, the server is running in **Preview Mode** because no \`GROQ_API_KEY\` was found in your environment.

### How to activate full AI responses:
1. Create a file named \`.env\` in the \`Backend\` directory.
2. Add your Groq API key:
   \`\`\`env
   GROQ_API_KEY=your_actual_groq_api_key_here
   \`\`\`
3. Restart the servers.

*In the meantime, feel free to test the interface! I can demonstrate markdown formatting, roadmaps, and comparisons. Try typing:*
- "Show me markdown formatting"
- "Give me a web development guide"
- "Compare Python and JavaScript"
- "Brainstorm some project ideas"`;
};

const getOpenAIAPIResponse = async(messages) => {
     const messageArray = Array.isArray(messages) ? messages : [{ role: "user", content: messages }];
     
     const lastUserMessage = [...messageArray].reverse().find(m => m.role === "user")?.content || "";

     if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === "your_groq_api_key_here" || process.env.GROQ_API_KEY.includes("your_")) {
          // Return mock response if no key is configured
          return getMockAPIResponse(lastUserMessage);
      }

      const formattedMessages = messageArray.map(({ role, content }) => ({ role, content }));

      const options = {
         method: "POST",
         headers: {
             "Content-Type": "application/json",
             "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
         },
         body: JSON.stringify({
             model: "llama-3.3-70b-versatile",
             messages: formattedMessages
         })
     }
    try{
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", options);
        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData?.error?.message || `HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (!data?.choices?.[0]?.message?.content) {
            throw new Error("Invalid API response structure from Groq");
        }
        return data.choices[0].message.content;
    }
    catch(err){
        console.error("Groq API Call Error:", err);
        return `⚠️ **Error communicating with Groq API**: ${err.message}\n\nPlease check that your \`GROQ_API_KEY\` in \`Backend/.env\` is valid and has not expired.`;
    }
}

export default getOpenAIAPIResponse;