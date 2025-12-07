import React from 'react';
import { Message, Role } from '../types';
import { MarkdownRenderer } from './MarkdownRenderer';
import { Bot, User, Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === Role.USER;
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-6 group`}>
      <div className={`flex max-w-[90%] md:max-w-[80%] lg:max-w-[70%] gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center ${
          isUser ? 'bg-indigo-600' : 'bg-emerald-600'
        } shadow-lg shadow-black/20`}>
          {isUser ? <User size={18} className="text-white" /> : <Bot size={18} className="text-white" />}
        </div>

        {/* Bubble */}
        <div className={`relative px-4 py-3 md:px-6 md:py-4 rounded-2xl shadow-md ${
          isUser 
            ? 'bg-indigo-600 text-white rounded-tr-sm' 
            : 'bg-slate-800 border border-slate-700 rounded-tl-sm'
        }`}>
          {/* Header for AI messages */}
          {!isUser && (
            <div className="flex justify-between items-center mb-2 pb-2 border-b border-slate-700/50">
              <span className="text-xs font-bold text-emerald-400 tracking-wider uppercase">Lyra AI</span>
              <button 
                onClick={handleCopy}
                className="text-slate-400 hover:text-white transition-colors p-1 rounded hover:bg-slate-700"
                title="Copy full response"
              >
                {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              </button>
            </div>
          )}

          <div className={`${isUser ? 'text-white' : ''}`}>
             {isUser ? (
               <p className="whitespace-pre-wrap">{message.text}</p>
             ) : (
               <MarkdownRenderer content={message.text} />
             )}
          </div>
          
          {message.isStreaming && (
            <div className="flex gap-1 mt-2 items-center h-4">
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};