import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Loader2, Minimize2, Sparkles, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ChatBot = () => {
  const { API_URL } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'model',
      text: "Hi! I'm your Project Guide. Tell me a domain (e.g., Web, AI) you like, and I'll recommend a project!"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', text: input };
    
    // Update UI immediately
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // --- HISTORY PREPARATION ---
      // 1. Filter out empty messages
      // 2. Remove the first hardcoded greeting (Gemini history must start with User)
      // 3. Map to strict format
      const historyForApi = messages
        .slice(1) // Skip the initial "Hi! I'm your Project Guide..." greeting
        .filter(msg => msg.text && msg.text.trim() !== "")
        .map(msg => ({
          role: msg.role === 'model' ? 'model' : 'user',
          parts: [{ text: msg.text }]
        }));

      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.text, // Send the current input separately
          history: historyForApi     // Send strictly previous context
        })
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Failed to get response");

      if (data.text) {
        setMessages(prev => [...prev, { role: 'model', text: data.text }]);
      } else {
        throw new Error("Empty response received");
      }

    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "I'm having trouble. Send your Skill Level again" }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-8 right-8 z-50 group flex items-center gap-3">

        {/* Hover Bubble */}
        <div
          className="
          pointer-events-none
          absolute right-16 bottom-1/2 translate-y-1/2
          opacity-0 group-hover:opacity-100
          group-hover:translate-x-0
          transition-all duration-300 ease-out
          bg-gradient-to-br from-gray-900 to-black
          border border-white/10
          px-4 py-3
          flex items-center gap-3
          rounded-full shadow-2xl
          whitespace-nowrap
          max-w-[220px]
        "
        >
          {/* Icon Bubble */}
          <div className="p-2 rounded-full bg-purple-600/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-purple-300" />
          </div>

          {/* Text */}
          <div className="flex flex-col min-w-0">
            <p className="text-white text-sm font-semibold leading-tight truncate">
              Need Project Ideas?
            </p>
            <p className="text-gray-400 text-xs leading-tight truncate">
              Ask our AI assistant
            </p>
          </div>
        </div>

        {/* BUTTON ICON */}
        <button
          onClick={() => setIsOpen(true)}
          className="
          relative p-4 rounded-2xl
          bg-gradient-to-br from-blue-600 to-purple-600
          hover:scale-110 transition-all duration-300
          shadow-xl border border-white/20
          flex items-center justify-center
          "
        >
          <Sparkles className="w-6 h-6 text-white" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-8 right-8 z-50 w-[90vw] md:w-[420px] flex flex-col shadow-2xl">
      {/* Outer Glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-blue-600/20 rounded-3xl blur-2xl opacity-60"></div>

      {/* Main Container */}
      <div className="relative h-[600px] max-h-[85vh] flex flex-col bg-gradient-to-br from-gray-900 via-black to-gray-900 border border-white/20 rounded-3xl overflow-hidden backdrop-blur-xl">

        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        {/* Header */}
        <div className="relative bg-gradient-to-r from-gray-900/95 via-black/95 to-gray-900/95 backdrop-blur-xl border-b border-white/10 flex-none">
          <div className="p-5 flex justify-between items-center">
            <div className="flex items-center gap-3">
              {/* Bot Avatar */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl blur-md opacity-60"></div>
                <div className="relative p-2.5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                {/* Active Indicator */}
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-black animate-pulse"></div>
              </div>

              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  Project Assistant
                  <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
                </h3>
                <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                  <span className="relative flex">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                    <span className="absolute w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"></span>
                  </span>
                  Ready to help
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300 group"
            >
              <Minimize2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>

        {/* Messages Area - SCROLL FIX APPLIED HERE */}
        <div 
          className="relative flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent overscroll-contain"
          data-lenis-prevent
        >
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeInUp`}
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              {msg.role === 'model' && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 border border-white/10 flex items-center justify-center mr-2 flex-shrink-0">
                  <Bot className="w-4 h-4 text-blue-400" />
                </div>
              )}

              <div className={`
                max-w-[80%] rounded-2xl text-sm leading-relaxed shadow-lg
                ${msg.role === 'user'
                  ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white px-4 py-3 rounded-tr-md border border-blue-500/30'
                  : 'bg-gradient-to-br from-white/10 to-white/5 text-gray-100 px-4 py-3 rounded-tl-md border border-white/10 backdrop-blur-sm'
                }
              `}>
                {msg.text ? (
                  msg.text.split('\n').map((line, i) => (
                    <p key={i} className={`${line.startsWith('*') || line.startsWith('-') ? 'pl-2 mb-1.5' : 'mb-1.5'} ${i === msg.text.split('\n').length - 1 ? 'mb-0' : ''}`}>
                      {line.split('**').map((part, j) =>
                        j % 2 === 1
                          ? <strong key={j} className={msg.role === 'user' ? 'text-blue-100 font-bold' : 'text-blue-300 font-bold'}>{part}</strong>
                          : part
                      )}
                    </p>
                  ))
                ) : (
                  <span className="italic text-gray-500">...</span>
                )}
              </div>

              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center ml-2 flex-shrink-0 shadow-lg">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start animate-fadeInUp">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 border border-white/10 flex items-center justify-center mr-2">
                <Bot className="w-4 h-4 text-blue-400" />
              </div>
              <div className="bg-gradient-to-br from-white/10 to-white/5 px-5 py-3 rounded-2xl rounded-tl-md flex gap-1.5 items-center border border-white/10 backdrop-blur-sm shadow-lg">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="relative p-5 bg-gradient-to-r from-gray-900/95 via-black/95 to-gray-900/95 backdrop-blur-xl border-t border-white/10 flex-none">
          <div className="relative flex items-center gap-2 bg-white/5 rounded-2xl px-5 py-3 border border-white/10 focus-within:border-blue-500/50 focus-within:bg-white/10 transition-all duration-300 shadow-lg backdrop-blur-sm">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything..."
              className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="relative group p-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-500 hover:to-purple-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-blue-500/50 hover:scale-105 disabled:hover:scale-100"
            >
              <Send className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            </button>
          </div>

          {/* Hint Text */}
          <p className="text-xs text-gray-500 mt-3 text-center flex items-center justify-center gap-1">
            <Zap className="w-3 h-3 text-yellow-400" />
            Powered by AI - Try asking about Web, Mobile, or AI projects
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.3s ease-out both;
        }

        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }

        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }

        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }

        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
};

export default ChatBot;