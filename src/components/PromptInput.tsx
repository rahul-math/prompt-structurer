import React from 'react';
import { PromptType } from '../types/prompt';

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  promptType: PromptType;
  onPromptTypeChange: (type: PromptType) => void;
  onConvert: () => void;
  isLoading?: boolean;
}

const promptTypes: { value: PromptType; label: string }[] = [
  { value: 'general', label: 'General' },
  { value: 'chatbot', label: 'Chatbot' },
  { value: 'coding', label: 'Coding' },
  { value: 'image-generation', label: 'Image Generation' },
  { value: 'content-writing', label: 'Content Writing' },
  { value: 'data-analysis', label: 'Data Analysis' },
];

export const PromptInput: React.FC<PromptInputProps> = ({
  value,
  onChange,
  promptType,
  onPromptTypeChange,
  onConvert,
  isLoading = false
}) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label htmlFor="prompt-type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Prompt Type
          </label>
          <select
            id="prompt-type"
            value={promptType}
            onChange={(e) => onPromptTypeChange(e.target.value as PromptType)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-200"
          >
            {promptTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="raw-prompt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Raw Prompt
        </label>
        <textarea
          id="raw-prompt"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter your natural language prompt here..."
          rows={8}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-vertical transition-colors duration-200 font-mono text-sm"
        />
      </div>

      <button
        onClick={onConvert}
        disabled={!value.trim() || isLoading}
        className="w-full px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors duration-200 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            Converting...
          </>
        ) : (
          'Convert to Structured Format'
        )}
      </button>
    </div>
  );
};