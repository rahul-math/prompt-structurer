import React, { useState } from 'react';
import { Sparkles, ArrowRight, TrendingUp, CheckCircle } from 'lucide-react';
import { EnhancedPrompt } from '../types/prompt';

interface PromptEnhancerProps {
  originalPrompt: string;
  enhancedData: EnhancedPrompt | null;
  onEnhance: () => void;
  onUseEnhanced: () => void;
  isLoading?: boolean;
}

export const PromptEnhancer: React.FC<PromptEnhancerProps> = ({
  originalPrompt,
  enhancedData,
  onEnhance,
  onUseEnhanced,
  isLoading = false
}) => {
  const [showComparison, setShowComparison] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600 dark:text-emerald-400';
    if (score >= 60) return 'text-amber-600 dark:text-amber-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-emerald-100 dark:bg-emerald-900/20';
    if (score >= 60) return 'bg-amber-100 dark:bg-amber-900/20';
    return 'bg-red-100 dark:bg-red-900/20';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Prompt Enhancement
          </h3>
        </div>
        
        {enhancedData && (
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreBg(enhancedData.score)}`}>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              <span className={getScoreColor(enhancedData.score)}>
                Score: {enhancedData.score}/100
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <button
          onClick={onEnhance}
          disabled={!originalPrompt.trim() || isLoading}
          className="w-full px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-medium rounded-lg transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              Enhancing Prompt...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Enhance Prompt
            </>
          )}
        </button>

        {enhancedData && (
          <div className="space-y-4">
            {/* Improvements List */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                Improvements Applied ({enhancedData.improvements.length})
              </h4>
              <ul className="space-y-2">
                {enhancedData.improvements.map((improvement, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                    {improvement}
                  </li>
                ))}
              </ul>
            </div>

            {/* Enhanced Prompt Preview */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg p-4 border border-indigo-200 dark:border-indigo-700">
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Enhanced Prompt:</h4>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {enhancedData.enhanced}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={onUseEnhanced}
                className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <ArrowRight className="w-4 h-4" />
                Use Enhanced Prompt
              </button>
              
              <button
                onClick={() => setShowComparison(!showComparison)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-200"
              >
                {showComparison ? 'Hide' : 'Compare'}
              </button>
            </div>

            {/* Comparison View */}
            {showComparison && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="bg-red-50 dark:bg-red-900/10 rounded-lg p-4 border border-red-200 dark:border-red-800">
                  <h5 className="font-medium text-red-800 dark:text-red-300 mb-2">Original:</h5>
                  <p className="text-sm text-red-700 dark:text-red-400 leading-relaxed">
                    {enhancedData.original}
                  </p>
                </div>
                
                <div className="bg-emerald-50 dark:bg-emerald-900/10 rounded-lg p-4 border border-emerald-200 dark:border-emerald-800">
                  <h5 className="font-medium text-emerald-800 dark:text-emerald-300 mb-2">Enhanced:</h5>
                  <p className="text-sm text-emerald-700 dark:text-emerald-400 leading-relaxed">
                    {enhancedData.enhanced}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};