import React, { useState } from 'react';
import { X, Sparkles, Send, Bot, User, CheckCircle2, CornerDownRight } from 'lucide-react';
import { askAIAdvisor } from '../../services/api';

interface AIAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  confidence?: number;
  factors?: string[];
  timestamp: string;
}

export const AIAssistantDrawer: React.FC<AIAssistantDrawerProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      text: 'Hello! I am DairyGuard AI, your operational plant analyst. I continuously evaluate plant telemetry across Energy, Hygiene, and Packaging Circularity. How can I assist you today?',
      confidence: 0.98,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const suggestedQuestions = [
    "Why did energy consumption increase today?",
    "Which area has the highest hygiene risk?",
    "Are we likely to meet our monthly waste target?",
    "What caused the sustainability score to fall?",
    "What should the plant manager investigate?"
  ];

  const handleSend = async (questionText?: string) => {
    const q = questionText || input;
    if (!q.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!questionText) setInput('');
    setLoading(true);

    try {
      const res = await askAIAdvisor(q);
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: res.answer,
        confidence: res.confidence_score,
        factors: res.key_factors,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: 'Sorry, I encountered an issue querying plant telemetry.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-lg bg-[#0B1220] border-l border-slate-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-emerald-400" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                DairyGuard AI Advisor
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] px-1.5 py-0.5 rounded font-mono">
                  Ground-Truth DB
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">Data-Aware Plant Intelligence Assistant</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Suggested Quick Prompts */}
        <div className="p-3 bg-slate-950/60 border-b border-slate-800/80 flex items-center space-x-2 overflow-x-auto no-scrollbar">
          <span className="text-[10px] text-slate-500 font-mono uppercase shrink-0">Prompts:</span>
          {suggestedQuestions.map((sq, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(sq)}
              className="text-[11px] bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/80 px-2.5 py-1 rounded-full whitespace-nowrap shrink-0 transition"
            >
              {sq}
            </button>
          ))}
        </div>

        {/* Messages Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex space-x-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'ai' && (
                <div className="h-7 w-7 rounded-lg bg-emerald-950 border border-emerald-500/40 flex items-center justify-center shrink-0 mt-1">
                  <Bot className="h-4 w-4 text-emerald-400" />
                </div>
              )}

              <div className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-emerald-600 text-white rounded-tr-none shadow-md'
                  : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none shadow-lg'
              }`}>
                <p className="whitespace-pre-line">{m.text}</p>

                {m.factors && m.factors.length > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-slate-800/80 space-y-1">
                    <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1">
                      <CornerDownRight className="h-3 w-3 text-emerald-400" />
                      Key Contributing Telemetry Factors:
                    </p>
                    <ul className="text-[11px] text-slate-300 space-y-0.5">
                      {m.factors.map((f, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <CheckCircle2 className="h-3 w-3 text-emerald-400 shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400">
                  <span>{m.timestamp}</span>
                  {m.confidence && (
                    <span className="font-mono text-emerald-400">
                      Confidence: {Math.round(m.confidence * 100)}%
                    </span>
                  )}
                </div>
              </div>

              {m.sender === 'user' && (
                <div className="h-7 w-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 mt-1">
                  <User className="h-4 w-4 text-slate-300" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center space-x-2 text-xs text-slate-400 font-mono">
              <div className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <span>DairyGuard AI evaluating database telemetry...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-slate-800 bg-slate-900/90">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about energy, hygiene risks, or waste targets..."
              className="flex-1 bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white shadow-md shadow-emerald-900/40 transition"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
