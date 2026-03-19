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
  const [showHistory, setShowHistory] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const showToast = (message, type = "info") => {
    console.log(`${type}: ${message}`);
    // You can implement actual toast notifications here
    // For now, just use alert as a simple notification
    if (type === "error") {
      alert(`Error: ${message}`);
    } else if (type === "success") {
      console.log(`Success: ${message}`);
    }
  };

  return (
    <MyContext.Provider
      value={{
        allThreads,
        setAllThreads,
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