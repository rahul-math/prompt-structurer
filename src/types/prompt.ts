export interface StructuredPrompt {
  context: string;
  task: string;
  format: string;
  constraints: string[];
  examples: Array<{
    input: string;
    output: string;
  }>;
}

export interface EnhancedPrompt {
  original: string;
  enhanced: string;
  improvements: string[];
  score: number;
}

export interface PromptTemplate {
  id: string;
  name: string;
  type: string;
  rawPrompt: string;
  enhancedPrompt?: string;
  structuredPrompt: StructuredPrompt;
  createdAt: string;
}

export type PromptType = 'chatbot' | 'coding' | 'image-generation' | 'content-writing' | 'data-analysis' | 'general';