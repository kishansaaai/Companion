import { createContext, useState, useContext } from "react";
import { v1 as uuidv1 } from 'uuid';

export const MyContext = createContext();

export const MyProvider = ({ children }) => {
  const [allThreads, setAllThreads] = useState([]);
  const [currThreadId, setCurrentThreadId] = useState(() => uuidv1());
  const [newChat, setNewChat] = useState(true);
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [prevChat, setPrevChat] = useState([]);
  const [showHistory, setShowHistory] = useState(() => window.innerWidth > 768);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isConfigured, setIsConfigured] = useState(true);
  
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  const toggleTheme = () => {
    setTheme(prev => {
      const newTheme = prev === "light" ? "dark" : "light";
      localStorage.setItem("theme", newTheme);
      return newTheme;
    });
  };

  const checkConfigStatus = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/config");
      if (response.ok) {
        const data = await response.json();
        setIsConfigured(data.isConfigured);
      }
    } catch (err) {
      console.error("Error checking configuration:", err);
    }
  };

  const getAllThreads = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/thread", {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const res = await response.json();
      
      let filteredData = [];
      if (Array.isArray(res)) {
        filteredData = res.map((thread) => ({
          threadId: thread.threadId, 
          title: thread.title
        }));
      }
      
      setAllThreads(filteredData);
    } catch (err) {
      console.error("Error getting threads:", err);
    }
  };

  const showToast = (message, type = "info") => {
    console.log(`${type}: ${message}`);
    // Custom toast notifications or console outputs
    // We will build a better notification banner in the UI itself.
  };

  return (
    <MyContext.Provider
      value={{
        theme,
        toggleTheme,
        isConfigured,
        setIsConfigured,
        checkConfigStatus,
        allThreads,
        setAllThreads,
        getAllThreads,
        currThreadId,
        setCurrentThreadId,
        newChat,
        setNewChat,
        prompt,
        setPrompt,
        reply,
        setReply,
        prevChat,
        setPrevChat,
        showHistory,
        setShowHistory,
        user,
        setUser,
        loading,
        setLoading,
        showToast
      }}
    >
      {children}
    </MyContext.Provider>
  );
};

export const useMyContext = () => useContext(MyContext);