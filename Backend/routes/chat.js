import express from "express";
import getOpenAIAPIResponse from "../utils/openai.js";
import { loadThreads, saveThreads } from "../utils/storage.js";

const router = express.Router();

// Get API configuration status
router.get("/config", (req, res) => {
    const isConfigured = !!(process.env.GROQ_API_KEY && 
                           process.env.GROQ_API_KEY !== "your_groq_api_key_here" && 
                           !process.env.GROQ_API_KEY.includes("your_"));
    res.json({ isConfigured });
});

//Get all threads
router.get("/thread", async(req,res) => {
    try{
        const threads = await loadThreads();
        // Sort threads by updatedAt desc
        threads.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        res.json(threads);
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: "failed to get threads"})
    }
})

//Get all the messages
router.get("/thread/:threadId", async(req,res)=>{
    const {threadId} = req.params;

    try{
        const threads = await loadThreads();
        const thread = threads.find(t => t.threadId === threadId);

        if(!thread){
            res.status(404).json({error: "thread not found"});
            return;
        }

        res.json(thread.messages);
    }
    catch(err) {
        console.log(err);
        res.status(500).json({error: "failed to fetch chat"});
    }
});

//delete chats
router.delete("/thread/:threadId", async(req,res)=>{
    const {threadId} = req.params;

    try{
        const threads = await loadThreads();
        const threadIndex = threads.findIndex(t => t.threadId === threadId);

        if(threadIndex === -1){
            res.status(404).json({error: "thread not found"});
            return;
        }

        threads.splice(threadIndex, 1);
        await saveThreads(threads);
        res.status(200).json({success : "thread deleted successfully"});
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: "failed to delete thread"});
    }
})

router.post("/chat", async(req,res)=>{
    const {threadId, message} = req.body;

    if(!threadId || !message){
        return res.status(400).json({error: "missing required fields"});
    }
    
    try{
        const threads = await loadThreads();
        let thread = threads.find(t => t.threadId === threadId);

        if(!thread){
            thread = {
                threadId,
                title: message.substring(0, 40) + (message.length > 40 ? "..." : ""),
                messages: [
                    {role: "user", content: message, timestamp: new Date().toISOString()}
                ],
                updatedAt: new Date().toISOString()
            };
            threads.push(thread);
        }
        else{
            thread.messages.push({
                role: "user", 
                content: message, 
                timestamp: new Date().toISOString()
            });
        }

        const assistantReply = await getOpenAIAPIResponse(thread.messages);

        thread.messages.push({
            role: "assistant", 
            content: assistantReply,
            timestamp: new Date().toISOString()
        });
        thread.updatedAt = new Date().toISOString();

        await saveThreads(threads);
        res.json({reply: assistantReply});
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: "something went wrong"});
    }
})

export default router;


