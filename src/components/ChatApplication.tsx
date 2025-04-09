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
import ResizablePanel from './ChatUI/ResizablePanel';
import MessageOptions from './ChatUI/MessageOptions';
import MessageEdit from './ChatUI/MessageEdit';

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

interface PanelConfig {
  id: 'ai-features' | 'graph' | 'files' | 'code';
  width: number;
  title: string;
  icon: React.ReactNode;
}

// Expose a global function to update the code panel
declare global {
  interface Window {
    updateCodePanel: (code: string, language: string) => void;
  }
}

const ChatApplication = () => {
    const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
    const [isTyping, setIsTyping] = useState(false);
    const [selectedConversation, setSelectedConversation] = useState(
      getDefaultConversation().id
    );
    const [activePanel, setActivePanel] = useState<'ai-features' | 'graph' | 'files' | 'code' | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    
    // Panel configuration with width
    const [panelConfigs, setPanelConfigs] = useState<Record<string, PanelConfig>>({
      'code': { 
        id: 'code', 
        width: 450, 
        title: 'Code Editor',
        icon: <CodeBracketIcon className="h-5 w-5" /> 
      },
      'ai-features': { 
        id: 'ai-features', 
        width: 350, 
        title: 'AI Features',
        icon: <CogIcon className="h-5 w-5" /> 
      },
      'graph': { 
        id: 'graph', 
        width: 400, 
        title: 'Knowledge Graph',
        icon: <ChartBarIcon className="h-5 w-5" /> 
      },
      'files': { 
        id: 'files', 
        width: 350, 
        title: 'Files',
        icon: <DocumentTextIcon className="h-5 w-5" /> 
      },
    });

    // Sample HTML code for demonstration (new default demo content)
    const [currentCode, setCurrentCode] = useState(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Modern Landing Page</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
    
    body {
      background-color: #f8fafc;
      color: #334155;
      line-height: 1.6;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
    }
    
    header {
      background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
      color: white;
      padding: 2rem 0;
    }
    
    nav {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .logo {
      font-size: 1.5rem;
      font-weight: 700;
    }
    
    .nav-links {
      display: flex;
      gap: 2rem;
    }
    
    .nav-links a {
      color: white;
      text-decoration: none;
      opacity: 0.9;
    }
    
    .nav-links a:hover {
      opacity: 1;
      text-decoration: underline;
    }
    
    .hero {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 4rem 0;
    }
    
    .hero-content {
      flex: 1;
      max-width: 600px;
    }
    
    .hero h1 {
      font-size: 3rem;
      margin-bottom: 1rem;
      line-height: 1.2;
    }
    
    .hero p {
      font-size: 1.1rem;
      margin-bottom: 2rem;
    }
    
    .btn {
      display: inline-block;
      background-color: #4f46e5;
      color: white;
      padding: 0.8rem 1.5rem;
      border-radius: 0.5rem;
      text-decoration: none;
      font-weight: 500;
      transition: all 0.3s ease;
    }
    
    .btn:hover {
      background-color: #4338ca;
      transform: translateY(-3px);
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    }
    
    .features {
      padding: 4rem 0;
      background-color: white;
    }
    
    .section-header {
      text-align: center;
      margin-bottom: 3rem;
    }
    
    .section-header h2 {
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }
    
    .section-header p {
      color: #64748b;
      max-width: 700px;
      margin: 0 auto;
    }
    
    .feature-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }
    
    .feature-card {
      background-color: #f8fafc;
      border-radius: 0.5rem;
      padding: 2rem;
      transition: all 0.3s ease;
      border: 1px solid #e2e8f0;
    }
    
    .feature-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
    }
    
    .feature-icon {
      background-color: #4f46e5;
      color: white;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1.5rem;
      font-size: 1.5rem;
    }
    
    .feature-card h3 {
      margin-bottom: 1rem;
    }
    
    footer {
      background-color: #1e293b;
      color: #e2e8f0;
      padding: 3rem 0;
    }
    
    .footer-content {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 2rem;
    }
    
    .footer-section {
      flex: 1;
      min-width: 200px;
    }
    
    .footer-section h3 {
      margin-bottom: 1.5rem;
      font-size: 1.2rem;
    }
    
    .footer-links {
      list-style: none;
    }
    
    .footer-links li {
      margin-bottom: 0.8rem;
    }
    
    .footer-links a {
      color: #cbd5e1;
      text-decoration: none;
      transition: color 0.3s ease;
    }
    
    .footer-links a:hover {
      color: white;
    }
    
    .copyright {
      text-align: center;
      padding-top: 2rem;
      margin-top: 2rem;
      border-top: 1px solid #334155;
      color: #94a3b8;
    }
    
    @media (max-width: 768px) {
      .hero {
        flex-direction: column;
      }
      
      .hero-content {
        text-align: center;
        margin-bottom: 2rem;
      }
      
      .nav-links {
        display: none;
      }
    }
  </style>
</head>
<body>
  <header>
    <div class="container">
      <nav>
        <div class="logo">ModernUI</div>
        <div class="nav-links">
          <a href="#">Home</a>
          <a href="#">Features</a>
          <a href="#">Pricing</a>
          <a href="#">About</a>
          <a href="#">Contact</a>
        </div>
      </nav>
      <div class="hero">
        <div class="hero-content">
          <h1>Beautiful, Modern Websites Made Simple</h1>
          <p>Create stunning, responsive websites in minutes with our intuitive design tools and pre-built components.</p>
          <a href="#" class="btn">Get Started</a>
        </div>
      </div>
    </div>
  </header>
  
  <section class="features">
    <div class="container">
      <div class="section-header">
        <h2>Key Features</h2>
        <p>Our platform provides everything you need to build and launch your website quickly and efficiently.</p>
      </div>
      
      <div class="feature-grid">
        <div class="feature-card">
          <div class="feature-icon">✨</div>
          <h3>Responsive Design</h3>
          <p>All components are fully responsive and work seamlessly across devices.</p>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon">🚀</div>
          <h3>Performance Optimized</h3>
          <p>Lightning-fast loading times with optimized code and assets.</p>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon">🎨</div>
          <h3>Customizable</h3>
          <p>Easily change colors, fonts, and layouts to match your brand.</p>
        </div>
      </div>
    </div>
  </section>
  
  <footer>
    <div class="container">
      <div class="footer-content">
        <div class="footer-section">
          <h3>ModernUI</h3>
          <p>Building the future of web design with modern tools and technologies.</p>
        </div>
        
        <div class="footer-section">
          <h3>Links</h3>
          <ul class="footer-links">
            <li><a href="#">Home</a></li>
            <li><a href="#">Features</a></li>
            <li><a href="#">Pricing</a></li>
            <li><a href="#">About</a></li>
          </ul>
        </div>
        
        <div class="footer-section">
          <h3>Support</h3>
          <ul class="footer-links">
            <li><a href="#">Documentation</a></li>
            <li><a href="#">FAQ</a></li>
            <li><a href="#">Community</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </div>
      </div>
      
      <div class="copyright">
        <p>&copy; 2025 ModernUI. All rights reserved.</p>
      </div>
    </div>
  </footer>
</body>
</html>`);

    // Create a global function to update the code panel 
    useEffect(() => {
      // Define the global function
      window.updateCodePanel = (code: string, language: string) => {
        console.log('Setting code panel:', code.substring(0, 100));
        setCurrentCode(code);
        setActivePanel('code'); // Activate the code panel
      };
      
      return () => {
        // Clean up by removing the global function when component unmounts
        delete window.updateCodePanel;
      };
    }, []);

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
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Update panel width
    const handlePanelResize = (panelId: string, newWidth: number) => {
      setPanelConfigs(prev => ({
        ...prev,
        [panelId]: {
          ...prev[panelId],
          width: newWidth
        }
      }));
    };

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
            // Check if the user is asking for HTML or code example
            if (content.toLowerCase().includes('html') || 
                content.toLowerCase().includes('website') || 
                content.toLowerCase().includes('landing page')) {
                const htmlMessage: ChatMessage = {
                    id: `ai-${Date.now()}`,
                    content: currentCode,
                    sender: 'ai',
                    type: MessageType.CODE,
                    language: 'html',
                    timestamp: new Date()
                };
                
                setMessages(prev => [...prev, htmlMessage]);
                setActivePanel('code');
            } else if (content.toLowerCase().includes('css') || 
                      content.toLowerCase().includes('style') || 
                      content.toLowerCase().includes('design')) {
                // Extract just the CSS part from the current HTML
                const cssContent = currentCode.substring(
                    currentCode.indexOf('<style>') + 8, 
                    currentCode.indexOf('</style>')
                );
                
                const cssMessage: ChatMessage = {
                    id: `ai-${Date.now()}`,
                    content: cssContent,
                    sender: 'ai',
                    type: MessageType.CODE,
                    language: 'css',
                    timestamp: new Date()
                };
                
                setMessages(prev => [...prev, cssMessage]);
                setActivePanel('code');
            } else if (content.toLowerCase().includes('code') || 
                      content.toLowerCase().includes('function') ||
                      content.toLowerCase().includes('program')) {
                // Respond with JavaScript code example
                const jsCode = `function createResponsiveNavbar() {
  const navbar = document.querySelector('.navbar');
  const toggleButton = document.querySelector('.navbar-toggle');
  
  toggleButton.addEventListener('click', () => {
    navbar.classList.toggle('active');
  });
  
  // Handle responsive behavior
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      navbar.classList.remove('active');
    }
  });
  
  // Add smooth scrolling to all navigation links
  const navLinks = document.querySelectorAll('.nav-links a');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      const targetId = link.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth'
        });
        
        // Close mobile menu after clicking a link
        navbar.classList.remove('active');
      }
    });
  });
}

// Call the function when DOM is fully loaded
document.addEventListener('DOMContentLoaded', createResponsiveNavbar);`;
                
                const jsMessage: ChatMessage = {
                    id: `ai-${Date.now()}`,
                    content: jsCode,
                    sender: 'ai',
                    type: MessageType.CODE,
                    language: 'javascript',
                    timestamp: new Date()
                };
                
                setMessages(prev => [...prev, jsMessage]);
                setCurrentCode(jsCode);
                setActivePanel('code');
            } else {
                const aiMessage: ChatMessage = {
                    id: `ai-${Date.now()}`,
                    content: simulateAIResponse(content),
                    sender: 'ai',
                    type: MessageType.TEXT,
                    timestamp: new Date()
                };
                
                setMessages(prev => [...prev, aiMessage]);
            }
            setIsTyping(false);
        }, 1500);
    }, [isMobile, isSidebarOpen, currentCode]);

    // Simulate AI response
    const simulateAIResponse = (userMessage: string) => {
        const lowerMessage = userMessage.toLowerCase();
        
        if (lowerMessage.includes('help')) {
            return "I'm here to assist you. Try asking for HTML code examples, CSS styling, or JavaScript functions. I can show you working examples with live previews.";
        }
        
        if (lowerMessage.includes('project') || lowerMessage.includes('planning')) {
            return "For project planning, I can help break down tasks, estimate timelines, and suggest best practices. Would you like me to show you some HTML structure for a project planning page?";
        }
        
        if (lowerMessage.includes('data') || lowerMessage.includes('analysis')) {
            return "I can help you analyze data, create visualizations, and provide insights. Would you like to see a code example for data visualization?";
        }
        
        return `I'm here to help with web development and coding examples. Try asking me for HTML code, CSS styling tips, or JavaScript functions!`;
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

    // Calculate chat container width based on active panel
    const getChatContainerStyle = () => {
        if (isMobile || !activePanel) {
            return { width: '100%' };
        }
        
        // Use the width from panel config
        const panelWidth = activePanel ? panelConfigs[activePanel]?.width || 0 : 0;
        
        return {
            width: `calc(100% - ${panelWidth}px)`
        };
    };

    // Message modification handler
    const handleMessageUpdate = useCallback((id: string, content: string) => {
        setMessages(prev => 
            prev.map(msg => 
                msg.id === id 
                    ? { ...msg, content } 
                    : msg
            )
        );
    }, []);

    // Handle thumbs up feedback
    const handleThumbsUp = useCallback((messageId: string) => {
        console.log('Thumbs up for message:', messageId);
        // In a real application, you would send this feedback to your backend
    }, []);

    // Handle thumbs down feedback
    const handleThumbsDown = useCallback((messageId: string) => {
        console.log('Thumbs down for message:', messageId);
        // In a real application, you would send this feedback to your backend
    }, []);

    // Handle retry logic for AI messages
    const handleRetry = useCallback((messageId: string) => {
        // Find the user message that preceded this AI message
        const messageIndex = messages.findIndex(msg => msg.id === messageId);
        if (messageIndex <= 0) return;
        
        // Look for the most recent user message before this AI message
        let userMessageIndex = messageIndex - 1;
        while (userMessageIndex >= 0) {
            if (messages[userMessageIndex].sender === 'user') {
                break;
            }
            userMessageIndex--;
        }
        
        if (userMessageIndex >= 0) {
            // Get the user message
            const userMessage = messages[userMessageIndex];
            
            // Remove all messages after and including this user message
            setMessages(prev => prev.slice(0, userMessageIndex));
            
            // Re-send the user message to trigger a new AI response
            setTimeout(() => {
                handleSendMessage(userMessage.content);
            }, 300);
        }
    }, [messages, handleSendMessage]);

    // Determine the language of the current code
    const getCodeLanguage = () => {
      if (currentCode.includes('<!DOCTYPE html>') || currentCode.includes('<html')) {
        return 'html';
      }
      if (currentCode.includes('function') || currentCode.includes('const ') || currentCode.includes('var ')) {
        return 'javascript';
      }
      if (currentCode.includes('{') && currentCode.includes('}') && 
          (currentCode.includes('color:') || currentCode.includes('margin:') || currentCode.includes('padding:'))) {
        return 'css';
      }
      return 'javascript';
    };

    // Render panel content based on active panel
    const renderPanelContent = () => {
        switch (activePanel) {
            case 'code':
                return (
                    <CodePanel 
                        code={currentCode}
                        language={getCodeLanguage()}
                        onCodeChange={setCurrentCode}
                        onClose={() => setActivePanel(null)}
                    />
                );
            case 'ai-features':
                return (
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
                );
            case 'graph':
                return (
                    <div className="p-4">
                        <GraphVisualizer
                            data={sampleGraphData}
                            height={400}
                            onNodeClick={(node) => console.log('Node clicked', node)}
                        />
                    </div>
                );
            case 'files':
                return (
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
                );
            default:
                return null;
        }
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
                                className={activePanel === 'code' ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}
                            />
                            <ToolbarButton
                                icon={<ChartBarIcon className="h-5 w-5" />}
                                label="Knowledge Graph"
                                onClick={() => togglePanel('graph')}
                                active={activePanel === 'graph'}
                                className={activePanel === 'graph' ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}
                            />
                            <ToolbarButton
                                icon={<DocumentTextIcon className="h-5 w-5" />}
                                label="Files"
                                onClick={() => togglePanel('files')}
                                active={activePanel === 'files'}
                                className={activePanel === 'files' ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}
                            />
                            <ToolbarButton
                                icon={<CogIcon className="h-5 w-5" />}
                                label="AI Features"
                                onClick={() => togglePanel('ai-features')}
                                active={activePanel === 'ai-features'}
                                className={activePanel === 'ai-features' ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}
                            />
                        </div>
                        <ThemeToggle />
                    </div>
                </div>

                {/* Main content area with chat and panels */}
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
                            onRetry={handleRetry}
                        />
                    </div>
                    
                    {/* Resizable Side Panel */}
                    {activePanel && !isMobile && (
                        <div className="relative h-full" style={{ zIndex: 10 }}>
                            <ResizablePanel
                                width={panelConfigs[activePanel].width}
                                minWidth={250}
                                maxWidth={800}
                                position="right"
                                onClose={() => setActivePanel(null)}
                                onResize={(newWidth) => handlePanelResize(activePanel, newWidth)}
                                title={panelConfigs[activePanel].title}
                                isVisible={!!activePanel}
                                className="shadow-lg"
                            >
                                {renderPanelContent()}
                            </ResizablePanel>
                        </div>
                    )}
                </div>

                {/* Mobile Bottom Sheet for Panels */}
                {isMobile && activePanel && (
                    <div className="fixed inset-x-0 bottom-0 z-50 glass-effect backdrop-blur-xl shadow-2xl rounded-t-2xl max-h-[80vh] overflow-y-auto">
                        <div className="p-4 border-b border-white/20 dark:border-gray-700/30 flex justify-between items-center">
                            <h2 className="text-lg font-semibold gradient-text">
                                {activePanel && panelConfigs[activePanel]?.title}
                            </h2>
                            <button 
                                onClick={() => setActivePanel(null)}
                                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white glass-effect p-2 rounded-full"
                            >
                                <XMarkIcon className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="p-4">
                            {renderPanelContent()}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatApplication;