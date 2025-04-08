// components/ChatUI/CodeBlock.tsx
import React, { useState } from 'react';
import { ClipboardDocumentIcon, ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline';

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

  // Format language display
  const formatLanguage = (lang: string) => {
    const langMap: Record<string, string> = {
      'js': 'JavaScript',
      'javascript': 'JavaScript',
      'ts': 'TypeScript',
      'typescript': 'TypeScript',
      'py': 'Python',
      'python': 'Python',
      'jsx': 'React JSX',
      'tsx': 'React TSX',
      'html': 'HTML',
      'css': 'CSS',
      'json': 'JSON',
      'md': 'Markdown',
      'bash': 'Bash',
      'sh': 'Shell',
    };

    return langMap[lang.toLowerCase()] || lang;
  };

  const codeLines = code.split('\n');
  
  return (
    <div className={`relative rounded-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 text-gray-200">
        <span className="text-sm font-mono">{formatLanguage(language)}</span>
        <button 
          onClick={copyToClipboard}
          className="text-gray-400 hover:text-white transition-colors duration-200"
          aria-label="Copy code"
        >
          {copied ? (
            <ClipboardDocumentCheckIcon className="h-5 w-5 text-green-400" />
          ) : (
            <ClipboardDocumentIcon className="h-5 w-5" />
          )}
        </button>
      </div>
      
      {/* Code container */}
      <div className="relative overflow-x-auto bg-gray-900 p-4">
        <pre className="text-sm font-mono language-highlight">
          <code className={`language-${language}`}>
            {showLineNumbers ? (
              <table className="min-w-full">
                <tbody>
                  {codeLines.map((line, i) => (
                    <tr key={i} className="leading-relaxed">
                      <td className="text-right pr-4 select-none text-gray-500 w-12">
                        {i + 1}
                      </td>
                      <td className="text-gray-200 whitespace-pre">
                        {line || ' '}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-gray-200 whitespace-pre-wrap">{code}</div>
            )}
          </code>
        </pre>
      </div>
    </div>
  );
};

export default CodeBlock;