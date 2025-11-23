import asyncHandler from 'express-async-handler';
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// @desc    Handle Chat Conversation
// @route   POST /api/chat
const handleChat = asyncHandler(async (req, res) => {
  const { history, message } = req.body;

  if (!message) {
    res.status(400);
    throw new Error('Message is required');
  }

  try {
    // System Context for the AI
    const systemInstruction = `
      You are a "Project Recommendation Expert" for PowerFolio, a student project platform.
      Your goal is to suggest innovative, practical, and impressive coding projects.
      
      Follow this flow:
      1. If the user says "Hi" or "Hello", introduce yourself and ask what domain they are interested in (Web, Mobile, AI, IoT, Blockchain, etc.).
      2. Once they give a domain, ask about their skill level (Beginner, Intermediate, Advanced) and preferred tech stack.
      3. Based on their answers, suggest 2-3 specific, unique project ideas with a brief "Why this is good" explanation.
      4. Keep responses concise, encouraging, and formatted with bullet points.
      5. Do NOT answer questions unrelated to coding, projects, or career advice. Politely decline.
    `;

    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      systemInstruction: systemInstruction 
    });

    // --- SANITIZE HISTORY ---
    // Gemini requires history to START with 'user'. 
    // If frontend sends 'model' as first item (greeting), remove it.
    let chatHistory = history || [];
    if (chatHistory.length > 0 && chatHistory[0].role === 'model') {
      chatHistory = chatHistory.slice(1);
    }
    
    // Also ensure history alternates User/Model correctly (Gemini requirement)
    // Simple fix: If we have double user or double model, we might need more complex logic,
    // but fixing the start usually solves 90% of issues.

    const chat = model.startChat({
      history: chatHistory,
      generationConfig: {
        maxOutputTokens: 800,
        temperature: 0.7,
      },
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    if (!text) {
      throw new Error("Empty response from AI");
    }

    res.json({ text });

  } catch (error) {
    console.error("Chat Error Details:", error);
    res.status(500);
    throw new Error('AI Chat failed: ' + error.message);
  }
});

export { handleChat };