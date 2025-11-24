import asyncHandler from 'express-async-handler';
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// @desc    Generate enhanced text using Gemini
// @route   POST /api/ai/enhance
// @access  Private
const enhanceText = asyncHandler(async (req, res) => {
  const { text, field } = req.body;

  if (!text) {
    res.status(400);
    throw new Error('Please provide text to enhance');
  }

  try {
    // Select the model (Flash is faster and cheaper for this use case)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    let prompt = "";

    // Context-aware prompting
    if (field === 'shortDescription') {
      prompt = `You are a professional technical writer for a student portfolio platform. 
      Rewrite the following project description to be concise, impactful, and professional (max 2-3 sentences). 
      Focus on the problem solved and the solution provided.Dont give me any options only give one response with plain text no higlighting or anything and also dont say anything like hey this is your answer like since this response is directly submitted in form.
      Original Text: "${text}"`;
    } else if (field === 'outcome') {
      prompt = `You are a professional technical writer. 
      Rewrite the following project outcome to highlight achievements, metrics, and impact. 
      Make it sound impressive to recruiters. Use bullet points if appropriate but keep it brief.
      Dont give option 1 or option 2 like only give one response only context not pre content saying hey this is the required text like that since this response is directly submitted to form.

      Original Text: "${text}"`;
    } else {
      // Generic fallback
      prompt = `Your are professional technical writer for a student portfolio platform give detailed description with good formatting.Dont give any options give only one response and also dont give starting text like hey this your answer like that since this response is directly submitted in form.Dont give more text be a little brief and only use simple highlights and simple headings so frontend can display it clean and format it well"${text}"`;
    }

    // Call Gemini API
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const enhancedText = response.text();

    // Send back clean text
    res.json({ 
      originalText: text,
      enhancedText: enhancedText.trim() 
    });

  } catch (error) {
    console.error("Gemini AI Error:", error);
    res.status(500);
    throw new Error('Failed to generate AI content. Please try again later.');
  }
});

export { enhanceText };