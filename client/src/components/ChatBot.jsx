import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Loader2, Minimize2 } from 'lucide-react';
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

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Frontend Safety: Remove initial greeting before sending to API
      const historyForApi = messages
        .filter(msg => msg.text) // Remove empty messages
        .slice(1) // Remove the first greeting (Model role)
        .map(msg => ({
          role: msg.role === 'model' ? 'model' : 'user',
          parts: [{ text: msg.text }]
        }));

      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: input,
          history: historyForApi
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
      setMessages(prev => [...prev, { role: 'model', text: "I'm having trouble connecting to the brain right now. Please try again in a moment." }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 p-4 bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-2xl transition-all hover:scale-110 flex items-center gap-2 group"
      >
        <MessageSquare className="w-6 h-6" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap text-sm font-bold">
          Need Ideas?
        </span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[90vw] md:w-[400px] h-[500px] max-h-[80vh] flex flex-col bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 duration-300">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900/80 to-blue-900/80 p-4 flex justify-between items-center border-b border-white/10 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-white/10 rounded-lg">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Project Assistant</h3>
            <span className="flex items-center gap-1 text-[10px] text-green-300">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
              Online
            </span>
          </div>
        </div>
        <button 
          onClick={() => setIsOpen(false)}
          className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
        >
          <Minimize2 className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-black/95">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`
              max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed
              ${msg.role === 'user' 
                ? 'bg-purple-600 text-white rounded-tr-sm' 
                : 'bg-white/10 text-gray-200 rounded-tl-sm border border-white/5'
              }
            `}>
              {/* Robust Rendering: Handle potential non-string or empty text */}
              {msg.text ? (
                msg.text.split('\n').map((line, i) => (
                  <p key={i} className={`min-h-[1.2em] ${line.startsWith('*') || line.startsWith('-') ? 'pl-2 mb-1' : 'mb-1'}`}>
                    {/* Simple bold parsing for **text** */}
                    {line.split('**').map((part, j) => 
                      j % 2 === 1 ? <strong key={j} className="text-purple-300">{part}</strong> : part
                    )}
                  </p>
                ))
              ) : (
                <span className="italic text-gray-500">...</span>
              )}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white/5 p-3 rounded-2xl rounded-tl-sm flex gap-1 items-center border border-white/5">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="p-3 bg-[#0a0a0a] border-t border-white/10">
        <div className="flex items-center gap-2 bg-white/5 rounded-full px-4 py-2 border border-white/10 focus-within:border-purple-500 transition-colors">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your domain..."
            className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none"
            disabled={isLoading}
          />
          <button 
            type="submit" 
            disabled={isLoading || !input.trim()}
            className="p-1.5 bg-purple-600 text-white rounded-full hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>

    </div>
  );
};

export default ChatBot;