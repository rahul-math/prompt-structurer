import React, { useState } from 'react';
import { Settings, Zap } from 'lucide-react';
import { PromptInput } from './components/PromptInput';
import { PromptEnhancer } from './components/PromptEnhancer';
import { JsonViewer } from './components/JsonViewer';
import { TemplateManager } from './components/TemplateManager';
import { ThemeToggle } from './components/ThemeToggle';
import { useTheme } from './hooks/useTheme';
import { PromptParser } from './utils/promptParser';
import { PromptEnhancer as PromptEnhancerUtil } from './utils/promptEnhancer';
import { StructuredPrompt, PromptType, PromptTemplate, EnhancedPrompt } from './types/prompt';

function App() {
  const { theme, toggleTheme } = useTheme();
  const [rawPrompt, setRawPrompt] = useState('');
  const [enhancedPromptData, setEnhancedPromptData] = useState<EnhancedPrompt | null>(null);
  const [structuredPrompt, setStructuredPrompt] = useState<StructuredPrompt | null>(null);
  const [promptType, setPromptType] = useState<PromptType>('general');
  const [isLoading, setIsLoading] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);

  const handleEnhancePrompt = async () => {
    if (!rawPrompt.trim()) return;

    setIsEnhancing(true);
    
    try {
      const enhanced = await PromptEnhancerUtil.enhancePrompt(rawPrompt, promptType);
      setEnhancedPromptData(enhanced);
    } catch (error) {
      console.error('Error enhancing prompt:', error);
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleUseEnhancedPrompt = () => {
    if (enhancedPromptData) {
      setRawPrompt(enhancedPromptData.enhanced);
      // Auto-convert the enhanced prompt  
      setTimeout(() => {
        handleConvert(enhancedPromptData.enhanced);
      }, 100);
    }
  };
  const handleConvert = async (promptToConvert?: string) => {
    const prompt = promptToConvert || rawPrompt;
    if (!prompt.trim()) return;

    setIsLoading(true);
    
    try {
      const structured = await PromptParser.parsePrompt(prompt, promptType);
      setStructuredPrompt(structured);
    } catch (error) {
      console.error('Error parsing prompt:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadTemplate = (template: PromptTemplate) => {
    setRawPrompt(template.rawPrompt);
    setPromptType(template.type as PromptType);
    setStructuredPrompt(template.structuredPrompt);
    setEnhancedPromptData(null); // Reset enhancement data when loading template
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-600 rounded-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Prompt Structurer
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Transform natural language prompts into structured JSON format
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle theme={theme} onToggle={toggleTheme} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Input and Templates */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
                Input Configuration
              </h2>
              <PromptInput
                value={rawPrompt}
                onChange={setRawPrompt}
                promptType={promptType}
                onPromptTypeChange={setPromptType}
                onConvert={handleConvert}
                isLoading={isLoading}
              />
            </div>

            <PromptEnhancer
              originalPrompt={rawPrompt}
              enhancedData={enhancedPromptData}
              onEnhance={handleEnhancePrompt}
              onUseEnhanced={handleUseEnhancedPrompt}
              isLoading={isEnhancing}
            />

            <TemplateManager
              currentPrompt={rawPrompt}
              currentStructured={structuredPrompt}
              promptType={promptType}
              onLoadTemplate={handleLoadTemplate}
            />
          </div>

          {/* Right Column - Output */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <JsonViewer data={structuredPrompt} theme={theme} />
            </div>
          </div>
        </div>

        {/* Example Section */}
        <div className="mt-12 bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Example Usage
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Input:</h4>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <code className="text-sm text-gray-800 dark:text-gray-200">
                  "Create app ideas for smart home dashboard"
                </code>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Enhanced:</h4>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <code className="text-sm text-gray-800 dark:text-gray-200">
                  "You are an expert software developer with extensive programming knowledge. Create specific app ideas for smart home dashboard. Organize your response in a clear, structured format. Ensure accuracy, clarity, and completeness in your response."
                </code>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Output:</h4>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <pre className="text-sm text-gray-800 dark:text-gray-200 overflow-x-auto">
{`{
  "context": "expert software developer with extensive programming knowledge",
  "task": "Create specific app ideas for smart home dashboard",
  "format": "clear, structured format",
  "constraints": ["Ensure accuracy, clarity, and completeness"],
  "examples": []
}`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            <p>Built with React, TypeScript, and Tailwind CSS</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;