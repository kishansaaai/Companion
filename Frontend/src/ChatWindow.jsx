import { useContext, useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "./ChatWindow.css";
import "./markdown.css";
import { MyContext } from "./MyContext.jsx";

function ChatWindow() {
  const { 
    allThreads,
    getAllThreads,
    prompt, 
    setPrompt, 
    reply, 
    setReply, 
    prevChat, 
    setPrevChat, 
    newChat, 
    setNewChat,
    currThreadId, 
    loading, 
    setLoading,
    showToast,
    isConfigured,
    showHistory,
    setShowHistory,
    theme,
    toggleTheme
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
        showToast(data.error || data.message || "Error sending message", "error");
        return;
      }

      // Add user message to history
      setPrevChat(prev => [...prev, { role: "user", content: userMessage }]);
      
      // Add assistant reply to history
      setPrevChat(prev => [...prev, { role: "assistant", content: data.reply }]);
      
      // Clear the reply state since it's now in history
      setReply(null);
      setPrompt(userMessage);

      if (newChat) {
        setNewChat(false);
        getAllThreads();
      }
      
    } catch (error) {
      console.error("Chat API Error:", error);
      showToast(error.message || "Failed to send message", "error");
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hrs = new Date().getHours();
    if (hrs >= 5 && hrs < 12) return "Morning";
    if (hrs >= 12 && hrs < 17) return "Afternoon";
    return "Evening";
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
        <div className="header-left">
          {!showHistory && (
            <button 
              type="button"
              className="hamburger-btn"
              onClick={() => setShowHistory(true)}
              aria-label="Open Sidebar"
              style={{ marginRight: "0.75rem" }}
            >
              <i className="fa-solid fa-angle-right"></i>
            </button>
          )}
          {!(newChat && prevChat.length === 0 && !reply) && (
            <div className="header-title-wrapper">
              <span className="header-title">
                {allThreads.find(t => t.threadId === currThreadId)?.title || "Companion"}
              </span>
              <i className="fa-solid fa-angle-down chevron-icon"></i>
              <span className="token-counter">
                ~2,410 tokens
              </span>
            </div>
          )}
        </div>
        
        {newChat && prevChat.length === 0 && !reply ? (
          <>
            <div className="header-right">
              <button 
                type="button" 
                className="theme-toggle-btn header-icon-btn" 
                onClick={toggleTheme} 
                title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                aria-label="Toggle Theme"
              >
                <i className={`fa-solid ${theme === 'light' ? 'fa-moon' : 'fa-sun'}`}></i>
              </button>
            </div>
          </>
        ) : (
          <div className="header-actions">
            <button 
              type="button" 
              className="theme-toggle-btn" 
              onClick={toggleTheme} 
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              aria-label="Toggle Theme"
            >
              <i className={`fa-solid ${theme === 'light' ? 'fa-moon' : 'fa-sun'}`}></i>
            </button>
            <button type="button" className="header-action-btn" title="View document">
              <i className="fa-regular fa-file-lines"></i>
            </button>
            <button type="button" className="header-action-btn share-btn">
              <span>Share</span>
            </button>
          </div>
        )}
      </div>
      
      {!isConfigured && (
        <div className="config-banner fade-in">
          <span className="banner-icon">💡</span>
          <div className="banner-text">
            <strong>Preview Mode Active:</strong> No <code>GROQ_API_KEY</code> detected in Backend. 
            <span className="banner-instructions"> Create a <code>Backend/.env</code> file with your key to unlock live Llama 3.3 responses!</span>
          </div>
        </div>
      )}
      
      {newChat && prevChat.length === 0 && !reply ? (
        <div className="welcome-container fade-in">
          <div className="welcome-content-wrapper">
            <div className="welcome-greeting">
              <span className="flower-symbol">✦</span>
              <h2>{getGreeting()}, My Companion</h2>
            </div>
            
            <form className="welcome-input-form" onSubmit={handleSubmit}>
              <div className="input-container">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type / for skills"
                  rows={1}
                  disabled={loading}
                  className="chat-input"
                />
                <div className="input-controls-row">
                  <button 
                    type="submit" 
                    disabled={loading || !inputValue.trim()}
                    className="send-btn"
                    title="Send message"
                  >
                    {loading ? (
                      <i className="fa-solid fa-spinner fa-spin"></i>
                    ) : (
                      <i className="fa-solid fa-arrow-up"></i>
                    )}
                  </button>
                </div>
              </div>
              <div className="input-footer">
                <span className="disclaimer-text">Companion is an AI assistant and can make mistakes. Please double-check responses.</span>
              </div>
            </form>
            
            <div className="pill-suggestions">
              <button type="button" onClick={() => setInputValue("Show me how to use **code** in messages")} className="pill-btn">
                <i className="fa-solid fa-code"></i> Code
              </button>
              <button type="button" onClick={() => setInputValue("Teach me something new about...")} className="pill-btn">
                <i className="fa-solid fa-graduation-cap"></i> Learn
              </button>
              <button type="button" onClick={() => setInputValue("Help me write an essay or report...")} className="pill-btn">
                <i className="fa-solid fa-pen-to-square"></i> Write
              </button>
              <button type="button" onClick={() => setInputValue("Help me plan my daily tasks...")} className="pill-btn">
                <i className="fa-solid fa-suitcase"></i> Life stuff
              </button>
              <button type="button" onClick={() => setInputValue("What is Companion's choice recommendation?")} className="pill-btn">
                <i className="fa-regular fa-lightbulb"></i> Companion's choice
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="chat-messages">
          {prevChat.map((message, index) => (
            <div key={index} className={`message ${message.role} fade-in`}>
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
                    code: ({className, children}) => <code className={className}>{children}</code>,
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
            </div>
          ))}
          
          {reply && (
            <div className="message assistant fade-in">
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
                    code: ({className, children}) => <code className={className}>{children}</code>,
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
            </div>
          )}
          
          {loading && (
            <div className="message assistant fade-in">
              <div className="message-content typing">
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      )}
      
      {!(newChat && prevChat.length === 0 && !reply) && (
        <form className="chat-input-form" onSubmit={handleSubmit}>
          <div className="input-container">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="How can I help you today?"
              rows={1}
              disabled={loading}
              className="chat-input"
            />
            <div className="input-controls-row">
              <button 
                type="submit" 
                disabled={loading || !inputValue.trim()}
                className="send-btn"
                title="Send message"
              >
                {loading ? (
                  <i className="fa-solid fa-spinner fa-spin"></i>
                ) : (
                  <i className="fa-solid fa-arrow-up"></i>
                )}
              </button>
            </div>
          </div>
          <div className="input-footer">
            <span className="disclaimer-text">Companion is an AI assistant and can make mistakes. Please double-check responses.</span>
          </div>
        </form>
      )}
    </section>
  );
}

export default ChatWindow;
