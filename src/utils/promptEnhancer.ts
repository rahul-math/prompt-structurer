import { EnhancedPrompt, PromptType } from '../types/prompt';
import { geminiService } from '../services/geminiService';

export class PromptEnhancer {
  static async enhancePrompt(rawPrompt: string, type: PromptType = 'general'): Promise<EnhancedPrompt> {
    try {
      return await geminiService.enhancePrompt(rawPrompt, type);
    } catch (error) {
      console.error('Error with Gemini enhancement, using fallback:', error);
      return this.fallbackEnhancement(rawPrompt, type);
    }
  }

  private static fallbackEnhancement(rawPrompt: string, type: PromptType): EnhancedPrompt {
    const improvements: string[] = [];
    let enhanced = rawPrompt.trim();
    let score = 50;

    if (!this.hasRoleDefinition(enhanced)) {
      const defaultRole = this.getDefaultRole(type);
      enhanced = `${defaultRole} ${enhanced}`;
      improvements.push('Added role/context definition');
      score += 15;
    }

    const taskImprovement = this.improveTaskClarity(enhanced, type);
    if (taskImprovement.improved) {
      enhanced = taskImprovement.text;
      improvements.push('Enhanced task clarity and specificity');
      score += 10;
    }

    const formatImprovement = this.addFormatSpecification(enhanced, type);
    if (formatImprovement.improved) {
      enhanced = formatImprovement.text;
      improvements.push('Added output format specification');
      score += 10;
    }

    return {
      original: rawPrompt,
      enhanced,
      improvements,
      score: Math.min(score, 100)
    };
  }
  private static hasRoleDefinition(prompt: string): boolean {
    const rolePatterns = [
      /you're?\s+(?:an?\s+)?/i,
      /act as\s+/i,
      /assume the role of\s+/i,
      /as\s+(?:an?\s+)?.*expert/i,
      /as\s+(?:an?\s+)?.*professional/i
    ];
    return rolePatterns.some(pattern => pattern.test(prompt));
  }

  private static getDefaultRole(type: PromptType): string {
    const roles = {
      'chatbot': 'You are a helpful and knowledgeable AI assistant.',
      'coding': 'You are an expert software developer with extensive programming knowledge.',
      'image-generation': 'You are a creative AI specialized in generating detailed image descriptions.',
      'content-writing': 'You are a professional content writer with expertise in creating engaging content.',
      'data-analysis': 'You are a data analysis expert skilled in interpreting and presenting insights.',
      'general': 'You are a knowledgeable AI assistant.'
    };
    return roles[type];
  }

  private static improveTaskClarity(prompt: string, type: PromptType): { text: string; improved: boolean } {
    let improved = false;
    let text = prompt;

    // Make tasks more specific
    if (text.includes('create') && !text.includes('specific')) {
      text = text.replace(/create\s+/i, 'create specific ');
      improved = true;
    }

    // Add action verbs if missing
    if (!this.hasActionVerb(text)) {
      const verb = this.getDefaultActionVerb(type);
      text = `${text.split('.')[0]}. ${verb} ${text.split('.').slice(1).join('.')}`.trim();
      improved = true;
    }

    // Improve vague requests
    text = text.replace(/some\s+/gi, 'several detailed ');
    text = text.replace(/a few\s+/gi, 'multiple comprehensive ');
    
    if (text !== prompt) {
      improved = true;
    }

    return { text, improved };
  }

  private static hasActionVerb(prompt: string): boolean {
    const actionVerbs = [
      'create', 'generate', 'write', 'develop', 'design', 'build', 'analyze',
      'explain', 'describe', 'list', 'provide', 'suggest', 'recommend'
    ];
    return actionVerbs.some(verb => prompt.toLowerCase().includes(verb));
  }

  private static getDefaultActionVerb(type: PromptType): string {
    const verbs = {
      'chatbot': 'Provide',
      'coding': 'Develop',
      'image-generation': 'Generate',
      'content-writing': 'Write',
      'data-analysis': 'Analyze',
      'general': 'Create'
    };
    return verbs[type];
  }

  private static addFormatSpecification(prompt: string, type: PromptType): { text: string; improved: boolean } {
    if (this.hasFormatSpecification(prompt)) {
      return { text: prompt, improved: false };
    }

    const formatSuggestions = {
      'chatbot': 'Provide your response in a clear, conversational format with numbered points where appropriate.',
      'coding': 'Include code examples with explanations and comments.',
      'image-generation': 'Provide detailed descriptions with specific visual elements, colors, and composition.',
      'content-writing': 'Structure your content with clear headings, subheadings, and well-organized paragraphs.',
      'data-analysis': 'Present findings with clear insights, supporting data, and actionable recommendations.',
      'general': 'Organize your response in a clear, structured format.'
    };

    return {
      text: `${prompt} ${formatSuggestions[type]}`,
      improved: true
    };
  }

  private static hasFormatSpecification(prompt: string): boolean {
    const formatKeywords = [
      'format', 'structure', 'organize', 'bullet points', 'numbered list',
      'table', 'json', 'markdown', 'steps', 'sections'
    ];
    return formatKeywords.some(keyword => prompt.toLowerCase().includes(keyword));
  }

  private static addConstraints(prompt: string, type: PromptType): { text: string; improved: boolean } {
    if (this.hasConstraints(prompt)) {
      return { text: prompt, improved: false };
    }

    const constraints = {
      'chatbot': 'Keep responses helpful, accurate, and appropriately detailed.',
      'coding': 'Follow best practices, include error handling, and ensure code is well-documented.',
      'image-generation': 'Focus on visual clarity, artistic composition, and detailed descriptions.',
      'content-writing': 'Maintain engaging tone, proper grammar, and target audience awareness.',
      'data-analysis': 'Base conclusions on data evidence and provide actionable insights.',
      'general': 'Ensure accuracy, clarity, and completeness in your response.'
    };

    return {
      text: `${prompt} ${constraints[type]}`,
      improved: true
    };
  }

  private static hasConstraints(prompt: string): boolean {
    const constraintKeywords = [
      'limit', 'maximum', 'minimum', 'under', 'over', 'must', 'should',
      'avoid', 'ensure', 'focus on', 'don\'t', 'no more than'
    ];
    return constraintKeywords.some(keyword => prompt.toLowerCase().includes(keyword));
  }

  private static addExamples(prompt: string, type: PromptType): { text: string; improved: boolean } {
    if (this.hasExamples(prompt) || type === 'general') {
      return { text: prompt, improved: false };
    }

    const examples = {
      'chatbot': 'For example, if asked about a technical topic, provide both basic explanation and practical applications.',
      'coding': 'For instance, include both the implementation and usage examples.',
      'image-generation': 'For example: "A serene mountain landscape at sunset with golden light reflecting on a crystal-clear lake."',
      'content-writing': 'For example, use compelling headlines, engaging introductions, and clear call-to-actions.',
      'data-analysis': 'For example, include trend analysis, correlation insights, and predictive recommendations.'
    };

    return {
      text: `${prompt} ${examples[type]}`,
      improved: true
    };
  }

  private static hasExamples(prompt: string): boolean {
    const exampleKeywords = [
      'example', 'for instance', 'such as', 'like', 'including'
    ];
    return exampleKeywords.some(keyword => prompt.toLowerCase().includes(keyword));
  }

  private static improveStructure(prompt: string): string {
    // Split into sentences and improve flow
    const sentences = prompt.split(/[.!?]+/).filter(s => s.trim());
    
    if (sentences.length <= 1) return prompt;

    // Reorganize for better flow: Role -> Task -> Format -> Constraints
    const structured = sentences.join('. ').trim();
    
    // Ensure proper punctuation
    return structured.endsWith('.') ? structured : structured + '.';
  }
}