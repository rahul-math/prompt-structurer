import React, { useState, useEffect } from 'react';
import { Save, Trash2, Upload, FileText } from 'lucide-react';
import { PromptTemplate, StructuredPrompt } from '../types/prompt';
import { StorageManager } from '../utils/storage';

interface TemplateManagerProps {
  currentPrompt: string;
  currentStructured: StructuredPrompt | null;
  promptType: string;
  onLoadTemplate: (template: PromptTemplate) => void;
}

export const TemplateManager: React.FC<TemplateManagerProps> = ({
  currentPrompt,
  currentStructured,
  promptType,
  onLoadTemplate
}) => {
  const [templates, setTemplates] = useState<PromptTemplate[]>([]);
  const [templateName, setTemplateName] = useState('');
  const [showSaveForm, setShowSaveForm] = useState(false);

  useEffect(() => {
    setTemplates(StorageManager.getTemplates());
  }, []);

  const saveTemplate = () => {
    if (!templateName.trim() || !currentPrompt || !currentStructured) return;

    const template: PromptTemplate = {
      id: Date.now().toString(),
      name: templateName.trim(),
      type: promptType,
      rawPrompt: currentPrompt,
      enhancedPrompt: undefined, // Could store enhanced version if available
      structuredPrompt: currentStructured,
      createdAt: new Date().toISOString()
    };

    StorageManager.saveTemplate(template);
    setTemplates(StorageManager.getTemplates());
    setTemplateName('');
    setShowSaveForm(false);
  };

  const deleteTemplate = (id: string) => {
    StorageManager.deleteTemplate(id);
    setTemplates(StorageManager.getTemplates());
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Template Manager
      </h3>

      {/* Save Current Template */}
      <div className="mb-6">
        {!showSaveForm ? (
          <button
            onClick={() => setShowSaveForm(true)}
            disabled={!currentPrompt || !currentStructured}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white rounded-lg transition-colors duration-200 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            Save Current as Template
          </button>
        ) : (
          <div className="flex gap-2">
            <input
              type="text"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="Template name..."
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <button
              onClick={saveTemplate}
              disabled={!templateName.trim()}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white rounded-lg transition-colors duration-200"
            >
              Save
            </button>
            <button
              onClick={() => {
                setShowSaveForm(false);
                setTemplateName('');
              }}
              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Saved Templates */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900 dark:text-gray-100">
          Saved Templates ({templates.length})
        </h4>
        
        {templates.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            No templates saved yet. Save your current prompt to get started.
          </p>
        ) : (
          <div className="max-h-64 overflow-y-auto space-y-2">
            {templates.map((template) => (
              <div
                key={template.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                    <h5 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                      {template.name}
                    </h5>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {template.type} • {formatDate(template.createdAt)}
                  </p>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => onLoadTemplate(template)}
                    className="p-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors duration-200"
                    title="Load template"
                  >
                    <Upload className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteTemplate(template.id)}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
                    title="Delete template"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};