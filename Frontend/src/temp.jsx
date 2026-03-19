import { useContext, useEffect } from "react";
import "./Sidebar.css";
import blacklogo from "./assets/blacklogo.png";
import { MyContext } from "./MyContext";
import { v1 as uuidv1 } from "uuid";

function Sidebar() {
    const { 
        allThreads, 
        setAllThreads, 
        currThreadId, 
        setNewChat, 
        setPrompt, 
        setReply, 
        setPrevChat, 
        setCurrentThreadId, 
        showHistory, 
        user, 
        showToast 
    } = useContext(MyContext);

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

    const createNewChat = () => {
        setPrompt("");
        setReply(null);
        setNewChat(true);
        setPrevChat([]);
        setCurrentThreadId(uuidv1());
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
    }, [currThreadId]);

    return (
        <>
            <section className={`sidebar ${showHistory ? "show" : ""}`}>
                <button onClick={createNewChat} className="new-chat-btn">
                    <img src={blacklogo} alt="gpt logo" className="logo" />
                    <span>
                        <i className="fa-solid fa-pen-to-square"></i>
                        New Chat
                    </span>
                </button>

                <div className="history-container">
                    <ul className="history">
                        {allThreads?.map((thread, idx) => (
                            <li 
                                key={idx} 
                                onClick={() => changeThread(thread.threadId)}
                                className={`thread-item ${thread.threadId === currThreadId ? "highlighted" : ""}`}
                            >
                                <div className="thread-content">
                                    <span className="thread-title">{thread.title}</span>
                                    <span className="thread-time">
                                        {new Date().toLocaleDateString()}
                                    </span>
                                </div>
                                <i 
                                    className="fa-solid fa-trash delete-btn"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deleteThread(thread.threadId);
                                    }}
                                ></i>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="sign">
                    <p>Sai's GPT</p>
                </div>
            </section>
        </>
    );
}

export default Sidebar;