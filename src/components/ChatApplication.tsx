'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  ChatContainer,
  Sidebar,
  FileViewer,
  AIFeaturesPanel,
  GraphVisualizer,
  ThemeToggle,
  ToolbarButton
} from './ChatUI';
import { 
  ChatBubbleLeftRightIcon, 
  DocumentTextIcon, 
  ChartBarIcon, 
  CogIcon 
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

// Demo application component with improved UX
const ChatApplication = () => {
    const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
    const [isTyping, setIsTyping] = useState(false);
    
    // Use getDefaultConversation to ensure a safe default
    const [selectedConversation, setSelectedConversation] = useState(
      getDefaultConversation().id
    );
  const [activePanel, setActivePanel] = useState<'ai-features' | 'graph' | 'files' | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Responsive design handling
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      setIsSidebarOpen(window.innerWidth >= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Improved message handling with more robust typing simulation
  const handleSendMessage = useCallback((content: string) => {
    // Validate message
    if (!content.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      content,
      sender: 'user',
      type: MessageType.TEXT,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Start typing indicator
    setIsTyping(true);
    
    // Simulate AI response with context-aware handling
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
      if (content.toLowerCase().includes('graph') || content.toLowerCase().includes('visualize')) {
        setActivePanel('graph');
      } else if (content.toLowerCase().includes('file') || content.toLowerCase().includes('document')) {
        setActivePanel('files');
      }
    }, 1500);
  }, []);

  // Simulate more intelligent AI response
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
    
    return `I'm processing your request about: "${userMessage.substring(0, 30)}${userMessage.length > 30 ? '...' : ''}"`;
  };

  // Panel toggle with improved accessibility
  const togglePanel = (panel: 'ai-features' | 'graph' | 'files') => {
    setActivePanel(current => current === panel ? null : panel);
  };

  // Sidebar toggle for mobile
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white overflow-hidden">
      {/* Sidebar with mobile considerations */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out",
        "w-64 bg-white dark:bg-gray-800 shadow-lg",
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
        "md:relative md:translate-x-0 md:block",
        isMobile && "w-full max-w-xs"
      )}>
        <Sidebar
          user={sampleUser}
          conversations={sampleConversations}
          selectedConversationId={selectedConversation}
          onSelectConversation={setSelectedConversation}
          onNewConversation={() => setMessages(initialMessages)}
          onDeleteConversation={(id) => console.log('Delete conversation', id)}
          onSignOut={() => console.log('Sign out')}
          className="h-full"
        />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Mobile header with sidebar toggle */}
        <div className="md:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center">
          <button 
            onClick={toggleSidebar}
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            aria-label={isSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
          >
            {isSidebarOpen ? '✕' : '☰'}
          </button>
          <h1 className="text-lg font-semibold">AI Assistant</h1>
          <ThemeToggle />
        </div>

        {/* Desktop header */}
        <div className="hidden md:flex bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 justify-between items-center">
          <h1 className="text-lg font-semibold">AI Assistant</h1>
          <div className="flex items-center space-x-4">
            <div className="flex space-x-2">
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

        {/* Main content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Chat Container */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <ChatContainer
              messages={messages}
              onSendMessage={handleSendMessage}
              isTyping={isTyping}
              className="flex-1"
            />
          </div>

          {/* Sidebar Panels (Desktop) */}
          {activePanel && (
            <div className="hidden md:block w-96 border-l border-gray-200 dark:border-gray-700 overflow-y-auto">
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
                  <h2 className="text-xl font-semibold mb-4">Knowledge Graph</h2>
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
      </div>

      {/* Mobile Bottom Sheet for Panels */}
      {isMobile && activePanel && (
        <div className="fixed inset-x-0 bottom-0 z-50 bg-white dark:bg-gray-800 shadow-2xl rounded-t-xl max-h-[80vh] overflow-y-auto">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h2 className="text-lg font-semibold">
              {activePanel === 'ai-features' ? 'AI Features' : 
               activePanel === 'graph' ? 'Knowledge Graph' : 
               'Document Viewer'}
            </h2>
            <button 
              onClick={() => setActivePanel(null)}
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              ✕
            </button>
          </div>
          <div className="p-4">
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
  );
};

export default ChatApplication;