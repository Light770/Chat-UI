/**
 * Comprehensive type definitions for the AI Chat Application
 * 
 * This file defines a robust type system for various components
 * of an advanced conversational AI interface.
 */

// Message Type Enum with Expanded Categories
export enum MessageType {
  TEXT = 'text',
  CODE = 'code',
  FILE = 'file',
  VISUALIZATION = 'visualization',
  AI_SUGGESTION = 'ai_suggestion',
  SYSTEM = 'system',
  MARKDOWN = 'markdown',
  JSON = 'json',
  ERROR = 'error',
}

/**
 * Represents a message in the conversation
 * Supports various message types and metadata
 */
export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai' | 'system';
  type: MessageType;
  timestamp: Date;
  
  // Optional additional properties
  language?: string; // For code messages
  metadata?: Record<string, any>; // Flexible metadata
  replyTo?: string; // ID of the message this is replying to
  
  // UI-specific properties
  status?: 'pending' | 'sent' | 'error';
  reactions?: Array<{
    type: string;
    count: number;
    users: string[];
  }>;
}

/**
 * Graph visualization node with flexible properties
 */
export interface Node {
  id: string;
  type: string;
  content?: string;
  size?: number;
  
  // Visualization-specific properties
  position?: { x: number; y: number };
  color?: string;
  
  // Allow additional dynamic properties
  [key: string]: any;
}

/**
 * Represents a connection between nodes in a graph
 */
export interface Link {
  source: string;
  target: string;
  value?: number;
  label?: string;
  
  // Styling and interaction properties
  type?: string;
  strength?: number;
  
  // Allow additional dynamic properties
  [key: string]: any;
}

/**
 * Comprehensive graph data structure
 */
export interface GraphData {
  nodes: Node[];
  links: Link[];
  
  // Optional metadata
  metadata?: {
    title?: string;
    description?: string;
    timestamp?: Date;
  };
}

/**
 * Represents a document in the knowledge base
 */
export interface Document {
  id: string;
  name: string;
  text: string;
  
  // Comprehensive document metadata
  metadata: {
    source?: string;
    createdAt?: Date;
    lastModified?: Date;
    tags?: string[];
    category?: string;
    summary?: string;
    
    // File-specific properties
    fileType?: string;
    size?: number;
    author?: string;
  };
  
  // Optional processing information
  chunks?: Chunk[];
  embeddings?: number[];
}

/**
 * Represents a text chunk from a document
 */
export interface Chunk {
  id: string;
  documentId: string;
  text: string;
  
  // Retrieval and semantic search properties
  metadata?: {
    startIndex?: number;
    endIndex?: number;
    pageNumber?: number;
    semanticScore?: number;
  };
  
  embeddings?: number[];
}

/**
 * Represents a retrieval operation in RAG (Retrieval Augmented Generation)
 */
export interface Retrieval {
  query: string;
  chunks: Chunk[];
  
  // Detailed retrieval metadata
  similarity: number[];
  metadata?: {
    timestamp: Date;
    model: string;
    retrievalStrategy: string;
  };
}

/**
 * Represents a tool or capability for an AI agent
 */
export interface Tool {
  id: string;
  name: string;
  description: string;
  
  // Detailed tool configuration
  category?: string;
  parameters: {
    [key: string]: {
      type: string;
      description?: string;
      required?: boolean;
      default?: any;
    }
  };
  
  // Execution and permission metadata
  permissionLevel?: 'public' | 'restricted' | 'admin';
  executionContext?: 'sync' | 'async';
}

/**
 * Represents an AI agent with capabilities and tools
 */
export interface Agent {
  id: string;
  name: string;
  description: string;
  
  // Agent capabilities and configuration
  capabilities: string[];
  tools: Tool[];
  
  // Performance and configuration metadata
  performanceMetrics?: {
    accuracy: number;
    responseTime: number;
    totalInteractions: number;
  };
  
  // AI model specific properties
  modelConfig?: {
    version: string;
    temperature?: number;
    maxTokens?: number;
  };
}

/**
 * Represents an action taken by an agent
 */
export interface AgentAction {
  id: string;
  agentId: string;
  action: string;
  parameters: Record<string, any>;
  
  // Execution details
  timestamp: Date;
  status: 'pending' | 'completed' | 'failed';
  result?: any;
  error?: {
    message: string;
    code?: string;
  };
}

/**
 * File processing result with comprehensive metadata
 */
export interface FileProcessingResult {
  id: string;
  fileId: string;
  contentType: string;
  
  // Detailed processing metadata
  metadata: {
    originalName: string;
    size: number;
    uploadedAt: Date;
    processingTime?: number;
  };
  
  // Extracted content and analysis
  chunks?: Chunk[];
  summary?: string;
  extractedData?: Record<string, any>;
  
  // Processing status
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

/**
 * Represents application theme configuration
 */
export interface Theme {
  id: string;
  name: string;
  
  // Comprehensive color palette
  colors: {
    primary: {
      light: string;
      dark: string;
      hover: string;
    };
    secondary: {
      light: string;
      dark: string;
    };
    background: {
      primary: string;
      secondary: string;
    };
    text: {
      primary: string;
      secondary: string;
      accent: string;
    };
    error: string;
    success: string;
    warning: string;
  };
  
  // Typography and styling
  typography: {
    fontFamily: string;
    fontSize: {
      small: string;
      medium: string;
      large: string;
    };
    lineHeight: {
      normal: number;
      compact: number;
    };
  };
  
  // Layout and design tokens
  layout: {
    borderRadius: string;
    spacing: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
    };
    shadow: {
      default: string;
      elevated: string;
    };
  };
}

/**
 * Represents a user profile with extensive configuration options
 */
export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  
  // Profile and display properties
  avatarUrl?: string;
  displayName?: string;
  
  // Comprehensive user preferences
  preferences: {
    theme: string;
    language: string;
    notifications: {
      enabled: boolean;
      channels: Array<'email' | 'push' | 'sms'>;
      preferences: Record<string, boolean>;
    };
    
    // AI and feature configurations
    aiModel: {
      default: string;
      alternatives: string[];
    };
    
    features: {
      [featureKey: string]: {
        enabled: boolean;
        configuration?: Record<string, any>;
      }
    };
    
    // Privacy and data handling
    privacySettings: {
      dataSharing: boolean;
      analyticsTracking: boolean;
    };
  };
  
  // Subscription and access control
  subscription?: {
    tier: 'free' | 'pro' | 'enterprise';
    features: string[];
    expiresAt?: Date;
  };
  
  // Audit and security
  lastLogin?: Date;
  roles: string[];
}

/**
 * Represents a conversation with comprehensive metadata
 */
export interface Conversation {
  id: string;
  title: string;
  
  // Conversation timeline
  createdAt: Date;
  updatedAt: Date;
  
  // Message and participant management
  messages: ChatMessage[];
  participants: string[]; // User IDs
  
  // Conversation context and metadata
  metadata?: {
    source?: string;
    context?: Record<string, any>;
    tags?: string[];
    summary?: string;
  };
  
  // Access and sharing
  visibility: 'private' | 'shared' | 'public';
  sharedWith?: string[]; // User IDs
}