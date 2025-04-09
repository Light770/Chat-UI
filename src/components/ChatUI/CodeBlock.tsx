// src/components/ChatUI/CodeBlock.tsx
import React, { useState } from 'react';
import { DocumentDuplicateIcon, ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline';

interface CodeBlockProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  className?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = 'javascript',
  showLineNumbers = true,
  className = '',
}) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const codeLines = code.split('\n');
  
  return (
    <div className={`relative rounded-lg overflow-hidden shadow-sm ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-gray-800 text-gray-200 border-b border-gray-700">
        <span className="text-xs font-medium">{language.toUpperCase()}</span>
        <button 
          onClick={copyToClipboard}
          className="text-gray-400 hover:text-white transition-colors duration-200"
          aria-label="Copy code"
        >
          {copied ? (
            <ClipboardDocumentCheckIcon className="h-4 w-4 text-green-400" />
          ) : (
            <DocumentDuplicateIcon className="h-4 w-4" />
          )}
        </button>
      </div>
      
      {/* Code container */}
      <div className="overflow-x-auto bg-gray-900 text-gray-200">
        <pre className="text-sm font-mono p-4">
          <code>
            {showLineNumbers ? (
              <table className="min-w-full border-collapse">
                <tbody>
                  {codeLines.map((line, i) => (
                    <tr key={i} className="leading-relaxed hover:bg-gray-800/50">
                      <td className="text-right pr-4 select-none text-gray-500 w-8 text-xs">{i + 1}</td>
                      <td className="whitespace-pre pl-2">{line || ' '}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="whitespace-pre-wrap">{code}</div>
            )}
          </code>
        </pre>
      </div>
    </div>
  );
};

export default CodeBlock;