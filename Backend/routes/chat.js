import express from "express";
import getOpenAIAPIResponse from "../utils/openai.js";

const router = express.Router();

// In-memory storage for threads (temporary solution)
let threads = [];

//Get all threads
router.get("/thread", async(req,res) => {
    try{
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
        const threadIndex = threads.findIndex(t => t.threadId === threadId);

        if(threadIndex === -1){
            res.status(404).json({error: "thread not found"});
            return;
        }

        threads.splice(threadIndex, 1);
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
        let thread = threads.find(t => t.threadId === threadId);

        if(!thread){
            thread = {
                threadId,
                title: message.substring(0, 50) + "...",
                messages: [
                    {role: "user", content: message, timestamp: new Date().toISOString()}
                ],
                updatedAt: new Date()
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

        const assistantReply = await getOpenAIAPIResponse(message);

        thread.messages.push({
            role: "assistant", 
            content: assistantReply,
            timestamp: new Date().toISOString()
        });
        thread.updatedAt = new Date();

        res.json({reply: assistantReply});
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: "something went wrong"});
    }
})

export default router;


