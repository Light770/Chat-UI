'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
// Import components directly to avoid circular references
import ChatContainer from './ChatUI/ChatContainer';
import Sidebar from './ChatUI/Sidebar';
import FileViewer from './ChatUI/FileViewer';
import AIFeaturesPanel from './ChatUI/AIFeaturesPanel';
import GraphVisualizer from './ChatUI/GraphVisualizer';
import CodePanel from './ChatUI/CodePanel';
import ThemeToggle from './ChatUI/ThemeToggle';
import ToolbarButton from './ChatUI/ToolbarButton';

import { 
  ChatBubbleLeftRightIcon, 
  DocumentTextIcon, 
  ChartBarIcon, 
  CogIcon, 
  Bars3Icon,
  XMarkIcon,
  CodeBracketIcon
} from '@heroicons/react/24/outline';
import { ChatMessage, MessageType, GraphData } from '../types';
import { cn } from '@/lib/utils';

import { 
    sampleUser, 
    sampleConversations, 
    initialMessages, 
    sampleGraphData,
    getDefaultConversation
} from './sample-data/getDefaultConversation';

const ChatApplication = () => {
    const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
    const [isTyping, setIsTyping] = useState(false);
    const [selectedConversation, setSelectedConversation] = useState(
      getDefaultConversation().id
    );
    const [activePanel, setActivePanel] = useState<'ai-features' | 'graph' | 'files' | 'code' | null>('code');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [codePanelWidth, setCodePanelWidth] = useState(450);
    const resizeRef = useRef<HTMLDivElement>(null);
    const isResizingRef = useRef(false);
    const startXRef = useRef(0);
    const startWidthRef = useRef(0);

    // Sample code for demonstration
    const [currentCode, setCurrentCode] = useState(`// Sample code for demonstration
import React, { useState } from 'react';

const Counter = () => {
  const [count, setCount] = useState(0);
  
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-2">Counter: {count}</h2>
      <div className="flex space-x-2">
        <button 
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => setCount(count + 1)}
        >
          Increment
        </button>
        <button 
          className="px-4 py-2 bg-red-500 text-white rounded"
          onClick={() => setCount(count - 1)}
        >
          Decrement
        </button>
      </div>
    </div>
  );
};

export default Counter;`);

    // Check if we're on mobile and adjust sidebar accordingly
    useEffect(() => {
        const checkMobile = () => {
            const isMobileView = window.innerWidth < 768;
            setIsMobile(isMobileView);
            
            // Auto-close sidebar on mobile
            if (isMobileView) {
                setIsSidebarOpen(false);
            } else {
                setIsSidebarOpen(true);
            }

            // Adjust code panel width on mobile
            if (isMobileView && codePanelWidth > 300) {
                setCodePanelWidth(300);
            }
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, [codePanelWidth]);

    // Set up panel resize functionality
    useEffect(() => {
        const handleMouseDown = (e: MouseEvent) => {
            if (resizeRef.current && resizeRef.current.contains(e.target as Node)) {
                isResizingRef.current = true;
                startXRef.current = e.clientX;
                startWidthRef.current = codePanelWidth;
                document.body.style.cursor = 'col-resize';
                document.body.style.userSelect = 'none';
            }
        };

        const handleMouseMove = (e: MouseEvent) => {
            if (!isResizingRef.current) return;
            
            const delta = startXRef.current - e.clientX;
            let newWidth = startWidthRef.current + delta;
            
            // Set min and max width limits
            newWidth = Math.max(300, Math.min(800, newWidth));
            
            setCodePanelWidth(newWidth);
        };

        const handleMouseUp = () => {
            isResizingRef.current = false;
            document.body.style.removeProperty('cursor');
            document.body.style.removeProperty('user-select');
        };

        document.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [codePanelWidth]);

    // Message handling
    const handleSendMessage = useCallback((content: string) => {
        if (!content.trim()) return;

        const userMessage: ChatMessage = {
            id: `user-${Date.now()}`,
            content,
            sender: 'user',
            type: MessageType.TEXT,
            timestamp: new Date()
        };
        
        setMessages(prev => [...prev, userMessage]);
        setIsTyping(true);
        
        // Auto-close sidebar on mobile when sending a message
        if (isMobile && isSidebarOpen) {
            setIsSidebarOpen(false);
        }
        
        // Simulate AI response
        setTimeout(() => {
            const aiMessage: ChatMessage = {
                id: `ai-${Date.now()}`,
                content: simulateAIResponse(content),
                sender: 'ai',
                type: MessageType.TEXT,
                timestamp: new Date()
            };
            
            setMessages(prev => [...prev, aiMessage]);
            setIsTyping(false);
            
            // Context-based panel activation
            if (content.toLowerCase().includes('code') || content.toLowerCase().includes('function')) {
                setActivePanel('code');
                
                // For demo: If user asks for code, update the code panel
                if (content.toLowerCase().includes('react') || content.toLowerCase().includes('component')) {
                    setCurrentCode(`// React component example
import React, { useState, useEffect } from 'react';

function DataFetcher() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://api.example.com/data');
        const result = await response.json();
        setData(result);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="data-container">
      <h2>Data Results</h2>
      <ul>
        {data.map((item, index) => (
          <li key={index}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default DataFetcher;`);
                }
            } else if (content.toLowerCase().includes('graph') || content.toLowerCase().includes('visualize')) {
                setActivePanel('graph');
            } else if (content.toLowerCase().includes('file') || content.toLowerCase().includes('document')) {
                setActivePanel('files');
            }
        }, 1500);
    }, [isMobile, isSidebarOpen]);

    // Simulate AI response
    const simulateAIResponse = (userMessage: string) => {
        const lowerMessage = userMessage.toLowerCase();
        
        if (lowerMessage.includes('help')) {
            return "I'm here to assist you. What specific help do you need?";
        }
        
        if (lowerMessage.includes('project') || lowerMessage.includes('planning')) {
            return "For project planning, I can help break down tasks, estimate timelines, and suggest best practices.";
        }
        
        if (lowerMessage.includes('data') || lowerMessage.includes('analysis')) {
            return "I can help you analyze data, create visualizations, and provide insights.";
        }
        
        if (lowerMessage.includes('code') || lowerMessage.includes('function')) {
            return "I've generated a code example based on your request. You can see it in the code panel.";
        }
        
        return `I'm processing your request about: "${userMessage.substring(0, 30)}${userMessage.length > 30 ? '...' : ''}"`;
    };

    // Panel toggle
    const togglePanel = (panel: 'ai-features' | 'graph' | 'files' | 'code') => {
        setActivePanel(current => current === panel ? null : panel);
    };

    // Sidebar toggle
    const toggleSidebar = () => {
        setIsSidebarOpen(prev => !prev);
    };

    // Calculate main content width based on sidebar state
    const getMainContentStyle = () => {
        if (isMobile) {
            return {};
        }
        
        return {
            marginLeft: isSidebarOpen ? '16rem' : '0',
            width: isSidebarOpen ? 'calc(100% - 16rem)' : '100%'
        };
    };

    // Calculate chat container width based on code panel
    const getChatContainerStyle = () => {
        if (isMobile || !activePanel || activePanel !== 'code') {
            return { width: '100%' };
        }
        
        return {
            width: `calc(100% - ${codePanelWidth}px)`
        };
    };

    return (
        <div className="flex h-screen w-screen bg-gradient-to-br from-pink-50 to-blue-50 dark:from-gray-900 dark:to-blue-950 text-gray-900 dark:text-white overflow-hidden">
            {/* Sidebar */}
            <div 
                className={cn(
                    "fixed h-full z-40 transition-all duration-300 ease-in-out",
                    "glass-effect-colored backdrop-blur-xl",
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full",
                    "w-64",
                    isMobile ? "shadow-xl" : "shadow-lg"
                )}
            >
                <Sidebar
                    user={sampleUser}
                    conversations={sampleConversations}
                    selectedConversationId={selectedConversation}
                    onSelectConversation={(id) => {
                        setSelectedConversation(id);
                        if (isMobile) setIsSidebarOpen(false);
                    }}
                    onNewConversation={() => setMessages(initialMessages)}
                    onDeleteConversation={(id) => console.log('Delete conversation', id)}
                    onSignOut={() => console.log('Sign out')}
                    className="h-full"
                />
            </div>

            {/* Mobile overlay when sidebar is open */}
            {isMobile && isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/20 z-30 backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Main content */}
            <div 
                className="flex flex-col flex-1 overflow-hidden transition-all duration-300 ease-in-out"
                style={getMainContentStyle()}
            >
                {/* Header */}
                <div className="glass-effect border-b border-white/20 dark:border-gray-700/30 p-4 flex justify-between items-center backdrop-blur-xl">
                    <div className="flex items-center">
                        <button 
                            onClick={toggleSidebar}
                            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white glass-effect p-2 rounded-full mr-4"
                            aria-label={isSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
                        >
                            {isSidebarOpen ? <XMarkIcon className="h-5 w-5" /> : <Bars3Icon className="h-5 w-5" />}
                        </button>
                        <h1 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">AI Assistant</h1>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                        <div className="flex space-x-2">
                            <ToolbarButton
                                icon={<CodeBracketIcon className="h-5 w-5" />}
                                label="Code Panel"
                                onClick={() => togglePanel('code')}
                                active={activePanel === 'code'}
                            />
                            <ToolbarButton
                                icon={<ChartBarIcon className="h-5 w-5" />}
                                label="Knowledge Graph"
                                onClick={() => togglePanel('graph')}
                                active={activePanel === 'graph'}
                            />
                            <ToolbarButton
                                icon={<DocumentTextIcon className="h-5 w-5" />}
                                label="Files"
                                onClick={() => togglePanel('files')}
                                active={activePanel === 'files'}
                            />
                            <ToolbarButton
                                icon={<CogIcon className="h-5 w-5" />}
                                label="AI Features"
                                onClick={() => togglePanel('ai-features')}
                                active={activePanel === 'ai-features'}
                            />
                        </div>
                        <ThemeToggle />
                    </div>
                </div>

                {/* Main content area with chat and code panel */}
                <div className="flex-1 flex overflow-hidden">
                    {/* Chat Container */}
                    <div 
                        className="flex flex-col overflow-hidden transition-all duration-300 ease-in-out"
                        style={getChatContainerStyle()}
                    >
                        <ChatContainer
                            messages={messages}
                            onSendMessage={handleSendMessage}
                            isTyping={isTyping}
                            className="flex-1"
                        />
                    </div>
                    
                    {/* Code Panel */}
                    {activePanel === 'code' && (
                        <>
                            {/* Resize handle */}
                            <div 
                                ref={resizeRef}
                                className="w-1 h-full bg-gray-300/50 dark:bg-gray-700/50 cursor-col-resize hover:bg-blue-500/50 transition-colors"
                            />
                            
                            {/* Code panel */}
                            <div 
                                className="h-full overflow-auto glass-effect-strong backdrop-blur-xl border-l border-white/20 dark:border-gray-700/30 transition-all duration-300"
                                style={{ width: `${codePanelWidth}px` }}
                            >
                                <CodePanel 
                                    code={currentCode}
                                    language="javascript" 
                                    onCodeChange={setCurrentCode}
                                    onClose={() => setActivePanel(null)}
                                />
                            </div>
                        </>
                    )}

                    {/* Other panels */}
                    {activePanel && activePanel !== 'code' && (
                        <div className="fixed right-0 h-[calc(100%-4rem)] top-16 w-96 overflow-y-auto glass-effect backdrop-blur-xl border-l border-white/20 dark:border-gray-700/30">
                            <div className="flex justify-between items-center p-4 border-b border-white/20 dark:border-gray-700/30">
                                <h2 className="text-lg font-semibold gradient-text">
                                    {activePanel === 'ai-features' ? 'AI Features' : 
                                    activePanel === 'graph' ? 'Knowledge Graph' : 
                                    'Document Viewer'}
                                </h2>
                                <button 
                                    onClick={() => setActivePanel(null)}
                                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-2 glass-effect rounded-full"
                                >
                                    <XMarkIcon className="h-5 w-5" />
                                </button>
                            </div>
                            
                            {activePanel === 'ai-features' && (
                                <AIFeaturesPanel
                                    features={[
                                        { 
                                            id: 'rag', 
                                            name: 'Retrieval Augmented Generation', 
                                            description: 'Enhance responses with document context' 
                                        }
                                    ]}
                                    models={[
                                        { 
                                            id: 'default', 
                                            name: 'Balanced Model', 
                                            description: 'Optimal performance and speed' 
                                        }
                                    ]}
                                    selectedModel="default"
                                    onToggleFeature={() => {}}
                                    onSelectModel={() => {}}
                                />
                            )}

                            {activePanel === 'graph' && (
                                <div className="p-4">
                                    <GraphVisualizer
                                        data={sampleGraphData}
                                        height={400}
                                        onNodeClick={(node) => console.log('Node clicked', node)}
                                    />
                                </div>
                            )}

                            {activePanel === 'files' && (
                                <FileViewer
                                    file={{
                                        id: 'sample-doc',
                                        name: 'project-overview.pdf',
                                        type: 'pdf',
                                        size: 2500000,
                                        lastModified: new Date()
                                    }}
                                    onClose={() => setActivePanel(null)}
                                />
                            )}
                        </div>
                    )}
                </div>

                {/* Mobile Bottom Sheet for Panels */}
                {isMobile && activePanel && (
                    <div className="fixed inset-x-0 bottom-0 z-50 glass-effect backdrop-blur-xl shadow-2xl rounded-t-2xl max-h-[80vh] overflow-y-auto">
                        <div className="p-4 border-b border-white/20 dark:border-gray-700/30 flex justify-between items-center">
                            <h2 className="text-lg font-semibold gradient-text">
                                {activePanel === 'ai-features' ? 'AI Features' : 
                                activePanel === 'graph' ? 'Knowledge Graph' : 
                                activePanel === 'code' ? 'Code' : 
                                'Document Viewer'}
                            </h2>
                            <button 
                                onClick={() => setActivePanel(null)}
                                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white glass-effect p-2 rounded-full"
                            >
                                <XMarkIcon className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="p-4">
                            {activePanel === 'code' && (
                                <CodePanel 
                                    code={currentCode}
                                    language="javascript" 
                                    onCodeChange={setCurrentCode}
                                    onClose={() => setActivePanel(null)}
                                    isMobile={true}
                                />
                            )}
                            {activePanel === 'ai-features' && (
                                <AIFeaturesPanel
                                    features={[
                                        { 
                                            id: 'rag', 
                                            name: 'Retrieval Augmented Generation', 
                                            description: 'Enhance responses with document context' 
                                        }
                                    ]}
                                    models={[
                                        { 
                                            id: 'default', 
                                            name: 'Balanced Model', 
                                            description: 'Optimal performance and speed' 
                                        }
                                    ]}
                                    selectedModel="default"
                                    onToggleFeature={() => {}}
                                    onSelectModel={() => {}}
                                />
                            )}
                            {activePanel === 'graph' && (
                                <GraphVisualizer
                                    data={sampleGraphData}
                                    height={300}
                                    onNodeClick={(node) => console.log('Node clicked', node)}
                                />
                            )}
                            {activePanel === 'files' && (
                                <FileViewer
                                    file={{
                                        id: 'sample-doc',
                                        name: 'project-overview.pdf',
                                        type: 'pdf',
                                        size: 2500000,
                                        lastModified: new Date()
                                    }}
                                    onClose={() => setActivePanel(null)}
                                />
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatApplication;