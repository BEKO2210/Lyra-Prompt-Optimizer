import React, { useState, useRef, useEffect } from 'react';
import { Message, Role, AppSettings, TargetAI, OptimizationMode } from './types';
import { sendMessageStream } from './services/gemini';
import { WELCOME_MESSAGE_TEXT } from './constants';
import { ChatMessage } from './components/ChatMessage';
import { SettingsPanel } from './components/SettingsPanel';
import { Send, Menu, X, Sparkles, AlertCircle } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: Role.MODEL,
      text: WELCOME_MESSAGE_TEXT,
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [settings, setSettings] = useState<AppSettings>({
    targetAI: TargetAI.CHATGPT,
    mode: OptimizationMode.BASIC,
  });
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const apiKey = process.env.API_KEY;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isStreaming]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [inputValue]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || isStreaming) return;
    if (!apiKey) {
      setError("API Key is missing from environment variables.");
      return;
    }

    const userText = inputValue.trim();
    setInputValue('');
    // Reset textarea height
    if (textareaRef.current) textareaRef.current.style.height = 'auto';

    // Construct the context-aware prompt if it's one of the first few interactions
    // or we can just append context invisibly.
    // The instructions say "Inform user with override option", so passing the context explicitly is good.
    // We will append the context to the actual message sent to Gemini, but display the clean message to the user.
    
    const contextPrefix = `[CONTEXT - Target: ${settings.targetAI}, Mode: ${settings.mode}] `;
    const fullPromptToSend = `${contextPrefix} ${userText}`;

    const newMessage: Message = {
      id: uuidv4(),
      role: Role.USER,
      text: userText,
    };

    setMessages((prev) => [...prev, newMessage]);
    setIsStreaming(true);
    setError(null);

    try {
      const responseId = uuidv4();
      
      // Initialize empty response message
      setMessages((prev) => [
        ...prev,
        {
          id: responseId,
          role: Role.MODEL,
          text: '',
          isStreaming: true,
        },
      ]);

      let fullResponseText = '';
      
      const stream = sendMessageStream(apiKey, fullPromptToSend);

      for await (const chunk of stream) {
        fullResponseText += chunk;
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === responseId
              ? { ...msg, text: fullResponseText }
              : msg
          )
        );
      }
      
      // Finish streaming
       setMessages((prev) =>
          prev.map((msg) =>
            msg.id === responseId
              ? { ...msg, isStreaming: false }
              : msg
          )
        );

    } catch (err) {
      console.error(err);
      setError("Failed to generate response. Please try again.");
      setMessages((prev) => prev.slice(0, -1)); // Remove the empty/failed bot message
    } finally {
      setIsStreaming(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex h-full w-full bg-slate-950 text-slate-200">
      {/* Mobile Sidebar Overlay */}
      {showMobileSidebar && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() => setShowMobileSidebar(false)}
        />
      )}

      {/* Sidebar (Settings) */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 border-r border-slate-800 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0
        ${showMobileSidebar ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="absolute top-2 right-2 md:hidden">
            <button onClick={() => setShowMobileSidebar(false)} className="p-2 text-slate-400">
                <X size={20} />
            </button>
        </div>
        <SettingsPanel settings={settings} onSettingsChange={setSettings} />
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col h-full relative w-full max-w-5xl mx-auto">
        
        {/* Header (Mobile only toggle) */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md z-30 sticky top-0">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <Sparkles className="text-white" size={16} />
            </div>
            <span className="font-bold text-lg text-slate-100">Lyra</span>
          </div>
          <button 
            onClick={() => setShowMobileSidebar(true)}
            className="p-2 text-slate-400 hover:text-white bg-slate-800/50 rounded-lg"
          >
            <Menu size={20} />
          </button>
        </div>

        {/* Error Banner */}
        {error && (
            <div className="bg-red-500/10 border-b border-red-500/20 px-4 py-2 flex items-center justify-center gap-2 text-red-200 text-sm">
                <AlertCircle size={16} />
                {error}
            </div>
        )}

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-2 scrollbar-hide">
          <div className="max-w-3xl mx-auto">
             {messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
              ))}
              <div ref={messagesEndRef} className="h-4" />
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 md:p-6 bg-gradient-to-t from-slate-950 via-slate-950 to-transparent z-20">
          <div className="max-w-3xl mx-auto relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-500"></div>
            <div className="relative flex items-end gap-2 bg-slate-900 border border-slate-700 focus-within:border-indigo-500/50 rounded-2xl p-2 shadow-2xl transition-colors">
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={settings.mode === OptimizationMode.DETAIL ? "Describe your request in detail (Enter to send)" : "Enter your rough prompt here..."}
                className="flex-1 bg-transparent border-0 text-slate-200 placeholder-slate-500 focus:ring-0 resize-none py-3 px-3 min-h-[50px] max-h-[150px] scrollbar-hide"
                rows={1}
                disabled={isStreaming}
              />
              <button
                onClick={() => handleSubmit()}
                disabled={!inputValue.trim() || isStreaming}
                className={`mb-1 p-3 rounded-xl flex items-center justify-center transition-all duration-200 ${
                  !inputValue.trim() || isStreaming
                    ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                    : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-500/20'
                }`}
              >
                {isStreaming ? (
                   <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                   <Send size={20} />
                )}
              </button>
            </div>
             <p className="text-center text-xs text-slate-500 mt-2 hidden md:block">
               {settings.mode === OptimizationMode.DETAIL ? 'Detailed Mode Active: I might ask questions.' : 'Basic Mode Active: Quick optimization.'}
            </p>
          </div>
        </div>

      </main>
    </div>
  );
}

export default App;