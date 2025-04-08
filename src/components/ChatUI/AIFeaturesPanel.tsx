// components/ChatUI/AIFeaturesPanel.tsx
import React, { useState } from 'react';
import { Switch } from '@headlessui/react';
import { 
  LightBulbIcon, 
  SparklesIcon, 
  BoltIcon, 
  DocumentMagnifyingGlassIcon,
  DocumentDuplicateIcon,
  ArchiveBoxIcon,
  ArrowsPointingOutIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

export interface AIFeature {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  enabled: boolean;
}

export interface AIModelOption {
  id: string;
  name: string;
  description: string;
  isAvailable: boolean;
}

interface AIFeaturesPanelProps {
  features: AIFeature[];
  models: AIModelOption[];
  selectedModel: string;
  onToggleFeature: (featureId: string, enabled: boolean) => void;
  onSelectModel: (modelId: string) => void;
  className?: string;
}

const AIFeaturesPanel: React.FC<AIFeaturesPanelProps> = ({
  features,
  models,
  selectedModel,
  onToggleFeature,
  onSelectModel,
  className = '',
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const defaultFeatures: AIFeature[] = [
    {
      id: 'rag',
      name: 'Retrieval Augmented Generation',
      description: 'Enhance responses with knowledge from your documents',
      icon: <DocumentMagnifyingGlassIcon className="h-6 w-6" />,
      enabled: true,
    },
    {
      id: 'cag',
      name: 'Conversational Agents',
      description: 'Enable autonomous problem-solving with agent capabilities',
      icon: <SparklesIcon className="h-6 w-6" />,
      enabled: false,
    },
    {
      id: 'summarization',
      name: 'Auto-Summarization',
      description: 'Automatically summarize long documents and conversations',
      icon: <DocumentDuplicateIcon className="h-6 w-6" />,
      enabled: true,
    },
    {
      id: 'contextMemory',
      name: 'Enhanced Context Memory',
      description: 'Remember details from previous conversations',
      icon: <ArchiveBoxIcon className="h-6 w-6" />,
      enabled: true,
    },
    {
      id: 'reasoning',
      name: 'Advanced Reasoning',
      description: 'Enable step-by-step reasoning for complex problems',
      icon: <LightBulbIcon className="h-6 w-6" />,
      enabled: false,
    },
    {
      id: 'visualization',
      name: 'Data Visualization',
      description: 'Generate visual representations of data automatically',
      icon: <ChartBarIcon className="h-6 w-6" />,
      enabled: true,
    },
  ];

  const featuresToRender = features.length > 0 ? features : defaultFeatures;
  const featuresToShow = showAdvanced ? featuresToRender : featuresToRender.slice(0, 3);

  const defaultModels: AIModelOption[] = [
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

  const modelsToRender = models.length > 0 ? models : defaultModels;

  return (
    <div className={`bg-white dark:bg-gray-800 shadow rounded-lg ${className}`}>
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white flex items-center">
          <SparklesIcon className="h-5 w-5 mr-2 text-blue-500" />
          AI Features
        </h3>
        
        <div className="mt-5 space-y-6">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Model Selection</label>
            <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
              {modelsToRender.map((model) => (
                <div 
                  key={model.id}
                  onClick={() => model.isAvailable && onSelectModel(model.id)}
                  className={`
                    relative rounded-lg border p-4 cursor-pointer flex focus:outline-none
                    ${selectedModel === model.id
                      ? 'bg-blue-50 border-blue-500 dark:bg-blue-900 dark:border-blue-400'
                      : 'border-gray-300 dark:border-gray-600'
                    }
                    ${!model.isAvailable && 'opacity-50 cursor-not-allowed'}
                  `}
                >
                  <div className="flex flex-col w-full">
                    <span className="block text-sm font-medium text-gray-900 dark:text-white">
                      {model.name}
                    </span>
                    <span className="mt-1 flex items-center text-xs text-gray-500 dark:text-gray-400">
                      {model.description}
                    </span>
                    {!model.isAvailable && (
                      <span className="mt-1 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                        Unavailable
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-700 pt-5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Active Features
            </label>
            
            <div className="mt-2 space-y-4">
              {featuresToShow.map((feature) => (
                <div key={feature.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="mr-3 flex-shrink-0 text-blue-500 dark:text-blue-400">
                      {feature.icon}
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">{feature.name}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{feature.description}</p>
                    </div>
                  </div>
                  <Switch
                    checked={feature.enabled}
                    onChange={(enabled) => onToggleFeature(feature.id, enabled)}
                    className={`${
                      feature.enabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'
                    } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                  >
                    <span
                      className={`${
                        feature.enabled ? 'translate-x-6' : 'translate-x-1'
                      } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                    />
                  </Switch>
                </div>
              ))}
            </div>
            
            <button
              type="button"
              className="mt-4 inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              {showAdvanced ? 'Show less' : 'Show more'}
              <ArrowsPointingOutIcon 
                className={`ml-1 h-4 w-4 transform ${showAdvanced ? 'rotate-180' : ''}`} 
              />
            </button>
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-700 pt-5">
            <div className="rounded-md bg-blue-50 dark:bg-blue-900 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <BoltIcon className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">Performance tip</h3>
                  <div className="mt-2 text-sm text-blue-700 dark:text-blue-200">
                    <p>
                      Enabling fewer features can improve response time. Adjust based on your needs.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIFeaturesPanel;