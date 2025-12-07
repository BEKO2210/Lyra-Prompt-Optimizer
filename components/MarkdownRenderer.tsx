import React from 'react';
import ReactMarkdown from 'react-markdown';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <div className="markdown-body text-sm md:text-base leading-relaxed break-words">
      <ReactMarkdown
        components={{
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const isInline = !match && !String(children).includes('\n');
            
            if (isInline) {
               return (
                <code className="bg-slate-700/50 text-orange-200 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                  {children}
                </code>
              );
            }

            return (
              <div className="relative group my-4">
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {/* Copy functionality could be added here if desired */}
                </div>
                <pre className="bg-slate-900/80 p-4 rounded-lg border border-slate-700/50 overflow-x-auto">
                  <code className={`font-mono text-sm text-slate-300 ${className}`} {...props}>
                    {children}
                  </code>
                </pre>
              </div>
            );
          },
          h1: ({children}) => <h1 className="text-xl font-bold text-white mb-3 mt-4 border-b border-slate-700 pb-2">{children}</h1>,
          h2: ({children}) => <h2 className="text-lg font-bold text-indigo-200 mb-2 mt-4">{children}</h2>,
          h3: ({children}) => <h3 className="text-base font-semibold text-indigo-300 mb-2 mt-3">{children}</h3>,
          strong: ({children}) => <strong className="font-bold text-indigo-400">{children}</strong>,
          ul: ({children}) => <ul className="list-disc pl-5 space-y-1 mb-4 text-slate-300">{children}</ul>,
          ol: ({children}) => <ol className="list-decimal pl-5 space-y-1 mb-4 text-slate-300">{children}</ol>,
          p: ({children}) => <p className="mb-3 text-slate-300 last:mb-0">{children}</p>,
          blockquote: ({children}) => <blockquote className="border-l-4 border-indigo-500 pl-4 py-1 my-4 bg-slate-800/30 italic text-slate-400 rounded-r">{children}</blockquote>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};