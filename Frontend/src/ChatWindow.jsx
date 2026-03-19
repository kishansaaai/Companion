import { useContext, useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "./ChatWindow.css";
import "./markdown.css";
import { MyContext } from "./MyContext.jsx";

function ChatWindow() {
  const { 
    prompt, 
    setPrompt, 
    reply, 
    setReply, 
    prevChat, 
    setPrevChat, 
    newChat, 
    currThreadId, 
    loading, 
    setLoading,
    showToast 
  } = useContext(MyContext);
  
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [prevChat, reply]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || loading) return;

    const userMessage = inputValue.trim();
    setInputValue("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          threadId: currThreadId
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        showToast(data.message || "Error sending message", "error");
        return;
      }

      // Add user message to history
      setPrevChat(prev => [...prev, { role: "user", content: userMessage }]);
      
      // Add assistant reply to history
      setPrevChat(prev => [...prev, { role: "assistant", content: data.reply }]);
      
      // Clear the reply state since it's now in history
      setReply(null);
      setPrompt(userMessage);
      
    } catch (error) {
      console.error("Chat API Error:", error);
      showToast(error.message || "Failed to send message", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <section className="chat-window">
      <div className="chat-header">
        <h2>Sai's GPT</h2>
        <div className="header-actions">
          <span className="status-indicator">
            <span className="status-dot"></span>
            Online
          </span>
        </div>
      </div>
      
      <div className="chat-messages">
        {newChat && prevChat.length === 0 && !reply && (
          <div className="welcome-message fade-in">
            <div className="welcome-icon">🤖</div>
            <h3>Welcome to Sai's GPT!</h3>
            <p>Your intelligent conversation partner is ready to help. Ask me anything!</p>
            <div className="suggested-prompts">
              <button onClick={() => setInputValue("Show me how to use **bold text**, *italic text*, and `code formatting` in messages")}>
                💡 Learn Markdown Formatting
              </button>
              <button onClick={() => setInputValue("Create a **step-by-step guide** for beginners to learn web development")}>
                📚 Create Educational Guide
              </button>
              <button onClick={() => setInputValue("Explain **artificial intelligence** with key concepts, examples, and future implications")}>
                🧠 AI Deep Dive
              </button>
              <button onClick={() => setInputValue("Help me brainstorm **creative ideas** for a new project with pros and cons")}>
                🚀 Brainstorm Session
              </button>
              <button onClick={() => setInputValue("Write a **comparison table** between Python and JavaScript for data analysis")}>
                📊 Technical Comparison
              </button>
            </div>
          </div>
        )}
        
        {prevChat.map((message, index) => (
          <div key={index} className={`message ${message.role} fade-in`}>
            <div className="message-avatar">
              {message.role === 'user' ? '👤' : '🤖'}
            </div>
            <div className="message-content">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
                components={{
                  p: ({children}) => <p>{children}</p>,
                  strong: ({children}) => <strong>{children}</strong>,
                  em: ({children}) => <em>{children}</em>,
                  ul: ({children}) => <ul>{children}</ul>,
                  ol: ({children}) => <ol>{children}</ol>,
                  li: ({children}) => <li>{children}</li>,
                  code: ({inline, children}) => 
                    inline ? <code>{children}</code> : <pre><code>{children}</code></pre>,
                  blockquote: ({children}) => <blockquote>{children}</blockquote>,
                  h1: ({children}) => <h1>{children}</h1>,
                  h2: ({children}) => <h2>{children}</h2>,
                  h3: ({children}) => <h3>{children}</h3>,
                  h4: ({children}) => <h4>{children}</h4>,
                  h5: ({children}) => <h5>{children}</h5>,
                  h6: ({children}) => <h6>{children}</h6>,
                  table: ({children}) => <table>{children}</table>,
                  thead: ({children}) => <thead>{children}</thead>,
                  tbody: ({children}) => <tbody>{children}</tbody>,
                  tr: ({children}) => <tr>{children}</tr>,
                  th: ({children}) => <th>{children}</th>,
                  td: ({children}) => <td>{children}</td>,
                  a: ({href, children}) => <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>,
                  hr: () => <hr />
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
            <div className="message-time">
                {message.timestamp ? new Date(message.timestamp).toLocaleTimeString() : new Date().toLocaleTimeString()}
            </div>
          </div>
        ))}
        
        {reply && (
          <div className="message assistant fade-in">
            <div className="message-avatar">🤖</div>
            <div className="message-content">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
                components={{
                  p: ({children}) => <p>{children}</p>,
                  strong: ({children}) => <strong>{children}</strong>,
                  em: ({children}) => <em>{children}</em>,
                  ul: ({children}) => <ul>{children}</ul>,
                  ol: ({children}) => <ol>{children}</ol>,
                  li: ({children}) => <li>{children}</li>,
                  code: ({inline, children}) => 
                    inline ? <code>{children}</code> : <pre><code>{children}</code></pre>,
                  blockquote: ({children}) => <blockquote>{children}</blockquote>,
                  h1: ({children}) => <h1>{children}</h1>,
                  h2: ({children}) => <h2>{children}</h2>,
                  h3: ({children}) => <h3>{children}</h3>,
                  h4: ({children}) => <h4>{children}</h4>,
                  h5: ({children}) => <h5>{children}</h5>,
                  h6: ({children}) => <h6>{children}</h6>,
                  table: ({children}) => <table>{children}</table>,
                  thead: ({children}) => <thead>{children}</thead>,
                  tbody: ({children}) => <tbody>{children}</tbody>,
                  tr: ({children}) => <tr>{children}</tr>,
                  th: ({children}) => <th>{children}</th>,
                  td: ({children}) => <td>{children}</td>,
                  a: ({href, children}) => <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>,
                  hr: () => <hr />
                }}
              >
                {reply}
              </ReactMarkdown>
            </div>
            <div className="message-time">
              {new Date().toLocaleTimeString()}
            </div>
          </div>
        )}
        
        {loading && (
          <div className="message assistant fade-in">
            <div className="message-avatar">🤖</div>
            <div className="message-content typing">
              <span className="typing-dot"></span>
              <span className="typing-dot"></span>
              <span className="typing-dot"></span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <form className="chat-input-form" onSubmit={handleSubmit}>
        <div className="input-container">
          <div className="input-wrapper">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              rows={1}
              disabled={loading}
              className="chat-input"
            />
            <div className="input-actions">
              <button type="button" className="attachment-button" disabled={loading}>
                📎
              </button>
            </div>
          </div>
          <button 
            type="submit" 
            disabled={loading || !inputValue.trim()}
            className="send-button"
          >
            {loading ? (
              <div className="loading-spinner">⏳</div>
            ) : (
              <i className="fa-solid fa-paper-plane"></i>
            )}
          </button>
        </div>
        <div className="input-footer">
          <span className="char-count">{inputValue.length}/4000</span>
          <span className="shortcuts">Shift + Enter for new line</span>
        </div>
      </form>
    </section>
  );
}

export default ChatWindow;
