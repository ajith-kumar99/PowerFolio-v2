import asyncHandler from 'express-async-handler';
import { 
  GoogleGenerativeAI, 
  HarmCategory, 
  HarmBlockThreshold 
} from "@google/generative-ai";
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
    // 1. Configure Model with Safety Settings to prevent "Empty Response" on technical topics
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash", 
      systemInstruction: `
        You are a "Project Recommendation Expert" for PowerFolio, a student project platform.
        Your goal is to suggest innovative, practical, and impressive coding projects.
        
        Follow this flow:
        1. If the user says "Hi" or "Hello", introduce yourself and ask what domain they are interested in (Web, Mobile, AI, IoT, Blockchain, etc.).
        2. Once they give a domain, ask about their skill level (Beginner, Intermediate, Advanced) and preferred tech stack.
        3. Based on their answers, suggest 2 specific, unique project ideas with a brief "Why this is good" explanation. Keep short explanations.
        4. Keep responses concise, encouraging, and formatted with bullet points.
      `,
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
      ],
    });

    // --- HISTORY SANITIZATION ---

    // 2. Map incoming history to Gemini format
    let rawHistory = (history || []).map(msg => ({
      role: msg.role === 'assistant' || msg.role === 'model' ? 'model' : 'user',
      parts: [{ text: msg.parts ? msg.parts[0].text : (msg.content || msg.text || "") }] 
    }));

    // 3. CRITICAL FIX: Remove the last message from history if it is the User's current message
    // The frontend often sends the updated state including the current message. 
    // We must remove it from 'history' because 'sendMessage' sends it separately.
    if (rawHistory.length > 0) {
      const lastMsg = rawHistory[rawHistory.length - 1];
      if (lastMsg.role === 'user' && lastMsg.parts[0].text === message) {
        rawHistory.pop();
      }
    }

    // 4. Ensure history does NOT start with 'model' (Gemini API Requirement)
    while (rawHistory.length > 0 && rawHistory[0].role === 'model') {
      rawHistory.shift();
    }

    // 5. Merge consecutive messages from the same role to prevent API errors
    const sanitizedHistory = [];
    if (rawHistory.length > 0) {
      sanitizedHistory.push(rawHistory[0]);

      for (let i = 1; i < rawHistory.length; i++) {
        const currentMsg = rawHistory[i];
        const lastMsg = sanitizedHistory[sanitizedHistory.length - 1];

        if (currentMsg.role === lastMsg.role) {
          // Merge text if roles match
          lastMsg.parts[0].text += "\n\n" + currentMsg.parts[0].text;
        } else {
          sanitizedHistory.push(currentMsg);
        }
      }
    }

    // 6. Start Chat Session
    const chat = model.startChat({
      history: sanitizedHistory,
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
      },
    });

    // 7. Send the Message
    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    if (!text) {
      console.warn("Gemini returned empty text. Candidates:", JSON.stringify(response.candidates));
      throw new Error("Empty response from AI (Safety Block or Model Error)");
    }

    res.json({ text });

  } catch (error) {
    console.error("Chat Controller Error:", error);
    
    // Provide a more graceful fallback to the frontend
    res.status(500).json({ 
      message: 'AI Chat failed',
      error: error.message,
      text: "I'm having a little trouble thinking of that. Could you rephrase or try again?" 
    });
  }
});

export { handleChat };