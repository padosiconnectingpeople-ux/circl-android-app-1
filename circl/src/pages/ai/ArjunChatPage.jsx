import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Sparkles, Plus, Copy, Check } from 'lucide-react';
import Avatar from '@components/common/Avatar';
import Button from '@components/common/Button';
import { askArjun } from '@services/aiService';
import useAuthStore from '@store/authStore';

const ArjunChatPage = () => {
  const navigate = useNavigate();
  const profile = useAuthStore((s) => s.profile);

  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'arjun',
      text: "Ram Ram Ji! Main hoon Arjun, aapka Hinglish business mentor. Circl community mein aapke business ko next level par le jaane mein help karunga. Kuch bhi poochho! 🇮🇳",
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const handleSend = async () => {
    if (!inputText.trim()) return;
    const userMsg = { id: Date.now().toString(), sender: 'user', text: inputText };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    const history = messages.map(m => ({ role: m.sender === 'user' ? 'user' : 'model', parts: [{ text: m.text }] }));
    const response = await askArjun(inputText, history, profile || {});

    setMessages((prev) => [
      ...prev,
      { id: (Date.now() + 1).toString(), sender: 'arjun', text: response }
    ]);
    setLoading(false);
  };

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="animate-fade-in p-md h-screen flex flex-col justify-between max-w-lg mx-auto bg-card">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-outline-variant/10 pb-3 shrink-0">
        <button onClick={() => navigate(-1)} className="p-1 rounded-full hover:bg-surface-container transition-colors">
          <ArrowLeft className="w-6 h-6 text-on-surface" />
        </button>
        <div className="flex items-center gap-2 flex-1">
          <Avatar name="Arjun Mentor" size="sm" />
          <div>
            <h2 className="text-body-lg font-bold text-on-surface flex items-center gap-1">
              Arjun <Sparkles className="w-3.5 h-3.5 text-primary fill-primary" />
            </h2>
            <span className="text-[10px] text-primary font-bold">Hinglish Business Mentor (GLM 4.6)</span>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto space-y-4 py-4 pr-1 hide-scrollbar">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div key={msg.id} className={`flex gap-2.5 max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}>
              {!isUser && <Avatar name="Arjun" size="xs" />}
              <div className="space-y-1">
                <div className={`p-3 rounded-2xl text-body-md ${
                  isUser
                    ? 'bg-primary text-on-primary rounded-tr-none'
                    : 'bg-surface-container-low border border-outline-variant/10 text-on-surface rounded-tl-none'
                }`}>
                  <p className="whitespace-pre-wrap leading-[1.4]">{msg.text}</p>
                </div>
                {!isUser && (
                  <button
                    onClick={() => handleCopy(msg.id, msg.text)}
                    className="flex items-center gap-1 text-[10px] font-bold text-text-muted hover:text-primary transition-colors ml-1"
                  >
                    {copiedId === msg.id ? <Check className="w-3 h-3 text-success" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedId === msg.id ? 'Copied' : 'Copy Response'}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
        {loading && (
          <div className="flex gap-2.5 max-w-[85%] mr-auto items-center">
            <Avatar name="Arjun" size="xs" />
            <div className="bg-surface-container-low border border-outline-variant/10 p-3 rounded-2xl rounded-tl-none text-text-muted text-body-md flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 shrink-0 border-t border-outline-variant/10 pt-3 pb-safe">
        <input
          type="text"
          placeholder="Ask Arjun business advice..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          className="input-field flex-1"
        />
        <button
          onClick={handleSend}
          disabled={!inputText.trim() || loading}
          className="w-12 h-12 bg-primary hover:bg-primary-dark text-white rounded-xl flex items-center justify-center transition-all disabled:opacity-50"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ArjunChatPage;
