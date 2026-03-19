import { useState } from "react";

function TestComponent() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const testAPI = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/thread");
      const data = await res.json();
      console.log("API Test Response:", data);
      setResponse(JSON.stringify(data, null, 2));
    } catch (error) {
      console.error("API Test Error:", error);
      setResponse(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testChat = async () => {
    if (!message.trim()) return;
    
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: message,
          threadId: "test-thread"
        }),
      });
      const data = await res.json();
      console.log("Chat Test Response:", data);
      setResponse(JSON.stringify(data, null, 2));
    } catch (error) {
      console.error("Chat Test Error:", error);
      setResponse(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "monospace" }}>
      <h2>API Test Component</h2>
      
      <div style={{ marginBottom: "20px" }}>
        <button onClick={testAPI} disabled={loading}>
          {loading ? "Testing..." : "Test Thread API"}
        </button>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter test message"
          style={{ marginRight: "10px", padding: "5px" }}
        />
        <button onClick={testChat} disabled={loading}>
          {loading ? "Sending..." : "Test Chat API"}
        </button>
      </div>

      <div>
        <h3>Response:</h3>
        <pre style={{ 
          background: "#f5f5f5", 
          padding: "10px", 
          borderRadius: "5px",
          whiteSpace: "pre-wrap",
          maxHeight: "300px",
          overflow: "auto"
        }}>
          {response || "No response yet"}
        </pre>
      </div>
    </div>
  );
}

export default TestComponent;
