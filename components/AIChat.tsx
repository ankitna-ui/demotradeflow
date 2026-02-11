import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, Loader2, ChevronRight } from 'lucide-react';
import { getAIDecisionSupport } from '../services/geminiService';
import { Vendor, Product, SaleOrder } from '../types';

interface AIChatProps {
  vendors: Vendor[];
  products: Product[];
  sales: SaleOrder[];
}

const AIChat: React.FC<AIChatProps> = ({ vendors, products, sales }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([
    { role: 'ai', text: 'Hello Director. I have analyzed your real-time data. Ask me about vendor margins, stock risks, or sales trends.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async (text = input) => {
    if (!text.trim()) return;
    
    const userMsg = text;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsLoading(true);

    const response = await getAIDecisionSupport(userMsg, { vendors, products, sales });
    
    setMessages(prev => [...prev, { role: 'ai', text: response }]);
    setIsLoading(false);
  };

  const quickPrompts = [
    "Where am I losing money?",
    "Which vendor gives best margin?",
    "Suggest stock to clear",
    "Predict next month revenue"
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
      <div className="pointer-events-auto">
      {isOpen && (
        <div className="mb-4 w-96 bg-white rounded-xl shadow-2xl border border-indigo-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              <div>
                <span className="font-semibold block text-sm">AI Decision Architect</span>
                <span className="text-[10px] opacity-80 uppercase tracking-wider">Gemini 2.0 Flash</span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 rounded p-1 transition">
              <X className="h-4 w-4" />
            </button>
          </div>
          
          <div className="h-80 overflow-y-auto p-4 bg-slate-50 space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl p-3 text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-br-none' 
                    : 'bg-white border border-slate-200 text-slate-800 shadow-sm rounded-bl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-none p-3 shadow-sm">
                  <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="px-4 py-2 bg-slate-50 flex gap-2 overflow-x-auto no-scrollbar pb-3">
             {quickPrompts.map((prompt, i) => (
                <button 
                  key={i} 
                  onClick={() => handleSend(prompt)}
                  className="whitespace-nowrap bg-white border border-indigo-100 text-indigo-600 text-xs px-3 py-1.5 rounded-full hover:bg-indigo-50 hover:border-indigo-300 transition shadow-sm"
                >
                  {prompt}
                </button>
             ))}
          </div>

          <div className="p-3 bg-white border-t border-slate-100 flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask for data insights..."
              className="flex-1 bg-slate-100 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <button 
              onClick={() => handleSend()}
              disabled={isLoading}
              className="bg-indigo-600 text-white p-2.5 rounded-xl hover:bg-indigo-700 transition disabled:opacity-50 shadow-lg shadow-indigo-200"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xl hover:shadow-indigo-500/40 transition-all hover:scale-105"
      >
        <Bot className="h-8 w-8" />
        <span className="absolute right-full mr-4 bg-slate-900 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition whitespace-nowrap shadow-lg font-medium">
          Talk to AI Analyst
        </span>
        {/* Notification Dot */}
        <span className="absolute top-0 right-0 h-4 w-4 bg-rose-500 rounded-full border-2 border-white animate-pulse"></span>
      </button>
      </div>
    </div>
  );
};

export default AIChat;
