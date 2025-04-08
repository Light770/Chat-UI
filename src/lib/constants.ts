/**
 * Application configuration constants
 */

// Application info
export const APP_NAME = 'Modern Chat UI';
export const APP_VERSION = '0.1.0';
export const APP_DESCRIPTION = 'A comprehensive React component library for building advanced chat interfaces with AI features';

// API endpoints and timeouts
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.example.com';
export const API_TIMEOUT = 30000; // 30 seconds
export const WEBSOCKET_URL = process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'wss://ws.example.com';

// Authentication constants
export const AUTH_TOKEN_KEY = 'auth_token';
export const AUTH_REFRESH_TOKEN_KEY = 'refresh_token';
export const AUTH_TOKEN_EXPIRY = 60 * 60 * 24 * 7; // 7 days in seconds

// Local storage keys
export const STORAGE_KEYS = {
  THEME: 'chat_ui_theme',
  USER_SETTINGS: 'chat_ui_settings',
  CONVERSATIONS: 'chat_ui_conversations',
  DRAFTS: 'chat_ui_drafts',
  LAST_ACTIVE: 'chat_ui_last_active',
};

// File upload constraints
export const FILE_UPLOAD = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB in bytes
  MAX_FILES: 5,
  ACCEPTED_TYPES: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/svg+xml',
    'application/pdf',
    'text/plain',
    'text/csv',
    'application/json',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
  ],
  ACCEPTED_EXTENSIONS: [
    '.jpg', '.jpeg', '.png', '.gif', '.svg',
    '.pdf', '.txt', '.csv', '.json',
    '.doc', '.docx', '.xls', '.xlsx',
    '.md', '.js', '.ts', '.tsx', '.jsx',
    '.py', '.java', '.html', '.css'
  ],
};

// Message types
export const MESSAGE_TYPES = {
  TEXT: 'text',
  CODE: 'code',
  FILE: 'file',
  VISUALIZATION: 'visualization',
  AI_SUGGESTION: 'ai_suggestion',
  SYSTEM: 'system',
};

// AI features
export const AI_FEATURES = {
  RAG: 'Retrieval Augmented Generation',
  CAG: 'Conversational Agents',
  SUMMARIZATION: 'Auto-Summarization',
  CONTEXT_MEMORY: 'Enhanced Context Memory',
  REASONING: 'Advanced Reasoning',
  VISUALIZATION: 'Data Visualization',
};

// AI models
export const AI_MODELS = [
  {
    id: 'default',
    name: 'Balanced',
    description: 'Good balance of speed and capabilities',
    isAvailable: true,
  },
  {
    id: 'fast',
    name: 'Fast',
    description: 'Optimized for speed and responsiveness',
    isAvailable: true,
  },
  {
    id: 'advanced',
    name: 'Advanced',
    description: 'Most capable model with advanced reasoning',
    isAvailable: true,
  },
];

// UI constants
export const UI = {
  ANIMATION_DURATION: 200, // ms
  TYPING_INDICATOR_DELAY: 1500, // ms
  DEBOUNCE_DELAY: 300, // ms
  THROTTLE_DELAY: 300, // ms
  SIDEBAR_WIDTH: 280, // px
  SIDEBAR_COLLAPSED_WIDTH: 64, // px
  MOBILE_BREAKPOINT: 768, // px
  MAX_MESSAGE_LENGTH: 4000, // characters
  COMMAND_PREFIX: '/',
};

// Theme colors
export const THEME_COLORS = {
  primary: {
    light: '#0ea5e9', // sky-500
    dark: '#38bdf8', // sky-400
  },
  success: {
    light: '#22c55e', // green-500
    dark: '#4ade80', // green-400
  },
  warning: {
    light: '#f59e0b', // amber-500
    dark: '#fbbf24', // amber-400
  },
  error: {
    light: '#ef4444', // red-500
    dark: '#f87171', // red-400
  },
};

// Common commands
export const COMMANDS = [
  {
    id: 'generate_code',
    name: 'Generate Code',
    description: 'Create a code snippet or full program',
    example: 'generate_code react component for a login form',
  },
  {
    id: 'explain_code',
    name: 'Explain Code',
    description: 'Get an explanation of provided code',
    example: 'explain_code <paste your code here>',
  },
  {
    id: 'summarize',
    name: 'Summarize Text',
    description: 'Create a summary of the provided text',
    example: 'summarize <paste your text here>',
  },
  {
    id: 'data_visualization',
    name: 'Data Visualization',
    description: 'Create a visualization from data',
    example: 'data_visualization <describe what you want>',
  },
];

// Code highlighting languages
export const CODE_LANGUAGES = [
  'javascript',
  'typescript',
  'python',
  'java',
  'c',
  'cpp',
  'csharp',
  'go',
  'rust',
  'swift',
  'php',
  'ruby',
  'kotlin',
  'scala',
  'html',
  'css',
  'json',
  'yaml',
  'markdown',
  'bash',
  'sql',
];

// Default settings
export const DEFAULT_SETTINGS = {
  theme: 'system',
  notifications: true,
  soundEffects: true,
  messageDensity: 'comfortable',
  codeBlockLineNumbers: true,
  showTimestamps: true,
  aiModel: 'default',
  features: {
    rag: true,
    cag: false,
    summarization: true,
    contextMemory: true,
    reasoning: false,
    visualization: true,
  },
};