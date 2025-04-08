import { cp } from 'fs';
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
    title: 'Project planning assistance',
    preview: 'Can you help me plan a software project?',
    timestamp: new Date(Date.now() - 3600000),
    userId: sampleUser.id
  },
  {
    id: 'conv-002',
    title: 'Data analysis for quarterly report',
    preview: 'I need to analyze these sales numbers...',
    timestamp: new Date(Date.now() - 86400000),
    userId: sampleUser.id
  },
  {
    id: 'conv-003',
    title: 'AI integration options',
    preview: 'What are the best ways to integrate AI...',
    timestamp: new Date(Date.now() - 172800000),
    unread: true,
    userId: sampleUser.id
  }
];

export const initialMessages: ChatMessage[] = [
  {
    id: 'msg-init-001',
    content: 'Hello! How can I help you today?',
    sender: 'ai',
    type: MessageType.TEXT,
    timestamp: new Date(Date.now() - 3600000)
  }
];

export const sampleGraphData = {
  nodes: [
    { id: 'query1', type: 'query', content: 'How do I implement authentication?', size: 15 },
    { id: 'doc1', type: 'document', content: 'Auth documentation', size: 20 },
    { id: 'doc2', type: 'document', content: 'Security best practices', size: 20 },
    { id: 'chunk1', type: 'chunk', content: 'Authentication methods overview', size: 12 },
    { id: 'chunk2', type: 'chunk', content: 'OAuth implementation steps', size: 12 },
    { id: 'chunk3', type: 'chunk', content: 'Password security guidelines', size: 12 },
    { id: 'answer1', type: 'answer', content: 'Here is how to implement authentication...', size: 18 },
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