// src/components/sample-data/getDefaultConversation.tsx
import { ChatMessage, MessageType } from '../../types';

export const sampleUser = {
  id: 'demo-user-001',
  name: 'Demo User',
  email: 'demo@example.com',
  avatarUrl: '/api/placeholder/100/100',
  status: 'online'
};

export const sampleConversations = [
  {
    id: 'conv-001',
    title: 'Modern Landing Page',
    preview: 'Can you create an HTML landing page for me?',
    timestamp: new Date(Date.now() - 3600000),
    userId: sampleUser.id
  },
  {
    id: 'conv-002',
    title: 'Responsive CSS Grid',
    preview: 'How do I create a responsive grid with CSS?',
    timestamp: new Date(Date.now() - 86400000),
    userId: sampleUser.id
  },
  {
    id: 'conv-003',
    title: 'JavaScript Animation',
    preview: 'Need help with smooth scroll animations',
    timestamp: new Date(Date.now() - 172800000),
    unread: true,
    userId: sampleUser.id
  }
];

// Sample HTML for landing page
const landingPageHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Simple Landing Page</title>
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
    
    .hero {
      background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
      color: white;
      padding: 6rem 2rem;
      text-align: center;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
    }
    
    .hero h1 {
      font-size: 3rem;
      margin-bottom: 1rem;
    }
    
    .hero p {
      font-size: 1.2rem;
      max-width: 600px;
      margin: 0 auto 2rem;
      opacity: 0.9;
    }
    
    .btn {
      display: inline-block;
      background-color: white;
      color: #4f46e5;
      padding: 0.8rem 1.5rem;
      border-radius: 0.5rem;
      text-decoration: none;
      font-weight: 600;
      transition: all 0.3s ease;
    }
    
    .btn:hover {
      transform: translateY(-3px);
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    }
  </style>
</head>
<body>
  <section class="hero">
    <div class="container">
      <h1>Welcome to Our Platform</h1>
      <p>The easiest way to build beautiful, responsive websites without writing a single line of code.</p>
      <a href="#" class="btn">Get Started</a>
    </div>
  </section>
</body>
</html>`;

export const initialMessages: ChatMessage[] = [
  {
    id: 'msg-init-001',
    content: "Hello! I'm your web development assistant. I can help you with HTML, CSS, and JavaScript. What would you like to create today?",
    sender: 'ai',
    type: MessageType.TEXT,
    timestamp: new Date(Date.now() - 360000)
  },
  {
    id: 'msg-init-002',
    content: "Can you show me a simple HTML landing page?",
    sender: 'user',
    type: MessageType.TEXT,
    timestamp: new Date(Date.now() - 300000)
  },
  {
    id: 'msg-init-003',
    content: landingPageHtml,
    sender: 'ai',
    type: MessageType.CODE,
    language: 'html',
    timestamp: new Date(Date.now() - 240000)
  },
  {
    id: 'msg-init-004',
    content: "Thanks! Can you add some more sections to it?",
    sender: 'user',
    type: MessageType.TEXT,
    timestamp: new Date(Date.now() - 180000)
  },
  {
    id: 'msg-init-005',
    content: "Of course! I'd be happy to expand the landing page. Try asking for a more complete version with features section, testimonials, and a footer. Or if you'd like, I can add specific sections based on your needs.",
    sender: 'ai',
    type: MessageType.TEXT,
    timestamp: new Date(Date.now() - 120000)
  }
];

export const sampleGraphData = {
  nodes: [
    { id: 'query1', type: 'query', content: 'How do I implement a responsive navbar?', size: 15 },
    { id: 'doc1', type: 'document', content: 'HTML5 documentation', size: 20 },
    { id: 'doc2', type: 'document', content: 'CSS3 best practices', size: 20 },
    { id: 'chunk1', type: 'chunk', content: 'Responsive design patterns', size: 12 },
    { id: 'chunk2', type: 'chunk', content: 'Mobile-first navbar techniques', size: 12 },
    { id: 'chunk3', type: 'chunk', content: 'Media queries usage guide', size: 12 },
    { id: 'answer1', type: 'answer', content: 'Here is how to implement a responsive navbar...', size: 18 },
  ],
  links: [
    { source: 'query1', target: 'chunk1', value: 0.92, label: '92%' },
    { source: 'query1', target: 'chunk2', value: 0.87, label: '87%' },
    { source: 'query1', target: 'chunk3', value: 0.75, label: '75%' },
    { source: 'chunk1', target: 'answer1', value: 1, label: 'used' },
    { source: 'chunk2', target: 'answer1', value: 1, label: 'used' },
    { source: 'chunk1', target: 'doc1', value: 1 },
    { source: 'chunk2', target: 'doc1', value: 1 },
    { source: 'chunk3', target: 'doc2', value: 1 },
  ]
};

// Ensure a default conversation is always available
export const getDefaultConversation = () => {
  return sampleConversations.length > 0 
    ? sampleConversations[0] 
    : {
        id: 'default-conv',
        title: 'New Conversation',
        preview: 'Start a new conversation',
        timestamp: new Date(),
        userId: sampleUser.id
      };
};