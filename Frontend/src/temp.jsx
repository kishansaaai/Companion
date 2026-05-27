import { useContext, useEffect } from "react";
import "./Sidebar.css";
import blacklogo from "./assets/blacklogo.png";
import { MyContext } from "./MyContext.jsx";
import { v1 as uuidv1 } from "uuid";

function Sidebar() {
    const { 
        allThreads, 
        setAllThreads, 
        getAllThreads,
        currThreadId, 
        setNewChat, 
        setPrompt, 
        setReply, 
        setPrevChat, 
        setCurrentThreadId, 
        showHistory, 
        setShowHistory,
        checkConfigStatus,
        user, 
        showToast 
    } = useContext(MyContext);

    const createNewChat = () => {
        setPrompt("");
        setReply(null);
        setNewChat(true);
        setPrevChat([]);
        setCurrentThreadId(uuidv1());
        setShowHistory(false);
    };

    const changeThread = async (newthreadId) => {
        setCurrentThreadId(newthreadId);
        try {
            const response = await fetch(`http://localhost:8080/api/thread/${newthreadId}`);
            
            if (!response.ok) {
                showToast("Failed to load thread", "error");
                return;
            }
            
            const res = await response.json();
            
            // Set the chat history from the thread
            setPrevChat(res || []);
            setNewChat(false);
            setReply(null);
            setPrompt("");
            setShowHistory(false);

        } catch (err) {
            console.error("Error changing thread:", err);
            showToast("Failed to load thread", "error");
        }
    };

    const deleteThread = async (deleteThreadId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/thread/${deleteThreadId}`, {
                method: "DELETE"
            });
            
            const data = await response.json();

            setAllThreads(prev => prev.filter(thread => thread.threadId !== deleteThreadId));

            if (deleteThreadId === currThreadId) {
                createNewChat();
            }

            if (response.ok) {
                showToast("Thread deleted successfully", "success");
            } else {
                showToast(data.message || "something went wrong", "error");
            }

        } catch (err) {
            console.error("Error deleting thread:", err);
            showToast("Failed to delete thread", "error");
        }
    };

    useEffect(() => {
        getAllThreads();
        checkConfigStatus();
    }, [currThreadId]);

    return (
        <>
            {showHistory && (
                <div 
                    className="sidebar-backdrop" 
                    onClick={() => setShowHistory(false)}
                />
            )}
            <section className={`sidebar ${showHistory ? "show" : ""}`}>
                <div className="sidebar-header">
                    <span className="sidebar-brand">Companion</span>
                    <button className="sidebar-collapse-btn" onClick={() => setShowHistory(false)}>
                        <i className="fa-solid fa-angle-left"></i>
                    </button>
                </div>
                
                <div className="sidebar-navigation">
                    <button onClick={createNewChat} className="nav-btn new-chat-nav-btn">
                        <i className="fa-solid fa-plus"></i>
                        <span>New chat</span>
                    </button>
                </div>

                <div className="history-container">
                    <span className="history-heading">Recents</span>
                    <ul className="history">
                        {allThreads?.map((thread, idx) => (
                            <li 
                                key={idx} 
                                onClick={() => changeThread(thread.threadId)}
                                className={`thread-item ${thread.threadId === currThreadId ? "highlighted" : ""}`}
                            >
                                <div className="thread-content">
                                    <span className="thread-title">{thread.title}</span>
                                </div>
                                <i 
                                    className="fa-regular fa-trash-can delete-btn"
                                    title="Delete thread"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deleteThread(thread.threadId);
                                    }}
                                ></i>
                            </li>
                        ))}
                    </ul>
                </div>

            </section>
        </>
    );
}

export default Sidebar;